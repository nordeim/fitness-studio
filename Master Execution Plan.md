# Master Execution Plan — IRONFORGE Re‑imagined

> **Project:** High‑end fitness studio brand official website (re‑imagined design + full production codebase)
> **Codename:** `IRONFORGE / FORGE‑OS`
> **Source repo:** `https://github.com/nordeim/fitness-studio.git`
> **Document version:** 1.0
> **Phase gate:** ANALYZE → PLAN → **VALIDATE (you are here)** → IMPLEMENT → VERIFY → DELIVER
> **Status:** Awaiting explicit user confirmation of the plan before any production code is written.

---

## 0. Executive Summary

This Master Execution Plan defines the re‑imagining of the `fitness-studio` repository as **IRONFORGE** — a cinematic, hardcore‑luxury strength & conditioning studio brand site. The re‑imagined product upgrades the existing single‑file `static_landing_page.html` mockup into a production‑grade Next.js 16 + React 19 + Tailwind v4 full‑stack application that ships with the repository's declared dependencies (Drizzle ORM, Auth.js v5, Inngest, Stripe, Replicate, Upstash, bcrypt, Zod, Radix primitives, Vitest, Playwright).

The plan is organised around the Meticulous Approach workflow:

1. **ANALYZE** — multi‑dimensional requirement mining, ambiguity register, risk register.
2. **PLAN** — phased execution roadmap with verifiable checkpoints and a comprehensive ToDo list.
3. **VALIDATE** — explicit user confirmation gate (this document).
4. **IMPLEMENT** — modular, tested, documented builds against the validated plan.
5. **VERIFY** — Six‑Axis QA, Core Web Vitals, WCAG AAA, OWASP 2025.
6. **DELIVER** — handoff with runbooks, ADRs, and operational smoke tests.

The plan loads **17 curated skills** from the repo's `skills/` directory, mapped 1:1 to `package.json` dependencies and to the Visual Strategy brief. No code is written until this plan is approved.

---

## 1. ANALYZE — Deep Requirement Mining

### 1.1 Explicit requirements (from the user brief)

