import { and, eq } from 'drizzle-orm';
import { STATIC_PROGRAMS } from './data';
import { ProgramArraySchema, type Program } from './domain/schemas';

/**
 * IRONFORGE — Program queries (Layer 2).
 *
 * Pattern: DB-first with static fallback.
 *  - Tries to query Postgres via Drizzle.
 *  - If DB is unavailable (env missing, connection refused, etc.), falls
 *    back to STATIC_PROGRAMS.
 *  - DB results are Zod-validated before returning (defense-in-depth —
 *    the Drizzle `goal` column is `varchar`, but the domain type is an
 *    enum; runtime validation catches any invalid DB values).
 *
 * All public queries filter by `published: true` (Finding H2 fix).
 * No `as unknown as` casts (Finding H4 fix — Zod validation provides
 * type-safe narrowing from the Drizzle `string` to the Zod enum).
 *
 * Reference: Skills KB §12 (queries.ts Boundary pattern).
 */

export async function getPrograms(goal?: string): Promise<Program[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { programs } = await import('@/lib/db/schema');

    const result = await db
      .select()
      .from(programs)
      .where(and(eq(programs.published, true), goal ? eq(programs.goal, goal) : undefined))
      .orderBy(programs.order);

    if (result.length > 0) {
      const validated = ProgramArraySchema.safeParse(result);
      if (validated.success) return validated.data;
      console.error('[getPrograms] DB result validation failed:', validated.error);
    }
    // DB returned empty or validation failed — fall back to static
    return goal
      ? STATIC_PROGRAMS.filter((p) => p.published && p.goal === goal)
      : STATIC_PROGRAMS.filter((p) => p.published);
  } catch {
    // DB unavailable — fall back to static
    return goal
      ? STATIC_PROGRAMS.filter((p) => p.published && p.goal === goal)
      : STATIC_PROGRAMS.filter((p) => p.published);
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { programs } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(programs)
      .where(and(eq(programs.slug, slug), eq(programs.published, true)))
      .limit(1);

    if (row) {
      const validated = ProgramArraySchema.safeParse([row]);
      if (validated.success && validated.data.length > 0) return validated.data[0]!;
      console.error('[getProgramBySlug] DB row validation failed');
    }

    // Not in DB — try static
    const staticMatch = STATIC_PROGRAMS.find((p) => p.slug === slug && p.published);
    return staticMatch ?? null;
  } catch {
    const staticMatch = STATIC_PROGRAMS.find((p) => p.slug === slug && p.published);
    return staticMatch ?? null;
  }
}

export async function getProgramGoals(): Promise<string[]> {
  const programs = await getPrograms();
  return [...new Set(programs.map((p) => p.goal))];
}
