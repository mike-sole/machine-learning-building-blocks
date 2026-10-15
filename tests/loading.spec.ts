import { test, expect, type Page } from '@playwright/test';

// Chart code as the dev server serves it: the chart modules and the Mafs library
const chartCode = /\/src\/content\/graphs\/mafs\/|\/node_modules\/(\.vite\/deps\/)?mafs/;

/** Opens a post and returns the path of every chart script it downloaded. */
async function chartRequests(page: Page, path: string): Promise<string[]> {
    const requested: string[] = [];
    page.on('request', request => {
        const { pathname } = new URL(request.url());
        if (chartCode.test(pathname)) requested.push(pathname);
    });
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.waitForLoadState('networkidle');
    return requested;
}

test('a post without charts downloads no chart code', async ({ page }) => {
    expect(await chartRequests(page, '/machine-learning-building-blocks/post/weighted-sum')).toEqual([]);
});

test('a post downloads only the charts it shows', async ({ page }) => {
    const requested = await chartRequests(page, '/machine-learning-building-blocks/post/the-perceptron-model');
    await expect(page.locator('[data-chart="perceptron-classification"] svg').first()).toBeVisible();
    expect(requested.some(path => path.endsWith('/PerceptronClassification.tsx'))).toBe(true);
    expect(requested.filter(path => /\/(Mlp|PerceptronTraining|TwoVector|UnitCircle|MovieVector)/.test(path))).toEqual([]);
});
