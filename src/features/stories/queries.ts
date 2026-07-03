import { and, eq } from 'drizzle-orm';
import { STATIC_STORIES } from './data';
import type { Story } from './domain/schemas';

/**
 * IRONFORGE — Story queries (Layer 2).
 *
 * Pattern: DB-first with static fallback.
 * All public queries filter by `published: true` (Finding H2 fix).
 * No `as unknown as` casts (Finding H4 fix).
 */

export async function getStories(): Promise<Story[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { stories } = await import('@/lib/db/schema');

    const result = await db
      .select()
      .from(stories)
      .where(eq(stories.published, true));

    if (result.length > 0) {
      return result;
    }
    return STATIC_STORIES.filter((s) => s.published);
  } catch {
    return STATIC_STORIES.filter((s) => s.published);
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { stories } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(stories)
      .where(and(eq(stories.slug, slug), eq(stories.published, true)))
      .limit(1);

    if (row) return row;

    const staticMatch = STATIC_STORIES.find((s) => s.slug === slug && s.published);
    return staticMatch ?? null;
  } catch {
    const staticMatch = STATIC_STORIES.find((s) => s.slug === slug && s.published);
    return staticMatch ?? null;
  }
}
