import { test, expect } from '@playwright/test';

test.describe('A11y: LanguageSwitcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form');
  });

  test('buttons are grouped and labelled, pressed state reflects selection', async ({ page }) => {
    // Group is labelled with the language label in current locale (default LT: "Kalba")
    const group = page.getByRole('group', { name: /Kalba|Language/i });
    await expect(group).toBeVisible();

    // Both buttons present by accessible names
  // Button labels depend on current locale: LT: Lietuvių/Anglų, EN: Lithuanian/English
  const ltButton = page.getByRole('button', { name: /Lietuvių|Lithuanian/i });
  const enButton = page.getByRole('button', { name: /Anglų|English/i });

    await expect(ltButton).toBeVisible();
    await expect(enButton).toBeVisible();

    // Default selection is Lithuanian
    await expect(ltButton).toHaveAttribute('aria-pressed', 'true');
    await expect(enButton).toHaveAttribute('aria-pressed', 'false');

    // Toggle to English and assert pressed states flip
    await enButton.click();
    await expect(enButton).toHaveAttribute('aria-pressed', 'true');
    await expect(ltButton).toHaveAttribute('aria-pressed', 'false');
  });
});
