import { eq } from 'drizzle-orm';
import { STATIC_PROGRAMS } from './data';
import type { Program } from './domain/schemas';

/**
 * IRONFORGE — Program queries (Layer 2).
 *
 * Pattern: DB-first with static fallback.
 *  - Tries to query Postgres via Drizzle.
 *  - If DB is unavailable (env missing, connection refused, etc.), falls
 *    back to STATIC_PROGRAMS.
 *  - This allows the marketing site to render in all contexts:
 *    production (DB), build time (no DB), dev without DB (static data).
 *
 * Reference: Skills KB §12 (queries.ts Boundary pattern).
 * Reference: Skills KB §14 (env validation — dynamic import avoids
 * crash when env module throws).
 */

export async function getPrograms(goal?: string): Promise<Program[]> {
  try {
    const { db } = await import('@/lib/db/client');
    const { programs } = await import('@/lib/db/schema');

    const result = await db
      .select()
      .from(programs)
      .where(goal ? eq(programs.goal, goal) : undefined)
      .orderBy(programs.order);

    if (result.length > 0) {
      return result as unknown as Program[];
    }
    // DB returned empty — fall back to static
    return goal
      ? STATIC_PROGRAMS.filter((p) => p.goal === goal).map((p) => p as unknown as Program)
      : STATIC_PROGRAMS.map((p) => p as unknown as Program);
  } catch {
    // DB unavailable — fall back to static
    return goal
      ? STATIC_PROGRAMS.filter((p) => p.goal === goal).map((p) => p as unknown as Program)
      : STATIC_PROGRAMS.map((p) => p as unknown as Program);
  }
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  try {
    const { db } = await import('@/lib/db/client');
    const { programs } = await import('@/lib/db/schema');

    const [row] = await db
      .select()
      .from(programs)
      .where(eq(programs.slug, slug))
      .limit(1);

    if (row) return row as unknown as Program;

    // Not in DB — try static
    const staticMatch = STATIC_PROGRAMS.find((p) => p.slug === slug);
    return staticMatch ? (staticMatch as unknown as Program) : null;
  } catch {
    const staticMatch = STATIC_PROGRAMS.find((p) => p.slug === slug);
    return staticMatch ? (staticMatch as unknown as Program) : null;
  }
}

export async function getProgramGoals(): Promise<string[]> {
  const programs = await getPrograms();
  return [...new Set(programs.map((p) => p.goal))];
}
