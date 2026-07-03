# docker-compose-dev.yml

```yml
# Development environment for StoryIntoVideo
# Services: PostgreSQL 17, Redis 7, Next.js web app
# Usage: docker compose -f docker-compose-dev.yml up -d
# See also: docker-compose-nginx.yml for optional HTTPS proxy.

networks:
  fitnesstudio-network:
    driver: bridge

services:
  # ==========================================================================
  # PostgreSQL 17 – Database with required extensions
  # ==========================================================================
  postgres:
    image: postgres:17-alpine
    container_name: fitnesstudio-postgres-dev
    environment:
      POSTGRES_DB: fitnesstudio_dev
      POSTGRES_USER: fitnesstudio
      POSTGRES_PASSWORD: ${DB_PASSWORD:-fitnesstudio_dev_password}
      POSTGRES_HOST_AUTH_METHOD: trust # dev convenience
      TZ: UTC
      PGDATA: /var/lib/postgresql/data/pgdata
    command: >
      postgres
      -c timezone=UTC
      -c log_destination=stderr
      -c logging_collector=off
      -c log_min_messages=warning
    ports:
      - '127.0.0.1:5432:5432' # bind only to loopback for local tooling
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-extensions.sql:/docker-entrypoint-initdb.d/01-init-extensions.sql:ro
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U fitnesstudio -d fitnesstudio_dev']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - fitnesstudio-network
    restart: unless-stopped

  # ==========================================================================
  # Redis 7 – Cache, queues, sessions (noeviction policy per MEP)
  # ==========================================================================
  redis:
    image: redis:7-alpine
    container_name: fitnesstudio-redis-dev
    command: >
      redis-server
      --maxmemory 512mb
      --maxmemory-policy noeviction
      --appendonly yes
      --save 60 1000
      --loglevel warning
    ports:
      - '127.0.0.1:6379:6379' # bind only to loopback
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 5s
    networks:
      - fitnesstudio-network
    restart: unless-stopped

  # ==========================================================================
  # Next.js 16 Web Application (development with hot reload)
  # ==========================================================================
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: development
    container_name: fitnesstudio-web-dev
    env_file:
      - .env.docker
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://fitnesstudio:${DB_PASSWORD:-fitnesstudio_dev_password}@postgres:5432/fitnesstudio_dev
      REDIS_URL: redis://redis:6379
      # Override any vars from .env.docker if needed
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules # anonymous volume to keep host node_modules out
      - .next:/app/.next # preserve Next.js build cache
      - pnpm_store:/root/.local/share/pnpm/store
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - fitnesstudio-network
    restart: unless-stopped
    # CMD is defined in Dockerfile

# ==========================================================================
# Named Volumes
# ==========================================================================
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  pnpm_store:
    driver: local
```

# Dockerfile.dev

```dev
# syntax=docker.io/docker/dockerfile:1.7-labs
# Stage 1: Base – install dependencies
FROM node:24-alpine AS base

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install system dependencies (curl for healthcheck, ffmpeg for video assembly)
RUN apk add --no-cache curl ffmpeg

WORKDIR /app

# Copy package manifests and lockfile first for better caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Stage 2: Development – non‑root user, start dev server
FROM base AS development

# Create non‑root user (security best practice)
RUN addgroup -g 1001 -S fitnesstudio && \
    adduser -S fitnesstudio -G fitnesstudio -u 1001 && \
    chown -R fitnesstudio:fitnesstudio /app

USER fitnesstudio

# Expose Next.js default port
EXPOSE 3000

# Healthcheck — hits the marketing page (200 = healthy)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start Next.js in development mode with Turbopack
CMD ["pnpm", "dev", "--", "--hostname", "0.0.0.0"]

```

# .env.docker

