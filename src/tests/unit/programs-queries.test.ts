import { describe, it, expect, vi } from 'vitest';

/**
 * Program queries — DB-first with static fallback.
 *
 * Tests:
 *  - When DB is unavailable (dynamic import throws), falls back to STATIC_PROGRAMS.
 *  - getPrograms() returns all 9 programs.
 *  - getPrograms('muscle') returns only muscle programs.
 *  - getProgramBySlug() returns a specific program.
 *  - getProgramBySlug() returns null for unknown slug.
 *
 * The queries module uses dynamic import for the db client, so we mock
 * the import to throw (simulating DB unavailable).
 */

// Mock the db client dynamic import to throw (simulates no DB)
vi.mock('@/lib/db/client', () => {
  throw new Error('DB unavailable — env not configured');
});

// Mock the schema dynamic import to return the schema
vi.mock('@/lib/db/schema', () => ({
  programs: {},
  coaches: {},
  stories: {},
  classSlots: {},
}));

const { getPrograms, getProgramBySlug, getProgramGoals } = await import(
  '@/features/programs/queries'
);

describe('program queries (DB unavailable → static fallback)', () => {
  describe('getPrograms', () => {
    it('returns all 9 programs when no goal specified', async () => {
      const programs = await getPrograms();
      expect(programs).toHaveLength(9);
    });

    it('returns only muscle programs when goal=muscle', async () => {
      const programs = await getPrograms('muscle');
      expect(programs).toHaveLength(2);
      expect(programs.every((p) => p.goal === 'muscle')).toBe(true);
    });

    it('returns only fat programs when goal=fat', async () => {
      const programs = await getPrograms('fat');
      expect(programs).toHaveLength(2);
      expect(programs.every((p) => p.goal === 'fat')).toBe(true);
    });

    it('returns only rehab programs when goal=rehab', async () => {
      const programs = await getPrograms('rehab');
      expect(programs).toHaveLength(2);
      expect(programs.every((p) => p.goal === 'rehab')).toBe(true);
    });

    it('returns only athletic programs when goal=athletic', async () => {
      const programs = await getPrograms('athletic');
      expect(programs).toHaveLength(2);
      expect(programs.every((p) => p.goal === 'athletic')).toBe(true);
    });

    it('returns only fitness programs when goal=fitness', async () => {
      const programs = await getPrograms('fitness');
      expect(programs).toHaveLength(1);
      expect(programs.every((p) => p.goal === 'fitness')).toBe(true);
    });

    it('returns empty array for unknown goal', async () => {
      const programs = await getPrograms('nonexistent' as never);
      expect(programs).toHaveLength(0);
    });
  });

  describe('getProgramBySlug', () => {
    it('returns a program by slug', async () => {
      const program = await getProgramBySlug('conjugate-max-effort');
      expect(program).not.toBeNull();
      expect(program?.slug).toBe('conjugate-max-effort');
      expect(program?.title).toBe('Conjugate Max Effort');
      expect(program?.goal).toBe('muscle');
    });

    it('returns null for unknown slug', async () => {
      const program = await getProgramBySlug('does-not-exist');
      expect(program).toBeNull();
    });

    it('returns the correct program for each slug', async () => {
      const slugs = [
        'conjugate-max-effort',
        'hypertrophy-block',
        'metcon-inferno',
        'engine-builder',
        'foundation-strength',
        'power-athlete',
        'olympic-lifting-lab',
        'mobility-reset',
        'bulletproof-back',
      ];
      for (const slug of slugs) {
        const program = await getProgramBySlug(slug);
        expect(program).not.toBeNull();
        expect(program?.slug).toBe(slug);
      }
    });
  });

  describe('getProgramGoals', () => {
    it('returns all 5 unique goals', async () => {
      const goals = await getProgramGoals();
      expect(goals).toHaveLength(5);
      expect(goals).toContain('muscle');
      expect(goals).toContain('fat');
      expect(goals).toContain('fitness');
      expect(goals).toContain('athletic');
      expect(goals).toContain('rehab');
    });
  });
});
