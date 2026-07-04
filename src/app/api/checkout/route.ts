import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { headers } from 'next/headers';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { CheckoutRequestSchema } from '@/features/memberships/domain/schemas';
import { MEMBERSHIP_TIERS, DROP_IN_PACK } from '@/features/memberships/data';
import { rateLimit } from '@/lib/ratelimit';

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for a membership tier or drop-in pack.
 *
 * Body: { priceId: string, tier: 'forge' | 'forge_plus' | 'forge_private' | 'drop_in' }
 *
 * Returns:
 *  - 200: { success: true, code: 'SUCCESS', url, sessionId }
 *  - 400: { success: false, code: 'VALIDATION', message }
 *  - 503: { success: false, code: 'NOT_CONFIGURED', message } — Stripe not configured
 *
 * Phase 9 will add auth check (member must be logged in to subscribe).
 * For now, checkout is anonymous — Stripe collects email in the Checkout form.
 *
 * Reference: Skills KB §12 (Stripe Checkout pattern).
 */
export async function POST(request: Request) {
  // P2 fix (OWASP A04): Rate limit checkout — 10 per minute per IP
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  const { success: rateLimitOk } = await rateLimit(ip, 'checkout', 10, '1 m');
  if (!rateLimitOk) {
    return NextResponse.json(
      { success: false, code: 'RATE_LIMITED', message: 'Too many requests. Please wait and try again.' },
      { status: 429 },
    );
  }

  // 1. Check Stripe is configured
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        success: false,
        code: 'NOT_CONFIGURED',
        message:
          'Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local to enable checkout.',
      },
      { status: 503 },
    );
  }

  // 2. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, code: 'VALIDATION', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = CheckoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      {
        success: false,
        code: 'VALIDATION',
        message: firstError?.message ?? 'Invalid input',
      },
      { status: 400 },
    );
  }

  const { tier } = parsed.data;

  // 3. Find the tier/pack and its Stripe price ID
  let stripePriceId: string | null = null;
  let productName: string = '';
  let isRecurring = true;

  if (tier === 'drop_in') {
    stripePriceId = DROP_IN_PACK.stripePriceId;
    productName = DROP_IN_PACK.name;
    isRecurring = false;
  } else {
    const tierData = MEMBERSHIP_TIERS.find((t) => t.id === tier);
    if (!tierData) {
      return NextResponse.json(
        { success: false, code: 'VALIDATION', message: `Unknown tier: ${tier}` },
        { status: 400 },
      );
    }
    stripePriceId = tierData.stripePriceId;
    productName = tierData.name;
  }

  // 4. Check that the Stripe price ID is configured
  if (!stripePriceId) {
    return NextResponse.json(
      {
        success: false,
        code: 'NOT_CONFIGURED',
        message: `Stripe price ID for "${tier}" is not set. Create the product in Stripe and update the tier data.`,
      },
      { status: 503 },
    );
  }

  // 5. Create Checkout Session with idempotency key (P2 fix — OWASP A04)
  const stripe = getStripe()!;
  const idempotencyKey = randomUUID();
  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: isRecurring ? 'subscription' : 'payment',
        line_items: [{ price: stripePriceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/booking/confirm?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/#memberships`,
        metadata: {
          tier,
          product_name: productName,
          // F-M3 fix: priceId is needed by the webhook to record in the subscriptions table
          priceId: stripePriceId,
        },
      },
      { idempotencyKey },
    );

    return NextResponse.json({
      success: true,
      code: 'SUCCESS',
      message: 'Checkout session created',
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('[api/checkout] Stripe error:', err);
    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL',
        message: 'Failed to create checkout session',
      },
      { status: 500 },
    );
  }
}
