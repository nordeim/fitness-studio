import { NextResponse } from 'next/server';
import { getProgramBySlug } from '@/features/programs/queries';
import { ProgramSchema } from '@/features/programs/domain/schemas';

/**
 * GET /api/programs/[slug]
 *
 * Returns a single program by slug, or 404 if not found.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Program "${slug}" not found` } },
      { status: 404 },
    );
  }

  const validated = ProgramSchema.safeParse(program);
  if (!validated.success) {
    console.error('[api/programs/[slug]] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
