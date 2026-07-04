---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# IRONFORGE

## Core Identity & Purpose

IRONFORGE is a production-grade marketing + booking + memberships + admin website for a high-end strength & conditioning studio. Built with Next.js 16, React 19, Tailwind CSS v4, Drizzle ORM, Auth.js v5, Inngest, Stripe, Replicate, and Resend. The project follows a 5-layer architecture with server-first rendering and graceful degradation when external services are not configured.

**Key technical decision:** All infrastructure clients (DB, Stripe, R2, Replicate, Inngest, Resend, Upstash) use `process.env` directly with `null` fallbacks — NOT the Zod-validated `env` module — to avoid crashes in dev without `.env.local`.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

Follow this six-phase workflow for all implementation tasks:

1. **ANALYZE** - Deep, multi-dimensional requirement mining. Never make surface-level assumptions.
2. **PLAN** - Structured execution roadmap with sequential phases. Present for explicit user confirmation.
3. **VALIDATE** - Explicit confirmation checkpoint. Never proceed without validation.
4. **IMPLEMENT** - Modular, tested, documented builds.
5. **VERIFY** - Rigorous QA against success criteria.
6. **DELIVER** - Complete handoff with knowledge transfer.

### Project-Specific Principles

- **Graceful Degradation:** Every external service (DB, Stripe, R2, Replicate, Inngest, Upstash) must gracefully degrade to a working fallback when env vars are missing. The marketing site must render in dev, build, and CI without any external services.
- **Server-First:** Server Components by default. `"use client"` only at leaves (hooks, event handlers, browser APIs).
- **Anti-Generic:** Reject template aesthetics. Every pixel serves a purpose. No purple gradients, no Inter/Roboto safety, no bento grids.
- **WCAG AAA:** Target AAA contrast (7:1 normal, 4.5:1 large). All motion respects `prefers-reduced-motion`. All touch targets ≥44×44px.
- **Library Discipline:** Use shadcn/ui + Radix primitives. Never rebuild what the library provides. Wrap with bespoke styling only.

## Implementation Standards

### General Coding Practices

- **Early Returns:** Prefer early returns over deeply nested conditionals
- **Composition over Inheritance:** Favor composition patterns
- **Self-Documenting Code:** Clear naming and structure
- **Test-Driven Development:** Follow Red-Green-Refactor cycle
- **Surgical Changes:** Touch only what you must. Match existing style.

### Language & Framework Guidelines

**TypeScript Strict Mode**

- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `verbatimModuleSyntax: true`
- Never use `any` — use `unknown` instead (ESLint `no-explicit-any: error`)
- Prefer `interface` for structural definitions; `type` for unions
- Use `import type` for type-only imports (enforced by `consistent-type-imports: error`)

**React 19 + Next.js 16**

- App Router conventions (`src/app/` directory)
- Server Components by default; `"use client"` only at leaves
- Use `next/image` for all images (with `priority` on hero, `sizes` on all)
- Use `next/font/google` with `variable` strategy + `display: swap`
- Metadata API for SEO (`export const metadata: Metadata`)
- Server Actions for form submissions (`'use server'` directive)
- **Next.js 16 breaking change:** `middleware.ts` → `proxy.ts`. Export `proxy` not `middleware`.
- **useSearchParams()** must be wrapped in `<Suspense>` for static prerendering

**Tailwind CSS v4 (CSS-First)**

- NO `tailwind.config.js` — all tokens in `src/app/globals.css` `@theme` block
- Use `@utility` for custom utilities (not `@layer utilities`)
- v4 migration: `bg-gradient-to-r` → `bg-linear-to-r`, `shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`, `ring` → `ring-3`
- Arbitrary CSS variables: `bg-(--brand)` (parentheses), not `bg-[--brand]` (square brackets)
- NEVER use dynamic class interpolation (`bg-${color}-500`) — Tailwind purges these

**Drizzle ORM**