| Domain | Requirement |
|---|---|
| Brand | High‑end fitness studio. Professionalism + community belonging. Hardcore, motivating. |
| Visual strategy | Pure black + dark gray primary; neon orange (#FF5400) + metallic silver accents; dark textured background. |
| Imagery | Athletic poses, sweat, muscle definition, equipment texture. High‑contrast B&W, people as main subject, blurred surroundings. |
| Typography | Bold sans‑serif headings (powerful); clean forceful condensed body; minimal whitespace; high information density. |
| Page structure | Hero (brand attitude + coach team showcase) → Curriculum (organised by goals: muscle gain, fat loss, fitness) → Coach profiles (background + certifications) → Member stories (transformation case studies) → Book a Trial Class CTA. |
| Interaction | Muted slow‑mo hero reel with click‑to‑unmute; staggered fade + upward translate on scroll; coach flip cards on hover; pulsing CTA snapping to sticky bottom bar; auto‑advancing member story carousel with drag‑to‑swipe + rubber‑band easing; subtle grain‑texture parallax drift. |
| Stack | Everything in `package.json` (Next.js 16, React 19, Tailwind v4, Drizzle, Auth.js v5, Inngest, Stripe, Replicate, Upstash, bcrypt, Zod, Radix, Vitest, Playwright, pnpm ≥ 10.26). |
| Deliverable | Production‑ready website codebase + `Master Execution Plan.md` (this document). |

### 1.2 Implicit requirements (derived)

1. **Performance ceiling.** A "high‑end" brand site must clear Core Web Vitals "Good" on mobile (LCP < 2.5s, INP < 200ms, CLS < 0.1). Cinematic hero reels and grain parallax are the dominant risk; they must be lazy, GPU‑friendly, and reduced‑motion‑aware.
2. **Accessibility floor.** WCAG AAA contrast on a near‑black canvas is non‑trivial; the accent orange #FF5400 on #0a0a0a must be re‑audited for body text (it is fine for large text / UI accents, fail for small text — body must use #f5f5f5).
3. **SEO baseline.** Brand site must rank for "fitness studio NYC" + coach names; needs SSR metadata, JSON‑LD for `HealthClub` schema, sitemap, robots, OG/Twitter cards.
4. **Operational realism.** The repo declares Stripe, Inngest, Replicate, Auth.js, Upstash. These are not decorative — they imply a real booking + payments + AI image generation + email confirmation pipeline. The plan must wire them or stub them with clearly marked feature flags.
5. **Mobile parity.** "Hardcore" aesthetic must not break on a 360px Android. Touch variants for hover‑only interactions (flip cards, carousel) are mandatory.
6. **Content realism.** Sample data must look like a real studio (24 coaches, 6 programs, 12 transformation stories, 48 weekly class slots). Placeholder lorem ipsum is forbidden.
7. **Brand name.** The mockup uses `IRONFORGE`. We adopt it as the working name; a renaming pass is included in Phase 11 if the user supplies a different brand.
8. **Dark mode only.** The brief specifies a dark, textural canvas. Light mode is out of scope; the toggle hook is reserved for future use.
9. **TDD discipline.** The persona mandates Red → Green → Refactor. Every interaction listed in §1.1 must have a failing test before implementation.
10. **Library discipline.** Radix + shadcn primitives are already in `package.json`. We must wrap them, never rebuild them. The flip card, carousel, and reel are bespoke; everything else leans on Radix.

### 1.3 Ambiguity register (to be resolved at the VALIDATE gate)

| # | Ambiguity | Default proposal | Needs user input? |
|---|---|---|---|
| A1 | Is "Book a Trial Class" a real Stripe checkout, or a lead‑capture form? | Lead capture → Inngest → coach email. Stripe is reserved for membership purchase (post‑trial). | ✅ |
| A2 | Real photography vs AI‑generated? | Generate via Replicate SDXL + img2img with a "B&W noir athletic" prompt; allow user to swap real assets later. | ✅ |
| A3 | Backend persistence scope — do coach profiles / stories live in Postgres, or are they static MDX? | Postgres via Drizzle + admin‑only mutation routes. Static fallback seed for first ship. | ✅ |
| A4 | Auth scope — is member login required for the public marketing site? | Public marketing site is anonymous. Auth is reserved for `/members/*` (post‑MVP) and `/admin/*`. | ✅ |
| A5 | Geography — NYC only, or multi‑location? | Single location (NYC). Schema supports multi‑location for future. | — |
| A6 | Language — English only, or i18n? | English only. `next-intl` is intentionally **not** added. | — |
| A7 | Video reel source — actual MP4, or image Ken‑Burns simulation (as in the mockup)? | Image Ken‑Burns simulation (5 frames, 5s each) for first ship; MP4 support scaffolded. | ✅ |
| A8 | Coach count — the mockup says "24 specialists"; is that real? | Seed 8 fully detailed coach profiles + "+16 more" CTA. | — |
| A9 | Newsletter / community signup? | Yes — minimal email capture → Inngest → welcome email. | — |
| A10 | Analytics — Vercel Analytics, Plausible, or none? | Vercel Analytics + Speed Insights (zero extra deps, already in Next ecosystem). | ✅ |

### 1.4 Risk register

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Hero reel images blow LCP budget on mobile 4G. | High | High | LCP candidate = first reel frame, served via `next/image` with `priority` + AVIF + correct `sizes`. Subsequent frames `loading="lazy"`. Pre‑connect to image CDN. |
| R2 | Grain parallax + reel Ken Burns cause repaint jank. | Medium | Medium | Both run on `transform` only (no layout properties). `will-change: transform`. Pause via IntersectionObserver when off‑screen. Respect `prefers-reduced-motion`. |
| R3 | Orange #FF5400 fails WCAG AAA on small body text. | Certain | High | Use orange for ≥18px text and UI accents only. Body copy stays #f5f5f5 on #0a0a0a (contrast 18.7:1). Enforce via Stylelint rule. |
| R4 | Stripe + Inngest + Replicate wiring slips the schedule. | Medium | High | Phase 6 (Booking) ships lead‑capture first. Stripe + Inngest are Phase 7 (post‑MVP). Replicate is Phase 8 (asset generation). |
| R5 | Tailwind v4 `@theme` token drift between designers and code. | Medium | Medium | Single source of truth: `src/app/globals.css` `@theme` block. Documented in `docs/design-tokens.md`. Brand‑token test (Vitest) enforces 0 forbidden colours. |
| R6 | Coach flip card 3D transform breaks on older Safari. | Low | Medium | Feature‑detect `transform-style: preserve-3d`; fall back to opacity cross‑fade. |
| R7 | Carousel drag‑to‑swipe conflicts with vertical scroll on touch. | Medium | High | Use `touch-action: pan-y` on track; only intercept horizontal gestures with `|dx| > |dy|` threshold of 8px. |
| R8 | Sample photography (Picsum in mockup) looks generic. | Certain | Medium | Generate bespoke athletic B&W imagery via Replicate in Phase 8; placeholder grey mono illustrations for first ship. |
| R9 | `pnpm` not available in CI / deploy environment. | Low | High | `package.json` `engines` field already declares `pnpm >= 10.26.0`. Add `packageManager` field. Dockerfile uses corepack. |
| R10 | Auth.js v5 beta (`5.0.0-beta.31`) ships breaking changes mid‑project. | Medium | Medium | Pin exact version. Add a `renovate.json` rule to hold Auth.js major. Phase 9 includes an Auth upgrade spike. |

### 1.5 Architectural commitment

We adopt the **5‑layer golden rule** documented in `nextjs16-react19-tailwind4-auth5-video-gen`:

```
Layer 0  src/proxy.ts            → Edge cookie check, geo redirect, A/B flags
Layer 1  src/app/                → Routes, metadata, Suspense, error boundaries
Layer 2  src/features/           → UI composition, data binding, mutations
Layer 3  src/features/*/domain/  → Pure business logic (no React, no I/O)
Layer 4  src/lib/                → Infrastructure (DB, Auth, AI, Storage, Stripe, Inngest)
```

ESLint `no-restricted-imports` enforces Layer 3 purity (no `react`, no `next`, no `drizzle-orm`).

---

## 2. Selected Skills Roster

The repository ships **139 skills** under `skills/`. We load **17** of them, each justified by either a `package.json` dependency or a Visual Strategy requirement. Skill SKILL.md files are loaded in dependency order at the start of each phase (see §9).

### 2.1 Mapping: `package.json` → Skill

| package.json dependency | Loaded skill(s) | Why |
|---|---|---|
| `next` ^16.2.0, `react` ^19.2.3, `react-dom` | `nextjs16-tailwind4`, `super-frontend-design`, `nextjs-react-expert`, `web-frameworks` | App Router, RSC, PPR, React Compiler, Turbopack, Core Web Vitals. |
| `tailwindcss` ^4.3.0, `@tailwindcss/postcss` | `tailwind-patterns`, `nextjs16-tailwind4` | v4 CSS‑first `@theme`, container queries, design tokens. |
| `@radix-ui/react-accordion/dialog/dropdown-menu/slot` | `ui-styling`, `ui-ux-pro-max` | Radix + shadcn wrapping, accessibility primitives, design tokens. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | `ui-styling` | The shadcn `cn()` helper, variant recipes. |
| `drizzle-orm` ^0.45.2, `postgres` ^3.4.9, `drizzle-kit` ^0.31.10 | `nextjs16-react19-next-auth5-drizzle-orm`, `fullstack-dev` | Drizzle schema patterns, migrations, transactional safety, `ON CONFLICT DO NOTHING`. |
| `next-auth` 5.0.0-beta.31, `@auth/drizzle-adapter` | `nextjs16-react19-next-auth5-drizzle-orm`, `security-and-hardening` | Auth.js v5 + Drizzle adapter; session, CSRF, rate limit. |
| `inngest` ^4.11.0 | `nextjs16-react19-next-auth5-drizzle-orm` | Step‑function orchestration (booking confirmation, welcome email, AI asset gen). |
| `stripe` ^22.3.0 | `nextjs16-react19-next-auth5-drizzle-orm`, `security-and-hardening` | Checkout Sessions, webhooks with signature verification, idempotency keys. |
| `replicate` ^1.4.0 | `nextjs16-react19-next-auth5-drizzle-orm` | SDXL img2img for hero / coach / story imagery. |
| `@upstash/ratelimit`, `@upstash/redis` | `security-and-hardening` | Rate limit booking + auth + AI endpoints. |
| `bcryptjs` ^3.0.3 | `security-and-hardening` | Password hashing for admin auth; never logged. |
| `zod` ^4.4.3 | `api-and-interface-design`, `security-and-hardening` | Env validation, request body validation, response typing. |
| `geist` ^1.7.0 | `nextjs16-tailwind4` | Self‑hosted font via `next/font`. |
| `lucide-react` ^0.460.0 | `ui-styling` | Icon set compatible with shadcn. |
| `vitest` ^4.0.0, `@testing-library/*` | `testing-patterns`, `tdd-workflow` | Unit + component tests; factory pattern `getMockX(overrides)`. |
| `@playwright/test` ^1.61.0 | `webapp-testing-journey`, `frontend-ui-testing-journey`, `e2e-testing-lessons`, `playwright-cli` | E2E journey tests across hero, carousel, booking, auth. |
| `eslint`, `prettier`, `typescript-eslint`, `husky`, `lint-staged` | `lint-and-validate`, `code-quality-standards`, `clean-code` | Pre‑commit quality gate. |

### 2.2 Mapping: Visual Strategy → Skill

| Visual Strategy requirement | Loaded skill(s) | Specific reference file |
|---|---|---|
| Anti‑generic, hardcore‑luxury aesthetic | `avant-garde-design-v4` | `references/01-strategic-positioning.md`, `references/10-design-directions.md`, `references/12-anti-generic-checklist.md` |
| Pure black + neon orange + metallic silver palette | `avant-garde-design-v4` | `references/09-color-palettes.md` |
| Bold display typography (Bebas Neue, Oswald, Archivo, JetBrains Mono) | `ui-styling` (canvas‑fonts/BigShoulders, BricolageGrotesque, JetBrainsMono, Tektur), `visual-design-foundations` | `canvas-fonts/` directory + `typography-system.md` |
| Cinematic hero reel with Ken Burns + mute toggle | `frontend-design` | `animation-guide.md`, `motion-graphics.md`, `visual-effects.md` |
| Staggered section reveals | `frontend-design` | `animation-guide.md` |
| Coach flip cards (3D Y‑axis) | `frontend-ui-engineering`, `ui-styling` | shadcn card primitive + bespoke 3D wrapper |
| Pulsing CTA + sticky bottom bar | `frontend-design` | `motion-graphics.md` |
| Drag‑to‑swipe carousel with rubber‑band easing | `frontend-ui-engineering` | Custom hook `useStoriesCarousel` (port from mockup) |
| Grain texture parallax | `frontend-design` | `visual-effects.md` |
| WCAG AAA | `avant-garde-design-v4` | `references/04-accessibility-checklist.md`, `references/15-performance-budgets.md` |
| OWASP 2025 hardening | `security-and-hardening`, `vulnerability-scanner` | Full OWASP scan in Phase 10 |
| Photography direction (B&W, sweat, muscle, equipment texture) | `image-generation` (for AI assets), `image-understand` (for asset QA) | Generate via Replicate SDXL; verify with VLM |
| Six‑Axis code review (Correctness / Readability / Architecture / Security / Performance / Aesthetic) | `code-quality-standards` | Pre‑merge gate, every PR |

### 2.3 Skills NOT loaded (and why)

| Skill | Reason for exclusion |
|---|---|
| `nextjs16-react19-tailwind4-auth5-video-gen` | It is a superset distillation of the other Next.js 16 skills, focused on StoryIntoVideo. We extract its **lessons learned (NF‑1 → NF‑6) and ADRs** into our own `docs/lessons.md` without loading the full skill, to avoid cognitive overlap with `nextjs16-react19-next-auth5-drizzle-orm`. |
| `nextjs16-react19-postgres17` | News‑aggregation SaaS reference; overlap with our Drizzle patterns without adding fitness‑specific value. |
| `fullstack-dev` (the agent skill, not the workflow) | Loaded only as a secondary reference; we are not invoking the subagent for this build (we're authoring code directly per the persona's "library discipline" rule). |
| `claude-design`, `aesthetic`, `luxeverse-architect` | Overlap with `avant-garde-design-v4`. We keep one canonical design authority to prevent conflicting guidance. |
| All career / quiz / dream / marketing / finance skills | Out of scope for a fitness studio marketing site. |

### 2.4 Skills loaded as references only (no full SKILL.md load)

- `planning-and-task-breakdown` — already applied to author this document.
- `spec-driven-development` — its spec template will be reused for each feature in Phase 4.
- `incremental-implementation` — its incremental delivery rules apply to Phase 4 onward.
- `documentation-and-adrs` — its ADR template will be reused in Phase 12.
- `task-review` — invoked at the end of Phase 13 to capture the build as a reusable skill.

---

## 3. Re‑imagined Design Vision

### 3.1 Concept direction

> **"FORGED IN IRON."** A brand site that looks like a private strength studio at 5:43 AM — dark, sweaty, focused, and unapologetically hardcore. Every section reinforces two words: **discipline** and **belonging**. The aesthetic is *editorial noir meets industrial telemetry* — high‑contrast B&W photography, mono‑spaced telemetry labels, single neon‑orange signal, and a metallic‑silver secondary that reads as equipment chrome.

The single most memorable thing on the page: a full‑bleed hero where a slow‑motion training reel dissolves every 5 seconds behind a massive Bebas Neue headline ("BUILT BY DISCIPLINE. FORGED IN IRON."), with a muted equalizer that pulses to invite the click‑to‑unmute. Below the fold, every coach is a flip card that turns on hover to reveal the credentials you'd only see on a studio wall.

### 3.2 Design tokens (canonical — lives in `src/app/globals.css`)

```css
@theme {
  /* Surface */
  --color-bg:            #0a0a0a;   /* primary canvas */
  --color-bg-darker:     #050505;   /* sticky bar / nav */
  --color-bg-card:       #141414;   /* coach / story / program cards */
  --color-bg-card-hover: #1a1a1a;

  /* Foreground */
  --color-fg:            #f5f5f5;   /* body — 18.7:1 contrast on bg */
  --color-fg-dim:        #c0c0c0;   /* secondary body */
  --color-muted:         #6a6a6a;   /* telemetry labels */

  /* Accent — rationed, the ONLY hue that asserts itself */
  --color-accent:        #FF5400;   /* neon orange — large text + UI only */
  --color-accent-bright: #FF7A33;   /* hover */
  --color-accent-dim:    #B33A00;   /* scrollbar, low-emphasis */
  --color-accent-glow:   rgba(255, 84, 0, 0.45);

  /* Chrome */
  --color-silver:        #C8C8C8;   /* metallic silver, secondary CTA */
  --color-silver-dim:    #5a5a5a;

  /* Lines */
  --color-border:        #1f1f1f;
  --color-border-light:  #2a2a2a;

  /* Typography */
  --font-display:  "Bebas Neue", "Arial Narrow", sans-serif;
  --font-heading:  "Oswald", "Inter Tight", sans-serif;
  --font-body:     "Archivo", "Inter", system-ui, sans-serif;
  --font-mono:     "JetBrains Mono", "Geist Mono", monospace;

  /* Motion */
  --ease-premium:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-snap:     cubic-bezier(0.16, 1, 0.3, 1);
  --dur-reveal:    900ms;
  --dur-flip:      900ms;
  --dur-sticky:    600ms;

  /* Layout */
  --container-max: 1600px;
  --gutter:        1.5rem;       /* mobile */
  --gutter-lg:     2.5rem;       /* lg+ */
}
```

**Forbidden colours** (enforced by Vitest brand‑token test):
- Any purple/violet (`#7c3aed`, `#a855f7`, `#8b5cf6`).
- Any default Tailwind blue (`#3b82f6`).
- Any default Tailwind `gray-100` through `gray-400` on dark backgrounds.
- Amber‑100 / amber‑200 (too soft for the hardcore brief).

### 3.3 Typography scale

| Role | Family | Weight | Size (desktop / mobile) | Tracking | Used for |
|---|---|---|---|---|---|
| Display | Bebas Neue | 400 | 8.5vw / 14vw | 0.005em | Hero headline only |
| Heading 1 | Oswald | 600 | 4rem / 2.5rem | 0.01em | Section titles ("PROGRAMS", "COACHES") |
| Heading 2 | Oswald | 500 | 2.25rem / 1.75rem | 0.02em | Card titles |
| Body | Archivo | 400 | 1.0625rem / 1rem | 0 | Paragraphs |
| Body condensed | Archivo | 500 | 0.9375rem | 0.04em | Coach bios, story quotes |
| Telemetry | JetBrains Mono | 400 | 0.6875rem | 0.2em uppercase | Section markers, counters, status labels |
| CTA | Oswald | 600 | 0.85rem | 0.2em uppercase | Buttons, pills |

**Line‑height:** 1.55 for body, 0.85 for display, 1.1 for headings.

### 3.4 Motion principles

1. **Reveal.** Every section observes `IntersectionObserver` with `threshold: 0.15`. On enter, children fade in + translate up 30–48px with a 100ms stagger (max 6 children). Easing: `var(--ease-premium)`. Duration: 700–900ms.
2. **Headline lock‑up.** Hero headline uses `overflow:hidden` line masks; each line's `<span>` translates from `translateY(110%)` to `0` with 100ms stagger.
3. **Flip.** Coach cards use `transform-style: preserve-3d` + `rotateY(180deg)` on hover or tap (touch). Backface hidden. Duration 900ms.
4. **Pulse.** Primary CTA has a radial `box-shadow` glow that pulses 0 → 18px ring every 2.4s. Pauses when sticky bar is visible (avoid dual pulsing).
5. **Sticky snap.** Sticky bottom bar slides up `translateY(110%) → 0` after hero leaves viewport; slides away when booking section enters.
6. **Carousel physics.** Drag uses 1:1 cursor mapping within bounds; past bounds uses 0.35× rubber band. On release: velocity × 300ms momentum, then snap to nearest card with `var(--ease-snap)` over 700ms. Auto‑advance every 4.5s, pause on hover / drag.
7. **Grain drift.** Fixed full‑viewport SVG `feTurbulence` overlay, `opacity: 0.08`, `mix-blend-mode: overlay`. Translates vertically at 0.15× scroll, smoothed by lerp 0.08 per frame. Paused when off‑screen.
8. **Hero reel.** 5 frames, cross‑fade `opacity 0 → 1` over 2s, hold 3s, switch every 5s total. Active frame runs Ken Burns `scale 1.06 → 1.2 + translate(-3%,-3%)` over 9s.
9. **Reduced motion.** `@media (prefers-reduced-motion: reduce)` disables reveal, parallax, Ken Burns, pulse, carousel auto‑advance. Reveal content is shown immediately.

### 3.5 Information architecture

```
/                           → Hero + Programs preview + Coaches preview + Stories preview + CTA
/programs                   → Full curriculum (filter by goal: muscle / fat / fitness / athletic / rehab)
/programs/[slug]            → Program detail (methodology, weekly schedule, coach, pricing)
/coaches                    → Full coach grid (24 cards, filterable by specialty)
/coaches/[slug]             → Coach profile (bio, certifications, signature workout, schedule)
/stories                    → Member transformation index
/stories/[slug]             → Story detail (before/after, video clip, quote, timeline)
/schedule                   → Weekly class timetable (filter by program / coach / time)
/booking                    → Trial class booking form (lead capture)
/booking/confirm            → Post‑submission confirmation
/memberships                → Stripe‑powered membership tiers
/about                      → Studio story, facility, location, hours
/community                  → Member newsletter signup + events feed
/legal/privacy, /legal/terms→ Static legal
/admin/*                    → Auth‑gated admin (CRUD for coaches, programs, stories) — Phase 9
```

### 3.6 Component inventory (atomic design)

**Atoms** (Tailwind + Radix‑wrapped): `Button`, `Pill`, `Tag`, `TelemetryLabel`, `SectionMarker`, `Divider`, `Icon` (lucide), `Counter` (animated number), `Input`, `Textarea`, `RadioCard`, `CheckboxCard`, `Toast`.

**Molecules**: `CoachAvatar`, `ProgramCard`, `StoryCard`, `GoalSelector`, `TimeSlotGrid`, `ReelFrame`, `ReelControl`, `NavBarLink`, `StickyCTA`, `MarqueeTicker`.

**Organisms**: `SiteHeader`, `SiteFooter`, `HeroReel`, `ProgramGrid`, `CoachFlipGrid`, `StoriesCarousel`, `ScheduleBoard`, `BookingForm`, `MembershipTierComparison`, `CommunitySignup`, `GrainOverlay`, `StickyCTABar`.

**Templates**: `MarketingPage`, `ProgramDetailPage`, `CoachProfilePage`, `StoryPage`, `BookingPage`, `AdminPage` (auth‑gated).

**Pages**: per §3.5 route map.

---

## 4. Data Layer (Drizzle schema sketch)

Persisted in Postgres via `drizzle-orm` + `postgres` driver. Migrations via `drizzle-kit`. Seed via `tsx src/lib/db/seed.ts`.

```ts
// src/lib/db/schema.ts (excerpt — full schema in Phase 5)

export const coaches = pgTable('coaches', {
  id:           uuid('id').primaryKey().defaultRandom(),
  slug:         varchar('slug', { length: 80 }).notNull().unique(),
  name:         varchar('name', { length: 80 }).notNull(),
  title:        varchar('title', { length: 120 }).notNull(),    // "Head of Strength"
  bio:          text('bio').notNull(),
  certifications: text('certifications').array(),                // ["NSCA-CSCD", "FRC"]
  specialties:  text('specialties').array(),                     // ["Hypertrophy", "Powerlifting"]
  signatureWorkout: varchar('signature_workout', { length: 120 }),
  portraitKey:  varchar('portrait_key', { length: 200 }),        // R2 / Replicate asset key
  yearsExp:     integer('years_exp'),
  order:        integer('order').default(0),
  published:    boolean('published').default(false),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

export const programs = pgTable('programs', {
  id:           uuid('id').primaryKey().defaultRandom(),
  slug:         varchar('slug', { length: 80 }).notNull().unique(),
  goal:         varchar('goal', { length: 40 }).notNull(),       // "muscle" | "fat" | "fitness" | "athletic" | "rehab"
  title:        varchar('title', { length: 120 }).notNull(),
  subtitle:     varchar('subtitle', { length: 200 }),
  description:  text('description').notNull(),
  duration:     varchar('duration', { length: 40 }),              // "12 weeks"
  sessionsPerWeek: integer('sessions_per_week'),
  intensity:    varchar('intensity', { length: 20 }),             // "off-season" | "build" | "peak"
  heroKey:      varchar('hero_key', { length: 200 }),
  priceCents:   integer('price_cents'),                          // Stripe price mirror
  stripePriceId: varchar('stripe_price_id', { length: 80 }),
  coachId:      uuid('coach_id').references(() => coaches.id),
  order:        integer('order').default(0),
  published:    boolean('published').default(false),
}, (t) => ({ goalIdx: index('programs_goal_idx').on(t.goal) }));

export const stories = pgTable('stories', {
  id:           uuid('id').primaryKey().defaultRandom(),
  slug:         varchar('slug', { length: 80 }).notNull().unique(),
  memberName:   varchar('member_name', { length: 80 }).notNull(),
  memberAge:    integer('member_age'),
  programSlug:  varchar('program_slug', { length: 80 }),
  weeks:        integer('weeks'),
  beforeKey:    varchar('before_key', { length: 200 }),
  afterKey:     varchar('after_key', { length: 200 }),
  quote:        text('quote').notNull(),
  timeline:     jsonb('timeline'),                                 // [{week, weight, lift}]
  videoKey:     varchar('video_key', { length: 200 }),
  published:    boolean('published').default(false),
});

export const classSlots = pgTable('class_slots', {
  id:           uuid('id').primaryKey().defaultRandom(),
  programId:    uuid('program_id').references(() => programs.id),
  coachId:      uuid('coach_id').references(() => coaches.id),
  startsAt:     timestamptz('starts_at').notNull(),
  durationMin:  integer('duration_min').default(60),
  capacity:     integer('capacity').default(8),
  location:     varchar('location', { length: 120 }).default('47 Eastbound Alley, NYC'),
});

export const trialRequests = pgTable('trial_requests', {
  id:           uuid('id').primaryKey().defaultRandom(),
  name:         varchar('name', { length: 80 }).notNull(),
  email:        varchar('email', { length: 160 }).notNull(),
  phone:        varchar('phone', { length: 40 }),
  goal:         varchar('goal', { length: 40 }).notNull(),
  preferredTime: varchar('preferred_time', { length: 20 }).notNull(),
  preferredCoachId: uuid('preferred_coach_id'),
  notes:        text('notes'),
  status:       varchar('status', { length: 20 }).default('received'), // received|contacted|scheduled|completed
  idempotencyKey: varchar('idempotency_key', { length: 60 }).notNull().unique(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
});

export const newsletterSubs = pgTable('newsletter_subs', {
  id:           uuid('id').primaryKey().defaultRandom(),
  email:        varchar('email', { length: 160 }).notNull().unique(),
  consentAt:    timestamp('consent_at').defaultNow().notNull(),
  source:       varchar('source', { length: 40 }).default('site_footer'),
});

// Auth.js v5 + @auth/drizzle-adapter tables: users, accounts, sessions, verificationTokens.
// Admin role column on users: role varchar default 'member'.
```

**Indexes:** `programs(goal)`, `class_slots(starts_at)`, `trial_requests(created_at)`, `newsletter_subs(email)` unique.

**Seed data:** 8 coaches, 6 programs (one per goal plus a 7th "private coaching"), 6 stories, 48 class slots (next 14 days), 1 admin user (env‑seeded).

---

## 5. Backend Services

### 5.1 Auth.js v5 (next-auth 5.0.0-beta.31)

- **Strategy:** Credentials + Email magic link (Resend/SMTP) for members; bcrypt‑hashed admin login.
- **Adapter:** `@auth/drizzle-adapter` mapped to the schema above.
- **Routes:** `/api/auth/*` (handled by Auth.js catch‑all). Public marketing routes are anonymous; `/admin/*` requires `session.user.role === 'admin'`.
- **Session:** JWT strategy, 30‑day expiry, rotated on role change.
- **CSRF:** Double‑submit cookie (Auth.js default). CSP `frame-ancestors 'none'`.
- **Rate limit:** `@upstash/ratelimit` sliding window — 5 login attempts / 10 min / IP.

### 5.2 Inngest job pipeline

```
trial.requested       → contact.coach (email coach within 24h)
                      → confirm.member (email member with calendar link)
                      → schedule.followup (3d delay → check if scheduled)

newsletter.subscribed → welcome.email (immediate)
                      → tag.in.CRM (10s delay)

asset.generate        → replicate.sdxl (img2img with noir athletic prompt)
                      → upload.to.R2
                      → update.db.record
                      → notify.admin

stripe.checkout.done  → persist.subscription
                      → welcome.member.email
                      → tag.in.CRM

stripe.checkout.failed→ alert.admin
```

Every step uses `step.run` with try/catch and `step.sendEvent` to the next step. Idempotency via `ON CONFLICT DO NOTHING` + deterministic event IDs.

### 5.3 Stripe

- **Products:** 3 membership tiers (Forge / Forge+ / Forge Private) + drop‑in class pack.
- **Checkout:** Server‑side Checkout Session creation in `/api/checkout/route.ts`. Webhook at `/api/stripe/webhook` with signature verification.
- **Customer portal:** `/api/stripe/portal` link.
- **Idempotency:** Stripe idempotency keys derived from `userId + priceId + epochMinute`.

### 5.4 Replicate (AI asset generation)

- **Model:** `stability-ai/sdxl` with LoRA pass for B&W athletic noir.
- **Prompt template:** `"cinematic black and white photograph of {subject}, high contrast, sweat, muscle definition, {equipment} texture, shallow depth of field, 85mm lens, noir lighting"`.
- **Pipeline:** Admin triggers from `/admin/assets/generate` → Inngest `asset.generate` → Replicate prediction → R2 upload → DB update.
- **Fallback:** If Replicate key is missing, fall back to bundled grey‑mono SVG illustrations (committed to repo).

### 5.5 Rate limiting & security headers

- `@upstash/ratelimit` on `/api/booking` (5/min/IP), `/api/newsletter` (3/min/IP), `/api/auth/sign-in` (5/10min/IP), `/api/checkout` (10/min/user).
- Security headers via `next.config.ts` `headers()`: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- CSP allows `unsafe-inline` for styles (Next.js App Router requirement — documented as ADR‑002), `script-src 'self' 'unsafe-eval'` only in dev.

### 5.6 Zod env validation

`src/lib/env.ts` parses and validates `process.env` at boot. Missing required vars throw a typed error with remediation instructions.

---

## 6. PLAN — Phased Execution Roadmap

The build is sequenced into **13 phases**. Each phase has a verifiable acceptance gate. No phase begins until the previous phase passes its gate (exception: Phase 4 sub‑features may be parallelised — see §6.4).

### 6.1 Phase overview

| # | Phase | Deliverable | Acceptance gate |
|---|---|---|---|
| 0 | Repo hygiene & tooling | `.env.example`, `.editorconfig`, `packageManager` field, pre‑commit hook verified | `pnpm install && pnpm typecheck && pnpm lint && pnpm test` all green on empty skeleton |
| 1 | Design tokens & fonts | `globals.css` `@theme` block, `next/font` setup, brand‑token Vitest test | Token test green; forbidden colours rejected; fonts self‑hosted |
| 2 | Layout primitives | `<SiteHeader>`, `<SiteFooter>`, `<GrainOverlay>`, `<Container>`, `<SectionMarker>`, route group `(marketing)` | Storybook‑style page renders at `/dev/atoms` (private route) |
| 3 | Hero reel | `<HeroReel>` with 5 frames, Ken Burns, mute toggle, progress bar, parallax | Playwright E2E: hero visible, frame advances, mute toggles, reduced‑motion disables |
| 4 | Marketing sections | Programs preview, Coach flip grid, Stories carousel, Booking CTA, Marquee | Each section has unit + interaction tests; reveals fire once on scroll |
| 5 | Data layer | Drizzle schema, migrations, seed, /api/ routes for read | `pnpm db:reset` green; `GET /api/programs` returns 6 programs |
| 6 | Booking flow | Multi‑field form, Zod validation, Inngest job, toast, /booking/confirm | E2E: submit creates `trial_request`, fires Inngest, shows toast |
| 7 | Memberships + Stripe | 3 tiers, checkout, webhook, customer portal | Stripe test mode: full checkout → webhook → DB row |
| 8 | AI asset generation | Replicate pipeline, admin trigger, R2 upload, fallback | Admin generates 1 coach portrait via Replicate (or fallback path) |
| 9 | Auth + admin | Auth.js v5, admin login, CRUD routes for coaches/programs/stories | Admin can create + edit + publish a coach; CSRF + rate limit verified |
| 10 | Security & QA hardening | OWASP scan, vulnerability scan, WCAG AAA audit, Core Web Vitals | All scans pass; Lighthouse mobile ≥ 95/95/95/95 |
| 11 | Content polish & SEO | Real seed data, JSON‑LD, sitemap, OG cards, copy review | SEO audit clean; Lighthouse SEO ≥ 100 |
| 12 | Docs & ADRs | README, ARCHITECTURE.md, ADRs, runbooks, this plan v2 | Reviewer can clone + run + deploy from docs alone |
| 13 | Handoff & task‑review | Smoke‑test script, post‑launch monitor, `to-distill-project-into-skill` invocation | 30‑second smoke test green on production URL |

### 6.2 Phase 0 — Repo hygiene & tooling

**Goal:** Make the repository safe to develop in.

- [ ] 0.1 Add `packageManager: "pnpm@10.26.0"` to `package.json`.
- [ ] 0.2 Add `.nvmrc` with `node >=20.0.0`.
- [ ] 0.3 Add `.env.example` listing every env var from §5.6 with example value + comment.
- [ ] 0.4 Add `.env.local` to `.gitignore` (verify it's there).
- [ ] 0.5 Add `.editorconfig` (UTF‑8, LF, 2‑space, final newline).
- [ ] 0.6 Add `prettier-plugin-tailwindcss` to Prettier config (already in deps — wire class sorting).
- [ ] 0.7 Configure `lint-staged` to run ESLint + Prettier on staged TS/TSX (already declared — verify).
- [ ] 0.8 Add ` Husky` `pre-commit` hook running `lint-staged` + `pnpm typecheck`.
- [ ] 0.9 Add ` Husky` `pre-push` hook running `pnpm test`.
- [ ] 0.10 Add `renovate.json` holding `next-auth` major.
- [ ] 0.11 Add `tsconfig.json` strict flags: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`.
- [ ] 0.12 Verify `pnpm install && pnpm typecheck && pnpm lint && pnpm test` all green on the empty skeleton.
- [ ] 0.13 Create `src/` skeleton: `app/`, `features/`, `lib/`, `components/`, `hooks/`, `styles/`.

**Gate:** All scripts green; CI replicates locally.

### 6.3 Phase 1 — Design tokens & fonts

**Goal:** Single source of truth for brand.

- [ ] 1.1 Load skill `tailwind-patterns` SKILL.md (v4 `@theme` reference).
- [ ] 1.2 Load skill `avant-garde-design-v4` `references/09-color-palettes.md`.
- [ ] 1.3 Write `src/app/globals.css` with the full `@theme` block from §3.2.
- [ ] 1.4 Add `@utility` rules: `text-stroke`, `vertical-text`, `notch-corner`, `scan-line`, `bg-textured`.
- [ ] 1.5 Install fonts via `next/font/local`: Bebas Neue, Oswald (300/400/500/600/700), Archivo (400/500/600/700/800/900), JetBrains Mono (400/500/700). Source from `skills/ui-styling/canvas-fonts/` where available; else from Google Fonts (self‑hosted via `next/font/google` with `display: swap`).
- [ ] 1.6 Wire font CSS variables into `@theme` (`--font-display`, `--font-heading`, `--font-body`, `--font-mono`).
- [ ] 1.7 Write `src/lib/brand-tokens.test.ts` — Vitest test that imports `globals.css` raw text and asserts no forbidden colours appear (`#7c3aed`, `#a855f7`, `#3b82f6`, `amber-100`, `amber-200`).
- [ ] 1.8 Write `src/lib/brand-tokens.test.ts` — assert `--color-fg` on `--color-bg` contrast ≥ 7:1 (WCAG AAA).
- [ ] 1.9 Write `docs/design-tokens.md` documenting every token with a swatch + usage rule.
- [ ] 1.10 Add `eslint-plugin-tailwindcss` (v4 compatible) — forbid arbitrary colour classes outside the token set.

**Gate:** Brand‑token tests green; Prettier formats CSS; no forbidden colour compiles.

### 6.4 Phase 2 — Layout primitives

**Goal:** The structural shell of every page.

- [ ] 2.1 Load skill `ui-styling` SKILL.md (shadcn + Radix patterns).
- [ ] 2.2 Load skill `avant-garde-design-v4` `references/05-component-patterns.md`.
- [ ] 2.3 Generate shadcn primitives via `skills/ui-styling/scripts/shadcn_add.py`: `button`, `input`, `textarea`, `label`, `radio-group`, `toast`, `dialog`, `dropdown-menu`, `accordion`, `separator`.
- [ ] 2.4 Wrap each shadcn primitive with IRONFORGE styling: black canvas, silver secondary, orange accent, mono telemetry variants. Files under `src/components/ui/`.
- [ ] 2.5 Build `<Container>` (max 1600px, responsive gutter), `<Section>` (vertical rhythm 8rem desktop / 5rem mobile), `<SectionMarker>` (the orange line + mono label).
- [ ] 2.6 Build `<SiteHeader>` — fixed, backdrop‑blur, logo lockup (Bebas wordmark + mono tagline), nav links with hover micro‑dot, location pin, silver "Book Trial" button.
- [ ] 2.7 Build `<SiteFooter>` — multi‑column (Brand / Programs / Coaches / Legal), newsletter signup, mono‑spaced copyright, large display wordmark.
- [ ] 2.8 Build `<GrainOverlay>` — fixed, SVG `feTurbulence`, `mix-blend-mode: overlay`, lerp parallax on scroll, paused when off‑screen, disabled on `prefers-reduced-motion`.
- [ ] 2.9 Build `<StickyCTABar>` — fixed bottom, slides up after hero leaves viewport, slides away when booking enters. Mirrors primary CTA.
- [ ] 2.10 Create route group `src/app/(marketing)/layout.tsx` rendering header + footer + grain + sticky bar.
- [ ] 2.11 Create private dev route `/dev/atoms` rendering every primitive in every state (loading / error / empty / success / hover / focus / disabled).
- [ ] 2.12 Write Vitest component tests for `<Container>`, `<SectionMarker>`, `<SiteHeader>` (mobile menu toggle), `<SiteFooter>` (newsletter submit), `<StickyCTABar>` (visibility observer).
- [ ] 2.13 Write Playwright E2E: header is fixed on scroll; mobile menu opens; sticky bar appears after hero; sticky bar hides at booking section.

**Gate:** `/dev/atoms` renders all primitives; all component + E2E tests green.

### 6.5 Phase 3 — Hero reel

**Goal:** The single most memorable thing on the page.

- [ ] 3.1 Load skill `frontend-design` `animation-guide.md` + `visual-effects.md`.
- [ ] 3.2 Load skill `avant-garde-design-v4` `references/14-animation-standards.md`.
- [ ] 3.3 Build `<HeroReel>` server component — fetches 5 curated images from `programs.heroKey` or static fallback.
- [ ] 3.4 Build `<ReelFrame>` — single frame with `next/image`, `priority` on first frame only, `loading="lazy"` on others. Apply `grayscale(100%) contrast(1.55) brightness(0.42)` filter via CSS.
- [ ] 3.5 Implement Ken Burns animation via CSS `@keyframes kenburns` (scale 1.06 → 1.2, translate ‑3%, ‑3%) over 9s. Active frame only.
- [ ] 3.6 Implement cross‑fade via `opacity 0 → 1` over 2s. Frame holds 3s. Total cycle 5s × 5 frames = 25s loop.
- [ ] 3.7 Build `<ReelControl>` — mute toggle button with 5‑bar equalizer. Muted by default; click → unmuted state with animated bars (CSS `@keyframes wave`).
- [ ] 3.8 Add `<progress-bar>` — 1px tall, fills 0→100% over 5s per frame, resets on frame change.
- [ ] 3.9 Add chapter counter `01 / 05` in JetBrains Mono, updates per frame.
- [ ] 3.10 Add headline lock‑up — 3 lines of Bebas Neue display text, each in `overflow:hidden` mask, `translateY(110%) → 0` on mount with 100ms stagger.
- [ ] 3.11 Add hero copy paragraph + coach strip preview (overlapping avatars + "+20" badge + "24 certified specialists" label).
- [ ] 3.12 Add marquee ticker at hero bottom — IRONFORGE aphorisms scrolling horizontally via CSS `@keyframes marquee`, 38s linear infinite.
- [ ] 3.13 Add `scan-line` overlay (`repeating-linear-gradient`, 3px transparent / 1px rgba(0,0,0,0.15)).
- [ ] 3.14 Add hero parallax: `reelContainer` translates `translateY(scrolled * 0.3)` while `scrolled < innerHeight`.
- [ ] 3.15 Write `useReveal` hook — IntersectionObserver, `threshold: 0.15`, adds `.in-view` class. Respects `prefers-reduced-motion`.
- [ ] 3.16 Write `useReducedMotion` hook — returns boolean, drives all motion disable flags.
- [ ] 3.17 Write `useScrolled` hook — `window.scrollY > 0` boolean for header background.
- [ ] 3.18 Write Vitest tests: hook return values, frame indexing, mute state machine.
- [ ] 3.19 Write Playwright E2E: hero visible on `/`; first frame has `priority`; frame advances after 5s; mute toggle flips state; reduced‑motion disables Ken Burns; LCP element is the first reel image.
- [ ] 3.20 Verify LCP ≤ 2.5s on mobile 4G throttling via Playwright `page.vitals()`.

**Gate:** Hero renders, animates, and meets LCP budget.

### 6.6 Phase 4 — Marketing sections (parallelisable sub‑features)

**Goal:** Every section from the Visual Strategy page structure.

Sub‑features may be built in parallel by separate work streams. Each streams owns its tests.

#### 4A — Programs preview + Programs grid

- [ ] 4A.1 Build `<ProgramCard>` — image with mono filter on hover, program number (stroke → accent fill on hover), title, goal pill, duration, intensity.
- [ ] 4A.2 Build `<GoalSelector>` — pill cluster (Muscle / Fat / Fitness / Athletic / Rehab), single‑select, drives grid filter.
- [ ] 4A.3 Build `<ProgramGrid>` — responsive 3‑col desktop / 2‑col tablet / 1‑col mobile. Staggered reveal.
- [ ] 4A.4 Wire to `GET /api/programs?goal=…` (Phase 5 stub returns static).
- [ ] 4A.5 Tests: filtering works; cards reveal; empty state when no programs match.

#### 4B — Coach flip grid

- [ ] 4B.1 Build `<CoachFlipCard>` — perspective 1800px, height 580px desktop / 480px mobile. Front: portrait + name + title + specialty tags. Back: bio excerpt + certifications list + signature workout + "View profile" link.
- [ ] 4B.2 Implement flip via `:hover` on devices with `hover: hover`; tap toggle on `hover: none` (matchMedia check).
- [ ] 4B.3 Feature‑detect `transform-style: preserve-3d`; fall back to opacity cross‑fade.
- [ ] 4B.4 Build `<CoachFlipGrid>` — 4‑col desktop / 2‑col tablet / 1‑col mobile.
- [ ] 4B.5 Tests: flip triggers on hover (desktop) and tap (touch); fallback degrades gracefully; keyboard focus also flips (a11y).

#### 4C — Stories carousel

- [ ] 4C.1 Build `<StoriesCarousel>` porting the mockup's `StoriesCarousel` class to a React hook `useStoriesCarousel`.
- [ ] 4C.2 Implement: drag (mouse + touch), rubber‑band 0.35× at edges, momentum (velocity × 300ms), snap to nearest card with `cubic-bezier(0.16, 1, 0.3, 1)` 700ms.
- [ ] 4C.3 Auto‑advance every 4.5s, pause on hover / drag / focus‑in.
- [ ] 4C.4 Prev/Next buttons + dot indicators (active dot = 32×2px orange; inactive = 8×2px border‑light).
- [ ] 4C.5 `touch-action: pan-y` on track; only intercept horizontal gestures with `|dx| > |dy| + 8`.
- [ ] 4C.6 Build `<StoryCard>` — member portrait (before/after overlay on hover), quote, program tag, weeks completed.
- [ ] 4C.7 Tests: drag advances; rubber band resists at edges; snap lands on card; auto‑advance pauses; keyboard arrows work.

#### 4D — Booking CTA + Section divider + Marquee

- [ ] 4D.1 Build `<BookingCTA>` block — corner‑bracket frame, headline "CLAIM YOUR FIRST SESSION", subhead, primary CTA pulsing (CSS `@keyframes pulse-cta` 2.4s), secondary "View schedule" link.
- [ ] 4D.2 Build `<StatBlock>` — animated number counters (years coaching / athletes trained / class slots weekly / avg transformation weeks). Count‑up on reveal via `useReveal`.
- [ ] 4D.3 Build `<Marquee>` component for reuse (hero bottom + footer top).
- [ ] 4D.4 Tests: CTA pulse animation toggles when sticky bar visible; counters animate from 0 to target on reveal.

**Gate:** Every section has unit + interaction tests; `/` renders full hero + all sections; Lighthouse mobile performance ≥ 85 (pre‑optimisation).

### 6.7 Phase 5 — Data layer

- [ ] 5.1 Load skill `nextjs16-react19-next-auth5-drizzle-orm` Drizzle section.
- [ ] 5.2 Write `src/lib/db/schema.ts` per §4.
- [ ] 5.3 Write `src/lib/db/client.ts` — `drizzle(pool)` singleton, env‑validated.
- [ ] 5.4 Write `drizzle.config.ts` — dialect postgres, schema path, migrations dir `drizzle/migrations`.
- [ ] 5.5 Generate first migration: `pnpm drizzle:generate`.
- [ ] 5.6 Write `src/lib/db/seed.ts` — 8 coaches, 6 programs, 6 stories, 48 class slots, 1 admin user. Idempotent (`ON CONFLICT DO NOTHING`).
- [ ] 5.7 Run `pnpm db:reset` against local Postgres (or Neon dev branch).
- [ ] 5.8 Write API routes: `GET /api/programs`, `GET /api/programs/[slug]`, `GET /api/coaches`, `GET /api/coaches/[slug]`, `GET /api/stories`, `GET /api/stories/[slug]`, `GET /api/schedule`. All return `{ data: T } | { error: { code, message } }`.
- [ ] 5.9 Add Zod schemas for every response shape in `src/features/*/domain/schemas.ts`.
- [ ] 5.10 Write Vitest tests for every API route: happy path, not found, malformed slug.
- [ ] 5.11 Write integration test: full Drizzle round‑trip via `pnpm db:reset && pnpm test:integration`.

**Gate:** `pnpm db:reset` idempotent; all API routes return seeded data; tests green.

### 6.8 Phase 6 — Booking flow

- [ ] 6.1 Build `<BookingForm>` — name, email, phone, goal selector (5 pills), preferred time (4 radio cards), preferred coach (optional dropdown), notes textarea, consent checkbox.
- [ ] 6.2 Zod schema for the form: `TrialRequestSchema`. Inline error messages under each field.
- [ ] 6.3 Server action `submitTrialRequest` — validates, generates idempotency key (`crypto.randomUUID`), inserts row, fires Inngest `trial.requested`.
- [ ] 6.4 On success: toast "Trial request received — a coach will reach out within 24 hours." Form resets to initial state.
- [ ] 6.5 On error: toast with error code; form retains user input.
- [ ] 6.6 Disable submit button during async; show spinner.
- [ ] 6.7 Build `/booking/confirm` page — minimal confirmation with next‑steps timeline.
- [ ] 6.8 Rate limit `POST /api/booking` 5/min/IP via `@upstash/ratelimit`.
- [ ] 6.9 Honeypot field `company_website` (hidden, must be empty).
- [ ] 6.10 Tests: form validates; server action rejects duplicate idempotency; Inngest event fires; toast renders; rate limit returns 429.

**Gate:** End‑to‑end booking submission works locally; Inngest dev server shows the event; toast confirms.

### 6.9 Phase 7 — Memberships + Stripe

- [ ] 7.1 Load skill `nextjs16-react19-next-auth5-drizzle-orm` Stripe section.
- [ ] 7.2 Create Stripe products in test mode: Forge ($149/mo), Forge+ ($249/mo), Forge Private ($599/mo), Drop‑in pack ($120).
- [ ] 7.3 Mirror Stripe price IDs into `programs.stripePriceId` via seed update.
- [ ] 7.4 Build `<MembershipTierComparison>` — 3 columns + drop‑in row, feature checklist, "Choose" CTA per tier.
- [ ] 7.5 Build `/api/checkout/route.ts` — POST with `priceId`, creates Checkout Session, returns `url`.
- [ ] 7.6 Build `/api/stripe/webhook/route.ts` — verify signature, handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Insert/update `subscriptions` table.
- [ ] 7.7 Build `/api/stripe/portal/route.ts` — returns Customer Portal URL.
- [ ] 7.8 Idempotency keys: `userId + priceId + epochMinute`.
- [ ] 7.9 Tests: webhook signature verification (good + bad); idempotent checkout; subscription lifecycle (created / updated / deleted); portal URL returned.

**Gate:** Full Stripe test‑mode checkout completes; webhook writes a DB row; portal loads.

### 6.10 Phase 8 — AI asset generation

- [ ] 8.1 Load skill `nextjs16-react19-next-auth5-drizzle-orm` Replicate section.
- [ ] 8.2 Build `src/lib/replicate.ts` — `generateNoirPortrait(prompt: string): Promise<{url, key}>`.
- [ ] 8.3 Prompt template per §5.4. Negative prompt: "color, smiling, studio backdrop, watermark, logo".
- [ ] 8.4 Build `src/lib/r2.ts` — S3‑compatible upload to Cloudflare R2 (or local fallback dir `public/generated/`).
- [ ] 8.5 Build Inngest `asset.generate` function: `step.run('replicate')` → `step.run('upload')` → `step.run('db.update')` → `step.sendEvent('asset.ready')`.
- [ ] 8.6 Build `/admin/assets/generate` page — pick entity (coach / program / story), pick slot (portrait / hero / before / after), enter prompt override, submit.
- [ ] 8.7 Fallback path: if `REPLICATE_API_TOKEN` is missing, generate a placeholder SVG (`<svg>` with mono gradient + entity initials) and persist that. Log warning.
- [ ] 8.8 Use `image-understand` skill to QA generated images: confirm B&W, no watermark, no smiling (per brief).
- [ ] 8.9 Tests: Replicate mock returns; R2 upload writes; Inngest steps run in order; fallback path triggers when env missing.

**Gate:** Admin can generate a coach portrait via Replicate (or fallback); image appears in the coach flip card.

### 6.11 Phase 9 — Auth + admin

- [ ] 9.1 Load skill `security-and-hardening` SKILL.md.
- [ ] 9.2 Configure Auth.js v5 in `src/lib/auth.ts` — Credentials provider (bcrypt) + Email magic link (Resend). Drizzle adapter.
- [ ] 9.3 Add `role` column to `users` (`member` | `admin`). Seed 1 admin from `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` env.
- [ ] 9.4 Build `/admin/login` page — email + password, error toast on failure, rate limit 5/10min/IP.
- [ ] 9.5 Build `src/app/admin/layout.tsx` — server component, `getServerSession`, redirect to `/admin/login` if no session, 403 if `role !== 'admin'`.
- [ ] 9.6 Build admin CRUD pages: `/admin/coaches`, `/admin/coaches/new`, `/admin/coaches/[id]/edit`. Same for programs, stories, class slots.
- [ ] 9.7 All mutations via server actions with Zod validation + `revalidatePath`.
- [ ] 9.8 Build `/admin` dashboard — counts + recent trial requests + recent subscriptions.
- [ ] 9.9 CSRF: Auth.js default double‑submit cookie. Verify on every mutation.
- [ ] 9.10 Tests: admin login flow; non‑admin gets 403; CRUD creates + updates + deletes; rate limit blocks 6th login attempt.

**Gate:** Admin can log in, create a coach, publish it, see it on `/coaches`.

### 6.12 Phase 10 — Security & QA hardening

- [ ] 10.1 Load skill `vulnerability-scanner` SKILL.md + `code-quality-standards` SKILL.md.
- [ ] 10.2 Run `skills/vulnerability-scanner/scripts/security_scan.py` against `src/`. Fix every P1/P2 finding.
- [ ] 10.3 Run `skills/frontend-design/scripts/accessibility_checker.py` against every page. Fix every WCAG AAA violation.
- [ ] 10.4 Run `skills/frontend-design/scripts/ux_audit.py` against `/`, `/programs`, `/coaches`, `/stories`, `/booking`.
- [ ] 10.5 Add CSP `report-to` endpoint; collect violations for 7 days pre‑launch.
- [ ] 10.6 Run `pnpm test:e2e` (Playwright) — every spec green.
- [ ] 10.7 Run Lighthouse mobile on every primary route. Target: Perf ≥ 95, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- [ ] 10.8 Run `pnpm typecheck && pnpm lint && pnpm test`. All green.
- [ ] 10.9 Bundle analysis: `pnpm build` + `@next/bundle-analyzer`. Largest module must be < 80 KB gzipped (excluding Next runtime).
- [ ] 10.10 OWASP ZAP baseline scan against local dev server. Fix every HIGH/CRITICAL.

**Gate:** All scans clean; Lighthouse targets met.

### 6.13 Phase 11 — Content polish & SEO

- [ ] 11.1 Replace placeholder coach / story / program copy with real‑sounding seed data (hire copywriter pass if budget allows).
- [ ] 11.2 Generate final B&W photography via Phase 8 pipeline for all 8 coaches, 6 program heroes, 6 story before/afters.
- [ ] 11.3 Add JSON‑LD `HealthClub` schema on `/`, `Person` on `/coaches/[slug]`, `Course` on `/programs/[slug]`, `Review` on `/stories/[slug]`.
- [ ] 11.4 Add `metadataBase`, `openGraph`, `twitter`, `robots`, `sitemap.ts`, `manifest.ts` in `src/app/`.
- [ ] 11.5 Add per‑route `metadata` with title template `%s · IRONFORGE`.
- [ ] 11.6 Add `alt` text on every image (real description, not "athlete").
- [ ] 11.7 Add 404 + 500 error pages with brand styling + suggested next actions.
- [ ] 11.8 Add `loading.tsx` skeletons for every async route.
- [ ] 11.9 Verify all internal links resolve (no 404s) via Playwright crawl.
- [ ] 11.10 Run Lighthouse SEO category — target 100.

**Gate:** SEO audit clean; every image has alt; JSON‑LD validates in Schema.org validator.

### 6.14 Phase 12 — Docs & ADRs

- [ ] 12.1 Write `README.md` — quickstart, env vars, scripts, deploy.
- [ ] 12.2 Write `ARCHITECTURE.md` — 5‑layer model, data flow, sequence diagrams.
- [ ] 12.3 Write ADRs in `docs/adr/`:
  - ADR‑001 Adopt 5‑layer golden rule
  - ADR‑002 CSP `unsafe-inline` for styles (Next.js App Router)
  - ADR‑003 Auth.js v5 beta pin
  - ADR‑004 Drizzle over Prisma
  - ADR‑005 Inngest over BullMQ
  - ADR‑006 Replicate for AI assets
  - ADR‑007 Stripe Checkout over embedded form
  - ADR‑008 Image Ken Burns over MP4 for hero reel
  - ADR‑009 English‑only for v1
  - ADR‑010 Dark‑mode only for v1
- [ ] 12.4 Write `docs/runbooks/booking.md`, `docs/runbooks/stripe-webhook.md`, `docs/runbooks/auth.md`, `docs/runbooks/ai-asset-gen.md`.
- [ ] 12.5 Write `docs/lessons.md` — every NF‑* lesson captured during build.
- [ ] 12.6 Write `docs/design-tokens.md` (final, post‑build).
- [ ] 12.7 Update this `Master Execution Plan.md` to v2 with phase retrospectives.

**Gate:** Reviewer can clone, run, deploy, and operate the site from docs alone.

### 6.15 Phase 13 — Handoff & task‑review

- [ ] 13.1 Write `scripts/smoke-test.sh` — 30‑second production URL check (status codes + key selectors).
- [ ] 13.2 Set up Vercel deploy + Vercel Analytics + Speed Insights.
- [ ] 13.3 Run smoke test against production URL.
- [ ] 13.4 Load skill `task-review` SKILL.md. Distill the build into a reusable skill `nextjs16-fitness-studio-brand-site` under `skills/`.
- [ ] 13.5 Optional: invoke `to-distill-project-into-skill` for the full distillation.
- [ ] 13.6 Schedule 7‑day post‑launch review meeting.

**Gate:** Production live; smoke test green; distillation skill captured.

---

## 7. Detailed ToDo List (Master)

> Single flat list of every checkbox across all phases. Copy into your tracker of choice. Items prefixed with their phase number for traceability.

### Setup & hygiene
- [ ] 0.1 Add `packageManager` field
- [ ] 0.2 Add `.nvmrc`
- [ ] 0.3 Add `.env.example`
- [ ] 0.4 Verify `.env.local` gitignored
- [ ] 0.5 Add `.editorconfig`
- [ ] 0.6 Wire `prettier-plugin-tailwindcss`
- [ ] 0.7 Verify `lint-staged` config
- [ ] 0.8 Add Husky `pre-commit` (lint-staged + typecheck)
- [ ] 0.9 Add Husky `pre-push` (test)
- [ ] 0.10 Add `renovate.json` (hold next-auth major)
- [ ] 0.11 Tighten `tsconfig.json` strict flags
- [ ] 0.12 Verify all green scripts
- [ ] 0.13 Create `src/` skeleton dirs

### Tokens & fonts
- [ ] 1.1 Load `tailwind-patterns`
- [ ] 1.2 Load `avant-garde-design-v4/09-color-palettes.md`
- [ ] 1.3 Write `globals.css` `@theme`
- [ ] 1.4 Add `@utility` rules
- [ ] 1.5 Install fonts via `next/font`
- [ ] 1.6 Wire font CSS variables
- [ ] 1.7 Brand‑token forbidden‑colour test
- [ ] 1.8 Brand‑token contrast test
- [ ] 1.9 Write `docs/design-tokens.md`
- [ ] 1.10 Add `eslint-plugin-tailwindcss`

### Layout primitives
- [ ] 2.1 Load `ui-styling`
- [ ] 2.2 Load `avant-garde-design-v4/05-component-patterns.md`
- [ ] 2.3 Generate shadcn primitives
- [ ] 2.4 Wrap with IRONFORGE styling
- [ ] 2.5 Build `<Container>` / `<Section>` / `<SectionMarker>`
- [ ] 2.6 Build `<SiteHeader>`
- [ ] 2.7 Build `<SiteFooter>`
- [ ] 2.8 Build `<GrainOverlay>`
- [ ] 2.9 Build `<StickyCTABar>`
- [ ] 2.10 `src/app/(marketing)/layout.tsx`
- [ ] 2.11 `/dev/atoms` route
- [ ] 2.12 Vitest component tests
- [ ] 2.13 Playwright layout E2E

### Hero reel
- [ ] 3.1 Load `frontend-design` animation refs
- [ ] 3.2 Load `avant-garde-design-v4/14-animation-standards.md`
- [ ] 3.3 `<HeroReel>` server component
- [ ] 3.4 `<ReelFrame>`
- [ ] 3.5 Ken Burns keyframes
- [ ] 3.6 Cross‑fade cycle
- [ ] 3.7 `<ReelControl>` mute toggle + equalizer
- [ ] 3.8 Progress bar
- [ ] 3.9 Chapter counter
- [ ] 3.10 Headline lock‑up
- [ ] 3.11 Hero copy + coach strip preview
- [ ] 3.12 Marquee ticker
- [ ] 3.13 Scan‑line overlay
- [ ] 3.14 Hero parallax
- [ ] 3.15 `useReveal` hook
- [ ] 3.16 `useReducedMotion` hook
- [ ] 3.17 `useScrolled` hook
- [ ] 3.18 Hook unit tests
- [ ] 3.19 Hero Playwright E2E
- [ ] 3.20 LCP budget verification

### Marketing sections
- [ ] 4A.1–4A.5 Programs preview + grid
- [ ] 4B.1–4B.5 Coach flip grid
- [ ] 4C.1–4C.7 Stories carousel
- [ ] 4D.1–4D.4 Booking CTA + StatBlock + Marquee

### Data layer
- [ ] 5.1 Load Drizzle skill section
- [ ] 5.2 `schema.ts`
- [ ] 5.3 `client.ts`
- [ ] 5.4 `drizzle.config.ts`
- [ ] 5.5 First migration
- [ ] 5.6 `seed.ts`
- [ ] 5.7 `pnpm db:reset`
- [ ] 5.8 API routes
- [ ] 5.9 Zod response schemas
- [ ] 5.10 API Vitest tests
- [ ] 5.11 Integration test

### Booking flow
- [ ] 6.1 `<BookingForm>`
- [ ] 6.2 Zod schema
- [ ] 6.3 Server action
- [ ] 6.4 Success toast
- [ ] 6.5 Error toast
- [ ] 6.6 Async button state
- [ ] 6.7 `/booking/confirm`
- [ ] 6.8 Rate limit
- [ ] 6.9 Honeypot
- [ ] 6.10 Booking tests

### Memberships + Stripe
- [ ] 7.1 Load Stripe skill section
- [ ] 7.2 Create Stripe products
- [ ] 7.3 Mirror price IDs in seed
- [ ] 7.4 `<MembershipTierComparison>`
- [ ] 7.5 `/api/checkout`
- [ ] 7.6 `/api/stripe/webhook`
- [ ] 7.7 `/api/stripe/portal`
- [ ] 7.8 Idempotency keys
- [ ] 7.9 Stripe tests

### AI asset generation
- [ ] 8.1 Load Replicate skill section
- [ ] 8.2 `src/lib/replicate.ts`
- [ ] 8.3 Prompt template
- [ ] 8.4 `src/lib/r2.ts`
- [ ] 8.5 Inngest `asset.generate`
- [ ] 8.6 `/admin/assets/generate`
- [ ] 8.7 Fallback path
- [ ] 8.8 Image QA via `image-understand`
- [ ] 8.9 Asset tests

### Auth + admin
- [ ] 9.1 Load `security-and-hardening`
- [ ] 9.2 Auth.js v5 config
- [ ] 9.3 `role` column
- [ ] 9.4 `/admin/login`
- [ ] 9.5 `/admin` layout guard
- [ ] 9.6 CRUD pages (coaches / programs / stories / class slots)
- [ ] 9.7 Server actions
- [ ] 9.8 `/admin` dashboard
- [ ] 9.9 CSRF verify
- [ ] 9.10 Auth tests

### Security & QA
- [ ] 10.1 Load `vulnerability-scanner` + `code-quality-standards`
- [ ] 10.2 Security scan + fixes
- [ ] 10.3 A11y scan + fixes
- [ ] 10.4 UX audit
- [ ] 10.5 CSP report‑to
- [ ] 10.6 Full Playwright run
- [ ] 10.7 Lighthouse mobile
- [ ] 10.8 typecheck + lint + test
- [ ] 10.9 Bundle analysis
- [ ] 10.10 OWASP ZAP baseline

### Content & SEO
- [ ] 11.1 Real copy seed
- [ ] 11.2 Final photography
- [ ] 11.3 JSON‑LD schemas
- [ ] 11.4 `metadataBase` + OG + Twitter + robots + sitemap + manifest
- [ ] 11.5 Per‑route `metadata`
- [ ] 11.6 Alt text pass
- [ ] 11.7 404 + 500 pages
- [ ] 11.8 `loading.tsx` skeletons
- [ ] 11.9 Internal link crawl
- [ ] 11.10 Lighthouse SEO = 100

### Docs & ADRs
- [ ] 12.1 `README.md`
- [ ] 12.2 `ARCHITECTURE.md`
- [ ] 12.3 ADRs 001–010
- [ ] 12.4 Runbooks (4)
- [ ] 12.5 `docs/lessons.md`
- [ ] 12.6 `docs/design-tokens.md` final
- [ ] 12.7 This plan v2 retrospective

### Handoff
- [ ] 13.1 `scripts/smoke-test.sh`
- [ ] 13.2 Vercel deploy + analytics
- [ ] 13.3 Production smoke test
- [ ] 13.4 `task-review` skill distillation
- [ ] 13.5 Optional full `to-distill-project-into-skill`
- [ ] 13.6 Post‑launch review scheduled

---

## 8. Quality Gates (per phase)

| Phase | Gate | Tooling |
|---|---|---|
| 0 | `pnpm install && pnpm typecheck && pnpm lint && pnpm test` green | pnpm scripts |
| 1 | Brand‑token tests green; contrast ≥ 7:1 | Vitest |
| 2 | `/dev/atoms` renders all primitives | Playwright |
| 3 | LCP ≤ 2.5s mobile 4G; reduced‑motion disables Ken Burns | Playwright `vitals()` |
| 4 | All section tests green; Lighthouse mobile Perf ≥ 85 | Vitest + Playwright + Lighthouse |
| 5 | `pnpm db:reset` idempotent; API routes return seeded data | Vitest integration |
| 6 | End‑to‑end booking works; Inngest event fires | Playwright + Inngest dev UI |
| 7 | Stripe test checkout completes; webhook writes DB row | Stripe CLI + Playwright |
| 8 | Admin generates a coach portrait (or fallback) | Manual + Playwright |
| 9 | Admin CRUD works; rate limit blocks brute force | Playwright |
| 10 | OWASP clean; Lighthouse mobile ≥ 95 across categories | OWASP ZAP + Lighthouse CI |
| 11 | SEO = 100; JSON‑LD validates | Lighthouse + Schema.org validator |
| 12 | Docs complete; reviewer runs clone → deploy | Manual review |
| 13 | Production smoke test green | `scripts/smoke-test.sh` |

---

## 9. Skill Load Order

Read in this exact order at the start of each phase. Each `SKILL.md` is read completely before any referenced files (per the persona's "read full contents of a file every time" rule).

| Phase | Skills loaded | Files |
|---|---|---|
| 0 | (none) | — |
| 1 | `tailwind-patterns`, `avant-garde-design-v4` | `SKILL.md` + `references/09-color-palettes.md` |
| 2 | `ui-styling`, `avant-garde-design-v4` | `SKILL.md` (both) + `references/05-component-patterns.md` + `references/shadcn-theming.md` |
| 3 | `frontend-design`, `avant-garde-design-v4` | `animation-guide.md`, `motion-graphics.md`, `visual-effects.md`, `references/14-animation-standards.md` |
| 4 | `frontend-ui-engineering`, `ui-ux-pro-max` | `SKILL.md` (both) |
| 5 | `nextjs16-react19-next-auth5-drizzle-orm` | `SKILL.md` (Drizzle section) |
| 6 | `nextjs16-react19-next-auth5-drizzle-orm`, `api-and-interface-design` | Inngest section + `SKILL.md` |
| 7 | `nextjs16-react19-next-auth5-drizzle-orm`, `security-and-hardening` | Stripe section + `SKILL.md` |
| 8 | `nextjs16-react19-next-auth5-drizzle-orm`, `image-understand` | Replicate section + `SKILL.md` |
| 9 | `security-and-hardening` | Full `SKILL.md` |
| 10 | `vulnerability-scanner`, `code-quality-standards`, `nextjs-react-expert` | Full `SKILL.md` (all three) |
| 11 | `seo-content-writer`, `web-design-guidelines` | `SKILL.md` (both) |
| 12 | `documentation-and-adrs`, `readme-md`, `agents-md` | `SKILL.md` (all three) |
| 13 | `task-review`, `to-distill-project-into-skill` | `SKILL.md` (both) |

---

## 10. Performance Budget

| Metric | Budget | Enforcement |
|---|---|---|
| LCP (mobile 4G) | ≤ 2.5s | Lighthouse CI gate in Phase 3 + 10 |
| INP | ≤ 200ms | Playwright `vitals()` in Phase 10 |
| CLS | ≤ 0.1 | Lighthouse CI gate in Phase 4 |
| JS bundle (initial) | ≤ 180 KB gzipped | `@next/bundle-analyzer` in Phase 10 |
| Largest route chunk | ≤ 80 KB gzipped | Bundle analyzer |
| Image weight (above fold) | ≤ 200 KB total | `next/image` AVIF + responsive `sizes` |
| Image weight (below fold) | ≤ 100 KB per image | `next/image` lazy + AVIF |
| Font weight | ≤ 250 KB total (4 families, 12 weights) | Subset to latin + latin‑ext |
| Time to Interactive | ≤ 3.5s mobile 4G | Lighthouse CI |
| Server TTFB | ≤ 200ms p95 | Vercel Analytics |

**Forbidden:** client‑side `framer-motion`, `gsap`, `lottie`, `three.js`. All motion is CSS or React state. (Exception: a single `requestAnimationFrame` loop for grain parallax — pausable.)

---

## 11. Accessibility Budget (WCAG AAA)

| Criterion | Standard | How we meet it |
|---|---|---|
| 1.4.6 Contrast (AAA) | 7:1 body, 4.5:1 large | Token test asserts `--color-fg` on `--color-bg` ≥ 7:1 |
| 1.4.13 Content on hover or focus | Dismissible, hoverable, persistent | Coach flip cards use `<button>` wrapper; Esc dismisses |
| 2.1.1 Keyboard | All functionality | Every interactive element is reachable; carousel arrows work; flip cards flip on Enter |
| 2.1.2 No keyboard trap | — | Modal (booking dialog) traps focus correctly but releases on close |
| 2.2.2 Pause, Stop, Hide | Auto‑moving content | Hero reel pause button; carousel auto‑advance pauses on hover / focus / reduced‑motion |
| 2.3.3 Animation from interactions | — | `prefers-reduced-motion` disables all transforms |
| 2.4.1 Bypass blocks | — | "Skip to content" link first in DOM |
| 2.4.7 Focus visible | — | Custom `:focus-visible` ring in `--color-accent` |
| 2.5.3 Label in name | — | Every icon button has `aria-label` |
| 3.1.2 Language of parts | — | `lang` attr on any non‑English content (none in v1) |
| 3.2.3 Consistent navigation | — | Header / footer identical across routes |
| 3.3.1 Error identification | — | Inline error per field + `aria-invalid` + `aria-describedby` |
| 4.1.2 Name, Role, Value | — | All custom widgets have ARIA roles; flip card = `button`; carousel = `region` with `aria-roledescription="carousel"` |

**Tooling:** `@axe-core/playwright` in every E2E test; `skills/frontend-design/scripts/accessibility_checker.py` in Phase 10.

---

## 12. Security Checklist (OWASP 2025)

| Control | Implementation |
|---|---|
| A01 Broken Access Control | Server‑side session check on every `/admin/*` route; `role === 'admin'` enforced server‑side; deny by default |
| A02 Cryptographic Failures | bcrypt (cost 12) for admin passwords; TLS 1.3 only; HSTS 1 year; no plaintext PII in logs |
| A03 Injection | All DB queries via Drizzle parameterised builder; Zod validation on every input; no raw SQL |
| A04 Insecure Design | Threat model in `docs/security.md`; rate limit on every mutation; idempotency keys on bookings + checkout |
| A05 Security Misconfiguration | CSP + 6 security headers; `X-Powered-By` removed; env vars Zod‑validated at boot |
| A06 Vulnerable Components | `pnpm audit` in CI; Renovate holds `next-auth` major; Dependabot alerts subscribed |
| A07 ID & Auth Failures | Auth.js v5 beta pinned; rate limit login; session rotation on role change; magic link expires 15 min |
| A08 Software & Data Integrity | Stripe webhook signature verification; Inngest idempotency; npm provenance checked |
| A09 Security Logging | Structured logs (pino) for auth events, bookings, Stripe, errors; shipped to Vercel Log Drain |
| A10 SSRF | Replicate + R2 URLs validated against allowlist; no user‑supplied URLs fetched server‑side |

**Tooling:** `skills/vulnerability-scanner/scripts/security_scan.py` in Phase 10; OWASP ZAP baseline scan in Phase 10.

---

## 13. Out of Scope (v1)

Explicitly excluded to protect schedule:

1. Multi‑location support (schema ready, UI not built).
2. Light mode (token hook reserved).
3. i18n (English only).
4. Mobile app / PWA install prompt (manifest ships, no install CTA).
5. Member portal (auth‑gated area for paying members to view their bookings).
6. Class booking with capacity enforcement (lead capture only in v1).
7. Coach scheduling UI (admin can edit class slots, no calendar view).
8. Video player for stories (static before/after images + quote only).
9. Live chat / Intercom.
10. Blog / content marketing engine.

Each of these is logged in `docs/future.md` for v2 planning.

---

## 14. VALIDATE — Explicit Confirmation Checkpoint

> Per the persona workflow: *"Never proceed to implementation without validation."*

This plan is the **VALIDATE** gate. Before any production code is written (Phase 0 onward), the user must explicitly confirm:

### 14.1 Confirmations required

1. **Stack lock‑in.** Are you OK with the 17‑skill roster in §2 and the exclusion list in §2.3?
2. **Ambiguity register.** Do the default proposals in §1.3 (A1–A10) match your intent? Especially A1 (booking = lead capture, not Stripe), A2 (AI imagery via Replicate), A3 (Postgres for coaches/stories), A4 (auth reserved for admin), A7 (image Ken Burns, not MP4), A10 (Vercel Analytics).
3. **Scope.** Is the v1 scope in §13 (out‑of‑scope items) acceptable?
4. **Visual direction.** Does the §3.1 concept direction ("FORGED IN IRON." editorial noir + industrial telemetry) match the brand you want? Brand name `IRONFORGE` — keep or rename?
5. **Phasing.** Are the 13 phases in §6 sequenced correctly for your priorities? Would you rather ship Phase 0–6 first (marketing + booking lead capture) and treat Phase 7–9 (Stripe, AI, Auth) as v1.1?
6. **Performance / a11y budgets.** Are the budgets in §10–11 acceptable, or do you want to relax any?
7. **Timeline.** This plan implies roughly 8–12 engineering days for a single senior dev. Do you have that runway, or do we need to compress Phase 7–9 into a stub?
8. **Environment.** Do you have Stripe test mode keys, Replicate API token, Upstash Redis URL, Resend (or SMTP) credentials, Cloudflare R2 bucket + keys, and a Postgres instance (Neon recommended) ready? Without these, Phase 6–9 will need stubs.

### 14.2 How to confirm

Reply with one of:

- ✅ **"Plan approved — proceed to Phase 0."** (We begin implementation.)
- ✏️ **"Plan approved with modifications: …"** (List changes; we re‑issue the plan v1.1 and proceed.)
- ❌ **"Re‑plan: …"** (List concerns; we re‑work ANALYZE + PLAN and re‑submit.)

Until confirmation is received, no code is written.

---

## 15. Next Steps (post‑confirmation)

1. Load skill `planning-and-task-breakdown` SKILL.md and convert this plan into the project's issue tracker (Linear / GitHub Projects recommended).
2. Branch off `main` as `feat/forge-os-phase-0`.
3. Execute Phase 0 → commit per checkbox → push → PR.
4. Each phase ends with a PR review against this plan + the Six‑Axis checklist from `code-quality-standards`.
5. Phase 13 ends with `Complete` tool invocation and the production URL shared with the user.

---

*End of Master Execution Plan v1.0. Awaiting validation.*
