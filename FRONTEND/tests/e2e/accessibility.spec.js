import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Requirements (WCAG 2.1 AA)', () => {
  const pagesToCheck = [
    { name: 'Homepage', url: '/' },
    { name: 'Login Page', url: '/login' },
    { name: 'Register Page', url: '/register' },
    { name: 'Events Portal', url: '/events' },
    { name: 'Cars Portal', url: '/cars' },
    { name: 'Rental Homes Portal', url: '/homes' },
    { name: 'Roommates Portal', url: '/roommates' }
  ];

  for (const pageInfo of pagesToCheck) {
    test(`${pageInfo.name} should not have automatically detectable accessibility issues`, async ({ page }) => {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      
      // Check for accessibility issues using axe-core
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Sometimes 3rd party scripts (like Google Auth or Maps) introduce accessibility errors
        // We can exclude them if necessary, e.g., .exclude('#google-auth-iframe')
        .analyze();
        
      // Assert that there are no violations
      // In a real application, you might want to log these instead of strictly failing
      // if there are known issues you are still working on.
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
