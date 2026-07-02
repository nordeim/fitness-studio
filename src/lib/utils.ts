import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn() — Tailwind v4 class merge helper.
 * Combines clsx (conditional class names) + tailwind-merge (deduplicates
 * conflicting Tailwind classes — e.g., `p-4 p-6` → `p-6`).
 *
 * Usage:
 *   <div className={cn('base', isActive && 'active', className)} />
 *
 * Reference: Skills KB §11 (ui-styling).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
