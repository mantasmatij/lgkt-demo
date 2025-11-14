import { test, expect, Page } from '@playwright/test';

// US3: Company detail + submissions ordering
// Preconditions: admin user exists and can sign in at /admin/sign-in with default seeded credentials
// The app server is started by Playwright webServer config (npm run dev:up)

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'admin123';

async function signIn(page: Page) {
  await page.goto('/admin/sign-in');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  const navigationPromise = page.waitForURL(/\/admin\/(dashboard|companies|forms)/, { timeout: 15000 }).catch(() => null);
  await page.click('button[type="submit"]');
  const navResult = await navigationPromise;
  if (!navResult) {
    // Fallback: if still on sign-in page after first attempt, try once more
    if (page.url().includes('/admin/sign-in')) {
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/admin\/(dashboard|companies|forms)/, { timeout: 15000 });
    }
  }
}

async function ensureCompanyExists(page: Page) {
  // Navigate to companies list and click first row if present
  await page.goto('/admin/companies');
  // Wait for either empty or table
  const table = page.locator('table');
  const hasTable = await table.isVisible().catch(() => false);
  if (!hasTable) {
    // If no table yet, return null gracefully (empty state or loading)
    return null;
  }
  // Click first company name link
  const firstLink = table.locator('tbody tr td a').first();
  const href = await firstLink.getAttribute('href');
  await firstLink.click();
  await page.waitForURL(/\/admin\/companies\//);
  return href || page.url();
}

// Helper kept for potential future formatting; currently unused
// function toISODateOnly(dt: string) {
//   try {
//     const d = new Date(dt);
//     if (Number.isNaN(d.getTime())) return '';
//     return d.toISOString();
//   } catch {
//     return '';
//   }
// }

test.describe('US3: Company Detail', () => {
  test('T039: shows fields and submissions ordered desc by submittedAt', async ({ page }) => {
    await signIn(page);
    const dest = await ensureCompanyExists(page);
    if (!dest) {
      test.skip(true, 'No companies available yet; skipping detail scenario.');
      return;
    }

    // Verify core company fields appear
    const fieldLabels = [
      /Company name|Juridinio asmens pavadinimas/i,
      /Company code|Juridinio asmens kodas/i,
      /Legal form|Juridinio asmens teisinė forma/i,
      /Address|Juridinio asmens buveinės adresas/i,
      /Registry|Registras/i,
      /eDelivery|elektroninio pristatymo/i,
    ];
    for (const re of fieldLabels) {
      await expect(page.getByText(re)).toBeVisible();
    }

    // If submissions table exists, ensure ordering by Submission Date desc
    const table = page.locator('table');
    if (await table.isVisible().catch(() => false)) {
      const rows = table.locator('tbody tr');
      const count = await rows.count();
      if (count > 1) {
        const firstDate = await rows.nth(0).locator('td').last().innerText();
        const secondDate = await rows.nth(1).locator('td').last().innerText();
        const d1 = new Date(firstDate); const d2 = new Date(secondDate);
        expect(d1.getTime()).toBeGreaterThanOrEqual(d2.getTime());
      }
    } else {
      // Empty state message should be visible
      const empty = page.locator('text=/No submissions yet|Dar nėra pateikimų/i');
      await expect(empty).toBeVisible();
    }
  });
});
