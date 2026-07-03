import { describe, it, expect } from 'vitest';
import { TrialRequestSchema, getMockTrialRequest } from './schemas';

/**
 * TrialRequestSchema — Zod validation.
 *
 * Tests:
 *  - Valid input passes
 *  - Missing required fields fail
 *  - Invalid email fails
 *  - Name too short fails
 *  - Invalid goal enum fails
 *  - Invalid preferredTime enum fails
 *  - Consent false fails
 *  - Honeypot filled fails (spam detection)
 *  - Phone optional (empty string passes)
 *  - Notes optional + max 500 chars
 */

describe('TrialRequestSchema', () => {
  it('valid input passes', () => {
    const valid = getMockTrialRequest();
    const result = TrialRequestSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('missing name fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('name too short fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      name: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('name too long fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      name: 'A'.repeat(81),
    });
    expect(result.success).toBe(false);
  });

  it('missing email fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      email: '',
    });
    expect(result.success).toBe(false);
  });

  it('invalid email fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('invalid goal fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      goal: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('invalid preferredTime fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      preferredTime: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('consent false fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it('honeypot filled passes Zod (spam detection is in server action, not Zod)', () => {
    // The honeypot accepts any string at the Zod level — the server action
    // checks if it's non-empty and returns SPAM_DETECTED. This avoids
    // tipping off bots with a validation error on the honeypot field.
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      company_website: 'http://spam.example.com',
    });
    expect(result.success).toBe(true);
  });

  it('honeypot empty string passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      company_website: '',
    });
    expect(result.success).toBe(true);
  });

  it('phone optional — empty string passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      phone: '',
    });
    expect(result.success).toBe(true);
  });

  it('phone optional — undefined passes', () => {
    const { phone: _, ...withoutPhone } = getMockTrialRequest();
    void _;
    const result = TrialRequestSchema.safeParse(withoutPhone);
    expect(result.success).toBe(true);
  });

  it('notes optional — empty string passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      notes: '',
    });
    expect(result.success).toBe(true);
  });

  it('notes too long fails', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      notes: 'A'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('notes at exactly 500 chars passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      notes: 'A'.repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it('preferredCoachId must be a valid UUID if provided', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      preferredCoachId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('preferredCoachId with valid UUID passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      preferredCoachId: 'a1000000-0000-4000-8000-000000000001',
    });
    expect(result.success).toBe(true);
  });

  it('preferredCoachId null passes', () => {
    const result = TrialRequestSchema.safeParse({
      ...getMockTrialRequest(),
      preferredCoachId: null,
    });
    expect(result.success).toBe(true);
  });

  it('all 5 goal values are valid', () => {
    for (const goal of ['muscle', 'fat', 'fitness', 'athletic', 'rehab']) {
      const result = TrialRequestSchema.safeParse({
        ...getMockTrialRequest(),
        goal,
      });
      expect(result.success).toBe(true);
    }
  });

  it('all 4 preferredTime values are valid', () => {
    for (const preferredTime of ['early', 'mid', 'evening', 'weekend']) {
      const result = TrialRequestSchema.safeParse({
        ...getMockTrialRequest(),
        preferredTime,
      });
      expect(result.success).toBe(true);
    }
  });
});
