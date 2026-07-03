# IRONFORGE

> **Elite Strength & Conditioning Studio** — a high-end fitness brand website built with Next.js 16, React 19, Tailwind CSS v4, Drizzle ORM, Auth.js v5, Inngest, Stripe, and Replicate.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node: ≥20](https://img.shields.io/badge/Node.js-≥20.18.0-green.svg)](https://nodejs.org)
[![pnpm: ≥10.26](https://img.shields.io/badge/pnpm-≥10.26.0-orange.svg)](https://pnpm.io)
[![Next.js: 16.2](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org)
[![Tests: 153](https://img.shields.io/badge/Tests-153_passing-brightgreen.svg)](#testing)
[![Vulns: 0](https://img.shields.io/badge/Vulnerabilities-0-brightgreen.svg)](#security)

---

## Overview

IRONFORGE is a production-grade marketing + booking + memberships + admin website for a fictional high-end strength & conditioning studio in NYC. It solves the problem of presenting a hardcore-luxury fitness brand online — cinematic hero reel, program filtering, coach credentials, member transformations, trial class booking, Stripe-powered memberships, and AI-generated B&W noir athletic photography.

The site is built on a 5-layer architecture (proxy → app → features → domain → lib) with server-first rendering, graceful degradation when external services (DB, Stripe, R2, Replicate, Inngest) are not configured, and WCAG AAA accessibility compliance.

---

## Key Features

| Feature | Description |
|---|---|
| 🎬 **Cinematic Hero Reel** | 5-frame Ken Burns cross-fade with mute toggle, parallax, progress bar, marquee ticker |
| 🏋️ **Programs Grid** | 9 programs across 5 goal categories with pill-filter + staggered reveal |
| 🔄 **Coach Flip Cards** | 3D Y-axis flip on hover/tap/keyboard — front: portrait + name; back: bio + certs + signature workout |
| 📖 **Stories Carousel** | Drag-to-swipe with rubber-band physics, momentum, snap, auto-advance, dots + prev/next |
| 📅 **Booking Flow** | Multi-field form with Zod validation, server action, Inngest job, rate limit, honeypot, toast |
| 💳 **Stripe Memberships** | 3 tiers (Forge / Forge+ / Forge Private) + drop-in pack with Checkout Sessions + webhook |
| 🎨 **AI Asset Generation** | Replicate SDXL B&W noir prompt template → Cloudflare R2 storage with SVG fallback |
| 🔐 **Auth + Admin** | Auth.js v5 Credentials + JWT, admin login, CRUD actions, role-gated layout, edge proxy |
| 🌐 **SEO** | JSON-LD HealthClub schema, sitemap.xml, robots.txt, PWA manifest, OG/Twitter cards |
| ♿ **WCAG AAA** | Skip link, focus-visible, reduced-motion, 44px touch targets, AA contrast, ARIA roles |

---

## Architecture

### Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 16.2.10 | App Router, Server Components, Turbopack |
| UI Runtime | React | 19.2.7 | Strict mode, React Compiler |
| Language | TypeScript | 5.9.3 | Strict mode, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` |
| Styling | Tailwind CSS | 4.3.2 | CSS-first `@theme`, no `tailwind.config.js` |
| UI Primitives | Radix UI + shadcn/ui | — | Dialog, Accordion, Dropdown, Slot (custom-wrapped) |
| Database | PostgreSQL + Drizzle ORM | 0.45.2 | 11 tables, 2 migrations, `ON CONFLICT DO NOTHING` |
| Auth | Auth.js v5 (next-auth) | 5.0.0-beta.31 | Credentials provider, JWT sessions, edge proxy |
| Job Queue | Inngest | 4.11.0 | Trial request pipeline, AI asset generation |
| Payments | Stripe | 22.3.0 | Checkout Sessions, webhooks, customer portal |
| AI | Replicate | 1.4.0 | SDXL B&W noir athletic photography |
| Storage | Cloudflare R2 (S3-compatible) | — | AI-generated assets, signed URLs |
| Rate Limiting | Upstash Redis | 2.0.8 | Sliding window on booking/checkout/auth |
| Validation | Zod | 4.4.3 | All inputs + env vars + API responses |
| Testing | Vitest + Playwright | 4.1.9 / 1.61.0 | 153 unit tests + E2E specs |
| Package Manager | pnpm | ≥10.26.0 | Lockfile + workspace config |
| Node.js | ≥20.18.0 | — | Pinned via `.nvmrc` |

### 5-Layer Architecture

```
Layer 0  src/proxy.ts            → Edge cookie check, redirect. NO DB. NO logic. Edge runtime.
Layer 1  src/app/                → Route structure, metadata, Suspense. Layouts must NOT fetch data.
Layer 2  src/features/           → UI composition, data binding, mutations (auth, booking, coaches)
Layer 3  src/features/*/domain/  → Pure business logic. No Next.js or DB runtime imports (import type only)
Layer 4  src/lib/                → Infrastructure: Drizzle, Auth.js, Inngest, R2, Stripe, AI providers
```

**Golden Rule:** A lower layer may never import from a higher layer. The ESLint `no-restricted-imports` rule enforces domain purity — `src/features/*/domain/**/*.ts` cannot import React, Next.js, Drizzle, or any runtime infrastructure (only `import type` is allowed).

---

## File Hierarchy

```
📂 src/
├── 📂 app/                          # Next.js App Router routes
│   ├── 📂 (marketing)/              # Public marketing site (layout: header + footer + grain + sticky CTA)
│   │   ├── page.tsx                 # Home: hero + programs + coaches + stories + booking + memberships
│   │   ├── layout.tsx               # Marketing layout + Toaster
│   │   └── loading.tsx              # Pulse-animated skeleton
│   ├── 📂 admin/                    # Admin section
│   │   ├── login/page.tsx           # Auth.js v5 credentials form
│   │   └── (guarded)/               # Role-gated routes (admin layout checks session)
│   │       ├── page.tsx             # Dashboard (stats + quick actions)
│   │       ├── coaches/             # CRUD: list, new, edit
│   │       └── assets/generate/     # AI asset generation trigger UI
│   ├── 📂 api/                      # API routes (17 total)
│   │   ├── auth/[...nextauth]/      # Auth.js v5 catch-all
│   │   ├── checkout/                # Stripe Checkout Session creation
│   │   ├── stripe/{webhook,portal}/ # Stripe webhook + customer portal
│   │   ├── inngest/                 # Inngest serve handler
│   │   ├── admin/assets/generate/   # Admin-only AI asset trigger
│   │   └── {programs,coaches,stories}/  # Read API + [slug] detail routes
│   ├── booking/confirm/page.tsx     # Post-submission confirmation
│   ├── layout.tsx                   # Root layout: 4 next/font/google fonts + metadata
│   ├── globals.css                  # Tailwind v4 @theme + base + utilities + reduced-motion
│   ├── robots.ts                    # robots.txt
│   ├── sitemap.ts                   # sitemap.xml (30 URLs)
│   ├── manifest.ts                  # PWA manifest
│   ├── not-found.tsx                # Custom 404
│   └── global-error.tsx             # Custom 500
├── 📂 components/
│   ├── 📂 layout/                   # SiteHeader, SiteFooter, MobileNavSheet, GrainOverlay, StickyCTABar
│   ├── 📂 sections/                 # hero/, programs/, coaches/, stories/, booking/, memberships/
│   ├── 📂 ui/                       # button, input, textarea, label (shadcn-wrapped with IRONFORGE tokens)
│   ├── JsonLd.tsx                   # 5 schema.org generators (HealthClub, Person, Course, Review, Breadcrumb)
│   ├── ScrollReveal.tsx             # IntersectionObserver wrapper
│   └── AdminSessionProvider.tsx     # next-auth SessionProvider for admin
├── 📂 features/                     # Feature modules (5-layer architecture)
│   ├── 📂 booking/                  # BookingForm + actions + domain schemas
│   ├── 📂 coaches/                  # data + domain + queries + actions (CRUD)
│   ├── 📂 programs/                 # data + domain + queries
│   ├── 📂 stories/                  # data + domain + queries
│   ├── 📂 memberships/              # data + domain schemas
│   └── 📂 assets/                   # domain schemas (asset generation)
├── 📂 hooks/                        # useHeroReel, useStoriesCarousel, useReveal, useReducedMotion, useScrolled
├── 📂 lib/                          # Infrastructure (Layer 4)
│   ├── auth/index.ts                # Auth.js v5 config (Credentials + JWT + rate limit)
│   ├── db/{client,seed,schema/}     # Drizzle + postgres + 11-table schema
│   ├── env.ts                       # Zod env validation with build-context fallback
│   ├── stripe.ts                    # Stripe client (graceful degradation)
│   ├── ratelimit.ts                 # Upstash sliding window (no-op fallback)
│   ├── inngest/client.ts            # Inngest client + event types
│   ├── ai/replicate.ts              # Replicate SDXL client + downloadImage
│   ├── storage/r2.ts                # Cloudflare R2 S3 client (500MB size guard)
│   └── utils.ts                     # cn() helper (clsx + tailwind-merge)
├── 📂 inngest/functions/            # trial-requested (3 steps) + asset-generate (3 steps)
├── 📂 tests/
│   ├── setup.ts                     # Vitest setup (jest-dom + matchMedia + IntersectionObserver mocks)
│   ├── unit/                        # 13 test files (brand tokens, hero reel, queries, schemas, actions)
│   └── e2e/                         # Playwright specs (hero, programs, coaches, stories, booking, memberships, auth, seo)
├── proxy.ts                         # Edge middleware (Next.js 16 — renamed from middleware.ts)
└── middleware.ts                    # DEPRECATED — use proxy.ts
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20.18.0 (pinned in `.nvmrc`)
- **pnpm** ≥ 10.26.0 (pinned in `package.json` `packageManager` field)
- **PostgreSQL** 15+ (or a Neon free-tier database)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/nordeim/fitness-studio.git
cd fitness-studio

# 2. Install dependencies
pnpm install

# 3. Copy env template and fill in real values
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, AUTH_SECRET, Stripe keys, etc.
# At minimum for local dev: DATABASE_URL + DATABASE_URL_UNPOOLED + AUTH_SECRET

# 4. Generate the AUTH_SECRET (≥32 chars)
openssl rand -base64 32

# 5. Run database migrations + seed
pnpm db:reset
# Seeds: 1 admin user + 8 coaches + 9 programs + 6 stories + 48 class slots

# 6. Start the dev server
pnpm dev
```

### Verify Setup

```bash
# Home page should render
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Expected: 200

# API should return programs
curl http://localhost:3000/api/programs | jq '.data | length'
# Expected: 9

# Admin should redirect to login
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
# Expected: 307 (redirect to /admin/login)
```

### Without a Database

The site gracefully degrades when the database is unavailable (dev, build, CI). All queries fall back to static data in `src/features/*/data.ts`. The marketing site renders fully without any external services configured — only auth, booking persistence, and Stripe checkout require real env vars.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL (used for sitemap, OG, redirects) |
| `DATABASE_URL` | Yes* | Pooled Postgres connection (PgBouncer) |
| `DATABASE_URL_UNPOOLED` | Yes* | Direct Postgres connection (for drizzle-kit DDL) |
| `AUTH_SECRET` | Yes | Auth.js v5 secret (≥32 chars — `openssl rand -base64 32`) |
| `AUTH_URL` | Yes | Auth.js callback URL (usually same as `NEXT_PUBLIC_APP_URL`) |
| `STRIPE_SECRET_KEY` | No | Stripe server key (`sk_*`) — enables checkout |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret (`whsec_*`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe client key (`pk_*`) |
| `REPLICATE_API_TOKEN` | No | Replicate API token (`r8_*`) — enables AI asset generation |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_UPLOADS` | No | R2 bucket name for uploads |
| `R2_BUCKET_GENERATED` | No | R2 bucket name for AI-generated assets |
| `INNGEST_EVENT_KEY` | No | Inngest event key |
| `INNGEST_SIGNING_KEY` | No | Inngest signing key (required in production) |
| `RESEND_API_KEY` | No | Resend email API key (`re_*`) |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL — enables rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |
| `ADMIN_EMAIL` | No | Admin user email for seed script |
| `ADMIN_PASSWORD_HASH` | No | Admin bcrypt hash for seed script |

*Required for production. Dev/build/CI uses build-context fallback (placeholders).

See `.env.example` for the full template with comments.

---

## Testing

### Commands

```bash
# Unit tests (Vitest + jsdom)
pnpm test                    # Run all 153 tests
pnpm test:watch              # Watch mode

# E2E tests (Playwright — requires running dev server)
pnpm test:e2e                # Run all E2E specs
pnpm exec playwright install chromium  # First-time only

# Live site E2E (against production URL)
pnpm test:e2e:live           # Set IRONFORGE_LIVE_URL env var

# Type checking
pnpm typecheck               # tsc --noEmit

# Linting
pnpm lint                    # eslint .
pnpm format                  # prettier --write .
pnpm format:check            # prettier --check .

# Full quality gate (run before every commit)
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Test Structure

| Type | Location | Count | Runner |
|---|---|---|---|
| Unit | `src/tests/unit/**/*.test.{ts,tsx}` | 6 files | Vitest + jsdom |
| Feature | `src/features/**/*.test.{ts,tsx}` | 7 files | Vitest + jsdom |
| E2E | `src/tests/e2e/*.spec.ts` | 8 specs | Playwright (Chromium) |
| **Total** | — | **153 unit + 8 E2E spec files** | — |

### Test Coverage

- **Brand tokens** (19 tests): forbidden colors, required tokens, WCAG AAA contrast ratios
- **Hero reel** (8 tests): frame cycling, mute toggle, goTo clamping, progress accumulation
- **Stories carousel** (9 tests): drag, momentum, rubber-band, snap, auto-advance
- **Goal selector** (5 tests): radiogroup ARIA, focus, onChange
- **Query modules** (22 tests): programs/coaches/stories with DB-unavailable fallback
- **Booking schema** (21 tests): Zod validation on all 9 fields
- **Booking server action** (10 tests): rate limit, honeypot, idempotency, graceful fallback
- **Membership schemas + data** (27 tests): tier pricing, feature counts, checkout validation
- **Asset schemas** (19 tests): Zod validation, SVG placeholder generation, prompt building
- **Coach form schema** (13 tests): slug regex, bio length, yearsExp bounds

---

## API Reference

### Public Read APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/programs` | GET | List all programs (optional `?goal=muscle\|fat\|fitness\|athletic\|rehab`) |
| `/api/programs/[slug]` | GET | Single program detail (404 if not found) |
| `/api/coaches` | GET | List all coaches (ordered by `order` field) |
| `/api/coaches/[slug]` | GET | Single coach profile |
| `/api/stories` | GET | List all member transformation stories |
| `/api/stories/[slug]` | GET | Single story detail |

### Public Mutation APIs

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/checkout` | POST | None (rate-limited 10/min) | Create Stripe Checkout Session |
| `/api/stripe/webhook` | POST | Stripe signature | Handle checkout.subscription events |
| `/api/stripe/portal` | GET | Admin | Create Customer Portal session (Phase 9 wires auth) |
| `/api/inngest` | GET/POST | Inngest signature | Inngest function serve handler |

### Admin APIs

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/admin/assets/generate` | POST | Admin role | Trigger AI asset generation via Inngest |
| `/api/auth/[...nextauth]` | GET/POST | None | Auth.js v5 catch-all (signin, signout, session) |

All API routes return `{ data: T } | { error: { code, message } }` with Zod-validated responses.

---

## Design System

### Color Palette (60-30-10 Rule)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Primary canvas (60%) |
| `--color-fg` | `#f5f5f5` | Body text (18.16:1 on bg) |
| `--color-fg-dim` | `#c0c0c0` | Secondary text (10.88:1) |
| `--color-muted` | `#8a8a8a` | Telemetry labels (5.5:1) |
| `--color-accent` | `#FF5400` | Neon orange — large text + UI (10%) |
| `--color-accent-bright` | `#FF7A33` | Hover state (7.62:1) |
| `--color-silver` | `#C8C8C8` | Metallic chrome — secondary CTA |

### Typography

| Font | Family | Weights | Usage |
|---|---|---|---|
| Display | Bebas Neue | 400 | Hero headline (8.5vw) |
| Heading | Oswald | 300–700 | Section titles, card titles |
| Body | Archivo | 400–900 | Paragraphs, UI text |
| Mono | JetBrains Mono | 400–700 | Telemetry labels, counters |

All fonts loaded via `next/font/google` with `display: swap` + `variable` strategy (zero layout shift).

### Animations

| Keyframe | Duration | Use Case |
|---|---|---|
| `pulse-cta` | 2.4s infinite | Primary CTA radial glow |
| `marquee` | 38s linear infinite | Hero bottom ticker |
| `ken-burns` | 9s forwards | Active hero reel frame |
| `wave` | 0.7s infinite | Mute toggle equalizer bars |
| `rec-blink` | 1.5s infinite | "REEL · LIVE" indicator dot |

All animations respect `prefers-reduced-motion` (disabled entirely via global CSS `@media` block).

See [`docs/design-tokens.md`](docs/design-tokens.md) for the full token reference.

---

## Security & Compliance

| Control | Implementation |
|---|---|
| CSP | `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `frame-ancestors 'none'` |
| HSTS | `max-age=63072000; includeSubDomains; preload` (2 years) |
| Auth | Auth.js v5 Credentials + JWT (30-day expiry) + `trustHost: true` |
| Rate Limiting | Booking 5/min, Checkout 10/min, Auth 5/10min (Upstash sliding window) |
| Input Validation | Zod on every public input (booking, checkout, admin, API responses) |
| Password Hashing | bcrypt cost factor 12 |
| Honeypot | `company_website` hidden field on booking form |
| Stripe Webhook | Signature verification via `constructEvent(rawBody, sig, secret)` |
| SSRF Protection | `downloadImage()` validates hostname against Replicate allowlist |
| Admin Auth | Edge proxy checks cookie → layout checks session → actions check role |
| Vulnerability Scan | `pnpm audit` — 0 vulnerabilities (overrides for postcss + esbuild) |

See [`docs/security-audit.md`](docs/security-audit.md) for the full OWASP Top 10 + WCAG AAA audit report.

---

## Project Status

| Phase | Status | Key Deliverable |
|---|---|---|
| 0 — Repo hygiene | ✅ Complete | Config files, Husky hooks, CI workflow, pnpm workspace |
| 1 — Design tokens | ✅ Complete | globals.css @theme, 4 fonts, 19 brand-token tests |
| 2 — Layout primitives | ✅ Complete | SiteHeader, MobileNavSheet, GrainOverlay, StickyCTABar |
| 3 — Hero reel | ✅ Complete | 5-frame Ken Burns, mute toggle, parallax, marquee |
| 4 — Marketing sections | ✅ Complete | Programs grid, Coach flip cards, Stories carousel, Booking CTA |
| 5 — Data layer | ✅ Complete | Drizzle schema, 7 API routes, Zod schemas, static fallback |
| 6 — Booking flow | ✅ Complete | Form + server action + Inngest + rate limit + honeypot |
| 7 — Memberships + Stripe | ✅ Complete | 3 tiers, checkout, webhook, portal, comparison UI |
| 8 — AI asset generation | ✅ Complete | Replicate SDXL + R2 + admin UI + SVG fallback |
| 9 — Auth + admin | ✅ Complete | Auth.js v5, login, CRUD actions, role gate |
| 10 — Security & QA | ✅ Complete | OWASP audit, WCAG AAA, bundle analysis, Lighthouse CI |
| 11 — Content polish & SEO | ✅ Complete | JSON-LD, sitemap, robots, manifest, 404/500, loading skeletons |
| 12 — Docs & ADRs | 🔄 In progress | README, CLAUDE.md, AGENTS.md (this phase) |
| 13 — Handoff | ⏳ Pending | Smoke test script, production deploy, task-review distillation |

**Overall:** 11 of 13 phases complete. 153 unit tests + 8 E2E spec files passing. 0 vulnerabilities.

---

## Contributing

### Development Workflow

1. **Branch:** `feat/<description>` or `fix/<description>`
2. **Develop:** Follow the Meticulous Approach (ANALYZE → PLAN → VALIDATE → IMPLEMENT → VERIFY → DELIVER)
3. **Test:** TDD encouraged — RED → GREEN → REFACTOR
4. **Quality gate:** `pnpm typecheck && pnpm lint && pnpm test && pnpm build` must pass
5. **Commit:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
6. **PR:** Squash merge to `main`

### Pre-commit Hooks (Husky)

- **pre-commit:** `pnpm lint-staged` (ESLint + Prettier on staged files)
- **pre-push:** `pnpm typecheck && pnpm test`

### Framework Conventions (differ from defaults)

- **Tailwind v4:** CSS-first config — no `tailwind.config.js`. All tokens in `src/app/globals.css` `@theme` block.
- **Next.js 16:** `middleware.ts` → `proxy.ts` (renamed). Export `proxy` not `middleware`.
- **Auth.js v5:** JWT strategy (no DB sessions). No DrizzleAdapter (type mismatch with our schema).
- **Server Components:** Default. `"use client"` only at leaves (hooks, event handlers).
- **Dynamic imports:** All infrastructure (DB, Stripe, R2, Replicate, Inngest) uses `await import()` for graceful degradation.

---

## Documentation

| Document | Description |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Project instructions for Claude Code agents |
| [AGENTS.md](AGENTS.md) | Compact onboarding guide for AI coding agents |
| [docs/Master-Execution-Plan.md](docs/Master-Execution-Plan.md) | 13-phase execution plan with detailed ToDo list |
| [docs/Skills-Knowledge-Base.md](docs/Skills-Knowledge-Base.md) | Distilled learnings from 4 deep-read skills |
| [docs/design-tokens.md](docs/design-tokens.md) | Full design token reference (colors, typography, motion, z-index) |
| [docs/security-audit.md](docs/security-audit.md) | OWASP Top 10 + WCAG AAA + bundle analysis audit report |
| [worklog.md](worklog.md) | Phase-by-phase work log (Phases 0–11) |

---

## License

MIT — see [LICENSE](LICENSE) file.

---

*Built by discipline. Forged in iron.*
