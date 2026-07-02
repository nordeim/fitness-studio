'use client';
import { type ElementType, type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // ms — passed as `--reveal-delay` CSS variable
  className?: string;
  as?: ElementType; // default 'div'
  threshold?: number;
  once?: boolean;
}

/**
 * ScrollReveal — wrapper component for scroll-triggered fade + translate.
 *
 * Renders the children inside an element that fades in + translates up
 * when it enters the viewport. Respects `prefers-reduced-motion` (CSS
 * in globals.css disables the transition entirely).
 *
 * Usage:
 *   <ScrollReveal>...</ScrollReveal>
 *   <ScrollReveal as="section" delay={200}>...</ScrollReveal>
 *
 * Reference: Skills KB §10 (Hooks + ScrollReveal component).
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  as = 'div',
  threshold = 0.15,
  once = true,
}: ScrollRevealProps) {
  const { ref, revealed } = useReveal<HTMLElement>({ threshold, once });
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed={revealed ? 'true' : 'false'}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
