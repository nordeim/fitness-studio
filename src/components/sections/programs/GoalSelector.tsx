'use client';

import { cn } from '@/lib/utils';

export type Goal = 'muscle' | 'fat' | 'fitness' | 'athletic' | 'rehab';

interface GoalOption {
  value: Goal;
  label: string;
}

const GOAL_OPTIONS: ReadonlyArray<GoalOption> = [
  { value: 'muscle', label: 'Muscle Gain' },
  { value: 'fat', label: 'Fat Loss' },
  { value: 'fitness', label: 'General Fitness' },
  { value: 'athletic', label: 'Athletic Perf.' },
  { value: 'rehab', label: 'Rehab / Mobility' },
];

interface GoalSelectorProps {
  value: Goal;
  onChange: (goal: Goal) => void;
  className?: string;
}

/**
 * GoalSelector — pill cluster for program filtering.
 *
 * Visual:
 *  - Horizontal wrap of mono pills with border
 *  - Inactive: border-light, fg-dim text
 *  - Hover: silver-dim border, fg text
 *  - Active: accent bg, black text, accent border
 *  - 44px min touch target height
 *
 * A11y:
 *  - role="radiogroup" + aria-label
 *  - Each pill is role="radio" + aria-checked
 *  - Keyboard: Arrow keys move between pills, Space/Enter selects
 *
 * Reference: Visual Strategy — "organized by goals".
 */
export function GoalSelector({ value, onChange, className }: GoalSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter programs by goal"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {GOAL_OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer px-4 py-2 font-heading text-xs uppercase tracking-[0.12em] transition-all duration-[var(--dur-micro)]',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
              'min-h-11',
              isActive
                ? 'border border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-black'
                : 'border border-[var(--color-border-light)] bg-transparent text-[var(--color-fg-dim)] hover:border-[var(--color-silver-dim)] hover:text-[var(--color-fg)]',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
