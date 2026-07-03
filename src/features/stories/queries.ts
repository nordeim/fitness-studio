import { eq } from 'drizzle-orm';
import { STATIC_STORIES } from './data';
import type { Story } from './domain/schemas';

/**
 * IRONFORGE — Story queries (Layer 2).
 *
 * Pattern: DB-first with static fallback.
 */

export async function getStories(): Promise<Story[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { stories } = await import('@/lib/db/schema');

    const result = await db.select().from(stories);

    if (result.length > 0) {
      return result as unknown as Story[];
    }
    return STATIC_STORIES.map((s) => s as unknown as Story);
  } catch {
    return STATIC_STORIES.map((s) => s as unknown as Story);
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { stories } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(stories)
      .where(eq(stories.slug, slug))
      .limit(1);

    if (row) return row as unknown as Story;

    const staticMatch = STATIC_STORIES.find((s) => s.slug === slug);
    return staticMatch ? (staticMatch as unknown as Story) : null;
  } catch {
    const staticMatch = STATIC_STORIES.find((s) => s.slug === slug);
    return staticMatch ? (staticMatch as unknown as Story) : null;
  }
}
