import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('IT Training Instructor Portal', () => {
  test('should bypass login, navigate through all steps, and submit training program', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds

    // 1. Bypass UI Login by injecting auth token directly
    await page.goto('/'); // Must visit the domain first to set localStorage
    
    await page.evaluate(() => {
      localStorage.setItem('access_token', '32|6161SKy4r4G3XgnIzyUINlOts38LmYkngRjSQrckf92ad792');
      localStorage.setItem('user', JSON.stringify({
        id: 1, 
        name: 'Playwright Tester', 
        email: 'playwright@example.com',
        role: 'user'
      }));
    });

    // 2. Navigate directly to the IT Training Instructor Portal
    await page.goto('/it-training/instructor-portal');

    // Wait for the portal page to load (Step 1)
    await expect(page.locator('h1', { hasText: 'IT Instructor Portal' })).toBeVisible();

    // 3. Fill out Step 1 (Profile) - These are the only validated fields
    await page.fill('input[placeholder="John Doe"]', 'Test Instructor');
    await page.fill('input[placeholder="5"]', '5');
    await page.fill('input[placeholder="john@example.com"]', 'playwright@example.com');
    await page.fill('input[placeholder="+91 ..."]', '1234567890');
    await page.fill('textarea[placeholder*="Tell potential students about"]', 'Test Bio description for playwright.');
    await page.fill('input[placeholder="your-name-123"]', 'test-instructor-123');

    // Upload photo (Required)
    const fileChooserPromise = page.waitForEvent('filechooser');
    // The input is hidden under a label that intercepts events, so we force click the input itself
    await page.locator('input[type="file"]').dispatchEvent('click');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('dummy image data')
    });

    // Wait for the crop modal to appear and click "Crop & Save"
    await page.locator('button', { hasText: 'Crop & Save' }).click();
    
    // Wait for the modal to close and the photo to process
    await page.waitForTimeout(1000);

    // Click 'Continue to Next'
    await page.locator('button', { hasText: 'Continue to Next' }).click();

    // Step 2
    await expect(page.locator('h2', { hasText: 'Program Details' })).toBeVisible();
    await page.locator('button', { hasText: 'Continue to Next' }).click();

    // Step 3
    await expect(page.locator('h2', { hasText: 'Schedule & Location' })).toBeVisible();
    await page.locator('button', { hasText: 'Continue to Next' }).click();

    // Step 4
    await expect(page.locator('h2', { hasText: 'Detailed Program Info' })).toBeVisible();
    await page.locator('button', { hasText: 'Continue to Next' }).click();

    // Step 5
    await expect(page.locator('h2', { hasText: 'Program Investment' })).toBeVisible();
    await page.locator('button', { hasText: 'Continue to Next' }).click();

    // Step 6 (Final Review)
    await expect(page.locator('button', { hasText: 'Publish Training Program' })).toBeVisible();
    
    // Pause for 10 seconds so the user can see it before it submits
    await page.waitForTimeout(5000);

    // Submit
    await page.locator('button', { hasText: 'Publish Training Program' }).click();

    // 5. Wait for the success page or processing
    await page.waitForTimeout(5000);
  });
});
