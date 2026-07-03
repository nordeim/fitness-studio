import { inngest } from '@/lib/inngest/client';
import { generateNoirImage, downloadImage, isReplicateConfigured } from '@/lib/ai/replicate';
import { putObject, isStorageConfigured } from '@/lib/storage/r2';

/**
 * IRONFORGE — asset.generate Inngest function.
 *
 * Triggered when an admin requests AI asset generation. Runs 3 steps:
 *  1. replicate — generate the B&W noir image via SDXL
 *  2. upload — download from Replicate + upload to R2
 *  3. notify — log completion (Phase 9 wires DB update + admin notification)
 *
 * Fallback: if Replicate or R2 is not configured, the function completes
 * with a fallbackUrl and logs a warning. The admin UI shows the placeholder.
 *
 * Reference: Skills KB §12 (Inngest step.run pattern, try/catch + re-throw).
 * Reference: T5 lesson — observable fail-open policy (log when skipping).
 */
export interface AssetGenerateEventData {
  type: 'coach_portrait' | 'program_hero' | 'story_before' | 'story_after';
  entitySlug: string;
  promptOverride?: string;
}

interface ReplicateResult {
  success: boolean;
  url: string | null;
  key: string | null;
  reason: string | null;
}

interface UploadResult {
  success: boolean;
  key: string | null;
  fallbackUrl: string | null;
  reason: string | null;
}

export const assetGenerate = inngest.createFunction(
  {
    id: 'asset-generate',
    name: 'Asset Generate',
    triggers: [{ event: 'asset.generate' }],
  },
  async ({ event, step }) => {
    const data = event.data as AssetGenerateEventData;

    // Step 1: Generate via Replicate
    const replicateResult = (await step.run('replicate', async (): Promise<ReplicateResult> => {
      if (!isReplicateConfigured()) {
        console.warn('[inngest:asset-generate] Replicate not configured — skipping generation');
        return { success: false, url: null, key: null, reason: 'REPLICATE_NOT_CONFIGURED' };
      }

      try {
        const prompt = data.promptOverride || buildPromptFromType(data.type, data.entitySlug);
        const result = await generateNoirImage(prompt);
        if (!result) {
          return { success: false, url: null, key: null, reason: 'GENERATION_FAILED' };
        }
        return { success: true, url: result.url, key: result.key, reason: null };
      } catch (err) {
        console.error('[inngest:asset-generate] Replicate step failed:', err);
        throw err;
      }
    })) as ReplicateResult;

    // Step 2: Upload to R2 (only if Replicate succeeded)
    const uploadResult = (await step.run('upload', async (): Promise<UploadResult> => {
      if (!replicateResult.success || !replicateResult.url || !replicateResult.key) {
        return { success: false, key: null, fallbackUrl: null, reason: 'NO_SOURCE_IMAGE' };
      }

      if (!isStorageConfigured()) {
        console.warn('[inngest:asset-generate] R2 not configured — image not uploaded');
        return {
          success: false,
          key: null,
          fallbackUrl: replicateResult.url,
          reason: 'R2_NOT_CONFIGURED',
        };
      }

      try {
        const imageBuffer = await downloadImage(replicateResult.url);
        const key = await putObject('generated', replicateResult.key, imageBuffer, 'image/jpeg');

        if (!key) {
          return { success: false, key: null, fallbackUrl: replicateResult.url, reason: 'UPLOAD_FAILED' };
        }

        return { success: true, key, fallbackUrl: null, reason: null };
      } catch (err) {
        console.error('[inngest:asset-generate] Upload step failed:', err);
        return {
          success: false,
          key: null,
          fallbackUrl: replicateResult.url,
          reason: 'UPLOAD_ERROR',
        };
      }
    })) as UploadResult;

    // Step 3: Notify (log completion — Phase 9 wires DB update)
    await step.run('notify', async () => {
      const status = replicateResult.success && uploadResult.success ? 'COMPLETE' : 'PARTIAL';
      console.log(`[inngest:asset-generate] Asset generation ${status}:
        Type: ${data.type}
        Entity: ${data.entitySlug}
        Replicate: ${replicateResult.success ? '✓' : '✗'} (${replicateResult.reason ?? 'OK'})
        R2 Upload: ${uploadResult.success ? '✓' : '✗'} (${uploadResult.reason ?? 'OK'})
        Key: ${uploadResult.key ?? 'N/A'}
        Fallback URL: ${uploadResult.fallbackUrl ?? 'N/A'}
      `);

      return { status, key: uploadResult.key, fallbackUrl: uploadResult.fallbackUrl };
    });

    return {
      replicateSuccess: replicateResult.success,
      uploadSuccess: uploadResult.success,
      key: uploadResult.key,
      fallbackUrl: uploadResult.fallbackUrl,
    };
  },
);

function buildPromptFromType(
  type: AssetGenerateEventData['type'],
  entitySlug: string,
): string {
  const slugDisplay = entitySlug.replace(/-/g, ' ');
  switch (type) {
    case 'coach_portrait':
      return `professional portrait of a strength coach, ${slugDisplay}, arms crossed, confident expression, wearing athletic apparel, gym background blurred, dramatic side lighting`;
    case 'program_hero':
      return `athletic training scene for ${slugDisplay}, athlete mid-lift, chalk dust in air, power rack and barbell visible, dramatic low-key lighting`;
    case 'story_before':
      return `before photo, average person standing in gym, neutral expression, soft lighting, documentary style`;
    case 'story_after':
      return `after photo, transformed athlete, defined musculature, confident posture, gym background, dramatic lighting`;
  }
}
