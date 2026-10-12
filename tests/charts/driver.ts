import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Chart driver: the ONLY place the chart tests touch the charting library.
 *
 * The specs describe behaviour in chart (maths) coordinates and visible text,
 * e.g. "drag vector a to (3, 0) and expect 'a length = 3.00'". Migrating a chart
 * to another library (e.g. Mafs) should only require reimplementing these
 * functions for it; the expectations in the specs stay the same.
 *
 * It talks to the charts only through the dev-only, library-neutral `window.__charts`
 * hook (src/components/chartTestHook.ts) and two DOM attributes: `data-chart-board` on
 * each board container and, for labels that aren't direct children of a board,
 * `data-chart-label`. A chart built with any library passes these tests by providing them.
 */

type Handle = import('../../src/components/chartTestHook').ChartBoardHandle;
type ChartsWindow = Window & { __charts: Record<string, Handle[]> };

export const POSTS = {
    vectorSimilarity: '/machine-learning-building-blocks/post/vector-similarity-measures',
    perceptronModel: '/machine-learning-building-blocks/post/the-perceptron-model',
    trainingPerceptron: '/machine-learning-building-blocks/post/training-the-perceptron',
    mlp: '/machine-learning-building-blocks/post/the-multi-layered-perceptron',
} as const;

export interface ScreenPoint { x: number; y: number }

/** The wrapper around a chart, located by the stable `data-chart` attribute set in Post.tsx. */
export const chart = (page: Page, id: string): Locator => page.locator(`[data-chart="${id}"]`);

/** Open a post and wait until the given chart has been initialised. */
export async function openChart(page: Page, postPath: string, id: string): Promise<Locator> {
    await page.goto(postPath);
    await page.waitForFunction(
        (chartId) => !!(window as unknown as { __charts?: Record<string, unknown> }).__charts?.[chartId],
        id,
    );
    const locator = chart(page, id);
    await locator.scrollIntoViewIfNeeded();
    await waitForStableLayout(locator);
    return locator;
}

/** Wait until the chart stops moving (posts animate in on load), so screen coordinates stay valid. */
async function waitForStableLayout(locator: Locator): Promise<void> {
    let previous = '';
    await expect.poll(async () => {
        const box = JSON.stringify(await locator.boundingBox());
        const stable = box === previous;
        previous = box;
        return stable;
    }, { intervals: [100], message: 'chart layout to settle' }).toBe(true);
}

/** Convert chart coordinates on board `boardIndex` of chart `id` to page (viewport) coordinates. */
export async function toScreen(page: Page, id: string, x: number, y: number, boardIndex = 0): Promise<ScreenPoint> {
    return page.evaluate(({ id, x, y, boardIndex }) =>
        (window as unknown as ChartsWindow).__charts[id][boardIndex].toScreen(x, y), { id, x, y, boardIndex });
}

/** Every point on a board, as reported by the chart's test hook. */
async function points(page: Page, id: string, boardIndex: number) {
    return page.evaluate(({ id, boardIndex }) =>
        (window as unknown as ChartsWindow).__charts[id][boardIndex].points(), { id, boardIndex });
}

/**
 * Chart coordinates of a draggable point, found by its visible name.
 * `occurrence` picks between points sharing a name (in creation order).
 */
export async function pointPosition(page: Page, id: string, name: string, occurrence = 0, boardIndex = 0): Promise<{ x: number; y: number }> {
    const el = (await points(page, id, boardIndex)).filter(p => p.name === name && p.visible && p.draggable)[occurrence];
    if (!el) throw new Error(`No draggable point named "${name}" (#${occurrence}) in chart ${id}`);
    return { x: el.x, y: el.y };
}

/** Chart coordinates of any point (draggable or computed), found by its visible name. */
export async function plottedPoint(page: Page, id: string, name: string, boardIndex = 0): Promise<{ x: number; y: number }> {
    const el = (await points(page, id, boardIndex)).find(p => p.name === name);
    if (!el) throw new Error(`No point named "${name}" in chart ${id}`);
    return { x: el.x, y: el.y };
}

/**
 * Names of the visible points a reader can drag on each board, sorted, with any trailing
 * score in brackets removed ("Spam (4.00)" → "Spam"). Empty list per board when the chart is not ready.
 */
export async function draggablePoints(page: Page, id: string): Promise<string[][]> {
    return page.evaluate((id) => {
        const boards = (window as unknown as Partial<ChartsWindow>).__charts?.[id] ?? [];
        return boards.map(b => b.points()
            .filter(p => p.visible && p.draggable)
            .map(p => p.name.replace(/\s*\([^)]*\)$/, ''))
            .sort());
    }, id);
}

/** Name and fill colour of every visible, named point (e.g. to check correct/incorrect colouring). */
export async function pointStyles(page: Page, id: string, boardIndex = 0): Promise<{ name: string; color: string }[]> {
    return (await points(page, id, boardIndex))
        .filter(p => p.visible && p.name)
        .map(p => ({ name: p.name, color: p.color ?? '' }));
}

/** A drag in progress: the pointer is still pressed. */
export interface HeldDrag {
    release(): Promise<void>;
}

/**
 * Press at one page position and move to another with a real pointer (a finger on touch
 * devices, otherwise the mouse), without letting go.
 */
