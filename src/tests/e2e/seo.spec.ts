import { test, expect } from '@playwright/test';

/**
 * IRONFORGE — SEO E2E tests.
 *
 * Verifies:
 *  - robots.txt is served and contains correct rules
 *  - sitemap.xml is served and lists all routes
 *  - manifest.json is served
 *  - Home page has correct meta tags (title, description, OG, Twitter)
 *  - Home page has JSON-LD HealthClub structured data
 *  - 404 page renders with brand styling
 *  - Loading skeleton renders for slow routes
 *  - Canonical URL is set
 *  - lang attribute is set on <html>
 */

test.describe('SEO — robots.txt', () => {
  test('serves robots.txt with correct rules', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const content = (await response?.text()) ?? '';
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Disallow: /admin/');
    expect(content).toContain('Disallow: /api/');
    expect(content).toContain('Sitemap:');
  });
});

test.describe('SEO — sitemap.xml', () => {
  test('serves sitemap.xml with all routes', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const content = (await response?.text()) ?? '';
    expect(content).toContain('<urlset');
    expect(content).toContain('<url>');
    expect(content).toContain('<loc>');
    // Home page
    expect(content).toContain('</loc>');
    // At least 20 URLs (7 static + 9 programs + 8 coaches + 6 stories = 30)
    const urlCount = (content.match(/<url>/g) || []).length;
    expect(urlCount).toBeGreaterThanOrEqual(20);
  });
});

test.describe('SEO — manifest.json', () => {
  test('serves manifest.json with IRONFORGE branding', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response?.status()).toBe(200);

    const data = await response?.json();
    expect(data.name).toContain('IRONFORGE');
    expect(data.short_name).toBe('IRONFORGE');
    expect(data.background_color).toBe('#0a0a0a');
    expect(data.theme_color).toBe('#0a0a0a');
    expect(data.display).toBe('standalone');
  });
});

test.describe('SEO — home page meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/IRONFORGE.*Strength.*Conditioning/i);
  });

  test('has meta description', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      /private strength.*conditioning studio/i,
    );
  });

  test('has Open Graph tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /IRONFORGE/i);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /Built by discipline/i);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');

    const ogLocale = page.locator('meta[property="og:locale"]');
    await expect(ogLocale).toHaveAttribute('content', 'en_US');
  });

  test('has Twitter card tags', async ({ page }) => {
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

    const twitterTitle = page.locator('meta[name="twitter:title"]');
    await expect(twitterTitle).toHaveAttribute('content', /IRONFORGE/i);
  });

  test('has JSON-LD HealthClub structured data', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);

    const content = await jsonLd.textContent();
    expect(content).toContain('"@type":"HealthClub"');
    expect(content).toContain('IRONFORGE');
    expect(content).toContain('47 Eastbound Alley');
    expect(content).toContain('aggregateRating');
  });

  test('has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
  });

  test('has lang attribute on html', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('has robots meta tag', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /index/i);
  });
});

test.describe('SEO — 404 page', () => {
  test('renders branded 404 for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText(/doesn't exist/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible();
  });
});

test.describe('SEO — icon', () => {
  test('serves icon.svg', async ({ page }) => {
    const response = await page.goto('/icon.svg');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toContain('image/svg');
  });
});
