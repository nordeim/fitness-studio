import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
  /** Vertical padding — default 'default' (8rem desktop / 5rem mobile). */
  spacing?: 'none' | 'tight' | 'default' | 'loose';
}

const SPACING: Record<NonNullable<SectionProps['spacing']>, string> = {
  none: '',
  tight: 'py-12 md:py-16',
  default: 'py-20 md:py-32',
  loose: 'py-24 md:py-40',
};

/**
 * Section — vertical rhythm + centering wrapper.
 *
 * Wraps content in `<section>` (default) with consistent vertical padding
 * and a `Container` inside. Use `spacing` to override default rhythm.
 *
 * Usage:
 *   <Section id="programs">...</Section>
 *   <Section spacing="tight">...</Section>
 */
export function Section({
  children,
  className,
  as: Tag = 'section',
  id,
  spacing = 'default',
}: SectionProps) {
  return (
    <Tag id={id} className={cn(SPACING[spacing], className)}>
      <div className="mx-auto w-full max-w-[var(--container-max)] px-6 lg:px-10">
        {children}
      </div>
    </Tag>
  );
}
