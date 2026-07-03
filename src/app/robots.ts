import type { MetadataRoute } from 'next';

/**
 * IRONFORGE — robots.txt
 *
 * Allows all crawlers to index all public routes.
 * Disallows /admin/* and /api/* (non-public routes).
 * Points to the sitemap.
 *
 * Reference: Skills KB §11 (SEO — robots.txt + sitemap.ts).
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/booking/confirm'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
