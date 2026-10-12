import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chart, chartTexts, trackErrors } from './driver';

/**
 * Every chart referenced by a published post, discovered from the posts themselves,
 * so a new chart is covered as soon as it is added to a post.
 */
const blogDir = join(process.cwd(), 'src/content/blog');
const published = [...readFileSync(join(process.cwd(), 'src/content/posts.ts'), 'utf8')
    .matchAll(/^import \{ \w+ \} from '\.\/blog\/([\w-]+)';/gm)].map(m => m[1]);

const posts = published.map(module => {
    const meta = readFileSync(join(blogDir, `${module}.ts`), 'utf8');
    const id = meta.match(/id: '([\w-]+)'/)![1];
    const markdown = readFileSync(join(blogDir, meta.match(/from '\.\/([\w.-]+\.md)\?raw'/)![1]), 'utf8');
    const charts = [...markdown.matchAll(/```graph\s*\n\s*([\w-]+)\s*\n```/g)].map(m => m[1]);
    return { id, charts };
}).filter(p => p.charts.length > 0);

test('chart discovery found the posts with charts', () => {
    expect(readdirSync(blogDir).length).toBeGreaterThan(0);
    expect(posts.map(p => p.id)).toEqual(expect.arrayContaining(['vector-similarity-measures', 'the-perceptron-model', 'training-the-perceptron', 'the-multi-layered-perceptron']));
});

for (const post of posts) {
    test.describe(`charts in ${post.id}`, () => {
        test('every chart renders without errors or raw TeX', async ({ page }) => {
            const errors = trackErrors(page);
            await page.goto(`/machine-learning-building-blocks/post/${post.id}`);

            // Every chart in the post exists in the registry and was initialised
            await expect.poll(() => page.evaluate(() =>
                Object.keys((window as unknown as { __charts?: object }).__charts ?? {}).sort(),
            ), { timeout: 20_000 }).toEqual([...new Set(post.charts)].sort());

            for (const id of post.charts) {
                const c = chart(page, id);
                await c.scrollIntoViewIfNeeded();
                const box = await c.boundingBox();
                expect(box?.width, `${id} width`).toBeGreaterThan(200);
                expect(box?.height, `${id} height`).toBeGreaterThan(100);

                // MathJax/LaTeX source showing as text means a label failed to render
                const raw = (await chartTexts(c)).filter(t => /\\\(|\\vec|\\text\{|\$\$/.test(t));
                expect(raw, `${id} has unrendered TeX`).toEqual([]);
            }

            expect(errors).toEqual([]);
        });

        test('every chart fits the screen without sideways scrolling', async ({ page }) => {
            await page.goto(`/machine-learning-building-blocks/post/${post.id}`);
            await expect.poll(() => page.evaluate(() =>
                Object.keys((window as unknown as { __charts?: object }).__charts ?? {}).length,
            ), { timeout: 20_000 }).toBe(new Set(post.charts).size);

            const viewport = page.viewportSize()!;
            expect(await page.evaluate(() => document.documentElement.scrollWidth), 'page width').toBeLessThanOrEqual(viewport.width);

            for (const id of post.charts) {
                const c = chart(page, id);
                await c.scrollIntoViewIfNeeded();
                // Each board, and every label on it, lies within the visible width
                const outside = await c.evaluate((el, width) => {
                    const out: string[] = [];
                    for (const board of el.querySelectorAll('.jxgbox')) {
                        const b = board.getBoundingClientRect();
                        if (b.left < 0 || b.right > width) out.push(`board at ${Math.round(b.left)}..${Math.round(b.right)}`);
                        for (const label of board.querySelectorAll(':scope > div')) {
                            const l = label.getBoundingClientRect();
                            if (l.width > 0 && (l.left < b.left - 1 || l.right > b.right + 1)) out.push(`label "${(label as HTMLElement).innerText.trim()}" sticks out`);
                        }
                    }
                    return out;
                }, viewport.width);
                expect(outside, `${id} fits the screen`).toEqual([]);
            }
        });

        for (const id of post.charts) {
            test(`${id} matches its screenshot`, async ({ page }) => {
                await page.goto(`/machine-learning-building-blocks/post/${post.id}`);
                const c = chart(page, id);
                await c.scrollIntoViewIfNeeded();
                await page.waitForLoadState('networkidle');
                await expect(c).toHaveScreenshot(`${id}.png`, { maxDiffPixelRatio: 0.01, animations: 'disabled' });
            });
        }
    });
}
