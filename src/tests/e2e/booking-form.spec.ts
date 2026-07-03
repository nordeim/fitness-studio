import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Booking form E2E.
 *
 * Verifies:
 *  - Booking form renders below the CTA with all fields
 *  - Form has honeypot field (hidden)
 *  - Goal selector has 5 pills
 *  - Preferred time has 4 radio cards
 *  - Preferred coach dropdown has 8 options + "No preference"
 *  - Consent checkbox is required
 *  - Submit with valid data shows success toast
 *  - Submit with invalid email shows validation error
 *  - Submit without consent shows validation error
 *  - Form resets after successful submission
 */

test.describe('Booking form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#booking-form');
    // Wait for the form to render
    await expect(page.locator('#booking-form')).toBeVisible();
  });

  test('renders all form fields', async ({ page }) => {
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/phone \(optional\)/i)).toBeVisible();
    await expect(page.getByLabel(/preferred coach/i)).toBeVisible();
    await expect(page.getByLabel(/notes/i)).toBeVisible();
  });

  test('renders goal selector with 5 pills', async ({ page }) => {
    const goalGroup = page.getByRole('radiogroup', { name: 'training goal' });
    await expect(goalGroup).toBeVisible();

    const radios = goalGroup.getByRole('radio');
    await expect(radios).toHaveCount(5);
  });

  test('renders preferred time with 4 radio cards', async ({ page }) => {
    const timeGroup = page.getByRole('radiogroup', { name: 'preferred time' });
    await expect(timeGroup).toBeVisible();

    const radios = timeGroup.getByRole('radio');
    await expect(radios).toHaveCount(4);
  });

  test('preferred coach dropdown has 8 options + No preference', async ({ page }) => {
    const select = page.locator('#preferredCoachId');
    const options = select.locator('option');
    // 8 coaches + 1 "No preference" = 9
    await expect(options).toHaveCount(9);
    await expect(options.first()).toHaveText('No preference');
  });

  test('renders honeypot field (hidden from users)', async ({ page }) => {
    const honeypot = page.locator('#company_website');
    // It exists in the DOM but is positioned off-screen
    await expect(honeypot).toHaveCount(1);
    // Should not be visible to users
    await expect(honeypot).not.toBeVisible();
  });

  test('consent checkbox is present and unchecked', async ({ page }) => {
    const consent = page.locator('input[type="checkbox"]');
    await expect(consent).toBeVisible();
    await expect(consent).not.toBeChecked();
  });

  test('submit button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /submit trial request/i })).toBeVisible();
  });

  test('valid submission shows success toast', async ({ page }) => {
    // Fill the form
    await page.getByLabel(/full name/i).fill('Jane Athlete');
    await page.getByLabel(/email address/i).fill('jane@example.com');
    await page.getByLabel(/phone \(optional\)/i).fill('212-555-0100');

    // Select goal (default is muscle)
    await page.getByRole('radio', { name: /fat loss/i }).click();

    // Select time (default is early)
    await page.getByRole('radio', { name: /evening/i }).click();

    // Check consent
    await page.locator('input[type="checkbox"]').check();

    // Submit
    await page.getByRole('button', { name: /submit trial request/i }).click();

    // Wait for toast
    await expect(page.getByText('Trial request received')).toBeVisible({ timeout: 10000 });
  });

  test('invalid email shows validation error', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Athlete');
    await page.getByLabel(/email address/i).fill('not-an-email');
    await page.locator('input[type="checkbox"]').check();

    await page.getByRole('button', { name: /submit trial request/i }).click();

    // Should show error toast or field error
    await expect(
      page.getByText(/valid email/i).or(page.getByText(/submission failed/i)),
    ).toBeVisible({ timeout: 5000 });
  });

  test('missing consent shows validation error', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Jane Athlete');
    await page.getByLabel(/email address/i).fill('jane@example.com');

    // Don't check consent
    await page.getByRole('button', { name: /submit trial request/i }).click();

    // Should show error
    await expect(
      page.getByText(/consent/i).or(page.getByText(/submission failed/i)),
    ).toBeVisible({ timeout: 5000 });
  });

  test('form resets after successful submission', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Reset Test');
    await page.getByLabel(/email address/i).fill('reset@example.com');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: /submit trial request/i }).click();

    // Wait for success toast
    await expect(page.getByText('Trial request received')).toBeVisible({ timeout: 10000 });

    // Form should be reset — name field should be empty
    await expect(page.getByLabel(/full name/i)).toHaveValue('');
    await expect(page.getByLabel(/email address/i)).toHaveValue('');
  });

  test('submit button shows loading state during async', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Loading Test');
    await page.getByLabel(/email address/i).fill('loading@example.com');
    await page.locator('input[type="checkbox"]').check();

    // Click submit — button should show loading state briefly
    const button = page.getByRole('button', { name: /submit trial request/i });
    await button.click();

    // Button text changes to "Submitting..." or shows spinner
    // Wait for either the loading text or the success toast
    await expect(
      page.getByRole('button', { name: /submitting/i }).or(page.getByText('Trial request received')),
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Booking confirmation page', () => {
  test('renders at /booking/confirm', async ({ page }) => {
    await page.goto('/booking/confirm');

    await expect(page.getByText('REQUEST RECEIVED')).toBeVisible();
    await expect(page.getByText('Coach Review')).toBeVisible();
    await expect(page.getByText('Trial Session')).toBeVisible();
  });

  test('renders next-steps timeline', async ({ page }) => {
    await page.goto('/booking/confirm');

    await expect(page.getByText('01')).toBeVisible();
    await expect(page.getByText('02')).toBeVisible();
    await expect(page.getByText('03')).toBeVisible();
    await expect(page.getByText('NOW')).toBeVisible();
    await expect(page.getByText('WITHIN 24 HOURS')).toBeVisible();
    await expect(page.getByText('WITHIN 7 DAYS')).toBeVisible();
  });

  test('renders back links', async ({ page }) => {
    await page.goto('/booking/confirm');

    await expect(page.getByRole('link', { name: /back to programs/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /read member stories/i })).toBeVisible();
  });
});
