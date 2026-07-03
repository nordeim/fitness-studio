'use client';

import { useState, type FormEvent, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * IRONFORGE — Admin login page.
 *
 * Uses next-auth's signIn() client function with redirect: false
 * so we can show inline errors instead of redirecting to an error page.
 *
 * On success, redirects to the callbackUrl (default /admin).
 * On error, shows inline error message.
 *
 * Wrapped in <Suspense> because useSearchParams() requires it for
 * static prerendering (Next.js 16 requirement).
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginLoading() {
  return (
    <Container className="flex min-h-dvh items-center justify-center py-24">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Loading...
      </div>
    </Container>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-dvh items-center justify-center py-24">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[var(--color-accent)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black" aria-hidden="true">
                <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
              </svg>
            </div>
            <div className="font-display text-2xl tracking-wider text-[var(--color-fg)]">
              IRONFORGE
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <SectionMarker className="justify-center">ADMIN · ACCESS</SectionMarker>
          <h1 className="mt-6 text-center font-display text-4xl tracking-wide text-[var(--color-fg)] md:text-5xl">
            SIGN IN
          </h1>
          <p className="mt-3 text-center font-body text-sm text-[var(--color-fg-dim)]">
            Authorized personnel only.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
          aria-label="Admin login form"
          noValidate
        >
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ironforge.local"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p
              role="alert"
              className="border border-red-500/30 bg-red-500/5 p-3 font-mono text-[10px] uppercase tracking-[0.15em] text-red-400"
            >
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={loading} disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg-dim)]"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </Container>
  );
}
