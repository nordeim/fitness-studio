# AGENTS.md

> Compact onboarding for AI coding agents working in this repo.
> Every line answers: "Would an agent likely miss this without help?"

## Commands

```bash
pnpm install                              # Install deps (uses pnpm ≥10.26, Node ≥20)
pnpm dev                                  # Dev server on :3000 (Turbopack)
pnpm build                                # Production build
pnpm typecheck                            # tsc --noEmit (must pass — strict mode)
pnpm lint                                 # eslint . (flat config, 9.x)
pnpm test                                 # vitest run (153 unit tests)
pnpm test:e2e                             # playwright (requires `pnpm dev` running)
pnpm db:reset                             # drizzle migrate + seed (needs .env.local)
pnpm db:seed                              # seed only (idempotent via ON CONFLICT)
pnpm drizzle:generate                     # generate migration from schema diff
```

**Quality gate (must pass before commit):** `pnpm typecheck && pnpm lint && pnpm test && pnpm build`

**Pre-push hook** runs `pnpm typecheck && pnpm test` automatically.

## Architecture

5-layer golden rule (enforced by ESLint `no-restricted-imports`):

```
Layer 0  src/proxy.ts            → Edge cookie check (Next.js 16 — NOT middleware.ts)
Layer 1  src/app/                → Routes, metadata, layouts (layouts must NOT fetch data)
Layer 2  src/features/           → UI composition, queries, actions
Layer 3  src/features/*/domain/  → Pure Zod schemas + business logic (NO React/Next/DB imports)
Layer 4  src/lib/                → Infrastructure (DB, Auth, Stripe, R2, Replicate, Inngest)
```

Lower layers may never import from higher layers. Domain layer (`src/features/*/domain/`) can only use `import type` for types — no runtime imports of React, Next.js, Drizzle, etc.

## Critical Conventions (differ from defaults)

### Next.js 16
- **`middleware.ts` → `proxy.ts`:** Next.js 16 renamed this file. Export `function proxy()` not `function middleware()`. The matcher config is the same.
- **`useSearchParams()`** must be wrapped in `<Suspense>` or the build fails with CSR bailout error.
- **Async params:** Route handlers use `{ params }: { params: Promise<{ slug: string }> }` — you must `await params`.
- **`serverExternalPackages`:** Top-level key in `next.config.ts` (not under `experimental`). We list `['bcryptjs', 'stripe', 'replicate', 'inngest']`.

### Tailwind CSS v4
- **NO `tailwind.config.js`.** All tokens in `src/app/globals.css` `@theme` block. Config file is forbidden.
- **v3 → v4 renames:** `bg-gradient-to-r` → `bg-linear-to-r`, `shadow-sm` → `shadow-xs`, `outline-none` → `outline-hidden`, `ring` → `ring-3`.
- **CSS variables:** `bg-(--brand)` (parentheses), not `bg-[--brand]` (square brackets).
- **`@utility`** for custom utilities, not `@layer utilities`.
- **NEVER** use dynamic class interpolation (`bg-${color}-500`) — Tailwind purges these. Use mapping objects with full class strings.

