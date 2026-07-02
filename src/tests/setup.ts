import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Vitest setup — runs before every test file.
 *
 * - Imports jest-dom matchers (toBeInTheDocument, toBeVisible, etc.)
 * - Cleans up React Testing Library renders between tests
 * - Stubs `window.matchMedia` (jsdom doesn't implement it; required by useReducedMotion hook)
 * - Stubs `IntersectionObserver` (jsdom doesn't implement it; required by useReveal hook)
 */

afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia — mock it for useReducedMotion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// jsdom does not implement IntersectionObserver — mock it for useReveal
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
