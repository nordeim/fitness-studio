---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# IRONFORGE

## Core Identity & Purpose

IRONFORGE is a production-grade marketing + booking + memberships + admin website for a high-end strength & conditioning studio. Built with Next.js 16, React 19, Tailwind CSS v4, Drizzle ORM, Auth.js v5, Inngest, Stripe, and Replicate. The project follows a 5-layer architecture with server-first rendering and graceful degradation when external services are not configured.

**Key technical decision:** All infrastructure clients (DB, Stripe, R2, Replicate, Inngest) use `process.env` directly with `null` fallbacks — NOT the Zod-validated `env` module — to avoid crashes in dev without `.env.local`.

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

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server (Turbopack) on :3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint flat config |
| `pnpm test` | Vitest run (153 unit tests) |
| `pnpm test:e2e` | Playwright (requires dev server) |
| `pnpm format` | Prettier write |
| `pnpm drizzle:generate` | Generate migration from schema diff |
| `pnpm drizzle:migrate` | Apply migrations |
| `pnpm db:seed` | Seed (8 coaches + 9 programs + 6 stories + 48 slots) |
| `pnpm db:reset` | Migrate + seed in one command |

### Quality Gate (run before every commit)

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

This is enforced by Husky `pre-push` hook + GitHub Actions CI.

## Testing Strategy

### Test Pyramid
- **Unit Tests (153):** Vitest + jsdom — brand tokens, hooks, schemas, queries, server actions
- **E2E Tests (8 specs):** Playwright Chromium — hero, programs, coaches, stories, booking, memberships, auth, SEO

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
- 2 migrations: `drizzle/0000_majestic_triathlon.sql` + `drizzle/0001_colossal_anthem.sql`
- Seed: `pnpm db:seed` (idempotent via `ON CONFLICT DO NOTHING`)
- **Queries pattern:** DB-first with static fallback — `try { db } catch { return STATIC_DATA }`

### Environment Variables
- **Runtime:** Validated by `src/lib/env.ts` (Zod schema, throws on missing)
- **Build context:** Returns placeholders when `NEXT_PHASE=phase-production-build` or `NODE_ENV=test`
- **Infrastructure clients:** Use `process.env` directly (NOT `env` module) to avoid crash in dev
- See `.env.example` for the full list

### Graceful Degradation Pattern

All infrastructure clients follow this pattern:
```typescript
function getClient() {
  const key = process.env.KEY;
  if (!key || key.includes('placeholder')) return null;
  return new Client(key);
}
// Callers check for null and fall back to static data / placeholder
```

### Security Checklist
- Rate limit: booking (5/min), checkout (10/min), auth (5/10min)
- Honeypot on booking form (`company_website` field)
- Stripe webhook signature verification
- SSRF allowlist on `downloadImage()` (replicate.delivery only)
- Admin auth: edge proxy → layout session check → action role check
- CSP + HSTS + X-Frame-Options + nosniff + Referrer-Policy + Permissions-Policy

## Anti-Patterns to Avoid

- **`process.env.*` direct access in app code:** Always import `env` from `@/lib/env` for app logic. Infrastructure clients (`lib/stripe.ts`, `lib/r2.ts`, etc.) are the exception — they use `process.env` directly for graceful degradation.
- **`DrizzleAdapter` with JWT strategy:** Don't use it — JWT doesn't need DB sessions, and the adapter's type expectations conflict with our schema.
- **`middleware.ts` filename:** Next.js 16 renamed to `proxy.ts`. Export `proxy` not `middleware`.
- **`{ errorMap }` in Zod 4:** Use `{ message }` instead.
- **Dynamic class interpolation in Tailwind:** `bg-${color}-500` is purged. Use mapping objects or full class strings.
- **`tailwind.config.js`:** Forbidden in v4. All tokens in `globals.css` `@theme` block.
- **Client component importing `lib/storage/r2.ts`:** Will crash — `r2.ts` imports env validation which fails in browser. Server Component signs URL, passes as prop.
- **`setState` in effect body:** React 19 `react-hooks/set-state-in-effect` rule. Derive state instead, or use `setState` only in event callbacks (setInterval, pointer events).
