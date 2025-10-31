import { Then } from '@cucumber/cucumber';
import type { CustomWorld } from './support/world';
import { reopenBrowserWithSameSession } from './support/world';

Then('I close and reopen the browser', async function (this: CustomWorld) {
  await reopenBrowserWithSameSession(this);
  // Return to the public form page after reopening
  await this.page.goto(`${this.baseUrl}/form`);
});
