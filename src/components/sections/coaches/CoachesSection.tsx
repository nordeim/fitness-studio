import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { CoachFlipGrid } from './CoachFlipGrid';
import { getCoaches } from '@/features/coaches/queries';

/**
 * CoachesSection — async Server Component.
 *
 * Fetches coaches via the queries module (DB-first with static fallback).
 */
export async function CoachesSection() {
  const coaches = await getCoaches();

  const coachesForGrid = coaches.map((c) => ({
    name: c.name,
    title: c.title,
    imageSrc: c.portraitKey ?? 'https://picsum.photos/seed/coach-default/600/800',
    imageAlt: `Coach ${c.name}, ${c.title}`,
    bio: c.bio,
    certifications: c.certifications ?? [],
    signatureWorkout: c.signatureWorkout ?? '—',
    specialties: c.specialties ?? [],
    href: `/coaches/${c.slug}`,
  }));

  return (
    <Section id="coaches" className="border-t border-[var(--color-border)]">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <SectionMarker>SECTION 03 / COACHES</SectionMarker>
          <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
            TWENTY-FOUR SPECIALISTS
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
            Every coach holds a national certification, five years minimum
            experience, and a specialty. Hover any card to read their
            credentials and signature workout.
          </p>
        </div>
        <Link
          href="/#coaches"
          className="shrink-0 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
        >
          View all 24 →
        </Link>
      </div>

      <CoachFlipGrid coaches={coachesForGrid} />

      <div className="mt-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          + 16 MORE COACHES IN-DEPTH ON THE FULL ROSTER
        </p>
      </div>
    </Section>
  );
}
