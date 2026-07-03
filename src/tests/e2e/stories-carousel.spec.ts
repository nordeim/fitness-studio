import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Stories carousel E2E.
 *
 * Verifies:
 *  - Stories section renders with heading
 *  - 6 story cards render in the track
 *  - Carousel has prev/next buttons + dot indicators
 *  - Counter shows "01 / 06"
 *  - Next button advances to card 2
 *  - Prev button wraps from card 1 to card 6
 *  - Dot indicators jump to specific cards
 *  - Keyboard arrows navigate when viewport is focused
 */

test.describe('Stories carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#stories');
  });

  test('renders section with heading and subhead', async ({ page }) => {
    await expect(page.getByText('REAL TRANSFORMATIONS')).toBeVisible();
    await expect(
      page.getByText(/No paid actors. No before\/after photo tricks./),
    ).toBeVisible();
  });

  test('renders 6 story cards', async ({ page }) => {
    // Each card is in a <li> with role="group"
    const cards = page.getByRole('group');
    await expect(cards).toHaveCount(6);
  });

  test('renders prev/next buttons and dot indicators', async ({ page }) => {
    await expect(page.getByRole('button', { name: /previous story/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /next story/i })).toBeVisible();

    const dots = page.getByRole('tab', { name: /go to story/i });
    await expect(dots).toHaveCount(6);
  });

  test('counter shows "01 / 06" initially', async ({ page }) => {
    await expect(page.getByText('01', { exact: true })).toBeVisible();
    await expect(page.getByText('06', { exact: true })).toBeVisible();
  });

  test('next button advances to card 2', async ({ page }) => {
    await page.getByRole('button', { name: /next story/i }).click();
    await expect(page.getByText('02', { exact: true })).toBeVisible();
  });

  test('prev button wraps from card 1 to card 6', async ({ page }) => {
    // Initially at card 1
    await expect(page.getByText('01', { exact: true })).toBeVisible();

    // Click prev — should wrap to last card
    await page.getByRole('button', { name: /previous story/i }).click();
    await expect(page.getByText('06', { exact: true })).toBeVisible();
  });

  test('dot indicators jump to specific cards', async ({ page }) => {
    // Click the 4th dot
    const dots = page.getByRole('tab', { name: /go to story/i });
    await dots.nth(3).click();
    await expect(page.getByText('04', { exact: true })).toBeVisible();
  });

  test('keyboard arrows navigate when viewport is focused', async ({ page }) => {
    // Tab to the carousel viewport
    const viewport = page.getByRole('region', { name: /member transformation stories/i });
    if (await viewport.isVisible().catch(() => false)) {
      await viewport.focus();
    } else {
      // Fallback: click the first dot then use keyboard
      await page.getByRole('tab', { name: /go to story/i }).first().click();
    }

    // Arrow Right should advance
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('02', { exact: true })).toBeVisible();

    // Arrow Left should go back
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByText('01', { exact: true })).toBeVisible();
  });

  test('first card shows member name + quote', async ({ page }) => {
    await expect(page.getByText('David K.')).toBeVisible();
    await expect(page.getByText(/I walked in unable to deadlift 315/)).toBeVisible();
  });

  test('first card shows highlight PR', async ({ page }) => {
    await expect(page.getByText('500 lb deadlift PR')).toBeVisible();
  });
});
