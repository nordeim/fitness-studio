import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionMarkerProps {
  children: ReactNode;
  className?: string;
}

/**
 * SectionMarker — orange line + mono uppercase label.
 *
 * The structural voice of every IRONFORGE section. A 32px horizontal
 * accent line paired with a JetBrains Mono label (0.75rem, 0.2em tracking).
 *
 * Usage:
 *   <SectionMarker>EST. 2012 · NYC</SectionMarker>
 *   <SectionMarker>SECTION 02 / PROGRAMS</SectionMarker>
 *
 * Visual: ─── EST. 2012 · NYC
 */
export function SectionMarker({ children, className }: SectionMarkerProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--color-accent)]',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-[var(--color-accent)]" />
      {children}
    </span>
  );
}
