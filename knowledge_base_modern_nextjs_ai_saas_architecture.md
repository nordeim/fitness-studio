Here is the complete, comprehensive **Agent Knowledge & Skill File**. 

This document is formatted specifically to be ingested by AI coding agents (such as Cursor, Windsurf, Cline, GitHub Copilot, or custom MCP agents). You should save this as `.cursorrules`, `.windsurfrules`, `AGENTS.md`, or inject it into your agent's system prompt.

***

# 🧠 AGENT KNOWLEDGE BASE: MODERN NEXT.JS 16+ AI SAAS ARCHITECTURE
**Version:** 2026.1 | **Target Runtime:** Next.js 16+, React 19, Node/Edge
**Purpose:** To guide AI coding agents in selecting, architecting, and implementing the optimal modern web stack for high-performance, type-safe, AI-driven SaaS applications.

---

## 1. AGENT DIRECTIVES & CORE PHILOSOPHY
When generating code, scaffolding projects, or making architectural decisions, the Agent **MUST** adhere to the following principles:
1. **Type-Safety is Non-Negotiable:** End-to-end type safety from Database $\rightarrow$ Server Action $\rightarrow$ Client UI. Use Zod for validation, Drizzle for DB, and TypeScript strict mode.
2. **Edge-First, Node-When-Necessary:** Default to Edge-compatible libraries (Drizzle, Better Auth). Reserve Node.js runtimes strictly for heavy SDKs (Stripe, Replicate, Inngest workers).
3. **Asynchronous AI Processing:** AI generation (LLMs, Image/Video) takes 5s–120s. **NEVER** process AI inference synchronously in a Server Action or API Route. **ALWAYS** offload to a durable execution queue (Inngest/Trigger.dev).
4. **Next.js 16 Paradigms:** Use `proxy.ts` for network-level auth/routing guards. Use Server Actions (`"use server"`) for mutations. Use React 19 `useOptimistic` and `useActionState` for UI feedback.

---

## 2. STACK SELECTION MATRIX (DECISION ENGINE)
The Agent must evaluate the user's project requirements and select the appropriate primitives from the 2026 ecosystem.

| Project Requirement | Recommended Primitive | Alternative / Fallback |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | TanStack Start (if avoiding Vercel/Next lock-in) |
| **Database ORM** | **Drizzle ORM** (Edge-native, SQL-like) | Prisma (Only if legacy Node-only ecosystem is required) |
| **Authentication (B2C)** | **Auth.js v5** (Broad provider support) | Clerk (If managed SaaS auth is preferred over self-hosted) |
| **Authentication (B2B)**| **Better Auth** (Native Orgs, RBAC, Plugins) | Auth.js v5 + Custom Multi-tenancy logic |
| **Background Jobs** | **Inngest** (Durable HTTP step-functions) | Trigger.dev (Better UI/Agent orchestration visibility) |
| **Payments / Billing** | **Stripe** (Specifically the **Meters API**) | Lemon Squeezy (If Merchant of Record / Tax handling is needed) |
| **AI Compute** | **Replicate** (Broad open-source model access) | Fal.ai (Superior for low-latency Flux/Image/Video models) |
| **UI Components** | **shadcn/ui** + Tailwind CSS v4 | Tremor (Specifically for Analytics/Dashboard charts) |
| **Forms / Validation** | **React Hook Form** + **Zod** | N/A (This is the absolute standard) |
| **Transactional Email**| **Resend** + React Email | SendGrid / Postmark (Legacy) |

---

## 3. NEXT.JS 16 & REACT 19 ARCHITECTURAL RULES

