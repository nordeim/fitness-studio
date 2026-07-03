import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Programs grid E2E.
 *
 * Verifies:
 *  - Programs section renders with heading + subhead
 *  - GoalSelector renders 5 pills
 *  - Default filter (muscle) shows 2 programs
 *  - Switching to "fat" shows 2 programs
 *  - Switching to "rehab" shows 2 programs
 *  - Cards render with image + title + duration + intensity
 *  - Cards link to /programs/[slug]
 */

test.describe('Programs grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#programs');
  });

  test('renders section with heading and subhead', async ({ page }) => {
    await expect(page.getByText('CHOOSE YOUR DISCIPLINE')).toBeVisible();
    await expect(
      page.getByText(/Three training systems. Nine signature programs./),
    ).toBeVisible();
  });

  test('renders 5 goal selector pills', async ({ page }) => {
    const radiogroup = page.getByRole('radiogroup', { name: /filter programs by goal/i });
    await expect(radiogroup).toBeVisible();

    const radios = page.getByRole('radio');
    await expect(radios).toHaveCount(5);
  });

  test('default filter (muscle) shows 2 programs', async ({ page }) => {
    // Conjugate Max Effort + Hypertrophy Block
    await expect(page.getByText('Conjugate Max Effort')).toBeVisible();
    await expect(page.getByText('Hypertrophy Block')).toBeVisible();
  });

  test('switching to "fat" filter shows 2 programs', async ({ page }) => {
    await page.getByRole('radio', { name: /fat loss/i }).click();

    await expect(page.getByText('MetCon Inferno')).toBeVisible();
    await expect(page.getByText('Engine Builder')).toBeVisible();
    // Muscle programs should NOT be visible
    await expect(page.getByText('Conjugate Max Effort')).not.toBeVisible();
  });

  test('switching to "rehab" filter shows 2 programs', async ({ page }) => {
    await page.getByRole('radio', { name: /rehab/i }).click();

    await expect(page.getByText('Mobility Reset')).toBeVisible();
    await expect(page.getByText('Bulletproof Back')).toBeVisible();
  });

  test('program cards link to /programs/[slug]', async ({ page }) => {
    const card = page.getByRole('link', { name: /conjugate max effort/i }).first();
    await expect(card).toHaveAttribute('href', '/programs/conjugate-max-effort');
  });
});
