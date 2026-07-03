/**
 * IRONFORGE — Static fallback data for member transformation stories.
 *
 * 6 real-sounding transformation case studies. Quote text is fictional
 * but realistic. Phase 11 (Content polish) will replace with real
 * member stories (with consent).
 */

export interface StaticStory {
  id: string;
  slug: string;
  memberName: string;
  memberAge: number | null;
  programSlug: string | null;
  weeks: number | null;
  beforeKey: string | null;
  afterKey: string | null;
  quote: string;
  timeline: unknown;
  videoKey: string | null;
  published: boolean;
  createdAt: Date;
}

export const STATIC_STORIES: ReadonlyArray<StaticStory> = [
  {
    id: 'c1000000-0000-4000-8000-000000000001',
    slug: 'david-k',
    memberName: 'David K.',
    memberAge: 38,
    programSlug: 'conjugate-max-effort',
    weeks: 16,
    beforeKey: 'https://picsum.photos/seed/story-david-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-david-after/600/450',
    quote:
      'I walked in unable to deadlift 315. Sixteen weeks later I pulled 500 at 38 years old. Marcus rebuilt my technique from the floor up.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'c1000000-0000-4000-8000-000000000002',
    slug: 'sarah-m',
    memberName: 'Sarah M.',
    memberAge: 31,
    programSlug: 'metcon-inferno',
    weeks: 12,
    beforeKey: 'https://picsum.photos/seed/story-sarah-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-sarah-after/600/450',
    quote:
      'Lost 28 pounds in 12 weeks without touching a treadmill. Elena\'s MetCon is the hardest thing I\'ve ever done and the only thing that ever worked.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-07-01'),
  },
  {
    id: 'c1000000-0000-4000-8000-000000000003',
    slug: 'james-r',
    memberName: 'James R.',
    memberAge: 45,
    programSlug: 'bulletproof-back',
    weeks: 10,
    beforeKey: 'https://picsum.photos/seed/story-james-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-james-after/600/450',
    quote:
      'Two herniated discs and a surgeon telling me to stop lifting. Priya rebuilt my movement patterns. I\'m back to 405 deadlifts pain-free.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-08-01'),
  },
  {
    id: 'c1000000-0000-4000-8000-000000000004',
    slug: 'aisha-t',
    memberName: 'Aisha T.',
    memberAge: 27,
    programSlug: 'olympic-lifting-lab',
    weeks: 20,
    beforeKey: 'https://picsum.photos/seed/story-aisha-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-aisha-after/600/450',
    quote:
      'First session I couldn\'t snatch the empty bar. Twenty weeks with Alex and I qualified for a local meet. The technique work is unreal.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'c1000000-0000-4000-8000-000000000005',
    slug: 'marcus-l',
    memberName: 'Marcus L.',
    memberAge: 52,
    programSlug: 'hypertrophy-block',
    weeks: 14,
    beforeKey: 'https://picsum.photos/seed/story-marcus-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-marcus-after/600/450',
    quote:
      'At 52 I thought I was done building muscle. Jordan put 9 pounds of lean mass on me in 14 weeks. I\'m stronger now than at 30.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'c1000000-0000-4000-8000-000000000006',
    slug: 'elena-v',
    memberName: 'Elena V.',
    memberAge: 34,
    programSlug: 'power-athlete',
    weeks: 18,
    beforeKey: 'https://picsum.photos/seed/story-elena-before/600/450',
    afterKey: 'https://picsum.photos/seed/story-elena-after/600/450',
    quote:
      'Coming off a torn ACL, Sam rebuilt my acceleration and confidence. Ran my fastest 40 since college. The Power Athlete program is no joke.',
    timeline: null,
    videoKey: null,
    published: true,
    createdAt: new Date('2024-11-01'),
  },
];
