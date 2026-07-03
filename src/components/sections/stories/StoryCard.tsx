import Image from 'next/image';
import { cn } from '@/lib/utils';

interface StoryCardProps {
  memberName: string;
  memberAge: number;
  programSlug: string;
  programLabel: string;
  weeks: number;
  beforeSrc: string;
  afterSrc: string;
  quote: string;
  /** Lift PR achieved during the program. e.g. "405 lb deadlift" */
  highlight: string;
  href: string;
  className?: string;
}

/**
 * StoryCard — member transformation tile for the Stories carousel.
 *
 * Visual:
 *  - 400px wide fixed (carousel child)
 *  - Before/after image overlay (after on top, before revealed on hover)
 *  - Both images B&W noir
 *  - Quote in condensed body text
 *  - Program tag + weeks completed + age (mono telemetry)
 *  - Highlight lift PR in accent
 *
 * Reference: Visual Strategy — real transformation case studies.
 */
export function StoryCard({
  memberName,
  memberAge,
  programLabel,
  weeks,
  beforeSrc,
  afterSrc,
  quote,
  highlight,
  href,
  className,
}: StoryCardProps) {
  return (
    <article
      className={cn(
        'flex w-[400px] shrink-0 flex-col border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-colors duration-[var(--dur-micro)] hover:border-[var(--color-accent)]',
        className,
      )}
    >
      {/* Before/After image stack */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Before — revealed on hover */}
        <Image
          src={beforeSrc}
          alt={`${memberName} before — week 0`}
          fill
          sizes="400px"
          loading="lazy"
          className="img-noir object-cover opacity-0 transition-opacity duration-[600ms] ease-[var(--ease-premium)] group-hover:opacity-100"
        />
        {/* After — default */}
        <Image
          src={afterSrc}
          alt={`${memberName} after ${weeks} weeks`}
          fill
          sizes="400px"
          loading="lazy"
          className="img-noir object-cover transition-opacity duration-[600ms] ease-[var(--ease-premium)] group-hover:opacity-0"
        />
        {/* Top-left: program tag */}
        <div className="absolute left-4 top-4 border border-[var(--color-accent)] bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-accent)] backdrop-blur-sm">
          {programLabel}
        </div>
        {/* Top-right: weeks */}
        <div className="absolute right-4 top-4 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)] backdrop-blur-sm">
          {weeks}W
        </div>
        {/* Bottom-right: BEFORE / AFTER label */}
        <div className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">
          <span className="opacity-30 group-hover:opacity-100">Before</span>
          <span className="mx-1">/</span>
          <span className="opacity-100 group-hover:opacity-30">After</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-xl tracking-wide text-[var(--color-fg)]">
            {memberName}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
            AGE {memberAge}
          </div>
        </div>

        <blockquote className="flex-1 border-l-2 border-[var(--color-accent)] pl-4 font-body text-sm italic leading-relaxed text-[var(--color-fg-dim)]">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Highlight
            </div>
            <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-accent)]">
              {highlight}
            </div>
          </div>
          <a
            href={href}
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            Read story →
          </a>
        </div>
      </div>
    </article>
  );
}
