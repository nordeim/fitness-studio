# ADR-001: Adopt 5-Layer Golden Rule Architecture

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The IRONFORGE codebase needs a clear separation between routing, UI composition, business logic, and infrastructure. Without enforced boundaries, feature code tends to leak database queries into components, React hooks into API routes, and Next.js APIs into business logic — making the codebase hard to test, hard to refactor, and hard to reason about.

## Decision

Adopt the 5-layer golden rule from the `nextjs16-react19-next-auth5-drizzle-orm` skill:

```
Layer 0  src/proxy.ts            → Edge cookie check
Layer 1  src/app/                → Routes, metadata, Suspense
Layer 2  src/features/           → UI composition, data binding, mutations
Layer 3  src/features/*/domain/  → Pure business logic (Zod schemas, no runtime imports)
Layer 4  src/lib/                → Infrastructure (DB, Auth, Inngest, R2, Stripe, AI)
```

Enforce Layer 3 purity via ESLint `no-restricted-imports` rule scoped to `src/features/*/domain/**/*.ts`. The rule blocks imports of React, Next.js, Drizzle, and all infrastructure packages — only `import type` is allowed.

## Consequences

**Positive:**
- Domain schemas are pure TypeScript — testable in isolation without mocking React/Next/DB
- Clear ownership: each layer has a single responsibility
- Feature modules are self-contained (data + domain + queries + actions + components)
- New developers can understand the codebase by following the layer hierarchy

**Negative:**
- More files per feature (data.ts + domain/schemas.ts + queries.ts + actions.ts + component.tsx)
- The `no-restricted-imports` rule can be surprising — developers must use `import type` for cross-layer type references
- Dynamic imports are needed for infrastructure in queries/actions (to avoid crashing at module load when env vars are missing)
