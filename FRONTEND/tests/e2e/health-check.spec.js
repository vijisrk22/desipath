import { test, expect } from '@playwright/test';

/**
 * Health Check Suite
 * This test suite iterates through all major modules and verifies that:
 * 1. The page returns a successful response.
 * 2. The page loads without major errors (no white screen).
 * 3. Specific module-related text is found on the page.
 */

const BASE_URL = 'http://localhost:3000';

const routes = [
  { path: '/', name: 'Landing Page', keyword: /Community|Desipath/i },
  { path: '/login', name: 'Login', keyword: /Login|Sign In/i },
  { path: '/register', name: 'Register', keyword: /Register|Sign Up/i },
  { path: '/services/roommates', name: 'Roommates', keyword: /Roommates/i },
  { path: '/services/BuyHome', name: 'Buy Home', keyword: /Home|House/i },
  { path: '/services/rentalhomes', name: 'Rental Homes', keyword: /Rental/i },
  { path: '/services/cars', name: 'Cars', keyword: /Cars|Vehicles/i },
  { path: '/services/events', name: 'Events', keyword: /Events/i },
  { path: '/services/Localdeals', name: 'Local Deals', keyword: /Local|Deals/i },
  { path: '/services/photography', name: 'Photography', keyword: /Photography|Photographer/i },
  { path: '/kids-class', name: 'Kids Classes', keyword: /Kids|Academic/i },
  { path: '/it-training', name: 'IT Training', keyword: /IT Training|Course/i },
  { path: '/travel-companion', name: 'Travel Companion', keyword: /Travel|Companion/i },
  { path: '/forum', name: 'Community Forum', keyword: /Community|Discussion/i },
  { path: '/admindashboard', name: 'Admin Dashboard', keyword: /Dashboard|Control/i },
];

test.describe('Marketplace Health Check', () => {
  for (const route of routes) {
    test(`Verify ${route.name} (${route.path}) is running fine`, async ({ page }) => {
      // 1. Navigate to the page
      const response = await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // 2. Check if the status is OK (200)
      expect(response?.status()).toBe(200);

      // 3. Verify the page is not empty/broken
      const bodyText = await page.innerText('body');
      expect(bodyText.length).toBeGreaterThan(100);

      // 4. Check for module-specific keyword
      await expect(page.locator('body')).toContainText(route.keyword, { timeout: 10000 });

      // 5. Ensure no "Loading..." spinner is permanently stuck
      // (This assumes your loading state contains the text "Loading")
      const loadingVisible = await page.getByText(/loading/i).isVisible();
      if (loadingVisible) {
        // If loading is visible, wait for it to disappear
        await expect(page.getByText(/loading/i)).not.toBeVisible({ timeout: 15000 });
      }
    });
  }
});
