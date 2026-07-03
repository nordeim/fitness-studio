# ADR-008: Image Ken Burns over MP4 for Hero Reel

**Status:** Accepted
**Date:** 2026-07-02 (Phase 3)
**Decider:** Super Z

## Context

The Visual Strategy specifies: "Hero auto-plays a muted slow-motion training reel; click to unmute." Two approaches:

1. **MP4 video** — actual video file, `<video autoplay muted>` element
2. **Image Ken Burns** — static images with CSS `scale + translate` animation simating slow-motion

## Decision

Use **image Ken Burns cross-fade** (5 frames, 5s each) instead of MP4 video.

## Rationale

1. **Performance** — 5 JPEG images (~50KB each with AVIF) vs 1 MP4 (~2–5MB). LCP budget is 2.5s on mobile 4G. An MP4 would blow the budget; images with `priority` on the first frame stay within budget.
2. **No video hosting** — MP4 files need to be hosted (R2, Vercel Blob, or CDN). Images use `next/image` with built-in optimization (AVIF/WebP, responsive sizes).
3. **Cinemagraph effect** — The Ken Burns effect (`scale 1.06 → 1.2 + translate -3%,-3%` over 9s) with cross-fade between frames creates a cinematic slow-motion feel without video.
4. **Mute toggle is UI-only** — The brief says "click to unmute" but there's no audio in v1. The mute toggle is a UI affordance that controls equalizer animation. Phase 8+ could wire actual video with audio.
5. **Reduced motion** — Images with CSS animation are trivially disabled via `prefers-reduced-motion` (global `@media` block). Video requires JS to pause.

## Implementation

- 5 frames from `picsum.photos` (dev placeholder — Phase 8 swaps to R2-hosted AI-generated)
- Each frame: `next/image` with `fill` + `sizes="100vw"` + B&W noir filter
- First frame: `priority` + `fetchpriority="high"` (LCP candidate)
- Cross-fade: `opacity 0 → 1` over 2s, hold 3s, switch every 5s (25s loop)
- Ken Burns: `@keyframes ken-burns { 0%: scale(1.06) translate(0,0); 100%: scale(1.2) translate(-3%,-3%) }` over 9s, active frame only

## Consequences

**Positive:**
- LCP within budget (~1.2–2.0s on mobile 4G)
- No video hosting infrastructure
- Trivial reduced-motion support (CSS-only)
- `next/image` optimization (AVIF, responsive sizes)
- Lower bandwidth (250KB total vs 2–5MB for MP4)

**Negative:**
- Not actual video — no real motion (just pan + zoom)
- Mute toggle is decorative (no audio in v1)
- 5 static frames may feel repetitive on long sessions

**Future upgrade path:**
- If real video is needed, replace `ReelFrame` image with `<video>` element
- Keep the `useHeroReel` hook (it manages frame cycling, not rendering)
- Add `muted` attribute + mute toggle wiring
- Host MP4 on R2 with signed URLs
