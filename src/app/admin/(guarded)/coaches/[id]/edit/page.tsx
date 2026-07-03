import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';

/**
 * IRONFORGE — Admin edit coach page (placeholder).
 *
 * Phase 9.5: full edit form (pre-filled from DB) — for now, shows a
 * placeholder with a link back to the coaches list.
 *
 * The edit form would be the same as the new form, but:
 *  1. Fetch the coach by ID (server component)
 *  2. Pre-fill the form fields
 *  3. Call updateCoach(id, data) instead of createCoach(data)
 */
export default async function AdminEditCoachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="py-16">
      <Link
        href="/admin/coaches"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]"
      >
        ← Back to Coaches
      </Link>

      <div className="mt-6">
        <SectionMarker>ADMIN · EDIT COACH</SectionMarker>
        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
          EDIT COACH
        </h1>
        <p className="mt-3 font-mono text-xs text-[var(--color-muted)]">
          ID: {id}
        </p>
      </div>

      <div className="mt-12 border border-dashed border-[var(--color-border-light)] py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Phase 9.5 — full edit form coming soon
        </p>
        <p className="mt-3 font-body text-sm text-[var(--color-fg-dim)]">
          The edit form mirrors the create form, pre-filled from the DB and
          calling <code className="font-mono text-[var(--color-accent)]">updateCoach(id, data)</code> instead of <code className="font-mono text-[var(--color-accent)]">createCoach(data)</code>.
        </p>
        <Link
          href="/admin/coaches/new"
          className="mt-6 inline-block font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]"
        >
          View Create Form →
        </Link>
      </div>
    </Container>
  );
}
