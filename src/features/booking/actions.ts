'use server';

import { randomUUID } from 'node:crypto';
import { headers } from 'next/headers';
import { TrialRequestSchema, type TrialRequestResponse } from './domain/schemas';
import { rateLimitBooking } from '@/lib/ratelimit';

/**
 * IRONFORGE — submitTrialRequest server action.
 *
 * Flow:
 *  1. Rate limit by IP (5/min — Upstash with no-op fallback for dev)
 *  2. Zod validate the input
 *  3. Honeypot check (company_website must be empty)
 *  4. Generate idempotency key (UUID v4)
 *  5. Insert into trial_requests table (DB-first; if DB unavailable, still
 *     fire the Inngest event so the coach gets notified)
 *  6. Fire Inngest 'trial.requested' event (async, non-blocking)
 *  7. Return success response with requestId
 *
 * On error: return { success: false, code, message } — never throw to client.
 *
 * Reference: Skills KB §12 (Auth-First Server Action pattern — adapted for
 * public form: no auth check, but rate limit + honeypot + Zod).
 * Reference: Skills KB §14 (env validation — dynamic import avoids crash).
 */

export async function submitTrialRequest(
  input: unknown,
): Promise<TrialRequestResponse> {
  // 1. Rate limit
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
  const { success: rateLimitOk } = await rateLimitBooking(ip);
  if (!rateLimitOk) {
    return {
      success: false,
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please wait a minute and try again.',
      requestId: null,
    };
  }

  // 2. Zod validate
  const parsed = TrialRequestSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    // M4 fix: populate `field` from the Zod error path so the client
    // can route errors to the correct form field without substring matching.
    const fieldPath = firstError?.path[0];
    return {
      success: false,
      code: 'VALIDATION',
      message: firstError?.message ?? 'Invalid input',
      requestId: null,
      field: typeof fieldPath === 'string' ? fieldPath : null,
    };
  }

  const data = parsed.data;

  // 3. Honeypot — already validated by Zod (max 0 chars), but double-check
  if (data.company_website && data.company_website.length > 0) {
    return {
      success: false,
      code: 'SPAM_DETECTED',
      message: 'Spam detected.',
      requestId: null,
    };
  }

  // 4. Generate idempotency key
  const requestId = randomUUID();

  // 5. Insert into DB (best-effort — don't block on DB)
  try {
    const { db } = await import('@/lib/db/client');
    const { trialRequests } = await import('@/lib/db/schema');

    await db
      .insert(trialRequests)
      .values({
        id: requestId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        goal: data.goal,
        preferredTime: data.preferredTime,
        preferredCoachId: data.preferredCoachId ?? null,
        notes: data.notes || null,
        status: 'received',
        idempotencyKey: requestId,
      })
      .onConflictDoNothing({ target: trialRequests.idempotencyKey });
  } catch (err) {
    // DB unavailable — log but continue (still fire Inngest so coach is notified)
    console.error('[submitTrialRequest] DB insert failed (continuing with Inngest):', err);
  }

  // 6. Fire Inngest event (non-blocking)
  try {
    const { inngest } = await import('@/lib/inngest/client');
    await inngest.send({
      name: 'trial.requested',
      data: {
        requestId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        goal: data.goal,
        preferredTime: data.preferredTime,
        preferredCoachId: data.preferredCoachId ?? null,
        notes: data.notes || null,
      },
    });
  } catch (err) {
    // Inngest unavailable — log but don't fail the request
    // The row is already in the DB (if DB was available); admin can process manually
    console.error('[submitTrialRequest] Inngest send failed:', err);
  }

  // 7. Return success
  return {
    success: true,
    code: 'SUCCESS',
    message: 'Trial request received. A coach will reach out within 24 hours.',
    requestId,
  };
}
