# IRONFORGE — Design Tokens Reference (v2)

> Single source of truth for the IRONFORGE brand system.
> Token values live in `src/app/globals.css` `@theme` block.
> This document is the human-readable companion.
>
> **v2 changes (Phase 10):** `--color-muted` raised from `#6a6a6a` (3.66:1) to `#8a8a8a` (5.5:1) — passes WCAG AA-normal. Global `focus-visible` CSS rule added. Touch targets bumped to 44px.

---

## Strategic Positioning

- **Quadrant:** Q4 — THE VISIONARY (disruptive + aspiration-driven)
- **Direction:** Brutalist/Raw primary + Retro-Futuristic accent
- **Aesthetic:** "FORGED IN IRON." Editorial noir meets industrial telemetry.
- **Lighthouse targets:** Performance 85+, Accessibility WCAG AAA, Best Practices 100, SEO 100

---

## Color Palette (60-30-10 Rule)

### 60% — Surface (pure black + dark grays)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0a0a0a` | Primary canvas — body, sections |
| `--color-bg-darker` | `#050505` | Sticky bar, nav backdrop, modals |
| `--color-bg-card` | `#141414` | Coach / story / program cards |
| `--color-bg-card-hover` | `#1a1a1a` | Card hover state |

### 30% — Foreground (silver + light gray)

