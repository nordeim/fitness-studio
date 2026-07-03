# IRONFORGE — Architecture Document

> Comprehensive system architecture for the IRONFORGE fitness studio platform.
> Covers the 5-layer model, request flows, data model, security topology, and deployment.

---

## 1. System Overview

IRONFORGE is a server-first Next.js 16 application with a 5-layer architecture. The marketing site is publicly accessible and renders with zero client-side JavaScript for data fetching (Server Components). Auth-gated admin routes require a valid JWT session cookie. External services (Postgres, Stripe, R2, Replicate, Inngest, Upstash) are integrated with graceful degradation — the site renders fully when any subset of services is unavailable.

### High-Level Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│   React 19 Client Components (hero, carousel, forms, admin)    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Edge (Vercel / Cloudflare)                     │
│   src/proxy.ts — cookie check on /admin/* + /api/admin/*       │
│   CSP + HSTS + Security Headers (next.config.ts)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js 16 Server (Node.js)                    │
│                                                                 │
│  Layer 1: src/app/        Routes + Metadata + Suspense         │
│  Layer 2: src/features/   UI Composition + Queries + Actions   │
│  Layer 3: src/features/*/domain/  Pure Zod Schemas (no runtime)│
│  Layer 4: src/lib/        Infrastructure Clients               │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ │
│  │ Drizzle │ │Auth.js  │ │ Inngest │ │ Stripe  │ │Replicate │ │
│  │  ORM    │ │  v5 JWT │ │ Client  │ │ Client  │ │  Client  │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └─────┬────┘ │
└───────┼───────────┼───────────┼───────────┼────────────┼──────┘
        │           │           │           │            │
        ▼           ▼           ▼           ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│PostgreSQL│ │  (JWT    │ │ Inngest  │ │  Stripe  │ │Replicate │
│  (Neon)  │ │  stateless)│ │  Cloud   │ │   API    │ │   SDXL   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
                                                 │
                                                 ▼
                                          ┌──────────┐
                                          │Cloudflare│
                                          │    R2    │
                                          └──────────┘
