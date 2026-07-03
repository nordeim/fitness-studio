import { NextResponse } from 'next/server';
import { isStripeConfigured } from '@/lib/stripe';

/**
 * GET /api/stripe/portal
 *
 * Creates a Stripe Customer Portal session for the logged-in user to
 * manage their subscription (upgrade, downgrade, cancel, update payment).
 *
 * Phase 9 will add auth check — for now returns 401 if no session.
 *
 * Returns:
 *  - 200: { success: true, code: 'SUCCESS', url }
 *  - 401: { success: false, code: 'UNAUTHORIZED', message }
 *  - 503: { success: false, code: 'NOT_CONFIGURED', message }
 *
 * Reference: Skills KB §12 (Customer Portal pattern).
 */
export async function GET() {
  // 1. Check Stripe is configured
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        success: false,
        code: 'NOT_CONFIGURED',
        message: 'Stripe is not configured.',
      },
      { status: 503 },
    );
  }

  // 2. Phase 9: auth check — get session.user.stripeCustomerId
  // For now, return 401
  // const session = await auth();
  // if (!session?.user) return 401;
  // const stripeCustomerId = session.user.stripeCustomerId;
  // if (!stripeCustomerId) return 404 (no subscription to manage)

  return NextResponse.json(
    {
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Authentication required. Phase 9 will wire auth + customer portal.',
    },
    { status: 401 },
  );
}

// The actual portal creation (wired in Phase 9):
//
// export async function GET() {
//   const stripe = getStripe();
//   if (!stripe) return 503;
//
//   const session = await auth();
//   if (!session?.user) return 401;
//
//   const stripeCustomerId = session.user.stripeCustomerId;
//   if (!stripeCustomerId) return 404;
//
//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: stripeCustomerId,
//     return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
//   });
//
//   return NextResponse.json({ url: portalSession.url });
// }
