import { NextResponse } from 'next/server';
import { getStoryBySlug } from '@/features/stories/queries';
import { StorySchema } from '@/features/stories/domain/schemas';

/**
 * GET /api/stories/[slug]
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Story "${slug}" not found` } },
      { status: 404 },
    );
  }

  const validated = StorySchema.safeParse(story);
  if (!validated.success) {
    console.error('[api/stories/[slug]] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
