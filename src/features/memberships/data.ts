/**
 * IRONFORGE — Membership tier data.
 *
 * 3 recurring tiers + 1 drop-in pack. Price IDs are placeholders —
 * Phase 11 (Content polish) creates real Stripe products and updates
 * these IDs via the admin UI or seed script.
 *
 * Reference: Master Execution Plan §6.9 — 3 membership tiers
 * (Forge / Forge+ / Forge Private) + drop-in class pack.
 */

export type TierId = 'forge' | 'forge_plus' | 'forge_private';
export type ProductId = TierId | 'drop_in';

export interface MembershipTier {
  id: TierId;
  name: string;
  tagline: string;
  priceMonthly: number; // USD
  priceCents: number; // for Stripe
  stripePriceId: string | null; // null until Stripe products created
  featured: boolean; // highlighted in the comparison
  features: ReadonlyArray<string>;
  limitations: ReadonlyArray<string>; // shown with ✕
  cta: string;
}

export interface DropInPack {
  id: 'drop_in';
  name: string;
  tagline: string;
  price: number; // USD
  priceCents: number;
  stripePriceId: string | null;
  description: string;
  cta: string;
}

export const MEMBERSHIP_TIERS: ReadonlyArray<MembershipTier> = [
  {
    id: 'forge',
    name: 'Forge',
    tagline: 'Foundation membership',
    priceMonthly: 149,
    priceCents: 14900,
    stripePriceId: null, // Set via admin after Stripe product creation
    featured: false,
    features: [
      '3 coached sessions per week',
      'Access to all 9 programs',
      'Weekly group conditioning class',
      'Movement screen onboarding',
      'In-body composition scan (quarterly)',
      'Mobile app workout tracking',
    ],
    limitations: [
      'No 1:1 coaching',
      'No priority class booking',
    ],
    cta: 'Choose Forge',
  },
  {
    id: 'forge_plus',
    name: 'Forge+',
    tagline: 'Most popular',
    priceMonthly: 249,
    priceCents: 24900,
    stripePriceId: null,
    featured: true,
    features: [
      '4 coached sessions per week',
      '1 monthly 1:1 coaching session',
      'Priority class booking (48h window)',
      'Custom program design',
      'Nutrition consultation (monthly)',
      'In-body scan (monthly)',
      'Recovery room access',
    ],
    limitations: ['No private coaching'],
    cta: 'Choose Forge+',
  },
  {
    id: 'forge_private',
    name: 'Forge Private',
    tagline: 'Elite 1:1',
    priceMonthly: 599,
    priceCents: 59900,
    stripePriceId: null,
    featured: false,
    features: [
      '2 private 1:1 sessions per week',
      'Dedicated head coach',
      'Custom periodized programming',
      'Weekly nutrition coaching',
      'Unlimited class access',
      'In-body scan (weekly)',
      'Recovery room + sauna access',
      'Priority on all new program launches',
    ],
    limitations: [],
    cta: 'Choose Forge Private',
  },
];

export const DROP_IN_PACK: DropInPack = {
  id: 'drop_in',
  name: 'Drop-In Pack',
  tagline: 'No commitment',
  price: 120,
  priceCents: 12000,
  stripePriceId: null,
  description: '5 class credits. Use anytime within 90 days. Perfect for trying IRONFORGE before committing to a membership.',
  cta: 'Buy Drop-In Pack',
};

export function getTierByPriceId(priceId: string): MembershipTier | null {
  return MEMBERSHIP_TIERS.find((t) => t.stripePriceId === priceId) ?? null;
}

export function getTierById(id: string): MembershipTier | null {
  return MEMBERSHIP_TIERS.find((t) => t.id === id) ?? null;
}
