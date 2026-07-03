'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MEMBERSHIP_TIERS, DROP_IN_PACK, type MembershipTier } from '@/features/memberships/data';
import { cn } from '@/lib/utils';

/**
 * MembershipTierComparison — 3-column pricing grid + drop-in row.
 *
 * Visual:
 *  - 3 columns (Forge / Forge+ / Forge Private)
 *  - Forge+ is featured (accent border + "Most Popular" badge)
 *  - Each column: name, price, features list (✓), limitations (✕)
 *  - "Choose" CTA per tier
 *  - Drop-in pack row below the grid (single purchase, not recurring)
 *
 * Interaction:
 *  - Click "Choose" → POST /api/checkout
 *  - If Stripe not configured (dev), shows error toast
 *  - On success, redirect to Stripe Checkout URL
 *
 * Reference: Master Execution Plan §6.9 (3 tiers + drop-in pack).
 * Reference: Skills KB §2 (anti-generic — no card grid cliché; use tiered comparison).
 */
export function MembershipTierComparison() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null); // tier id or null
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(tier: string) {
    setError(null);
    setLoading(tier);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, priceId: 'placeholder' }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message ?? 'Checkout failed');
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-12">
      {/* 3-tier grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {MEMBERSHIP_TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            loading={loading === tier.id}
            onChoose={() => handleCheckout(tier.id)}
          />
        ))}
      </div>

      {/* Drop-in pack */}
      <div className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-4">
              <h3 className="font-display text-3xl tracking-wide text-[var(--color-fg)]">
                {DROP_IN_PACK.name}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {DROP_IN_PACK.tagline}
              </span>
            </div>
            <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-[var(--color-fg-dim)]">
              {DROP_IN_PACK.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="font-display text-4xl text-[var(--color-fg)]">
              ${DROP_IN_PACK.price}
              <span className="ml-1 font-mono text-xs text-[var(--color-muted)]">/ 5 credits</span>
            </div>
            <button
              type="button"
              onClick={() => handleCheckout('drop_in')}
              disabled={loading === 'drop_in'}
              className={cn(
                'border border-[var(--color-border-light)] px-6 py-3 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] transition-all',
                'hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]',
                'disabled:opacity-50',
              )}
            >
              {loading === 'drop_in' ? 'Loading...' : DROP_IN_PACK.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div
          role="alert"
          className="border border-red-500/30 bg-red-500/5 p-4 text-center font-mono text-xs text-red-400"
        >
          {error}
        </div>
      )}

      {/* Legal note */}
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
        All plans billed monthly · Cancel anytime · No long-term contracts
      </p>
    </div>
  );
}

interface TierCardProps {
  tier: MembershipTier;
  loading: boolean;
  onChoose: () => void;
}

function TierCard({ tier, loading, onChoose }: TierCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col border bg-[var(--color-bg-card)] p-8 transition-transform duration-[500ms] ease-[var(--ease-premium)] hover:-translate-y-1',
        tier.featured
          ? 'border-[var(--color-accent)] shadow-[0_0_40px_rgba(255,84,0,0.1)]'
          : 'border-[var(--color-border)]',
      )}
    >
      {/* Featured badge */}
      {tier.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] px-4 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black">
          Most Popular
        </div>
      )}

      {/* Tier name + tagline */}
      <div>
        <h3 className="font-display text-4xl tracking-wide text-[var(--color-fg)]">
          {tier.name}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {tier.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-5xl text-[var(--color-fg)]">${tier.priceMonthly}</span>
        <span className="font-mono text-xs text-[var(--color-muted)]">/month</span>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onChoose}
        disabled={loading}
        className={cn(
          'mt-6 w-full py-3 font-heading text-xs uppercase tracking-[0.2em] transition-all',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]',
          'disabled:opacity-50',
          tier.featured
            ? 'bg-[var(--color-accent)] font-semibold text-black hover:bg-[var(--color-accent-bright)]'
            : 'border border-[var(--color-border-light)] text-[var(--color-fg-dim)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
        )}
      >
        {loading ? 'Loading...' : tier.cta}
      </button>

      {/* Features */}
      <ul className="mt-8 space-y-3 border-t border-[var(--color-border)] pt-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-body text-sm text-[var(--color-fg-dim)]">{feature}</span>
          </li>
        ))}
        {tier.limitations.map((limitation) => (
          <li key={limitation} className="flex items-start gap-3 opacity-50">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="font-body text-sm text-[var(--color-fg-dim)]">{limitation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
