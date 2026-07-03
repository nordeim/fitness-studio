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

// Enable dev mode only in non-production when no signing key is present (P1 fix — OWASP A08)
const isBuildContext = process.env.NEXT_PHASE === 'phase-production-build';
const isProduction = process.env.NODE_ENV === 'production' && !isBuildContext;

if (!isProduction && !process.env.INNGEST_SIGNING_KEY) {
  process.env.INNGEST_DEV = '1';
}
// In production runtime (not build), require the signing key
if (isProduction && !process.env.INNGEST_SIGNING_KEY) {
  throw new Error('INNGEST_SIGNING_KEY is required in production');
}

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [trialRequested, assetGenerate],
});
