# IRONFORGE — Lessons Learned

> Distilled from 11 phases of implementation (Phases 0–11).
> Each lesson is hard-earned context that took reading multiple files or hitting a real bug to discover.
> Reference: Skills KB §17 (T0–T8 lessons from `nextjs16-react19-next-auth5-drizzle-orm`).

---

## Architecture Lessons (A1–A5)

### A1: 5-Layer Architecture Enforcement via ESLint

**Lesson:** The 5-layer golden rule (proxy → app → features → domain → lib) is only as good as its enforcement. Without the ESLint `no-restricted-imports` rule on `src/features/*/domain/**/*.ts`, domain schemas would gradually accumulate React/Next/DB imports, breaking testability.

**Implementation:** The ESLint rule blocks imports of `react`, `next/*`, `drizzle-orm`, `postgres`, `@auth/*`, `inngest`, `stripe`, `replicate`, `@upstash/*`, `@aws-sdk/*` in domain files. `allowTypeImports: true` permits `import type { X } from '@/lib/db/schema'`.

**Phase:** 0 (setup)

### A2: Graceful Degradation Pattern for All Infrastructure

**Lesson:** Every infrastructure client (DB, Stripe, R2, Replicate, Inngest, Upstash) must gracefully degrade to `null` when env vars are missing. This allows the marketing site to render in dev, build, and CI without any external services.

**Implementation:** All infrastructure clients use `process.env` directly (NOT the Zod-validated `env` module) with a `getEnv()` helper that returns `null` for placeholder values. Callers check for `null` and fall back to static data, placeholder SVGs, or error responses.

**Critical:** Do NOT import `env` from `@/lib/env` in infrastructure clients — the env module throws in dev without `.env.local`, which would crash any route that imports the client at the top level.

**Phase:** 5 (data layer) — pattern established; 6–8 (booking, Stripe, AI) — applied consistently

### A3: Dynamic Imports for DB in Queries/Actions

**Lesson:** Server actions and queries use `await import('@/lib/db/client')` inside try/catch blocks. This defers the DB connection until the action is actually called, preventing module-load crashes when env vars are missing.

**Implementation:**
```typescript
export async function getPrograms() {
  try {
    const { db } = await import('@/lib/db/client');
    const result = await db.select().from(programs);
    return result;
  } catch {
    return STATIC_PROGRAMS; // fallback
  }
}
```

**Phase:** 5 (data layer)

### A4: Build-Context Fallback in Env Module

**Lesson:** The Zod-validated env module must return placeholder values during `next build` (when `NEXT_PHASE=phase-production-build`) and during tests (when `NODE_ENV=test`). Without this, `next build` fails because env vars are not set in CI.

**Implementation:** `src/lib/env.ts` checks `isBuildContext()` at the top of `loadEnv()`. If true, returns a hardcoded object of placeholder values. If false (runtime), validates via Zod and throws on missing required vars.

**Phase:** 0 (env module)

### A5: Server Components Fetch Data, Layouts Don't

**Lesson:** In the 5-layer architecture, layouts (Layer 1) must NOT fetch data. Data fetching happens in page components or feature sections (Layer 2). This keeps layouts fast (cached) and moves data dependencies to the edges.

**Implementation:** `src/app/(marketing)/layout.tsx` only renders structural components (header, footer, grain, sticky CTA, Toaster). The home page (`page.tsx`) composes async Server Components (`ProgramsSection`, `CoachesSection`, `StoriesSection`) that fetch their own data.

**Phase:** 2 (layout primitives) + 5 (data layer)

---

## Framework Lessons (F1–F8)

### F1: Next.js 16 Renamed `middleware.ts` → `proxy.ts`

**Lesson:** Next.js 16 deprecated the `middleware` file convention. The file must be named `proxy.ts` and the export must be `function proxy()`, not `function middleware()`. The build fails with "Proxy is missing expected function export name" if the old convention is used.

**Phase:** 9 (auth + admin) — discovered when build failed

### F2: `useSearchParams()` Requires Suspense

