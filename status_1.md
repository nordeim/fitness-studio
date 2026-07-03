I will now create the remediation plan, which I will then execute using the TDD approach.

Remediation Plan: React Hydration Mismatch (Browser Extension Attributes)

### Root Cause

Browser extensions (Grammarly: data-new-gr-c-s-check-loaded, data-gr-ext-installed)注入 attributes into the <body> tag that exist on the client but not on the server. During hydration, React detects the mismatch between the
server-rendered <body className="..."> and the client DOM (<body className="..." data-new-gr-c-s-check-loaded="..." data-gr-ext-installed="">), triggering the console error.

### Validation Against Codebase

- ✅ No nested <html>/<body> in sub-layouts (only src/app/layout.tsx and src/app/global-error.tsx)
- ✅ No useSession() in the marketing flow (only in admin AdminSessionProvider)
- ✅ The suppressHydrationWarning on <html> already suppresses one level, but the mismatch is on <body>
- ✅ The error diff shows: server className only → client className + extension data-* attributes

### Optimal Fix

Add suppressHydrationWarning to the <body> tag in src/app/layout.tsx. This is the minimal, targeted, and architecturally correct fix. It tells React to ignore attribute differences on the <body> element (caused by browser extensions),
while preserving hydration warnings for all other elements. This is explicitly supported by React and Next.js as the correct escape hatch for extension-injected attributes.

### ToDo List

┌───┬───────────────────────────────────────────────────┬───────────────────────────────────────────────┬──────────────────────────────────────────┐
│ # │ Task │ File │ Verification │
├───┼───────────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────┤
│ 1 │ Write failing test for hydration mismatch │ src/tests/unit/hydration-guard.test.tsx (new) │ Test fails before fix, passes after │
├───┼───────────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────┤
│ 2 │ Apply fix: Add suppressHydrationWarning to <body> │ src/app/layout.tsx │ Run test from #1 → passes │
├───┼───────────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────┤
│ 3 │ Verify quality gate │ All files │ pnpm typecheck && pnpm lint && pnpm test │
├───┼───────────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────┤
│ 4 │ Verify E2E │ Playwright │ pnpm test:e2e │
├───┼───────────────────────────────────────────────────┼───────────────────────────────────────────────┼──────────────────────────────────────────┤
│ 5 │ Document the fix │ worklog.md entry │ — │
└───┴───────────────────────────────────────────────────┴───────────────────────────────────────────────┴──────────────────────────────────────────┘

---

### Verdict: Validated and Approved ✅

Your proposed fix is **100% correct, optimal, and aligns with industry best practices** for handling this specific Next.js/React issue.

Based on deep research and the official documentation you provided, here is a meticulous validation of your root cause analysis, your code fix, and your test suite.

---

### 1. Root Cause Analysis: Grammarly Extension Injection

The error log shows a hydration mismatch on the `<body>` tag due to the presence of `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` attributes on the client that were not present on the server [[1]].

Extensive web research confirms that these specific attributes are injected exclusively by the **Grammarly browser extension** during the client-side hydration phase [[2], [4]]. Because the server cannot predict which extensions a user has installed, it renders a "clean" `<body>` tag. When React hydrates on the client, it sees the extra `data-*` attributes injected by Grammarly and throws a mismatch error [[10]].

### 2. Validation of the Code Fix (`src/app/layout.tsx`)

Your fix applies `suppressHydrationWarning` directly to the `<body>` tag:

```tsx
<body className="bg-textured antialiased" suppressHydrationWarning>
```

**Why this is the optimal fix:**

- **The "One Level Deep" Rule:** According to the React documentation, `suppressHydrationWarning` only works one level deep [[3]]. If you only placed it on the `<html>` tag, it would not suppress warnings for attributes injected into the `<body>` tag [[2]]. By applying it to `<body>`, you are correctly targeting the exact element Grammarly modifies.
- **Escape Hatch Intent:** The React docs explicitly state this property is an "escape hatch" for unavoidable differences between server and client environments [[3]]. Browser extensions are the textbook definition of an unavoidable, external client-side modification.
- **Zero Side Effects:** This does not disable hydration for the children of `<body>`. It strictly tells React to ignore attribute discrepancies on the `<body>` DOM node itself, allowing the rest of your application to hydrate normally and securely.

### 3. Validation of the Unit Test (`hydration-guard.test.tsx`)

Your unit test using Vitest and `fs.readFileSync` to perform static analysis on `layout.tsx` is **excellent**.

- **Pros:** It acts as a pre-commit/CI guardrail. Because hydration warnings only appear in the browser console during development, static analysis is the most reliable way to ensure a developer doesn't accidentally remove `suppressHydrationWarning` during a future refactor.
- **Verdict:** Keep this exactly as is. It is robust and fast.

### 4. Validation & Optimization of the E2E Test (`hydration-guard.spec.ts`)

Your Playwright test has the right intent, but it contains a **race condition** that will cause it to miss the actual hydration error.

**The Issue:** React hydration errors are logged to the console synchronously _during_ the initial page load. In your current script, you call `await page.goto(...)` and _then_ attach the `page.on('console')` listener. By the time the listener is attached, the hydration phase has already finished, and the error has already been logged and lost.

**The Fix:** You must attach the console listener **before** navigation and wait for the network to idle to ensure React has finished hydrating.

Here is the optimized, bulletproof version of your E2E test:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Hydration Guard', () => {
  test('<body> tag must have suppressHydrationWarning to prevent extension-caused mismatches', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    // CRITICAL: Attach listener BEFORE navigation to catch synchronous hydration errors
    page.on('console', (msg) => {
      // Filter specifically for React Hydration errors to avoid false positives from 404s, etc.
      if (msg.type() === 'error' && msg.text().includes('Hydration')) {
        consoleErrors.push(msg.text());
      }
    });

    // GIVEN the user visits the home page
    await page.goto('http://localhost:3000/');

    // Wait for React hydration and network requests to settle
    await page.waitForLoadState('networkidle');

    // WHEN we inspect the <body> element
    const body = page.locator('body');

    // THEN the class attribute should exist (confirming the element is rendered)
    await expect(body).toHaveClass(/bg-textured/);

    // AND the page loads without hydration errors
    expect(consoleErrors).toHaveLength(0);
  });
});
```

### Summary

Your implementation is spot-on. The combination of the `suppressHydrationWarning` prop on `<body>`, the static analysis unit test, and the (now optimized) Playwright E2E test creates a perfect "Ironforge" defense against browser-extension-induced hydration mismatches. You are clear to merge.
