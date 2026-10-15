import { test, expect } from '@playwright/test';

// Page-level screenshots of the home page and how each post's text renders
// (headings, lists, maths, code blocks). Charts are masked: tests/charts/
// screenshots each one, so a chart change shouldn't change these pages too.
const pages = [
    { name: 'home', path: '/machine-learning-building-blocks/' },
    { name: 'post-weighted-sum', path: '/machine-learning-building-blocks/post/weighted-sum' },
    { name: 'post-matrix-multiplication', path: '/machine-learning-building-blocks/post/matrix-multiplication' },
    { name: 'post-vector-similarity', path: '/machine-learning-building-blocks/post/vector-similarity-measures' },
    { name: 'post-perceptron-model', path: '/machine-learning-building-blocks/post/the-perceptron-model' },
    { name: 'post-training-perceptron', path: '/machine-learning-building-blocks/post/training-the-perceptron' },
    { name: 'post-multi-layered-perceptron', path: '/machine-learning-building-blocks/post/the-multi-layered-perceptron' },
];

for (const { name, path } of pages) {
    test(`visual regression for ${name}`, async ({ page }) => {
        await page.goto(path);
        // Wait for network idle to ensure graphs and fonts load
        await page.waitForLoadState('networkidle');
        // Additional small wait for animations/rendering
        await page.waitForTimeout(1000);
        await expect(page).toHaveScreenshot(`${name}.png`, {
            fullPage: true,
            mask: [page.locator('[data-chart]')],
            maxDiffPixelRatio: 0.01,
        });
    });
}
