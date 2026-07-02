import { SectionMarker } from '@/components/layout/SectionMarker';
import { Container } from '@/components/layout/Container';

/**
 * IRONFORGE — Phase 2 home placeholder.
 *
 * Phase 3 will replace this with the full hero reel. Phase 4 will add
 * the programs / coaches / stories / booking sections below.
 *
 * For now, this confirms the marketing layout renders correctly with
 * <SiteHeader>, <GrainOverlay>, <SiteFooter>, and <StickyCTABar>.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero placeholder — Phase 3 will replace with <HeroReel> */}
      <section
        id="hero"
        className="relative flex min-h-dvh flex-col justify-end px-6 pb-24 pt-32 lg:px-10"
      >
        <Container>
          <div className="max-w-5xl">
            <div className="mb-6">
              <SectionMarker>EST. 2012 · NYC</SectionMarker>
            </div>
            <h1 className="font-display text-[14vw] leading-[0.85] text-[var(--color-fg)] md:text-[10vw] lg:text-[8.5vw]">
              <span className="block">BUILT BY</span>
              <span className="block text-stroke">DISCIPLINE.</span>
              <span className="block">
                FORGED IN <span className="text-[var(--color-accent)]">IRON.</span>
              </span>
            </h1>
            <p className="mt-8 max-w-xl font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
              A private strength &amp; conditioning studio for athletes who refuse average.
              Twenty-four elite coaches. Three training systems. One unrelenting standard —{' '}
              <span className="text-[var(--color-fg)]">your transformation</span>.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              >
                Book Trial Class →
              </a>
              <a
                href="#programs"
                className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
              >
                View Programs
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Programs placeholder — Phase 4 will replace with <ProgramGrid> */}
      <section id="programs" className="border-t border-[var(--color-border)] py-20 md:py-32">
        <Container>
          <SectionMarker>SECTION 02 / PROGRAMS</SectionMarker>
          <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
            CHOOSE YOUR DISCIPLINE
          </h2>
          <p className="mt-4 max-w-2xl font-body text-base text-[var(--color-fg-dim)]">
            Phase 4 will render the program grid here. Each card flips to reveal
            methodology + coach + weekly schedule.
          </p>
        </Container>
      </section>

      {/* Booking placeholder — Phase 6 will replace with <BookingForm> */}
      <section id="booking" className="border-t border-[var(--color-border)] py-20 md:py-32">
        <Container>
          <SectionMarker>SECTION 05 / BOOKING</SectionMarker>
          <h2 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
            CLAIM YOUR FIRST SESSION
          </h2>
          <p className="mt-4 max-w-2xl font-body text-base text-[var(--color-fg-dim)]">
            Phase 6 will render the booking form here. Sticky CTA bar slides
            away when this section enters viewport.
          </p>
        </Container>
      </section>
    </>
  );
}
