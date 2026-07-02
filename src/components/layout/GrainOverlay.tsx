'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * GrainOverlay — fixed full-viewport SVG fractal-noise grain.
 *
 * Behaviors:
 *  - `position: fixed; inset: -10%` (oversize so transform doesn't reveal edges)
 *  - `opacity: 0.08; mix-blend-mode: overlay; pointer-events: none`
 *  - Translates vertically at 0.15× scroll, smoothed by lerp 0.08 per frame
 *  - Paused when off-screen (it's fixed, so always "on-screen" — but rAF still
 *    stops when document is hidden)
 *  - Disabled entirely when `prefers-reduced-motion: reduce`
 *
 * Reference: Skills KB §5 (motion — compositor only, transform-only).
 */
export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let targetY = 0;
    let currentY = 0;
    let rafId = 0;
    let isHidden = false;

    const onScroll = () => {
      targetY = window.scrollY * 0.15;
    };

    const onVisibility = () => {
      isHidden = document.hidden;
    };

    const animate = () => {
      if (!isHidden) {
        currentY += (targetY - currentY) * 0.08;
        el.style.transform = `translateY(${currentY}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-[-10%] z-[var(--z-overlay)] opacity-08 mix-blend-overlay will-change-transform"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}
