import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { AdminSessionProvider } from '@/components/AdminSessionProvider';
import { Container } from '@/components/layout/Container';

/**
 * IRONFORGE — Admin layout (Server Component).
 *
 * Guards every /admin/* route (except /admin/login which has its own layout):
 *  1. getServerSession() — if no session, redirect to /admin/login
 *  2. Check session.user.role === 'admin' — if not admin, redirect to /admin/login
 *     with an error message
 *
 * The layout renders:
 *  - Admin nav bar (links: Dashboard, Coaches, Programs, Stories, Asset Gen, Sign Out)
 *  - The page content
 *
 * Reference: Skills KB §12 (Auth-First Server Action pattern — adapted for layout).
 * Reference: T2 lesson — trustHost:true means auth() works at edge.
 */

// Admin nav items
const ADMIN_NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/coaches', label: 'Coaches' },
  { href: '/admin/assets/generate', label: 'Asset Gen' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // 1. No session → redirect to login
  if (!session?.user) {
    redirect('/admin/login');
  }

  // 2. Not admin → redirect to login with error
  const role = (session.user as { role?: string }).role;
  if (role !== 'admin') {
    redirect('/admin/login?error=insufficient_role');
  }

  const userEmail = session.user.email ?? 'unknown';
  const userName = session.user.name ?? 'Admin';

  return (
    <AdminSessionProvider>
      {/* Admin nav bar */}
      <header className="fixed inset-x-0 top-0 z-[var(--z-sticky)] border-b border-[var(--color-border)] bg-[var(--color-bg-darker)]/95 backdrop-blur-md">
        <Container>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center bg-[var(--color-accent)]">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-black" aria-hidden="true">
                    <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
                  </svg>
                </div>
                <span className="font-display text-lg tracking-wider text-[var(--color-fg)]">
                  IRONFORGE
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  ADMIN
                </span>
              </Link>

              <nav className="hidden items-center gap-6 md:flex" aria-label="Admin primary">
                {ADMIN_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)] sm:block">
                {userName} · {userEmail}
              </div>
              <form
                action={async () => {
                  'use server';
                  await import('@/lib/auth').then((m) => m.signOut({ redirectTo: '/admin/login' }));
                }}
              >
                <button
                  type="submit"
                  className="font-heading text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-accent)]"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      {/* Page content (offset for fixed header) */}
      <main className="min-h-dvh pt-14">{children}</main>
    </AdminSessionProvider>
  );
}
