import { HeroReel } from '@/components/sections/hero/HeroReel';
import { ProgramsSection } from '@/components/sections/programs/ProgramsSection';
import { CoachesSection } from '@/components/sections/coaches/CoachesSection';
import { StoriesSection } from '@/components/sections/stories/StoriesSection';
import { BookingSection } from '@/components/sections/booking/BookingSection';
import { MembershipsSection } from '@/components/sections/memberships/MembershipsSection';

/**
 * IRONFORGE — Marketing home page.
 *
 * Section order (per Visual Strategy):
 *  1. Hero — brand attitude + coach team showcase (#hero)
 *  2. Programs — organized by goals (#programs)
 *  3. Coaches — professional background + certifications (#coaches)
 *  4. Stories — real transformation case studies (#stories)
 *  5. Booking — clear CTA + stat block + booking form (#booking)
 *  6. Memberships — 3 tiers + drop-in pack (#memberships)
 *
 * Programs, Coaches, and Stories are async Server Components that fetch
 * data via the queries module (DB-first with static fallback).
 */
export default async function HomePage() {
  return (
    <>
      <HeroReel />
      <ProgramsSection />
      <CoachesSection />
      <StoriesSection />
      <BookingSection />
      <MembershipsSection />
    </>
  );
}
