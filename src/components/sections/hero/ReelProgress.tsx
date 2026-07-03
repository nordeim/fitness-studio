import { cn } from '@/lib/utils';

interface ReelProgressProps {
  /** Current frame index (0-based). Used as `key` to restart the CSS animation. */
  current: number;
  /** Total frame count. */
  total: number;
  /** Frame duration in milliseconds (drives the CSS animation duration). */
  frameDurationMs?: number;
  className?: string;
}

/**
 * ReelProgress — 1px progress bar + chapter counter (01 / 05).
 *
 * Visual:
 *  - 1px tall bar at top of hero, full width
 *  - Fills 0→100% over each frame's lifetime via CSS animation, resets on frame change
 *  - Chapter counter "01 / 05" in JetBrains Mono at bottom-right
 *  - Active frame number uses accent color; total uses muted
 *
 * M8 fix: The progress bar is now driven by a CSS `@keyframes progress-fill`
 * animation instead of React state updated every 100ms. The `key={current}`
 * prop on the fill div causes React to remount it on each frame change,
 * restarting the animation. This eliminates 10 re-renders per second.
 *
 * Reference: Skills KB §5 (motion — width animation for 1px indicator).
 */
export function ReelProgress({
  current,
  total,
  frameDurationMs = 5000,
  className,
}: ReelProgressProps) {
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
        {/* key={current} restarts the CSS animation on each frame change */}
        <div
          key={current}
          className="h-full bg-[var(--color-accent)]"
          style={{
            animation: `progress-fill ${frameDurationMs}ms linear forwards`,
          }}
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
