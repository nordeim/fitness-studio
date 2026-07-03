import { and, eq } from 'drizzle-orm';
import { STATIC_COACHES } from './data';
import type { Coach } from './domain/schemas';

/**
 * IRONFORGE — Coach queries (Layer 2).
 *
 * Pattern: DB-first with static fallback.
 * All public queries filter by `published: true` (Finding H2 fix —
 * unpublished records must never be exposed via public API).
 *
 * Type safety: No `as unknown as` casts (Finding H4 fix — the Drizzle
 * `published` column is now `.notNull()`, so the inferred type matches
 * the Zod `Coach` type).
 */

export async function getCoaches(): Promise<Coach[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');

    const result = await db
      .select()
      .from(coaches)
      .where(eq(coaches.published, true))
      .orderBy(coaches.order);

    if (result.length > 0) {
      return result;
    }
    return STATIC_COACHES.filter((c) => c.published);
  } catch {
    return STATIC_COACHES.filter((c) => c.published);
  }
}

export async function getCoachBySlug(slug: string): Promise<Coach | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(coaches)
      .where(and(eq(coaches.slug, slug), eq(coaches.published, true)))
      .limit(1);

    if (row) return row;

    const staticMatch = STATIC_COACHES.find((c) => c.slug === slug && c.published);
    return staticMatch ?? null;
  } catch {
    const staticMatch = STATIC_COACHES.find((c) => c.slug === slug && c.published);
    return staticMatch ?? null;
  }
}
