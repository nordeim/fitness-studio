import { Resend } from 'resend';

/**
 * IRONFORGE — Resend email client.
 *
 * F-M4 fix: Created this module to wire real email sending for the
 * trial-requested Inngest function (previously stubbed with console.log).
 *
 * Uses `process.env` directly (with null fallback) instead of the Zod-validated
 * `env` module, because:
 *  - The Resend client is infrastructure code (Layer 4)
 *  - It needs to gracefully degrade when env vars are missing (dev without
 *    .env.local, build context, test context)
 *  - Matches the pattern used by stripe.ts, r2.ts, replicate.ts, inngest/client.ts
 *
 * In production with real RESEND_API_KEY, returns a real Resend client.
 * In dev/build/test, returns null — callers check for null and fall back
 * to console.log.
 *
 * Reference: Skills KB §12 (graceful-degradation pattern for infra clients).
 */

function getResendApiKey(): string | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === 're_placeholder' || key.startsWith('re_xxx')) {
    return null;
  }
  return key;
}

let resendClient: Resend | null = null;

export function getResend(): Resend | null {
  const key = getResendApiKey();
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

export function isResendConfigured(): boolean {
  return getResend() !== null;
}

/**
 * Sender email address — must be a verified domain in Resend.
 * Defaults to a local address for dev; production sets RESEND_FROM_EMAIL.
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? 'noreply@ironforge.local';
}

/**
 * Inbox that receives trial request notifications (the coach team inbox).
 * Defaults to a local address for dev; production sets COACH_NOTIFY_EMAIL.
 */
export function getCoachNotifyEmail(): string {
  return process.env.COACH_NOTIFY_EMAIL ?? 'coaches@ironforge.local';
}
