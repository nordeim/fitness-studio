CREATE TYPE "public"."user_role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(40) NOT NULL,
	"provider" varchar(40) NOT NULL,
	"provider_account_id" varchar(100) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(40),
	"scope" varchar(200),
	"id_token" text,
	"session_state" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "class_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid,
	"coach_id" uuid,
	"starts_at" timestamp with time zone NOT NULL,
	"duration_min" integer DEFAULT 60,
	"capacity" integer DEFAULT 8,
	"location" varchar(120) DEFAULT '47 Eastbound Alley, NYC'
);
--> statement-breakpoint
CREATE TABLE "coaches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(80) NOT NULL,
	"title" varchar(120) NOT NULL,
	"bio" text NOT NULL,
	"certifications" text[],
	"specialties" text[],
	"signature_workout" varchar(120),
	"portrait_key" varchar(200),
	"years_exp" integer,
	"order" integer DEFAULT 0,
	"published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "coaches_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(160) NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source" varchar(40) DEFAULT 'site_footer',
	CONSTRAINT "newsletter_subs_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"goal" varchar(40) NOT NULL,
	"title" varchar(120) NOT NULL,
	"subtitle" varchar(200),
	"description" text NOT NULL,
	"duration" varchar(40),
	"sessions_per_week" integer,
	"intensity" varchar(20),
	"hero_key" varchar(200),
	"price_cents" integer,
	"stripe_price_id" varchar(80),
	"coach_id" uuid,
	"order" integer DEFAULT 0,
	"published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar(100) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"member_name" varchar(80) NOT NULL,
	"member_age" integer,
	"program_slug" varchar(80),
	"weeks" integer,
	"before_key" varchar(200),
	"after_key" varchar(200),
	"quote" text NOT NULL,
	"timeline" jsonb,
	"video_key" varchar(200),
	"published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trial_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"email" varchar(160) NOT NULL,
	"phone" varchar(40),
	"goal" varchar(40) NOT NULL,
	"preferred_time" varchar(20) NOT NULL,
	"preferred_coach_id" uuid,
	"notes" text,
	"status" varchar(20) DEFAULT 'received',
	"idempotency_key" varchar(60) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trial_requests_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80),
	"email" varchar(160) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" varchar(500),
	"password_hash" varchar(100),
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(160) NOT NULL,
	"token" varchar(100) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_slots" ADD CONSTRAINT "class_slots_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_slots" ADD CONSTRAINT "class_slots_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trial_requests" ADD CONSTRAINT "trial_requests_preferred_coach_id_coaches_id_fk" FOREIGN KEY ("preferred_coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_provider_idx" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "class_slots_starts_at_idx" ON "class_slots" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "coaches_slug_idx" ON "coaches" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "programs_goal_idx" ON "programs" USING btree ("goal");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trial_requests_created_idx" ON "trial_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vt_identifier_idx" ON "verification_tokens" USING btree ("identifier");