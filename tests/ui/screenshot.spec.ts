import { test, expect } from '@playwright/test';

test.describe('Marketing site snapshots', () => {
  test('homepage full-page screenshot', async ({ page }) => {
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1')).toBeVisible();

    const screenshotPath = 'screenshots/home-full.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });

    test.info().attach('Homepage Screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
