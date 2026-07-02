import { type ReactNode } from 'react';
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
    </>
  );
}
