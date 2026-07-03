import { z } from 'zod';

/**
 * IRONFORGE — Story Zod schemas (domain layer).
 */

export const StorySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  memberName: z.string().min(1),
  memberAge: z.number().int().positive().nullable(),
  programSlug: z.string().nullable(),
  weeks: z.number().int().positive().nullable(),
  beforeKey: z.string().nullable(),
  afterKey: z.string().nullable(),
  quote: z.string().min(1),
  timeline: z.unknown().nullable(),
  videoKey: z.string().nullable(),
  published: z.boolean(),
  createdAt: z.coerce.date(),
});

export const StoryArraySchema = z.array(StorySchema);

export type Story = z.infer<typeof StorySchema>;

export function getMockStory(overrides: Partial<Story> = {}): Story {
  return {
    id: 'c1000000-0000-4000-8000-000000000001',
    slug: 'david-k',
    memberName: 'David K.',
    memberAge: 38,
    programSlug: 'conjugate-max-effort',
    weeks: 16,
    beforeKey: 'https://picsum.photos/seed/story-david-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-david-after/600/450',
    quote: 'I walked in unable to deadlift 315. Sixteen weeks later I pulled 500.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-06-01'),
    ...overrides,
  };
}
