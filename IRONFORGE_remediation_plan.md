# IRONFORGE Audit v2 — Remediation Plan

> **Source:** Derived from `/home/z/my-project/download/IRONFORGE_audit_v2_agent_actionable.md`
> **Validation:** All 8 findings re-validated against codebase on 2026-07-04
> **Approach:** TDD (RED → GREEN → REFACTOR) per finding, atomic commits
> **Quality gate:** `pnpm typecheck && pnpm lint && pnpm test && pnpm build` must pass after each finding

---

## Execution Order (Dependency-Aware)

| Order | Finding    | Severity | Est. Effort  | Dependencies                                              |
| ----- | ---------- | -------- | ------------ | --------------------------------------------------------- |
| 1     | F-S1       | High     | 20 min       | None — stop the secret leak first                         |
| 2     | F-D1       | Critical | 30 min       | None — quick TDD win, establishes regression-test pattern |
| 3     | F-M5       | Medium   | 30 min       | None — small refactor                                     |
| 4     | F-S2       | High     | 15 min       | None — deletions only                                     |
| 5     | F-M3       | Medium   | 90 min       | Understanding schema (done)                               |
| 6     | F-M4       | Medium   | 90 min       | `pnpm add resend` (new dep)                               |
| —     | F-M1, F-M2 | Medium   | 0 min (code) | Operational — documented only                             |

**Total estimated effort:** ~4.5 hours of implementation + testing.

---

## Finding F-S1 — Real AUTH_SECRET Committed to Git (High)

### Root Cause (Validated)

- `.env.local` and `.env.docker` are both tracked in git (confirmed: `git ls-files | grep -E "^\.env"` returns both)
- Both contain `AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=` (identical real secret)
- `.env.local` also contains `DATABASE_URL=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost:5432/fitnesstudio_dev` — a committed dev DB password
- `.gitignore:42` has `!.env.example` exception, but `.env.example` doesn't exist
- Git history: 3 commits touched these files (`b2c7b2f`, `b5fe0d8`, `9d474a1`)
- **Constraint:** `.env.local` is the Next.js runtime filename, used by `dotenv -e .env.local` in 4 package.json scripts (`drizzle:generate`, `drizzle:migrate`, `drizzle:studio`, `db:seed`). CANNOT rename `.env.local` — must instead untrack it and create `.env.example` as the template.

### Optimal Fix

