import { test, expect, devices } from '@playwright/test';

// Clean, Playwright-compliant responsive tests.
// These tests are designed to run under the projects defined in playwright.config.ts
// and do not call test.use() inside describe blocks.

test.describe('Responsive / accessibility smoke', () => {
  test('public form should not horizontally overflow', async ({ page }) => {
    await page.goto('/form');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('admin sign-in page should be visible and not overflow', async ({ page }) => {
    await page.goto('/admin/sign-in');
    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');
    const submit = page.locator('button[type="submit"]');
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(submit).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

    test('submit button should meet touch target on mobile viewports', async ({ page }) => {
    const vp = page.viewportSize();
    // Skip if this run is not a mobile-sized viewport
    if (!vp || vp.width >= 768) test.skip();

    await page.goto('/form');
    const submit = page.locator('button[type="submit"]');
    const box = await submit.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
        // WCAG recommends 44x44 on touch devices
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
    }
    });

    test('form inputs should not exceed viewport width', async ({ page }) => {
    await page.goto('/form');
    const nameInput = page.locator('input[name="name"]');
    const box = await nameInput.boundingBox();
    if (box) {
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(box.width).toBeLessThanOrEqual(clientWidth);
    }
    });

    test('cross-viewport smoke: basic pages load on common devices', async ({ browser }) => {
    const deviceList = [devices['iPhone 12'], devices['iPad Pro'], { viewport: { width: 1920, height: 1080 } }];
    for (const d of deviceList) {
        const context = await browser.newContext(d);
        const page = await context.newPage();
        await page.goto('/form');
        await expect(page.locator('h1')).toBeVisible();
        await page.goto('/admin/sign-in');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await context.close();
    }
    });
});
