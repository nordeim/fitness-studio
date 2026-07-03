import { NextResponse } from 'next/server';
import { AssetGenerationRequestSchema, generatePlaceholderSvg } from '@/features/assets/domain/schemas';
import { isReplicateConfigured } from '@/lib/ai/replicate';
import { isStorageConfigured } from '@/lib/storage/r2';

/**
 * POST /api/admin/assets/generate
 *
 * Triggers AI asset generation for a coach portrait, program hero, or
 * story before/after image.
 *
 * Phase 9 will add auth check (admin role required).
 * For now, the route is open but logs all requests.
 *
 * Flow:
 *  1. Validate request body
 *  2. Check if Replicate + R2 are configured
 *  3. If configured: fire Inngest 'asset.generate' event (async)
 *  4. If not configured: return placeholder SVG immediately (fallback)
 *
 * Body: { type, entitySlug, promptOverride? }
 *
 * Returns:
 *  - 200: { success: true, code: 'SUCCESS', message, key? }
 *  - 200: { success: true, code: 'SUCCESS', fallbackSvg } (when not configured)
 *  - 400: { success: false, code: 'VALIDATION', message }
 *  - 401: { success: false, code: 'UNAUTHORIZED', message } (Phase 9)
 */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Auth check — admin role required (P1 fix from OWASP audit)
  const { auth } = await import('@/lib/auth');
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Admin access required' },
      { status: 401 },
    );
  }

  // 1. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, code: 'VALIDATION', message: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const parsed = AssetGenerationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { success: false, code: 'VALIDATION', message: firstError?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }

  const { type, entitySlug, promptOverride } = parsed.data;

  // 2. Check configuration
  const replicateReady = isReplicateConfigured();
  const storageReady = isStorageConfigured();

  // 3. If both configured: fire Inngest event
  if (replicateReady && storageReady) {
    try {
      const { inngest } = await import('@/lib/inngest/client');
      await inngest.send({
        name: 'asset.generate',
        data: {
          type,
          entitySlug,
          promptOverride: promptOverride || undefined,
        },
      });

      return NextResponse.json({
        success: true,
        code: 'SUCCESS',
        message: `Asset generation queued for ${type} / ${entitySlug}. Check Inngest dev UI for progress.`,
      });
    } catch (err) {
      console.error('[api/admin/assets/generate] Inngest send failed:', err);
      return NextResponse.json(
        { success: false, code: 'GENERATION_FAILED', message: 'Failed to queue asset generation' },
        { status: 500 },
      );
    }
  }

  // 4. Fallback: return placeholder SVG immediately
  const fallbackSvg = generatePlaceholderSvg(type, entitySlug);
  const missingServices = [
    !replicateReady && 'Replicate',
    !storageReady && 'R2',
  ].filter(Boolean).join(' + ');

  return NextResponse.json({
    success: true,
    code: 'SUCCESS',
    message: `${missingServices} not configured. Returning placeholder SVG. Set the required env vars to enable AI generation.`,
    fallbackSvg,
  });
}
