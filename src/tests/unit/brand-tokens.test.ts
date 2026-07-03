import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * IRONFORGE — Brand-token test.
 *
 * Reads `src/app/globals.css` raw text (after stripping comments) and
 * asserts:
 *   1. No forbidden colors present (anti-generic enforcement).
 *   2. Required tokens defined (bg, fg, accent).
 *   3. WCAG AAA contrast verified for body text on background.
 *
 * Reference: Skills KB §16 (testing patterns).
 */

const globalsPath = resolve(__dirname, '../../app/globals.css');
const rawCss = readFileSync(globalsPath, 'utf-8');
// Strip comments before regex matching (otherwise docblocks trigger false positives)
const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

const FORBIDDEN_COLORS = [
  '#7c3aed', // violet-600
  '#a855f7', // purple-400
  '#8b5cf6', // violet-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#fde68a', // amber-100
  '#fcd34d', // amber-200
];

describe('brand tokens', () => {
  describe('forbidden colors (anti-generic enforcement)', () => {
    FORBIDDEN_COLORS.forEach((color) => {
      it(`rejects forbidden color ${color}`, () => {
        expect(css).not.toContain(color);
      });
    });
  });

  describe('required tokens', () => {
    it('defines --color-bg as pure black (#0a0a0a)', () => {
      expect(css).toContain('--color-bg: #0a0a0a');
    });

    it('defines --color-fg as #f5f5f5 (18.7:1 contrast on bg)', () => {
      expect(css).toContain('--color-fg: #f5f5f5');
    });

    it('defines --color-accent as #FF5400 (neon orange)', () => {
      expect(css).toMatch(/--color-accent:\s*#FF5400/i);
    });

    it('defines --color-silver as #C8C8C8 (metallic chrome)', () => {
      expect(css).toMatch(/--color-silver:\s*#C8C8C8/i);
    });

    it('defines the 4 brand fonts', () => {
      expect(css).toContain('--font-display:');
      expect(css).toContain('--font-heading:');
      expect(css).toContain('--font-body:');
      expect(css).toContain('--font-mono:');
    });

    it('defines z-index scale', () => {
      expect(css).toContain('--z-behind:');
      expect(css).toContain('--z-overlay:');
      expect(css).toContain('--z-modal:');
      expect(css).toContain('--z-toast:');
    });
  });

  describe('WCAG AAA contrast verification', () => {
    // WCAG AAA: 7:1 normal text, 4.5:1 large text (≥18px)
    // Contrast formula: (L1 + 0.05) / (L2 + 0.05), L1 = lighter, L2 = darker
    // Where L = relative luminance = 0.2126*R + 0.7152*G + 0.0722*B (sRGB linearized)

    function srgbToLinear(c: number): number {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    function luminance(hex: string): number {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
    }

    function contrast(fgHex: string, bgHex: string): number {
      const l1 = luminance(fgHex);
      const l2 = luminance(bgHex);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    it('body text #f5f5f5 on bg #0a0a0a passes AAA (≥7:1)', () => {
      const ratio = contrast('#f5f5f5', '#0a0a0a');
      expect(ratio).toBeGreaterThanOrEqual(7);
      // Sanity check: computed ~18.16:1 (far exceeds AAA 7:1)
      expect(ratio).toBeCloseTo(18.16, 1);
    });

    it('silver #C8C8C8 on bg #0a0a0a passes AAA (≥7:1)', () => {
      const ratio = contrast('#C8C8C8', '#0a0a0a');
      expect(ratio).toBeGreaterThanOrEqual(7);
    });

    it('accent #FF5400 on bg #0a0a0a passes AAA for large text (≥4.5:1)', () => {
      const ratio = contrast('#FF5400', '#0a0a0a');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('muted #8a8a8a on bg #0a0a0a passes AA-normal (≥4.5:1)', () => {
      const ratio = contrast('#8a8a8a', '#0a0a0a');
      // P1 fix: raised from #6a6a6a (3.7:1) to #8a8a8a (5.5:1) — passes AA-normal
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('reduced motion support', () => {
    it('includes prefers-reduced-motion media query', () => {
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    });

    it('disables animations entirely (not just slows)', () => {
      expect(css).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
      expect(css).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    });
  });
});
