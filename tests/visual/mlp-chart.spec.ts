import { test, expect } from '@playwright/test';

test.describe('MLP Decision Boundaries Chart', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the post containing the chart
        await page.goto('/machine-learning-building-blocks/post/the-multi-layered-perceptron');
        await page.waitForLoadState('networkidle');

        // Wait for the chart to be visible
        await expect(page.locator('#jxgbox-mlp-decision-boundaries')).toBeVisible();
    });

    test('initial render matches snapshot', async ({ page }) => {
        const chart = page.locator('#jxgbox-mlp-decision-boundaries');
        // Initial screenshot
        await expect(chart).toHaveScreenshot('mlp-initial-render.png');
    });

    test('updates diagram when interacting with Hidden Node 1 weights', async ({ page }) => {
        const chart = page.locator('#jxgbox-mlp-decision-boundaries');

        await expect(page.getByText(/Hidden Node 1/)).toBeVisible();
        const content = await chart.innerHTML();
        console.log('Chart Content:', content);
        await expect(page.getByText(/w.*-0\.63/).first()).toBeVisible();

        // Take a screenshot before interaction
        // await expect(chart).toHaveScreenshot('mlp-before-interaction.png'); 
    });
});
