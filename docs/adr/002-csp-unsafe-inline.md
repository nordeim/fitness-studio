# ADR-002: CSP `unsafe-inline` for Styles (Next.js App Router)

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

Next.js 16 App Router injects inline `<script>` chunks for router state and inline `<style>` for CSS. A strict Content-Security-Policy without `'unsafe-inline'` in `script-src` and `style-src` would block these, breaking the application entirely.

The production-hardened alternative is nonce-based CSP — generating a unique nonce per request and adding it to allowed `script-src`. Next.js 16 has built-in support for this via `headers()` in `next.config.ts`.

## Decision

Use `'unsafe-inline'` in both `script-src` and `style-src` for the initial ship. Document this as a future hardening sprint.

**NOT included:** `'unsafe-eval'` — this was present in the original cloned repo's CSP but is NOT required for Next.js 16 production builds. It was removed in Phase 0.

## Consequences

**Positive:**
- Application renders correctly without nonce management overhead
- No per-request nonce generation complexity
- `'unsafe-eval'` removed — tighter than the original cloned config

**Negative:**
- `'unsafe-inline'` in `script-src` allows injected inline scripts (XSS risk if a dependency is compromised)
- A future hardening sprint should switch to nonce-based CSP

**Future work:**
- Implement nonce-based CSP using Next.js 16's `headers()` function
- Generate `crypto.randomUUID()` per request, add to `script-src 'nonce-{nonce}'`
- Apply nonce to all inline scripts via Next.js's built-in nonce support
