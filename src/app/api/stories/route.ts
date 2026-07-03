import { NextResponse } from 'next/server';
import { getStories } from '@/features/stories/queries';
import { StoryArraySchema } from '@/features/stories/domain/schemas';

/**
 * GET /api/stories
 */
export async function GET() {
  const stories = await getStories();
  const validated = StoryArraySchema.safeParse(stories);

  if (!validated.success) {
    console.error('[api/stories] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
