import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * trial-requested Inngest function tests (Finding F-M4 — Medium).
 *
 * The function previously stubbed all 3 steps with console.log — no real
 * email was sent. These tests verify the 2 email steps now call Resend
 * when configured, and fall back to console.log when not.
 *
 * Mock strategy:
 *   - `@/lib/email/resend` → mock getResend, isResendConfigured, getFromEmail, getCoachNotifyEmail
 *   - The Inngest `step.run` mock captures the step functions for direct invocation
 */

// Mock the Resend client module
const mockEmailsSend = vi.fn().mockResolvedValue({ id: 'email-1' });
vi.mock('@/lib/email/resend', () => ({
  getResend: vi.fn(() => ({
    emails: { send: mockEmailsSend },
  })),
  isResendConfigured: vi.fn(() => true),
  getFromEmail: vi.fn(() => 'noreply@ironforge.local'),
  getCoachNotifyEmail: vi.fn(() => 'coaches@ironforge.local'),
}));

// Mock the inngest client (createFunction should return a runnable)
vi.mock('@/lib/inngest/client', () => ({
  inngest: {
    createFunction: vi.fn((config, handler) => ({
      ...config,
      run: handler,
    })),
  },
}));

// Test event data (declared before the typed import so we can use `typeof`)
const mockEventData = {
  requestId: 'req-test-1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234',
  goal: 'muscle',
  preferredTime: 'early',
  preferredCoachId: null,
  notes: null,
};

const mockEvent = { data: mockEventData };

const { trialRequested } = (await import(
  '@/inngest/functions/trial-requested'
)) as unknown as {
  trialRequested: {
    run: (ctx: {
      event: { data: typeof mockEventData };
      step: {
        run: <T>(name: string, fn: () => Promise<T>) => Promise<T>;
      };
    }) => Promise<unknown>;
  };
};

// Mock step.run — captures step functions for direct invocation
function makeMockStep() {
  const calls: Array<{ name: string; fn: () => Promise<unknown> }> = [];
  return {
    run: vi.fn(async (name: string, fn: () => Promise<unknown>) => {
      calls.push({ name, fn });
      return fn();
    }),
    calls,
  };
}

describe('trial-requested Inngest function (F-M4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends coach notification email via Resend when configured', async () => {
    const mockStep = makeMockStep();
    await trialRequested.run({ event: mockEvent, step: mockStep as never });

    // Find the notify-coach step
    const coachCall = mockStep.calls.find((c) => c.name === 'notify-coach');
    expect(coachCall).toBeDefined();

    // The step already executed during run — Resend should have been called
    expect(mockEmailsSend).toHaveBeenCalled();

    // Verify the coach email payload
    const coachEmailCall = mockEmailsSend.mock.calls.find(
      (call) => (call[0] as { to?: string }).to === 'coaches@ironforge.local',
    );
    expect(coachEmailCall).toBeDefined();
    const payload = coachEmailCall![0] as {
      from: string;
      to: string;
      subject: string;
      text: string;
    };
    expect(payload.from).toBe('noreply@ironforge.local');
    expect(payload.to).toBe('coaches@ironforge.local');
    expect(payload.subject).toContain('John Doe');
    expect(payload.text).toContain('John Doe');
    expect(payload.text).toContain('john@example.com');
  });

  it('sends member confirmation email via Resend when configured', async () => {
    const mockStep = makeMockStep();
    await trialRequested.run({ event: mockEvent, step: mockStep as never });

    // Find the confirm-member email call
    const memberEmailCall = mockEmailsSend.mock.calls.find(
      (call) => (call[0] as { to?: string }).to === 'john@example.com',
    );
    expect(memberEmailCall).toBeDefined();
    const payload = memberEmailCall![0] as {
      from: string;
      to: string;
      subject: string;
      text: string;
    };
    expect(payload.from).toBe('noreply@ironforge.local');
    expect(payload.to).toBe('john@example.com');
    expect(payload.subject).toContain('IRONFORGE');
    expect(payload.text).toContain('John Doe');
    expect(payload.text).toContain('req-test-1');
  });

  it('falls back to console.log when Resend is not configured', async () => {
    const { isResendConfigured, getResend } = await import('@/lib/email/resend');
    vi.mocked(isResendConfigured).mockReturnValue(false);
    vi.mocked(getResend).mockReturnValue(null);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const mockStep = makeMockStep();
    await trialRequested.run({ event: mockEvent, step: mockStep as never });

    // Resend send should NOT have been called (for the new invocation)
    // Note: mockEmailsSend may have been called by previous tests, so we check
    // that console.log was called with the fallback message
    expect(consoleSpy).toHaveBeenCalled();
    const loggedText = consoleSpy.mock.calls.map((c) => String(c[0])).join(' ');
    expect(loggedText).toContain('Resend not configured');
    consoleSpy.mockRestore();
  });

  it('re-throws on Resend send failure (so Inngest retries)', async () => {
    // Re-establish the configured mock state (clearAllMocks resets implementations)
    const { isResendConfigured, getResend } = await import('@/lib/email/resend');
    vi.mocked(isResendConfigured).mockReturnValue(true);
    vi.mocked(getResend).mockReturnValue({
      emails: { send: mockEmailsSend },
    } as never);

    // Reset the send mock to reject
    mockEmailsSend.mockReset();
    mockEmailsSend.mockRejectedValueOnce(new Error('Resend API down'));

    const mockStep = makeMockStep();
    // The step.run wrapper calls fn() which throws — Inngest retries
    await expect(
      trialRequested.run({ event: mockEvent, step: mockStep as never }),
    ).rejects.toThrow('Resend API down');
  });
});
