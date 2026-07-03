import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { getStoryBySlug } from '@/features/stories/queries';
import { STATIC_STORIES } from '@/features/stories/data';

/**
 * IRONFORGE — Story detail page.
 *
 * Route: /stories/[slug]
 *
 * Renders a full member transformation story: before/after images, quote,
 * program duration, age. Falls back to 404 if the slug is unknown or the
 * story is unpublished.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_STORIES.filter((s) => s.published).map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return { title: 'Story Not Found' };
  }

  return {
    title: `${story.memberName}'s Transformation`,
    description: story.quote.slice(0, 160),
    openGraph: {
      title: `${story.memberName}'s Transformation · IRONFORGE`,
      description: story.quote.slice(0, 160),
      type: 'article',
    },
  };
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <Container as="main" className="min-h-dvh pt-32 pb-24">
      <article className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/#stories"
            className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            ← Back to Stories
          </Link>
        </nav>

        {/* Header */}
        <SectionMarker>TRANSFORMATION</SectionMarker>

        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-7xl">
          {story.memberName}
        </h1>

        {/* Meta line */}
        <div className="mt-4 flex flex-wrap gap-6 font-mono text-sm text-[var(--color-muted)]">
          {story.memberAge !== null && <span>AGE {story.memberAge}</span>}
          {story.weeks !== null && <span>{story.weeks} WEEKS</span>}
          {story.programSlug && (
            <Link
              href={`/programs/${story.programSlug}`}
              className="text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-bright)]"
            >
              {story.programSlug.replace(/-/g, ' ').toUpperCase()}
            </Link>
          )}
        </div>

        {/* Before / After */}
        {(story.beforeKey || story.afterKey) && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {story.beforeKey && (
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-border)]">
                  <Image
                    src={story.beforeKey}
                    alt={`${story.memberName} before — week 0`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover grayscale"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Before · Week 0
                </figcaption>
              </figure>
            )}
            {story.afterKey && (
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-border)]">
                  <Image
                    src={story.afterKey}
                    alt={`${story.memberName} after ${story.weeks ?? ''} weeks`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover grayscale"
                  />
                </div>
                <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  After · Week {story.weeks ?? '?'}
                </figcaption>
              </figure>
            )}
          </div>
        )}

        {/* Quote */}
        <blockquote className="mt-12 border-l-2 border-[var(--color-accent)] pl-6">
          <p className="font-body text-xl leading-relaxed text-[var(--color-fg)] md:text-2xl">
            &ldquo;{story.quote}&rdquo;
          </p>
          <footer className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            — {story.memberName}
          </footer>
        </blockquote>

        {/* CTA */}
        <div className="mt-12 border-t border-[var(--color-border)] pt-10">
          <p className="font-body text-base text-[var(--color-fg-dim)]">
            Ready to start your own transformation?
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#booking"
              className="bg-[var(--color-accent)] px-7 py-4 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
            >
              Book Trial Class →
            </Link>
            <Link
              href="/#programs"
              className="font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
            >
              View Programs
            </Link>
          </div>
        </div>
      </article>
    </Container>
  );
}
