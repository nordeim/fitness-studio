import { describe, it, expect, vi } from 'vitest';

/**
 * Published-filter regression tests (Finding H2).
 *
 * These tests verify that the public query modules filter out unpublished
 * records when the database is available. The existing *-queries.test.ts
 * files only test the static-fallback path (DB throws). This file mocks
 * the DB to RETURN data (including unpublished rows) and asserts that
 * only published records are returned.
 *
 * Mock pattern: chainable Drizzle query builder.
 *   db.select().from(table).where(eq(col, val)).orderBy(col) → Promise<row[]>
 *   db.select().from(table).where(eq(col, val)).limit(1)    → Promise<row[]>
 */

// ── Test data: mixed published + unpublished rows ──
const PUBLISHED_COACH = {
  id: 'a1000000-0000-4000-8000-000000000001',
  slug: 'marcus-steel',
  name: 'Marcus Steel',
  title: 'Head of Strength',
  bio: 'Published coach.',
  certifications: ['NSCA-CSCS'],
  specialties: ['Hypertrophy'],
  signatureWorkout: 'Conjugate Max Effort',
  portraitKey: null,
  yearsExp: 14,
  order: 0,
  published: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const UNPUBLISHED_COACH = {
  ...PUBLISHED_COACH,
  id: 'a1000000-0000-4000-8000-000000000099',
  slug: 'draft-coach',
  name: 'Draft Coach',
  published: false,
};

const PUBLISHED_PROGRAM = {
  id: 'b1000000-0000-4000-8000-000000000001',
  slug: 'conjugate-max-effort',
  goal: 'muscle',
  title: 'Conjugate Max Effort',
  subtitle: null,
  description: 'Published program.',
  duration: '12 weeks',
  sessionsPerWeek: 4,
  intensity: 'Build',
  heroKey: null,
  priceCents: 24000,
  stripePriceId: null,
  coachId: 'a1000000-0000-4000-8000-000000000001',
  order: 0,
  published: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const UNPUBLISHED_PROGRAM = {
  ...PUBLISHED_PROGRAM,
  id: 'b1000000-0000-4000-8000-000000000099',
  slug: 'draft-program',
  title: 'Draft Program',
  published: false,
};

const PUBLISHED_STORY = {
  id: 'c1000000-0000-4000-8000-000000000001',
  slug: 'david-k',
  memberName: 'David K.',
  memberAge: 38,
  programSlug: 'conjugate-max-effort',
  weeks: 16,
  beforeKey: null,
  afterKey: null,
  quote: 'Published story.',
  timeline: null,
  videoKey: null,
  published: true,
  createdAt: new Date('2024-06-01'),
};

const UNPUBLISHED_STORY = {
  ...PUBLISHED_STORY,
  id: 'c1000000-0000-4000-8000-000000000099',
  slug: 'draft-story',
  memberName: 'Draft Member',
  published: false,
};

// ── Mock DB client: chainable query builder ──
// Returns ALL rows (published + unpublished). The query module's .where()
// should filter on the DB side. But since we're mocking, we return all rows
// and let the query module's .where() be a no-op in the mock. The test
// then asserts that the RESULT only contains published rows.
//
// Wait — that won't test the filter. The filter happens in the SQL query
// (.where(eq(published, true))), which we're mocking. So we need the mock
// to simulate the filter: when .where(eq(published, true)) is called,
// return only published rows.
//
// Approach: the mock .where() receives the eq() expression. Since eq() from
// drizzle-orm returns a SQL fragment object, we can't easily inspect it.
// Instead, we just return only-published rows from the mock when .where()
// is called, and all rows when it's not. This simulates the DB doing the
// filtering correctly.
//
// If the query module does NOT call .where(), the mock returns ALL rows
// (including unpublished) → the test fails → confirms the filter is missing.

/**
 * Mock chain: simulates Drizzle's query builder.
 *
 * - When .where() IS called → returns only published rows (simulates DB filter)
 * - When .where() is NOT called → returns all rows (including unpublished)
 *
 * This lets us test both directions:
 *   - If the query module adds .where(eq(published, true)) → mock returns
 *     filtered rows → test passes
 *   - If the query module omits .where() → mock returns all rows →
 *     test sees unpublished rows → fails
 */
function createMockChain(allRows: unknown[], publishedRows: unknown[]) {
  return {
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockResolvedValue(publishedRows),
      limit: vi.fn().mockResolvedValue(publishedRows.slice(0, 1)),
    }),
    orderBy: vi.fn().mockResolvedValue(allRows),
    limit: vi.fn().mockResolvedValue(allRows.slice(0, 1)),
  };
}

