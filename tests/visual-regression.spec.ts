import { test, expect } from '@playwright/test';

const pages = [
    { name: 'home', path: '/machine-learning-building-blocks/' },
    { name: 'post-weighted-sum', path: '/machine-learning-building-blocks/post/weighted-sum' },
    { name: 'post-matrix-multiplication', path: '/machine-learning-building-blocks/post/matrix-multiplication' },
    { name: 'post-vector-similarity', path: '/machine-learning-building-blocks/post/vector-similarity-measures' },
    { name: 'post-perceptron-model', path: '/machine-learning-building-blocks/post/the-perceptron-model' },
    { name: 'post-training-perceptron', path: '/machine-learning-building-blocks/post/training-the-perceptron' },
];

for (const { name, path } of pages) {
    test(`visual regression for ${name}`, async ({ page }) => {
        await page.goto(path);
        // Wait for network idle to ensure graphs and fonts load
        await page.waitForLoadState('networkidle');
        // Additional small wait for animations/rendering
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, maxDiffPixelRatio: 0.05 });
    });
}
