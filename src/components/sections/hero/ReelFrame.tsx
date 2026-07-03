import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ReelFrameProps {
  /** Image URL (next/image src). */
  src: string;
  /** Alt text describing the athletic pose / scene. */
  alt: string;
  /** Whether this frame is currently active (visible + Ken Burns). */
  active: boolean;
  /** Whether this is the first frame (LCP candidate — gets `priority`). */
  priority?: boolean;
}

/**
 * ReelFrame — single frame in the hero reel.
 *
 * Visual treatment:
 *  - Full-bleed absolute positioned image
 *  - `grayscale(100%) contrast(1.55) brightness(0.42)` — B&W noir per Visual Strategy
 *  - Active frame: opacity 1 + Ken Burns `scale(1.06) → scale(1.2) translate(-3%, -3%)`
 *  - Inactive frame: opacity 0 (cross-fade via 2s transition)
 *  - First frame gets `priority` for LCP
 *
 * Performance:
 *  - `next/image` serves AVIF/WebP at appropriate sizes
 *  - `sizes="100vw"` — full viewport width
 *  - Only the first frame has `priority`; others load lazily but are requested
 *    soon after mount (they cycle in within 5s)
 *
 * Reference: Skills KB §5 (motion — Ken Burns is transform-only, GPU-friendly).
 * Reference: Skills KB §4 (next/image rules — priority on hero, sizes attribute).
 */
export function ReelFrame({ src, alt, active, priority = false }: ReelFrameProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-[2000ms] ease-[var(--ease-premium)]',
        active ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden={!active}
    >
      <Image
        src={src}
        alt={active ? alt : ''}
        fill
        priority={priority}
        sizes="100vw"
        className={cn(
          'object-cover',
          // B&W noir treatment per Visual Strategy
          '[filter:grayscale(100%)_contrast(1.55)_brightness(0.42)]',
          // Ken Burns only on active frame
          active && 'animate-[var(--animate-ken-burns)]',
        )}
      />
    </div>
  );
}
