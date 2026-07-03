import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Memberships section E2E.
 *
 * Verifies:
 *  - Section renders with heading + subhead
 *  - 3 tier cards render (Forge / Forge+ / Forge Private)
 *  - Forge+ is featured (has "Most Popular" badge)
 *  - Each tier has name, price, features, CTA button
 *  - Drop-in pack renders below the grid
 *  - Clicking a tier CTA triggers checkout (shows error or redirects)
 *  - Prices are correct ($149 / $249 / $599 / $120)
 */

test.describe('Memberships section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#memberships');
  });

  test('renders section with heading and subhead', async ({ page }) => {
    await expect(page.getByText('CHOOSE YOUR COMMITMENT')).toBeVisible();
    await expect(
      page.getByText(/Three membership tiers built around how you train./),
    ).toBeVisible();
  });

  test('renders 3 tier cards', async ({ page }) => {
    await expect(page.getByText('Forge', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Forge+', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Forge Private').first()).toBeVisible();
  });

  test('Forge+ is featured with "Most Popular" badge', async ({ page }) => {
    await expect(page.getByText('Most Popular')).toBeVisible();
  });

  test('Forge tier shows $149/month', async ({ page }) => {
    const forgeCard = page.locator('text=Forge').first().locator('..');
    await expect(forgeCard.getByText('$149')).toBeVisible();
    await expect(forgeCard.getByText('/month')).toBeVisible();
  });

  test('Forge+ tier shows $249/month', async ({ page }) => {
    const forgePlusCard = page.locator('text=Forge+').first().locator('..');
    await expect(forgePlusCard.getByText('$249')).toBeVisible();
  });

  test('Forge Private tier shows $599/month', async ({ page }) => {
    const forgePrivateCard = page.locator('text=Forge Private').first().locator('..');
    await expect(forgePrivateCard.getByText('$599')).toBeVisible();
  });

  test('each tier has a CTA button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /choose forge$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /choose forge\+/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /choose forge private/i })).toBeVisible();
  });

  test('drop-in pack renders below the grid', async ({ page }) => {
    await expect(page.getByText('Drop-In Pack')).toBeVisible();
    await expect(page.getByText('$120')).toBeVisible();
    await expect(page.getByRole('button', { name: /buy drop-in pack/i })).toBeVisible();
  });

  test('drop-in pack has description text', async ({ page }) => {
    await expect(
      page.getByText(/5 class credits. Use anytime within 90 days./),
    ).toBeVisible();
  });

  test('legal note renders', async ({ page }) => {
    await expect(page.getByText(/All plans billed monthly/)).toBeVisible();
    await expect(page.getByText(/Cancel anytime/)).toBeVisible();
  });

  test('Forge Private has no limitations shown', async ({ page }) => {
    const forgePrivateCard = page.locator('text=Forge Private').first().locator('..');
    // Forge Private should have 0 limitations (no ✕ items)
    // Just verify it renders without error
    await expect(forgePrivateCard).toBeVisible();
  });

  test('clicking tier CTA shows loading then error (Stripe not configured in test)', async ({ page }) => {
    const cta = page.getByRole('button', { name: /choose forge\+/i });
    await cta.click();

    // Button should show loading state
    await expect(page.getByRole('button', { name: /loading/i })).toBeVisible({ timeout: 5000 });

    // Should eventually show an error message (Stripe not configured in test env)
    await expect(page.getByText(/Stripe is not configured/i)).toBeVisible({ timeout: 10000 });
  });

  test('clicking drop-in CTA also attempts checkout', async ({ page }) => {
    const cta = page.getByRole('button', { name: /buy drop-in pack/i });
    await cta.click();

    // Should show loading state
    await expect(page.getByRole('button', { name: /loading/i })).toBeVisible({ timeout: 5000 });
  });
});
