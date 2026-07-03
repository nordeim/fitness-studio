# Runbook: Authentication

> Operational guide for the Auth.js v5 authentication system.
> Covers admin login, session management, rate limiting, and troubleshooting.

---

## Architecture

```
Browser → GET /admin → Edge Proxy (src/proxy.ts)
  → Check authjs.session-token cookie
  → No cookie → 307 redirect to /admin/login?callbackUrl=/admin

Browser → POST /api/auth/callback/credentials (via signIn())
  → Auth.js authorize()
    → Rate limit (5 per 10 min per IP)
    → DB lookup (users table by email)
    → bcrypt.compare(password, user.passwordHash)
    → If valid: create JWT (includes role + id) → set cookie
    → If invalid: return null (generic error)
  → Redirect to /admin

Browser → GET /admin → Edge Proxy (cookie present) → pass through
  → (guarded)/layout.tsx: auth() → session.user.role === 'admin'?
    → Yes: render admin nav + page content
    → No: redirect to /admin/login?error=insufficient_role
```

**Key files:**
- `src/lib/auth/index.ts` — Auth.js v5 config (Credentials + JWT + rate limit)
- `src/proxy.ts` — Edge cookie check
- `src/app/admin/login/page.tsx` — Login form (client component)
- `src/app/admin/(guarded)/layout.tsx` — Admin layout guard (Server Component)
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js catch-all route
- `src/lib/ratelimit.ts` — `rateLimitAuth(ip)` (5 per 10 min)

---

## Admin User Setup

### 1. Generate bcrypt password hash

```bash
node -e "import('bcryptjs').then(b => b.default.hash('your-password', 12).then(h => console.log(h)))"
```

### 2. Set env vars in `.env.local`

```
ADMIN_EMAIL=admin@ironforge.local
ADMIN_PASSWORD_HASH=$2a$12$...  # from step 1
```

### 3. Run the seed

```bash
pnpm db:seed
```

This inserts the admin user into the `users` table with `role: 'admin'` and the bcrypt hash. The seed is idempotent (`ON CONFLICT DO NOTHING` on email).

---

## Common Issues

### 1. Login returns "Invalid email or password."

**Diagnosis:** The generic error message covers multiple failure paths:
- User not found (email doesn't exist in DB)
- User has no password hash (OAuth-only account)
- Password incorrect (bcrypt.compare returned false)
- Rate limit exceeded (5 per 10 min)

**Fix:**
1. Check server console for the specific failure:
   - `[auth:authorize] Login failed — user not found` → email doesn't exist in DB
   - `[auth:authorize] Login failed — invalid password` → password is wrong
   - `[auth:authorize] Rate limited` → too many attempts
2. Verify the admin user exists: `pnpm drizzle:studio` → check `users` table
3. Verify the password hash: re-generate with `bcrypt.hash('your-password', 12)` and compare
4. If rate limited, wait 10 minutes or clear the Upstash Redis key

### 2. Login succeeds but /admin redirects back to /admin/login

**Symptom:** User enters correct credentials, toast doesn't show error, but the page redirects back to login.

**Diagnosis:**
- The JWT was created but the `role` claim is not `'admin'`
- The user exists in the DB with `role: 'member'` instead of `role: 'admin'`

**Fix:**
1. Check the DB: `SELECT email, role FROM users WHERE email = 'admin@ironforge.local'`
2. If role is `'member'`, update it: `UPDATE users SET role = 'admin' WHERE email = 'admin@ironforge.local'`
3. Re-run the seed (which sets `role: 'admin'`)

### 3. Session expires after 30 days

**Diagnosis:** This is by design — JWT `maxAge` is 30 days (`30 * 24 * 60 * 60` seconds).

**Fix:** Log in again. If you need shorter sessions, change `maxAge` in `src/lib/auth/index.ts`:
```typescript
session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 } // 7 days
```

### 4. Edge proxy redirects even with a valid session

**Symptom:** User is logged in (JWT cookie exists) but `/admin` still redirects to `/admin/login`.

**Diagnosis:** The edge proxy checks for the cookie name `authjs.session-token` or `__Secure-authjs.session-token`. In production (HTTPS), Auth.js uses the `__Secure-` prefix. In dev (HTTP), it uses the non-prefixed name.

**Fix:**
1. Check the cookie name in browser DevTools → Application → Cookies
2. If the cookie name doesn't match, verify `AUTH_URL` in `.env.local` matches the actual URL (including protocol)
3. In production, ensure the site is served over HTTPS (Auth.js only uses `__Secure-` prefix on HTTPS)

### 5. `trustHost: true` warning

**Diagnosis:** Auth.js v5 requires `trustHost: true` for reverse-proxy deployments. Without it, Auth.js falls back to `AUTH_URL` for callback URLs.

**Fix:** `trustHost: true` is already set in `src/lib/auth/index.ts`. If you see a warning about `AUTH_URL` host mismatch, ensure `AUTH_URL` and `NEXT_PUBLIC_APP_URL` resolve to the same host.

### 6. Inngest dev mode in production

**Symptom:** `/api/inngest` returns an error in production because `INNGEST_SIGNING_KEY` is missing.

**Diagnosis:** The Inngest route sets `INNGEST_DEV=1` only when `NODE_ENV !== 'production'`. In production, it throws if the signing key is missing.

**Fix:** Set `INNGEST_SIGNING_KEY` in production env vars. Get it from the Inngest Cloud dashboard → Settings → Signing Key.

---

## Security Checklist

- [x] Rate limiting on login (5 per 10 min per IP)
- [x] Generic error messages (no field-specific hints)
- [x] bcrypt cost factor 12
- [x] JWT strategy (stateless, no DB session table)
- [x] `trustHost: true` (reverse-proxy safe)
- [x] Login attempts logged (success + failure with IP)
- [x] Edge proxy checks cookie before hitting the server
- [x] Admin layout checks session + role on every admin page
- [x] Server actions call `requireAdmin()` before mutations
- [x] API routes check `auth()` + role before processing
