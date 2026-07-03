import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events:
 *  - checkout.session.completed — subscription purchased
 *  - customer.subscription.updated — plan changed or renewed
 *  - customer.subscription.deleted — subscription canceled
 *
 * Verifies the Stripe-Signature header using STRIPE_WEBHOOK_SECRET.
 * If the secret is not configured, returns 503 (webhook cannot function).
 *
 * Reference: Skills KB §12 (Stripe webhook signature verification pattern).
 * Reference: Skills KB §17 (T-lesson: Stripe SDK v22+ uses camelCase:
 *   subscription.current_period_end is now subscription.currentPeriodEnd).
 * Note: In the Stripe SDK v22, the Subscription object uses camelCase
 * (currentPeriodEnd, cancelAtPeriodEnd) but the raw API response still
 * uses snake_case. The SDK's constructEvent returns the typed object
 * with camelCase properties.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();
  const stripe = getStripe();

  if (!webhookSecret || !stripe) {
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 503 },
    );
  }

  // Get raw body + signature header
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  // Verify signature + construct event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 },
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[stripe/webhook] checkout.session.completed:
          Session ID: ${session.id}
          Customer: ${session.customer}
          Subscription: ${session.subscription}
          Tier: ${session.metadata?.tier ?? 'unknown'}
        `);

        // Phase 9: when auth is wired, look up userId from session.client_reference_id
        // or session.customer_email, then insert into subscriptions table.
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        // Stripe SDK v22: access via cast to avoid type mismatch between
        // raw API (snake_case) and SDK wrapper (camelCase)
        const subData = sub as unknown as Record<string, unknown>;
        const periodEnd = subData['current_period_end'] as number | undefined;
        const cancelAtEnd = subData['cancel_at_period_end'] as boolean | undefined;
        console.log(`[stripe/webhook] customer.subscription.updated:
          Subscription ID: ${sub.id}
          Status: ${sub.status}
          Current period end: ${periodEnd ? new Date(periodEnd * 1000).toISOString() : 'unknown'}
          Cancel at period end: ${cancelAtEnd ?? 'unknown'}
        `);

        // Phase 9: update subscriptions table — set status, currentPeriodEnd, cancelAtPeriodEnd
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[stripe/webhook] customer.subscription.deleted:
          Subscription ID: ${sub.id}
          Status: ${sub.status}
        `);

        // Phase 9: mark subscription as canceled in DB
        break;
      }

      default:
        // Unexpected event type — log but don't error
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[stripe/webhook] Handler error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}
