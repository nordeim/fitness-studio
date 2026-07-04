import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * IRONFORGE — Rate limiter.
 *
 * Uses Upstash Redis sliding window when real credentials are available.
 * Falls back to a no-op (allow all) when:
 *  - Env vars are placeholders (dev/build context)
 *  - Redis URL is the placeholder value
 *
 * This allows dev to work without Redis, while production enforces limits.
 *
 * F-M5 fix: Uses `process.env` directly (NOT the Zod-validated `env` module),
 * matching the graceful-degradation pattern used by all other infra clients
 * (`stripe.ts`, `r2.ts`, `replicate.ts`, `inngest/client.ts`). The `env` module
 * throws at runtime when `.env.local` is missing — this module must not crash.
 *
 * F-M5 fix: `hasRealRedis()` now checks for both `'placeholder'` (build-context
 * fallback) AND `'xxx'` (`.env.local` dev placeholder), matching the `stripe.ts`
 * pattern. Previously, dev envs with `https://xxx.upstash.io` would pass the
 * check, try to connect, fail, and log an error on every rate-limited request.
 *
 * Usage:
 *   const { success } = await rateLimit(identifier, 'booking', 5, '1 m');
 *   if (!success) return 429;
 *
 * Reference: Skills KB §12 (Upstash patterns from nextjs16-react19-next-auth5-drizzle-orm).
 */

// Graceful-degradation helper (same pattern as inngest/client.ts, r2.ts)
function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

type RateLimitResult = { success: boolean; limit: number; remaining: number };

// No-op limiter for dev/build
const noopLimiter = (): Promise<RateLimitResult> =>
  Promise.resolve({ success: true, limit: Infinity, remaining: Infinity });

// Check if we have real Upstash credentials (rejects placeholder AND xxx patterns)
// Matches the stripe.ts pattern: check for both build-context placeholders and .env.local dev placeholders
function hasRealRedis(): boolean {
  const url = getEnv('UPSTASH_REDIS_REST_URL');
  const token = getEnv('UPSTASH_REDIS_REST_TOKEN');
  return (
    url.length > 0 &&
    !url.includes('placeholder') &&
    !url.includes('xxx') &&
    url.startsWith('https://') &&
    token.length > 0 &&
    !token.includes('placeholder') &&
    !token.includes('xxx')
  );
}

// Lazy-init Redis + ratelimiter (only when first used with real creds)
let redis: Redis | null = null;
const limiters: Map<string, Ratelimit> = new Map();

function getRedis(): Redis | null {
  if (!hasRealRedis()) return null;
  if (!redis) {
    redis = new Redis({
      url: getEnv('UPSTASH_REDIS_REST_URL'),
      token: getEnv('UPSTASH_REDIS_REST_TOKEN'),
    });
  }
  return redis;
}

function getLimiter(key: string, limit: number, window: string): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;

  const cacheKey = `${key}:${limit}:${window}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(limit, window as '1 m' | '1 h' | '1 d'),
      prefix: `ironforge:${key}`,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/**
 * Rate limit a request.
 *
 * @param identifier - IP address or user ID
 * @param key - Rate limit bucket name (e.g., 'booking', 'newsletter', 'auth')
 * @param limit - Max requests in the window
 * @param window - Time window (e.g., '1 m', '1 h')
 * @returns { success, limit, remaining }
 */
export async function rateLimit(
  identifier: string,
  key: string,
  limit: number,
  window: string,
): Promise<RateLimitResult> {
  const limiter = getLimiter(key, limit, window);
  if (!limiter) return noopLimiter();

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
    };
  } catch (err) {
    // Redis error — fail open (allow request) but log
    console.error('[rate-limit] Upstash error, failing open:', err);
    return { success: true, limit, remaining: 0 };
  }
}

// Pre-configured limiters for common use cases
export const rateLimitBooking = (ip: string) => rateLimit(ip, 'booking', 5, '1 m'); // 5 per minute

export const rateLimitNewsletter = (ip: string) => rateLimit(ip, 'newsletter', 3, '1 m'); // 3 per minute

export const rateLimitAuth = (ip: string) => rateLimit(ip, 'auth', 5, '10 m'); // 5 per 10 minutes