```

---

## 2. 5-Layer Architecture

### Layer 0 — Edge Proxy (`src/proxy.ts`)

- **Runtime:** Edge (V8 isolate, no Node.js APIs)
- **Purpose:** Cookie presence check on `/admin/*` and `/api/admin/*` routes
- **No DB access** — just reads the `authjs.session-token` cookie
- **Redirect:** If no cookie, redirect to `/admin/login?callbackUrl=...`
- **Note:** Next.js 16 renamed `middleware.ts` → `proxy.ts`. Export name is `proxy`, not `middleware`.

### Layer 1 — App Router (`src/app/`)

- **Runtime:** Node.js (Server Components) + Browser (Client Components)
- **Purpose:** Route structure, metadata, Suspense boundaries, error pages
- **Rule:** Layouts must NOT fetch data — data fetching happens in page components or feature sections
- **Route groups:**
  - `(marketing)/` — public site (layout: header + footer + grain + sticky CTA + Toaster)
  - `admin/login/` — auth form (no layout guard)
  - `admin/(guarded)/` — admin pages (layout: session + role check)
  - `api/` — 17 API routes

### Layer 2 — Features (`src/features/`)

- **Runtime:** Node.js (Server Components + Server Actions)
- **Purpose:** UI composition, data binding, mutations
- **Structure per feature:**
  ```
  src/features/<feature>/
  ├── data.ts              # Static fallback data
  ├── domain/
  │   └── schemas.ts       # Zod schemas (pure, no runtime imports)
  ├── queries.ts           # DB-first with static fallback
  ├── actions.ts           # Server actions ('use server')
  └── <Component>.tsx      # Client component (if interactive)
  ```
- **Features:** booking, coaches, programs, stories, memberships, assets

### Layer 3 — Domain (`src/features/*/domain/`)

- **Runtime:** None (pure TypeScript)
- **Purpose:** Zod schemas, type definitions, factory functions
- **Enforcement:** ESLint `no-restricted-imports` prevents importing React, Next.js, Drizzle, or any runtime infrastructure. Only `import type` is allowed.
- **Example:** `src/features/booking/domain/schemas.ts` exports `TrialRequestSchema`, `TrialRequestInput`, `getMockTrialRequest()`

### Layer 4 — Infrastructure (`src/lib/`)

- **Runtime:** Node.js (server-only)
- **Purpose:** External service clients
- **Clients:**
  - `lib/db/` — Drizzle ORM + postgres driver + schema + seed
  - `lib/auth/` — Auth.js v5 config (Credentials + JWT)
  - `lib/stripe.ts` — Stripe client (graceful degradation)
  - `lib/inngest/client.ts` — Inngest client + event types
  - `lib/ai/replicate.ts` — Replicate SDXL client
  - `lib/storage/r2.ts` — Cloudflare R2 S3 client
  - `lib/ratelimit.ts` — Upstash Redis sliding window
  - `lib/env.ts` — Zod env validation (build-context fallback)

### Golden Rule

> A lower layer may never import from a higher layer. Domain may import types from Infrastructure but never runtime code.

---

## 3. Request Flows

### 3.1 Marketing Page Render (Home)

```
Browser → GET / → Edge Proxy (pass-through) → Next.js Server
  → (marketing)/page.tsx (async Server Component)
    → ProgramsSection() → getPrograms() → DB or STATIC_PROGRAMS
    → CoachesSection() → getCoaches() → DB or STATIC_COACHES
    → StoriesSection() → getStories() → DB or STATIC_STORIES
    → BookingSection() → getCoaches() (for dropdown)
    → MembershipsSection() (static data)
  → HTML streamed to browser
  → Client Components hydrate (HeroReel, StoriesCarousel, BookingForm, etc.)
```

### 3.2 Booking Form Submission

```
Browser → POST (Server Action: submitTrialRequest)
  → Rate limit check (Upstash, 5/min, fallback: allow)
  → Zod validation (TrialRequestSchema)
  → Honeypot check (company_website must be empty)
  → Generate idempotency key (UUID v4)
  → DB insert (trial_requests table, ON CONFLICT DO NOTHING)
  → Inngest event send ('trial.requested')
    → Inngest function 'trial-requested' (3 steps):
      1. notify-coach (console.log — Phase 12 wires Resend email)
      2. confirm-member (console.log)
      3. schedule-followup (console.log)
  → Return { success: true, requestId }
  → Client shows toast, resets form
```

### 3.3 Stripe Checkout

```
Browser → POST /api/checkout { tier: 'forge_plus' }
  → Rate limit (10/min)
  → Zod validation (CheckoutRequestSchema)
  → Look up tier → get stripePriceId
  → stripe.checkout.sessions.create({ mode: 'subscription', ... }, { idempotencyKey })
  → Return { url: checkoutSession.url }
  → Browser redirects to Stripe Checkout
  → User completes payment on Stripe
  → Stripe sends webhook → POST /api/stripe/webhook
    → Verify signature (raw body + stripe-signature header)
    → Handle 'checkout.session.completed' → console.log (Phase 9 wires DB update)
  → User redirected to /booking/confirm?checkout=success
```

### 3.4 Admin Login

```
Browser → GET /admin → Edge Proxy
  → No session cookie → 307 redirect to /admin/login?callbackUrl=/admin
Browser → GET /admin/login → render login form
Browser → POST (signIn('credentials', { email, password }))
  → Auth.js authorize()
    → Rate limit (5/10min per IP)
    → DB lookup (users table by email)
    → bcrypt.compare(password, user.passwordHash)
    → If valid: create JWT (includes role + id) → set cookie
    → If invalid: return null (generic error)
  → Redirect to /admin
  → Edge Proxy: cookie present → pass through
  → (guarded)/layout.tsx: auth() → session.user.role === 'admin'?
    → Yes: render admin nav + page content
    → No: redirect to /admin/login
