# IRONFORGE — Production Deployment Guide

> Step-by-step guide for deploying IRONFORGE to Vercel.
> Covers: environment setup, database migration, Stripe configuration,
> Inngest wiring, post-deploy verification.

---

## Prerequisites

- [ ] GitHub repo pushed (main branch)
- [ ] Vercel account (free tier sufficient for v1)
- [ ] Neon Postgres database (free tier: 0.5 GB, pooled + unpooled connections)
- [ ] Stripe account (test mode first, then live)
- [ ] Upstash Redis (free tier: 10K commands/day)
- [ ] Inngest Cloud account (free tier: 10K function runs/month)
- [ ] Cloudflare R2 bucket (free tier: 10 GB storage)
- [ ] Replicate account (pay-per-use, ~$0.01 per SDXL image)
- [ ] Resend account (free tier: 100 emails/day)

---

## Step 1: Create External Services

### 1.1 Neon Postgres

1. Go to [neon.tech](https://neon.tech) → Sign up
2. Create new project → Name: "ironforge"
3. Copy both connection strings:
   - **Pooled** (for app runtime): `postgresql://...?sslmode=require&pgbouncer=true`
   - **Unpooled** (for drizzle-kit DDL): `postgresql://...?sslmode=require`

### 1.2 Upstash Redis

1. Go to [upstash.com](https://upstash.com) → Sign up
2. Create database → Name: "ironforge-ratelimit"
3. Copy REST URL + REST token

### 1.3 Inngest Cloud

1. Go to [inngest.com](https://inngest.com) → Sign up
2. Create app → Name: "ironforge"
3. Copy Event Key + Signing Key
4. Add webhook endpoint: `https://yourdomain.com/api/inngest`

### 1.4 Stripe

1. Go to [stripe.com](https://stripe.com) → Dashboard
2. Create 4 products:
   - Forge — $149/month recurring
   - Forge+ — $249/month recurring
   - Forge Private — $599/month recurring
   - Drop-In Pack — $120 one-time
3. Copy each `price_...` ID
4. Update `src/features/memberships/data.ts` with the price IDs
5. Developers → Webhooks → Add endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret (`whsec_...`)

### 1.5 Cloudflare R2

1. Go to Cloudflare Dashboard → R2
2. Create 2 buckets: `ironforge-uploads`, `ironforge-generated`
3. Manage API Tokens → Create token with Object Read & Write on both buckets
4. Copy Account ID, Access Key ID, Secret Access Key

### 1.6 Replicate

1. Go to [replicate.com](https://replicate.com) → Sign up
2. API Tokens → Create token → Copy `r8_...` token

### 1.7 Resend

1. Go to [resend.com](https://resend.com) → Sign up
2. API Keys → Create key → Copy `re_...` key
3. Verify your sending domain (e.g., `ironforge.local` → replace with real domain)

---

## Step 2: Deploy to Vercel

### 2.1 Import the repo

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo: `fitness-studio`
3. Framework preset: Next.js (auto-detected)
4. Build command: `next build` (auto-detected)
5. Output directory: `.next` (auto-detected)
6. Install command: `pnpm install` (auto-detected from `packageManager` field)

### 2.2 Set environment variables

In the Vercel dashboard → Settings → Environment Variables, add ALL of these:

| Variable | Value | Environment |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` | Production + Preview |
| `DATABASE_URL` | Neon pooled connection string | All |
| `DATABASE_URL_UNPOOLED` | Neon unpooled connection string | All |
| `AUTH_SECRET` | `openssl rand -base64 32` output | All |
| `AUTH_URL` | `https://yourdomain.com` | Production |
| `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...` for staging) | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from Stripe webhook endpoint | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production |
| `REPLICATE_API_TOKEN` | `r8_...` | Production |
| `REPLICATE_SDXL_MODEL` | `stability-ai/sdxl:39ed52f2...` | All |
| `R2_ACCOUNT_ID` | Cloudflare account ID | All |
| `R2_ACCESS_KEY_ID` | R2 access key | All |
| `R2_SECRET_ACCESS_KEY` | R2 secret key | All |
| `R2_BUCKET_UPLOADS` | `ironforge-uploads` | All |
| `R2_BUCKET_GENERATED` | `ironforge-generated` | All |
| `INNGEST_EVENT_KEY` | Inngest event key | All |
| `INNGEST_SIGNING_KEY` | Inngest signing key | Production |
| `RESEND_API_KEY` | `re_...` | Production |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | All |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token | All |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | All |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (see below) | All |

### 2.3 Generate admin bcrypt hash

```bash
node -e "import('bcryptjs').then(b => b.default.hash('your-secure-password', 12).then(h => console.log(h)))"
```

Set `ADMIN_PASSWORD_HASH` to the output.

### 2.4 Deploy

Click "Deploy" in Vercel. The first build takes ~2 minutes.

---

## Step 3: Run Database Migration

After the first successful deploy:

1. Go to Vercel → your project → Settings → Functions
2. Note the deployment URL (e.g., `https://fitness-studio-xxx.vercel.app`)

Run the migration + seed from your local machine:

```bash
# Set the production database URL temporarily
export DATABASE_URL_UNPOOLED="postgresql://...your-neon-unpooled-connection..."

# Run migration
pnpm drizzle:migrate

# Run seed (creates admin user + 8 coaches + 9 programs + 6 stories + 48 class slots)
pnpm db:seed
```

Verify in Neon Console:
- `users` table has 1 row (admin)
- `coaches` table has 8 rows
- `programs` table has 9 rows
- `stories` table has 6 rows
- `class_slots` table has ~48 rows

---

## Step 4: Configure Custom Domain (Optional)

1. Vercel → your project → Settings → Domains
2. Add your domain (e.g., `ironforge.studio`)
3. Add DNS records as instructed (A record or CNAME)
4. Wait for SSL certificate provisioning (~5 minutes)
5. Update `NEXT_PUBLIC_APP_URL` and `AUTH_URL` to the custom domain

---

## Step 5: Post-Deploy Verification

### 5.1 Run the smoke test

```bash
IRONFORGE_LIVE_URL=https://yourdomain.com bash scripts/smoke-test.sh
```

Expected output: `✅ SMOKE TEST PASSED — all N checks green`

### 5.2 Manual verification checklist

- [ ] Home page renders with hero reel cycling
- [ ] Programs grid filters by goal
- [ ] Coach flip cards flip on hover
- [ ] Stories carousel drags + auto-advances
- [ ] Booking form submits + shows toast
- [ ] Memberships "Choose" button redirects to Stripe Checkout
- [ ] Admin login works (`/admin/login`)
- [ ] Admin dashboard shows stats
- [ ] `/robots.txt` returns correct rules
- [ ] `/sitemap.xml` returns 30+ URLs
- [ ] Unknown URL returns branded 404
- [ ] `prefers-reduced-motion` disables animations

### 5.3 Stripe webhook test

```bash
# In test mode, trigger a test event:
stripe trigger checkout.session.completed

# Check Vercel logs for:
# [stripe/webhook] checkout.session.completed: ...
```

### 5.4 Inngest function test

1. Log in to admin → `/admin/assets/generate`
2. Select "Coach Portrait", enter slug "marcus-steel"
3. Click "Generate Asset →"
4. Check Inngest Cloud dashboard for function execution
5. Verify R2 bucket has a new object in `generated/`

---

## Step 6: Ongoing Maintenance

### CI/CD

Every push to `main` triggers:
1. GitHub Actions CI (lint + typecheck + test + build)
2. Vercel auto-deploy (if CI passes)

### Database migrations

When you change the Drizzle schema:

```bash
pnpm drizzle:generate    # Create new migration SQL
# Review the SQL in drizzle/XXXX_*.sql
git add drizzle/ && git commit -m "db: add new column"
git push                  # Triggers CI + Vercel deploy
# After deploy, run migration:
DATABASE_URL_UNPOOLED=... pnpm drizzle:migrate
```

### Monitoring

- **Vercel Analytics** — page views, Core Web Vitals (free tier)
- **Vercel Speed Insights** — LCP/CLS/INP per route
- **Upstash Console** — rate limit usage
- **Inngest Dashboard** — function run history + failures
- **Stripe Dashboard** — payments + subscriptions
- **Neon Console** — DB size + query performance

### Sentry (Phase 13+)

The `SENTRY_DSN` env var is plumbed through `env.ts` but the Sentry SDK is not yet initialized. To enable:

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

This creates `sentry.client.config.ts`, `sentry.server.config.ts`, and updates `next.config.ts`.

---

## Rollback

If a deploy causes issues:

1. Vercel → your project → Deployments
2. Find the last known-good deployment
3. Click "..." → "Promote to Production"
4. The previous deployment becomes live immediately

For database rollbacks, use Drizzle's migration journal to revert:

```bash
pnpm drizzle-kit migrate --rollback
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails with "Invalid environment variables" | Ensure all required env vars are set in Vercel (not just `.env.local`) |
| `INNGEST_SIGNING_KEY is required in production` | Set `INNGEST_SIGNING_KEY` in Vercel env vars |
| Admin login redirects in a loop | Verify `AUTH_URL` matches the deployment URL (including protocol) |
| Stripe webhook returns 400 | Verify `STRIPE_WEBHOOK_SECRET` matches the Stripe Dashboard webhook endpoint |
| Images not loading | Verify `next.config.ts` `remotePatterns` includes your image CDN hostname |
| Rate limiting not working | Verify Upstash Redis URL + token are set (not placeholders) |

---

*End of Deployment Guide.*
