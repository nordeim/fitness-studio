/**
 * IRONFORGE — JSON-LD structured data components.
 *
 * Renders <script type="application/ld+json"> tags for search engine
 * rich results. Each function returns a JSON string for a specific
 * schema.org type.
 *
 * Reference: Skills KB §11 (SEO — JSON-LD).
 * Reference: Master Execution Plan §6.13 (JSON-LD HealthClub, Person, Course, Review).
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/**
 * HealthClub schema — for the home page.
 *
 * Rich results: Google Maps, local business panel.
 */
export function healthClubJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    name: 'IRONFORGE — Elite Strength & Conditioning Studio',
    description:
      'A private strength & conditioning studio for athletes who refuse average. Twenty-four elite coaches. Three training systems. One unrelenting standard.',
    url: BASE_URL,
    telephone: '+1-212-555-0100',
    email: 'hello@ironforge.local',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '47 Eastbound Alley',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7505,
      longitude: -73.9934,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '05:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '06:00',
        closes: '20:00',
      },
    ],
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
    },
    founder: {
      '@type': 'Person',
      name: 'Marcus Steel',
    },
    foundingDate: '2012',
    slogan: 'Built by discipline. Forged in iron.',
  });
}

/**
 * Person schema — for coach profile pages.
 */
export function coachJsonLd(coach: {
  name: string;
  title: string;
  bio: string;
  slug: string;
  portraitKey: string | null;
  certifications: string[] | null;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: coach.name,
    description: coach.bio,
    jobTitle: coach.title,
    url: `${BASE_URL}/coaches/${coach.slug}`,
    image: coach.portraitKey ?? undefined,
    knowsAbout: coach.certifications ?? [],
    worksFor: {
      '@type': 'Organization',
      name: 'IRONFORGE',
    },
  });
}

/**
 * Course schema — for program detail pages.
 */
export function programJsonLd(program: {
  title: string;
  description: string;
  slug: string;
  duration: string | null;
  priceCents: number | null;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    url: `${BASE_URL}/programs/${program.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'IRONFORGE',
      url: BASE_URL,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      courseWorkload: program.duration ?? undefined,
      location: {
        '@type': 'Place',
        name: 'IRONFORGE Studio',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '47 Eastbound Alley',
          addressLocality: 'New York',
          addressRegion: 'NY',
          postalCode: '10001',
          addressCountry: 'US',
        },
      },
    },
    offers: program.priceCents
      ? {
          '@type': 'Offer',
          price: (program.priceCents / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${BASE_URL}/#memberships`,
        }
      : undefined,
  });
}

/**
 * Review schema — for member story pages.
 */
export function storyJsonLd(story: {
  memberName: string;
  quote: string;
  slug: string;
  programSlug: string | null;
}): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: story.memberName,
    },
    reviewBody: story.quote,
    url: `${BASE_URL}/stories/${story.slug}`,
    itemReviewed: story.programSlug
      ? {
          '@type': 'Course',
          name: story.programSlug,
          url: `${BASE_URL}/programs/${story.programSlug}`,
        }
      : undefined,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
    publisher: {
      '@type': 'Organization',
      name: 'IRONFORGE',
    },
  });
}

/**
 * BreadcrumbList schema — for any page with breadcrumbs.
 */
export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; url: string }>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}
