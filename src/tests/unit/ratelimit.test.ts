import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * ratelimit module tests (Finding F-M5 — Medium).
 *
 * `ratelimit.ts` imported `env` from `@/lib/env`, contradicting the project's
 * graceful-degradation pattern (all other infra clients use `process.env`
 * directly). The `env` module throws at runtime when `.env.local` is missing.
 *
 * Additionally, `hasRealRedis()` only checked for `'placeholder'` (the
 * build-context fallback value) but NOT for `'xxx'` (the `.env.local` dev
 * placeholder). This meant dev envs with `UPSTASH_REDIS_REST_URL=https://xxx.upstash.io`
 * would pass the check, try to connect, fail, and log an error on every
 * rate-limited request.
 *
 * These tests guard against both regressions.
 */

function getRatelimitSource(): string {
  return readFileSync(resolve(process.cwd(), 'src/lib/ratelimit.ts'), 'utf-8');
}

describe('ratelimit module (F-M5)', () => {
  it('must NOT import from @/lib/env (graceful degradation pattern)', () => {
    const content = getRatelimitSource();
    expect(content).not.toContain("from '@/lib/env'");
    expect(content).not.toContain('from "@/lib/env"');
  });

  it('must check for both placeholder AND xxx patterns (matches stripe.ts pattern)', () => {
    const content = getRatelimitSource();
    // The hasRealRedis check should reject both 'placeholder' and 'xxx' values
    expect(content).toMatch(/includes\(['"]placeholder['"]\)/);
    expect(content).toMatch(/includes\(['"]xxx['"]\)/);
  });

  it('returns success=true (no-op) when Upstash not configured (xxx placeholders)', async () => {
    // Mock process.env to have xxx placeholders (the .env.local dev values)
    vi.resetModules();
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.UPSTASH_REDIS_REST_URL = 'https://xxx.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'xxx';
    try {
      const { rateLimitBooking } = await import('@/lib/ratelimit');
      const result = await rateLimitBooking('1.2.3.4');
      expect(result.success).toBe(true);
    } finally {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });

  it('returns success=true (no-op) when Upstash env vars are missing entirely', async () => {
    vi.resetModules();
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {
      const { rateLimitBooking } = await import('@/lib/ratelimit');
      const result = await rateLimitBooking('1.2.3.4');
      expect(result.success).toBe(true);
    } finally {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
      process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
    }
  });
});
