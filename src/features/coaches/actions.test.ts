import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * M5 regression tests: Coach CRUD actions must validate `id` param as UUID.
 *
 * Currently updateCoach(id: string, ...), deleteCoach(id: string), and
 * toggleCoachPublished(id: string, ...) accept any string without Zod
 * validation. This is inconsistent with the project's "Zod on every public
 * input" pattern.
 *
 * These tests assert that invalid UUIDs are rejected with VALIDATION error
 * BEFORE any DB call is made.
 */

// Mock auth — return admin session (so we get past the auth check)
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'admin-id', role: 'admin', email: 'admin@test.com' },
  }),
}));

// Mock DB — chainable for insert/update/delete
vi.mock('@/lib/db/client', () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue(undefined) })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
    })),
    delete: vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) })),
  },
}));

vi.mock('@/lib/db/schema', () => ({
  coaches: { id: 'id', slug: 'slug' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

// Mock revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const { updateCoach, deleteCoach, toggleCoachPublished } = await import(
  '@/features/coaches/actions'
);
const { getMockCoachForm } = await import('@/features/coaches/domain/schemas');

describe('M5 regression: coach actions validate id as UUID', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const INVALID_IDS = [
    'not-a-uuid',
    '',
    '123',
    '00000000-0000-0000-0000-000000000001', // invalid v4 (version digit is 0, not 4)
    'gggggggg-gggg-gggg-gggg-gggggggggggg', // non-hex chars
  ];

  const VALID_UUID = 'a1000000-0000-4000-8000-000000000001';

  describe('updateCoach', () => {
    INVALID_IDS.forEach((invalidId) => {
      it(`rejects invalid id "${invalidId}" with VALIDATION error`, async () => {
        const result = await updateCoach(invalidId, getMockCoachForm());

        expect(result.success).toBe(false);
        expect(result.code).toBe('VALIDATION');
      });
    });

    it('accepts valid UUID (passes auth + validation, reaches DB)', async () => {
      const result = await updateCoach(VALID_UUID, getMockCoachForm());

      // Should not be a VALIDATION error — it should be SUCCESS or DB_ERROR
      expect(result.code).not.toBe('VALIDATION');
      expect(result.code).not.toBe('UNAUTHORIZED');
    });
  });

  describe('deleteCoach', () => {
    INVALID_IDS.forEach((invalidId) => {
      it(`rejects invalid id "${invalidId}" with VALIDATION error`, async () => {
        const result = await deleteCoach(invalidId);

        expect(result.success).toBe(false);
        expect(result.code).toBe('VALIDATION');
      });
    });

    it('accepts valid UUID', async () => {
      const result = await deleteCoach(VALID_UUID);
      expect(result.code).not.toBe('VALIDATION');
      expect(result.code).not.toBe('UNAUTHORIZED');
    });
  });

  describe('toggleCoachPublished', () => {
    INVALID_IDS.forEach((invalidId) => {
      it(`rejects invalid id "${invalidId}" with VALIDATION error`, async () => {
        const result = await toggleCoachPublished(invalidId, true);

        expect(result.success).toBe(false);
        expect(result.code).toBe('VALIDATION');
      });
    });

    it('accepts valid UUID', async () => {
      const result = await toggleCoachPublished(VALID_UUID, true);
      expect(result.code).not.toBe('VALIDATION');
      expect(result.code).not.toBe('UNAUTHORIZED');
    });
  });
});
