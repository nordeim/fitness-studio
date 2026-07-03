# ADR-010: Dark-Mode Only for v1

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The IRONFORGE brand is "hardcore luxury" — pure black canvas, neon orange accent, B&W photography. The Visual Strategy explicitly calls for "dark, strong textural feel." The question is whether to also support a light mode.

Adding light mode would require:
- Dual color tokens for every brand color
- `next-themes` provider + `darkMode: 'class'` config
- Theme toggle UI component
- Testing every component in both themes
- Ensuring B&W noir photography looks acceptable on light backgrounds

## Decision

Ship **dark-mode-only** for v1. Do NOT add `next-themes` or a theme toggle.

## Rationale

1. **Brand integrity** — The entire visual identity (pure black, neon orange, B&W photography, grain overlay) is designed for dark backgrounds. A light mode would dilute the brand.
2. **Photography conflict** — B&W noir athletic photography with `grayscale(100%) contrast(1.55) brightness(0.42)` filter is tuned for dark backgrounds. On light backgrounds, the images would look washed out.
3. **Complexity cost** — Supporting both themes doubles the testing surface and requires maintaining two sets of contrast-compliant tokens.
4. **WCAG compliance** — The brand-token test enforces specific contrast ratios on the dark palette. Adding a light palette would require a parallel set of tests.
5. **Performance** — No `next-themes` JavaScript, no flash of wrong theme (FOUC), no theme cookie.

## Implementation

- `globals.css` defines dark tokens directly in `@theme` (no `.dark` class selector)
- No `next-themes` dependency
- No theme toggle in the header/footer
- `<html>` has no `class="dark"` or `data-theme` attribute — the dark palette is the default

## Consequences

**Positive:**
- Single design surface (no light/dark testing matrix)
- Brand integrity maintained (dark is the brand)
- No theme flash (FOUC) on page load
- Smaller bundle (no next-themes JS)
- Photography filter tuned for one background

**Negative:**
- Users who prefer light mode cannot switch
- OLED battery savings are maxed (pure black) but LCD users see no benefit
- If the brand ever softens, light mode migration would require re-tuning all tokens + photography filters

**Future option:**
- The `@theme` block structure makes adding a light palette straightforward (add `:root[data-theme='light']` overrides)
- The `next-themes` package can be added later without architectural changes
- Photography filters would need a light-mode variant (lower contrast reduction, higher brightness)
