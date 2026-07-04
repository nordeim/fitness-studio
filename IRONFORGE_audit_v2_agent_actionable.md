# IRONFORGE Audit v2 — Agent-Actionable Findings

> **Source:** Converted from `/home/z/my-project/download/IRONFORGE_audit_report_v2.pdf` (16 pages)
> **Audit date:** 2026-07-04
> **Subject commit:** `6ede5fe` (HEAD of `main`)
> **Live site:** https://ironforge.jesspete.shop/
> **Purpose:** Machine-actionable finding spec for the remediation agent. Each finding is self-contained with: ID, severity, evidence (file:line), root cause, optimal fix, files to touch, tests to write, validation steps.
> **Quality gate baseline (pre-remediation):** typecheck ✅ · lint ✅ · 183/183 tests ✅ · 0 vulnerabilities ✅

---

## Finding Index

| ID   | Severity    | Title                                                                                            | Status             |
| ---- | ----------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| F-D1 | 🔴 Critical | CSP `'unsafe-eval'` still present in code + live (claimed fixed in 5 docs)                       | Open               |
| F-S1 | 🟠 High     | Real `AUTH_SECRET` committed to git in `.env.local` + `.env.docker`                              | Open               |
| F-S2 | 🟠 High     | `pnpm test:e2e:live` broken + `audit:security`/`audit:a11y` scripts reference non-existent files | Open               |
| F-M1 | 🟡 Medium   | Live site runs in dev mode (`pnpm dev` not `pnpm start`)                                         | Open (operational) |
| F-M2 | 🟡 Medium   | Sitemap + robots publish `http://localhost:3000` URLs                                            | Open (operational) |
| F-M3 | 🟡 Medium   | Stripe webhook only logs events — doesn't write to `subscriptions` table                         | Open               |
| F-M4 | 🟡 Medium   | Inngest `trial-requested` function is stubbed with `console.log` (no real email)                 | Open               |
| F-M5 | 🟡 Medium   | `ratelimit.ts` imports `env` from `@/lib/env` — contradicts graceful-degradation pattern         | Open               |

**Scope of this remediation:** F-D1, F-S1, F-S2, F-M3, F-M4, F-M5 (code-fixable).
**Out of scope (operational, requires deployment env access):** F-M1, F-M2 — these need deployment env changes, not code changes. Will be documented but not fixed.

---

## F-D1 — CSP `'unsafe-eval'` Still Present (Critical)

### Evidence

- **Code:** `next.config.ts:30`
  ```ts
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  ```
- **Live CSP header:** `content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ...`
- **Self-contradicting comment:** `next.config.ts:24` says `'unsafe-eval' is intentionally absent` — directly contradicts line 30.
- **Doc contradiction (5 docs claim fix was applied):**
  - `CLAUDE.md:282,300,322` — "Fix applied: removed `'unsafe-eval'`, fixed the comment"
  - `AGENTS.md:116,157` — "CSP: NO `'unsafe-eval'` (H1 fix)"
  - `README.md:371,430` — "CSP: ... (NO `'unsafe-eval'`)"
  - `fitness-studio_SKILL.md:642-646,857,885,1345` — "Fix: Removed `'unsafe-eval'` from `CSP_POLICY`"
  - `docs/adr/002-csp-unsafe-inline.md` — "'unsafe-eval' ... It was removed in Phase 0"

### Root Cause

