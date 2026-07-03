'use client';

import { cn } from '@/lib/utils';

interface ReelControlProps {
  /** Whether the reel is currently muted. */
  muted: boolean;
  /** Toggle the mute state. */
  onToggleMute: () => void;
}

/**
 * ReelControl — mute toggle with 5-bar equalizer.
 *
 * Visual:
 *  - Border-1 button with backdrop-blur
 *  - 5 vertical bars (the equalizer)
 *  - When muted: bars are still (height 3px)
 *  - When unmuted: bars animate via `@keyframes wave` (0.7s ease-in-out infinite)
 *  - Each bar has a 100ms stagger delay
 *  - "MUTED" / "UNMUTED" label in JetBrains Mono
 *  - Volume icon (lucide VolumeX / Volume2)
 *
 * A11y:
 *  - `aria-pressed` reflects muted state
 *  - `aria-label` describes action
 *  - focus-visible ring uses accent
 *
 * Reference: Skills KB §5 (motion — wave keyframe, 100ms stagger).
 * Reference: Skills KB §6 (a11y — icon button label, focus-visible).
 */
export function ReelControl({ muted, onToggleMute }: ReelControlProps) {
  return (
    <button
      type="button"
      onClick={onToggleMute}
      aria-pressed={!muted}
      aria-label={muted ? 'Unmute hero reel' : 'Mute hero reel'}
      className={cn(
        'group flex items-center gap-3 border border-white/20 bg-black/40 px-4 py-2.5 backdrop-blur-sm transition-colors',
        'hover:border-[var(--color-accent)]',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
      )}
    >
      {/* Equalizer bars */}
      <div className="flex h-4 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              'inline-block w-[2px] bg-[var(--color-accent)]',
              muted ? 'h-[3px]' : 'animate-[var(--animate-wave)]',
            )}
            style={{
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">
        {muted ? 'Muted' : 'Unmuted'}
      </span>

      {/* Icon */}
      {muted ? (
        <svg
          className="h-3 w-3 text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        <svg
          className="h-3 w-3 text-[var(--color-accent)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
