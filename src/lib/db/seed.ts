import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './schema';

/**
 * IRONFORGE — Database seed.
 *
 * Run with: `pnpm db:seed`
 * Idempotent: uses `ON CONFLICT DO NOTHING` so it can be re-run safely.
 *
 * Phase 0: seeds only the admin user.
 * Phase 5: will also seed coaches, programs, stories, class slots.
 */

async function seed() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) {
    throw new Error('DATABASE_URL_UNPOOLED is required for seed');
  }

  const queryClient = postgres(connectionString, { prepare: false });
  const db = drizzle(queryClient);

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ironforge.local';
  const adminPasswordHash =
    process.env.ADMIN_PASSWORD_HASH ??
    (await bcrypt.hash('ironforge-admin', 12)); // Dev-only fallback

  console.log(`🌱 Seeding admin user: ${adminEmail}`);

  await db
    .insert(users)
    .values({
      name: 'IRONFORGE Admin',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      emailVerified: new Date(),
    })
    .onConflictDoNothing({ target: users.email });

  console.log('✅ Seed complete');

  await queryClient.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
