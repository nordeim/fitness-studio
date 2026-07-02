'use client';
import { useEffect, useState } from 'react';

/**
 * useReducedMotion — respects `prefers-reduced-motion` media query.
 *
 * Returns `true` when the user has requested reduced motion.
 * All animations must be disabled (not just slowed) when this is true.
 *
 * Reference: Skills KB §6 (Accessibility) + §10 (Hooks).
 * Legal: WCAG AAA §2.3.3, ADA Title II (April 2026).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mediaQuery.matches);

    onChange(); // Initialize on mount
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
