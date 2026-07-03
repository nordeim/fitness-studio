import { describe, it, expect, vi } from 'vitest';

/**
 * Coach queries — DB-first with static fallback.
 */

vi.mock('@/lib/db/client', () => {
  throw new Error('DB unavailable');
});

vi.mock('@/lib/db/schema', () => ({
  coaches: {},
  programs: {},
  stories: {},
  classSlots: {},
}));

const { getCoaches, getCoachBySlug } = await import('@/features/coaches/queries');

describe('coach queries (DB unavailable → static fallback)', () => {
  describe('getCoaches', () => {
    it('returns all 8 coaches', async () => {
      const coaches = await getCoaches();
      expect(coaches).toHaveLength(8);
    });

    it('coaches are ordered by `order` field', async () => {
      const coaches = await getCoaches();
      for (let i = 1; i < coaches.length; i++) {
        expect(coaches[i]!.order).toBeGreaterThanOrEqual(coaches[i - 1]!.order);
      }
    });

    it('each coach has name, title, slug, bio', async () => {
      const coaches = await getCoaches();
      coaches.forEach((c) => {
        expect(c.name).toBeTruthy();
        expect(c.title).toBeTruthy();
        expect(c.slug).toBeTruthy();
        expect(c.bio).toBeTruthy();
      });
    });
  });

  describe('getCoachBySlug', () => {
    it('returns a coach by slug', async () => {
      const coach = await getCoachBySlug('marcus-steel');
      expect(coach).not.toBeNull();
      expect(coach?.name).toBe('Marcus Steel');
      expect(coach?.title).toBe('Head of Strength');
    });

    it('returns null for unknown slug', async () => {
      const coach = await getCoachBySlug('does-not-exist');
      expect(coach).toBeNull();
    });

    it('returns certifications array for known coaches', async () => {
      const coach = await getCoachBySlug('priya-shah');
      expect(coach).not.toBeNull();
      expect(coach?.certifications).not.toBeNull();
      expect(coach?.certifications).toContain('DPT');
    });
  });
});
