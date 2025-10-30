import { test, expect } from '@playwright/test';

// This smoke test is optional and only runs when DEV_QUICKSTART_URL is provided.
// Example: DEV_QUICKSTART_URL=http://localhost:3000 pnpm playwright test web/tests/e2e/dev_quickstart.spec.ts
const baseUrl: string | undefined = process.env.DEV_QUICKSTART_URL;

if (!baseUrl) {
  test.describe.skip('Dev quickstart smoke', () => {
    /* skipped: DEV_QUICKSTART_URL not set */
  });
} else {
  test.describe('Dev quickstart smoke', () => {
    test('homepage responds and shows basic text', async ({ page }) => {
      await page.goto(baseUrl);
      // Basic sanity: page has <html lang> set and shows a known header or title
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBeTruthy();

      // Look for a common string that exists in both locales via i18n (e.g., app title)
      const hasHeader = await page.locator('header').first().isVisible();
      expect(hasHeader).toBeTruthy();
    });
  });
}
