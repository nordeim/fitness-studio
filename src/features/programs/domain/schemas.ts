import { z } from 'zod';

/**
 * IRONFORGE — Program Zod schemas (domain layer).
 *
 * Pure business logic — no Next.js / React / DB runtime imports.
 * Used by:
 *  - API routes to validate outgoing responses
 *  - Client components to validate incoming API data
 *  - Tests to generate mock data via factory functions
 *
 * Reference: Skills KB §9 (5-layer architecture — domain purity).
 */

export const ProgramSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  goal: z.enum(['muscle', 'fat', 'fitness', 'athletic', 'rehab']),
  title: z.string().min(1),
  subtitle: z.string().nullable(),
  description: z.string().min(1),
  duration: z.string().nullable(),
  sessionsPerWeek: z.number().int().positive().nullable(),
  intensity: z.string().nullable(),
  heroKey: z.string().nullable(),
  priceCents: z.number().int().nonnegative().nullable(),
  stripePriceId: z.string().nullable(),
  coachId: z.string().uuid().nullable(),
  order: z.number().int(),
  published: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ProgramArraySchema = z.array(ProgramSchema);

export const ProgramDetailSchema = ProgramSchema.extend({
  coach: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      title: z.string(),
      slug: z.string(),
    })
    .nullable(),
});

export type Program = z.infer<typeof ProgramSchema>;
export type ProgramDetail = z.infer<typeof ProgramDetailSchema>;

// Factory for tests — getMockProgram(overrides)
export function getMockProgram(overrides: Partial<Program> = {}): Program {
  return {
    id: 'b1000000-0000-4000-8000-000000000001',
    slug: 'conjugate-max-effort',
    goal: 'muscle',
    title: 'Conjugate Max Effort',
    subtitle: 'Westside-inspired strength block',
    description: 'The conjugate system as taught by Marcus Steel.',
    duration: '12 weeks',
    sessionsPerWeek: 4,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-conjugate/800/600',
    priceCents: 24000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000001',
    order: 0,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}
