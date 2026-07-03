import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BookingCTAProps {
  className?: string;
}

/**
 * BookingCTA — corner-bracket framed CTA with pulsing primary button.
 *
 * Visual:
 *  - Booking frame: 60px corner brackets (top-left + bottom-right) in accent
 *  - Headline: "CLAIM YOUR FIRST SESSION" (Bebas Neue)
 *  - Subhead: body copy
 *  - Primary CTA: pulsing accent button (CSS @keyframes pulse-cta 2.4s)
 *  - Secondary: "View schedule" link
 *  - Below: mono telemetry (60 min · No commitment · NYC)
 *
 * Reference: Visual Strategy — Book a Trial Class clear CTA button.
 * Reference: Skills KB §5 (motion — pulse-cta keyframe).
 */
export function BookingCTA({ className }: BookingCTAProps) {
  return (
    <div
      className={cn(
        'booking-frame relative border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 md:p-16',
        // Corner brackets via ::before + ::after (defined in notch-corner utility)
        'before:absolute before:left-0 before:top-0 before:h-[60px] before:w-[60px] before:border-l-2 before:border-t-2 before:border-[var(--color-accent)] before:content-[""]',
        'after:absolute after:bottom-0 after:right-0 after:h-[60px] after:w-[60px] after:border-b-2 after:border-r-2 after:border-[var(--color-accent)] after:content-[""]',
        className,
      )}
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          <span className="h-2 w-2 animate-[var(--animate-rec-blink)] bg-[var(--color-accent)]" />
          TRIAL SLOTS OPEN · Q3 2026
        </div>

        <h2 className="font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          CLAIM YOUR FIRST SESSION
        </h2>

        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          Sixty minutes with a head coach. Movement screen, goal mapping, and
          one signature workout. No commitment beyond showing up.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#booking-form"
            className="pulse-btn animate-[var(--animate-pulse-cta)] bg-[var(--color-accent)] px-8 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]"
          >
            Book Trial Class →
          </Link>
          <Link
            href="/#schedule"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
          >
            View Schedule
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <span>60 MIN</span>
          <span aria-hidden="true" className="text-[var(--color-border-light)]">|</span>
          <span>NO COMMITMENT</span>
          <span aria-hidden="true" className="text-[var(--color-border-light)]">|</span>
          <span>47 EASTBOUND ALLEY · NYC</span>
        </div>
      </div>
    </div>
  );
}
