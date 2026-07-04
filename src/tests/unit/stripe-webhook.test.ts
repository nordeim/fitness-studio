import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Stripe webhook tests (Finding F-M3 — Medium).
 *
 * The webhook previously only logged events — it didn't write to the
 * `subscriptions` table. These tests verify the 3 handlers now persist data:
 *   - checkout.session.completed → insert subscription (idempotent)
 *   - customer.subscription.updated → update status + period + cancel flag
 *   - customer.subscription.deleted → mark canceled
 *
 * Also covers L5 fix: no `as unknown as` cast — access SDK fields directly
 * (Stripe SDK v22 uses snake_case: `cancel_at_period_end`, `items.data[0].current_period_end`).
 *
 * Mock strategy:
 *   - `@/lib/stripe` → mock `getStripe` + `getStripeWebhookSecret`
 *   - `@/lib/db/client` → chainable Drizzle builder mock
 *   - `@/lib/db/schema` → stub table refs
 *   - `stripe.webhooks.constructEvent` → returns canned events
 */

// ── Mocks ──

const mockConstructEvent = vi.fn();
vi.mock('@/lib/stripe', () => ({
  getStripe: vi.fn(() => ({
    webhooks: { constructEvent: mockConstructEvent },
  })),
  getStripeWebhookSecret: vi.fn(() => 'whsec_test'),
}));

// Chainable Drizzle mock — captures insert/update/select calls
const mockValues = vi.fn(() => ({ onConflictDoNothing: vi.fn().mockResolvedValue(undefined) }));
const mockInsert = vi.fn(() => ({ values: mockValues }));
const mockSet = vi.fn(() => ({ where: vi.fn().mockResolvedValue(undefined) }));
const mockUpdate = vi.fn(() => ({ set: mockSet }));
const mockLimit = vi.fn();
const mockWhereSelect = vi.fn(() => ({ limit: mockLimit }));
const mockFrom = vi.fn(() => ({ where: mockWhereSelect }));
const mockSelect = vi.fn(() => ({ from: mockFrom }));

// Helper to extract first call arg with proper typing (works around noUncheckedIndexedAccess)
function firstCallArg<T = unknown>(fn: { mock: { calls: unknown[][] } }): T {
  const calls = fn.mock.calls;
  if (calls.length === 0) throw new Error('Expected at least 1 call');
  return calls[0]![0] as T;
}

vi.mock('@/lib/db/client', () => ({
  db: {
    insert: mockInsert,
    update: mockUpdate,
    select: mockSelect,
  },
}));

vi.mock('@/lib/db/schema', () => ({
  subscriptions: { stripeSubscriptionId: 'stripe_subscription_id', id: 'id' },
  users: { email: 'email', id: 'id' },
}));

// Mock drizzle-orm eq
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((col, val) => ({ col, val })),
}));

const { POST } = await import('@/app/api/stripe/webhook/route');

// ── Helpers ──

function makeRequest(body: string, sig = 'sig_test'): Request {
  return new Request('https://test/api/stripe/webhook', {
    method: 'POST',
    body,
    headers: { 'stripe-signature': sig },
  });
}

function makeCheckoutEvent(overrides: Record<string, unknown> = {}): {
  type: string;
  data: { object: Record<string, unknown> };
} {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
        metadata: { tier: 'forge', priceId: 'price_test_123' },
        customer_details: { email: 'member@example.com' },
        ...overrides,
      },
    },
  };
}

function makeSubscriptionUpdatedEvent(overrides: Record<string, unknown> = {}): {
  type: string;
  data: { object: Record<string, unknown> };
} {
  return {
    type: 'customer.subscription.updated',
    data: {
      object: {
        id: 'sub_test_123',
        status: 'active',
        cancel_at_period_end: false,
        items: { data: [{ current_period_end: 1735689600 }] }, // 2025-01-01
        ...overrides,
      },
    },
  };
}

