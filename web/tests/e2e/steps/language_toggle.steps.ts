import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './support/world';

Given('I open the public form page', async function (this: CustomWorld) {
  await this.page.goto(`${this.baseUrl}/form`);
  await expect(this.page.locator('h1')).toBeVisible();
});

When('I switch the language to English', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'English' }).click();
});

Then('I see the form title in English', async function (this: CustomWorld) {
  await expect(this.page.locator('h1')).toContainText('Anonymous Company Form');
});

When('I switch the language to Lithuanian', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: 'Lietuvių' }).click();
});

Then('I see the form title in Lithuanian', async function (this: CustomWorld) {
  await expect(this.page.locator('h1')).toContainText('Anoniminė įmonės forma');
});
