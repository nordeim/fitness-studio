# ADR-003: Auth.js v5 Beta Pin + JWT Strategy

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

Auth.js v5 (`next-auth@5.0.0-beta.31`) is the latest authentication library for Next.js, but it's still in beta. The stable v4 (`next-auth@4.x`) is mature but doesn't support App Router natively. The project needs authentication for the admin section.

Two session strategies are available:
1. **Database sessions** — session data stored in the `sessions` table, validated per request
2. **JWT sessions** — session data encoded in a signed JWT cookie, stateless

## Decision

1. **Pin `next-auth@5.0.0-beta.31`** — the beta supports App Router, which is non-negotiable for Next.js 16. Pin the exact version via `renovate.json` to prevent accidental major upgrades.

2. **Use JWT strategy** — stateless, no DB sessions table needed, works on Vercel Edge runtime.

3. **Do NOT use `DrizzleAdapter`** — the adapter's type expectations (sessionToken as primary key) conflict with our schema (id as PK + sessionToken unique). JWT strategy doesn't need the adapter anyway.

4. **Set `trustHost: true`** — mandatory for reverse-proxy deployments (Vercel, Cloudflare). Without it, Auth.js falls back to `AUTH_URL` for callback URLs, which can cause P0 production outages if `AUTH_URL` leaks as `localhost`.

## Consequences

**Positive:**
- App Router native support
- Stateless — no DB query per request for session validation
- Edge-compatible — JWT verification works in `proxy.ts` (though we only check cookie presence at edge)
- No `DrizzleAdapter` type mismatch issues

**Negative:**
- Beta software — potential breaking changes before stable v5.0 GA
- Session revocation requires JWT expiry (30 days) — no instant logout from DB
- `trustHost: true` trusts the `Host` header — acceptable behind Vercel/Cloudflare but would be a risk if deployed without a reverse proxy

**Mitigation:**
- `renovate.json` holds the next-auth major
- 30-day JWT expiry is acceptable for a single-admin studio site
- Rate limiting on login (5 per 10 min) mitigates brute-force risk
