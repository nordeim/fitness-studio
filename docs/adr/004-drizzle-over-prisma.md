# ADR-004: Drizzle ORM over Prisma

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The project needs a TypeScript-first ORM for PostgreSQL. The two leading options are:

1. **Prisma** — the most popular TypeScript ORM, with a declarative schema language, generated client, and mature GUI (Prisma Studio)
2. **Drizzle** — a newer, lighter ORM with a SQL-like query builder, no code generation step, and better edge runtime support

The project's `package.json` already declares `drizzle-orm ^0.45.2` + `drizzle-kit ^0.31.10` + `postgres ^3.4.9`.

## Decision

Use **Drizzle ORM** over Prisma.

## Rationale

1. **No code generation step** — Drizzle uses TypeScript directly for schema definitions. No `prisma generate` step, no generated client directory, no stale generated code issues.
2. **SQL-like query builder** — `db.select().from(table).where(eq(table.id, id))` is closer to SQL, making it easier to reason about performance and optimize queries.
3. **Edge runtime compatible** — Drizzle works in Vercel Edge functions; Prisma's generated client has historically had edge runtime issues.
4. **Smaller bundle size** — Drizzle is significantly lighter than Prisma's generated client.
5. **Already in `package.json`** — the repo was scaffolded with Drizzle dependencies.

## Consequences

**Positive:**
- No build step for ORM code generation
- TypeScript-native schema (`.ts` file, not `.prisma`)
- `drizzle-kit` provides migration generation + studio
- Better edge runtime support (future-proofing)
- `ON CONFLICT DO NOTHING` for idempotent inserts (used in seed + booking)

**Negative:**
- Less mature ecosystem than Prisma
- No built-in type-safe relations (must use `relations()` config + `with()` queries)
- Drizzle Studio is less polished than Prisma Studio
- Smaller community — fewer Stack Overflow answers

**Migration cost (if we ever switched to Prisma):**
- Rewrite `src/lib/db/schema/index.ts` in Prisma schema language
- Regenerate all migrations
- Update all queries (`db.select().from()` → `prisma.table.findMany()`)
- Update seed script
- Update ESLint `no-restricted-imports` rule (currently blocks `drizzle-orm` in domain layer)