- Use `eq()`, `orderBy()`, `limit()` parameterized queries — NEVER raw SQL
- `ON CONFLICT DO NOTHING` for idempotent inserts
- Migrations via `pnpm drizzle:generate` + `pnpm drizzle:migrate` — NEVER `db push` in production
- `postgres()` defers connection — safe to eager instantiate

**Auth.js v5**

- JWT strategy (stateless — no DB sessions table needed)
- `trustHost: true` mandatory (T2 lesson — prevents P0 production outage with reverse proxies)
- Do NOT use DrizzleAdapter (type mismatch with our schema — JWT doesn't need it)
- Rate limit login attempts in `authorize()` — 5 per 10 min per IP

**Zod 4**

- Enum syntax: `z.enum([...], { message: '...' })` — NOT `{ errorMap }` (Zod 4 changed this)
- UUID validation is strict: requires proper v4 format (version digit `4`, variant digit `8/9/a/b`)
- Use `.safeParse()` for validation (returns `{ success, data } | { success, error }`)

## Development Workflow

### Environment Setup

```bash
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL, AUTH_SECRET at minimum
openssl rand -base64 32  # Generate AUTH_SECRET
pnpm db:reset            # Migrate + seed
```

### Build Commands

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `pnpm dev`              | Start dev server (Turbopack) on :3000                |
| `pnpm build`            | Production build                                     |
| `pnpm start`            | Start production server                              |
| `pnpm typecheck`        | `tsc --noEmit`                                       |
| `pnpm lint`             | ESLint flat config                                   |
| `pnpm test`             | Vitest run (207 unit tests)                          |
| `pnpm test:e2e`         | Playwright (requires dev server)                     |
| `pnpm format`           | Prettier write                                       |
| `pnpm drizzle:generate` | Generate migration from schema diff                  |
| `pnpm drizzle:migrate`  | Apply migrations                                     |
| `pnpm db:seed`          | Seed (8 coaches + 9 programs + 6 stories + 48 slots) |
| `pnpm db:reset`         | Migrate + seed in one command                        |

### Quality Gate (run before every commit)

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

This is enforced by Husky `pre-push` hook + GitHub Actions CI.

## Testing Strategy

### Test Pyramid

- **Unit Tests (207):** Vitest + jsdom — brand tokens, hooks, schemas, queries, server actions, CSP policy, rate limiter, Stripe webhook, Inngest trial-requested
- **E2E Tests (9 specs):** Playwright Chromium — hero, programs, coaches, stories, booking, memberships, auth, SEO, hydration-guard

### Test Commands

```bash
pnpm test                    # All unit tests
pnpm test:watch              # Watch mode
pnpm test:e2e                # E2E (requires pnpm dev running)
```

### Test Conventions

- **File location:** Unit tests in `src/tests/unit/` OR `src/features/**/*.test.ts` (both matched by vitest config)
- **JSX tests:** Must use `.test.tsx` extension (not `.test.ts`) — oxc parser limitation
- **Mock factories:** Use `vi.hoisted()` for mock factories (avoids "Cannot access before initialization")
- **SDK mocks:** Use `class` syntax (not arrow functions) for constructor mocks
- **DB mocks:** `vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable'); })` — simulates graceful fallback
- **Test factory pattern:** `getMockX(overrides)` — e.g., `getMockCoach({ name: 'Test' })`

## Code Quality Standards

### Linting & Formatting

```bash
pnpm lint                    # ESLint (flat config, 9.x)
pnpm format                  # Prettier (with tailwindcss plugin)
```

### Key ESLint Rules

- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/consistent-type-imports: error`
- `react-hooks/exhaustive-deps: error` (NOT warn — strict)
- `no-restricted-imports` on `src/features/*/domain/**` — prevents domain layer from importing React/Next/DB runtime

### Prettier Config

- Plugin: `prettier-plugin-tailwindcss` (class sorting)
- Single quotes, trailing commas, 100 char print width, LF line endings

## Git & Version Control

### Branching Strategy

- `feat/<description>` - Feature branches
- `fix/<description>` - Bug fixes
- Short-lived branches (merge within 1-3 days)

### Commit Standards

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Atomic commits (one logical change per commit)

### Pre-commit Hooks (Husky)

- **pre-commit:** `pnpm lint-staged` (ESLint --fix + Prettier on staged `*.{ts,tsx}`, Prettier on `*.{json,md,css,mjs}`)
- **pre-push:** `pnpm typecheck && pnpm test`

## Error Handling & Debugging

### Error Handling Approach

- Server actions return typed `{ success: boolean, code: string, message: string }` — never throw to client
- API routes return `{ data: T } | { error: { code, message } }` with Zod-validated responses
- All infrastructure uses dynamic imports + try/catch for graceful fallback
- `console.error('[context] message:', err)` pattern throughout for structured logging

### Debugging

- **Vitest:** `pnpm test:watch` — re-runs on file change
- **Playwright:** `pnpm test:e2e --debug` — step-through mode
- **Next.js:** Check `.next/dev/server/` for compiled routes
- **Tailwind v4:** If classes not applying, check `@source` directives + dynamic class interpolation
- **Auth.js:** `console.warn('[auth:authorize]')` logs are in server console (not browser)

## Communication & Documentation

### Documentation Standards

- Every file has a JSDoc header explaining purpose + references to Skills KB
- `docs/` directory: Master Execution Plan, Skills Knowledge Base, design tokens, security audit
- `worklog.md`: Phase-by-phase work log (append-only, never overwrite)

### Key References

- `docs/Master-Execution-Plan.md` — 13-phase execution plan
- `docs/Skills-Knowledge-Base.md` — distilled learnings from 4 deep-read skills
- `docs/design-tokens.md` — full token reference
- `docs/security-audit.md` — OWASP + WCAG audit report

## Project-Specific Standards

### Architecture (5-Layer Golden Rule)

```
Layer 0  src/proxy.ts            → Edge cookie check. NO DB. NO logic. Edge runtime.
Layer 1  src/app/                → Routes, metadata, Suspense. Layouts must NOT fetch data.
Layer 2  src/features/           → UI composition, data binding, mutations
Layer 3  src/features/*/domain/  → Pure business logic. No Next.js/React/DB runtime (import type only)
Layer 4  src/lib/                → Infrastructure: Drizzle, Auth, Inngest, R2, Stripe, AI
```

**Golden Rule:** A lower layer may never import from a higher layer.

### API Design

- All API routes return `{ data: T } | { error: { code, message } }`
- All responses Zod-validated before sending
- Next.js 16 async params: `{ params }: { params: Promise<{ slug: string }> }` (must `await params`)
- `force-dynamic` on routes that need env vars at module load (Auth, Inngest)

### Database / Data Layer

- Drizzle ORM + `postgres` driver (PgBouncer-compatible with `prepare: false`)
- 11 tables: users, accounts, sessions, verificationTokens, coaches, programs, stories, classSlots, trialRequests, newsletterSubs, subscriptions
- 3 migrations: `drizzle/0000_majestic_triathlon.sql` + `drizzle/0001_colossal_anthem.sql` + `drizzle/0002_enforce_published_notnull.sql`
- Seed: `pnpm db:seed` (idempotent via `ON CONFLICT DO NOTHING`)
- **NOT NULL enforcement:** `published` and `order` columns on coaches/programs/stories are `.notNull()` (migration 0002). Drizzle inferred types now match Zod schemas — no `as unknown as` casts needed.
- **Queries pattern:** DB-first with static fallback — `try { db } catch { return STATIC_DATA }`. All public queries filter by `published: true` (H2 fix). DB results are Zod-validated before returning (defense-in-depth for varchar→enum narrowing in programs).
- **ID validation:** Server actions accepting an `id` param must validate via `z.string().uuid()` before any DB call (M5 fix). See `IdSchema` in `features/coaches/actions.ts`.

### Environment Variables

- **Runtime:** Validated by `src/lib/env.ts` (Zod schema, throws on missing)
- **Build context:** Returns placeholders when `NEXT_PHASE=phase-production-build` or `NODE_ENV=test`
- **Infrastructure clients:** Use `process.env` directly (NOT `env` module) to avoid crash in dev
- **Template file:** `.env.example` — copy to `.env.local` and fill in real values
- **NEVER commit `.env.local`** — `.gitignore` excludes `.env*` except `.env.example`
- See `.env.example` for the full list (28 vars including `RESEND_FROM_EMAIL` + `COACH_NOTIFY_EMAIL`)

### Graceful Degradation Pattern

All infrastructure clients follow this pattern (verified across `lib/stripe.ts`, `lib/r2.ts`, `lib/ai/replicate.ts`, `lib/inngest/client.ts`, `lib/email/resend.ts`, `lib/ratelimit.ts`):

```typescript
function getClient() {
  const key = process.env.KEY;
  if (!key || key === 'placeholder' || key.startsWith('prefix_xxx')) return null;
  return new Client(key);
}
// Callers check for null and fall back to static data / placeholder SVG / console.log
```

**F-M5 lesson:** `hasRealRedis()` (and similar checks) must reject BOTH `'placeholder'` (build-context value) AND `'xxx'` (`.env.local` dev placeholder). The `stripe.ts` pattern is the canonical reference.

### Security Checklist

- Rate limit: booking (5/min), checkout (10/min), auth (5/10min)
- Honeypot on booking form (`company_website` field)
- Stripe webhook signature verification + DB writes to `subscriptions` table (F-M3 fix)
- SSRF allowlist on `downloadImage()` (replicate.delivery only)
- Admin auth: edge proxy → layout session check → action role check
- CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'` (NO `'unsafe-eval'` — H1 fix, now ACTUALLY applied with regression test `csp-policy.test.ts`). `'unsafe-inline'` is required for Next.js App Router inline runtime; future hardening: nonce-based CSP.
- HSTS + X-Frame-Options (DENY) + nosniff + Referrer-Policy + Permissions-Policy
- UUID validation on all server-action `id` params (M5 fix)
- Server actions return typed `{ success, code, message, field? }` — `field` populated from Zod `issues[0].path[0]` for client-side error routing (M4 fix)
- Email: Resend client (`lib/email/resend.ts`) sends real trial-request notifications + confirmations (F-M4 fix); falls back to `console.log` when not configured
- `.env.local` untracked from git — `.env.example` is the template (F-S1 fix)

## Anti-Patterns to Avoid

- **`process.env.*` direct access in app code:** Always import `env` from `@/lib/env` for app logic. Infrastructure clients (`lib/stripe.ts`, `lib/r2.ts`, `lib/email/resend.ts`, etc.) are the exception — they use `process.env` directly for graceful degradation.
- **`DrizzleAdapter` with JWT strategy:** Don't use it — JWT doesn't need DB sessions, and the adapter's type expectations conflict with our schema.
- **`middleware.ts` filename:** Next.js 16 renamed to `proxy.ts`. Export `proxy` not `middleware`.
- **`{ errorMap }` in Zod 4:** Use `{ message }` instead.
- **Dynamic class interpolation in Tailwind:** `bg-${color}-500` is purged. Use mapping objects or full class strings.
- **`tailwind.config.js`:** Forbidden in v4. All tokens in `globals.css` `@theme` block.
- **Client component importing `lib/storage/r2.ts`:** Will crash — `r2.ts` imports env validation which fails in browser. Server Component signs URL, passes as prop.
- **`setState` in effect body:** React 19 `react-hooks/set-state-in-effect` rule. Derive state instead, or use `setState` only in event callbacks (setInterval, pointer events).
- **`as unknown as` casts:** Banned in queries (H4 fix). The Drizzle schema's `published`/`order` columns are `.notNull()`, so inferred types match Zod schemas. If a type mismatch appears, fix the schema — don't cast.
- **`@ts-expect-error` / `@ts-ignore` / `@ts-nocheck`:** Banned (M7 fix). Use proper type narrowing (`instanceof`, type guards) or fix the upstream type declaration.
- **Substring matching for error routing:** Banned in forms (M4 fix). Server actions return a `field` property; clients route errors via `result.field`, not `message.includes('email')`.
- **CSP with `'unsafe-eval'`:** Banned (H1 fix — now ACTUALLY applied). Next.js 16 production builds do not require `'unsafe-eval'`. Only `'unsafe-inline'` is allowed (for script-src + style-src). Regression test: `csp-policy.test.ts`.
- **Hardcoded `localhost` in metadata:** Use `process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'` for `metadataBase`, OG `url`, sitemap, and robots (M1 fix).
- **`setProgress` in `setInterval` for progress bars:** Causes 10 re-renders/sec (M8 fix). Use CSS `@keyframes` animation + `key={current}` to restart on frame change.
- **Public queries without `published: true` filter:** Banned (H2 fix). Unpublished records would leak via the public API. Always `.where(eq(*.published, true))`.
- **Server actions without UUID validation on `id`:** Banned (M5 fix). Always `z.string().uuid().safeParse(id)` before any DB call.
- **`toLocaleString()` without explicit locale in Client Components:** Banned. SSR uses Node's default locale (en-US), client uses browser locale — causes hydration mismatch. Use `toLocaleString('en-US')` for deterministic output.
- **`suppressHydrationWarning` on text nodes:** Anti-pattern. React docs explicitly state it will "not attempt to patch mismatched text content" — leaving server-rendered text permanently in the DOM. Fix the source of the mismatch instead.
- **Importing `env` from `@/lib/env` in infrastructure clients:** Banned (F-M5 fix). All `src/lib/` infra clients must use `process.env` directly with `null` fallback. The `env` module throws at runtime when `.env.local` is missing.
- **Incomplete placeholder checks:** `hasRealRedis()` and similar must reject BOTH `'placeholder'` AND `'xxx'` patterns (F-M5 fix). See `stripe.ts` for the canonical pattern.
- **`as unknown as` casts in API routes:** Banned (F-M3/L5 fix). Access Stripe SDK fields directly — the SDK uses snake_case (`sub.cancel_at_period_end`, `sub.items.data[0].current_period_end`), NOT camelCase as a stale comment once claimed.
- **Committing `.env.local` to git:** Banned (F-S1 fix). Use `.env.example` as the template. `.env.local` is the Next.js runtime filename and must never be tracked.
- **Documenting non-existent commands:** Banned (F-S2 fix). If `pnpm test:e2e:live` or `pnpm audit:security` is documented, the config files + scripts must exist. Remove or implement — don't leave broken references.

## Lessons Learned (Post-Audit Remediation 2026-07-03 + Remediation v2 2026-07-04)

A full code review + audit (see `IRONFORGE_code_review_audit.md`) surfaced 3 Critical, 4 High, 8 Medium, and 7 Low findings. The code-fixable items were applied via TDD (RED → GREEN → REFACTOR). A second remediation pass (v2) addressed 1 Critical + 2 High + 5 Medium findings. Key lessons:

### Architecture / Type Safety

1. **`.default()` without `.notNull()` creates `T | null` in Drizzle inference.** This forced 20 `as unknown as` casts in the queries modules. Fix: always pair `.default(X)` with `.notNull()` when the column is semantically non-nullable. Migration 0002 backfills this for `published` and `order` columns.

2. **Zod enums vs Drizzle `varchar` mismatch.** The `programs.goal` column is `varchar` in Postgres but `z.enum([...])` in the domain schema. Drizzle infers `string`, Zod infers the enum union. Fix: keep the column as `varchar` (avoids complex migration) and Zod-validate DB results at runtime in the query module (defense-in-depth). A future sprint could switch to `pgEnum` for compile-time safety.

3. **Casts hide bugs.** The `as unknown as Coach[]` casts satisfied ESLint's `no-explicit-any` rule but defeated TypeScript's runtime safety — they hid BOTH the `published: boolean | null` mismatch AND the `goal: string vs enum` mismatch. Lesson: if you need a cast, the schema is wrong. Fix the schema.

### Security / Configuration

4. **CSP `'unsafe-eval'` is NOT required for Next.js 16 production.** The inline comment claimed it was "intentionally absent" but the actual CSP string included it. This is a documentation/implementation contradiction. Lesson: grep the actual config string, don't trust the comment. Fix applied: removed `'unsafe-eval'`, fixed the comment.

5. **`NEXT_PUBLIC_APP_URL` must be set in production.** Without it, `sitemap.xml` and `robots.txt` publish `http://localhost:3000/...` URLs (verified on the live site). The code now reads `process.env.NEXT_PUBLIC_APP_URL` for `metadataBase`, OG `url`, sitemap, and robots. Operational fix: set the env var in the deployment.

6. **Stripe env vars not configured = entire checkout flow returns 503.** The graceful degradation pattern returns `{ success: false, code: 'NOT_CONFIGURED' }` — which is correct behavior, but means the memberships section is non-functional until Stripe is configured. Operational fix: set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + create 4 Stripe products/prices and update `MEMBERSHIP_TIERS[*].stripePriceId` + `DROP_IN_PACK.stripePriceId` in `src/features/memberships/data.ts`.

### Performance / React 19

7. **`setProgress` every 100ms = 10 re-renders/sec for the entire hero subtree.** The `agent-browser vitals` phases list showed continuous Render+Commit cycles for 3+ seconds. Fix: drive the progress bar with a CSS `@keyframes progress-fill` animation; use `key={current}` on the fill div to restart the animation on each frame change. Zero React re-renders.

8. **`@ts-expect-error` is a silent type-safety escape hatch.** The `r2.ts` stream handling used `@ts-expect-error` to suppress the `response.Body` type mismatch. Fix: `import { Readable } from 'stream'` + `if (!(response.Body instanceof Readable)) { return null; }` — proper type narrowing with a fail-loud fallback.

9. **`toLocaleString()` without explicit locale causes SSR hydration mismatch.** The `StatBlock` component rendered `2,400` (server, en-US) vs `2.400` (client, browser locale) — a classic locale-dependent hydration error. `suppressHydrationWarning` is an anti-pattern for text nodes (React docs: "React will **not** attempt to patch mismatched text content"). Fix: use `displayValue.toLocaleString('en-US')` — deterministic, eliminates the mismatch at the source. The `animate={false}` flag during SSR means there is no animation to "mask" the visual difference.

### Testing / TDD

9. **TDD catches missing filters.** The existing query tests only tested the static-fallback path (DB throws). They didn't assert that unpublished records are filtered out — which is why the H2 bug (missing `published: true` filter) went undetected. The new `queries-published-filter.test.ts` mocks the DB to RETURN data (including unpublished rows) and asserts only published rows are returned.

10. **Mock the chainable builder, not just the throw.** The existing mock pattern was `vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable') })`. The new pattern returns a chainable mock: `{ select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ orderBy: vi.fn().mockResolvedValue(rows) })) })) })) }`. This lets you test the DB-available path without a real database.

11. **`vi.fn()` mock calls + `noUncheckedIndexedAccess`.** When extracting arguments from `vi.fn().mock.calls[0]`, TypeScript's `noUncheckedIndexedAccess` flags the result as possibly `undefined`. Use a helper: `function firstCallArg<T>(fn): T { const calls = fn.mock.calls; if (!calls.length) throw new Error('No calls'); return calls[0]![0] as T; }` — see `stripe-webhook.test.ts` for the pattern.

### Remediation v2 (2026-07-04) — Documentation vs Implementation Drift

12. **Documentation claims must be verified against code.** The H1 CSP `'unsafe-eval'` fix was claimed as "applied" across 5 separate documents (CLAUDE.md, AGENTS.md, README.md, SKILL.md, ADR-002) but was NEVER actually applied to `next.config.ts:30`. The inline comment on line 24 even said "'unsafe-eval' is intentionally absent" while line 30 explicitly included it. Lesson: grep the actual config string, don't trust the comment OR the doc. Fix: removed `'unsafe-eval'`, added `csp-policy.test.ts` regression test (6 tests).

13. **Stripe SDK v22 uses snake_case, NOT camelCase.** The webhook route's header comment (lines 17-22) claimed "Stripe SDK v22+ uses camelCase (currentPeriodEnd, cancelAtPeriodEnd)." This was FALSE — verified against `node_modules/stripe/cjs/resources/Subscriptions.d.ts`. The SDK uses snake_case: `Subscription.cancel_at_period_end` (boolean), and `current_period_end` lives on `SubscriptionItem` (access via `sub.items.data[0]?.current_period_end`), NOT on `Subscription`. The existing `as unknown as Record<string, unknown>` cast was accessing a field that doesn't exist. Fix: removed the cast, accessed fields directly, corrected the header comment (F-M3 fix).

14. **All infrastructure clients must use the same graceful-degradation pattern.** `ratelimit.ts` was the ONLY infra client importing `env` from `@/lib/env` — all others (`stripe.ts`, `r2.ts`, `replicate.ts`, `inngest/client.ts`, `email/resend.ts`) use `process.env` directly. The `env` module throws at runtime when `.env.local` is missing, which would crash any route importing the ratelimit module. Additionally, `hasRealRedis()` only checked for `'placeholder'` (build-context value) but NOT `'xxx'` (`.env.local` dev placeholder) — meaning dev envs would try to connect to `https://xxx.upstash.io`, fail, and log an error on every rate-limited request. Fix: use `process.env` + check for both placeholder patterns (F-M5 fix).

15. **`.env.local` is the Next.js runtime filename — never use it as a template.** The project committed `.env.local` (with a real `AUTH_SECRET` + dev DB password) to git because it was used as the template file. The correct template filename is `.env.example`. The `.env.local` filename is required by 4 `package.json` scripts (`drizzle:generate`, `drizzle:migrate`, `drizzle:studio`, `db:seed` via `dotenv -e .env.local`) — it cannot be renamed. Fix: created `.env.example` with placeholder values, `git rm --cached .env.local .env.docker`, deleted the duplicate `.env.docker` (F-S1 fix). **Outstanding:** the committed `AUTH_SECRET` must be rotated in production (it remains in git history).

16. **Don't document commands that don't work.** `pnpm test:e2e:live` was documented in README.md but `playwright-live.config.ts` matched a non-existent `live-site.spec.ts`. Similarly, `pnpm audit:security` and `pnpm audit:a11y` scripts referenced non-existent files in `scripts/`. Running these commands produced "No tests found" or file-not-found errors. Fix: deleted the broken config + removed the 3 script entries from `package.json` + updated README (F-S2 fix). Rule: if a command is documented, it must work — otherwise remove it.

17. **Wire external services with graceful degradation — never crash when they're not configured.** The Inngest `trial-requested` function was stubbed with `console.log` for all 3 steps — no real email was sent to coaches or members. Fix: installed `resend` package, created `src/lib/email/resend.ts` (graceful-degradation client matching the `stripe.ts` pattern), wired the 2 email steps to call `resend.emails.send()` with `console.log` fallback when `RESEND_API_KEY` is not configured. Added `RESEND_FROM_EMAIL` + `COACH_NOTIFY_EMAIL` env vars (F-M4 fix).

## Outstanding Operational Items (Require Deployment Env Access)

These items were identified in the audit but cannot be fixed in code — they require changes to the deployment environment or external services:

| #   | Item                                  | Action                                                                                                                                                                                                                                       | Impact if Unfixed                                                                                                                                               |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Deploy with production build** (C1) | Use `docker compose -f docker-compose.prod.yml up -d` OR equivalent. The Dockerfile is correct (`pnpm build` → `pnpm start`); the deployment pipeline must use it. The new `/api/health` route makes the Dockerfile HEALTHCHECK functional.  | Site runs in dev mode (5-10× slower, source maps exposed, React DevTools prompt visible, TTFB 350ms vs <100ms)                                                  |
| 2   | **Set `NEXT_PUBLIC_APP_URL`** (C2)    | Set `NEXT_PUBLIC_APP_URL=https://ironforge.jesspete.shop` in the deployment environment.                                                                                                                                                     | Sitemap + robots publish `localhost` URLs; Google indexes wrong URLs; OG metadata points to localhost                                                           |
| 3   | **Rotate committed AUTH_SECRET** (F-S1) | The `AUTH_SECRET=EWPA1F2Hav59ph/HF5cijXxZ9HdiOZVHRaIjumKnzs0=` was committed to git history. It has been untracked from the working tree, but remains in git history. Regenerate with `openssl rand -base64 32` and update in production. | The old secret is publicly visible in git history. An attacker with repo access could forge JWT sessions.                                                       |
| 4   | **Configure Stripe** (H3)             | Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Create 4 Stripe products/prices and update `MEMBERSHIP_TIERS[*].stripePriceId` + `DROP_IN_PACK.stripePriceId` in `src/features/memberships/data.ts`. | Checkout returns 503 NOT_CONFIGURED; memberships section non-functional. Webhook handlers are implemented (F-M3) but can't fire without Stripe env vars.       |
| 5   | **Apply migration 0002**              | Run `pnpm drizzle:migrate` in the deployment environment.                                                                                                                                                                                    | `published` and `order` columns remain nullable in prod DB; queries still work (Drizzle sends the WHERE clause) but type safety is not enforced at the DB level |
| 6   | **Configure Resend** (F-M4)           | Set `RESEND_API_KEY` in the deployment env. Optionally set `RESEND_FROM_EMAIL` (verified sender domain) and `COACH_NOTIFY_EMAIL` (coach team inbox).                                                                                         | Trial request emails are logged to console only; coaches don't receive notifications, members don't receive confirmations.                                      |
| 7   | **Cloudflare robots.txt** (M6)        | Move `Disallow: /admin/` directives into the Cloudflare-managed robots block, OR disable Cloudflare managed robots, OR use a `User-agent: Googlebot` block for the disallows.                                                                | Different crawlers handle multiple `User-agent: *` blocks differently; the app's `Disallow: /admin/` MAY be ignored by some crawlers                            |

## Troubleshooting

### "Site is slow / TTFB is high"

- **Check:** Is the deployment running `pnpm dev` or `pnpm start`? Open browser console — if you see `[HMR] connected` or `[Fast Refresh] rebuilding`, it's dev mode.
- **Fix:** Deploy with the production Dockerfile (`docker compose -f docker-compose.prod.yml up -d`).

### "Sitemap shows localhost URLs"

- **Cause:** `NEXT_PUBLIC_APP_URL` not set in the deployment environment.
- **Fix:** Set `NEXT_PUBLIC_APP_URL=https://your-domain.com` and redeploy. Verify with `curl https://your-domain.com/sitemap.xml | head`.

### "Checkout returns 503 NOT_CONFIGURED"

- **Cause:** Stripe env vars not set.
- **Fix:** Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Create the 4 Stripe products/prices and update `MEMBERSHIP_TIERS` + `DROP_IN_PACK` in `src/features/memberships/data.ts`.

### "TypeScript error: Type 'string' is not assignable to type 'enum'"

- **Cause:** Drizzle `varchar` column vs Zod `z.enum()` schema mismatch.
- **Fix:** Either (a) Zod-validate the DB result at runtime (see `programs/queries.ts` for the pattern), or (b) change the Drizzle column to `pgEnum` (requires migration).

### "Tests fail with 'Cannot access before initialization'"

- **Cause:** Using a plain hoisted variable inside a `vi.mock()` factory.
- **Fix:** Use `vi.hoisted()` for mock factories: `const { mock } = vi.hoisted(() => ({ mock: vi.fn() }))`.

### "TypeScript error on `response.Body` in R2 getObject"

- **Cause:** AWS SDK types `response.Body` as `StreamingBlobPayload` which is not directly iterable.
- **Fix:** Use `instanceof Readable` type narrowing (see `lib/storage/r2.ts`). Never use `@ts-expect-error`.

### "Hero reel progress bar stutters / causes re-renders"

- **Cause:** `setProgress` called every 100ms via `setInterval`.
- **Fix:** Use CSS `@keyframes progress-fill` animation with `key={current}` to restart on frame change (see `ReelProgress.tsx` + `globals.css`).
