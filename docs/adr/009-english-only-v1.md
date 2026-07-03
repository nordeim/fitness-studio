# ADR-009: English-Only for v1

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The IRONFORGE brand targets an NYC-based fitness studio. The question is whether to support multiple languages (i18n) from the start or ship English-only for v1.

Adding `next-intl` or `next-i18next` would require:
- Translation JSON files for every string
- Locale routing (`/en/`, `/es/`, etc.)
- Language switcher UI
- hreflang tags for SEO
- Ongoing translation maintenance

## Decision

Ship **English-only** for v1. Do NOT add `next-intl` or any i18n library.

## Rationale

1. **Single location** — IRONFORGE is a single studio in NYC. The audience is English-speaking.
2. **Complexity cost** — i18n adds routing complexity, translation file management, and SEO overhead. Not justified for a single-location brand.
3. **Content volume** — The site has ~200 strings. Translating to even one additional language would be premature.
4. **Future optionality** — If i18n is needed later, the content is in feature modules (`data.ts` files), not hardcoded in components. Adding i18n would be a content-layer change, not an architectural one.

## Consequences

**Positive:**
- Simpler routing (no locale prefixes)
- No translation file maintenance
- Faster build (no locale variants)
- Cleaner URLs (`/programs/conjugate-max-effort` not `/en/programs/conjugate-max-effort`)

**Negative:**
- Not accessible to non-English speakers
- If the studio expands internationally, i18n migration would touch every `data.ts` file

**Future migration path:**
- Add `next-intl` (App Router native)
- Extract strings from `data.ts` files into locale JSON
- Add locale routing middleware
- Add hreflang tags to metadata
