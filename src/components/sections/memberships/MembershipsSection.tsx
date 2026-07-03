import { Section } from '@/components/layout/Section';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { MembershipTierComparison } from './MembershipTierComparison';

/**
 * MembershipsSection — full marketing section for membership tiers.
 *
 * Composition:
 *  - SectionMarker: "SECTION 06 / MEMBERSHIPS"
 *  - Heading: "CHOOSE YOUR COMMITMENT"
 *  - Subhead: body copy
 *  - MembershipTierComparison: 3 tiers + drop-in pack
 *
 * The id="memberships" is used by the BookingCTA "View Schedule" link
 * and for future deep-linking.
 */
export function MembershipsSection() {
  return (
    <Section id="memberships" className="border-t border-[var(--color-border)]">
      <div className="mb-12 max-w-3xl">
        <SectionMarker>SECTION 06 / MEMBERSHIPS</SectionMarker>
        <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          CHOOSE YOUR COMMITMENT
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          Three membership tiers built around how you train. Every tier includes
          access to all 9 programs, certified coaching, and the IRONFORGE
          community. Cancel anytime — no long-term contracts.
        </p>
      </div>

      <MembershipTierComparison />
    </Section>
  );
}
