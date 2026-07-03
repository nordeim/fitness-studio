import { z } from 'zod';

/**
 * IRONFORGE — Coach Zod schemas (domain layer).
 *
 * - CoachSchema: response shape (from DB / API)
 * - CoachFormSchema: input shape (from admin form)
 */

// ── Response schema (used by queries + API routes) ──
export const CoachSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  certifications: z.array(z.string()).nullable(),
  specialties: z.array(z.string()).nullable(),
  signatureWorkout: z.string().nullable(),
  portraitKey: z.string().nullable(),
  yearsExp: z.number().int().nonnegative().nullable(),
  order: z.number().int(),
  published: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CoachArraySchema = z.array(CoachSchema);

export type Coach = z.infer<typeof CoachSchema>;

export function getMockCoach(overrides: Partial<Coach> = {}): Coach {
  return {
    id: 'a1000000-0000-4000-8000-000000000001',
    slug: 'marcus-steel',
    name: 'Marcus Steel',
    title: 'Head of Strength',
    bio: 'Former IPF Junior World Champion. 14 years coaching.',
    certifications: ['NSCA-CSCS', 'FRC Mobility Specialist', 'USAW Level 2'],
    specialties: ['Hypertrophy', 'Powerlifting'],
    signatureWorkout: 'Conjugate Max Effort',
    portraitKey: 'https://picsum.photos/seed/coach-marcus-steel-portrait/600/800',
    yearsExp: 14,
    order: 0,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  };
}

// ── Form schema (used by admin CRUD server actions) ──
export const CoachFormSchema = z.object({
  slug: z
    .string()
    .min(2, 'Slug must be 2+ characters')
    .max(80, 'Slug must be 80 characters or less')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, hyphens, alphanumeric only'),
  name: z.string().min(2, 'Name must be 2+ characters').max(80),
  title: z.string().min(1, 'Title is required').max(120),
  bio: z.string().min(10, 'Bio must be 10+ characters').max(2000),
  certifications: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
  signatureWorkout: z.string().max(120).optional().or(z.literal('')),
  portraitKey: z.string().max(200).optional().or(z.literal('')),
  yearsExp: z.number().int().min(0).max(80).optional().or(z.literal(0)),
  order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export type CoachFormData = z.infer<typeof CoachFormSchema>;

export function getMockCoachForm(overrides: Partial<CoachFormData> = {}): CoachFormData {
  return {
    slug: 'new-coach',
    name: 'New Coach',
    title: 'Strength Coach',
    bio: 'A description of the new coach with at least 10 characters.',
    certifications: ['NSCA-CSCS'],
    specialties: ['Hypertrophy'],
    signatureWorkout: 'Conjugate Max Effort',
    portraitKey: '',
    yearsExp: 5,
    order: 8,
    published: false,
    ...overrides,
  };
}