function makeSubscriptionDeletedEvent(): {
  type: string;
  data: { object: Record<string, unknown> };
} {
  return {
    type: 'customer.subscription.deleted',
    data: {
      object: {
        id: 'sub_test_123',
        status: 'canceled',
      },
    },
  };
}

// ── Tests ──

describe('Stripe webhook POST (F-M3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 503 when Stripe not configured', async () => {
    const { getStripe, getStripeWebhookSecret } = await import('@/lib/stripe');
    vi.mocked(getStripe).mockReturnValueOnce(null);
    vi.mocked(getStripeWebhookSecret).mockReturnValueOnce(null);
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(503);
  });

  it('returns 400 on missing stripe-signature header', async () => {
    const req = new Request('https://test/api/stripe/webhook', {
      method: 'POST',
      body: 'body',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 on invalid signature', async () => {
    mockConstructEvent.mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(400);
  });

  it('handles checkout.session.completed — inserts subscription when user found', async () => {
    // Mock user lookup to return a user
    mockLimit.mockResolvedValueOnce([
      { id: 'user-uuid-1', email: 'member@example.com' },
    ]);
    mockConstructEvent.mockReturnValueOnce(makeCheckoutEvent());

    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);

    // Verify DB insert was called
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockValues).toHaveBeenCalledTimes(1);
    // Verify the insert payload includes the expected fields
    const insertPayload = firstCallArg<{
      userId: string;
      stripeSubscriptionId: string;
      stripeCustomerId: string;
      stripePriceId: string;
      tier: string;
      status: string;
    }>(mockValues);
    expect(insertPayload.userId).toBe('user-uuid-1');
    expect(insertPayload.stripeSubscriptionId).toBe('sub_test_123');
    expect(insertPayload.stripeCustomerId).toBe('cus_test_123');
    expect(insertPayload.stripePriceId).toBe('price_test_123');
    expect(insertPayload.tier).toBe('forge');
    expect(insertPayload.status).toBe('active');
  });

  it('handles checkout.session.completed — skips insert when user not found (logs warning)', async () => {
    // Mock user lookup to return empty
    mockLimit.mockResolvedValueOnce([]);
    mockConstructEvent.mockReturnValueOnce(makeCheckoutEvent());

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No user found for email'),
    );
    consoleSpy.mockRestore();
  });

  it('handles checkout.session.completed — skips insert when customerEmail missing', async () => {
    mockConstructEvent.mockReturnValueOnce(
      makeCheckoutEvent({ customer_details: { email: null } }),
    );
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
    expect(mockInsert).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles customer.subscription.updated — updates status, periodEnd, cancelAtEnd (no cast)', async () => {
    mockConstructEvent.mockReturnValueOnce(makeSubscriptionUpdatedEvent());

    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);

    // Verify DB update was called
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledTimes(1);
    const updatePayload = firstCallArg<{ status: string; cancelAtPeriodEnd: boolean; currentPeriodEnd: unknown }>(mockSet);
    expect(updatePayload.status).toBe('active');
    expect(updatePayload.cancelAtPeriodEnd).toBe(false);
    // currentPeriodEnd should be a Date derived from items.data[0].current_period_end (1735689600s)
    expect(updatePayload.currentPeriodEnd).toBeInstanceOf(Date);
  });

  it('handles customer.subscription.deleted — marks subscription canceled', async () => {
    mockConstructEvent.mockReturnValueOnce(makeSubscriptionDeletedEvent());

    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const updatePayload = firstCallArg<{ status: string }>(mockSet);
    expect(updatePayload.status).toBe('canceled');
  });

  it('returns 200 for unhandled event types', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'invoice.paid',
      data: { object: {} },
    });
    const res = await POST(makeRequest('body'));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  it('source code must NOT contain `as unknown as` cast (L5 fix)', async () => {
    const { readFileSync } = await import('node:fs');
    const { resolve } = await import('node:path');
    const content = readFileSync(
      resolve(process.cwd(), 'src/app/api/stripe/webhook/route.ts'),
      'utf-8',
    );
    expect(content).not.toContain('as unknown as');
  });
});
