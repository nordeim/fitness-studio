import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { getCoaches } from '@/features/coaches/queries';
import { getPrograms } from '@/features/programs/queries';
import { getStories } from '@/features/stories/queries';

/**
 * IRONFORGE — Admin dashboard.
 *
 * Shows counts of coaches, programs, stories + quick links to CRUD pages.
 * Async Server Component — fetches via queries module (DB-first with fallback).
 */
export default async function AdminDashboardPage() {
  const [coaches, programs, stories] = await Promise.all([
    getCoaches(),
    getPrograms(),
    getStories(),
  ]);

  const stats = [
    { label: 'Coaches', value: coaches.length, href: '/admin/coaches' },
    { label: 'Programs', value: programs.length, href: '/admin/coaches' },
    { label: 'Stories', value: stories.length, href: '/admin/coaches' },
    { label: 'Asset Gen', value: null, href: '/admin/assets/generate' },
  ];

  return (
    <Container className="py-16">
      <SectionMarker>ADMIN · DASHBOARD</SectionMarker>
      <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
        DASHBOARD
      </h1>

      {/* Stats grid */}
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-colors hover:border-[var(--color-accent)]"
          >
            <div className="font-display text-5xl text-[var(--color-fg)]">
              {stat.value ?? '→'}
            </div>
            <div className="mt-3 font-heading text-sm uppercase tracking-wider text-[var(--color-accent)]">
              {stat.label}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
              Manage →
            </div>
          </Link>
        ))}
      </div>

      {/* Recent trial requests placeholder */}
      <div className="mt-16">
        <h2 className="font-display text-3xl tracking-wide text-[var(--color-fg)]">
          RECENT TRIAL REQUESTS
        </h2>
        <div className="mt-6 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Phase 9.5 — trial request inbox coming soon
          </p>
          <p className="mt-2 font-body text-sm text-[var(--color-fg-dim)]">
            For now, trial requests are stored in the <code className="font-mono text-[var(--color-accent)]">trial_requests</code> table
            and notified via Inngest. Check the Inngest dev UI for event logs.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-16">
        <h2 className="font-display text-3xl tracking-wide text-[var(--color-fg)]">
          QUICK ACTIONS
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/admin/coaches/new"
            className="border border-[var(--color-border-light)] px-6 py-3 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            + New Coach
          </Link>
          <Link
            href="/admin/assets/generate"
            className="border border-[var(--color-border-light)] px-6 py-3 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Generate AI Asset
          </Link>
          <Link
            href="/"
            className="border border-[var(--color-border-light)] px-6 py-3 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            View Site →
          </Link>
        </div>
      </div>
    </Container>
  );
}
