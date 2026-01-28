import { test, expect } from '@playwright/test';

test.describe('Wordsmith E2E', () => {
  test('should load the homepage and show the main card', async ({ page }) => {
    await page.goto('/');
    
    // Check for the main specific heading or card content to avoid strict mode violations
    await expect(page.getByRole('heading', { name: /Wordsmith - AI branding assistant/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /generate copy/i })).toBeVisible();
  });

  test('should allow selecting a sample prompt', async ({ page }) => {
    await page.goto('/');
    
    const coffeeSample = page.getByRole('button', { name: /Specialty coffee roastery/i });
    await coffeeSample.click();
    
    const input = page.getByPlaceholder(/specialty coffee roastery/i);
    await expect(input).toHaveValue('specialty coffee roastery');
  });

  test('should generate branding content successfully (mocked)', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Mock the backend API call
    await page.route('**/wordsmith*', async route => {
      const json = {
        branding_text_result: "Experience coffee like never before.\nSip the difference.\nBoldly brewed for you.",
        keywords: ["coffee", "aroma", "bold"],
        hashtags: ["#coffee", "#aroma", "#bold"],
        voice_profile: "bold_minimalist",
        prompt_insights: {
          message: "Great topic choice!",
          severity: "info",
          suggestions: []
        }
      };
      await route.fulfill({ json });
    });

    await page.goto('/');

    // 1. Select a topic (via sample for speed)
    await page.getByRole('button', { name: /Specialty coffee roastery/i }).click();

    // 2. Click Generate
    const generateBtn = page.getByRole('button', { name: /generate copy/i });
    await generateBtn.click();

    // 3. Verify Results
    await expect(page.getByText("Experience coffee like never before.")).toBeVisible();
    await expect(page.getByText("#coffee")).toBeVisible();
    
    // 4. Verify Copy Feedback
    // Click the first copy button (associated with the first snippet)
    await page.getByRole('button', { name: /copy branding snippet/i }).first().click();
    
    // The button's accessible name changes to "Branding snippet copied"
    await expect(page.getByRole('button', { name: /branding snippet copied/i })).toBeVisible();
  });
});
