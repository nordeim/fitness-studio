import type { Metadata } from 'next';
import { Bebas_Neue, Oswald, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

/**
 * IRONFORGE — Root layout.
 *
 * Loads all 4 brand fonts via `next/font/google` with the `variable` strategy
 * (zero layout shift, self-hosted by Next.js at build time).
 *
 * Reference: Skills KB §3 (typography scale).
 * Reference: Skills KB §4 (next/font setup).
 */

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap',
  preload: true,
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'IRONFORGE — Elite Strength & Conditioning Studio',
    template: '%s · IRONFORGE',
  },
  description:
    'A private strength & conditioning studio for athletes who refuse average. Built by discipline. Forged in iron. NYC.',
  keywords: [
    'fitness studio',
    'strength training',
    'conditioning',
    'powerlifting',
    'hypertrophy',
    'NYC fitness',
    'personal training',
    'ironforge',
  ],
  authors: [{ name: 'IRONFORGE' }],
  creator: 'IRONFORGE',
  publisher: 'IRONFORGE',
  openGraph: {
    title: 'IRONFORGE — Elite Strength & Conditioning Studio',
    description: 'Built by discipline. Forged in iron. 24 elite coaches. 9 programs. NYC.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IRONFORGE',
    url: 'http://localhost:3000',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'IRONFORGE — lightning bolt logo on pure black',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRONFORGE — Elite Strength & Conditioning Studio',
    description: 'Built by discipline. Forged in iron. 24 elite coaches. 9 programs. NYC.',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  category: 'health',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${oswald.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-textured antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-black focus:uppercase"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
