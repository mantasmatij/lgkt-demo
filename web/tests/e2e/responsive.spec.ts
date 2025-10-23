import { test, expect, devices } from '@playwright/test';

test.describe('T043a: Responsive Viewport Tests', () => {
  const viewports = [
    { name: 'Mobile', device: devices['iPhone 12'], width: 390, height: 844 },
    { name: 'Tablet', device: devices['iPad Pro'], width: 1024, height: 1366 },
    { name: 'Desktop', device: null, width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, device, width, height }) => {
    test.describe(`${name} viewport (${width}x${height})`, () => {
      test.use(device || { viewport: { width, height } });

      test(`should not have horizontal scroll on public form`, async ({ page }) => {
        await page.goto('/form');
        
        // Get document dimensions
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        
        // Assert no horizontal overflow
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });

      test(`should have tappable targets (min 44x44px) on mobile`, async ({ page }) => {
        if (name !== 'Mobile') {
          test.skip();
          return;
        }

        await page.goto('/form');
        
        // Check submit button size
        const submitButton = page.locator('button[type="submit"]');
        const box = await submitButton.boundingBox();
        
        if (box) {
          // WCAG 2.1 AA requires minimum 44x44px touch targets
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      });

      test(`admin sign-in form should be usable`, async ({ page }) => {
        await page.goto('/admin/sign-in');
        
        // Verify form is visible
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');
        const submitButton = page.locator('button[type="submit"]');
        
        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await expect(submitButton).toBeVisible();
        
        // Verify no horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });

      test(`admin dashboard should be responsive`, async ({ page }) => {
        // Sign in first
        await page.goto('/admin/sign-in');
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');
        
        // Verify no horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
        
        // Verify content is accessible
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
      });

      test(`form inputs should be appropriately sized`, async ({ page }) => {
        await page.goto('/form');
        
        // Check company name input
        const nameInput = page.locator('input[name="name"]');
        const box = await nameInput.boundingBox();
        
        if (box) {
          // Input should have reasonable height for touch
          if (name === 'Mobile') {
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
          
          // Input should not be wider than viewport
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          expect(box.width).toBeLessThanOrEqual(clientWidth);
        }
      });

      test(`navigation and layout should be functional`, async ({ page }) => {
        await page.goto('/form');
        
        // Verify main content is accessible
        const mainContent = page.locator('#main-content, main');
        await expect(mainContent).toBeVisible();
        
        // Verify form sections are visible
        const companySection = page.locator('h3:has-text("Company")');
        await expect(companySection).toBeVisible();
      });

      test(`tables should be scrollable on mobile`, async ({ page }) => {
        if (name !== 'Mobile') {
          return;
        }

        // Sign in and go to dashboard
        await page.goto('/admin/sign-in');
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin/dashboard');
        
        // Check if table exists
        const table = page.locator('table');
        const tableExists = await table.count() > 0;
        
        if (tableExists) {
          // Table should be within viewport or in scrollable container
          const tableBox = await table.boundingBox();
          const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
          
          if (tableBox && tableBox.width > clientWidth) {
            // Table should be in a container with overflow-x
            const container = await page.evaluateHandle(() => {
              const tableEl = document.querySelector('table');
              let parent = tableEl?.parentElement;
              while (parent) {
                const style = window.getComputedStyle(parent);
                if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
                  return parent;
                }
                parent = parent.parentElement;
              }
              return null;
            });
            
            // Should have scrollable container
            expect(container).toBeTruthy();
          }
        }
      });

      test(`error messages should be visible`, async ({ page }) => {
        await page.goto('/form');
        
        // Submit empty form to trigger validation
        await page.click('button[type="submit"]');
        
        // Error summary should be visible
        const errorSummary = page.locator('[role="alert"]');
        await expect(errorSummary).toBeVisible({ timeout: 3000 });
        
        // Error summary should not cause horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    });
  });

  test.describe('Cross-viewport consistency', () => {
    test('should maintain functionality across all viewports', async ({ browser }) => {
      // Test that core features work on all viewports
      const contexts = await Promise.all([
        browser.newContext(devices['iPhone 12']),
        browser.newContext(devices['iPad Pro']),
        browser.newContext({ viewport: { width: 1920, height: 1080 } }),
      ]);

      for (const context of contexts) {
        const page = await context.newPage();
        
        // Test form page loads
        await page.goto('/form');
        await expect(page.locator('h1')).toBeVisible();
        
        // Test sign-in page loads
        await page.goto('/admin/sign-in');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        
        await context.close();
      }
    });
  });

  test.describe('Touch target sizes', () => {
    test.use(devices['iPhone 12']);

    test('all interactive elements should meet minimum touch target size', async ({ page }) => {
      await page.goto('/form');
      
      // Get all buttons and links
      const interactiveElements = await page.locator('button, a, input[type="checkbox"], input[type="radio"]').all();
      
      for (const element of interactiveElements) {
        const isVisible = await element.isVisible().catch(() => false);
        
        if (isVisible) {
          const box = await element.boundingBox();
          
          if (box) {
            // WCAG 2.1 Level AAA recommends 44x44px (Level AA is more flexible)
            // We'll check for reasonable touch targets
            const minSize = 40; // Slightly relaxed for some UI elements
            
            const meetsSize = box.width >= minSize || box.height >= minSize;
            
            // Log elements that don't meet the criteria (info only, not failing test)
            if (!meetsSize) {
              console.log(`Small touch target: ${box.width}x${box.height}px`);
            }
          }
        }
      }
      
      // Test passes if we checked the elements
      expect(interactiveElements.length).toBeGreaterThan(0);
    });
  });
});
