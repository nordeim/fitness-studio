import { describe, it, expect, vi } from 'vitest';

/**
 * Story queries — DB-first with static fallback.
 */

vi.mock('@/lib/db/client', () => {
  throw new Error('DB unavailable');
});

vi.mock('@/lib/db/schema', () => ({
  stories: {},
  coaches: {},
  programs: {},
  classSlots: {},
}));

const { getStories, getStoryBySlug } = await import('@/features/stories/queries');

describe('story queries (DB unavailable → static fallback)', () => {
  describe('getStories', () => {
    it('returns all 6 stories', async () => {
      const stories = await getStories();
      expect(stories).toHaveLength(6);
    });

    it('each story has memberName, quote, programSlug', async () => {
      const stories = await getStories();
      stories.forEach((s) => {
        expect(s.memberName).toBeTruthy();
        expect(s.quote).toBeTruthy();
        expect(s.programSlug).toBeTruthy();
      });
    });

    it('stories have weeks > 0', async () => {
      const stories = await getStories();
      stories.forEach((s) => {
        expect(s.weeks).toBeGreaterThan(0);
      });
    });
  });

  describe('getStoryBySlug', () => {
    it('returns a story by slug', async () => {
      const story = await getStoryBySlug('david-k');
      expect(story).not.toBeNull();
      expect(story?.memberName).toBe('David K.');
      expect(story?.memberAge).toBe(38);
      expect(story?.weeks).toBe(16);
    });

    it('returns null for unknown slug', async () => {
      const story = await getStoryBySlug('does-not-exist');
      expect(story).toBeNull();
    });
  });
});