### 3.1 The `proxy.ts` Paradigm (Replacing `middleware.ts`)
In Next.js 16, network-level request interception is handled by `proxy.ts`. Unlike the old Edge-only middleware, `proxy.ts` supports the Node.js runtime, allowing full database-backed session validation before a route renders.
```typescript
// proxy.ts (Next.js 16 Standard)
import { auth } from "@/lib/auth" // Better Auth or Auth.js
export default async function proxy(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  const url = new URL(req.url)
  
  // Protect Dashboard Routes
  if (!session && url.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", url))
  }
}
export const config = { matcher: ["/dashboard/:path*", "/api/protected/:path*"] }
```

### 3.2 Server Actions vs. API Routes
*   **Server Actions (`actions/` directory):** Use for all client-to-server mutations (form submissions, UI state changes). Must include `"use server"`.
*   **API Routes (`app/api/` directory):** Use **ONLY** for external webhooks (Stripe, Replicate) and Inngest serve endpoints. 
*   **Rule:** Never expose sensitive SDK logic in a Server Action that might be inadvertently bundled to the client. Use the `'server-only'` package.

---

## 4. CORE STACK IMPLEMENTATION PATTERNS

### 4.1 Drizzle ORM (The Data Layer)
**Agent Rules:**
*   Always use `.returning()` on inserts/updates to get the generated IDs/Timestamps without a secondary query.
*   Use Relational Queries (`db.query.*`) for nested reads to avoid N+1 problems.
*   Enforce Multi-tenancy by scoping every query to `organizationId`.

```typescript
// db/schema.ts (Multi-tenant pattern)
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  orgId: text('org_id').references(() => organizations.id, { onDelete: 'cascade' }),
});

// Relational Query Pattern (Avoid manual Joins for nested reads)
const orgWithUsers = await db.query.organizations.findFirst({
  where: eq(organizations.id, orgId),
  with: { users: true } // Type-safe nested array
});
```

### 4.2 Identity: Better Auth vs. Auth.js v5
**Agent Decision Rule:** If the project requires B2B (Teams, Orgs, RBAC, Invites), **DEFAULT TO BETTER AUTH**. If B2C social logins only, Auth.js v5 is acceptable.

**Better Auth Schema Gotcha:**
When using Better Auth with Drizzle, the Agent MUST run the CLI generator and export the schema correctly:
```typescript
// db/schema.ts
export * from "./auth-schema" // GENERATED BY BETTER AUTH CLI
export * from "./app-schema"  // Custom app tables
```

**Better Auth Client Pattern (No Context Provider Needed):**
```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient()

// component.tsx (React 19)
const { data: session, isPending } = authClient.useSession()
```

### 4.3 Durable Execution (Inngest / Trigger.dev)
**Agent Rules:**
*   AI generation and Stripe Meter logging **MUST** be wrapped in Inngest step functions.
*   If an API call fails, Inngest retries *only* the failed step, preserving previous state (e.g., deducting credits).

```typescript
// inngest/functions/generate-ai.ts
import { inngest } from "../client";
import { db } from "@/db";
import { replicate } from "@/lib/replicate";
import { stripe } from "@/lib/stripe";

export const generateAI = inngest.createFunction(
  { id: "generate-ai" },
  { event: "ai/generate.requested" },
  async ({ event, step }) => {
    // Step 1: Deduct Credits (Atomic)
    await step.run("deduct-credits", async () => {
      await db.update(users).set({ credits: sql`credits - 1` }).where(eq(users.id, event.data.userId));
    });

    // Step 2: Call AI Provider (Durable wait)
    const output = await step.run("call-replicate", async () => {
      return await replicate.run("model-name", { input: event.data.prompt });
    });

    // Step 3: Log to Stripe Meters API (Crucial for AI SaaS)
    await step.run("log-stripe-meter", async () => {
      await stripe.billing.meters.createEvent({
        identifier: "ai_tokens_meter",
        timestamp: Math.floor(Date.now() / 1000),
        payload: { stripe_customer_id: event.data.customerId, value: "1" }
      });
    });

    // Step 4: Save to DB
    await step.run("save-result", async () => {
      await db.insert(generations).values({ userId: event.data.userId, output });
    });
  }
);
```

