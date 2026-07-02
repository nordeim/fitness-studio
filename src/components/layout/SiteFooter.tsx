import Link from 'next/link';
import { Container } from './Container';
import { SectionMarker } from './SectionMarker';

const FOOTER_NAV: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    title: 'Programs',
    links: [
      { href: '/#programs', label: 'Muscle Gain' },
      { href: '/#programs', label: 'Fat Loss' },
      { href: '/#programs', label: 'Athletic Perf.' },
      { href: '/#programs', label: 'Rehab / Mobility' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { href: '/#coaches', label: 'Coaches' },
      { href: '/#stories', label: 'Member Stories' },
      { href: '/#schedule', label: 'Schedule' },
      { href: '/about', label: 'About IRONFORGE' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: '/#booking', label: 'Book Trial' },
      { href: '/community', label: 'Newsletter' },
      { href: 'mailto:hello@ironforge.local', label: 'hello@ironforge.local' },
      { href: 'tel:+12125550100', label: '+1 (212) 555-0100' },
    ],
  },
];

/**
 * IRONFORGE SiteFooter — multi-column with newsletter + large display wordmark.
 *
 * Layout:
 *  - Top: 4-column grid (Brand | Programs | Studio | Connect)
 *  - Middle: Newsletter signup (email input + arrow button)
 *  - Bottom: Mono copyright + social links + large IRONFORGE display
 */
export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-darker)]">
      <Container>
        {/* Top — 4-column */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand column */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[var(--color-accent)]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black" aria-hidden="true">
                  <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
                </svg>
              </div>
              <div className="font-display text-2xl tracking-wider text-[var(--color-fg)]">
                IRONFORGE
              </div>
            </div>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-[var(--color-fg-dim)]">
              A private strength &amp; conditioning studio for athletes who refuse average.
              Built by discipline. Forged in iron.
            </p>
            <div className="mt-6">
              <SectionMarker>EST. 2012 · NYC</SectionMarker>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-heading text-sm tracking-wide text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-[var(--color-border)] py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMarker>JOIN THE LIFT</SectionMarker>
              <p className="mt-3 max-w-md font-body text-sm text-[var(--color-fg-dim)]">
                Weekly programming notes, coach interviews, and member transformations.
                No fluff.
              </p>
            </div>
            <form className="flex w-full max-w-md items-end gap-3">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                className="w-full border-0 border-b border-[var(--color-border-light)] bg-transparent py-3 font-heading text-base tracking-[0.04em] text-[var(--color-fg)] placeholder:font-mono placeholder:text-[0.7rem] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-hidden"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--color-accent)] text-black transition-colors hover:bg-[var(--color-accent-bright)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-darker)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M4 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom — copyright + large wordmark */}
        <div className="border-t border-[var(--color-border)] py-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              © {new Date().getFullYear()} IRONFORGE STRENGTH &amp; CONDITIONING · ALL RIGHTS RESERVED
            </p>
            <div className="flex gap-6">
              <Link
                href="/legal/privacy"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]"
              >
                Privacy
              </Link>
              <Link
                href="/legal/terms"
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]"
              >
                Terms
              </Link>
            </div>
          </div>
          <div
            className="mt-8 font-display leading-none text-[var(--color-bg-card-hover)]"
            style={{ fontSize: 'clamp(4rem, 18vw, 16rem)' }}
            aria-hidden="true"
          >
            IRONFORGE
          </div>
        </div>
      </Container>
    </footer>
  );
}
