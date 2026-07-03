import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';

/**
 * IRONFORGE — Booking confirmation page.
 *
 * Shown after a successful trial request submission (optional redirect
 * target — the form currently shows a toast and resets; this page is
 * for direct links or email click-throughs).
 */
export default function BookingConfirmPage() {
  return (
    <Container className="py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionMarker className="justify-center">STATUS · RECEIVED</SectionMarker>

        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          REQUEST RECEIVED
        </h1>

        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
          Your trial request is in. A coach will review it and reach out within
          24 hours to confirm your session time. Check your email for a
          confirmation message.
        </p>

        {/* Next-steps timeline */}
        <div className="mx-auto mt-12 max-w-md space-y-6 text-left">
          <div className="flex items-start gap-4">
            <div className="font-display text-2xl text-[var(--color-accent)]">01</div>
            <div>
              <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-fg)]">
                Request Received
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                NOW
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="font-display text-2xl text-[var(--color-muted)]">02</div>
            <div>
              <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-fg-dim)]">
                Coach Review
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                WITHIN 24 HOURS
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="font-display text-2xl text-[var(--color-muted)]">03</div>
            <div>
              <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-fg-dim)]">
                Trial Session
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                WITHIN 7 DAYS
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#programs"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Back to Programs
          </Link>
          <Link
            href="/#stories"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            Read Member Stories →
          </Link>
        </div>
      </div>
    </Container>
  );
}
