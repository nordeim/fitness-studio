import { eq } from 'drizzle-orm';
import { STATIC_COACHES } from './data';
import type { Coach } from './domain/schemas';

/**
 * IRONFORGE — Coach queries (Layer 2).
 *
 * Pattern: DB-first with static fallback (same as programs/queries.ts).
 */

export async function getCoaches(): Promise<Coach[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');

    const result = await db
      .select()
      .from(coaches)
      .orderBy(coaches.order);

    if (result.length > 0) {
      return result as unknown as Coach[];
    }
    return STATIC_COACHES.map((c) => c as unknown as Coach);
  } catch {
    return STATIC_COACHES.map((c) => c as unknown as Coach);
  }
}

export async function getCoachBySlug(slug: string): Promise<Coach | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(coaches)
      .where(eq(coaches.slug, slug))
      .limit(1);

    if (row) return row as unknown as Coach;

    const staticMatch = STATIC_COACHES.find((c) => c.slug === slug);
    return staticMatch ? (staticMatch as unknown as Coach) : null;
  } catch {
    const staticMatch = STATIC_COACHES.find((c) => c.slug === slug);
    return staticMatch ? (staticMatch as unknown as Coach) : null;
  }
}