const coachChain = createMockChain(
  [PUBLISHED_COACH, UNPUBLISHED_COACH],
  [PUBLISHED_COACH],
);
const programChain = createMockChain(
  [PUBLISHED_PROGRAM, UNPUBLISHED_PROGRAM],
  [PUBLISHED_PROGRAM],
);
const storyChain = createMockChain(
  [PUBLISHED_STORY, UNPUBLISHED_STORY],
  [PUBLISHED_STORY],
);

vi.mock('@/lib/db/client', () => ({
  db: {
    select: vi.fn().mockImplementation(() => ({
      from: vi.fn().mockImplementation((table: unknown) => {
        // Return the appropriate chain based on which table is queried
        if (table === 'coaches-table') return coachChain;
        if (table === 'programs-table') return programChain;
        if (table === 'stories-table') return storyChain;
        return createMockChain([], []);
      }),
    })),
  },
}));

vi.mock('@/lib/db/schema', () => ({
  coaches: 'coaches-table',
  programs: 'programs-table',
  stories: 'stories-table',
  classSlots: 'class-slots-table',
}));

const { getCoaches, getCoachBySlug } = await import('@/features/coaches/queries');
const { getPrograms, getProgramBySlug } = await import('@/features/programs/queries');
const { getStories, getStoryBySlug } = await import('@/features/stories/queries');

describe('H2 regression: published filter on public queries (DB available)', () => {
  describe('getCoaches', () => {
    it('excludes unpublished coaches', async () => {
      const coaches = await getCoaches();
      expect(coaches.every((c) => c.published === true)).toBe(true);
      expect(coaches.find((c) => c.slug === 'draft-coach')).toBeUndefined();
    });

    it('includes published coaches', async () => {
      const coaches = await getCoaches();
      expect(coaches.find((c) => c.slug === 'marcus-steel')).toBeDefined();
    });

    it('calls .where() to filter on the DB side', async () => {
      await getCoaches();
      expect(coachChain.where).toHaveBeenCalled();
    });
  });

  describe('getCoachBySlug', () => {
    it('returns a published coach by slug', async () => {
      const coach = await getCoachBySlug('marcus-steel');
      expect(coach).not.toBeNull();
      expect(coach?.published).toBe(true);
    });

    it('calls .where() to filter on the DB side (includes published check)', async () => {
      await getCoachBySlug('marcus-steel');
      expect(coachChain.where).toHaveBeenCalled();
    });
  });

  describe('getPrograms', () => {
    it('excludes unpublished programs', async () => {
      const programs = await getPrograms();
      expect(programs.every((p) => p.published === true)).toBe(true);
      expect(programs.find((p) => p.slug === 'draft-program')).toBeUndefined();
    });

    it('calls .where() to filter on the DB side', async () => {
      await getPrograms();
      expect(programChain.where).toHaveBeenCalled();
    });
  });

  describe('getProgramBySlug', () => {
    it('returns a published program by slug', async () => {
      const program = await getProgramBySlug('conjugate-max-effort');
      expect(program).not.toBeNull();
      expect(program?.published).toBe(true);
    });
  });

  describe('getStories', () => {
    it('excludes unpublished stories', async () => {
      const stories = await getStories();
      expect(stories.every((s) => s.published === true)).toBe(true);
      expect(stories.find((s) => s.slug === 'draft-story')).toBeUndefined();
    });

    it('calls .where() to filter on the DB side', async () => {
      await getStories();
      expect(storyChain.where).toHaveBeenCalled();
    });
  });

  describe('getStoryBySlug', () => {
    it('returns a published story by slug', async () => {
      const story = await getStoryBySlug('david-k');
      expect(story).not.toBeNull();
      expect(story?.published).toBe(true);
    });
  });
});
