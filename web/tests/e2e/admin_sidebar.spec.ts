// Admin Sidebar navigation flows (T025)
// Verifies sidebar renders, links navigate, and active item updates.
import { test, expect } from '@playwright/test';
import { scanA11y, expectNoViolations } from './helpers/axe';

// Labels may appear in Lithuanian (default) or English after language switch.
const navExpectations: { id: string; route: string; labels: RegExp[] }[] = [
  { id: 'submissions', route: '/admin/forms', labels: [/Užpildytos formos/i, /Submissions/i] },
  { id: 'companies', route: '/admin/companies', labels: [/Įmonės/i, /Companies/i] },
  { id: 'reports', route: '/admin/reports', labels: [/Ataskaitos/i, /Reports/i] }
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
      // Accept either locale label
      const text = await link.textContent();
      expect(item.labels.some(r => r.test(text || ''))).toBeTruthy();
    }
  });

  test('navigation click updates URL and active aria-current', async ({ page }) => {
    for (const item of navExpectations) {
      const link = page.locator(`#nav-${item.id}`);
      await link.click();
      const url = page.url();
      expect(url.startsWith(item.route)).toBeTruthy();
      await expect(link).toHaveAttribute('aria-current', 'page');
    }
  });

  test('language switch updates labels (T033)', async ({ page }) => {
    // Initial Lithuanian label should be present
    await expect(page.locator('#nav-companies')).toHaveText(/Įmonės/i);
    // Change language via select
    const select = page.locator('#admin-lang-select');
    await expect(select).toBeVisible();
    await select.selectOption('en');
    // Companies label should now update to English
    await expect(page.locator('#nav-companies')).toHaveText(/Companies/i);
  });

  test('collapse toggle changes aria-expanded and persists across navigation (T042)', async ({ page }) => {
    const toggle = page.locator('#admin-collapse-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Collapse
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // Navigate to another page and back to ensure persistence
    const companiesLink = page.locator('#nav-companies');
    await companiesLink.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('sidebar has no critical a11y violations (T051)', async ({ page }) => {
    const results = await scanA11y(page);
    expectNoViolations(results);
  });
});
