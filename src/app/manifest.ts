import type { MetadataRoute } from 'next';

/**
 * IRONFORGE — PWA manifest
 *
 * Enables "Add to Home Screen" on mobile + basic PWA install.
 * Dark theme with accent orange icon.
 *
 * Reference: Skills KB §11 (SEO — manifest.ts).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IRONFORGE — Elite Strength & Conditioning Studio',
    short_name: 'IRONFORGE',
    description:
      'A private strength & conditioning studio for athletes who refuse average. Built by discipline. Forged in iron. NYC.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    categories: ['health', 'fitness', 'sports'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
