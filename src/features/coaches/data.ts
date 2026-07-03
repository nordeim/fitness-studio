/**
 * IRONFORGE — Static fallback data for coaches.
 *
 * 8 fully-detailed coaches. The "+16 more" CTA on the coaches section
 * points to the full roster page (future).
 */

export interface StaticCoach {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  certifications: string[] | null;
  specialties: string[] | null;
  signatureWorkout: string | null;
  portraitKey: string | null;
  yearsExp: number | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const STATIC_COACHES: ReadonlyArray<StaticCoach> = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    slug: 'marcus-steel',
    name: 'Marcus Steel',
    title: 'Head of Strength',
    bio: 'Former IPF Junior World Champion. 14 years coaching. Marcus coaches the conjugate system and handles every new member assessment.',
    certifications: ['NSCA-CSCS', 'FRC Mobility Specialist', 'USAW Level 2'],
    specialties: ['Hypertrophy', 'Powerlifting'],
    signatureWorkout: 'Conjugate Max Effort',
    portraitKey: 'https://picsum.photos/seed/coach-marcus-steel-portrait/600/800',
    yearsExp: 14,
    order: 0,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    slug: 'elena-volk',
    name: 'Elena Volk',
    title: 'Conditioning Lead',
    bio: 'Ex-national team rower. Built our MetCon and Engine Builder programs. Elena runs every Saturday morning conditioning cohort.',
    certifications: ['NSCA-CPT', 'CrossFit Level 3', 'USRowing Level 2'],
    specialties: ['Fat Loss', 'Conditioning'],
    signatureWorkout: 'MetCon Inferno',
    portraitKey: 'https://picsum.photos/seed/coach-elena-volk-portrait/600/800',
    yearsExp: 11,
    order: 1,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    slug: 'tank-williams',
    name: 'Tank Williams',
    title: 'Powerlifting Coach',
    bio: 'Elite raw powerlifter (825 deadlift at 110kg). Tank coaches the Power Athlete and Olympic Lifting Lab programs.',
    certifications: ['USAPL Club Coach', 'USAW Senior Coach'],
    specialties: ['Powerlifting', 'Athletic'],
    signatureWorkout: 'Conjugate Dynamic Effort',
    portraitKey: 'https://picsum.photos/seed/coach-tank-williams-portrait/600/800',
    yearsExp: 12,
    order: 2,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    slug: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Olympic Lifting Coach',
    bio: 'Ex-national weightlifter (69kg). Alex runs the Olympic Lifting Lab every Tuesday and Thursday evening.',
    certifications: ['USAW Advanced Sports Performance', 'FMS Level 2'],
    specialties: ['Olympic', 'Athletic'],
    signatureWorkout: 'Clean & Jerk Complex',
    portraitKey: 'https://picsum.photos/seed/coach-alex-rivera-portrait/600/800',
    yearsExp: 9,
    order: 3,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000005',
    slug: 'priya-shah',
    name: 'Priya Shah',
    title: 'Mobility Specialist',
    bio: 'Doctor of Physical Therapy. Priya built our Mobility Reset and Bulletproof Back programs after 8 years in sports rehab.',
    certifications: ['DPT', 'FRC Mobility Specialist', 'SFMA Level 2'],
    specialties: ['Rehab', 'Mobility'],
    signatureWorkout: 'Hip Capsule Mobility',
    portraitKey: 'https://picsum.photos/seed/coach-priya-shah-portrait/600/800',
    yearsExp: 8,
    order: 4,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000006',
    slug: 'jordan-blake',
    name: 'Jordan Blake',
    title: 'Hypertrophy Coach',
    bio: 'INBA Pro Card holder. Jordan runs the Hypertrophy Block program and the Sunday bodybuilding cohort.',
    certifications: ['NASM-CPT', 'PN Level 1 Nutrition', 'INBA Pro'],
    specialties: ['Hypertrophy', 'Nutrition'],
    signatureWorkout: 'Tension Time Under Load',
    portraitKey: 'https://picsum.photos/seed/coach-jordan-blake-portrait/600/800',
    yearsExp: 10,
    order: 5,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000007',
    slug: 'sam-okonkwo',
    name: 'Sam Okonkwo',
    title: 'Athletic Performance',
    bio: 'Ex-D1 sprinter (100m, 200m). Sam coaches the Power Athlete program for off-season field sport athletes.',
    certifications: ['USATF Level 2', 'NSCA-CSCS', 'EXOS Performance Specialist'],
    specialties: ['Athletic', 'Speed'],
    signatureWorkout: 'Acceleration Block',
    portraitKey: 'https://picsum.photos/seed/coach-sam-okonkwo-portrait/600/800',
    yearsExp: 7,
    order: 6,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'a1000000-0000-4000-8000-000000000008',
    slug: 'maya-chen',
    name: 'Maya Chen',
    title: 'Foundation Strength',
    bio: '10 years coaching beginners. Maya runs our Foundation Strength onboarding — every new member meets her in week 1.',
    certifications: ['SFG-II', 'FMS Level 2', 'Hardstyle Kettlebell'],
    specialties: ['Foundation', 'Kettlebell'],
    signatureWorkout: 'Hardstyle Swing',
    portraitKey: 'https://picsum.photos/seed/coach-maya-chen-portrait/600/800',
    yearsExp: 10,
    order: 7,
    published: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
