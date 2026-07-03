import { Section } from '@/components/layout/Section';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { BookingCTA } from './BookingCTA';
import { StatBlock } from './StatBlock';
import { BookingForm } from '@/features/booking/BookingForm';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getCoaches } from '@/features/coaches/queries';

const STATS: ReadonlyArray<{
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
}> = [
  {
    value: 12,
    suffix: '+',
    label: 'Years Coaching',
    sublabel: 'EST. 2012',
  },
  {
    value: 2400,
    suffix: '+',
    label: 'Athletes Trained',
    sublabel: '1:1 + COHORTS',
  },
  {
    value: 48,
    label: 'Class Slots Weekly',
    sublabel: 'MON—SUN',
  },
  {
    value: 11,
    label: 'Avg. Transformation Weeks',
    sublabel: 'ACROSS 9 PROGRAMS',
  },
];

/**
 * BookingSection — full marketing section for the trial class CTA + form.
 *
 * Composition:
 *  - SectionMarker: "SECTION 05 / BOOKING"
 *  - StatBlock: 4 animated counters
 *  - BookingCTA: corner-bracket frame with pulsing CTA
 *  - BookingForm: multi-field intake form (below the CTA)
 *
 * The id="booking" anchor is what the StickyCTABar observes — when this
 * section enters viewport, the sticky bar slides away (avoid overlap).
 *
 * Async Server Component — fetches coaches for the preferred-coach dropdown.
 */
export async function BookingSection() {
  const coaches = await getCoaches();
  const coachOptions = coaches.map((c) => ({
    id: c.id,
    name: c.name,
    title: c.title,
  }));

  return (
    <Section id="booking" className="border-t border-[var(--color-border)]">
      <div className="mb-12 max-w-3xl">
        <SectionMarker>SECTION 05 / BOOKING</SectionMarker>
        <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          THE STANDARD
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          Twelve years. Two thousand four hundred athletes. Forty-eight class
          slots every week. One unrelenting standard.
        </p>
      </div>

      <ScrollReveal>
        <StatBlock stats={STATS} className="mb-16" />
      </ScrollReveal>

      <BookingCTA />

      <BookingForm coaches={coachOptions} />
    </Section>
  );
}