**Lesson:** In Next.js 16, any component using `useSearchParams()` must be wrapped in a `<Suspense>` boundary. Without it, the build fails with "useSearchParams() should be wrapped in a suspense boundary" during static prerendering.

**Implementation:** The admin login page wraps the `LoginForm` component in `<Suspense fallback={<LoginLoading />}>`.

**Phase:** 9 (auth + admin) — discovered when build failed

### F3: Next.js 16 Async Route Params

**Lesson:** In Next.js 16, route handler `params` are now `Promise<T>`, not `T`. You must `await params` before accessing properties.

**Implementation:**
```typescript
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  // ...
}
```

**Phase:** 5 (data layer — API routes)

### F4: `serverExternalPackages` Is Top-Level (Not Under `experimental`)

**Lesson:** In Next.js 16, `serverExternalPackages` moved from `experimental.serverExternalPackages` to a top-level key in `next.config.ts`. The TypeScript type `ExperimentalConfig` doesn't include it under `experimental`.

**Implementation:**
```typescript
const nextConfig: NextConfig = {
  serverExternalPackages: ['bcryptjs', 'stripe', 'replicate', 'inngest'],
  // NOT: experimental: { serverExternalPackages: [...] }
};
```

**Phase:** 0 (config setup) — discovered via TypeScript error

### F5: Tailwind v4 CSS-First — No `tailwind.config.js`

**Lesson:** Tailwind v4 uses CSS-first configuration. All tokens live in the `@theme` block in `globals.css`. The `tailwind.config.js` file is forbidden. Custom utilities use `@utility`, not `@layer utilities`.

**v3 → v4 renames:** `bg-gradient-to-r` → `bg-linear-to-r`, `shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`, `ring` → `ring-3`, `bg-[--brand]` → `bg-(--brand)`.

**Phase:** 1 (design tokens)

### F6: Zod 4 Enum Syntax Changed

**Lesson:** Zod 4 changed the enum error configuration from `{ errorMap: () => ({ message }) }` to `{ message: '...' }`. The old syntax causes a TypeScript error.

**Implementation:**
```typescript
// Zod 3 (OLD):
z.enum([...], { errorMap: () => ({ message: 'Select a goal' }) })

// Zod 4 (NEW):
z.enum([...], { message: 'Select a goal' })
```

**Phase:** 6 (booking flow) — discovered via TypeScript error

### F7: Zod 4 UUID Validation Is Strict

**Lesson:** Zod 4's `z.string().uuid()` requires proper UUID v4 format: version digit must be `4`, variant digit must be `8`, `9`, `a`, or `b`. Placeholder IDs like `00000000-0000-0000-0000-000000000001` FAIL validation.

**Fix:** All static data uses valid v4 format: `a1000000-0000-4000-8000-000000000001` (coaches), `b1000000-0000-4000-8000-000000000001` (programs), `c1000000-0000-4000-8000-000000000001` (stories).

**Phase:** 5 (data layer) — discovered via API route 500 error

### F8: Inngest v4 `createFunction` Signature Changed

**Lesson:** Inngest v4 changed `createFunction` from 3 arguments (config, trigger, handler) to 2 arguments (config with `triggers` array, handler). The trigger is now in the config object.

**Implementation:**
```typescript
// Inngest v3 (OLD):
inngest.createFunction({ id: 'fn' }, { event: 'event.name' }, async ({ event, step }) => { ... })

// Inngest v4 (NEW):
inngest.createFunction({ id: 'fn', triggers: [{ event: 'event.name' }] }, async ({ event, step }) => { ... })
```

**Phase:** 6 (booking flow) — discovered via TypeScript error

---

## React 19 Lessons (R1–R3)

### R1: `react-hooks/set-state-in-effect` Rule

**Lesson:** React 19's ESLint plugin enforces that `setState` must NOT be called synchronously in a `useEffect` body. This causes cascading renders. Instead, derive state from props/other state, or only call `setState` inside event callbacks (setInterval, pointer events, IntersectionObserver callbacks).

**Implementation:** `useHeroReel` derives `isPlaying` from `shouldPlay` (a computed boolean) instead of syncing via `useEffect`. The progress bar's `setProgress` calls happen inside `setInterval` callback (event context, not effect context).

