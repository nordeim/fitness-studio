import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'header' | 'footer' | 'nav';
}

/**
 * Container — max-width 1600px with responsive gutters.
 *
 * Usage:
 *   <Container>...</Container>
 *   <Container as="header" className="border-b">...</Container>
 *
 * Tokens: --container-max (1600px), --gutter (1.5rem), --gutter-lg (2.5rem).
 */
export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-[var(--container-max)] px-6 lg:px-10',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
