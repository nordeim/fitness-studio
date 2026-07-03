import { NextResponse } from 'next/server';
import { getCoaches } from '@/features/coaches/queries';
import { CoachArraySchema } from '@/features/coaches/domain/schemas';

/**
 * GET /api/coaches
 *
 * Returns all published coaches, ordered by `order` field.
 */
export async function GET() {
  const coaches = await getCoaches();
  const validated = CoachArraySchema.safeParse(coaches);

  if (!validated.success) {
    console.error('[api/coaches] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