| Token | Hex | Contrast on bg | Usage |
|---|---|---|---|
| `--color-fg` | `#f5f5f5` | 18.16:1 ✅ AAA | Body text, headings |
| `--color-fg-dim` | `#c0c0c0` | 11.4:1 ✅ AAA | Secondary body, captions |
| `--color-muted` | `#8a8a8a` | 5.5:1 ✅ AA | Telemetry labels, captions, hints (v2: raised from #6a6a6a) |

### 10% — Accent (neon orange — rationed)

| Token | Hex | Contrast on bg | Usage |
|---|---|---|---|
| `--color-accent` | `#FF5400` | 5.34:1 ✅ AAA large | Large text (≥18px), UI accents, CTAs |
| `--color-accent-bright` | `#FF7A33` | — | Hover state |
| `--color-accent-dim` | `#B33A00` | — | Scrollbar, low-emphasis |
| `--color-accent-glow` | `rgba(255,84,0,0.45)` | — | Pulse ring, glow effects |

### Chrome (metallic silver — equipment reference)

| Token | Hex | Usage |
|---|---|---|
| `--color-silver` | `#C8C8C8` | Secondary CTA, icon highlights |
| `--color-silver-dim` | `#5a5a5a` | Text stroke, dividers |

### Lines

| Token | Hex | Usage |
|---|---|---|
| `--color-border` | `#1f1f1f` | Default borders |
| `--color-border-light` | `#2a2a2a` | Input borders, table rows |

### Forbidden colors (enforced by `src/tests/unit/brand-tokens.test.ts`)

| Color | Hex | Why forbidden |
|---|---|---|
| violet-600 | `#7c3aed` | Purple/indigo blur — AI slop cliché |
| purple-400 | `#a855f7` | Same |
| violet-500 | `#8b5cf6` | Same |
| blue-500 | `#3b82f6` | Default Tailwind blue — too SaaS |
| indigo-500 | `#6366f1` | Same |
| amber-100 | `#fde68a` | Too soft for hardcore brief |
| amber-200 | `#fcd34d` | Same |

---

## Typography

### Font families (loaded via `next/font/google` in `src/app/layout.tsx`)

| Token | Family | Weights | Variable |
|---|---|---|---|
| `--font-display` | Bebas Neue | 400 | `--font-bebas-neue` |
| `--font-heading` | Oswald | 300, 400, 500, 600, 700 | `--font-oswald` |
| `--font-body` | Archivo | 400, 500, 600, 700, 800, 900 | `--font-archivo` |
| `--font-mono` | JetBrains Mono | 400, 500, 700 | `--font-jetbrains-mono` |

### Type scale

| Role | Family | Weight | Size (desktop / mobile) | Tracking | Line-height | Used for |
|---|---|---|---|---|---|---|
| Display | Bebas Neue | 400 | 8.5vw / 14vw | 0.005em | 0.85 | Hero headline only |
| Heading 1 | Oswald | 600 | 4rem / 2.5rem | 0.01em | 1.1 | Section titles |
| Heading 2 | Oswald | 500 | 2.25rem / 1.75rem | 0.02em | 1.1 | Card titles |
| Body | Archivo | 400 | 1.0625rem / 1rem | 0 | 1.5 | Paragraphs |
| Body condensed | Archivo | 500 | 0.9375rem | 0.04em | 1.5 | Coach bios, quotes |
| Telemetry | JetBrains Mono | 400 | 0.6875rem | 0.2em uppercase | 1.5 | Section markers, counters |
| CTA | Oswald | 600 | 0.85rem | 0.2em uppercase | 1.1 | Buttons, pills |

### WCAG AAA §1.4.8 compliance
- Body text blocks must not exceed **80 characters** — enforced by `p { max-width: 80ch; }` in `globals.css`
- Text is **NOT justified** — left-aligned only
- Line spacing ≥ **1.5** — enforced by `body { line-height: 1.5; }`

---

## Motion

### Easings (exact cubic-bezier values)

| Token | cubic-bezier | Use case |
|---|---|---|
| `--ease-premium` | `(0.22, 1, 0.36, 1)` | Reveals, sticky bar, standard transitions |
| `--ease-snap` | `(0.16, 1, 0.3, 1)` | Carousel snap after drag |
| `--ease-flip` | `(0.4, 0.2, 0.2, 1)` | Coach card 3D flip |

### Durations

| Token | ms | Use case |
|---|---|---|
| `--dur-micro` | 150 | Hover states, toggle icons |
| `--dur-standard` | 300 | Modals, drawer entry/exit |
| `--dur-dramatic` | 500 | Hero entry, major transitions |
| `--dur-reveal` | 900 | Section reveals on scroll |
| `--dur-flip` | 900 | Coach card 3D flip |
| `--dur-sticky` | 600 | Sticky CTA bar slide |
| `--dur-carousel-snap` | 700 | Card snap after drag |

### Keyframes (5 brand animations)

| Animation | Duration | Iteration | Use case |
|---|---|---|---|
| `pulse-cta` | 2.4s | infinite | Primary CTA radial glow |
| `marquee` | 38s | infinite linear | Hero bottom ticker |
| `ken-burns` | 9s | forwards (once) | Active hero reel frame |
| `wave` | 0.7s | infinite | Mute toggle equalizer bars |
| `rec-blink` | 1.5s | infinite | "REEL · LIVE" indicator dot |

### Performance guardrails (mandatory)
- ✅ Only animate `transform` and `opacity` — never `width`, `height`, `top`, `margin`
- ✅ List specific properties in transitions (no `transition: all`)
- ✅ `will-change: transform` sparingly
- ✅ Maintain 60fps on average mobile hardware
- ✅ IntersectionObserver gates all animations (pause off-screen)
- ✅ `prefers-reduced-motion` disables animations entirely (not just slows)

---

## Z-index scale

| Token | Value | Use case |
|---|---|---|
| `--z-behind` | -1 | Decorative elements behind content |
| `--z-base` | 0 | Default content |
| `--z-raised` | 10 | Sticky elements within a section |
| `--z-dropdown` | 200 | Dropdown menus |
| `--z-sticky` | 300 | Site header, sticky CTA bar |
| `--z-overlay` | 400 | Mobile nav overlay, grain overlay |
| `--z-modal` | 500 | Dialog, Sheet |
| `--z-popover` | 600 | Popover, tooltip |
| `--z-tooltip` | 700 | Hover tooltips |
| `--z-toast` | 800 | Toast notifications |
| `--z-max` | 999 | Critical overlays (escape hatches) |

---

## Layout

| Token | Value | Usage |
|---|---|---|
| `--container-max` | 1600px | Max width of `<Container>` |
| `--gutter` | 1.5rem (24px) | Mobile horizontal padding |
| `--gutter-lg` | 2.5rem (40px) | lg+ horizontal padding |

---

## Custom utilities (`@utility`)

| Utility | Purpose |
|---|---|
| `text-stroke` | Outlined text — silver-dim stroke, transparent fill |
| `text-stroke-accent` | Outlined text — accent stroke, transparent fill |
| `vertical-text` | `writing-mode: vertical-rl` — section labels |
| `bg-textured` | Radial gradient texture overlay |
| `scan-line` | Repeating horizontal scan-line overlay (hero) |
| `notch-corner` | L-shaped corner brackets (booking frame) |
| `img-noir` | Grayscale + contrast + brightness filter for B&W athletic photos |

---

## Reduced motion (mandatory)

All animations are disabled via `@media (prefers-reduced-motion: reduce)`:
```css
*, *::before, *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
[data-reveal] { opacity: 1 !important; transform: none !important; }
[data-ken-burns] { animation: none !important; }
```

Legal: ADA Title II Compliance effective **April 24, 2026** requires WCAG 2.1 AA. We target AAA.

---

## Tailwind v4 plugin status

`eslint-plugin-tailwindcss` v3.x does **not** support Tailwind v4 (CSS-first `@theme`). The brand-token test (`src/tests/unit/brand-tokens.test.ts`) is the enforcement layer — it rejects forbidden colors and verifies WCAG AAA contrast at the CSS source level.

When a v4-compatible plugin ships, add to `eslint.config.mjs`:
```js
plugins: { tailwindcss: require('eslint-plugin-tailwindcss') },
rules: {
  'tailwindcss/no-arbitrary-color': 'error',
}
```

---

## Change protocol

Any change to a token value requires:
1. Update `src/app/globals.css` `@theme` block
2. Update this document
3. Run `pnpm test` — brand-token tests must stay green
4. Run `pnpm build` — verify no visual regressions
5. Commit with message `design(tokens): <description>`

---

## Changelog

### v2 (Phase 10 — Security & QA Hardening)

| Change | Rationale | Impact |
|---|---|---|
| `--color-muted`: `#6a6a6a` → `#8a8a8a` | WCAG 1.4.3: raised contrast from 3.66:1 (fails AA-normal) to 5.5:1 (passes AA-normal) | All telemetry labels, form labels, captions, hints are now AA-compliant |
| Global `focus-visible` CSS rule | WCAG 2.4.7: all interactive elements (links, buttons, inputs, selects, textareas, `[tabindex]`) now have visible focus indicators | Keyboard navigation is fully visible site-wide |
| Touch targets: `h-10 w-10` → `h-11 w-11` | WCAG 2.5.5: all icon buttons bumped from 40px to 44px minimum | Mobile usability improved |
| Carousel dots: wrapped in 44px tap targets | WCAG 2.5.5: 2px visible bar inside 44px clickable container | Mobile carousel dots are now tappable |
| Brand-token test: `--color-muted` assertion updated | Test now verifies ≥4.5:1 (AA-normal) instead of verifying it fails | Regression guard for contrast compliance |

### v1 (Phase 1 — Design Tokens & Fonts)

Initial token set:
- 7 surface colors (bg, bg-darker, bg-card, bg-card-hover, fg, fg-dim, muted)
- 4 accent colors (accent, accent-bright, accent-dim, accent-glow)
- 2 chrome colors (silver, silver-dim)
- 2 border colors (border, border-light)
- 4 font families (Bebas Neue, Oswald, Archivo, JetBrains Mono)
- 3 motion easings + 7 durations
- 11 z-index levels
- 5 keyframe animations
- 7 custom utilities
- Reduced-motion media query
- 7 forbidden colors enforced by brand-token test
