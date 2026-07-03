import { cn } from '@/lib/utils';

interface ReelProgressProps {
  /** Current frame index (0-based). */
  current: number;
  /** Total frame count. */
  total: number;
  /** Progress through current frame, 0–100. */
  progress: number;
  className?: string;
}

/**
 * ReelProgress — 1px progress bar + chapter counter (01 / 05).
 *
 * Visual:
 *  - 1px tall bar at top of hero, full width
 *  - Fills 0→100% over each frame's 5s lifetime, resets on frame change
 *  - Chapter counter "01 / 05" in JetBrains Mono at bottom-right
 *  - Active frame number uses accent color; total uses muted
 *
 * Reference: Skills KB §5 (motion — width animation is the only exception
 * to "transform-only" rule, because it's a 1px indicator and the repaint
 * cost is negligible. Alternatively could use scaleX transform.)
 */
export function ReelProgress({ current, total, progress, className }: ReelProgressProps) {
  return (
    <>
      {/* Top progress bar */}
      <div
        className={cn(
          'absolute inset-x-0 top-0 z-20 h-px bg-white/10',
          className,
        )}
        aria-hidden="true"
      >
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chapter counter (bottom-right of hero, above marquee) */}
      <div
        className="absolute right-6 top-32 z-20 hidden font-mono text-[11px] tracking-[0.2em] text-[var(--color-fg-dim)] lg:right-10 lg:block"
        aria-live="polite"
      >
        <span className="text-[var(--color-accent)]">
          {String(current + 1).padStart(2, '0')}
        </span>
        <span className="mx-2 text-[var(--color-muted)]">/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>
    </>
  );
}
