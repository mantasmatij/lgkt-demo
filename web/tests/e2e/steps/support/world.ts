import { setWorldConstructor, setDefaultTimeout, Before, After } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright';

export class CustomWorld {
  browser?: Browser;
  context!: BrowserContext;
  page!: Page;
  baseUrl: string;

  constructor() {
    this.baseUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';
  }
}

setDefaultTimeout(60_000);

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  try {
    await this.context?.close();
  } catch {
    /* ignore context close errors */
  }
  try {
    await this.browser?.close();
  } catch {
    /* ignore browser close errors */
  }
});

setWorldConstructor(CustomWorld);

// Helper to simulate closing and reopening the browser while keeping cookies/localStorage
export async function reopenBrowserWithSameSession(world: CustomWorld) {
  const priorState = await world.context.storageState();
  await world.context.close();
  await world.browser?.close();
  world.browser = await chromium.launch({ headless: true });
  world.context = await world.browser.newContext({ storageState: priorState });
  world.page = await world.context.newPage();
}
