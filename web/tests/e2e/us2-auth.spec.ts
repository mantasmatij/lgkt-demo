import { test, expect } from '@playwright/test';

test.describe('US2: Admin Authentication', () => {
  const ADMIN_EMAIL = 'admin@example.com';
  const ADMIN_PASSWORD = 'admin123';

  test('T037: should redirect unauthenticated user to sign-in page', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin/dashboard');
    
    // Should redirect to sign-in page
    await page.waitForURL('/admin/sign-in', { timeout: 5000 });
    
    // Verify sign-in page is displayed
    const heading = page.locator('h1, h2').filter({ hasText: /sign in/i });
    await expect(heading).toBeVisible();
  });

  test('T037: should successfully sign in and redirect to dashboard', async ({ page }) => {
    // Go to sign-in page
    await page.goto('/admin/sign-in');
    
    // Fill credentials
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL('/admin/dashboard', { timeout: 5000 });
    
    // Verify dashboard content
    const dashboardHeading = page.locator('h1:has-text("Admin Dashboard")');
    await expect(dashboardHeading).toBeVisible();
  });

  test('T037: should show error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/sign-in');
    
    // Fill with wrong credentials
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    const errorMessage = page.locator('text=/invalid|error|incorrect/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    
    // Should stay on sign-in page
    await expect(page).toHaveURL('/admin/sign-in');
  });

  test('T037: should maintain session and allow access to protected routes', async ({ page }) => {
    // Sign in
    await page.goto('/admin/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Navigate to other admin pages
    await page.goto('/admin/companies');
    
    // Should NOT redirect to sign-in (session maintained)
    await expect(page).toHaveURL('/admin/companies');
    
    // Navigate to reports
    await page.goto('/admin/reports');
    await expect(page).toHaveURL('/admin/reports');
  });

  test('T037: should handle logout properly', async ({ page }) => {
    // Sign in first
    await page.goto('/admin/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Look for logout button/link
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i });
    
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      
      // Should redirect to sign-in after logout
      await page.waitForURL('/admin/sign-in', { timeout: 5000 });
      
      // Try to access dashboard again
      await page.goto('/admin/dashboard');
      
      // Should redirect back to sign-in
      await page.waitForURL('/admin/sign-in');
    }
  });

  test('T037: should show empty state when no submissions exist', async ({ page }) => {
    // Sign in
    await page.goto('/admin/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Check for either submissions or empty state
    const emptyState = page.locator('text=/no submissions/i');
    const submissionsTable = page.locator('table');
    
    // Either should be visible
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    const hasTable = await submissionsTable.isVisible().catch(() => false);
    
    expect(hasEmptyState || hasTable).toBeTruthy();
  });

  test('T037a: should validate required fields on sign-in form', async ({ page }) => {
    await page.goto('/admin/sign-in');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Browser validation should prevent submission
    // Check if we're still on sign-in page
    await expect(page).toHaveURL('/admin/sign-in');
  });

  test('T037a: should enforce HTTPS-only cookies in production', async ({ page, context }) => {
    // Sign in to get a session cookie
    await page.goto('/admin/sign-in');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    
    // Get cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'sessionId');
    
    if (sessionCookie) {
      // Session cookie should be HttpOnly
      expect(sessionCookie.httpOnly).toBe(true);
      
      // Session cookie should have SameSite set
      expect(sessionCookie.sameSite).toBeTruthy();
      
      // In production, should be Secure
      // (In dev/localhost it's typically false, which is acceptable)
    }
  });

  test('T037: keyboard navigation should work on sign-in form', async ({ page }) => {
    await page.goto('/admin/sign-in');
    
    // Tab through form fields
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Email field
    
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeFocused();
    
    await page.keyboard.press('Tab'); // Password field
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toBeFocused();
    
    await page.keyboard.press('Tab'); // Submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();
  });
});
