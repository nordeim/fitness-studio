import Stripe from 'stripe';

/**
 * IRONFORGE — Stripe client.
 *
 * Uses process.env directly (with null fallback) instead of the Zod-validated
 * env module, because:
 *  - The Stripe client is infrastructure code (Layer 4)
 *  - It needs to gracefully degrade when env vars are missing (dev without
 *    .env.local, build context, test context)
 *  - The env module throws in dev without .env.local
 *
 * In production with real STRIPE_SECRET_KEY, this returns a real Stripe client.
 * In dev/build/test, this returns null — API routes check for null and return
 * a clear error instead of crashing.
 *
 * Reference: Skills KB §12 (Stripe patterns from nextjs16-react19-next-auth5-drizzle-orm).
 */

function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === 'sk_test_placeholder' || key.startsWith('sk_test_xxx')) {
    return null;
  }
  return key;
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = getStripeSecretKey();
  if (!key) return null;

  if (!stripeClient) {
    // Stripe v22 — omit apiVersion to use the SDK's default (pinned at install time)
    stripeClient = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return getStripe() !== null;
}

export function getStripeWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || secret === 'whsec_placeholder' || secret.startsWith('whsec_xxx')) {
    return null;
  }
  return secret;
}

export function getPublishableKey(): string | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key || key === 'pk_test_placeholder' || key.startsWith('pk_test_xxx')) {
    return null;
  }
  return key;
}
