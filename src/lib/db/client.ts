import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * IRONFORGE — Drizzle + postgres client singleton.
 *
 * Reference: Skills KB §12 (nextjs16-react19-next-auth5-drizzle-orm).
 * Lesson #8: `postgres()` defers connection until first query — allows
 * eager db instantiation without breaking the build.
 *
 * DrizzleAdapter rejects Proxy-based db — use a real Drizzle client.
 */

const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Required for PgBouncer pooled connections
});

export const db = drizzle(queryClient, { schema });
export type DB = typeof db;
export { schema };
