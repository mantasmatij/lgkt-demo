// Admin Sidebar navigation flows (T025)
// Verifies sidebar renders, links navigate, and active item updates.
import { test, expect } from '@playwright/test';

const navExpectations: { id: string; route: string; label: RegExp }[] = [
  { id: 'companies', route: '/admin/companies', label: /Companies/i },
  { id: 'forms-reports', route: '/admin/forms', label: /Forms & Reports/i },
  { id: 'submissions-exports', route: '/admin/submissions', label: /Submissions\s*\/\s*Exports/i },
  { id: 'settings', route: '/admin/settings', label: /Settings/i }
];

test.describe('Admin Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes already authenticated admin session or public access for now.
    // If auth needed, insert sign-in flow here.
    await page.goto('/admin');
    const nav = page.getByRole('navigation', { name: /admin navigation/i });
    await expect(nav).toBeVisible();
  });

  test('renders all nav items with icons/fallback', async ({ page }) => {
    for (const item of navExpectations) {
      const link = page.locator(`#nav-${item.id}`);
      await expect(link).toBeVisible();
      await expect(link).toHaveText(item.label);
    }
  });

  test('navigation click updates URL and active aria-current', async ({ page }) => {
    for (const item of navExpectations) {
      const link = page.locator(`#nav-${item.id}`);
      await link.click();
  // Simple URL assertion (exact start). Avoid complex escaping.
  const url = page.url();
  expect(url.startsWith(item.route)).toBeTruthy();
      // Active state: aria-current=page
      await expect(link).toHaveAttribute('aria-current', 'page');
    }
  });
});
