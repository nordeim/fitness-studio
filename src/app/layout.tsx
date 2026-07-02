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
  ],
  authors: [{ name: 'IRONFORGE' }],
  openGraph: {
    title: 'IRONFORGE — Elite Strength & Conditioning Studio',
    description: 'Built by discipline. Forged in iron.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IRONFORGE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRONFORGE — Elite Strength & Conditioning Studio',
    description: 'Built by discipline. Forged in iron.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${oswald.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-textured antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-black"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
