'use client';
import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  threshold?: number; // Intersection ratio (0-1). Default 0.15.
  rootMargin?: string; // Default '0px 0px -50px 0px' (triggers 50px before entering).
  once?: boolean; // If true (default), disconnect after first intersection.
}

interface UseRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  revealed: boolean;
}

/**
 * useReveal — IntersectionObserver-based scroll reveal.
 *
 * Adds `data-revealed="true"` to the observed element when it enters viewport.
 * The CSS in `globals.css` (`[data-reveal]` + `[data-revealed='true']`)
 * handles the actual opacity + transform transition.
 *
 * Usage:
 *   const { ref, revealed } = useReveal<HTMLDivElement>();
 *   return <div ref={ref} data-reveal data-revealed={revealed}>...</div>;
 *
 * Or use the `<ScrollReveal>` component wrapper.
 *
 * Reference: Skills KB §10 (Hooks).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
): UseRevealReturn<T> {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, revealed };
}
