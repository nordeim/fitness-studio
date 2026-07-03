'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { CoachFormSchema } from './domain/schemas';

/**
 * IRONFORGE — Coach CRUD server actions.
 *
 * All actions:
 *  1. Check auth (must be admin)
 *  2. Validate `id` param as UUID (Finding M5 fix — previously raw string)
 *  3. Zod validate input body
 *  4. Perform DB operation (dynamic import — graceful fallback)
 *  5. revalidatePath to refresh cached pages
 *
 * Reference: Skills KB §12 (Auth-First Server Action pattern).
 */

const IdSchema = z.string().uuid('Invalid ID format');

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return { success: false as const, code: 'UNAUTHORIZED' as const, message: 'Admin access required' };
  }
  return { success: true as const };
}

export async function createCoach(input: unknown) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  const parsed = CoachFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      code: 'VALIDATION' as const,
      message: parsed.error.issues[0]?.message ?? 'Invalid input',
    };
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');
    await db.insert(coaches).values(parsed.data);
    revalidatePath('/admin/coaches');
    revalidatePath('/');
    return {
      success: true as const,
      code: 'SUCCESS' as const,
      message: `Coach "${parsed.data.name}" created`,
    };
  } catch (err) {
    console.error('[createCoach] DB error:', err);
    return {
      success: false as const,
      code: 'DB_ERROR' as const,
      message: 'Failed to create coach (DB may not be configured)',
    };
  }
}

export async function updateCoach(id: string, input: unknown) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  const idResult = IdSchema.safeParse(id);
  if (!idResult.success) {
    return {
      success: false as const,
      code: 'VALIDATION' as const,
      message: idResult.error.issues[0]?.message ?? 'Invalid ID',
    };
  }

  const parsed = CoachFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      code: 'VALIDATION' as const,
      message: parsed.error.issues[0]?.message ?? 'Invalid input',
    };
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(coaches).set({ ...parsed.data, updatedAt: new Date() }).where(eq(coaches.id, idResult.data));
    revalidatePath('/admin/coaches');
    revalidatePath('/');
    return { success: true as const, code: 'SUCCESS' as const, message: 'Coach updated' };
  } catch (err) {
    console.error('[updateCoach] DB error:', err);
    return { success: false as const, code: 'DB_ERROR' as const, message: 'Failed to update coach' };
  }
}

export async function deleteCoach(id: string) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  const idResult = IdSchema.safeParse(id);
  if (!idResult.success) {
    return {
      success: false as const,
      code: 'VALIDATION' as const,
      message: idResult.error.issues[0]?.message ?? 'Invalid ID',
    };
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    await db.delete(coaches).where(eq(coaches.id, idResult.data));
    revalidatePath('/admin/coaches');
    revalidatePath('/');
    return { success: true as const, code: 'SUCCESS' as const, message: 'Coach deleted' };
  } catch (err) {
    console.error('[deleteCoach] DB error:', err);
    return { success: false as const, code: 'DB_ERROR' as const, message: 'Failed to delete coach' };
  }
}

export async function toggleCoachPublished(id: string, published: boolean) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) return authCheck;

  const idResult = IdSchema.safeParse(id);
  if (!idResult.success) {
    return {
      success: false as const,
      code: 'VALIDATION' as const,
      message: idResult.error.issues[0]?.message ?? 'Invalid ID',
    };
  }

  try {
    const { db } = await import('@/lib/db/client');
    const { coaches } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    await db.update(coaches).set({ published, updatedAt: new Date() }).where(eq(coaches.id, idResult.data));
    revalidatePath('/admin/coaches');
    revalidatePath('/');
    return { success: true as const, code: 'SUCCESS' as const, message: published ? 'Coach published' : 'Coach unpublished' };
  } catch (err) {
    console.error('[toggleCoachPublished] DB error:', err);
    return { success: false as const, code: 'DB_ERROR' as const, message: 'Failed to toggle publish state' };
  }
}
