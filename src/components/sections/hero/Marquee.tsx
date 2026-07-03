import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  /** Items to scroll. Each item is separated by a divider dot. */
  items: ReadonlyArray<string>;
  /** Animation duration in seconds. Default 38. */
  durationSec?: number;
  className?: string;
  /** Optional divider node between items. Default: orange diamond. */
  divider?: ReactNode;
}

/**
 * Marquee — horizontal auto-scrolling ticker.
 *
 * Implementation:
 *  - Renders the items twice in a flex row (so the loop is seamless)
 *  - CSS `@keyframes marquee` translates the row -50% (one full set)
 *  - `width: max-content` so the row doesn't wrap
 *  - Paused via `prefers-reduced-motion` (globals.css disables animation)
 *
 * Usage:
 *   <Marquee items={['BUILT BY DISCIPLINE', 'FORGED IN IRON', ...]} />
 *
 * Reference: Skills KB §5 (motion — compositor only, transform-only).
 */
export function Marquee({
  items,
  durationSec = 38,
  className,
  divider,
}: MarqueeProps) {
  const dividerNode =
    divider ??
    (<span aria-hidden="true" className="mx-8 text-[var(--color-accent)]">◆</span>);

  // Render items twice for seamless loop
  const renderSet = (keyPrefix: string) =>
    items.map((item, i) => (
      <span key={`${keyPrefix}-${i}`} className="flex items-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-dim)]">
          {item}
        </span>
        {dividerNode}
      </span>
    ));

  return (
    <div className={cn('relative w-full overflow-hidden', className)} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${durationSec}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center">{renderSet('a')}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {renderSet('b')}
        </div>
      </div>
    </div>
  );
}
