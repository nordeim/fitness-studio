import { serve } from 'inngest/next';
import { inngest } from '@/lib/inngest/client';
import { trialRequested } from '@/inngest/functions/trial-requested';
import { assetGenerate } from '@/inngest/functions/asset-generate';

/**
 * IRONFORGE — Inngest serve route.
 *
 * Exposes POST /api/inngest for Inngest to invoke function runs.
 * Registers all functions in the `functions` array.
 *
 * In dev: run `pnpm dlx inngest-cli@latest dev` to start the Inngest
 * dev server (http://localhost:8288) which polls this route.
 *
 * When INNGEST_SIGNING_KEY is absent, we set INNGEST_DEV=1 so the SDK
 * runs in dev mode (skips signature verification).
 */

// Enable dev mode when no signing key is present
if (!process.env.INNGEST_SIGNING_KEY) {
  process.env.INNGEST_DEV = '1';
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [trialRequested, assetGenerate],
});