### 4.4 Stripe Meters API (AI Monetization)
**Agent Rules:**
*   **NEVER** use legacy Stripe "Usage Records" for AI apps. They are rate-limited and deprecated for high-throughput.
*   **ALWAYS** use the **Stripe Meters API** (`stripe.billing.meters.createEvent`) to stream token/generation usage asynchronously via Inngest.

---

## 5. REFERENCE ARCHITECTURE: FOLDER STRUCTURE
The Agent MUST scaffold Next.js 16 projects using this exact separation of concerns:

```text
src/
├── app/
│   ├── (auth)/            # Login/Signup UI (React 19)
│   ├── (dashboard)/       # Protected Server Components
│   ├── api/
│   │   ├── inngest/route.ts     # Inngest serve endpoint
│   │   └── webhooks/            # Raw Stripe/Replicate ingestion
├── actions/               # NEXT.JS 16 STANDARD: Server Actions
│   ├── ai.ts              # "use server" -> triggers Inngest
│   └── billing.ts         # Stripe Checkout session creation
├── db/
│   ├── index.ts           # Drizzle client (Edge-compatible)
│   ├── schema.ts          # Exports auth-schema + app-schema
│   └── migrations/
├── inngest/               # Durable Background Jobs
│   ├── client.ts
│   └── functions/         
├── lib/
│   ├── auth.ts            # Better Auth / Auth.js config
│   ├── auth-client.ts     # Client-side hooks
│   ├── stripe.ts          # Stripe SDK & Meters helpers
│   └── ai-provider.ts     # Replicate / Fal.ai abstraction
├── components/
│   ├── ui/                # shadcn/ui primitives
│   └── dashboard/         # Tremor charts, complex widgets
└── proxy.ts               # NEXT.JS 16 Network Guard (Replaces middleware.ts)
```

---

## 6. ANTI-PATTERNS & RED FLAGS (AGENT BLOCKLIST)
The Agent **MUST REFUSE** to generate code that includes the following anti-patterns:

1.  **Synchronous AI in Server Actions:** Calling `replicate.run()` or `openai.chat.completions.create()` directly inside a `"use server"` action. *Fix: Trigger an Inngest event and return a `generationId` to the client.*
2.  **Edge/Node Fragmentation:** Using Prisma in `proxy.ts` or Edge routes. *Fix: Use Drizzle ORM which runs natively in Edge and Node.*
3.  **Context Provider Bloat:** Wrapping the entire Next.js App Router in `<SessionProvider>` or `<QueryClientProvider>` when React 19 Server Components and Better Auth hooks can fetch data natively.
4.  **Unscoped Multi-tenant Queries:** Writing `db.select().from(users)` without a `.where(eq(users.orgId, session.user.orgId))` clause. *Fix: Always enforce tenant scoping or Row Level Security (RLS).*
5.  **Polling without Optimistic UI:** Making the user stare at a blank screen while an AI job processes. *Fix: Use React 19 `useOptimistic` to immediately show a "Processing..." skeleton in the UI.*

---

## 7. COMPLEMENTARY ECOSYSTEM (DEFAULT INSTALLS)
When initializing a project, the Agent should recommend/install these packages to complete the 2026 stack:
*   **Validation:** `zod` (Shared between Drizzle, Inngest, and React Hook Form)
*   **UI/Charts:** `tremor` (For SaaS analytics dashboards), `sonner` (For toast notifications)
*   **Email:** `resend`, `@react-email/components`
*   **State (Optional):** `zustand` (Only for complex client-side AI chat/queue state)
*   **Icons:** `lucide-react`

---
*End of Knowledge File. Agent is now primed to architect, scaffold, and debug Next.js 16 AI SaaS applications.*

---

https://chat.qwen.ai/s/8f4a8a27-1da2-428f-bceb-f74fabfab63e?fev=0.2.68 

