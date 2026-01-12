import { test, expect } from '@playwright/test';

test('MLP Architecture Chart Renders', async ({ page }) => {
    // Navigate to the post
    await page.goto('/machine-learning-building-blocks/post/the-multi-layered-perceptron');
    await page.waitForLoadState('networkidle');

    // Wait for the chart
    const chart = page.locator('#jxgbox-mlp-architecture');
    await expect(chart).toBeVisible();

    // Take snapshot (this verifies padding is removed if we inspect result)
    await expect(chart).toHaveScreenshot('mlp-architecture.png');
});