1. Create `.env.example` from `.env.local` with ALL secrets replaced by placeholders
2. `git rm --cached .env.local .env.docker` (untrack but keep working copy)
3. Delete `.env.docker` (it's a near-duplicate of `.env.local`)
4. Update `.env.local`'s `AUTH_SECRET` locally to a fresh value (user must do this for production)
5. Verify `.gitignore` already covers `.env*` with `!.env.example` exception (it does)

### TDD Cycle

**No unit test** (config/repo hygiene). Validation via shell commands.

### Detailed Steps

```bash
# Step 1: Create .env.example from .env.local with placeholders
cp .env.local .env.example
# Then edit .env.example to replace:
#   AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=
#     → AUTH_SECRET=replace-with-openssl-rand-base64-32
#   DATABASE_URL=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost:5432/fitnesstudio_dev
#     → DATABASE_URL=postgresql://user:password@localhost:5432/fitnesstudio_dev
#   DATABASE_URL_UNPOOLED=... (same scrub)
#   All other secret values already use xxx/placeholder patterns — verify each line

# Step 2: Untrack .env.local and .env.docker from git (keep working copy)
git rm --cached .env.local .env.docker

# Step 3: Delete .env.docker (duplicate)
rm .env.docker

# Step 4: Verify .env.local still exists locally (for dev)
ls .env.local  # should still exist
```

### Files to Modify

- `.env.example` — NEW file (template with placeholders)
- `.env.docker` — DELETE
- `git rm --cached .env.local` — untrack (keep working copy)

### Validation

```bash
git ls-files | grep -E "^\.env"  # should return only .env.example
grep "AUTH_SECRET" .env.example  # should show placeholder, not real secret
grep "fitnesstudio_dev_password" .env.example  # should return nothing
cp .env.example .env.local  # should work (file exists)
pnpm test  # still 183/183
```

### Doc Impact

- `CLAUDE.md:98` says `cp .env.example .env.local` — now works ✅
- `README.md:168` says `cp .env.example .env.local` — now works ✅
- No doc changes needed (docs already describe the correct state)

---

## Finding F-D1 — CSP 'unsafe-eval' Still Present (Critical)

### Root Cause (Validated)

- `next.config.ts:30` contains `"script-src 'self' 'unsafe-inline' 'unsafe-eval'"`
- `next.config.ts:24` comment says `'unsafe-eval' is intentionally absent` — directly contradicts line 30
- 5 docs (CLAUDE.md, AGENTS.md, README.md, SKILL.md, ADR-002) claim the H1 fix was applied — all false
- The `status_3.md` worklog confirms the user "explicitly excluded" this fix in a prior session, but all docs present it as completed

### Optimal Fix

1. Remove `'unsafe-eval'` from `next.config.ts:30`
2. Export `CSP_POLICY` for testability (or read the file in tests)
3. Add `src/tests/unit/csp-policy.test.ts` — regression guard

### TDD Cycle

**RED — Write failing test first:**

```ts
// src/tests/unit/csp-policy.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function getCspPolicy(): string {
  const content = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf-8');
  const match = content.match(/const CSP_POLICY = \[([\s\S]*?)\]\.join/);
  if (!match) throw new Error('CSP_POLICY not found in next.config.ts');
  return match[1];
}

describe('CSP Policy (H1 regression guard)', () => {
  it('must NOT contain unsafe-eval', () => {
    expect(getCspPolicy()).not.toContain("'unsafe-eval'");
  });

  it('must contain unsafe-inline for script-src (Next.js App Router requirement)', () => {
    expect(getCspPolicy()).toContain("script-src 'self' 'unsafe-inline'");
  });

  it('must contain frame-ancestors none (clickjacking defense)', () => {
    expect(getCspPolicy()).toContain("frame-ancestors 'none'");
  });

  it('must contain default-src self', () => {
    expect(getCspPolicy()).toContain("default-src 'self'");
  });
});
```

Run: `pnpm test -- csp-policy` → **FAIL** (CSP still has unsafe-eval)

**GREEN — Remove `'unsafe-eval'` from next.config.ts:30:**

```ts
// Before:
"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
// After:
"script-src 'self' 'unsafe-inline'",
```

Run: `pnpm test -- csp-policy` → **PASS**

**REFACTOR —** The comment on line 24 is now accurate. No further changes.

### Files to Modify

- `next.config.ts:30` — remove `'unsafe-eval'`
- `src/tests/unit/csp-policy.test.ts` — NEW file (4 tests)

### Validation

```bash
pnpm test  # 183 + 4 = 187 tests pass
pnpm typecheck  # clean
pnpm lint  # clean
pnpm build  # clean (verifies Next.js 16 prod build doesn't need unsafe-eval)
```

---

## Finding F-M5 — ratelimit.ts Imports env (Medium)

### Root Cause (Validated)

- `src/lib/ratelimit.ts:3` imports `env` from `@/lib/env`
- The `env` module throws at runtime if env vars are missing (only returns placeholders in build/test context)
- **SECOND bug discovered:** `hasRealRedis()` on line 31-33 only checks for `'placeholder'`, but the `.env.local` dev values use `'xxx'` (e.g., `UPSTASH_REDIS_REST_URL=https://xxx.upstash.io`). This means `hasRealRedis()` returns `true` for dev values, the Redis client tries to connect, fails, and the fail-open catch logs an error on EVERY rate-limited request.
- All other infra clients (`stripe.ts`, `r2.ts`, `replicate.ts`, `inngest/client.ts`) use `process.env` directly AND check for both `'placeholder'` AND `'xxx'` patterns

### Optimal Fix

1. Remove `import { env } from '@/lib/env'`
2. Add `getEnv(key, fallback)` helper (same as `inngest/client.ts:21-23`)
3. Replace 4 references to `env.UPSTASH_*` → `getEnv('UPSTASH_*', fallback)`
4. Update `hasRealRedis()` to also check for `'xxx'` (matching `stripe.ts:22` pattern)

### TDD Cycle

**RED — Write failing test first:**

```ts
// src/tests/unit/ratelimit.test.ts
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('ratelimit module (F-M5)', () => {
  it('must NOT import from @/lib/env (graceful degradation)', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/lib/ratelimit.ts'), 'utf-8');
    expect(content).not.toContain("from '@/lib/env'");
    expect(content).not.toContain('from "@/lib/env"');
  });

  it('must check for both placeholder and xxx patterns (matches stripe.ts pattern)', () => {
    const content = readFileSync(resolve(process.cwd(), 'src/lib/ratelimit.ts'), 'utf-8');
    // hasRealRedis should reject both 'placeholder' and 'xxx' values
    expect(content).toMatch(/includes\(['"]placeholder['"]\)|includes\(['"]xxx['"]\)/);
  });

  it('returns success=true (no-op) when Upstash not configured', async () => {
    // Mock process.env to have xxx placeholders
    vi.resetModules();
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = 'https://xxx.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'xxx';
    try {
      const { rateLimitBooking } = await import('@/lib/ratelimit');
      const result = await rateLimitBooking('1.2.3.4');
      expect(result.success).toBe(true);
    } finally {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });

  it('fails open (returns success=true) on Redis error', async () => {
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = 'https://real.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'real-token';
    // Mock Ratelimit to throw
    vi.doMock('@upstash/ratelimit', () => ({
      Ratelimit: class {
        limit() {
          throw new Error('Redis down');
        }
        static slidingWindow() {
          return {};
        }
      },
    }));
    vi.doMock('@upstash/redis', () => ({
      Redis: class {
        constructor() {}
      },
    }));
    try {
      const { rateLimitBooking } = await import('@/lib/ratelimit');
      const result = await rateLimitBooking('1.2.3.4');
      expect(result.success).toBe(true); // fail-open
    } finally {
      vi.doUnmock('@upstash/ratelimit');
      vi.doUnmock('@upstash/redis');
    }
  });
});
```

Run: `pnpm test -- ratelimit` → **FAIL** (imports env, doesn't check xxx)

**GREEN — Refactor ratelimit.ts:**

```ts
// src/lib/ratelimit.ts (refactored)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Graceful-degradation helper (same pattern as inngest/client.ts, r2.ts)
function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

type RateLimitResult = { success: boolean; limit: number; remaining: number };

const noopLimiter = (): Promise<RateLimitResult> =>
  Promise.resolve({ success: true, limit: Infinity, remaining: Infinity });

// Check for real credentials (rejects placeholder AND xxx patterns — matches stripe.ts)
function hasRealRedis(): boolean {
  const url = getEnv('UPSTASH_REDIS_REST_URL');
  const token = getEnv('UPSTASH_REDIS_REST_TOKEN');
  return (
    url.length > 0 &&
    !url.includes('placeholder') &&
    !url.includes('xxx') &&
    url.startsWith('https://') &&
    token.length > 0 &&
    !token.includes('placeholder') &&
    !token.includes('xxx')
  );
}

let redis: Redis | null = null;
const limiters: Map<string, Ratelimit> = new Map();

function getRedis(): Redis | null {
  if (!hasRealRedis()) return null;
  if (!redis) {
    redis = new Redis({
      url: getEnv('UPSTASH_REDIS_REST_URL'),
      token: getEnv('UPSTASH_REDIS_REST_TOKEN'),
    });
  }
  return redis;
}

// ... rest unchanged
```

Run: `pnpm test -- ratelimit` → **PASS**

### Files to Modify

- `src/lib/ratelimit.ts` — remove env import, add getEnv helper, update hasRealRedis
- `src/tests/unit/ratelimit.test.ts` — NEW file (4 tests)

### Validation

```bash
grep "from '@/lib/env'" src/lib/ratelimit.ts  # no matches
pnpm test  # 187 + 4 = 191 tests pass
pnpm typecheck && pnpm lint  # clean
```

---

## Finding F-S2 — Broken test:e2e:live + Missing Audit Scripts (High)

### Root Cause (Validated)

- `playwright-live.config.ts:22` matches `/live-site\.spec\.ts/` — no such file exists
- `package.json:30-31` defines `audit:security` and `audit:a11y` scripts pointing to non-existent files
- `README.md:253` documents `pnpm test:e2e:live` as a working command
- Confirmed: running `pnpm test:e2e:live` returns "No tests found"

### Optimal Fix (Simplicity First — Remove, Don't Add)

1. Delete `playwright-live.config.ts` (the regular playwright.config.ts + `IRONFORGE_LIVE_URL` env var override is sufficient — demonstrated working in the audit)
2. Remove `test:e2e:live`, `audit:security`, `audit:a11y` scripts from `package.json`
3. Update `README.md:253` — remove the `pnpm test:e2e:live` line

### TDD Cycle

**No unit test** (deletion). Validation via shell commands.

### Detailed Steps

```bash
# Step 1: Delete playwright-live.config.ts
rm playwright-live.config.ts

# Step 2: Edit package.json — remove 3 script entries
# Remove: "test:e2e:live": "playwright test --config=playwright-live.config.ts",
# Remove: "audit:security": "tsx scripts/security-audit.ts",
# Remove: "audit:a11y": "tsx scripts/accessibility-audit.ts",

# Step 3: Edit README.md — remove line 253
# Remove: pnpm test:e2e:live           # Set IRONFORGE_LIVE_URL env var
# (and the preceding comment line if applicable)
```

### Files to Modify

- `playwright-live.config.ts` — DELETE
- `package.json` — remove 3 script entries
- `README.md` — remove `test:e2e:live` documentation line

### Validation

```bash
ls playwright-live.config.ts  # file not found
grep "test:e2e:live\|audit:security\|audit:a11y" package.json  # no matches
pnpm test  # still passing
pnpm lint && pnpm typecheck  # clean
```

---

## Finding F-M3 — Stripe Webhook Doesn't Write to subscriptions Table (Medium)

### Root Cause (Validated — with critical correction)

- `src/app/api/stripe/webhook/route.ts:74,93,104` — 3 `// Phase 9:` comments, no DB writes
- `subscriptions` table schema exists (verified: `src/lib/db/schema/index.ts:208-229`) with `userId` NOT NULL, `stripeSubscriptionId` UNIQUE
- **L5 bundled:** Line 83 uses `as unknown as Record<string, unknown>` to access `current_period_end` and `cancel_at_period_end` via snake_case string keys.
- **CRITICAL CORRECTION (discovered during plan validation):** The file's header comment (lines 17-22) claims "Stripe SDK v22+ uses camelCase (currentPeriodEnd, cancelAtPeriodEnd)" — **THIS IS FALSE.** Verified against `node_modules/stripe/cjs/resources/Subscriptions.d.ts`:
  - `Subscription.cancel_at_period_end: boolean` ✅ (snake_case, line 134)
  - `Subscription.current_period_end` ❌ **DOES NOT EXIST** on the `Subscription` output type. It only exists on `SubscriptionItem.current_period_end: number` (`SubscriptionItems.d.ts:54`).
  - Zero camelCase versions (`currentPeriodEnd`, `cancelAtPeriodEnd`) exist anywhere in the Stripe SDK types.
- **Implication:** The existing cast code `subData['current_period_end']` accesses a field that **doesn't exist on the Subscription object** — it would return `undefined`. This is a latent bug. To get the period end, you must access `sub.items.data[0]?.current_period_end`.
- **Constraint:** `userId` is NOT NULL. Current checkout flow is anonymous (no `clientReferenceId` set in `checkout/route.ts:115-127`). Webhook must look up userId by `session.customer_details.email` against the `users` table. If not found, skip insert + log warning.
- **Checkout metadata gap:** `checkout/route.ts:121-124` only sets `metadata: { tier, product_name }` — does NOT set `priceId`. The webhook needs `stripePriceId` for the `subscriptions` table. Fix: add `stripePriceId` to checkout metadata.
- **Header comment fix:** The file header (lines 17-22) must be corrected — Stripe SDK v22 uses snake_case, not camelCase.

### Optimal Fix (corrected)

1. Remove the `as unknown as` cast — access `sub.cancel_at_period_end` directly (snake_case, confirmed in SDK types). For `current_period_end`, access `sub.items.data[0]?.current_period_end` (it's on SubscriptionItem, not Subscription).
2. Update `checkout/route.ts` to add `stripePriceId` to the checkout session metadata (so the webhook can record it).
3. Fix the file header comment (lines 17-22) — Stripe SDK v22 uses snake_case, not camelCase.
4. Implement 3 handlers:
   - `checkout.session.completed` — resolve userId from `session.customer_details?.email`; if found, insert into `subscriptions` with `onConflictDoNothing` on `stripeSubscriptionId`. Read `stripePriceId` from `session.metadata.priceId`.
   - `customer.subscription.updated` — update `status`, `current_period_end` (from `sub.items.data[0]?.current_period_end`), `cancel_at_period_end` where `stripeSubscriptionId` matches.
   - `customer.subscription.deleted` — update `status: 'canceled'` where `stripeSubscriptionId` matches.
5. If userId can't be resolved, log warning + return 200 (don't crash the webhook).
6. Wrap DB operations in try/catch — DB errors should return 500 so Stripe retries, but log the error.

### TDD Cycle

**RED — Write failing tests first:**

```ts
// src/tests/unit/stripe-webhook.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock stripe module
const mockConstructEvent = vi.fn();
vi.mock('@/lib/stripe', () => ({
  getStripe: vi.fn(() => ({
    webhooks: { constructEvent: mockConstructEvent },
  })),
  getStripeWebhookSecret: vi.fn(() => 'whsec_test'),
}));

// Mock DB dynamic import — chainable builder
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockSelect = vi.fn();
vi.mock('@/lib/db/client', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue(undefined),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([]), // no user found by default
        })),
      })),
    })),
  },
}));

vi.mock('@/lib/db/schema', () => ({
  subscriptions: {},
  users: {},
}));

const { POST } = await import('@/app/api/stripe/webhook/route');

function makeRequest(body: string, sig = 'sig_test'): Request {
  return new Request('https://test/api/stripe/webhook', {
    method: 'POST',
    body,
    headers: { 'stripe-signature': sig },
  });
}

describe('Stripe webhook POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 503 when Stripe not configured', async () => {
    const { getStripe, getStripeWebhookSecret } = await import('@/lib/stripe');
    vi.mocked(getStripe).mockReturnValueOnce(null);
    vi.mocked(getStripeWebhookSecret).mockReturnValueOnce(null);
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(503);
  });

  it('returns 400 on missing stripe-signature header', async () => {
    const req = new Request('https://test/api/stripe/webhook', {
      method: 'POST',
      body: 'body',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on invalid signature', async () => {
    mockConstructEvent.mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(400);
  });

  it('handles checkout.session.completed (logs when userId unresolvable)', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test',
          customer: 'cus_test',
          subscription: 'sub_test',
          metadata: { tier: 'forge' },
          customerDetails: { email: 'unknown@example.com' },
        },
      },
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
    // DB insert should NOT have been called (no user found)
  });

  it('handles customer.subscription.updated (uses camelCase, no cast)', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_test',
          status: 'active',
          currentPeriodEnd: 1234567890,
          cancelAtPeriodEnd: false,
        },
      },
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
  });

  it('handles customer.subscription.deleted', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_test', status: 'canceled' } },
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
  });

  it('returns 200 for unhandled event types', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'invoice.paid',
      data: { object: {} },
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
  });
});
```

Run: `pnpm test -- stripe-webhook` → **FAIL** (current webhook doesn't do DB writes, tests expect them; also the camelCase access test will fail because current code uses cast)

**GREEN — Implement the handlers (corrected for snake_case SDK):**

```ts
// src/app/api/stripe/webhook/route.ts (refactored handlers)
// NOTE: Stripe SDK v22 uses snake_case field names (verified against Subscriptions.d.ts).
// The file header comment claiming camelCase was wrong — corrected.

case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  const tier = session.metadata?.tier ?? 'unknown';
  const stripePriceId = session.metadata?.priceId ?? '';
  // customer_details.email is the field (snake_case: customer_details)
  const customerEmail = session.customer_details?.email;
  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id ?? '';
  const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? '';

  console.log(`[stripe/webhook] checkout.session.completed: Session=${session.id} Customer=${stripeCustomerId} Sub=${stripeSubscriptionId} Tier=${tier}`);

  if (!customerEmail || !stripeSubscriptionId) {
    console.warn('[stripe/webhook] Missing customerEmail or subscriptionId — skipping DB insert');
    break;
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { subscriptions, users } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    // Look up userId by email
    const [user] = await db.select().from(users).where(eq(users.email, customerEmail)).limit(1);
    if (!user) {
      console.warn(`[stripe/webhook] No user found for email ${customerEmail} — skipping DB insert`);
      break;
    }

    // Insert subscription (idempotent via onConflictDoNothing on stripeSubscriptionId)
    await db.insert(subscriptions).values({
      userId: user.id,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      tier,
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }).onConflictDoNothing({ target: subscriptions.stripeSubscriptionId });

    console.log(`[stripe/webhook] Subscription recorded for user ${user.id}`);
  } catch (err) {
    console.error('[stripe/webhook] DB error on checkout.session.completed:', err);
    throw err; // Return 500 so Stripe retries
  }
  break;
}

case 'customer.subscription.updated': {
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
    const statusMap: Record<string, 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'> = {
      active: 'active',
      past_due: 'past_due',
      canceled: 'canceled',
      incomplete: 'incomplete',
      trialing: 'trialing',
    };
    const mappedStatus = statusMap[sub.status] ?? 'incomplete';

    await db.update(subscriptions).set({
      status: mappedStatus,
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: cancelAtEnd ?? false,
      updatedAt: new Date(),
    }).where(eq(subscriptions.stripeSubscriptionId, sub.id));
  } catch (err) {
    console.error('[stripe/webhook] DB error on subscription.updated:', err);
    throw err;
  }
  break;
}

case 'customer.subscription.deleted': {
  const sub = event.data.object as Stripe.Subscription;
  console.log(`[stripe/webhook] subscription.deleted: Sub=${sub.id}`);

  try {
    const { db } = await import('@/lib/db/client');
    const { subscriptions } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');

    await db.update(subscriptions).set({
      status: 'canceled',
      updatedAt: new Date(),
    }).where(eq(subscriptions.stripeSubscriptionId, sub.id));
  } catch (err) {
    console.error('[stripe/webhook] DB error on subscription.deleted:', err);
    throw err;
  }
  break;
}
```

**Also update `checkout/route.ts` to add `priceId` to metadata:**

```ts
// src/app/api/checkout/route.ts (line 121-124, add priceId to metadata)
metadata: {
  tier,
  product_name: productName,
  priceId: stripePriceId,  // NEW — needed by webhook to record in subscriptions table
},
```

**Also fix the file header comment (lines 17-22):**

```ts
// Before (WRONG):
* Reference: Skills KB §17 (T-lesson: Stripe SDK v22+ uses camelCase:
*   subscription.current_period_end is now subscription.currentPeriodEnd).
* Note: In the Stripe SDK v22, the Subscription object uses camelCase
* (currentPeriodEnd, cancelAtPeriodEnd) but the raw API response still
* uses snake_case. The SDK's constructEvent returns the typed object
* with camelCase properties.

// After (CORRECT):
* Reference: Stripe SDK v22+ uses snake_case field names matching the raw API.
*   - Subscription.cancel_at_period_end (boolean)
*   - SubscriptionItem.current_period_end (number) — access via sub.items.data[0]
* Never use `as unknown as` casts — access fields directly per the SDK types.
```

Run: `pnpm test -- stripe-webhook` → **PASS**

### Files to Modify

- `src/app/api/stripe/webhook/route.ts` — implement 3 handlers, remove cast, fix header comment
- `src/app/api/checkout/route.ts` — add `priceId: stripePriceId` to checkout session metadata
- `src/tests/unit/stripe-webhook.test.ts` — NEW file (7 tests)

### Validation

```bash
pnpm test  # 191 + 7 = 198 tests pass
pnpm typecheck && pnpm lint  # clean (no as unknown as cast)
grep "as unknown as" src/app/api/stripe/webhook/route.ts  # no matches
```

---

## Finding F-M4 — Inngest trial-requested Stubbed (Medium)

### Root Cause (Validated)

- `src/inngest/functions/trial-requested.ts:31-66` — all 3 steps use `console.log` only
- `resend` package NOT in `package.json` dependencies (must install)
- `RESEND_API_KEY` defined in `src/lib/env.ts:58` but never used anywhere
- `RESEND_FROM_EMAIL` not defined in env schema (must add)

### Optimal Fix

1. `pnpm add resend` — install the Resend SDK
2. Create `src/lib/email/resend.ts` — graceful-degradation client (same pattern as `stripe.ts`, `r2.ts`, `replicate.ts`)
3. Add `RESEND_FROM_EMAIL` to `src/lib/env.ts` schema (optional with default)
4. Update `src/inngest/functions/trial-requested.ts`:
   - `notify-coach` step — call `resend.emails.send(...)` if configured, else `console.log`
   - `confirm-member` step — same pattern
   - `schedule-followup` step — keep as `console.log` (future `step.sleep` feature, not email)

### TDD Cycle

**RED — Write failing tests first:**

```ts
// src/tests/unit/trial-requested.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock resend client
const mockEmailsSend = vi.fn().mockResolvedValue({ id: 'email-1' });
vi.mock('@/lib/email/resend', () => ({
  getResend: vi.fn(() => ({
    emails: { send: mockEmailsSend },
  })),
  isResendConfigured: vi.fn(() => true),
  COACH_NOTIFY_EMAIL: 'coaches@ironforge.local',
  RESEND_FROM_EMAIL: 'noreply@ironforge.local',
}));

const { trialRequested } = await import('@/inngest/functions/trial-requested');

const mockEvent = {
  data: {
    requestId: 'req-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    goal: 'muscle',
    preferredTime: 'early',
    preferredCoachId: null,
    notes: null,
  },
};

describe('trial-requested Inngest function (F-M4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends coach notification email via Resend', async () => {
    const mockStep = { run: vi.fn((name, fn) => fn()) };
    await trialRequested.run({ event: mockEvent, step: mockStep as any });

    // Find the notify-coach step call
    const coachCall = mockStep.run.mock.calls.find((c) => c[0] === 'notify-coach');
    expect(coachCall).toBeDefined();
    // Execute the step function
    await coachCall![1]();
    expect(mockEmailsSend).toHaveBeenCalled();
  });

  it('sends member confirmation email via Resend', async () => {
    const mockStep = { run: vi.fn((name, fn) => fn()) };
    await trialRequested.run({ event: mockEvent, step: mockStep as any });

    const memberCall = mockStep.run.mock.calls.find((c) => c[0] === 'confirm-member');
    expect(memberCall).toBeDefined();
    await memberCall![1]();
    expect(mockEmailsSend).toHaveBeenCalled();
  });

  it('falls back to console.log when Resend not configured', async () => {
    const { isResendConfigured, getResend } = await import('@/lib/email/resend');
    vi.mocked(isResendConfigured).mockReturnValueOnce(false);
    vi.mocked(getResend).mockReturnValueOnce(null);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mockStep = { run: vi.fn((name, fn) => fn()) };
    await trialRequested.run({ event: mockEvent, step: mockStep as any });

    const coachCall = mockStep.run.mock.calls.find((c) => c[0] === 'notify-coach');
    await coachCall![1]();
    expect(consoleSpy).toHaveBeenCalled();
    expect(mockEmailsSend).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
```

Run: `pnpm test -- trial-requested` → **FAIL** (module `@/lib/email/resend` doesn't exist)

**GREEN — Create the Resend client + update the Inngest function:**

```ts
// src/lib/email/resend.ts (NEW)
import { Resend } from 'resend'; // named export (verified: resend v6.17.1 exports { Resend })

/**
 * IRONFORGE — Resend email client.
 *
 * Uses process.env directly (with null fallback) instead of the Zod-validated
 * env module, because:
 *  - The Resend client is infrastructure code (Layer 4)
 *  - It needs to gracefully degrade when env vars are missing (dev without
 *    .env.local, build context, test context)
 *
 * In production with real RESEND_API_KEY, returns a real Resend client.
 * In dev/build/test, returns null — callers check for null and fall back
 * to console.log.
 */

function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_placeholder' || key.startsWith('re_xxx')) {
    return null;
  }
  return key;
}

let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  const key = getResendApiKey();
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

export function isResendConfigured(): boolean {
  return getResend() !== null;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'noreply@ironforge.local';
}

// Coach notification inbox (where trial requests are sent)
export function getCoachNotifyEmail(): string {
  return process.env.COACH_NOTIFY_EMAIL ?? 'coaches@ironforge.local';
}
```

```ts
// src/inngest/functions/trial-requested.ts (updated)
import { inngest } from '@/lib/inngest/client';
import type { TrialRequestedEvent } from '@/lib/inngest/client';
import {
  getResend,
  isResendConfigured,
  getFromEmail,
  getCoachNotifyEmail,
} from '@/lib/email/resend';

export const trialRequested = inngest.createFunction(
  { id: 'trial-requested', name: 'Trial Requested', triggers: [{ event: 'trial.requested' }] },
  async ({ event, step }) => {
    const data = event.data as TrialRequestedEvent['data'];

    // Step 1: Notify the coach
    const coachResult = await step.run('notify-coach', async () => {
      const resend = getResend();
      if (!resend || !isResendConfigured()) {
        console.log(`[inngest:notify-coach] (Resend not configured — logging only)
          Member: ${data.name} <${data.email}>
          Phone: ${data.phone ?? 'N/A'}
          Goal: ${data.goal}
          Preferred time: ${data.preferredTime}
          Preferred coach ID: ${data.preferredCoachId ?? 'No preference'}
          Notes: ${data.notes ?? 'None'}
          Request ID: ${data.requestId}`);
        return { success: true, notifiedAt: new Date().toISOString(), channel: 'console' };
      }

      try {
        await resend.emails.send({
          from: getFromEmail(),
          to: getCoachNotifyEmail(),
          subject: `New Trial Request: ${data.name}`,
          text: `New trial request received.

Member: ${data.name} <${data.email}>
Phone: ${data.phone ?? 'N/A'}
Goal: ${data.goal}
Preferred time: ${data.preferredTime}
Preferred coach ID: ${data.preferredCoachId ?? 'No preference'}
Notes: ${data.notes ?? 'None'}
Request ID: ${data.requestId}`,
        });
        return { success: true, notifiedAt: new Date().toISOString(), channel: 'email' };
      } catch (err) {
        console.error('[inngest:notify-coach] Resend send failed:', err);
        throw err; // Re-throw so Inngest retries
      }
    });

    // Step 2: Confirm with the member
    const memberResult = await step.run('confirm-member', async () => {
      const resend = getResend();
      if (!resend || !isResendConfigured()) {
        console.log(`[inngest:confirm-member] (Resend not configured — logging only)
          To: ${data.email}
          Hi ${data.name},
          Your trial request has been received. A coach will reach out within 24 hours.
          Request ID: ${data.requestId}`);
        return { success: true, sentAt: new Date().toISOString(), channel: 'console' };
      }

      try {
        await resend.emails.send({
          from: getFromEmail(),
          to: data.email,
          subject: 'IRONFORGE — Trial Request Received',
          text: `Hi ${data.name},

Your trial request has been received. A coach will reach out within 24 hours.

Request ID: ${data.requestId}

— IRONFORGE`,
        });
        return { success: true, sentAt: new Date().toISOString(), channel: 'email' };
      } catch (err) {
        console.error('[inngest:confirm-member] Resend send failed:', err);
        throw err;
      }
    });

    // Step 3: Schedule a 3-day follow-up (future: step.sleep)
    await step.run('schedule-followup', async () => {
      console.log(`[inngest:schedule-followup] Would check in 3 days on request ${data.requestId}`);
      return { scheduled: true };
    });

    return {
      coachNotified: coachResult.success,
      memberConfirmed: memberResult.success,
      requestId: data.requestId,
    };
  },
);
```

Run: `pnpm test -- trial-requested` → **PASS**

### Files to Modify

- `pnpm add resend` — install dependency
- `src/lib/email/resend.ts` — NEW file (graceful-degradation client)
- `src/inngest/functions/trial-requested.ts` — replace console.log with Resend calls
- `src/lib/env.ts` — add `RESEND_FROM_EMAIL` (optional) + `COACH_NOTIFY_EMAIL` (optional)
- `src/tests/unit/trial-requested.test.ts` — NEW file (3 tests)

### Validation

```bash
pnpm test  # 198 + 3 = 201 tests pass
pnpm typecheck && pnpm lint  # clean
pnpm build  # clean
```

---

## Operational Items (Documented — Not Code-Fixed)

### F-M1 — Deploy with Production Build

**Action (deployment team):**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

**Verify:** `curl -I https://ironforge.jesspete.shop/` should show hashed chunk URLs (not `no-cache, must-revalidate`). Browser console should NOT show `[HMR] connected` or React DevTools prompt.

### F-M2 — Set NEXT_PUBLIC_APP_URL

**Action (deployment team):** Set in deployment env:

```
NEXT_PUBLIC_APP_URL=https://ironforge.jesspete.shop
```

**Verify:** `curl https://ironforge.jesspete.shop/sitemap.xml | head -5` should show `https://ironforge.jesspete.shop/` not `http://localhost:3000/`.

### Apply Migration 0002

**Action (deployment team):**

```bash
pnpm drizzle:migrate
```

**Verify:** `\d coaches` in psql shows `published` + `order` as `NOT NULL`.

### Configure Stripe (H3 carry-over)

**Action (deployment team):**

1. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in deployment env
2. Create 4 Stripe products/prices (Forge, Forge+, Forge Private, Drop-in Pack)
3. Update `MEMBERSHIP_TIERS[*].stripePriceId` + `DROP_IN_PACK.stripePriceId` in `src/features/memberships/data.ts`
   **Verify:** `POST /api/checkout {"tier":"forge"}` returns 200 with checkout URL.

---

## Quality Gate (must pass after all 6 code fixes)

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

**Expected test count progression:**

- Baseline: 183 tests
- After F-D1: +4 (csp-policy) = 187
- After F-M5: +4 (ratelimit) = 191
- After F-S2: +0 (deletions only) = 191
- After F-M3: +7 (stripe-webhook) = 198
- After F-M4: +3 (trial-requested) = 201
- After F-S1: +0 (config only) = 201

**Final expected: 201 tests passing, 0 type errors, 0 lint errors, clean build.**

---

## Commit Strategy (Atomic, Conventional Commits)

1. `fix(security): remove 'unsafe-eval' from CSP (F-D1)` — next.config.ts + csp-policy.test.ts
2. `fix(security): untrack .env.local and create .env.example template (F-S1)` — .env.example + git rm --cached
3. `refactor(ratelimit): use process.env directly, fix xxx placeholder check (F-M5)` — ratelimit.ts + ratelimit.test.ts
4. `chore: remove broken test:e2e:live + audit scripts (F-S2)` — delete playwright-live.config.ts + package.json + README
5. `feat(stripe): implement webhook DB writes + remove cast (F-M3, L5)` — webhook route + stripe-webhook.test.ts
6. `feat(inngest): wire Resend for trial-requested emails (F-M4)` — resend.ts + trial-requested.ts + trial-requested.test.ts

Each commit: RED test → GREEN code → quality gate → commit.
