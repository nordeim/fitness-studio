import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CoachAvatar {
  src: string;
  alt: string;
}

interface CoachStripProps {
  avatars: ReadonlyArray<CoachAvatar>;
  /** Total coach count (displayed as "+N" badge if > avatars.length). */
  totalCount: number;
  label: string;
  sublabel: string;
  className?: string;
}

/**
 * CoachStrip — overlapping avatar stack + "+N" badge + label.
 *
 * Visual:
 *  - Horizontal stack of round avatars (48px) with -12px negative margin
 *  - Each avatar has 2px border in bg color (creates separation)
 *  - B&W noir filter (img-noir utility)
 *  - Final slot is an accent-colored circle with "+N" in Bebas Neue
 *  - Right side: mono label + heading sublabel
 *
 * Performance:
 *  - All avatars are 48x48 (tiny) — `next/image` with `sizes="48px"`
 *  - All `loading="lazy"` (below the fold of the hero, no priority)
 *
 * Reference: Visual Strategy — "people as the main subject".
 */
export function CoachStrip({
  avatars,
  totalCount,
  label,
  sublabel,
  className,
}: CoachStripProps) {
  const overflow = Math.max(0, totalCount - avatars.length);

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="flex -space-x-3">
        {avatars.map((avatar, i) => (
          <div
            key={i}
            className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[var(--color-bg)]"
          >
            <Image
              src={avatar.src}
              alt={avatar.alt}
              fill
              sizes="48px"
              loading="lazy"
              className="img-noir object-cover"
            />
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-accent)] font-display text-base text-black">
            +{overflow}
          </div>
        )}
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {label}
        </div>
        <div className="font-heading text-sm tracking-wider text-[var(--color-fg)]">
          {sublabel}
        </div>
      </div>
    </div>
  );
}
