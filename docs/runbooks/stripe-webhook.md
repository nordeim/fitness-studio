# Runbook: Stripe Webhook

> Operational guide for Stripe webhook handling.
> Covers local testing, signature verification, and event processing.

---

## Architecture

```
Stripe → POST /api/stripe/webhook
  → Read raw body (request.text())
  → Get stripe-signature header
  → Verify signature: stripe.webhooks.constructEvent(body, sig, secret)
  → Switch on event.type:
    - checkout.session.completed → log session + customer + tier
    - customer.subscription.updated → log status + period end + cancel flag
    - customer.subscription.deleted → log cancellation
  → Return { received: true }
```

**Key files:**
- `src/app/api/stripe/webhook/route.ts` — webhook handler
- `src/lib/stripe.ts` — Stripe client wrapper
- `src/app/api/checkout/route.ts` — Checkout Session creation
- `src/app/api/stripe/portal/route.ts` — Customer Portal (Phase 9 wires auth)
- `src/features/memberships/data.ts` — 3 tiers + drop-in pack

---

## Local Testing

### 1. Start the dev server

```bash
pnpm dev
```

### 2. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux (download from https://github.com/stripe/stripe-cli/releases)
```

### 3. Forward webhooks to localhost

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

This outputs a webhook signing secret (`whsec_...`). Add it to `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...  # from stripe listen output
```

### 4. Trigger test events

```bash
# Checkout completed
stripe trigger checkout.session.completed

# Subscription updated
stripe trigger customer.subscription.updated

# Subscription deleted
stripe trigger customer.subscription.deleted
```

### 5. Verify in server console

Each event should log to the server console:
```
[stripe/webhook] checkout.session.completed:
  Session ID: cs_test_...
  Customer: cus_...
  Subscription: sub_...
  Tier: forge_plus
```

---

## Common Issues

### 1. Webhook returns 503 "Stripe webhook not configured"

**Diagnosis:** `STRIPE_WEBHOOK_SECRET` is not set or is a placeholder.

**Fix:** Set `STRIPE_WEBHOOK_SECRET` in `.env.local` with the value from `stripe listen --forward-to ...`.

### 2. Webhook returns 400 "Invalid signature"

**Diagnosis:** The signature verification failed. Common causes:
- The `STRIPE_WEBHOOK_SECRET` doesn't match the signing key for the webhook endpoint
- The raw body was modified before verification (e.g., `request.json()` was called instead of `request.text()`)
- The `stripe-signature` header is missing

**Fix:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches the Stripe Dashboard webhook endpoint signing secret (or the `stripe listen` output)
2. Ensure the route reads raw body via `request.text()` — do NOT use `request.json()` before signature verification
3. Check that Stripe is sending to the correct URL (`/api/stripe/webhook`)

### 3. Webhook returns 400 "Missing stripe-signature header"

**Diagnosis:** The request doesn't have the `stripe-signature` header. This means the request is not from Stripe (or Stripe CLI is misconfigured).

**Fix:** Verify the webhook endpoint URL in the Stripe Dashboard. Ensure `stripe listen` is forwarding to the correct URL.

### 4. Duplicate events processed

**Symptom:** The same checkout event appears twice in the server logs.

**Diagnosis:** Stripe retries webhooks if it doesn't receive a 2xx response within 30 seconds. If the handler is slow (e.g., DB write), Stripe may retry before the first request completes.

**Fix (Phase 13):** Add a `stripe_event_id` column to the `subscriptions` table. Before processing an event, check if the event ID has already been processed. If yes, return `{ received: true }` without re-processing.

**Current state:** The webhook handler only logs events (no DB writes), so duplicate events are harmless. When Phase 9 wires DB writes, this becomes critical.

### 5. Checkout Session creation returns NOT_CONFIGURED

**Symptom:** `POST /api/checkout` returns `{ success: false, code: 'NOT_CONFIGURED', message: 'Stripe is not configured...' }`

**Diagnosis:** `STRIPE_SECRET_KEY` is not set or is a placeholder.

**Fix:** Set `STRIPE_SECRET_KEY` in `.env.local` with a real Stripe key (`sk_test_...` for test mode, `sk_live_...` for production).

### 6. Checkout returns NOT_CONFIGURED for price ID

**Symptom:** Stripe is configured, but checkout returns "Stripe price ID for 'forge' is not set."

**Diagnosis:** The membership tiers in `src/features/memberships/data.ts` have `stripePriceId: null`. The price IDs need to be set after creating Stripe products.

**Fix:**
1. Create products in the Stripe Dashboard (Forge, Forge+, Forge Private, Drop-In Pack)
2. Create recurring prices for each product
3. Update `src/features/memberships/data.ts` with the `price_...` IDs
4. Rebuild

---

## Production Setup

### 1. Create Stripe products

In the Stripe Dashboard:
1. Products → Add product
2. Name: "Forge", Description: "Foundation membership", Pricing: $149/month recurring
3. Repeat for Forge+ ($249/month), Forge Private ($599/month)
4. Create a one-time product: "Drop-In Pack" ($120)

### 2. Update tier data

Set `stripePriceId` in `src/features/memberships/data.ts` for each tier.

### 3. Configure webhook endpoint

In the Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy the signing secret → set as `STRIPE_WEBHOOK_SECRET` in production env vars

### 4. Verify

After deployment:
```bash
# Trigger a test checkout
curl -X POST https://yourdomain.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"tier":"forge_plus","priceId":"price_..."}'

# Follow the redirect URL to Stripe Checkout
# Complete a test payment
# Verify the webhook event appears in server logs
```