```docker
# ──────────────────────────────────────────────────────────────────────────
# IRONFORGE — Environment Variables
# ──────────────────────────────────────────────────────────────────────────
# Copy this file to `.env.local` and fill in real values.
# Never commit `.env.local` — `.gitignore` already excludes it.
#
# Validation: every var below is Zod-validated at module load by
# `src/lib/env.ts`. Typos or missing required vars crash at boot
# with a typed error (Skills KB §14).
#
# Build context: when `NEXT_PHASE=phase-production-build` or
# `NODE_ENV=test`, the env module returns placeholders instead of
# throwing — this allows `next build` and `vitest` to run without
# real credentials.
# ──────────────────────────────────────────────────────────────────────────

# ── App ──
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ── Database (Neon pooled + unpooled) ──
# Pooled (PgBouncer) — used by app at runtime
DATABASE_URL=postgresql://user:password@host/db?sslmode=require&pgbouncer=true
# Unpooled (direct) — used by drizzle-kit for DDL
DATABASE_URL_UNPOOLED=postgresql://user:password@host/db?sslmode=require

# ── Auth.js v5 ──
# Generate with: `openssl rand -base64 32`
AUTH_SECRET=replace-with-32-char-min-secret
AUTH_URL=http://localhost:3000

# ── Stripe ──
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# ── Replicate (AI asset generation) ──
REPLICATE_API_TOKEN=r8_xxx
# Optional — defaults to stability-ai/sdxl:39ed52f2...
# Format: owner/model:sha (8+ hex chars)
REPLICATE_SDXL_MODEL=stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5

# ── Cloudflare R2 (S3-compatible) ──
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_UPLOADS=ironforge-uploads
R2_BUCKET_GENERATED=ironforge-generated

# ── Inngest ──
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx
# Optional — for Inngest Cloud (Dev Server uses http://localhost:8288 by default)
INNGEST_API_BASE_URL=

# ── Email (Resend) ──
RESEND_API_KEY=re_xxx

# ── Rate Limiting (Upstash Redis) ──
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# ── Admin seed (used by `pnpm db:seed`) ──
ADMIN_EMAIL=admin@ironforge.local
ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash

# ── Optional ──
# When false, moderateImage fails CLOSED on unknown output shapes (T5 lesson)
IMAGE_MODERATION_FAIL_OPEN=true
# Sentry error tracking
SENTRY_DSN=

```

# .env.local

```local
# ──────────────────────────────────────────────────────────────────────────
# IRONFORGE — Environment Variables
# ──────────────────────────────────────────────────────────────────────────
# Copy this file to `.env.local` and fill in real values.
# Never commit `.env.local` — `.gitignore` already excludes it.
#
# Validation: every var below is Zod-validated at module load by
# `src/lib/env.ts`. Typos or missing required vars crash at boot
# with a typed error (Skills KB §14).
#
# Build context: when `NEXT_PHASE=phase-production-build` or
# `NODE_ENV=test`, the env module returns placeholders instead of
# throwing — this allows `next build` and `vitest` to run without
# real credentials.
# ──────────────────────────────────────────────────────────────────────────

# ── App ──
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ── Database (Neon pooled + unpooled) ──
# Pooled (PgBouncer) — used by app at runtime
#DATABASE_URL=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost/fitnesstudio_dev?sslmode=require&pgbouncer=true
DATABASE_URL=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost:5432/fitnesstudio_dev
# Unpooled (direct) — used by drizzle-kit for DDL
#DATABASE_URL_UNPOOLED=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost/fitnesstudio_dev?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://fitnesstudio:fitnesstudio_dev_password@localhost:5432/fitnesstudio_dev

# ── Auth.js v5 ──
# Generate with: `openssl rand -base64 32`
AUTH_SECRET=replace-with-32-char-min-secret
AUTH_URL=http://localhost:3000

# ── Stripe ──
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# ── Replicate (AI asset generation) ──
REPLICATE_API_TOKEN=r8_xxx
# Optional — defaults to stability-ai/sdxl:39ed52f2...
# Format: owner/model:sha (8+ hex chars)
REPLICATE_SDXL_MODEL=stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5

# ── Cloudflare R2 (S3-compatible) ──
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_UPLOADS=ironforge-uploads
R2_BUCKET_GENERATED=ironforge-generated

# ── Inngest ──
INNGEST_EVENT_KEY=xxx
INNGEST_SIGNING_KEY=xxx
# Optional — for Inngest Cloud (Dev Server uses http://localhost:8288 by default)
INNGEST_API_BASE_URL=

# ── Email (Resend) ──
RESEND_API_KEY=re_xxx

# ── Rate Limiting (Upstash Redis) ──
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# ── Admin seed (used by `pnpm db:seed`) ──
ADMIN_EMAIL=admin@ironforge.local
ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash

# ── Optional ──
# When false, moderateImage fails CLOSED on unknown output shapes (T5 lesson)
IMAGE_MODERATION_FAIL_OPEN=true
# Sentry error tracking
SENTRY_DSN=

```

# scripts/init-extensions.sql

```sql
-- PostgreSQL extensions for StoryIntoVideo
-- gen_random_uuid() is built into PostgreSQL 13+ and requires no extension.
-- No additional extensions are needed for the current schema.

```