**Phase:** 3 (hero reel) + 4 (stat block) — discovered via ESLint error

### R2: `react-hooks/exhaustive-deps` Is `error` (Not `warn`)

**Lesson:** The project enforces `react-hooks/exhaustive-deps: 'error'` (not `'warn'`). This matches the strictness of `@typescript-eslint/no-explicit-any: 'error'`. All effect dependencies must be exhaustive — no exceptions.

**Phase:** 0 (ESLint config)

### R3: Client Component `"use client"` Only at Leaves

**Lesson:** Server Components are the default. `"use client"` should only be at the leaves — components that need hooks, event handlers, or browser APIs. This keeps the client bundle small and enables server-side data fetching.

**Implementation:** Async Server Components (`ProgramsSection`, `CoachesSection`, `StoriesSection`, `BookingSection`) fetch data and pass it as props to Client Components (`ProgramGrid`, `CoachFlipGrid`, `StoriesCarousel`, `BookingForm`).

**Phase:** 2–4 (layout + sections)

---

## Security Lessons (S1–S5)

### S1: Inngest Dev Mode Must Be Gated Behind `NODE_ENV`

**Lesson:** The Inngest serve route auto-sets `INNGEST_DEV=1` when `INNGEST_SIGNING_KEY` is missing. In production, this silently disables signature verification, allowing unauthenticated POSTs to `/api/inngest` that can trigger Replicate calls (real money cost) or spam.

**Fix:** Gate `INNGEST_DEV=1` behind `NODE_ENV !== 'production'`. In production, throw if `INNGEST_SIGNING_KEY` is missing. Also check for build context (`NEXT_PHASE === 'phase-production-build'`) to avoid throwing during `next build`.

**Phase:** 10 (security audit) — P1 fix

### S2: Login Rate Limiting Must Be Wired (Not Just Defined)

**Lesson:** The `rateLimitAuth` function was defined in `src/lib/ratelimit.ts` but never called. The Auth.js `authorize()` function had no rate limiting, allowing brute-force attacks against the admin account.

**Fix:** Wire `rateLimitAuth(ip)` into `authorize()` at the top, before the DB lookup. Returns `null` on rate limit. IP is extracted from `x-forwarded-for` header via `next/headers`.

**Phase:** 10 (security audit) — P1 fix

### S3: Stripe Checkout Needs Idempotency Key

**Lesson:** Without an `idempotency_key`, double-clicks or network retries create duplicate Stripe Checkout Sessions. While Stripe deduplicates at the payment level, this wastes API quota and can confuse users.

**Fix:** Pass `crypto.randomUUID()` as the second argument to `stripe.checkout.sessions.create(data, { idempotencyKey })`.

**Phase:** 10 (security audit) — P2 fix

### S4: SSRF Protection on Image Download

**Lesson:** The `downloadImage(url)` function fetches a URL returned by Replicate. If Replicate is compromised or if an attacker finds a way to influence the output URL, this would fetch arbitrary URLs from the server (SSRF).

**Fix:** Validate the URL hostname against an allowlist (`['replicate.delivery', 'replicate.com']`) before fetching. Throw if the hostname is not allowed.

**Phase:** 10 (security audit) — P2 fix

### S5: Admin API Routes Need Defense in Depth

**Lesson:** The `/api/admin/assets/generate` route had its auth check commented out (from Phase 8). The edge proxy matcher only covered `/admin/:path*`, not `/api/admin/:path*`. Anyone could trigger Replicate SDXL calls with arbitrary prompts.

**Fix:** 1) Uncomment the auth check in the route handler. 2) Extend the proxy matcher to `['/admin/:path*', '/api/admin/:path*']`. 3) Server actions call `requireAdmin()` before mutations.

**Phase:** 10 (security audit) — P1 fix

---

## Accessibility Lessons (A11Y-1–A11Y-3)

### A11Y-1: `--color-muted` Must Pass AA-Normal Contrast

