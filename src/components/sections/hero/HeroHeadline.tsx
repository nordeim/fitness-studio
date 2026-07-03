import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroHeadlineProps {
  /** Lines to render. Each line is wrapped in an overflow:hidden mask and
   *  slides up from below with a 100ms stagger. */
  lines: ReadonlyArray<ReactNode>;
  className?: string;
}

/**
 * HeroHeadline — 3-line Bebas Neue display lock-up with line-mask reveal.
 *
 * Visual:
 *  - Each line is wrapped in `.headline-line` (overflow: hidden, display: block)
 *  - Inner `<span>` translates from `translateY(110%)` to `translateY(0)`
 *  - 1s ease-premium transition, 100ms stagger per line
 *  - Triggered on mount via `.in-view` class (added immediately since hero is
 *    above the fold; could be deferred to IntersectionObserver if needed)
 *
 * Usage:
 *   <HeroHeadline lines={[
 *     'BUILT BY',
 *     <span key="2" className="text-stroke">DISCIPLINE.</span>,
 *     <>FORGED IN <span className="text-[var(--color-accent)]">IRON.</span></>,
 *   ]} />
 *
 * Reference: Skills KB §5 (motion — line-mask reveal, 100ms stagger).
 */
export function HeroHeadline({ lines, className }: HeroHeadlineProps) {
  return (
    <h1
      className={cn(
        'in-view font-display text-[14vw] leading-[0.85] text-[var(--color-fg)] md:text-[10vw] lg:text-[8.5vw]',
        className,
      )}
    >
      {lines.map((line, i) => (
        <span key={i} className="headline-line block overflow-hidden">
          <span
            className="inline-block translate-y-[110%] transition-transform duration-[1000ms] ease-[var(--ease-premium)] [transition-delay:var(--delay,0ms)] in-view:translate-y-0"
            style={{ ['--delay' as string]: `${i * 100}ms` }}
          >
            {line}
          </span>
        </span>
      ))}

      {/* Inline CSS for the line-mask reveal — scoped to this component */}
      <style>{`
        .headline-line { overflow: hidden; display: block; }
        .headline-line span {
          display: inline-block;
          transform: translateY(110%);
          transition: transform 1000ms var(--ease-premium, cubic-bezier(0.22, 1, 0.36, 1));
          transition-delay: var(--delay, 0ms);
        }
        .in-view .headline-line span { transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          .headline-line span { transform: none !important; transition: none !important; }
        }
      `}</style>
    </h1>
  );
}
