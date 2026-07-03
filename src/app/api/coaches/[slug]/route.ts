import { NextResponse } from 'next/server';
import { getCoachBySlug } from '@/features/coaches/queries';
import { CoachSchema } from '@/features/coaches/domain/schemas';

/**
 * GET /api/coaches/[slug]
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Coach "${slug}" not found` } },
      { status: 404 },
    );
  }

  const validated = CoachSchema.safeParse(coach);
  if (!validated.success) {
    console.error('[api/coaches/[slug]] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
