import { NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { CheckoutRequestSchema } from '@/features/memberships/domain/schemas';
import { MEMBERSHIP_TIERS, DROP_IN_PACK } from '@/features/memberships/data';

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

  // 5. Create Checkout Session
  const stripe = getStripe()!;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/booking/confirm?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/#memberships`,
      metadata: {
        tier,
        product_name: productName,
      },
      // Phase 9: pass customer_email from session.user.email when auth is wired
      // customer_email: session.user.email,
    });

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
