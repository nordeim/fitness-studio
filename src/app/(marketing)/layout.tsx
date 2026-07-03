import { type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { GrainOverlay } from '@/components/layout/GrainOverlay';
import { StickyCTABar } from '@/components/layout/StickyCTABar';

/**
 * IRONFORGE — Marketing route group layout.
 *
 * Wraps every public-facing page with:
 *  - <GrainOverlay> — fixed SVG noise parallax
 *  - <SiteHeader> — fixed, backdrop-blur nav
 *  - <main> — page content
 *  - <SiteFooter> — multi-column brand footer
 *  - <StickyCTABar> — slides up after hero, hides at booking
 *  - <Toaster> — sonner toast notifications (for booking form, etc.)
 *
 * Auth-gated routes (/admin/*, /members/*) use their own layout group.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GrainOverlay />
      <SiteHeader />
      <main id="main-content" className="min-h-dvh">
        {children}
      </main>
      <SiteFooter />
      <StickyCTABar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-fg)',
            fontFamily: 'var(--font-body)',
          },
          classNames: {
            success: 'border-[var(--color-accent)]',
            error: 'border-red-500',
          },
        }}
      />
    </>
  );
}
