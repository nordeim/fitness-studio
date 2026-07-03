-- IRONFORGE migration 0002 — enforce NOT NULL on published + order columns (H4 fix)
--
-- Root cause: The `published` and `order` columns on coaches and programs
-- were declared with `.default()` but without `.notNull()`. Drizzle therefore
-- inferred `boolean | null` and `number | null` respectively, while the Zod
-- schemas expect `boolean` and `number`. This forced 20 `as unknown as` casts
-- in the query modules (Finding H4).
--
-- This migration adds `NOT NULL` to all affected columns so the Drizzle
-- inferred types match the Zod schema types, allowing the casts to be removed.
--
-- Safety: Before setting NOT NULL, we update any existing NULL values to
-- the column default. This prevents the migration from failing on databases
-- that may have NULL values from manual inserts.

-- ── Coaches: published ──
UPDATE "coaches" SET "published" = false WHERE "published" IS NULL;--> statement-breakpoint
ALTER TABLE "coaches" ALTER COLUMN "published" SET NOT NULL;--> statement-breakpoint

-- ── Coaches: order ──
UPDATE "coaches" SET "order" = 0 WHERE "order" IS NULL;--> statement-breakpoint
ALTER TABLE "coaches" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint

-- ── Programs: published ──
UPDATE "programs" SET "published" = false WHERE "published" IS NULL;--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "published" SET NOT NULL;--> statement-breakpoint

-- ── Programs: order ──
UPDATE "programs" SET "order" = 0 WHERE "order" IS NULL;--> statement-breakpoint
ALTER TABLE "programs" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint

-- ── Stories: published ──
UPDATE "stories" SET "published" = false WHERE "published" IS NULL;--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "published" SET NOT NULL;
