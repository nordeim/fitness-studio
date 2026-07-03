import { inngest } from '@/lib/inngest/client';
import type { TrialRequestedEvent } from '@/lib/inngest/client';

/**
 * IRONFORGE — trial-requested Inngest function.
 *
 * Triggered when a trial request is submitted. Runs 3 steps:
 *  1. notify-coach — sends email to the assigned coach (or admin inbox)
 *  2. confirm-member — sends confirmation email to the member
 *  3. schedule-followup — 3-day delay, then checks if the request was scheduled
 *
 * Phase 6: email steps are stubbed with console.log (no Resend key in dev).
 * Phase 12 (Docs) will document wiring real Resend API.
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

    // Step 1: Notify the coach
    const coachResult = await step.run('notify-coach', async () => {
      try {
        // Phase 12: wire real email via Resend
        // For now, log to server console
        console.log(`[inngest:notify-coach] Trial request for coach:
          Member: ${data.name} <${data.email}>
          Phone: ${data.phone ?? 'N/A'}
          Goal: ${data.goal}
          Preferred time: ${data.preferredTime}
          Preferred coach ID: ${data.preferredCoachId ?? 'No preference'}
          Notes: ${data.notes ?? 'None'}
          Request ID: ${data.requestId}
        `);
        return { success: true, notifiedAt: new Date().toISOString() };
      } catch (err) {
        console.error('[inngest:notify-coach] Failed:', err);
        throw err; // Re-throw so Inngest retries
      }
    });

    // Step 2: Confirm with the member
    const memberResult = await step.run('confirm-member', async () => {
      try {
        console.log(`[inngest:confirm-member] Sending confirmation to ${data.email}:
          Hi ${data.name},
          Your trial request has been received. A coach will reach out within 24 hours.
          Request ID: ${data.requestId}
        `);
        return { success: true, sentAt: new Date().toISOString() };
      } catch (err) {
        console.error('[inngest:confirm-member] Failed:', err);
        throw err;
      }
    });

    // Step 3: Schedule a 3-day follow-up check
    await step.run('schedule-followup', async () => {
      // Phase 7+: use step.sleep or step.sendEvent with delay
      // For now, just log that we'd schedule it
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
