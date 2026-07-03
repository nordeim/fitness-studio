import { Section } from '@/components/layout/Section';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { ProgramGrid } from './ProgramGrid';
import { getPrograms } from '@/features/programs/queries';
import type { ProgramGoal } from './ProgramCard';

/**
 * ProgramsSection — async Server Component.
 *
 * Fetches programs via the queries module (DB-first with static fallback).
 * Passes data as props to <ProgramGrid> (Client Component) for filtering.
 */
export async function ProgramsSection() {
  const programs = await getPrograms();

  // Map to the shape ProgramGrid expects
  const programsForGrid = programs.map((p) => ({
    number: String(p.order + 1).padStart(2, '0'),
    title: p.title,
    goal: p.goal as ProgramGoal,
    goalLabel: GOAL_LABELS[p.goal as ProgramGoal] ?? p.goal,
    duration: p.duration ?? '—',
    intensity: p.intensity ?? '—',
    imageSrc: p.heroKey ?? 'https://picsum.photos/seed/forge-prog-default/800/600',
    imageAlt: `${p.title} — athletic training scene`,
    href: `/programs/${p.slug}`,
  }));

  return (
    <Section id="programs" className="border-t border-[var(--color-border)]">
      <div className="mb-12 max-w-3xl">
        <SectionMarker>SECTION 02 / PROGRAMS</SectionMarker>
        <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          CHOOSE YOUR DISCIPLINE
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          Three training systems. Nine signature programs. Every cycle coached
          1:1 or in small cohorts of four. Filter by goal — we&apos;ll match you
          with the right method, the right coach, and the right cohort within
          48 hours.
        </p>
      </div>

      <ProgramGrid programs={programsForGrid} />
    </Section>
  );
}

const GOAL_LABELS: Record<string, string> = {
  muscle: 'Muscle Gain',
  fat: 'Fat Loss',
  fitness: 'General Fitness',
  athletic: 'Athletic Performance',
  rehab: 'Rehab / Mobility',
};
