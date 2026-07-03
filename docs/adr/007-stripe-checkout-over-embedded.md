# ADR-007: Stripe Checkout over Embedded Form

**Status:** Accepted
**Date:** 2026-07-02 (Phase 7)
**Decider:** Super Z

## Context

The project needs to accept recurring membership payments (3 tiers) + one-time drop-in pack purchases. Two Stripe integration approaches:

1. **Stripe Checkout** — redirect to Stripe-hosted payment page, Stripe handles all UI + PCI compliance
2. **Stripe Elements (embedded)** — embed payment form in our UI, more control but more PCI scope

## Decision

Use **Stripe Checkout** (redirect model) over embedded Stripe Elements.

## Rationale

1. **PCI compliance** — Checkout keeps all card data on Stripe's domain. Our server never touches card numbers. PCI-DSS SAQ-A (lowest scope).
2. **Faster implementation** — one API call (`stripe.checkout.sessions.create()`) + redirect. No client-side Stripe.js + Elements setup.
3. **Mobile-optimized** — Stripe Checkout page is mobile-first, tested across devices.
4. **Apple Pay / Google Pay** — Checkout supports wallet payments out of the box.
5. **Customer Portal** — Stripe hosts the subscription management portal. One API call to create a portal session.
6. **Webhook reliability** — Stripe retries failed webhooks for 3 days. Our webhook handler just needs to be idempotent.

## Implementation

- **Checkout mode:** `subscription` for membership tiers, `payment` for drop-in pack
- **Success URL:** `/booking/confirm?checkout=success`
- **Cancel URL:** `/#memberships`
- **Idempotency:** `crypto.randomUUID()` passed as `idempotencyKey` to prevent duplicate sessions on double-click
- **Webhook:** `POST /api/stripe/webhook` with signature verification (raw body + `stripe-signature` header)
- **Events handled:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Consequences

**Positive:**
- Minimal PCI scope (SAQ-A)
- Fast implementation (1 API call + redirect)
- Wallet payment support out of the box
- Customer Portal for self-service subscription management
- Webhook retries (3 days) with idempotency

**Negative:**
- User leaves our domain for payment (branding break)
- Less control over checkout UI (Stripe's design, not ours)
- Can't pre-fill billing address from our DB (Stripe collects it)
- Webhook must be publicly accessible (Inngest dev server doesn't work for webhooks — need Stripe CLI for local testing)
