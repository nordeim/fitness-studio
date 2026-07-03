```bash
PGPASSWORD='fitnesstudio_dev_password' psql -h localhost -p 5432 -U fitnesstudio -d fitnesstudio_dev

# Confirm postgres is reachable via localhost:5432
 export PGPASSWORD='fitnesstudio_dev_password'
 psql -h localhost -p 5432 -U fitnesstudio -d fitnesstudio_dev -c "SELECT version(), current_database(), current_user;" 2>/dev/null || echo "psql command failed"

 version                                          | current_database | current_user
 ------------------------------------------------------------------------------------------+------------------+--------------
  PostgreSQL 17.10 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit | fitnesstudio_dev | fitnesstudio
 (1 row)

```

As referenced in your project's own `.env` template, the industry-standard command for generating a secure secret for Auth.js (NextAuth) is:

```bash
openssl rand -base64 32
```

### Technical Nuance (Length vs. Entropy)

While the command specifies `32`, it actually generates **32 bytes** of entropy, which encodes to a **44-character** Base64 string. Auth.js requires a _minimum_ of 32 characters, so this is the most secure and recommended approach.

If you strictly need **exactly 32 characters** (e.g., for a specific legacy constraint), you should generate 16 bytes of hexadecimal instead:

```bash
openssl rand -hex 16
```

### Cross-Platform Fallback (Node.js)

If a developer is on Windows and does not have `openssl` installed, they can use Node's native `crypto` module directly from the terminal:

```bash
# Generates exactly 32 Base64 characters (24 bytes)
node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"

# OR generates exactly 32 Hex characters (16 bytes)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

### Next Step: Implementation

For the replacement `.env.docker` and `.env.local` files I am about to generate, I will inject a **pre-generated, dummy 32-character string** (e.g., `AUTH_SECRET="dev-only-insecure-32-char-secret!!"`) so that the Zod validation passes and the application boots successfully out-of-the-box for new developers.

---

Execution Plan: Database Initialization, Migrations, and Seeding

### Phase 1: Apply Migrations (drizzle-kit migrate)

Run the existing migrations to create the 11-table schema:

```bash
  # Command:
  pnpm drizzle:migrate
```

This applies:

- 0000_majestic_triathlon.sql — 10 tables (users, accounts, sessions, verification_tokens, coaches, programs, stories, class_slots, trial_requests, newsletter_subs)
- 0001_colossal_anthem.sql — subscriptions table + subscription_status enum

### Phase 2: Seed Sample Data (pnpm db:seed)

Run the seed script to populate tables:

```bash
  # Command:
  pnpm db:seed
```

Seeds:

- 1 admin user (from ADMIN_EMAIL + ADMIN_PASSWORD_HASH in .env.local)
- 8 coaches (from STATIC_COACHES in src/features/coaches/data.ts)
- 9 programs (from STATIC_PROGRAMS in src/features/programs/data.ts)
- 6 stories (from STATIC_STORIES in src/features/stories/data.ts)
- 48 class slots (next 14 days, auto-generated)

### Shortcut Command

```bash
  # Runs both: pnpm drizzle:migrate && pnpm db:seed
  pnpm db:reset
```

https://chat.qwen.ai/s/00328b8f-ae33-4c6e-bb32-912e6658d56b?fev=0.2.68
