import { describe, it, expect } from 'vitest';
import { CheckoutRequestSchema } from './schemas';

/**
 * Membership domain schemas — Zod validation.
 */

describe('CheckoutRequestSchema', () => {
  it('valid tier (forge) passes', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
      tier: 'forge',
    });
    expect(result.success).toBe(true);
  });

  it('valid tier (forge_plus) passes', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
      tier: 'forge_plus',
    });
    expect(result.success).toBe(true);
  });

  it('valid tier (forge_private) passes', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
      tier: 'forge_private',
    });
    expect(result.success).toBe(true);
  });

  it('drop_in tier passes', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
      tier: 'drop_in',
    });
    expect(result.success).toBe(true);
  });

  it('invalid tier fails', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
      tier: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('missing tier fails', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: 'price_123',
    });
    expect(result.success).toBe(false);
  });

  it('missing priceId fails', () => {
    const result = CheckoutRequestSchema.safeParse({
      tier: 'forge',
    });
    expect(result.success).toBe(false);
  });

  it('empty priceId fails', () => {
    const result = CheckoutRequestSchema.safeParse({
      priceId: '',
      tier: 'forge',
    });
    expect(result.success).toBe(false);
  });
});
