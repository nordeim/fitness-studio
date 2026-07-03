'use client';

import { useStoriesCarousel } from '@/hooks/useStoriesCarousel';
import { StoryCard } from './StoryCard';
import { cn } from '@/lib/utils';

interface Story {
  memberName: string;
  memberAge: number;
  programSlug: string;
  programLabel: string;
  weeks: number;
  beforeSrc: string;
  afterSrc: string;
  quote: string;
  highlight: string;
  href: string;
}

interface StoriesCarouselProps {
  stories: ReadonlyArray<Story>;
}

/**
 * StoriesCarousel — drag-to-swipe with rubber-band physics.
 *
 * Features:
 *  - Mouse drag + touch swipe (Pointer Events unified API)
 *  - Rubber-band at edges (0.35× resistance past bounds)
 *  - Momentum on release (velocity × 300ms, then snap)
 *  - Snap to nearest card (700ms ease-snap)
 *  - Auto-advance every 4.5s (pauses on hover, drag, focus-in, reduced-motion)
 *  - Prev/Next buttons + dot indicators
 *  - Keyboard: Arrow Left/Right when viewport is focused
 *  - touch-action: pan-y on track (vertical scroll passes through)
 *
 * Reference: Visual Strategy — drag-to-swipe with rubber-band easing.
 * Reference: Skills KB §5 (motion — snap 700ms ease-snap).
 */
export function StoriesCarousel({ stories }: StoriesCarouselProps) {
  const {
    currentIndex,
    isDragging,
    trackRef,
    viewportRef,
    goTo,
    next,
    prev,
  } = useStoriesCarousel({
    cardCount: stories.length,
    autoAdvanceMs: 4500,
    pauseOnHover: true,
  });

  return (
    <div className="relative">
      {/* Viewport */}
      <div
        ref={viewportRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Member transformation stories"
        className="relative overflow-hidden py-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      >
        {/* Track */}
        <ul
          ref={trackRef}
          className={cn(
            'flex list-none gap-6 px-8 [touch-action:pan-y]',
            isDragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          style={{
            transform: 'translateX(0px)',
            willChange: 'transform',
          }}
        >
          {stories.map((story, i) => (
            <li
              key={story.memberName}
              className="group"
              aria-hidden={i !== currentIndex}
              aria-label={`${i + 1} of ${stories.length}`}
              role="group"
            >
              <StoryCard {...story} />
            </li>
          ))}
        </ul>
      </div>

      {/* Controls — Prev / Dots / Next */}
      <div className="mt-8 flex items-center justify-center gap-6">
        {/* Prev */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous story"
          disabled={currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center border border-[var(--color-border-light)] text-[var(--color-fg-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-30 disabled:hover:border-[var(--color-border-light)] disabled:hover:text-[var(--color-fg-dim)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Dots */}
        <div id="storyDots" className="flex items-center gap-2" role="tablist" aria-label="Story pagination">
          {stories.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to story ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-0.5 transition-all duration-[400ms] ease-[var(--ease-premium)]',
                i === currentIndex
                  ? 'w-8 bg-[var(--color-accent)]'
                  : 'w-2 bg-[var(--color-border-light)] hover:bg-[var(--color-silver-dim)]',
              )}
            />
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={next}
          aria-label="Next story"
          disabled={currentIndex === stories.length - 1}
          className="flex h-10 w-10 items-center justify-center border border-[var(--color-border-light)] text-[var(--color-fg-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-30 disabled:hover:border-[var(--color-border-light)] disabled:hover:text-[var(--color-fg-dim)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        <span className="text-[var(--color-accent)]">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
        <span className="mx-2">/</span>
        <span>{String(stories.length).padStart(2, '0')}</span>
        <span className="ml-4 hidden md:inline">· DRAG OR USE ARROWS</span>
      </div>
    </div>
  );
}
