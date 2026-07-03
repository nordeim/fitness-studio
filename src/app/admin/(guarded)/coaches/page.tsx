import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { getCoaches } from '@/features/coaches/queries';

/**
 * IRONFORGE — Admin coaches list.
 *
 * Shows all coaches with edit/publish/delete actions.
 * Async Server Component — fetches via queries module.
 */
export default async function AdminCoachesPage() {
  const coaches = await getCoaches();

  return (
    <Container className="py-16">
      <div className="flex items-center justify-between">
        <div>
          <SectionMarker>ADMIN · COACHES</SectionMarker>
          <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
            COACHES
          </h1>
        </div>
        <Link
          href="/admin/coaches/new"
          className="bg-[var(--color-accent)] px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[var(--color-accent-bright)]"
        >
          + New Coach
        </Link>
      </div>

      {/* Coaches table */}
      <div className="mt-12 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left">
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Order
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Name
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Title
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Slug
              </th>
              <th className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Status
              </th>
              <th className="py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach) => (
              <tr
                key={coach.id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-card)]"
              >
                <td className="py-4 pr-4 font-mono text-xs text-[var(--color-muted)]">
                  {String(coach.order).padStart(2, '0')}
                </td>
                <td className="py-4 pr-4 font-heading text-sm text-[var(--color-fg)]">
                  {coach.name}
                </td>
                <td className="py-4 pr-4 font-body text-sm text-[var(--color-fg-dim)]">
                  {coach.title}
                </td>
                <td className="py-4 pr-4 font-mono text-xs text-[var(--color-muted)]">
                  {coach.slug}
                </td>
                <td className="py-4 pr-4">
                  {coach.published ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                      ● Published
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                      ○ Draft
                    </span>
                  )}
                </td>
                <td className="py-4">
                  <Link
                    href={`/admin/coaches/${coach.id}/edit`}
                    className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coaches.length === 0 && (
        <div className="mt-12 border border-dashed border-[var(--color-border-light)] py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            No coaches yet
          </p>
          <Link
            href="/admin/coaches/new"
            className="mt-4 inline-block font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]"
          >
            Create your first coach →
          </Link>
        </div>
      )}
    </Container>
  );
}
