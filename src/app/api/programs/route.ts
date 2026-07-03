import { NextResponse } from 'next/server';
import { getPrograms } from '@/features/programs/queries';
import { ProgramArraySchema } from '@/features/programs/domain/schemas';

/**
 * GET /api/programs?goal=muscle|fat|fitness|athletic|rehab
 *
 * Returns all published programs, optionally filtered by goal.
 * Falls back to static data if DB is unavailable.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const goal = searchParams.get('goal') ?? undefined;

  // Validate goal if provided
  if (goal && !['muscle', 'fat', 'fitness', 'athletic', 'rehab'].includes(goal)) {
    return NextResponse.json(
      { error: { code: 'INVALID_GOAL', message: 'Goal must be one of: muscle, fat, fitness, athletic, rehab' } },
      { status: 400 },
    );
  }

  const programs = await getPrograms(goal);
  const validated = ProgramArraySchema.safeParse(programs);

  if (!validated.success) {
    console.error('[api/programs] Response validation failed:', validated.error);
    return NextResponse.json(
      { error: { code: 'VALIDATION', message: 'Internal data shape mismatch' } },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: validated.data });
}
