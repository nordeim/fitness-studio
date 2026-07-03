# ADR-005: Inngest over BullMQ for Job Queue

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The project needs a job queue for background processing:
- Trial request notifications (email coach + confirm member + schedule followup)
- AI asset generation (Replicate SDXL → R2 upload → DB update)
- Stripe webhook side effects (subscription lifecycle)

Two options:
1. **BullMQ** — Redis-based job queue, self-hosted, requires a running Redis instance
2. **Inngest** — cloud-native job queue with step functions, no infrastructure to manage, free tier for development

## Decision

Use **Inngest** over BullMQ.

## Rationale

1. **No infrastructure** — Inngest Cloud handles the queue, retries, and scheduling. No Redis instance to manage, monitor, or scale.
2. **Step functions** — Inngest's `step.run()` pattern is ideal for multi-step pipelines (generate → upload → notify) with per-step retry and observability.
3. **Dev server** — Inngest Dev UI (`localhost:8288`) provides local testing without cloud credentials.
4. **Already in `package.json`** — `inngest ^4.11.0` is declared.
5. **Vercel-compatible** — Inngest works with serverless deployments where long-lived Redis connections are problematic.

## Consequences

**Positive:**
- Zero infrastructure management
- Step function pattern with built-in retry + observability
- Dev UI for local testing
- Serverless-friendly (no persistent connections)

**Negative:**
- Vendor lock-in — Inngest Cloud is a managed service
- Free tier limits (adequate for a single-studio site)
- Eventual consistency — events are async, not real-time
- In dev without `INNGEST_SIGNING_KEY`, signature verification is disabled (gated behind `NODE_ENV !== 'production'` in Phase 10)

**Inngest v4 breaking change:**
- `createFunction` signature changed: trigger is now in the config object (`triggers: [{ event: '...' }]`), NOT a separate second argument. This was discovered and fixed in Phase 6.
