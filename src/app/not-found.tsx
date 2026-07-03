import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';

/**
 * IRONFORGE — 404 Not Found page.
 *
 * Branded with IRONFORGE aesthetic. Shows the error code as massive
 * display text + suggested next actions.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-dvh flex-col items-center justify-center py-24">
      <div className="text-center">
        <SectionMarker className="justify-center">ERROR · 404</SectionMarker>

        <h1 className="mt-6 font-display text-[20vw] leading-[0.85] text-[var(--color-fg)] md:text-[14vw] lg:text-[12vw]">
          <span className="block text-stroke">404</span>
        </h1>

        <p className="mt-8 max-w-md font-body text-base text-[var(--color-fg-dim)] md:text-lg">
          This page doesn&apos;t exist. Like a skipped rep, it&apos;s behind you.
          Pick a direction and get back to work.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
          >
            ← Back to Home
          </Link>
          <Link
            href="/#programs"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            View Programs
          </Link>
          <Link
            href="/#booking"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            Book Trial →
          </Link>
        </div>
      </div>
    </Container>
  );
}
