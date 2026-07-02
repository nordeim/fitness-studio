'use client';
import { useEffect, useState } from 'react';

/**
 * useScrolled — boolean state for "user has scrolled past threshold".
 *
 * Used to toggle header background, sticky CTA visibility, etc.
 *
 * Usage:
 *   const scrolled = useScrolled(10);
 *   <header className={scrolled ? 'bg-black/80' : 'bg-transparent'} />
 *
 * Reference: Skills KB §10 (Hooks).
 */
export function useScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll(); // Initialize on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
