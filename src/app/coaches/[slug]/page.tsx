import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { getCoachBySlug } from '@/features/coaches/queries';
import { STATIC_COACHES } from '@/features/coaches/data';

/**
 * IRONFORGE — Coach detail page.
 *
 * Route: /coaches/[slug]
 *
 * Renders a full coach profile: portrait, bio, certifications, specialties,
 * signature workout. Falls back to 404 if the slug is unknown or the coach
 * is unpublished.
 *
 * generateStaticParams pre-renders all published coaches at build time.
 * generateMetadata provides per-coach SEO metadata.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_COACHES.filter((c) => c.published).map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) {
    return { title: 'Coach Not Found' };
  }

  return {
    title: `${coach.name} — ${coach.title}`,
    description: coach.bio.slice(0, 160),
    openGraph: {
      title: `${coach.name} — ${coach.title} · IRONFORGE`,
      description: coach.bio.slice(0, 160),
      type: 'profile',
    },
  };
}

export default async function CoachDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) {
    notFound();
  }

  return (
    <Container as="main" className="min-h-dvh pt-32 pb-24">
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/#coaches"
            className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Back to Coaches
          </Link>
        </nav>

        {/* Header */}
        <SectionMarker>COACH PROFILE</SectionMarker>

        <div className="mt-6 grid gap-10 md:grid-cols-[280px_1fr]">
          {/* Portrait */}
          <div className="relative aspect-[3/4] overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            {coach.portraitKey ? (
              <Image
                src={coach.portraitKey}
                alt={`${coach.name}, ${coach.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover grayscale"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {coach.title}
            </p>
            <h1 className="mt-2 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
              {coach.name}
            </h1>

            {coach.yearsExp !== null && (
              <p className="mt-4 font-mono text-sm text-[var(--color-muted)]">
                {coach.yearsExp} years coaching
              </p>
            )}

            <p className="mt-6 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
              {coach.bio}
            </p>

            {/* Specialties */}
            {coach.specialties && coach.specialties.length > 0 && (
              <div className="mt-8">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Specialties
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {coach.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="border border-[var(--color-border-light)] px-3 py-1 font-heading text-xs uppercase tracking-[0.15em] text-[var(--color-fg-dim)]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {coach.certifications && coach.certifications.length > 0 && (
              <div className="mt-6">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Certifications
                </h2>
                <ul className="mt-3 space-y-1">
                  {coach.certifications.map((cert) => (
                    <li
                      key={cert}
                      className="font-body text-sm text-[var(--color-fg-dim)]"
                    >
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signature Workout */}
            {coach.signatureWorkout && (
              <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Signature Workout
                </h2>
                <p className="mt-2 font-heading text-lg uppercase tracking-wide text-[var(--color-accent)]">
                  {coach.signatureWorkout}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/#booking"
                className="inline-block bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
              >
                Book Trial with {coach.name.split(' ')[0]} →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Container>
  );
}