The H1 fix was documented across 5 files but never actually applied to `next.config.ts`. The `status_3.md` worklog confirms the user "explicitly excluded the critical finding about next.config.ts ('unsafe-eval' in CSP)" in a prior session — but all subsequent documentation (CLAUDE.md lesson #3, AGENTS.md, README.md lesson #3, SKILL.md §9, ADR-002) presents it as a completed fix. This is a documentation/implementation contradiction.

### Optimal Fix

1. **Code:** Remove `'unsafe-eval'` from `next.config.ts:30`. The string becomes:
   ```ts
   "script-src 'self' 'unsafe-inline'",
   ```
2. **Test (TDD):** Add a unit test in `src/tests/unit/csp-policy.test.ts` that imports the CSP string and asserts it does NOT contain `'unsafe-eval'`. This prevents regression.
3. **Docs:** Reconcile all 5 docs — they already claim the fix was applied, so after the code fix lands, the docs become accurate. No doc changes needed (the docs are correct; the code was wrong).

### Files to Modify

- `next.config.ts` — remove `'unsafe-eval'` from line 30
- `src/tests/unit/csp-policy.test.ts` — NEW file, regression test

### Tests to Write (TDD — RED first)

```ts
// src/tests/unit/csp-policy.test.ts
import { describe, it, expect } from 'vitest';

describe('CSP Policy', () => {
  it('must NOT contain unsafe-eval (H1 fix regression guard)', () => {
    // Read the CSP_POLICY from next.config.ts
    // Option A: export CSP_POLICY from next.config.ts for testability
    // Option B: read the file content and assert
    const csp = getCspPolicy(); // helper to extract
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('must contain unsafe-inline for script-src (Next.js App Router requirement)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  });

  it('must contain frame-ancestors none (clickjacking defense)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
```

### Validation Steps

1. `pnpm test` — new CSP test passes (RED → GREEN)
2. `pnpm typecheck` — clean
3. `pnpm lint` — clean
4. `pnpm build` — clean (verifies Next.js 16 production build doesn't need `'unsafe-eval'`)
5. After deploy: `curl -I https://ironforge.jesspete.shop/ | grep content-security-policy` should NOT contain `unsafe-eval`

---

## F-S1 — Real AUTH_SECRET Committed to Git (High)

### Evidence

- **`.env.local:25` (committed):** `AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=`
- **`.env.docker:25` (committed):** `AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=` (identical)
- **`git ls-files | grep -E "^\.env"` confirms both files are tracked**
- **`.gitignore:42`:** `!.env.example` — un-ignores `.env.example`, but `.env.example` does NOT exist
- **Docs reference `.env.example` 4 times:** `CLAUDE.md:98,260`, `README.md:168,235` — `cp .env.example .env.local` would fail

### Root Cause

The project used `.env.local` (Next.js's runtime env filename) as the template file instead of `.env.example` (the conventional template filename). A real `AUTH_SECRET` was generated for local dev and committed. `.gitignore` excludes `.env*` but un-ignores `.env.example` — so `.env.local` was either force-added or committed before the `.gitignore` pattern existed.

### Optimal Fix

1. **Rotate the secret** (out of scope for code — user must regenerate for production).
2. **Rename `.env.local` → `.env.example`** and replace the real `AUTH_SECRET` with a placeholder.
3. **Rename `.env.docker` → `.env.docker.example`** (or delete — it's essentially a duplicate of `.env.local`).
4. **Untrack from git:** `git rm --cached .env.local .env.docker` (after renaming).
5. **Verify `.gitignore`** already covers `.env*` with `!.env.example` exception (it does).
6. **Doc alignment:** `CLAUDE.md:98` and `README.md:168` say `cp .env.example .env.local` — after the rename, this command works.

### Files to Modify

- `git mv .env.local .env.example` — rename (preserves history)
- Replace `AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=` → `AUTH_SECRET=replace-with-openssl-rand-base64-32`
- Replace any other real-looking secrets in `.env.example` with placeholders (verify each line)
- Delete `.env.docker` (duplicate) OR rename to `.env.docker.example` with placeholders
- `git rm --cached` the old filenames if they remain tracked

### Tests to Write (TDD)

No unit test applies (this is a config/repo-hygiene fix). Validation is via:

```bash
git ls-files | grep -E "^\.env"  # should return only .env.example
grep -E "^(AUTH_SECRET|STRIPE_SECRET_KEY|DATABASE_URL)=" .env.example  # should show placeholders, not real values
```

### Validation Steps

1. `git ls-files | grep -E "^\.env"` — returns only `.env.example`
2. `grep "AUTH_SECRET" .env.example` — shows placeholder, not the real secret
3. `cp .env.example .env.local` — works (file exists)
4. `pnpm test` — still 183/183 (no test regression)
5. `pnpm typecheck && pnpm lint` — clean

---

## F-S2 — Broken `test:e2e:live` + Missing Audit Scripts (High)

### Evidence

- **`playwright-live.config.ts:22`:** `testMatch: /live-site\.spec\.ts/` — no `live-site.spec.ts` file exists in `src/tests/e2e/`
- **Running `pnpm test:e2e:live`:** returns "No tests found" (verified in audit Phase C)
- **`package.json:30-31`:**
  ```json
  "audit:security": "tsx scripts/security-audit.ts",
  "audit:a11y": "tsx scripts/accessibility-audit.ts"
  ```
- **`ls scripts/`:** only `smoke-test.sh` + `init-extensions.sql` — neither `security-audit.ts` nor `accessibility-audit.ts` exist
- **`README.md:253`:** documents `pnpm test:e2e:live` as a working command

### Root Cause

- The live E2E spec was planned (config file exists) but never written.
- The audit scripts were planned (package.json entries exist) but never implemented.

### Optimal Fix

**Decision: Remove the broken entries** (preferred over creating new files, per the "Simplicity First" rule — don't add speculative features).

1. **Delete `playwright-live.config.ts`** (the regular `playwright.config.ts` + `IRONFORGE_LIVE_URL` env var override is sufficient for live testing, as demonstrated in the audit).
2. **Remove `test:e2e:live` script** from `package.json`.
3. **Remove `audit:security` and `audit:a11y` scripts** from `package.json`.
4. **Update `README.md:253`** — remove the `pnpm test:e2e:live` line.
5. **Update `CLAUDE.md`** if it references these commands (check).

### Files to Modify

- Delete `playwright-live.config.ts`
- `package.json` — remove 3 script entries (`test:e2e:live`, `audit:security`, `audit:a11y`)
- `README.md` — remove the `pnpm test:e2e:live` documentation line

### Tests to Write (TDD)

No unit test applies. Validation:

```bash
pnpm test:e2e:live  # should now report "Command not found" (script removed)
pnpm audit:security  # should now report "Command not found"
ls playwright-live.config.ts  # should not exist
```

### Validation Steps

1. `ls playwright-live.config.ts` — file not found
2. `grep "test:e2e:live\|audit:security\|audit:a11y" package.json` — no matches
3. `pnpm test` — still 183/183
4. `pnpm lint && pnpm typecheck` — clean

---

## F-M1 — Live Site Runs in Dev Mode (Medium, Operational)

### Evidence

- **`agent-browser console` on live site:** `[HMR] connected` + `Download the React DevTools for a better development experience`
- **`curl -I` header:** `cache-control: no-cache, must-revalidate` (dev-mode indicator)
- **TTFB:** 262ms (vs expected <100ms in production)

### Root Cause

Deployment pipeline runs `pnpm dev` instead of `docker compose -f docker-compose.prod.yml up -d` (or equivalent `pnpm build && pnpm start`).

### Optimal Fix

**This is an OPERATIONAL fix — NOT code-fixable.** Requires deployment env access.

- Action: Deploy with the production Dockerfile. The Dockerfile is correct (`pnpm build` → `pnpm start` via `CMD ["pnpm", "start"]`).
- Verification: `curl -I` should return hashed chunk names, not `no-cache`. Console should NOT show `[HMR]`.

### Code Changes

**None.** Will be documented in the remediation plan as an operational item.

---

## F-M2 — Sitemap + Robots Publish localhost URLs (Medium, Operational)

### Evidence

- **`curl https://ironforge.jesspete.shop/sitemap.xml`:** returns `<loc>http://localhost:3000/</loc>` for all 30 URLs
- **`curl https://ironforge.jesspete.shop/robots.txt`:** returns `Host: http://localhost:3000` + `Sitemap: http://localhost:3000/sitemap.xml`

### Root Cause

**Code is correct** — `sitemap.ts:22` reads `process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'`. The deployment environment simply hasn't set `NEXT_PUBLIC_APP_URL`.

### Optimal Fix

**This is an OPERATIONAL fix — NOT code-fixable.** Requires deployment env access.

- Action: Set `NEXT_PUBLIC_APP_URL=https://ironforge.jesspete.shop` in the deployment environment.
- Verification: `curl https://ironforge.jesspete.shop/sitemap.xml | head -5` should show the production domain.

### Code Changes

**None.** Will be documented as an operational item. (The code already does the right thing.)

---

## F-M3 — Stripe Webhook Doesn't Write to subscriptions Table (Medium)

### Evidence

- **`src/app/api/stripe/webhook/route.ts:74`:** `// Phase 9: when auth is wired, look up userId from session.client_reference_id...` — comment only, no DB write
- **`src/app/api/stripe/webhook/route.ts:93`:** `// Phase 9: update subscriptions table — set status, currentPeriodEnd, cancelAtPeriodEnd` — comment only
- **`src/app/api/stripe/webhook/route.ts:104`:** `// Phase 9: mark subscription as canceled in DB` — comment only
- **`src/lib/db/schema/index.ts:208-229`:** `subscriptions` table exists with `userId`, `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `tier`, `status`, `currentPeriodEnd`, `cancelAtPeriodEnd` columns — schema is ready, just no writes.
- **`src/app/api/stripe/webhook/route.ts:83`:** `const subData = sub as unknown as Record<string, unknown>;` — uses cast (also flagged as L5)

### Root Cause

Phase 9 (auth + subscription wiring) was never completed. The webhook logs events but doesn't persist them. This means paying customers don't get a row in `subscriptions` — admin can't see who's subscribed without checking the Stripe dashboard.

### Optimal Fix

1. **Remove the `as unknown as` cast** (L5 fix bundled in) — access `sub.currentPeriodEnd` and `sub.cancelAtPeriodEnd` directly (Stripe SDK v22 uses camelCase per the file's own header comment).
2. **Implement the 3 webhook handlers:**
   - `checkout.session.completed` — look up userId from `session.clientReferenceId` (set during checkout) or `session.customerEmail`; insert into `subscriptions` table with `status: 'active'`.
   - `customer.subscription.updated` — update `subscriptions` row: `status`, `currentPeriodEnd`, `cancelAtPeriodEnd`.
   - `customer.subscription.deleted` — update `subscriptions` row: `status: 'canceled'`.
3. **Handle the case where userId can't be resolved** — log a warning, don't crash. The webhook must still return 200 to acknowledge receipt to Stripe.
4. **Use `onConflictDoNothing` or `onConflictDoUpdate`** on `stripeSubscriptionId` for idempotency (Stripe may retry webhooks).

### Files to Modify

- `src/app/api/stripe/webhook/route.ts` — implement the 3 handlers
- `src/tests/unit/stripe-webhook.test.ts` — NEW file, unit tests for the handlers

### Tests to Write (TDD — RED first)

```ts
// src/tests/unit/stripe-webhook.test.ts
describe('Stripe webhook', () => {
  it('inserts a subscription on checkout.session.completed', async () => {
    // Mock stripe.webhooks.constructEvent to return a checkout.session.completed event
    // Mock db.insert
    // Call the POST handler
    // Assert db.insert was called with the correct shape
  });

  it('updates subscription on customer.subscription.updated', async () => {
    // Similar — mock event, assert db.update called
  });

  it('marks subscription canceled on customer.subscription.deleted', async () => {
    // Similar
  });

  it('returns 200 even if userId cannot be resolved (graceful)', async () => {
    // Mock event with no clientReferenceId
    // Assert response is 200, assert warning logged
  });

  it('returns 400 on invalid signature', async () => {
    // Mock constructEvent to throw
    // Assert 400
  });

  it('returns 503 if Stripe not configured', async () => {
    // Mock getStripe to return null
    // Assert 503
  });
});
```

### Validation Steps

1. `pnpm test` — new webhook tests pass
2. `pnpm typecheck && pnpm lint` — clean (no `as unknown as` cast)
3. Code review: verify `onConflictDoNothing`/`onConflictDoUpdate` on `stripeSubscriptionId`

---

## F-M4 — Inngest `trial-requested` Function Stubbed (Medium)

### Evidence

- **`src/inngest/functions/trial-requested.ts:12`:** `* Phase 6: email steps are stubbed with console.log (no Resend key in dev).`
- **`src/inngest/functions/trial-requested.ts:31-39`:** `notify-coach` step — only `console.log`
- **`src/inngest/functions/trial-requested.ts:50-54`:** `confirm-member` step — only `console.log`
- **`src/inngest/functions/trial-requested.ts:66`:** `schedule-followup` step — only `console.log`
- **No `RESEND_API_KEY` usage anywhere in the codebase** (verified — `grep -r "resend" src/` returns nothing)
- **`src/lib/env.ts:58`:** `RESEND_API_KEY: z.string().startsWith('re_')` — env var is defined in schema but never used

### Root Cause

The Resend email integration was planned (env var defined) but never wired. Trial bookings don't actually notify coaches or confirm with members — the Inngest function just logs to the server console.

### Optimal Fix

1. **Create `src/lib/email/resend.ts`** — graceful-degradation client (same pattern as `stripe.ts`, `r2.ts`, `replicate.ts`): returns `null` if `RESEND_API_KEY` not configured; uses `process.env` directly (NOT `env` module).
2. **Update `src/inngest/functions/trial-requested.ts`:**
   - `notify-coach` step — call `resend.emails.send(...)` to send coach notification email. If `resend` is null, fall back to `console.log` (existing behavior).
   - `confirm-member` step — call `resend.emails.send(...)` to send member confirmation email. Same fallback.
   - `schedule-followup` step — keep as `console.log` for now (this is a future `step.sleep` feature, not an email).
3. **Define email templates** — simple text/HTML templates for coach notification + member confirmation.
4. **Add `from` address env var** — `RESEND_FROM_EMAIL` (e.g., `noreply@ironforge.jesspete.shop`).

### Files to Modify

- `src/lib/email/resend.ts` — NEW file, Resend client with graceful degradation
- `src/inngest/functions/trial-requested.ts` — replace `console.log` with real email sends
- `src/lib/env.ts` — add `RESEND_FROM_EMAIL` to schema
- `src/tests/unit/trial-requested.test.ts` — NEW file, unit tests

### Tests to Write (TDD — RED first)

```ts
// src/tests/unit/trial-requested.test.ts
describe('trial-requested Inngest function', () => {
  it('sends coach notification email when Resend is configured', async () => {
    // Mock resend client
    // Call the function with test data
    // Assert resend.emails.send was called with coach notification template
  });

  it('sends member confirmation email when Resend is configured', async () => {
    // Similar
  });

  it('falls back to console.log when Resend is not configured', async () => {
    // Mock getResend() to return null
    // Assert no throw, console.log called
  });

  it('does not crash if Resend send fails (Inngest retries)', async () => {
    // Mock resend.emails.send to throw
    // Assert step.run re-throws (so Inngest retries)
  });
});
```

### Validation Steps

1. `pnpm test` — new tests pass
2. `pnpm typecheck && pnpm lint` — clean
3. In dev (no `RESEND_API_KEY`): submitting a trial request still works, logs to console
4. In dev (with `RESEND_API_KEY`): submitting a trial request sends real emails (verify via Resend dashboard)

---

## F-M5 — `ratelimit.ts` Imports `env` from `@/lib/env` (Medium)

### Evidence

- **`src/lib/ratelimit.ts:3`:** `import { env } from '@/lib/env';`
- **`src/lib/env.ts:90-121`:** `loadEnv()` throws on missing/invalid env vars at runtime (only returns placeholders during build/test context)
- **`AGENTS.md:96`:** "Do NOT import `env` from `@/lib/env` in infrastructure clients — the env module throws in dev without `.env.local`"
- **All other infra clients use `process.env` directly:**
  - `src/lib/stripe.ts` — `process.env.STRIPE_SECRET_KEY` ✅
  - `src/lib/r2.ts` — `process.env.R2_ACCOUNT_ID` etc. ✅
  - `src/lib/ai/replicate.ts` — `process.env.REPLICATE_API_TOKEN` ✅
  - `src/lib/inngest/client.ts` — `process.env.INNGEST_EVENT_KEY` ✅
- **`ratelimit.ts` is the ONLY infra client that imports `env`** — inconsistent.

### Root Cause

The ratelimit module was written before the graceful-degradation pattern was standardized (or was overlooked when the pattern was established). It reads `env.UPSTASH_REDIS_REST_URL` and `env.UPSTASH_REDIS_REST_TOKEN` — but if `.env.local` is missing in dev, the `env` module throws before `hasRealRedis()` can even check.

### Optimal Fix

1. **Remove `import { env } from '@/lib/env'`** from `ratelimit.ts`.
2. **Add a `getEnv(key, fallback)` helper** (same as `r2.ts:25-27` and `inngest/client.ts:21-23`).
3. **Replace `env.UPSTASH_REDIS_REST_URL` → `getEnv('UPSTASH_REDIS_REST_URL', 'https://placeholder.upstash.io')`**.
4. **Replace `env.UPSTASH_REDIS_REST_TOKEN` → `getEnv('UPSTASH_REDIS_REST_TOKEN', 'placeholder')`**.
5. **Verify `hasRealRedis()` still works** — it checks `.includes('placeholder')` and `.startsWith('https://')`, which the fallback values satisfy.

### Files to Modify

- `src/lib/ratelimit.ts` — remove `env` import, add `getEnv` helper, replace 2 references
- `src/tests/unit/ratelimit.test.ts` — NEW file (or extend existing if present), unit tests

### Tests to Write (TDD — RED first)

```ts
// src/tests/unit/ratelimit.test.ts
describe('ratelimit', () => {
  it('returns success=true (no-op) when Upstash not configured', async () => {
    // Mock process.env to have placeholder values
    // Call rateLimitBooking('1.2.3.4')
    // Assert { success: true }
  });

  it('uses process.env directly (not the env module)', () => {
    // Read ratelimit.ts source
    // Assert it does NOT import from '@/lib/env'
  });

  it('fails open (returns success=true) on Redis error', async () => {
    // Mock Ratelimit.limit to throw
    // Assert { success: true } (fail-open behavior)
  });
});
```

### Validation Steps

1. `pnpm test` — new tests pass
2. `pnpm typecheck && pnpm lint` — clean
3. `grep "from '@/lib/env'" src/lib/ratelimit.ts` — no matches
4. Delete `.env.local` temporarily, run `pnpm dev` — ratelimit module should NOT crash (previously would crash)

---

## Operational Items (Not Code-Fixable — Documented for Deployment Team)

### F-M1 — Deploy with Production Build

- **Action:** `docker compose -f docker-compose.prod.yml up -d` (or equivalent `pnpm build && pnpm start`)
- **Verify:** `curl -I` returns hashed chunks, console has no `[HMR]`

### F-M2 — Set NEXT_PUBLIC_APP_URL

- **Action:** Set `NEXT_PUBLIC_APP_URL=https://ironforge.jesspete.shop` in deployment env
- **Verify:** `curl https://ironforge.jesspete.shop/sitemap.xml | head -5` shows production domain

### Apply Migration 0002

- **Action:** `pnpm drizzle:migrate` in deployment env
- **Verify:** `\d coaches` in psql shows `published` + `order` as NOT NULL

### Configure Stripe (H3 carry-over)

- **Action:** Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Create 4 products/prices. Update `MEMBERSHIP_TIERS[*].stripePriceId` + `DROP_IN_PACK.stripePriceId` in `src/features/memberships/data.ts`.
- **Verify:** `POST /api/checkout {"tier":"forge"}` returns 200 with checkout URL

---

## Remediation Execution Order (Dependency-Aware)

1. **F-S1** (AUTH_SECRET) — do FIRST to stop the secret leak. No code dependencies.
2. **F-D1** (CSP unsafe-eval) — independent, quick TDD win. Establishes the regression-test pattern.
3. **F-M5** (ratelimit env import) — independent, small refactor.
4. **F-S2** (broken scripts) — independent, deletions only.
5. **F-M3** (Stripe webhook DB writes) — larger, depends on understanding the schema (already read).
6. **F-M4** (Inngest Resend wiring) — largest, new file + new env var + email templates.

Each finding gets its own TDD cycle: RED (write failing test) → GREEN (make it pass) → REFACTOR → commit.

---

## Quality Gate (must pass after all fixes)

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Expected: all green, test count increases from 183 → 183 + N new tests (estimated +12: 3 CSP + 6 webhook + 3 ratelimit + 0 Resend-if-mocked-internally... actual count TBD during implementation).
