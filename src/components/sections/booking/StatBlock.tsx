'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface Stat {
  /** The target number to count up to. */
  value: number;
  /** Display suffix (e.g. "+", "K", "%"). */
  suffix?: string;
  /** Display prefix (e.g. "$"). */
  prefix?: string;
  label: string;
  /** Smaller text below the label. */
  sublabel?: string;
}

interface StatBlockProps {
  stats: ReadonlyArray<Stat>;
  className?: string;
}

/**
 * StatBlock — animated number counters that count up on reveal.
 *
 * Visual:
 *  - Grid of 4 stats (responsive 2-col mobile / 4-col desktop)
 *  - Each stat: large Bebas Neue number + label + sublabel
 *  - Numbers count up from 0 to target over 2s when the block enters viewport
 *  - Uses requestAnimationFrame with ease-out cubic
 *  - Reduced motion: shows final value immediately
 *
 * Reference: Visual Strategy — stat block.
 * Reference: Skills KB §5 (motion — rAF, ease-out, pause off-screen).
 */
export function StatBlock({ stats, className }: StatBlockProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>({ threshold: 0.25 });
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8',
        className,
      )}
    >
      {stats.map((stat, i) => (
        <Stat
          key={stat.label}
          stat={stat}
          // Animate only when revealed AND motion is allowed.
          // When not animating, the component renders the final value directly.
          animate={revealed && !reducedMotion}
          delay={i * 100}
        />
      ))}
    </div>
  );
}

interface StatProps {
  stat: Stat;
  animate: boolean;
  delay: number;
}

function Stat({ stat, animate, delay }: StatProps) {
  // Derive initial value: 0 when animating, final value when not.
  const [displayValue, setDisplayValue] = useState(() => (animate ? 0 : stat.value));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!animate) return;

    const duration = 2000;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now + delay;
      const elapsed = now - startTime;

      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (elapsed >= duration) {
        setDisplayValue(stat.value);
        return;
      }

      // ease-out cubic: 1 - (1 - t)^3
      const t = elapsed / duration;
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(stat.value * eased));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, stat.value, delay]);

  return (
    <div className="border-l border-[var(--color-border)] pl-4">
      <div className="font-display text-5xl leading-none text-[var(--color-fg)] md:text-6xl">
        {stat.prefix}
        {displayValue.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="mt-3 font-heading text-sm uppercase tracking-wider text-[var(--color-accent)]">
        {stat.label}
      </div>
      {stat.sublabel && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
          {stat.sublabel}
        </div>
      )}
    </div>
  );
}
