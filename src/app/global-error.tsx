'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';

/**
 * IRONFORGE — 500 Internal Server Error page.
 *
 * Must be a client component (Next.js error boundary requirement).
 * Shows the error + a "Try again" button that calls refresh().
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[IRONFORGE:500]', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container className="flex min-h-dvh flex-col items-center justify-center py-24">
          <div className="text-center">
            <SectionMarker className="justify-center">ERROR · 500</SectionMarker>

            <h1 className="mt-6 font-display text-[20vw] leading-[0.85] text-[var(--color-fg)] md:text-[14vw] lg:text-[12vw]">
              <span className="block text-stroke-accent">500</span>
            </h1>

            <p className="mt-8 max-w-md font-body text-base text-[var(--color-fg-dim)] md:text-lg">
              Something broke on our end. We&apos;re already on it — this is
              logged and will be fixed. Try again, or head back to safety.
            </p>

            {error.digest && (
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Error ID: {error.digest}
              </p>
            )}

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
              >
                Try Again →
              </button>
              <Link
                href="/"
                className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </body>
    </html>
  );
}
