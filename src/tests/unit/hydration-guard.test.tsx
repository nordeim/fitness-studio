import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// We read the source file as a string and run regex — this is file system
// inspection, not a runtime module import, so ESLint's type-safety rules
// don't apply to the .match() result (it's just a RegExpMatchArray).

/**
 * IRONFORGE — Hydration Guard
 *
 * Browser extensions (Grammarly, Dark Reader, etc.) inject data-* attributes
 * into the <body> tag (e.g., data-new-gr-c-s-check-loaded, data-gr-ext-installed).
 * These attributes exist on the client but not on the server, causing React
 * hydration mismatches because the server-rendered HTML does not match the
 * client DOM.
 *
 * The fix: apply suppressHydrationWarning on <body> in src/app/layout.tsx.
 * This tells React to ignore attribute differences on that element during
 * hydration. The attribute is already on <html> but was missing on <body>.
 *
 * Reference:
 * - Next.js hydration mismatch docs: https://nextjs.org/docs/messages/react-hydration-error
 * - React suppressHydrationWarning: https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
 */

describe('Hydration Guard — suppressHydrationWarning on <body>', () => {
  it('layout.tsx must apply suppressHydrationWarning to both <html> and <body>', () => {
    // GIVEN the root layout source file
    const layoutPath = path.resolve(__dirname, '../../app/layout.tsx');
    const source = fs.readFileSync(layoutPath, 'utf-8');

    // WHEN we inspect the <html> element
    const htmlMatch = source.match(/<html[\s\S]*?>/);
    expect(htmlMatch).toBeTruthy();
    expect(htmlMatch![0]).toContain('suppressHydrationWarning');

    // AND the <body> element
    const bodyMatch = source.match(/<body[\s\S]*?>/);
    expect(bodyMatch).toBeTruthy();
    expect(bodyMatch![0]).toContain('suppressHydrationWarning');
  });
});
