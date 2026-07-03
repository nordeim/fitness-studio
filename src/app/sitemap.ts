import type { MetadataRoute } from 'next';
import { STATIC_PROGRAMS } from '@/features/programs/data';
import { STATIC_COACHES } from '@/features/coaches/data';
import { STATIC_STORIES } from '@/features/stories/data';

/**
 * IRONFORGE — sitemap.xml
 *
 * Lists all public routes:
 *  - Home (/)
 *  - Programs list + 9 program detail pages
 *  - Coaches list + 8 coach profile pages
 *  - Stories list + 6 story pages
 *  - Booking confirmation
 *
 * Priority: home = 1.0, detail pages = 0.8, confirm = 0.3
 * Change frequency: weekly for lists, monthly for details
 *
 * Reference: Skills KB §11 (SEO — sitemap.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#programs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#coaches`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#stories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#memberships`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#booking`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking/confirm`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const programRoutes: MetadataRoute.Sitemap = STATIC_PROGRAMS.map((p) => ({
    url: `${baseUrl}/programs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const coachRoutes: MetadataRoute.Sitemap = STATIC_COACHES.map((c) => ({
    url: `${baseUrl}/coaches/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const storyRoutes: MetadataRoute.Sitemap = STATIC_STORIES.map((s) => ({
    url: `${baseUrl}/stories/${s.slug}`,
    lastModified: s.createdAt,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...coachRoutes, ...storyRoutes];
}
