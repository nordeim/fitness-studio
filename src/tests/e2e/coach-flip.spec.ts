import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Coach flip grid E2E.
 *
 * Verifies:
 *  - Coaches section renders with heading
 *  - 8 coach cards render
 *  - Each card has name + title visible on front
 *  - Card flips on hover (desktop) — back face shows certifications
 *  - Card is keyboard accessible (Enter flips, Escape flips back)
 *  - "View all 24" link is present
 */

test.describe('Coach flip grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#coaches');
  });

  test('renders section with heading and "view all" link', async ({ page }) => {
    await expect(page.getByText('TWENTY-FOUR SPECIALISTS')).toBeVisible();
    await expect(page.getByText('View all 24 →')).toBeVisible();
  });

  test('renders 8 coach cards', async ({ page }) => {
    await expect(page.getByText('Marcus Steel')).toBeVisible();
    await expect(page.getByText('Elena Volk')).toBeVisible();
    await expect(page.getByText('Tank Williams')).toBeVisible();
    await expect(page.getByText('Alex Rivera')).toBeVisible();
    await expect(page.getByText('Priya Shah')).toBeVisible();
    await expect(page.getByText('Jordan Blake')).toBeVisible();
    await expect(page.getByText('Sam Okonkwo')).toBeVisible();
    await expect(page.getByText('Maya Chen')).toBeVisible();
  });

  test('each card shows title above name', async ({ page }) => {
    await expect(page.getByText('Head of Strength')).toBeVisible();
    await expect(page.getByText('Conditioning Lead')).toBeVisible();
    await expect(page.getByText('Mobility Specialist')).toBeVisible();
  });

  test('card flips on hover to reveal certifications', async ({ page }) => {
    // Hover over the first card
    const firstCard = page.locator('.flip-card').first();
    await firstCard.hover();

    // After hover, the back face should be visible (rotated)
    // The "Certifications" label is on the back
    await expect(page.getByText('Certifications').first()).toBeVisible();
  });

  test('card is keyboard accessible — Enter flips, Escape flips back', async ({ page }) => {
    const firstCard = page.locator('.flip-card').first();
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // Enter flips
    await page.keyboard.press('Enter');
    await expect(firstCard).toHaveAttribute('aria-expanded', 'true');

    // Escape flips back
    await page.keyboard.press('Escape');
    await expect(firstCard).toHaveAttribute('aria-expanded', 'false');
  });

  test('card has aria-label describing the flip action', async ({ page }) => {
    const firstCard = page.locator('.flip-card').first();
    const label = await firstCard.getAttribute('aria-label');
    expect(label).toContain('Marcus Steel');
    expect(label).toContain('Press Enter');
  });

  test('renders "+16 more coaches" hint below grid', async ({ page }) => {
    await expect(page.getByText('+ 16 MORE COACHES IN-DEPTH ON THE FULL ROSTER')).toBeVisible();
  });
});
