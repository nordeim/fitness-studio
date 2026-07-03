import { Inngest } from 'inngest';

/**
 * IRONFORGE — Inngest client.
 *
 * Uses process.env directly (with fallbacks) instead of the Zod-validated
 * env module, because:
 *  - The Inngest client is infrastructure code (Layer 4)
 *  - It needs to gracefully degrade when env vars are missing (dev without
 *    .env.local, build context, test context)
 *  - The env module throws in dev without .env.local, which would crash
 *    any route that imports the Inngest client at the top level
 *
 * In production with real env vars, these values come from the environment.
 * In dev without .env.local, the client uses placeholder values and events
 * are silently dropped (the server action catches the error).
 *
 * Reference: Skills KB §12 (Inngest patterns from nextjs16-react19-next-auth5-drizzle-orm).
 */

function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const inngest = new Inngest({
  id: 'ironforge',
  eventKey: getEnv('INNGEST_EVENT_KEY', 'dev-placeholder') || 'dev-placeholder',
  // Signing key is optional in dev (Inngest dev server doesn't require it)
  signingKey: getEnv('INNGEST_SIGNING_KEY') || undefined,
});

// Event type definitions (type-safe events)
export interface TrialRequestedEvent {
  name: 'trial.requested';
  data: {
    requestId: string;
    name: string;
    email: string;
    phone: string | null;
    goal: string;
    preferredTime: string;
    preferredCoachId: string | null;
    notes: string | null;
  };
}

export interface NewsletterSubscribedEvent {
  name: 'newsletter.subscribed';
  data: {
    email: string;
    source: string;
  };
}

export type AppEvents = TrialRequestedEvent | NewsletterSubscribedEvent;
