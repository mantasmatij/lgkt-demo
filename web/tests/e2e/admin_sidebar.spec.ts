// Placeholder Playwright E2E spec for admin sidebar (T008)
// Will be expanded in later phases.
import { test, expect } from '@playwright/test';

test.describe('Admin Sidebar (skeleton)', () => {
  test('renders placeholder sidebar on admin page', async ({ page }) => {
    // NOTE: Adjust URL if admin landing route differs
    await page.goto('/admin');
    const sidebar = page.locator('[data-phase="setup"]');
    await expect(sidebar).toBeVisible();
  });
});