export async function pressAndMove(page: Page, from: ScreenPoint, to: ScreenPoint): Promise<HeldDrag> {
    // Move at human speed: chart libraries may drop pointer moves that arrive faster
    // than their frame rate (JSXGraph's maxFrameRate), which would lose the final position.
    const steps = 10;
    const path = Array.from({ length: steps }, (_, i) => ({
        x: from.x + ((to.x - from.x) * (i + 1)) / steps,
        y: from.y + ((to.y - from.y) * (i + 1)) / steps,
    }));

    if (await page.evaluate(() => navigator.maxTouchPoints > 0)) {
        // Playwright's touchscreen API only taps, so send the touch drag through the DevTools protocol (Chromium)
        const cdp = await page.context().newCDPSession(page);
        const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', p?: ScreenPoint) =>
            cdp.send('Input.dispatchTouchEvent', { type, touchPoints: p ? [{ x: p.x, y: p.y }] : [] });
        await touch('touchStart', from);
        for (const p of path) {
            await touch('touchMove', p);
            await page.waitForTimeout(30);
        }
        await page.waitForTimeout(50);
        await touch('touchMove', to);
        return {
            async release() {
                await touch('touchEnd');
                await cdp.detach();
            },
        };
    }

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    for (const p of path) {
        await page.mouse.move(p.x, p.y);
        await page.waitForTimeout(30);
    }
    await page.waitForTimeout(50);
    await page.mouse.move(to.x, to.y);
    return { release: () => page.mouse.up() };
}

/** Drag from one page position to another with a real pointer: a finger on touch devices, otherwise the mouse. */
export async function dragScreen(page: Page, from: ScreenPoint, to: ScreenPoint): Promise<void> {
    await (await pressAndMove(page, from, to)).release();
}

/** Drag the named point to the given chart coordinates and keep holding it there. */
export async function holdPointAt(page: Page, id: string, name: string, target: { x: number; y: number }, occurrence = 0, boardIndex = 0): Promise<HeldDrag> {
    const start = await pointPosition(page, id, name, occurrence, boardIndex);

    // Tall charts can put the handle, or where it is dragged to, outside the viewport, where the
    // pointer can't reach: centre the drag first
    const first = await toScreen(page, id, start.x, start.y, boardIndex);
    const last = await toScreen(page, id, target.x, target.y, boardIndex);
    const viewport = page.viewportSize();
    const margin = 20;
    if (viewport && [first.y, last.y].some(y => y < margin || y > viewport.height - margin)) {
        await page.evaluate((dy) => window.scrollBy(0, dy), (first.y + last.y) / 2 - viewport.height / 2);
        await waitForStableLayout(chart(page, id));
    }

    const from = await toScreen(page, id, start.x, start.y, boardIndex);
    const to = await toScreen(page, id, target.x, target.y, boardIndex);
    return pressAndMove(page, from, to);
}

/** Drag the named point to the given chart coordinates. */
export async function dragPointTo(page: Page, id: string, name: string, target: { x: number; y: number }, occurrence = 0, boardIndex = 0): Promise<void> {
    await (await holdPointAt(page, id, name, target, occurrence, boardIndex)).release();
}

/** Drag the named point by a delta in chart coordinates. */
export async function dragPointBy(page: Page, id: string, name: string, delta: { x: number; y: number }, occurrence = 0, boardIndex = 0): Promise<void> {
    const start = await pointPosition(page, id, name, occurrence, boardIndex);
    await dragPointTo(page, id, name, { x: start.x + delta.x, y: start.y + delta.y }, occurrence, boardIndex);
}

/** All visible text inside a chart, one entry per text element, whitespace-normalised. */
export async function chartTexts(locator: Locator): Promise<string[]> {
    return locator.evaluate((el) => {
        // HTML labels sit directly inside a board (or are marked data-chart-label); axis labels etc. are SVG text
        const nodes = el.querySelectorAll('[data-chart-board] > div, [data-chart-label], [data-chart-board] text, button, [data-chart-log] > div');
        return Array.from(nodes)
            .map((n) => ((n as HTMLElement).innerText ?? n.textContent ?? '').replace(/\s+/g, ' ').trim())
            .filter(Boolean);
    });
}

/** Assert the chart shows a text element exactly equal to `text`. */
export async function expectText(locator: Locator, text: string): Promise<void> {
    await expect.poll(() => chartTexts(locator), { message: `chart text "${text}"` }).toContain(text);
}

/** Collect uncaught page errors and console errors for the whole test. */
export function trackErrors(page: Page): string[] {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
    });
    return errors;
}

/** Each plotted function on a board: its name, x range, and its values sampled at `samples` evenly spaced x across that range. */
export async function plotSamples(page: Page, id: string, boardIndex = 0, samples = 25) {
    return page.evaluate(({ id, boardIndex, samples }) =>
        (window as unknown as ChartsWindow).__charts[id][boardIndex].plots().map(p => {
            const xs = Array.from({ length: samples }, (_, i) => p.from + ((p.to - p.from) * i) / (samples - 1));
            return { name: p.name, from: p.from, to: p.to, samples: xs.map(x => ({ x, y: p.y(x) })) };
        }), { id, boardIndex, samples });
}

/** Chart coordinates of every point with the given visible name, in creation order. */
export async function plottedPoints(page: Page, id: string, name: string, boardIndex = 0): Promise<{ x: number; y: number }[]> {
    return (await points(page, id, boardIndex)).filter(p => p.name === name).map(p => ({ x: p.x, y: p.y }));
}
