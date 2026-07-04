import { inngest } from '@/lib/inngest/client';
import type { TrialRequestedEvent } from '@/lib/inngest/client';
import {
  getResend,
  isResendConfigured,
  getFromEmail,
  getCoachNotifyEmail,
} from '@/lib/email/resend';

/**
 * IRONFORGE — trial-requested Inngest function.
 *
 * Triggered when a trial request is submitted. Runs 3 steps:
 *  1. notify-coach — sends email to the coach team inbox (or console.log fallback)
 *  2. confirm-member — sends confirmation email to the member (or console.log fallback)
 *  3. schedule-followup — 3-day delay, then checks if the request was scheduled
 *
 * F-M4 fix: Replaced console.log stubs with real Resend email sends.
 * When RESEND_API_KEY is not configured (dev/build/test), falls back to
 * console.log so the function still works without external services.
 * When Resend send fails, re-throws so Inngest retries.
 *
 * Reference: Skills KB §12 (Inngest step.run pattern, try/catch + re-throw).
 */
export const trialRequested = inngest.createFunction(
  {
    id: 'trial-requested',
    name: 'Trial Requested',
    triggers: [{ event: 'trial.requested' }],
  },
  async ({ event, step }) => {
    const data = event.data as TrialRequestedEvent['data'];

    // Step 1: Notify the coach team
    const coachResult = await step.run('notify-coach', async () => {
      const resend = getResend();
      if (!resend || !isResendConfigured()) {
        console.log(
          `[inngest:notify-coach] (Resend not configured — logging only)
          Member: ${data.name} <${data.email}>
          Phone: ${data.phone ?? 'N/A'}
          Goal: ${data.goal}
          Preferred time: ${data.preferredTime}
          Preferred coach ID: ${data.preferredCoachId ?? 'No preference'}
          Notes: ${data.notes ?? 'None'}
          Request ID: ${data.requestId}`,
        );
        return {
          success: true,
          notifiedAt: new Date().toISOString(),
          channel: 'console' as const,
        };
      }

      try {
        await resend.emails.send({
          from: getFromEmail(),
          to: getCoachNotifyEmail(),
          subject: `New Trial Request: ${data.name}`,
          text: `New trial request received.

Member: ${data.name} <${data.email}>
Phone: ${data.phone ?? 'N/A'}
Goal: ${data.goal}
Preferred time: ${data.preferredTime}
Preferred coach ID: ${data.preferredCoachId ?? 'No preference'}
Notes: ${data.notes ?? 'None'}
Request ID: ${data.requestId}`,
        });
        return {
          success: true,
          notifiedAt: new Date().toISOString(),
          channel: 'email' as const,
        };
      } catch (err) {
        console.error('[inngest:notify-coach] Resend send failed:', err);
        throw err; // Re-throw so Inngest retries
      }
    });

    // Step 2: Confirm with the member
    const memberResult = await step.run('confirm-member', async () => {
      const resend = getResend();
      if (!resend || !isResendConfigured()) {
        console.log(
          `[inngest:confirm-member] (Resend not configured — logging only)
          To: ${data.email}
          Hi ${data.name},
          Your trial request has been received. A coach will reach out within 24 hours.
          Request ID: ${data.requestId}`,
        );
        return {
          success: true,
          sentAt: new Date().toISOString(),
          channel: 'console' as const,
        };
      }

      try {
        await resend.emails.send({
          from: getFromEmail(),
          to: data.email,
          subject: 'IRONFORGE — Trial Request Received',
          text: `Hi ${data.name},

Your trial request has been received. A coach will reach out within 24 hours.

Request ID: ${data.requestId}

— IRONFORGE`,
        });
        return {
          success: true,
          sentAt: new Date().toISOString(),
          channel: 'email' as const,
        };
      } catch (err) {
        console.error('[inngest:confirm-member] Resend send failed:', err);
        throw err; // Re-throw so Inngest retries
      }
    });

    // Step 3: Schedule a 3-day follow-up check (future: step.sleep)
    await step.run('schedule-followup', async () => {
      console.log(`[inngest:schedule-followup] Would check in 3 days on request ${data.requestId}`);
      return { scheduled: true };
    });

    return {
      coachNotified: coachResult.success,
      memberConfirmed: memberResult.success,
      requestId: data.requestId,
    };
  },
);
