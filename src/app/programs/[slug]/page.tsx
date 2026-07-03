import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { getProgramBySlug } from '@/features/programs/queries';
import { STATIC_PROGRAMS } from '@/features/programs/data';

/**
 * IRONFORGE — Program detail page.
 *
 * Route: /programs/[slug]
 *
 * Renders a full program description: hero image, duration, intensity,
 * sessions/week, price, assigned coach. Falls back to 404 if the slug is
 * unknown or the program is unpublished.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_PROGRAMS.filter((p) => p.published).map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: 'Program Not Found' };
  }

  return {
    title: program.title,
    description: program.description.slice(0, 160),
    openGraph: {
      title: `${program.title} · IRONFORGE`,
      description: program.description.slice(0, 160),
      type: 'article',
    },
  };
}

const GOAL_LABELS: Record<string, string> = {
  muscle: 'Muscle Gain',
  fat: 'Fat Loss',
  fitness: 'General Fitness',
  athletic: 'Athletic Performance',
  rehab: 'Rehab / Mobility',
};

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <Container as="main" className="min-h-dvh pt-32 pb-24">
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/#programs"
            className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Back to Programs
          </Link>
        </nav>

        {/* Header */}
        <SectionMarker>PROGRAM · {GOAL_LABELS[program.goal] ?? program.goal}</SectionMarker>

        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          {program.title}
        </h1>

        {program.subtitle && (
          <p className="mt-4 font-body text-lg text-[var(--color-fg-dim)] md:text-xl">
            {program.subtitle}
          </p>
        )}

        {/* Hero image */}
        {program.heroKey && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-[var(--color-border)]">
            <Image
              src={program.heroKey}
              alt={program.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover grayscale"
            />
          </div>
        )}

        {/* Stats grid */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--color-border)] pt-10 md:grid-cols-4">
          {program.duration && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Duration
              </p>
              <p className="mt-2 font-heading text-xl uppercase text-[var(--color-fg)]">
                {program.duration}
              </p>
            </div>
          )}
          {program.sessionsPerWeek && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Sessions / Week
              </p>
              <p className="mt-2 font-heading text-xl uppercase text-[var(--color-fg)]">
                {program.sessionsPerWeek}
              </p>
            </div>
          )}
          {program.intensity && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Intensity
              </p>
              <p className="mt-2 font-heading text-xl uppercase text-[var(--color-fg)]">
                {program.intensity}
              </p>
            </div>
          )}
          {program.priceCents !== null && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Price
              </p>
              <p className="mt-2 font-heading text-xl uppercase text-[var(--color-accent)]">
                ${(program.priceCents / 100).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-10 border-t border-[var(--color-border)] pt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Overview
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-[var(--color-fg-dim)] md:text-lg">
            {program.description}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/#booking"
            className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
          >
            Book Trial Class →
          </Link>
          <Link
            href="/#memberships"
            className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            View Memberships
          </Link>
        </div>
      </article>
    </Container>
  );
}
