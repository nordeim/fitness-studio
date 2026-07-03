import { z } from 'zod';

/**
 * IRONFORGE — Booking domain schemas.
 *
 * Pure business logic — no Next.js / React / DB runtime imports.
 * Reference: Skills KB §9 (5-layer architecture — domain purity).
 */

export const TrialRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be 80 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email address')
    .max(160, 'Email must be 160 characters or less'),
  phone: z
    .string()
    .max(40, 'Phone must be 40 characters or less')
    .optional()
    .or(z.literal('')),
  goal: z.enum(['muscle', 'fat', 'fitness', 'athletic', 'rehab'], {
    message: 'Select a training goal',
  }),
  preferredTime: z.enum(['early', 'mid', 'evening', 'weekend'], {
    message: 'Select a preferred time',
  }),
  preferredCoachId: z
    .string()
    .uuid()
    .nullable()
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  consent: z
    .boolean()
    .refine((v) => v === true, 'You must consent to be contacted'),
  // Honeypot — accepts any string (so bots don't get a validation error
  // that would tip them off). The server action checks if it's non-empty
  // and returns SPAM_DETECTED.
  company_website: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type TrialRequestInput = z.infer<typeof TrialRequestSchema>;

export const TrialRequestResponseSchema = z.object({
  success: z.boolean(),
  code: z.enum([
    'SUCCESS',
    'VALIDATION',
    'RATE_LIMITED',
    'SPAM_DETECTED',
    'DUPLICATE',
    'INTERNAL',
  ]),
  message: z.string(),
  requestId: z.string().nullable(),
  /** M4 fix: field name for validation errors (e.g. 'email', 'name').
   *  Populated from Zod's `issues[0].path[0]` so the client can route
   *  errors to the correct form field without substring matching. */
  field: z.string().nullable().optional(),
});

export type TrialRequestResponse = z.infer<typeof TrialRequestResponseSchema>;

// Goal display labels
export const GOAL_OPTIONS = [
  { value: 'muscle', label: 'Muscle Gain' },
  { value: 'fat', label: 'Fat Loss' },
  { value: 'fitness', label: 'General Fitness' },
  { value: 'athletic', label: 'Athletic Perf.' },
  { value: 'rehab', label: 'Rehab / Mobility' },
] as const;

export const TIME_OPTIONS = [
  { value: 'early', label: 'Early', hours: '5–9 AM' },
  { value: 'mid', label: 'Mid', hours: '9–12' },
  { value: 'evening', label: 'Evening', hours: '4–8 PM' },
  { value: 'weekend', label: 'Weekend', hours: 'Sat–Sun' },
] as const;

// Factory for tests
export function getMockTrialRequest(
  overrides: Partial<TrialRequestInput> = {},
): TrialRequestInput {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '212-555-0100',
    goal: 'muscle',
    preferredTime: 'early',
    preferredCoachId: null,
    notes: 'Looking to build strength.',
    consent: true,
    company_website: '',
    ...overrides,
  };
}
