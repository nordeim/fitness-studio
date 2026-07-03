import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * submitTrialRequest — server action.
 *
 * Tests:
 *  - Valid input returns success
 *  - Invalid input returns VALIDATION error
 *  - Honeypot filled returns SPAM_DETECTED
 *  - Missing consent returns VALIDATION error
 *
 * Mocks:
 *  - rateLimitBooking → always returns { success: true }
 *  - DB dynamic import → throws (simulates no DB)
 *  - Inngest dynamic import → returns mock send
 */

// Mock rate limiter (no Redis in test env)
vi.mock('@/lib/ratelimit', () => ({
  rateLimitBooking: vi.fn().mockResolvedValue({ success: true, limit: 5, remaining: 4 }),
}));

// Mock the DB dynamic import — simulate DB unavailable (falls back gracefully)
vi.mock('@/lib/db/client', () => {
  throw new Error('DB unavailable in test');
});

vi.mock('@/lib/db/schema', () => ({
  trialRequests: {},
}));

// Mock Inngest client
const mockInngestSend = vi.fn().mockResolvedValue({ ids: ['event-1'] });
vi.mock('@/lib/inngest/client', () => ({
  inngest: {
    send: mockInngestSend,
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue('127.0.0.1'),
  }),
}));

const { submitTrialRequest } = await import('@/features/booking/actions');
const { getMockTrialRequest } = await import('@/features/booking/domain/schemas');

describe('submitTrialRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('valid input returns success', async () => {
    const result = await submitTrialRequest(getMockTrialRequest());

    expect(result.success).toBe(true);
    expect(result.code).toBe('SUCCESS');
    expect(result.requestId).not.toBeNull();
    expect(result.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('fires Inngest event on success', async () => {
    await submitTrialRequest(getMockTrialRequest());

    expect(mockInngestSend).toHaveBeenCalledTimes(1);
    const call = mockInngestSend.mock.calls[0]![0];
    expect(call.name).toBe('trial.requested');
    expect(call.data.name).toBe('John Doe');
    expect(call.data.email).toBe('john@example.com');
    expect(call.data.goal).toBe('muscle');
  });

  it('invalid input returns VALIDATION error', async () => {
    const result = await submitTrialRequest({
      ...getMockTrialRequest(),
      email: 'not-an-email',
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('VALIDATION');
    expect(result.requestId).toBeNull();
  });

  it('missing name returns VALIDATION error', async () => {
    const result = await submitTrialRequest({
      ...getMockTrialRequest(),
      name: '',
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('VALIDATION');
  });

  it('consent false returns VALIDATION error', async () => {
    const result = await submitTrialRequest({
      ...getMockTrialRequest(),
      consent: false,
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('VALIDATION');
  });

  it('honeypot filled returns SPAM_DETECTED', async () => {
    const result = await submitTrialRequest({
      ...getMockTrialRequest(),
      company_website: 'http://spam.com',
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe('SPAM_DETECTED');
  });

  it('succeeds even when DB is unavailable (graceful fallback)', async () => {
    // DB mock already throws — verify the action still succeeds
    const result = await submitTrialRequest(getMockTrialRequest());

    expect(result.success).toBe(true);
    expect(result.code).toBe('SUCCESS');
  });

  it('succeeds even when Inngest is unavailable (graceful fallback)', async () => {
    // Make Inngest throw
    mockInngestSend.mockRejectedValueOnce(new Error('Inngest down'));

    const result = await submitTrialRequest(getMockTrialRequest());

    // Should still succeed — Inngest failure is non-blocking
    expect(result.success).toBe(true);
    expect(result.code).toBe('SUCCESS');
  });

  it('returns RATE_LIMITED when rate limit is hit', async () => {
    const { rateLimitBooking } = await import('@/lib/ratelimit');
    vi.mocked(rateLimitBooking).mockResolvedValueOnce({ success: false, limit: 5, remaining: 0 });

    const result = await submitTrialRequest(getMockTrialRequest());

    expect(result.success).toBe(false);
    expect(result.code).toBe('RATE_LIMITED');
    expect(result.requestId).toBeNull();
  });

  it('generates a unique requestId for each submission', async () => {
    const result1 = await submitTrialRequest(getMockTrialRequest({ email: 'a@example.com' }));
    const result2 = await submitTrialRequest(getMockTrialRequest({ email: 'b@example.com' }));

    expect(result1.requestId).not.toBe(result2.requestId);
  });
});
