import { test, expect } from '@playwright/test';

test.describe('i18n consistency', () => {
  test('toggle language and persist across deep links', async ({ page, context }) => {
    test.setTimeout(60000);
  // Go to public form page (default Lithuanian)
  await page.goto('/form');
  // Title should be Lithuanian by default (current localized title)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Lyčių lygybės ataskaitos forma/i);

    // Switch to English (button is labelled "English" when EN, or "Anglų" when LT)
    const englishButton = page.getByRole('button', { name: /English|Anglų/i });
    await englishButton.click();

  // Verify title is English now (or wait for it to switch)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Anonymous Company Form/i);

    // Open a deep link (same app, new page) and verify persistence via session
    const page2 = await context.newPage();
    await page2.goto('/form');
  // Verify persistence via button state or heading
  const enButton2 = page2.getByRole('button', { name: /English|Anglų/i });
  await expect(enButton2).toHaveAttribute('aria-pressed', 'true');
  await expect(page2.getByRole('heading', { level: 1 })).toHaveText(/Anonymous Company Form/i);

    // Switch back to Lithuanian
    const lithuanianButton = page2.getByRole('button', { name: /Lietuvių|Lithuanian/i });
    await lithuanianButton.click();
  await expect(page2.getByRole('heading', { level: 1 })).toHaveText(/Lyčių lygybės ataskaitos forma/i);
  });
});