### Auth.js v5
- **JWT strategy only** — no DB sessions. Do NOT use `DrizzleAdapter` (type mismatch with our schema + JWT doesn't need it).
- **`trustHost: true`** is mandatory in the config (prevents P0 production outage with reverse proxies).
- **Rate limit in `authorize()`:** `rateLimitAuth(ip)` is called at the top — 5 per 10 min per IP. Returns `null` on rate limit.
- **Type augmentation:** `Session.user` has `role` and `id` added via `declare module 'next-auth'`.

### Zod 4
- **Enum syntax:** `z.enum([...], { message: '...' })` — NOT `{ errorMap: () => ({ message }) }` (Zod 4 changed this).
- **UUID validation is strict:** `z.string().uuid()` requires proper v4 format (version digit `4`, variant `8/9/a/b`). Placeholder IDs like `00000000-0000-0000-0000-000000000001` FAIL validation. Use valid v4 format like `a1000000-0000-4000-8000-000000000001`.

### React 19
- **`react-hooks/set-state-in-effect`** rule is `error`. Don't call `setState` synchronously in an effect body — derive state instead, or only call `setState` inside event callbacks (setInterval, pointer events, IntersectionObserver).
- **`react-hooks/exhaustive-deps`** is `error` (not `warn`).

### Drizzle ORM
- **NEVER use `db push`** in production — always `drizzle-kit generate` + review + `migrate`.
- **`postgres()` defers connection** — safe to eager instantiate without breaking the build.
- **`prepare: false`** on the postgres client — required for PgBouncer pooled connections.
- **Migrations** are in `drizzle/` — 2 files (0000 + 0001). Generate new ones with `pnpm drizzle:generate`.

## Graceful Degradation Pattern

All infrastructure clients (`lib/stripe.ts`, `lib/r2.ts`, `lib/ai/replicate.ts`, `lib/inngest/client.ts`) follow this pattern:

```typescript
function getClient() {
  const key = process.env.KEY;
  if (!key || key.includes('placeholder')) return null;
  return new Client(key);
}
// Callers check for null and fall back to static data / placeholder SVG / error response
```

**Do NOT import `env` from `@/lib/env`** in infrastructure clients — the env module throws in dev without `.env.local`, which would crash any route that imports the client at the top level. Use `process.env` directly.

The Zod-validated `env` module (`src/lib/env.ts`) is for app-level code that needs type-safe env access. It has a build-context fallback (returns placeholders when `NEXT_PHASE=phase-production-build` or `NODE_ENV=test`).

## Testing Quirks

- **JSX in tests:** Must use `.test.tsx` extension (not `.test.ts`) — oxc parser fails on JSX in `.ts` files.
- **Mock factories:** Use `vi.hoisted()` — plain hoisted variables are `undefined` inside `vi.mock()` factory.
- **SDK constructor mocks:** Use `class` syntax, not arrow functions — `vi.fn(() => ({...}))` can't be `new`-ed.
- **DB mocks:** `vi.mock('@/lib/db/client', () => { throw new Error('DB unavailable'); })` — simulates graceful fallback. Queries should still return static data.
- **Test locations:** Vitest matches both `src/tests/unit/**/*.test.{ts,tsx}` AND `src/features/**/*.test.{ts,tsx}`.
- **Fake timers:** `vi.useFakeTimers()` + `vi.advanceTimersByTime(ms)` for time-dependent hooks (useHeroReel, useStoriesCarousel).

## Security Gotchas

- **Admin API routes:** `/api/admin/*` is protected by the edge proxy (matcher: `/admin/:path*` + `/api/admin/:path*`). The route handler ALSO checks `auth()` + `role === 'admin'` — defense in depth.
- **Inngest dev mode:** `INNGEST_DEV=1` is only set when `NODE_ENV !== 'production'`. In production, the route throws if `INNGEST_SIGNING_KEY` is missing. The build-context check (`NEXT_PHASE === 'phase-production-build'`) prevents the throw during `next build`.
- **Stripe webhook:** Reads raw body via `request.text()` — do NOT use `request.json()` (breaks signature verification).
- **SSRF:** `downloadImage()` in `lib/ai/replicate.ts` validates hostname against `['replicate.delivery', 'replicate.com']` before fetching.
- **Rate limits:** Booking (5/min), Checkout (10/min), Auth (5/10min). Upstash Redis with no-op fallback when not configured (fails open).

## File Locations (non-obvious)

- **Edge middleware:** `src/proxy.ts` (NOT `src/middleware.ts` — Next.js 16 renamed it)
- **Auth config:** `src/lib/auth/index.ts` (NOT `src/auth.ts` or `src/lib/auth.ts`)
- **Inngest functions:** `src/inngest/functions/` (NOT `src/lib/inngest/functions/`)
- **DB schema:** `src/lib/db/schema/index.ts` (barrel file — drizzle.config.ts points here)
- **Static fallback data:** `src/features/{programs,coaches,stories}/data.ts` — used when DB unavailable
- **Design tokens:** `src/app/globals.css` `@theme` block (NOT a separate file)
- **Admin routes:** `src/app/admin/(guarded)/` — route group excludes `/admin/login` from the auth layout

## Build vs Runtime

The build uses `NEXT_PHASE=phase-production-build` + `NODE_ENV=production`. The env module returns placeholders during build (so `next build` succeeds without real env vars). At runtime, real env vars MUST be set.

If you add a new route that imports a module which throws when env vars are missing, either:
1. Use dynamic import (`await import('@/lib/...')`) inside the route handler, OR
2. Add the module's env vars to the build-context fallback in `src/lib/env.ts`

## What NOT to Do

- Don't create `tailwind.config.js` or `tailwind.config.ts` — v4 is CSS-first.
- Don't use `DrizzleAdapter` — JWT strategy doesn't need it.
- Don't use `{ errorMap }` in Zod 4 enums — use `{ message }`.
- Don't import `lib/storage/r2.ts` or `lib/env.ts` in client components — they'll crash the browser.
- Don't call `setState` synchronously in a `useEffect` body — derive state instead.
- Don't use `middleware.ts` — rename to `proxy.ts` and export `proxy`.
- Don't use placeholder UUIDs like `00000000-0000-0000-0000-000000000001` — Zod 4 rejects them. Use valid v4 format.
- Don't use `bg-${color}-500` dynamic class interpolation — Tailwind purges it.
