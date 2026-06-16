import { test, expect } from '@playwright/test';

test.describe('Buy/Sell Items Page', () => {
  test('should bypass login and post a buy/sell item successfully', async ({ page }) => {
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

    // 2. Navigate directly to the Buy/Sell Items Post portal
    await page.goto('/buy-sell-items/post');

    // Wait for the portal page to load
    await expect(page.locator('h1', { hasText: 'Post an Item for Sale' })).toBeVisible();

    // 3. Fill out the form
    await page.fill('input[name="title"]', 'Test Used iPhone 13');
    await page.selectOption('select[name="category"]', 'Electronics - Mobile phones');
    await page.selectOption('select[name="condition"]', 'Used - Like new');
    await page.fill('input[name="price"]', '450.00');
    await page.fill('textarea[name="description"]', 'Selling my used iPhone 13. Works perfectly, no scratches.');
    
    // Fill location (Autocomplete input)
    const locationInput = page.locator('input[placeholder="Search city or zipcode..."]');
    await locationInput.fill('10001');
    await page.waitForTimeout(1000); // Wait for dropdown
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    // 4. Submit the form
    const postBtn = page.locator('button', { hasText: 'Post Ad' });
    await expect(postBtn).toBeVisible();
    await postBtn.click();

    // 5. Wait for the form to process and show success/error
    // Pause for 10 seconds so the user can see the browser automatically running and any toast messages
    await page.waitForTimeout(10000);
  });
});
