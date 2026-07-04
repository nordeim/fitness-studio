import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events:
 *  - checkout.session.completed — subscription purchased → insert into subscriptions table
 *  - customer.subscription.updated — plan changed/renewed → update subscriptions row
 *  - customer.subscription.deleted — subscription canceled → mark as canceled
 *
 * Verifies the Stripe-Signature header using STRIPE_WEBHOOK_SECRET.
 * If the secret is not configured, returns 503 (webhook cannot function).
 *
 * F-M3 fix: Implemented the 3 handlers (previously stubbed with // Phase 9 comments).
 * F-M3/L5 fix: Removed the unsafe type cast — Stripe SDK v22 uses snake_case
 * field names matching the raw API (verified against Subscriptions.d.ts):
 *   - Subscription.cancel_at_period_end (boolean)
 *   - SubscriptionItem.current_period_end (number) — access via sub.items.data[0]
 * The previous header comment claiming "SDK v22 uses camelCase" was incorrect.
 *
 * Idempotency: checkout.session.completed uses onConflictDoNothing on
 * stripeSubscriptionId (UNIQUE) — safe for Stripe webhook retries.
 *
 * userId resolution: checkout is anonymous (no clientReferenceId set), so the
 * webhook looks up userId by customer_details.email. If no user is found, the
 * insert is skipped with a warning (the webhook still returns 200 so Stripe
 * doesn't retry indefinitely).
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  const stripe = getStripe();

  if (!webhookSecret || !stripe) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 503 });
  }

  // Get raw body + signature header
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Verify signature + construct event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event);
        break;
      }

      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event);
        break;
      }

      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event);
        break;
      }

      default:
        // Unexpected event type — log but don't error
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// ── Handlers ──

async function handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;
  const tier = session.metadata?.tier ?? 'unknown';
  const stripePriceId = (session.metadata?.priceId as string | undefined) ?? '';
  const customerEmail = session.customer_details?.email ?? null;
  const stripeCustomerId =
    typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? '');
  const stripeSubscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : (session.subscription?.id ?? '');

  console.log(
    `[stripe/webhook] checkout.session.completed: Session=${session.id} Customer=${stripeCustomerId} Sub=${stripeSubscriptionId} Tier=${tier}`,
  );

  if (!customerEmail || !stripeSubscriptionId) {
    console.warn('[stripe/webhook] Missing customerEmail or subscriptionId — skipping DB insert');
    return;
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { subscriptions, users } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    // Look up userId by email (checkout is anonymous — no clientReferenceId)
    const [user] = await db.select().from(users).where(eq(users.email, customerEmail)).limit(1);

    if (!user) {
      console.warn(
        `[stripe/webhook] No user found for email ${customerEmail} — skipping DB insert`,
      );
      return;
    }

    // Insert subscription (idempotent via onConflictDoNothing on stripeSubscriptionId)
    await db
      .insert(subscriptions)
      .values({
        userId: user.id,
        stripeCustomerId,
        stripeSubscriptionId,
        stripePriceId,
        tier,
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      })
      .onConflictDoNothing({ target: subscriptions.stripeSubscriptionId });

    console.log(`[stripe/webhook] Subscription recorded for user ${user.id}`);
  } catch (err) {
    console.error('[stripe/webhook] DB error on checkout.session.completed:', err);
    throw err; // Return 500 so Stripe retries
  }
}

async function handleSubscriptionUpdated(event: Stripe.Event): Promise<void> {
  const sub = event.data.object as Stripe.Subscription;
  // Stripe SDK v22: cancel_at_period_end is on Subscription (snake_case).
  // current_period_end is on SubscriptionItem, NOT Subscription — access via items.data[0].
  const cancelAtEnd = sub.cancel_at_period_end;
  const periodEnd = sub.items?.data?.[0]?.current_period_end;

  console.log(`[stripe/webhook] subscription.updated: Sub=${sub.id} Status=${sub.status}`);

  try {
    const { db } = await import('@/lib/db/client');
    const { subscriptions } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    // Map Stripe status to our enum
    const statusMap: Record<
      string,
      'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
    > = {
      active: 'active',
      past_due: 'past_due',
      canceled: 'canceled',
      incomplete: 'incomplete',
      trialing: 'trialing',
    };
    const mappedStatus = statusMap[sub.status] ?? 'incomplete';

    await db
      .update(subscriptions)
      .set({
        status: mappedStatus,
        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        cancelAtPeriodEnd: cancelAtEnd ?? false,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, sub.id));
  } catch (err) {
    console.error('[stripe/webhook] DB error on subscription.updated:', err);
    throw err;
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const sub = event.data.object as Stripe.Subscription;
  console.log(`[stripe/webhook] subscription.deleted: Sub=${sub.id}`);

  try {
    const { db } = await import('@/lib/db/client');
    const { subscriptions } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, sub.id));
  } catch (err) {
    console.error('[stripe/webhook] DB error on subscription.deleted:', err);
    throw err;
  }
}
