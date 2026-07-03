import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ProgramGoal = 'muscle' | 'fat' | 'fitness' | 'athletic' | 'rehab';

interface ProgramCardProps {
  /** Display number — large stroke-text on hover. e.g. "01" */
  number: string;
  title: string;
  goal: ProgramGoal;
  goalLabel: string;
  duration: string;
  intensity: string;
  /** Image URL (next/image src). */
  imageSrc: string;
  imageAlt: string;
  href: string;
  className?: string;
}

/**
 * ProgramCard — program tile with hover reveal.
 *
 * Visual:
 *  - Image fills card (aspect-video), B&W noir filter
 *  - On hover: image scales 1.08 + filter lightens slightly
 *  - Large program number (stroke text) top-right; fills with accent on hover
 *  - Title in Oswald heading
 *  - Bottom: goal pill + duration + intensity (mono telemetry)
 *  - Card lifts -8px on hover
 *  - 500ms ease-premium transition
 *
 * Reference: Visual Strategy — program cards.
 * Reference: Skills KB §5 (motion — transform only, 500ms ease-premium).
 */
export function ProgramCard({
  number,
  title,
  goalLabel,
  duration,
  intensity,
  imageSrc,
  imageAlt,
  href,
  className,
}: ProgramCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'program-card group relative block overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-transform duration-[500ms] ease-[var(--ease-premium)] hover:-translate-y-2',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          loading="lazy"
          className="program-img object-cover transition-all duration-[800ms] ease-[var(--ease-premium)] [filter:grayscale(100%)_contrast(1.4)_brightness(0.7)] group-hover:scale-108 group-hover:[filter:grayscale(80%)_contrast(1.4)_brightness(0.85)]"
        />
        {/* Gradient overlay for legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent"
        />

        {/* Program number — large stroke text top-right */}
        <div
          aria-hidden="true"
          className="program-number absolute right-4 top-3 font-display text-6xl leading-none text-stroke transition-all duration-[500ms] ease-[var(--ease-premium)] group-hover:text-stroke-accent"
        >
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          <span className="h-1 w-1 bg-[var(--color-accent)]" aria-hidden="true" />
          {goalLabel}
        </div>
        <h3 className="font-heading text-xl tracking-wide text-[var(--color-fg)]">
          {title}
        </h3>
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
          <span>{duration}</span>
          <span className="text-[var(--color-fg-dim)]">{intensity}</span>
        </div>
      </div>
    </Link>
  );
}
