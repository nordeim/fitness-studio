import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
  users,
  coaches,
  programs,
  stories,
  classSlots,
} from './schema';
import { STATIC_COACHES } from '@/features/coaches/data';
import { STATIC_PROGRAMS } from '@/features/programs/data';
import { STATIC_STORIES } from '@/features/stories/data';

/**
 * IRONFORGE — Database seed.
 *
 * Run with: `pnpm db:seed`
 * Idempotent: uses `ON CONFLICT DO NOTHING` so it can be re-run safely.
 *
 * Seeds:
 *  - 1 admin user (from ADMIN_EMAIL + ADMIN_PASSWORD_HASH env)
 *  - 8 coaches (from STATIC_COACHES)
 *  - 9 programs (from STATIC_PROGRAMS)
 *  - 6 stories (from STATIC_STORIES)
 *  - 48 class slots (next 14 days, generated)
 */

async function seed() {
  const connectionString = process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) {
    throw new Error('DATABASE_URL_UNPOOLED is required for seed');
  }

  const queryClient = postgres(connectionString, { prepare: false });
  const db = drizzle(queryClient);

  // ── Admin user ──
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ironforge.local';
  const adminPasswordHash =
    process.env.ADMIN_PASSWORD_HASH ??
    (await bcrypt.hash('ironforge-admin', 12));

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

  // ── Coaches ──
  console.log(`🌱 Seeding ${STATIC_COACHES.length} coaches...`);
  await db
    .insert(coaches)
    .values(
      STATIC_COACHES.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        title: c.title,
        bio: c.bio,
        certifications: c.certifications,
        specialties: c.specialties,
        signatureWorkout: c.signatureWorkout,
        portraitKey: c.portraitKey,
        yearsExp: c.yearsExp,
        order: c.order,
        published: c.published,
      })),
    )
    .onConflictDoNothing({ target: coaches.slug });

  // ── Programs ──
  console.log(`🌱 Seeding ${STATIC_PROGRAMS.length} programs...`);
  await db
    .insert(programs)
    .values(
      STATIC_PROGRAMS.map((p) => ({
        id: p.id,
        slug: p.slug,
        goal: p.goal,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        duration: p.duration,
        sessionsPerWeek: p.sessionsPerWeek,
        intensity: p.intensity,
        heroKey: p.heroKey,
        priceCents: p.priceCents,
        stripePriceId: p.stripePriceId,
        coachId: p.coachId,
        order: p.order,
        published: p.published,
      })),
    )
    .onConflictDoNothing({ target: programs.slug });

  // ── Stories ──
  console.log(`🌱 Seeding ${STATIC_STORIES.length} stories...`);
  await db
    .insert(stories)
    .values(
      STATIC_STORIES.map((s) => ({
        id: s.id,
        slug: s.slug,
        memberName: s.memberName,
        memberAge: s.memberAge,
        programSlug: s.programSlug,
        weeks: s.weeks,
        beforeKey: s.beforeKey,
        afterKey: s.afterKey,
        quote: s.quote,
        timeline: s.timeline,
        videoKey: s.videoKey,
        published: s.published,
      })),
    )
    .onConflictDoNothing({ target: stories.slug });

  // ── Class slots (next 14 days) ──
  console.log('🌱 Seeding 48 class slots (next 14 days)...');
  const slotInserts: typeof classSlots.$inferInsert[] = [];
  const now = new Date();
  const programIds = STATIC_PROGRAMS.slice(0, 4).map((p) => p.id); // first 4 programs
  const coachIds = STATIC_COACHES.slice(0, 4).map((c) => c.id); // first 4 coaches

  for (let day = 0; day < 14; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    date.setHours(6, 0, 0, 0); // 6 AM start

    // Skip Sundays (day 0)
    if (date.getDay() === 0) continue;

    // 3-4 slots per day
    const slotsForDay = day % 2 === 0 ? 4 : 3;
    for (let slot = 0; slot < slotsForDay; slot++) {
      const startsAt = new Date(date);
      startsAt.setHours(6 + slot * 3, 0, 0, 0); // 6 AM, 9 AM, 12 PM, 3 PM

      slotInserts.push({
        programId: programIds[day % programIds.length] ?? null,
        coachId: coachIds[day % coachIds.length] ?? null,
        startsAt,
        durationMin: 60,
        capacity: 8,
        location: '47 Eastbound Alley, NYC',
      });
    }
  }

  if (slotInserts.length > 0) {
    await db.insert(classSlots).values(slotInserts).onConflictDoNothing();
  }
  console.log(`  → ${slotInserts.length} slots inserted`);

  console.log('✅ Seed complete');
  await queryClient.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
