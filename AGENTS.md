# AGENTS.md

> Compact onboarding for AI coding agents working in this repo.
> Every line answers: "Would an agent likely miss this without help?"

## Commands

```bash
pnpm install                              # Install deps (uses pnpm ≥10.26, Node ≥20.18.0 per .nvmrc)
pnpm dev                                  # Dev server on :3000 (Turbopack)
pnpm build                                # Production build
pnpm typecheck                            # tsc --noEmit (must pass — strict mode)
pnpm lint                                 # eslint . (flat config, 9.x)
pnpm test                                 # vitest run (183 unit tests)
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
- **Migrations** are in `drizzle/` — 3 files (0000 + 0001 + 0002). Generate new ones with `pnpm drizzle:generate`.
- **`.notNull()` on `.default()` columns** — `published` and `order` columns on coaches/programs/stories are `.default(X).notNull()`. Without `.notNull()`, Drizzle infers `T | null` which mismatches Zod's `z.boolean()` / `z.number()`, forcing `as unknown as` casts. Always pair `.default()` with `.notNull()` for semantically non-nullable columns.
- **Public queries filter by `published: true`** — all `getCoaches`/`getPrograms`/`getStories` queries add `.where(eq(*.published, true))`. Unpublished records never reach the public API.
- **DB results Zod-validated** — `programs/queries.ts` validates DB results via `ProgramArraySchema.safeParse()` before returning (defense-in-depth for varchar→enum narrowing).

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
- **CSP:** `script-src 'self' 'unsafe-inline'` — NO `'unsafe-eval'` (H1 fix). Next.js 16 production builds do not require `'unsafe-eval'`. `'unsafe-inline'` is required for the App Router inline runtime.
- **UUID validation:** Server actions accepting an `id` param must validate via `z.string().uuid()` BEFORE any DB call (M5 fix). See `IdSchema` in `features/coaches/actions.ts`.
- **Server action responses:** Return `{ success, code, message, field? }` — `field` is populated from Zod `issues[0].path[0]` so the client can route errors to the correct form field without substring matching (M4 fix).
- **`NEXT_PUBLIC_APP_URL` in production:** Must be set in the deployment env. Used by `metadataBase`, OG `url`, `sitemap.ts`, `robots.ts`. Without it, these publish `localhost` URLs (M1 fix).

## File Locations (non-obvious)

- **Edge middleware:** `src/proxy.ts` (NOT `src/middleware.ts` — Next.js 16 renamed it)
- **Auth config:** `src/lib/auth/index.ts` (NOT `src/auth.ts` or `src/lib/auth.ts`)
- **Inngest functions:** `src/inngest/functions/` (NOT `src/lib/inngest/functions/`)
- **DB schema:** `src/lib/db/schema/index.ts` (barrel file — drizzle.config.ts points here)
- **Static fallback data:** `src/features/{programs,coaches,stories}/data.ts` — used when DB unavailable
- **Design tokens:** `src/app/globals.css` `@theme` block (NOT a separate file)
- **Admin routes:** `src/app/admin/(guarded)/` — route group excludes `/admin/login` from the auth layout
- **Detail pages:** `src/app/{coaches,programs,stories}/[slug]/page.tsx` — Server Components with `generateStaticParams` + `generateMetadata` + `notFound()` (added in audit remediation)
- **Health check:** `src/app/api/health/route.ts` — lightweight 200 endpoint for Dockerfile HEALTHCHECK
- **Published-filter tests:** `src/tests/unit/queries-published-filter.test.ts` — regression tests for H2 (mocks DB-available path)
- **Coach action tests:** `src/features/coaches/actions.test.ts` — regression tests for M5 (UUID validation)

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
- Don't use placeholder UUIDs like `00000000-0000-0000-0000-000000000001` — Zod 4 rejects them. Use valid v4 format like `a1000000-0000-4000-8000-000000000001`.
- Don't use `bg-${color}-500` dynamic class interpolation — Tailwind purges it.
- Don't use `as unknown as` casts in queries — fix the schema (add `.notNull()`) instead (H4 fix).
- Don't use `@ts-expect-error` / `@ts-ignore` / `@ts-nocheck` — use proper type narrowing (M7 fix).
- Don't use substring matching (`message.includes('email')`) for form error routing — use the `field` property from the server response (M4 fix).
- Don't include `'unsafe-eval'` in the CSP — Next.js 16 production builds don't need it (H1 fix).
- Don't hardcode `localhost:3000` in metadata — use `process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'` (M1 fix).
- Don't use `setProgress` in `setInterval` for progress bars — use CSS `@keyframes` + `key={current}` (M8 fix).
- Don't write public queries without `.where(eq(*.published, true))` — unpublished records would leak (H2 fix).
- Don't accept `id: string` in server actions without `z.string().uuid()` validation (M5 fix).
- Don't use `toLocaleString()` without explicit locale in Client Components — SSR uses Node's default locale, client uses browser locale, causing hydration mismatch (e.g., `2,400` vs `2.400`). Use `toLocaleString('en-US')`.
- Don't use `suppressHydrationWarning` on text nodes as a hydration fix — React docs state it will "not attempt to patch mismatched text content", leaving server-rendered text permanently in the DOM. Fix the source of the mismatch instead.

## Troubleshooting

### "Hydration failed: server rendered text didn't match"

- **Cause:** `toLocaleString()` uses server locale for SSR, client locale for hydration. Numbers format differently (e.g., `2,400` vs `2.400`).
- **Fix:** Use `toLocaleString('en-US')` for deterministic output. Never use `suppressHydrationWarning` on text nodes — React will not patch the mismatch, leaving server text permanently in the DOM.

## Outstanding Operational Items (Deployment Env — Not Code-Fixable)

| #   | Item                               | Action                                                                                                                                                                     |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Deploy with prod build** (C1)    | Use `docker compose -f docker-compose.prod.yml up -d`. Don't run `pnpm dev` in production.                                                                                 |
| 2   | **Set `NEXT_PUBLIC_APP_URL`** (C2) | Set to `https://your-domain.com` in deployment env. Used by sitemap, robots, metadataBase, OG.                                                                             |
| 3   | **Configure Stripe** (H3)          | Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + create 4 products/prices + update `MEMBERSHIP_TIERS`/`DROP_IN_PACK` in `data.ts`. |
| 4   | **Apply migration 0002**           | Run `pnpm drizzle:migrate` in deployment env. Adds `NOT NULL` to `published` + `order` columns.                                                                            |
| 5   | **Cloudflare robots** (M6)         | Move `Disallow: /admin/` into the Cloudflare-managed block, or disable CF managed robots.                                                                                  |
