'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * StickyCTABar — fixed bottom CTA that appears after hero leaves viewport.
 *
 * Behaviors:
 *  - Hidden by default (translateY(110%))
 *  - Slides up (translateY(0)) when hero is no longer intersecting
 *  - Slides away when booking section is in view (avoid overlap)
 *  - 600ms ease-premium transition
 *  - Disabled entirely when `prefers-reduced-motion: reduce` (visible immediately
 *    if applicable — but for sticky bar, we just don't show it)
 *
 * Reference: Skills KB §5 (motion — sticky snap 600ms ease-premium).
 */
export function StickyCTABar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const hero = document.getElementById('hero');
    const booking = document.getElementById('booking');
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const heroEntry = entries.find((e) => e.target === hero);
        const bookingEntry = entries.find((e) => e.target === booking);
        if (heroEntry && !heroEntry.isIntersecting) {
          // Hero out of view — show unless booking is in view
          const bookingInView = bookingEntry?.isIntersecting ?? false;
          setVisible(!bookingInView);
        } else if (bookingEntry) {
          // Booking visibility changed
          if (bookingEntry.isIntersecting) setVisible(false);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -50% 0px' },
    );

    observer.observe(hero);
    if (booking) observer.observe(booking);

    return () => observer.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-[var(--color-border)] bg-[var(--color-bg-darker)]/95 backdrop-blur-md transition-transform duration-[var(--dur-sticky)] ease-[var(--ease-premium)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 animate-[var(--animate-rec-blink)] bg-[var(--color-accent)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">
              TRIAL SLOTS OPEN
            </span>
          </div>
          <div>
            <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-fg)]">
              Claim Your First Session
            </div>
            <div className="font-mono text-[10px] text-[var(--color-muted)]">
              No commitment · 60 min · NYC
            </div>
          </div>
        </div>
        <Link
          href="/#booking"
          className="bg-[var(--color-accent)] px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-darker)]"
        >
          Book Trial →
        </Link>
      </div>
    </div>
  );
}
