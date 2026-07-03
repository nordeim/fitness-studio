/**
 * IRONFORGE — Static fallback data for programs.
 *
 * Used when the database is unavailable (build time, dev without DB,
 * or DB connection failure). The queries module tries DB first, then
 * falls back to this static data.
 *
 * Phase 5: 9 programs across 5 goal categories.
 * Phase 8 will replace image URLs with R2-hosted AI-generated B&W noir
 * athletic photography.
 */

export interface StaticProgram {
  id: string;
  slug: string;
  goal: string;
  title: string;
  subtitle: string | null;
  description: string;
  duration: string | null;
  sessionsPerWeek: number | null;
  intensity: string | null;
  heroKey: string | null;
  priceCents: number | null;
  stripePriceId: string | null;
  coachId: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const STATIC_PROGRAMS: ReadonlyArray<StaticProgram> = [
  {
    id: 'b1000000-0000-4000-8000-000000000001',
    slug: 'conjugate-max-effort',
    goal: 'muscle',
    title: 'Conjugate Max Effort',
    subtitle: 'Westside-inspired strength block',
    description:
      'The conjugate system as taught by Marcus Steel. Two max-effort days, two dynamic-effort days per week. Rotate main lifts every 2 weeks to avoid adaptation. Built for intermediate-to-advanced lifters who have plateaued on linear progression.',
    duration: '12 weeks',
    sessionsPerWeek: 4,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-conjugate/800/600',
    priceCents: 24000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000001',
    order: 0,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000002',
    slug: 'hypertrophy-block',
    goal: 'muscle',
    title: 'Hypertrophy Block',
    subtitle: 'Volume-driven muscle accumulation',
    description:
      'Jordan Blake\'s signature 8-week hypertrophy block. High volume, controlled eccentrics, progressive overload on compound movements. Nutrition guidance included. Designed for lifters with at least 1 year of consistent training.',
    duration: '8 weeks',
    sessionsPerWeek: 5,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-hypertrophy/800/600',
    priceCents: 22000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000006',
    order: 1,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000003',
    slug: 'metcon-inferno',
    goal: 'fat',
    title: 'MetCon Inferno',
    subtitle: 'Metabolic conditioning for fat loss',
    description:
      'Elena Volk\'s hardest program. Six days per week of mixed-modal conditioning: rowing, kettlebell, bodyweight, and barbell complexes. No treadmills. No steady-state. Expect to lose 2-4 pounds per week if nutrition is dialed in.',
    duration: '6 weeks',
    sessionsPerWeek: 6,
    intensity: 'Peak',
    heroKey: 'https://picsum.photos/seed/forge-prog-metcon/800/600',
    priceCents: 26000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000002',
    order: 2,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000004',
    slug: 'engine-builder',
    goal: 'fat',
    title: 'Engine Builder',
    subtitle: 'Aerobic base construction',
    description:
      'Ten weeks of structured aerobic work: rowing, assault bike, ski erg. Elena builds your lactate threshold and VO2 max. Less intense than MetCon Inferno, but higher total volume. The foundation for all athletic performance.',
    duration: '10 weeks',
    sessionsPerWeek: 4,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-engine/800/600',
    priceCents: 20000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000002',
    order: 3,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000005',
    slug: 'foundation-strength',
    goal: 'fitness',
    title: 'Foundation Strength',
    subtitle: 'Beginner strength onboarding',
    description:
      'Maya Chen\'s 12-week onboarding program. Every new IRONFORGE member starts here. Learn the squat, hinge, press, and pull with proper form. Build a base of strength before advancing to specialized programs.',
    duration: '12 weeks',
    sessionsPerWeek: 3,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-foundation/800/600',
    priceCents: 18000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000008',
    order: 4,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000006',
    slug: 'power-athlete',
    goal: 'athletic',
    title: 'Power Athlete',
    subtitle: 'Off-season field sport performance',
    description:
      'Sam Okonkwo\'s 16-week off-season program for field sport athletes. Sprint mechanics, change of direction, explosive lifting, and conditioning. Built for athletes who need to be faster and more powerful next season.',
    duration: '16 weeks',
    sessionsPerWeek: 5,
    intensity: 'Off-season',
    heroKey: 'https://picsum.photos/seed/forge-prog-power-athlete/800/600',
    priceCents: 28000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000007',
    order: 5,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000007',
    slug: 'olympic-lifting-lab',
    goal: 'athletic',
    title: 'Olympic Lifting Lab',
    subtitle: 'Snatch + clean & jerk technique',
    description:
      'Alex Rivera\'s 8-week Olympic lifting lab. Two 90-minute sessions per week. Learn the snatch and clean & jerk from scratch, or refine your technique if you\'re already competing. Limited to 4 athletes per cohort.',
    duration: '8 weeks',
    sessionsPerWeek: 2,
    intensity: 'Peak',
    heroKey: 'https://picsum.photos/seed/forge-prog-olympic/800/600',
    priceCents: 30000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000004',
    order: 6,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000008',
    slug: 'mobility-reset',
    goal: 'rehab',
    title: 'Mobility Reset',
    subtitle: 'Joint health + movement quality',
    description:
      'Priya Shah\'s 6-week mobility program. Daily 20-minute sessions targeting hip, shoulder, and thoracic spine mobility. FRC-inspired. Built for lifters with stiff joints who want to train harder without injury.',
    duration: '6 weeks',
    sessionsPerWeek: 6,
    intensity: 'Off-season',
    heroKey: 'https://picsum.photos/seed/forge-prog-mobility/800/600',
    priceCents: 16000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000005',
    order: 7,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'b1000000-0000-4000-8000-000000000009',
    slug: 'bulletproof-back',
    goal: 'rehab',
    title: 'Bulletproof Back',
    subtitle: 'Spine health + posterior chain strength',
    description:
      'Priya Shah\'s 8-week program for lifters with back pain or herniated discs. Rebuilds the posterior chain, teaches proper bracing, and progressively loads the spine safely. Requires clearance from your PT.',
    duration: '8 weeks',
    sessionsPerWeek: 3,
    intensity: 'Build',
    heroKey: 'https://picsum.photos/seed/forge-prog-back/800/600',
    priceCents: 20000,
    stripePriceId: null,
    coachId: 'a1000000-0000-4000-8000-000000000005',
    order: 8,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