**Lesson:** The original `--color-muted: #6a6a6a` had a contrast ratio of 3.66:1 on `#0a0a0a` background — failing WCAG AA-normal (requires 4.5:1). This token was used for form labels, telemetry text, and captions throughout the site.

**Fix:** Raised to `#8a8a8a` (5.5:1 — passes AA-normal). Updated the brand-token test to verify ≥4.5:1 instead of verifying it fails.

**Phase:** 10 (WCAG audit) — P1 fix

### A11Y-2: Global Focus-Visible Rule for All Interactive Elements

**Lesson:** Links (`<a>`, `<Link>`) lacked `focus-visible` styles. Keyboard users had no visible focus indicator when tabbing through navigation, footer links, or card CTAs. Adding `focus-visible` to every Link individually would be error-prone.

**Fix:** Added a global CSS rule in `globals.css` base layer: `a[href]:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`. This catches every interactive element site-wide.

**Phase:** 10 (WCAG audit) — P1 fix

### A11Y-3: Touch Targets Must Be ≥44×44 CSS Pixels

**Lesson:** Icon buttons were `h-10 w-10` (40×40), carousel dots were `h-0.5 w-2` (2×8). Both fail WCAG AAA §2.5.5 (44×44 minimum).

**Fix:** Bumped all icon buttons to `h-11 w-11` (44×44). Wrapped carousel dots in `min-h-11 min-w-11` tap target containers with the visible 2px bar inside.

**Phase:** 10 (WCAG audit) — P1 fix

---

## Testing Lessons (T1–T4)

### T1: JSX Tests Must Use `.test.tsx` Extension

**Lesson:** The oxc parser (used by Vitest) fails on JSX in `.test.ts` files with `[PARSE_ERROR] Expected '>' but found 'Identifier'`. Tests with JSX (e.g., `render(<Component />)`) must use the `.test.tsx` extension.

**Phase:** 4 (goal selector test)

### T2: `vi.hoisted()` for Mock Factories

**Lesson:** Variables declared outside `vi.mock()` are hoisted, but the mock factory runs before the variable is initialized. This causes `Cannot access 'mockFn' before initialization`. Use `vi.hoisted()` to create mock factories that are available at hoist time.

**Phase:** 5 (query tests)

### T3: Class Syntax for SDK Constructor Mocks

**Lesson:** Arrow function mocks (`vi.fn(() => ({ send: vi.fn() }))`) cannot be `new`-ed. SDKs like `@aws-sdk/client-s3` use `new S3Client()`. Use `class` syntax instead: `class MockS3Client { send = vi.fn(); }`.

**Phase:** 8 (AI asset generation tests)

### T4: DB Mock Pattern for Graceful Fallback Testing

**Lesson:** To test the static fallback path, mock the DB client to throw: `vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable'); })`. The query function should catch this and return static data. This verifies the graceful degradation pattern works.

**Phase:** 5 (query tests)

---

## T0–T8 Lessons (from `nextjs16-react19-next-auth5-drizzle-orm` skill)

These lessons were extracted from the skill's SKILL.md and verified against the IRONFORGE codebase:

| ID | Lesson | Applied In |
|---|---|---|
| T0 | `pnpm-workspace.yaml` requires `packages: ['.']` even for single-package repos | Phase 0 |
| T1 | Client components must NEVER import `lib/storage/r2.ts` (env crash) | Phase 8 |
| T2 | `trustHost: true` mandatory for reverse-proxy Auth.js | Phase 9 |
| T3 | `OPENAI_API_KEY.startsWith('sk-')` is not too strict | N/A (not using OpenAI) |
| T4 | Model IDs should be env-configurable with format validation | Phase 8 (Replicate) |
| T5 | Silent fail-open policies are dangerous — log when skipping | Phase 8 (Inngest asset-generate) |
| T6 | SSE on Vercel needs both server + client resilience | N/A (not using SSE in v1) |
| T7 | `putObject` needs a size guard (500 MB) | Phase 8 (R2) |
| T8 | CI should run full quality gate, not just lint-staged | Phase 0 (GitHub Actions) |

---

*End of Lessons Learned.*
