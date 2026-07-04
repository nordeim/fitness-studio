import { z } from 'zod';

/**
 * IRONFORGE — Zod env validation module.
 *
 * Anti-pattern (Skills KB §14): never read `process.env.*` directly.
 * Always import `env` from `@/lib/env`. Typos fail at module load.
 *
 * Build-context fallback: when `NEXT_PHASE=phase-production-build`
 * or `NODE_ENV=test`, returns placeholder values instead of throwing.
 */

const envSchema = z.object({
  // ── App ──
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ── Database ──
  DATABASE_URL: z
    .string()
    .refine((v) => v.startsWith('postgres'), 'Must be a postgres:// URL'),
  DATABASE_URL_UNPOOLED: z
    .string()
    .refine((v) => v.startsWith('postgres'), 'Must be a postgres:// URL'),

  // ── Auth.js v5 ──
  AUTH_SECRET: z.string().min(32, 'Must be ≥ 32 chars (use `openssl rand -base64 32`)'),
  AUTH_URL: z.string().url().default('http://localhost:3000'),

  // ── Stripe ──
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

  // ── Replicate ──
  REPLICATE_API_TOKEN: z.string().startsWith('r8_'),
  REPLICATE_SDXL_MODEL: z
    .string()
    .regex(
      /^[a-z0-9-]+\/[a-z0-9-]+:[a-f0-9]{8,}$/,
      'Must match owner/model:sha format',
    )
    .default('stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5'),

  // ── Cloudflare R2 ──
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_UPLOADS: z.string().min(1),
  R2_BUCKET_GENERATED: z.string().min(1),

  // ── Inngest ──
  INNGEST_EVENT_KEY: z.string().min(1),
  INNGEST_SIGNING_KEY: z.string().min(1),
  INNGEST_API_BASE_URL: z.string().url().optional().or(z.literal('')),

  // ── Email (Resend) ──
  RESEND_API_KEY: z.string().startsWith('re_'),
  // F-M4: sender + coach-notify addresses (optional — defaults in resend.ts)
  RESEND_FROM_EMAIL: z.string().email().optional().or(z.literal('')),
  COACH_NOTIFY_EMAIL: z.string().email().optional().or(z.literal('')),

  // ── Upstash ──
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // ── Admin seed ──
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD_HASH: z.string().min(1),

  // ── Optional ──
  IMAGE_MODERATION_FAIL_OPEN: z
    .string()
    .default('true')
    .transform((v) => v.toLowerCase() !== 'false'),
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Build-context fallback.
 * When building (`next build`) or running tests, we don't have real env vars.
 * Returns placeholder values so module load succeeds.
 */
function isBuildContext(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NODE_ENV === 'test'
  );
}

function loadEnv(): Env {
  // 1. Build/test context — return placeholders, never throw.
  if (isBuildContext()) {
    return {
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NODE_ENV: process.env.NODE_ENV === 'test' ? 'test' : 'production',
      DATABASE_URL: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
      DATABASE_URL_UNPOOLED: 'postgresql://placeholder:placeholder@localhost:5432/placeholder',
      AUTH_SECRET: 'placeholder-placeholder-placeholder-placeholder',
      AUTH_URL: 'http://localhost:3000',
      STRIPE_SECRET_KEY: 'sk_test_placeholder',
      STRIPE_WEBHOOK_SECRET: 'whsec_placeholder',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_placeholder',
      REPLICATE_API_TOKEN: 'r8_placeholder',
      REPLICATE_SDXL_MODEL: 'stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5',
      R2_ACCOUNT_ID: 'placeholder',
      R2_ACCESS_KEY_ID: 'placeholder',
      R2_SECRET_ACCESS_KEY: 'placeholder',
      R2_BUCKET_UPLOADS: 'ironforge-uploads',
      R2_BUCKET_GENERATED: 'ironforge-generated',
      INNGEST_EVENT_KEY: 'placeholder',
      INNGEST_SIGNING_KEY: 'placeholder',
      INNGEST_API_BASE_URL: '',
      RESEND_API_KEY: 're_placeholder',
      RESEND_FROM_EMAIL: '',
      COACH_NOTIFY_EMAIL: '',
      UPSTASH_REDIS_REST_URL: 'https://placeholder.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 'placeholder',
      ADMIN_EMAIL: 'admin@ironforge.local',
      ADMIN_PASSWORD_HASH: '$2a$12$placeholder',
      IMAGE_MODERATION_FAIL_OPEN: true,
      SENTRY_DSN: '',
    };
  }

  // 2. Runtime context — validate, throw on failure.
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    parsed.error.issues.forEach((issue) => {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error(
      'Invalid environment variables. Check `.env.local` against `.env.example`.',
    );
  }

  // 3. AUTH_URL / NEXT_PUBLIC_APP_URL host mismatch warning (T2 lesson).
  const authUrl = new URL(parsed.data.AUTH_URL);
  const appUrl = new URL(parsed.data.NEXT_PUBLIC_APP_URL);
  if (authUrl.host !== appUrl.host) {
    console.warn(
      `⚠️  AUTH_URL host (${authUrl.host}) does not match NEXT_PUBLIC_APP_URL host (${appUrl.host}). ` +
        'With trustHost:true this is no longer fatal, but should be fixed.',
    );
  }

  return parsed.data;
}

export const env = loadEnv();
