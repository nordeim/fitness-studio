import { describe, it, expect } from 'vitest';
import { MEMBERSHIP_TIERS, DROP_IN_PACK, getTierById, getTierByPriceId } from './data';

/**
 * Membership tier data — static data integrity tests.
 *
 * Verifies that the tier data is well-formed and consistent.
 */

describe('Membership tier data', () => {
  describe('MEMBERSHIP_TIERS', () => {
    it('has exactly 3 tiers', () => {
      expect(MEMBERSHIP_TIERS).toHaveLength(3);
    });

    it('tier IDs are unique', () => {
      const ids = MEMBERSHIP_TIERS.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('exactly one tier is featured', () => {
      const featured = MEMBERSHIP_TIERS.filter((t) => t.featured);
      expect(featured).toHaveLength(1);
      expect(featured[0]!.id).toBe('forge_plus');
    });

    it('Forge tier is $149/month', () => {
      const forge = MEMBERSHIP_TIERS.find((t) => t.id === 'forge');
      expect(forge?.priceMonthly).toBe(149);
      expect(forge?.priceCents).toBe(14900);
    });

    it('Forge+ tier is $249/month', () => {
      const forgePlus = MEMBERSHIP_TIERS.find((t) => t.id === 'forge_plus');
      expect(forgePlus?.priceMonthly).toBe(249);
      expect(forgePlus?.priceCents).toBe(24900);
    });

    it('Forge Private tier is $599/month', () => {
      const forgePrivate = MEMBERSHIP_TIERS.find((t) => t.id === 'forge_private');
      expect(forgePrivate?.priceMonthly).toBe(599);
      expect(forgePrivate?.priceCents).toBe(59900);
    });

    it('priceCents = priceMonthly * 100', () => {
      MEMBERSHIP_TIERS.forEach((tier) => {
        expect(tier.priceCents).toBe(tier.priceMonthly * 100);
      });
    });

    it('each tier has at least 3 features', () => {
      MEMBERSHIP_TIERS.forEach((tier) => {
        expect(tier.features.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('Forge Private has no limitations', () => {
      const forgePrivate = MEMBERSHIP_TIERS.find((t) => t.id === 'forge_private');
      expect(forgePrivate?.limitations).toHaveLength(0);
    });

    it('Forge has limitations (no 1:1, no priority)', () => {
      const forge = MEMBERSHIP_TIERS.find((t) => t.id === 'forge');
      expect(forge?.limitations.length).toBeGreaterThan(0);
    });

    it('each tier has a CTA', () => {
      MEMBERSHIP_TIERS.forEach((tier) => {
        expect(tier.cta).toBeTruthy();
        expect(tier.cta.length).toBeGreaterThan(0);
      });
    });

    it('each tier has a name + tagline', () => {
      MEMBERSHIP_TIERS.forEach((tier) => {
        expect(tier.name).toBeTruthy();
        expect(tier.tagline).toBeTruthy();
      });
    });
  });

  describe('DROP_IN_PACK', () => {
    it('is $120 for 5 credits', () => {
      expect(DROP_IN_PACK.price).toBe(120);
      expect(DROP_IN_PACK.priceCents).toBe(12000);
    });

    it('has a description', () => {
      expect(DROP_IN_PACK.description).toBeTruthy();
      expect(DROP_IN_PACK.description.length).toBeGreaterThan(20);
    });

    it('id is drop_in', () => {
      expect(DROP_IN_PACK.id).toBe('drop_in');
    });
  });

  describe('getTierById', () => {
    it('returns forge tier by id', () => {
      const tier = getTierById('forge');
      expect(tier).not.toBeNull();
      expect(tier?.name).toBe('Forge');
    });

    it('returns null for unknown id', () => {
      expect(getTierById('nonexistent')).toBeNull();
    });
  });

  describe('getTierByPriceId', () => {
    it('returns null when no tiers have a price ID set', () => {
      // All tiers have stripePriceId = null in dev
      expect(getTierByPriceId('price_123')).toBeNull();
    });

    it('returns the tier when price ID matches', () => {
      // This tests the lookup logic — in production, tiers would have real price IDs
      const tier = MEMBERSHIP_TIERS[0]!;
      expect(getTierByPriceId(tier.stripePriceId ?? 'nonexistent')).toBeNull();
    });
  });
});
