'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type AssetType = 'coach_portrait' | 'program_hero' | 'story_before' | 'story_after';

const ASSET_TYPES: ReadonlyArray<{ value: AssetType; label: string; description: string }> = [
  { value: 'coach_portrait', label: 'Coach Portrait', description: '3:4 portrait — coach headshot with gym background' },
  { value: 'program_hero', label: 'Program Hero', description: '4:3 landscape — athletic training scene' },
  { value: 'story_before', label: 'Story Before', description: 'Before photo — average person in gym' },
  { value: 'story_after', label: 'Story After', description: 'After photo — transformed athlete' },
];

interface GenerationResult {
  success: boolean;
  code: string;
  message: string;
  fallbackSvg?: string;
}

/**
 * Admin Asset Generation page.
 *
 * Phase 9 will add auth gate (admin role required). For now, it's open
 * but the API route logs all requests.
 *
 * UI:
 *  - Asset type selector (4 radio cards)
 *  - Entity slug input (e.g., 'marcus-steel')
 *  - Optional prompt override textarea
 *  - Generate button (fires POST /api/admin/assets/generate)
 *  - Result display (success message or fallback SVG preview)
 */
export default function AdminAssetsGeneratePage() {
  const [type, setType] = useState<AssetType>('coach_portrait');
  const [entitySlug, setEntitySlug] = useState('');
  const [promptOverride, setPromptOverride] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/assets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, entitySlug, promptOverride }),
      });

      const data = (await response.json()) as GenerationResult;
      setResult(data);
    } catch {
      setResult({
        success: false,
        code: 'INTERNAL',
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-3xl">
        <SectionMarker>ADMIN · ASSET GENERATION</SectionMarker>
        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
          GENERATE AI ASSETS
        </h1>
        <p className="mt-4 font-body text-base text-[var(--color-fg-dim)]">
          Generate B&amp;W noir athletic photography via Replicate SDXL.
          Images are stored in Cloudflare R2 and referenced by coaches,
          programs, and stories.
        </p>

        {/* Phase 9 auth warning */}
        <div className="mt-6 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            ⚠ PHASE 9 PENDING · AUTH NOT WIRED
          </p>
          <p className="mt-1 font-body text-sm text-[var(--color-fg-dim)]">
            This page is currently open. Phase 9 will add admin auth gate.
          </p>
        </div>

        {/* Form */}
        <div className="mt-12 space-y-8">
          {/* Asset type */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Asset Type <span className="text-[var(--color-accent)]">*</span>
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ASSET_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={cn(
                    'flex flex-col items-start p-3 text-left border transition-all',
                    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
                    type === opt.value
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'border-[var(--color-border-light)] hover:border-[var(--color-silver-dim)]',
                  )}
                >
                  <span className="font-heading text-xs uppercase tracking-wider text-[var(--color-fg)]">
                    {opt.label}
                  </span>
                  <span className="mt-1 font-mono text-[9px] text-[var(--color-muted)]">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Entity slug */}
          <Input
            id="entitySlug"
            name="entitySlug"
            label="Entity Slug"
            required
            value={entitySlug}
            onChange={(e) => setEntitySlug(e.target.value)}
            placeholder="marcus-steel"
            hint="The coach/program/story slug (e.g., 'marcus-steel', 'conjugate-max-effort', 'david-k')"
          />

          {/* Prompt override */}
          <Textarea
            id="promptOverride"
            name="promptOverride"
            label="Prompt Override (optional)"
            rows={3}
            value={promptOverride}
            onChange={(e) => setPromptOverride(e.target.value)}
            placeholder="Leave blank to use the default prompt for this asset type..."
          />

          {/* Generate button */}
          <Button
            type="button"
            size="lg"
            loading={loading}
            disabled={loading || !entitySlug}
            onClick={handleGenerate}
          >
            {loading ? 'Generating...' : 'Generate Asset →'}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-12 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'h-2 w-2',
                  result.success ? 'bg-[var(--color-accent)]' : 'bg-red-500',
                )}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)]">
                {result.code}
              </span>
            </div>
            <p className="mt-3 font-body text-sm text-[var(--color-fg-dim)]">
              {result.message}
            </p>

            {/* Fallback SVG preview */}
            {result.fallbackSvg && (
              <div className="mt-6">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Placeholder Preview
                </p>
                <div
                  className="border border-[var(--color-border)] p-4"
                  dangerouslySetInnerHTML={{ __html: result.fallbackSvg }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
