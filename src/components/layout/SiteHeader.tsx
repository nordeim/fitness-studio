'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Container } from './Container';
import { MobileNavSheet } from './MobileNavSheet';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/#programs', label: 'Programs' },
  { href: '/#coaches', label: 'Coaches' },
  { href: '/#stories', label: 'Stories' },
  { href: '/#booking', label: 'Contact' },
];

/**
 * IRONFORGE SiteHeader — fixed, backdrop-blur, brand lockup.
 *
 * Behaviors:
 *  - Transparent over hero, darkens with backdrop-blur on scroll
 *  - Desktop nav (hidden md:flex) on the right; symmetrical mobile trigger (md:hidden)
 *  - Logo lockup: orange bolt + Bebas wordmark + mono tagline
 *  - Location pin (right) + silver "Book Trial" button
 *  - Mobile menu via MobileNavSheet (Radix Dialog side="right")
 *
 * Reference: Skills KB §7 (Mobile navigation debugging — symmetrical breakpoints).
 */
export function SiteHeader() {
  const scrolled = useScrolled(10);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-sticky)] border-b transition-colors duration-[var(--dur-standard)]',
        scrolled
          ? 'border-white/5 bg-black/70 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between py-4">
          {/* Logo lockup */}
          <Link href="/" className="group flex items-center gap-3" aria-label="IRONFORGE home">
            <div className="relative flex h-9 w-9 items-center justify-center bg-[var(--color-accent)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black" aria-hidden="true">
                <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
              </svg>
              <div className="absolute -inset-1 border border-[var(--color-accent)] opacity-0 transition-opacity duration-[var(--dur-micro)] group-hover:opacity-100" />
            </div>
            <div className="leading-none">
              <div className="font-display text-2xl tracking-wider text-[var(--color-fg)]">
                IRONFORGE
              </div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[0.3em] text-[var(--color-muted)]">
                STRENGTH · COMMUNITY
              </div>
            </div>
          </Link>

          {/* Desktop nav — hidden md:flex (symmetrical with md:hidden on trigger) */}
          <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute -left-3.5 top-1/2 h-1 w-1 -translate-y-1/2 scale-y-0 bg-[var(--color-accent)] transition-transform duration-[var(--dur-micro)] group-hover:scale-y-100"
                />
              </Link>
            ))}
          </nav>

          {/* Right side — location + CTA + mobile trigger */}
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-2 font-mono text-[11px] text-[var(--color-muted)] md:flex">
              <span aria-hidden="true" className="text-[var(--color-accent)]">
                ◆
              </span>
              <span>47 EASTBOUND ALLEY · NYC</span>
            </div>
            <Link
              href="/#booking"
              className="hidden bg-[var(--color-silver)] px-5 py-2.5 font-heading text-xs uppercase tracking-[0.2em] text-black transition-colors hover:bg-white sm:inline-block"
            >
              Book Trial
            </Link>

            {/* Mobile trigger — md:hidden (symmetrical with desktop nav) */}
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center text-[var(--color-fg)] hover:bg-white/[0.04] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <MobileNavSheet open={mobileOpen} onOpenChange={setMobileOpen} items={NAV_ITEMS} />
    </header>
  );
}
