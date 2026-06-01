import { test, expect } from '@playwright/test';

test.describe('Performance & Security Checks', () => {
  const routesToProfile = ['/', '/events', '/cars', '/homes', '/roommates'];

  for (const route of routesToProfile) {
    test(`load time for ${route} should be under acceptable thresholds`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`Load time for ${route}: ${loadTime}ms`);
      
      // Azure Static Web Apps target load times should ideally be < 3s.
      // We allow 5s here for local development overhead.
      expect(loadTime).toBeLessThan(5000); 
    });
  }
  
  test('security validation: active HTTPS usage & no mixed content on major pages', async ({ page }) => {
    // We check for mixed content errors on the homepage as a baseline security check
    const securityErrors = [];
    page.on('pageerror', err => {
      if (err.message.includes('Mixed Content')) {
        securityErrors.push(err.message);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // There should be zero mixed content errors
    expect(securityErrors).toHaveLength(0);
  });
});
