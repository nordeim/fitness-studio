import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — Admin auth flow E2E.
 *
 * Verifies:
 *  - /admin redirects to /admin/login when not authenticated
 *  - /admin/login renders the sign-in form
 *  - /admin/coaches redirects to /admin/login when not authenticated
 *  - Login form shows error on invalid credentials
 *  - Login form has email + password fields + submit button
 *  - "Back to site" link present
 *
 * Note: We don't test successful login (would require a real DB with seeded admin).
 * The auth flow itself is tested via unit tests (Phase 9.9).
 */

test.describe('Admin auth flow', () => {
  test('/admin redirects to /admin/login when unauthenticated', async ({ page }) => {
    await page.goto('/admin');

    // Should redirect to /admin/login
    await page.waitForURL('**/admin/login**');
    expect(page.url()).toContain('/admin/login');
  });

  test('/admin/coaches redirects to /admin/login when unauthenticated', async ({ page }) => {
    await page.goto('/admin/coaches');

    await page.waitForURL('**/admin/login**');
    expect(page.url()).toContain('/admin/login');

    // Should include callbackUrl in the URL
    expect(page.url()).toContain('callbackUrl');
  });

  test('/admin/login renders sign-in form', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByRole('heading', { name: 'SIGN IN' })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('/admin/login shows IRONFORGE branding', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByText('IRONFORGE')).toBeVisible();
    await expect(page.getByText('ADMIN · ACCESS')).toBeVisible();
    await expect(page.getByText('Authorized personnel only.')).toBeVisible();
  });

  test('/admin/login has "Back to site" link', async ({ page }) => {
    await page.goto('/admin/login');

    const backLink = page.getByRole('link', { name: /back to site/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/');
  });

  test('login form shows error on invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/email address/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show error message (not redirect)
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 10000 });
    // Should still be on login page
    expect(page.url()).toContain('/admin/login');
  });

  test('login form button shows loading state', async ({ page }) => {
    await page.goto('/admin/login');

    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Button should show loading text briefly
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible({ timeout: 5000 });
  });

  test('email field is auto-focused', async ({ page }) => {
    await page.goto('/admin/login');

    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeFocused();
  });

  test('password field has correct autocomplete attribute', async ({ page }) => {
    await page.goto('/admin/login');

    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
  });

  test('email field has correct autocomplete attribute', async ({ page }) => {
    await page.goto('/admin/login');

    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
  });
});
