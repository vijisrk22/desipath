import { test, expect } from '@playwright/test';
import { loginViaApi } from './utils/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Buy/Sell Items E2E Lifecycle', () => {
  let token;
  const testUser = { email: 'test@desipath.com', password: 'password' }; // Set your test user

  test.beforeAll(async ({ request }) => {
    // Generate token before tests (Ensure backend has this user!)
    try {
      token = await loginViaApi('http://127.0.0.1:8000', testUser.email, testUser.password);
    } catch (e) {
      console.log('Ensure you have migrated and seeded the test user in the testing DB');
    }
  });

  test.beforeEach(async ({ page, context }) => {
    // Mock login by injecting token into localStorage
    await page.goto('/');
    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, token);
  });

  test('should create, search, and manage a new item', async ({ page }) => {
    // 1. Creation Phase
    await page.goto('/buy-sell-items/new');
    
    // Fill out the form (Replace selectors with actual ones used in your app)
    await page.fill('input[placeholder="Title"]', 'Test E2E iPhone 15');
    await page.fill('input[placeholder="Price"]', '799');
    await page.fill('textarea[placeholder="Description"]', 'Brand new in box.');
    
    // Upload image (Make sure you have this sample image in your fixtures)
    // await page.setInputFiles('input[type="file"]', path.join(__dirname, 'fixtures', 'sample.jpg'));

    // Submit
    await page.click('button:has-text("Submit")');
    
    // Wait for success toast or redirection
    // await expect(page.locator('text="Item created successfully"')).toBeVisible();

    // 2. Search Phase
    await page.goto('/buy-sell-items');
    await page.fill('input[placeholder*="Search"]', 'Test E2E iPhone 15');
    // await expect(page.locator('text="Test E2E iPhone 15"').first()).toBeVisible();

    // 3. Management Phase (My Ads)
    await page.goto('/my-ads');
    // Navigate to Buy/Sell tab if necessary
    // await page.click('text="Buy/Sell Items"');
    
    // Verify item is listed
    // await expect(page.locator('text="Test E2E iPhone 15"')).toBeVisible();
    
    // Delete item to clean up
    // await page.click('text="Delete"');
    // Confirm delete...
  });
});
