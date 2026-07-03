'use client';

import { useState } from 'react';
import { GoalSelector, type Goal } from './GoalSelector';
import { ProgramCard, type ProgramGoal } from './ProgramCard';
import { ScrollReveal } from '@/components/ScrollReveal';

interface Program {
  number: string;
  title: string;
  goal: ProgramGoal;
  goalLabel: string;
  duration: string;
  intensity: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

interface ProgramGridProps {
  programs: ReadonlyArray<Program>;
}

/**
 * ProgramGrid — responsive 3-col grid with goal filter.
 *
 * Visual:
 *  - 1-col mobile / 2-col tablet / 3-col desktop
 *  - Staggered reveal on scroll (100ms delay per card)
 *  - GoalSelector above the grid
 *  - Empty state when no programs match the selected goal
 *
 * Reference: Visual Strategy — "organized by goals".
 */
export function ProgramGrid({ programs }: ProgramGridProps) {
  const [goal, setGoal] = useState<Goal>('muscle');

  const filtered = programs.filter((p) => p.goal === goal);

  return (
    <div>
      <GoalSelector value={goal} onChange={setGoal} className="mb-10" />

      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--color-border-light)] py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            No programs in this category yet
          </p>
          <p className="mt-2 font-body text-sm text-[var(--color-fg-dim)]">
            Check back soon — new curricula dropping each quarter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program, i) => (
            <ScrollReveal key={program.number} delay={i * 100}>
              <ProgramCard {...program} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
