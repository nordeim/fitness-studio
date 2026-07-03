import { Section } from '@/components/layout/Section';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { StoriesCarousel } from './StoriesCarousel';
import { getStories } from '@/features/stories/queries';
import { STATIC_PROGRAMS } from '@/features/programs/data';

/**
 * StoriesSection — async Server Component.
 *
 * Fetches stories via the queries module (DB-first with static fallback).
 * Also loads programs to map programSlug → label for display.
 */
export async function StoriesSection() {
  const [stories, programs] = await Promise.all([
    getStories(),
    Promise.resolve(STATIC_PROGRAMS),
  ]);

  // Build program slug → title map
  const programMap = new Map(programs.map((p) => [p.slug, p.title]));

  const storiesForCarousel = stories.map((s) => ({
    memberName: s.memberName,
    memberAge: s.memberAge ?? 0,
    programSlug: s.programSlug ?? '',
    programLabel: s.programSlug ? (programMap.get(s.programSlug) ?? s.programSlug) : '',
    weeks: s.weeks ?? 0,
    beforeSrc: s.beforeKey ?? 'https://picsum.photos/seed/story-default-before/600/450',
    afterSrc: s.afterKey ?? 'https://picsum.photos/seed/story-default-after/600/450',
    quote: s.quote,
    highlight: STORY_HIGHLIGHTS[s.slug] ?? 'Transformation achieved',
    href: `/stories/${s.slug}`,
  }));

  return (
    <Section id="stories" className="border-t border-[var(--color-border)]">
      <div className="mb-12 max-w-3xl">
        <SectionMarker>SECTION 04 / STORIES</SectionMarker>
        <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          REAL TRANSFORMATIONS
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          No paid actors. No before/after photo tricks. Every member below
          trained at IRONFORGE with a named coach for a measured program.
          Drag to swipe — the carousel snaps and rubber-bands at the edges.
        </p>
      </div>

      <StoriesCarousel stories={storiesForCarousel} />
    </Section>
  );
}

// Highlight PRs for each story (would live in DB in production)
const STORY_HIGHLIGHTS: Record<string, string> = {
  'david-k': '500 lb deadlift PR',
  'sarah-m': '−28 lb in 12 weeks',
  'james-r': 'Pain-free 405 deadlift',
  'aisha-t': 'Snatch 70kg at 27',
  'marcus-l': '+9 lb lean mass',
  'elena-v': '4.51s 40-yard dash',
};