```

### 3.5 AI Asset Generation

```
Admin → POST /api/admin/assets/generate { type, entitySlug }
  → Auth check (admin role)
  → Zod validation (AssetGenerationRequestSchema)
  → If Replicate + R2 configured:
    → Inngest event send ('asset.generate')
    → Inngest function 'asset-generate' (3 steps):
      1. replicate: generateNoirImage(prompt) → SDXL → output URL
      2. upload: downloadImage(url) [SSRF-validated] → putObject to R2
      3. notify: console.log (Phase 9 wires DB update)
  → If not configured:
    → Return placeholder SVG immediately (generatePlaceholderSvg)
```

---

## 4. Data Model

### Entity Relationship

```
users (1) ──── (N) accounts          [Auth.js OAuth accounts]
users (1) ──── (N) sessions          [Auth.js DB sessions — unused with JWT]
users (1) ──── (N) subscriptions     [Stripe membership billing]

coaches (1) ── (N) programs          [Coach leads programs]
programs (1) ─ (N) class_slots       [Weekly schedule]
coaches (1) ── (N) class_slots       [Coach teaches slots]

trial_requests ── (N:1) coaches      [Preferred coach (optional)]
trial_requests ── (N:1) programs     [Via goal field — not FK]

stories ── (N:1) programs            [Via programSlug — not FK]
```

### Tables (11 total)

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Auth.js users + admin role | id, email, passwordHash, role |
| `accounts` | Auth.js OAuth accounts | userId, provider, providerAccountId |
| `sessions` | Auth.js DB sessions (unused — JWT) | sessionToken, userId, expires |
| `verification_tokens` | Auth.js email verification | identifier, token, expires |
| `coaches` | Coach profiles | slug, name, title, bio, certifications[], specialties[] |
| `programs` | Training programs | slug, goal, title, duration, priceCents, coachId |
| `stories` | Member transformations | slug, memberName, weeks, quote, beforeKey, afterKey |
| `class_slots` | Weekly class schedule | programId, coachId, startsAt, capacity |
| `trial_requests` | Booking form submissions | name, email, goal, preferredTime, idempotencyKey |
| `newsletter_subs` | Email newsletter | email, consentAt, source |
| `subscriptions` | Stripe membership billing | userId, stripeCustomerId, stripeSubscriptionId, tier, status |

### Migration History

| Migration | Tables Created | Date |
|---|---|---|
| `0000_majestic_triathlon.sql` | 10 tables (all except subscriptions) | Phase 5 |
| `0001_colossal_anthem.sql` | subscriptions + subscription_status enum | Phase 7 |

---

## 5. Security Topology

### Defense in Depth (4 layers)

```
Layer 1: Edge Proxy (src/proxy.ts)
  → Cookie presence check on /admin/* + /api/admin/*
  → Fast (edge runtime, no DB)
  → Redirects to /admin/login if no cookie

Layer 2: Admin Layout (src/app/admin/(guarded)/layout.tsx)
  → getServerSession() — full JWT verification
  → Role check: session.user.role === 'admin'
  → Redirects to /admin/login if not admin

Layer 3: Server Actions (src/features/coaches/actions.ts)
  → requireAdmin() at the top of every action
  → Returns { success: false, code: 'UNAUTHORIZED' } if not admin

Layer 4: API Routes (src/app/api/admin/assets/generate/route.ts)
  → auth() + role check
  → Returns 401 if not admin
```

### Rate Limiting

| Endpoint | Limit | Window | Fallback |
|---|---|---|---|
| Booking form | 5 | 1 min | Allow (no-op) |
| Checkout | 10 | 1 min | Allow |
| Admin login | 5 | 10 min | Allow |

### Security Headers (next.config.ts)

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.stripe.com https://js.stripe.com; media-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |

---

## 6. Deployment Architecture

### Production (Vercel)

```
GitHub repo → Vercel auto-deploy (main branch)
  → Build: next build (Turbopack)
  → Runtime: Vercel Edge (proxy) + Vercel Serverless (Node.js)
  → Env vars: set in Vercel dashboard (all 26 vars)
  → Database: Neon Postgres (pooled + unpooled connections)
  → Storage: Cloudflare R2 (S3-compatible)
  → Rate limiting: Upstash Redis
  → Job queue: Inngest Cloud
  → Payments: Stripe
  → AI: Replicate
  → Email: Resend
```

### CI/CD Pipeline

```
GitHub PR → GitHub Actions (ci.yml)
  → pnpm install --frozen-lockfile
  → pnpm lint
  → pnpm typecheck
  → pnpm test
  → pnpm format:check
  → pnpm build (NEXT_PHASE=phase-production-build)
  → All green → merge to main → Vercel auto-deploy
```

### Pre-commit Hooks (Husky)

| Hook | Command |
|---|---|
| pre-commit | `pnpm lint-staged` (ESLint + Prettier on staged files) |
| pre-push | `pnpm typecheck && pnpm test` |

---

## 7. Performance Architecture

### Rendering Strategy

| Route | Strategy | Rationale |
|---|---|---|
| `/` (home) | Static + Server Components | Data fetched at build/request time; HTML streamed |
| `/admin/*` | Dynamic (force-dynamic) | Auth session per request |
| `/api/*` | Dynamic | Per-request data |
| `/booking/confirm` | Static | No data fetching |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Static | Generated at build time |

### Image Optimization

- All images via `next/image` with AVIF + WebP formats
- Hero first frame: `priority` + `fetchpriority="high"` (LCP candidate)
- All other images: `loading="lazy"` + responsive `sizes` attribute
- B&W noir filter: CSS `filter: grayscale(100%) contrast(1.55) brightness(0.42)` (GPU-composited)

### Animation Strategy

- **CSS-only** — no Framer Motion, no GSAP, no Lottie
- 5 `@keyframes` in `@theme` block: `pulse-cta`, `marquee`, `ken-burns`, `wave`, `rec-blink`
- All animations use `transform` + `opacity` only (compositor-friendly)
- `prefers-reduced-motion` disables all animations via global `@media` block
- JavaScript-driven motion (parallax, carousel drag) uses `requestAnimationFrame` + `will-change: transform`

### Bundle Budget

| Metric | Budget | Actual | Status |
|---|---|---|---|
| Initial JS (gzipped) | < 250 KB | ~385 KB | ⚠️ Over (framework cost) |
| Largest route chunk | < 80 KB | ~50 KB | ✅ Pass |
| Image weight (above fold) | < 200 KB | ~150 KB | ✅ Pass |

The bundle exceeds budget due to Next.js 16 + React 19 framework cost (~573 KB raw). App-specific code is well-code-split via dynamic imports + server components.

---

## 8. Observability

### Logging

| Event | Level | Location |
|---|---|---|
| Auth login success | `console.info` | `lib/auth/index.ts` |
| Auth login failure | `console.warn` | `lib/auth/index.ts` |
| Booking DB insert failure | `console.error` | `features/booking/actions.ts` |
| Inngest send failure | `console.error` | `features/booking/actions.ts` |
| Stripe webhook events | `console.log` | `api/stripe/webhook/route.ts` |
| Stripe signature failure | `console.error` | `api/stripe/webhook/route.ts` |
| Inngest function steps | `console.log` | `inngest/functions/*.ts` |
| Replicate/R2 skip | `console.warn` | `inngest/functions/asset-generate.ts` |

### Sentry (Phase 13)

- `SENTRY_DSN` is plumbed through `env.ts` (optional)
- Sentry SDK not yet initialized — Phase 13 wires `@sentry/nextjs`

---

*End of ARCHITECTURE.md*
