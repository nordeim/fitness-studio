'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHeroReel } from '@/hooks/useHeroReel';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { ReelFrame } from './ReelFrame';
import { ReelControl } from './ReelControl';
import { ReelProgress } from './ReelProgress';
import { HeroHeadline } from './HeroHeadline';
import { CoachStrip } from './CoachStrip';
import { Marquee } from './Marquee';

// ── Reel content (dev placeholders — Phase 8 swaps to R2 AI-generated) ──
const REEL_FRAMES: ReadonlyArray<{ src: string; alt: string }> = [
  { src: 'https://picsum.photos/seed/forge-athlete-deadlift/1920/1080', alt: 'Athlete locking out a heavy deadlift, chalk dust suspended in low light' },
  { src: 'https://picsum.photos/seed/forge-boxer-heavy-bag/1920/1080', alt: 'Boxer striking a heavy bag, sweat flying, gym in shadow' },
  { src: 'https://picsum.photos/seed/forge-rack-squat/1920/1080', alt: 'Lifter descending into a deep back squat under a power rack' },
  { src: 'https://picsum.photos/seed/forge-kettlebell-swing/1920/1080', alt: 'Athlete mid-kettlebell swing, hips driving forward, breath visible' },
  { src: 'https://picsum.photos/seed/forge-rope-climb/1920/1080', alt: 'Athlete climbing a thick rope, hands chalked, gym fading to black' },
];

// ── Coach strip (dev placeholders) ──
const COACH_AVATARS: ReadonlyArray<{ src: string; alt: string }> = [
  { src: 'https://picsum.photos/seed/coach-marcus-steel/120/120', alt: 'Coach Marcus Steel' },
  { src: 'https://picsum.photos/seed/coach-elena-volk/120/120', alt: 'Coach Elena Volk' },
  { src: 'https://picsum.photos/seed/coach-tank-williams/120/120', alt: 'Coach Tank Williams' },
  { src: 'https://picsum.photos/seed/coach-alex-rivera/120/120', alt: 'Coach Alex Rivera' },
];

// ── Marquee aphorisms ──
const MARQUEE_ITEMS: ReadonlyArray<string> = [
  'BUILT BY DISCIPLINE',
  'FORGED IN IRON',
  'NO AVERAGE',
  'NO EXCUSES',
  'NO SHORTCUTS',
  'ONLY REPS',
  'ONLY SWEAT',
  'ONLY IRON',
];

/**
 * HeroReel — cinematic full-bleed hero.
 *
 * Composition (z-index bottom to top):
 *   1. Reel frames (5 images, cross-fading + Ken Burns on active)
 *   2. Hero overlay (gradient + accent glow)
 *   3. Scan-line overlay (1px repeating gradient)
 *   4. Reel progress bar (top, 1px) + chapter counter (top-right)
 *   5. Reel control (mute toggle, top-right)
 *   6. Hero content (SectionMarker + headline + copy + CTA + CoachStrip)
 *   7. Marquee ticker (bottom)
 *
 * Behaviors:
 *  - 5 frames × 5s = 25s loop
 *  - Cross-fade 2s, hold 3s
 *  - Ken Burns on active frame only
 *  - Mute toggle (UI affordance — no audio in v1)
 *  - Parallax: reel container translates 0.3× scroll while in viewport
 *  - All motion disabled on `prefers-reduced-motion`
 *
 * Reference: Skills KB §5 (motion principles).
 * Reference: Visual Strategy (muted slow-mo reel, click to unmute).
 */
export function HeroReel() {
  const reducedMotion = useReducedMotion();
  const reelContainerRef = useRef<HTMLDivElement>(null);

  const {
    currentFrame,
    progress,
    muted,
    isPlaying,
    toggleMute,
    containerRef,
  } = useHeroReel({
    frameCount: REEL_FRAMES.length,
    frameDurationMs: 5000,
    autoAdvance: true,
  });

  // Parallax — translate reel container 0.3× scroll while in viewport
  useEffect(() => {
    if (reducedMotion) return;
    const reelEl = reelContainerRef.current;
    if (!reelEl) return;

    let rafId = 0;
    let targetY = 0;
    let currentY = 0;

    const onScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        targetY = scrolled * 0.3;
      }
    };

    const animate = () => {
      currentY += (targetY - currentY) * 0.1;
      reelEl.style.transform = `translateY(${currentY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="IRONFORGE hero"
      className="relative flex min-h-dvh w-full flex-col justify-end overflow-hidden pb-24 pt-32"
    >
      {/* 1. Reel frames */}
      <div ref={reelContainerRef} className="absolute inset-0 will-change-transform">
        {REEL_FRAMES.map((frame, i) => (
          <ReelFrame
            key={i}
            src={frame.src}
            alt={frame.alt}
            active={i === currentFrame}
            priority={i === 0}
          />
        ))}
      </div>

      {/* 2. Hero overlay — gradient + accent glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.45) 28%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.98) 100%),
            linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.5) 100%),
            radial-gradient(ellipse at 25% 60%, rgba(255, 84, 0, 0.18) 0%, transparent 55%)
          `,
        }}
      />

      {/* 3. Scan-line overlay */}
      <div aria-hidden="true" className="scan-line pointer-events-none absolute inset-0 z-[2]" />

      {/* 4. Progress bar + chapter counter */}
      <ReelProgress
        current={currentFrame}
        total={REEL_FRAMES.length}
        progress={progress}
      />

      {/* 5. Reel control (top-right, below progress) */}
      <div className="absolute right-6 top-32 z-20 hidden items-center gap-6 lg:right-10 lg:flex">
        <div className="hidden items-center gap-3 font-mono text-[11px] text-[var(--color-fg-dim)] md:flex">
          <span className="h-2 w-2 animate-[var(--animate-rec-blink)] rounded-full bg-[var(--color-accent)]" />
          <span className="tracking-[0.2em]">REEL · {isPlaying ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <ReelControl muted={muted} onToggleMute={toggleMute} />
      </div>

      {/* 6. Hero content */}
      <Container className="relative z-10">
        <div className="max-w-5xl">
          <div className="mb-6">
            <SectionMarker>EST. 2012 · NYC</SectionMarker>
          </div>

          <HeroHeadline
            lines={[
              'BUILT BY',
              <span key="2" className="text-stroke">
                DISCIPLINE.
              </span>,
              <>
                FORGED IN <span className="text-[var(--color-accent)]">IRON.</span>
              </>,
            ]}
          />

          <p className="mt-8 max-w-xl font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
            A private strength &amp; conditioning studio for athletes who refuse
            average. Twenty-four elite coaches. Three training systems. One
            unrelenting standard —{' '}
            <span className="text-[var(--color-fg)]">your transformation</span>.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/#booking"
              className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              Book Trial Class →
            </Link>
            <Link
              href="/#programs"
              className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
            >
              View Programs
            </Link>
          </div>
        </div>

        {/* Bottom strip — coach preview + marquee */}
        <div className="mt-16 flex flex-col gap-6 border-t border-white/5 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <CoachStrip
            avatars={COACH_AVATARS}
            totalCount={24}
            label="Coaching Staff"
            sublabel="24 certified specialists"
          />
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] lg:block">
            SCROLL TO ENTER ↓
          </div>
        </div>
      </Container>

      {/* 7. Marquee ticker (bottom) */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/5 bg-black/40 py-3 backdrop-blur-sm">
        <Marquee items={MARQUEE_ITEMS} durationSec={38} />
      </div>
    </section>
  );
}
