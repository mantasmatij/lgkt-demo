import { test, expect } from '@playwright/test';

test.describe('US1: Public Form Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form');
  });

  test('T030: should display the public form page', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/LGKT Forma/);
    
    // Verify form heading
    const heading = page.locator('h1:has-text("Anonymous Company Form")');
    await expect(heading).toBeVisible();
    
    // Verify submit button exists
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('T030: should successfully submit a valid form (happy path)', async ({ page }) => {
    // Fill company information
    await page.fill('input[name="name"]', 'Test Company Ltd');
    await page.fill('input[name="code"]', 'TC123456');
    await page.fill('input[name="country"]', 'LT');
    await page.fill('input[name="legalForm"]', 'UAB');
    await page.fill('input[name="address"]', 'Test Street 123, Vilnius');
    await page.fill('input[name="registry"]', 'Test Registry');
    await page.fill('input[name="eDeliveryAddress"]', 'test@edelivery.lt');
    
    // Fill date ranges
    await page.fill('input[name="reportingFrom"]', '2024-01-01');
    await page.fill('input[name="reportingTo"]', '2024-12-31');
    
    // Fill contact information
    await page.fill('input[name="contactName"]', 'John Doe');
    await page.fill('input[name="contactEmail"]', 'john@test.com');
    await page.fill('input[name="contactPhone"]', '+37060000000');
    
    // Fill submitter information
    await page.fill('input[name="submitter.name"]', 'Jane Smith');
    await page.fill('input[name="submitter.phone"]', '+37060000001');
    await page.fill('input[name="submitter.email"]', 'jane@test.com');
    
    // Accept consent
    await page.check('input[name="consent"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to success page
    await page.waitForURL('/form/success', { timeout: 10000 });
    
    // Verify success message
    await expect(page.locator('text=success')).toBeVisible();
  });

  test('T030a: should show client-side validation errors for missing required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Wait for error summary to appear
    const errorSummary = page.locator('[role="alert"]');
    await expect(errorSummary).toBeVisible({ timeout: 2000 });
    
    // Verify error summary has content
    await expect(errorSummary.locator('text=error')).toBeVisible();
    
    // Verify form is still on the same page (not submitted)
    await expect(page).toHaveURL('/form');
  });

  test('T030a: should enforce consent requirement', async ({ page }) => {
    // Fill all required fields except consent
    await page.fill('input[name="name"]', 'Test Company');
    await page.fill('input[name="code"]', 'TC123');
    await page.fill('input[name="country"]', 'LT');
    await page.fill('input[name="legalForm"]', 'UAB');
    await page.fill('input[name="address"]', 'Test Address');
    await page.fill('input[name="registry"]', 'Registry');
    await page.fill('input[name="eDeliveryAddress"]', 'test@edelivery.lt');
    await page.fill('input[name="reportingFrom"]', '2024-01-01');
    await page.fill('input[name="reportingTo"]', '2024-12-31');
    await page.fill('input[name="contactName"]', 'John Doe');
    await page.fill('input[name="contactEmail"]', 'john@test.com');
    await page.fill('input[name="contactPhone"]', '+37060000000');
    await page.fill('input[name="submitter.name"]', 'Jane Smith');
    await page.fill('input[name="submitter.phone"]', '+37060000001');
    await page.fill('input[name="submitter.email"]', 'jane@test.com');
    
    // Do NOT check consent
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    const errorSummary = page.locator('[role="alert"]');
    await expect(errorSummary).toBeVisible({ timeout: 2000 });
    
    // Should not navigate away
    await expect(page).toHaveURL('/form');
  });

  test('T030a: should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('input[name="contactEmail"]', 'invalid-email');
    await page.fill('input[name="name"]', 'Test Company');
    await page.fill('input[name="code"]', 'TC123');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 2000 });
  });

  test('T030a: should validate date range (from < to)', async ({ page }) => {
    // Fill form with invalid date range
    await page.fill('input[name="reportingFrom"]', '2024-12-31');
    await page.fill('input[name="reportingTo"]', '2024-01-01');
    
    // Fill other required fields
    await page.fill('input[name="name"]', 'Test Company');
    await page.fill('input[name="code"]', 'TC123');
    await page.fill('input[name="country"]', 'LT');
    await page.fill('input[name="legalForm"]', 'UAB');
    await page.fill('input[name="address"]', 'Test Address');
    await page.fill('input[name="registry"]', 'Registry');
    await page.fill('input[name="eDeliveryAddress"]', 'test@edelivery.lt');
    await page.fill('input[name="contactName"]', 'John Doe');
    await page.fill('input[name="contactEmail"]', 'john@test.com');
    await page.fill('input[name="contactPhone"]', '+37060000000');
    await page.fill('input[name="submitter.name"]', 'Jane Smith');
    await page.fill('input[name="submitter.phone"]', '+37060000001');
    await page.fill('input[name="submitter.email"]', 'jane@test.com');
    await page.check('input[name="consent"]');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 2000 });
  });

  test('should have accessible skip-to-content link', async ({ page }) => {
    // Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Skip link should become visible when focused
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
  });
});
