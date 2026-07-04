import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * CSP Policy regression tests (Finding F-D1 — Critical).
 *
 * The H1 fix was claimed as "applied" across 5 docs (CLAUDE.md, AGENTS.md,
 * README.md, SKILL.md, ADR-002) but was never actually applied to the code.
 * `next.config.ts:30` retained `'unsafe-eval'` and the live CSP header
 * reflected it.
 *
 * These tests guard against regression by reading `next.config.ts` and
 * asserting the CSP_POLICY string:
 *   1. Must NOT contain `'unsafe-eval'` (H1 fix)
 *   2. Must contain `'unsafe-inline'` for script-src (Next.js App Router requirement)
 *   3. Must contain `frame-ancestors 'none'` (clickjacking defense)
 *   4. Must contain `default-src 'self'` (default-deny baseline)
 *
 * Why read the file instead of importing? `next.config.ts` uses
 * `@next/bundle-analyzer` and `NextConfig` types that are awkward to import
 * in Vitest. Reading the source string is simpler and sufficient — we're
 * testing the policy text, not runtime behavior.
 */

function getCspPolicy(): string {
  const content = readFileSync(resolve(process.cwd(), 'next.config.ts'), 'utf-8');
  const match = content.match(/const CSP_POLICY = \[([\s\S]*?)\]\.join/);
  if (!match || !match[1]) {
    throw new Error('CSP_POLICY array not found in next.config.ts');
  }
  return match[1];
}

describe('CSP Policy (F-D1 regression guard)', () => {
  it('must NOT contain unsafe-eval (H1 fix — claimed in 5 docs, now actually applied)', () => {
    const csp = getCspPolicy();
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('must contain unsafe-inline for script-src (Next.js App Router inline runtime requirement)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  });

  it('must contain unsafe-inline for style-src (Tailwind v4 + Next.js inline styles)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
  });

  it('must contain frame-ancestors none (clickjacking defense)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it('must contain default-src self (default-deny baseline)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("default-src 'self'");
  });

  it('must contain object-src none (no Flash/Java/plugins)', () => {
    const csp = getCspPolicy();
    expect(csp).toContain("object-src 'none'");
  });
});
