import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Chart driver: the ONLY place the chart tests touch the charting library.
 *
 * The specs describe behaviour in chart (maths) coordinates and visible text,
 * e.g. "drag vector a to (3, 0) and expect 'a length = 3.00'". Migrating a chart
 * to another library (e.g. Mafs) should only require reimplementing these
 * functions for it; the expectations in the specs stay the same.
 *
 * The JSXGraph implementation relies on the dev-only `window.__charts` hook
 * registered by src/components/InteractiveGraph.tsx.
 */

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
    return page.evaluate(({ id, x, y, boardIndex }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const board = (window as any).__charts[id][boardIndex];
        const container = board.containerObj as HTMLElement;
        const rect = container.getBoundingClientRect();
        return {
            x: rect.left + container.clientLeft + board.origin.scrCoords[1] + x * board.unitX,
            y: rect.top + container.clientTop + board.origin.scrCoords[2] - y * board.unitY,
        };
    }, { id, x, y, boardIndex });
}

/**
 * Chart coordinates of a draggable point, found by its visible name (HTML stripped).
 * `occurrence` picks between points sharing a name (in creation order).
 */
export async function pointPosition(page: Page, id: string, name: string, occurrence = 0, boardIndex = 0): Promise<{ x: number; y: number }> {
    return page.evaluate(({ id, name, occurrence, boardIndex }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const board = (window as any).__charts[id][boardIndex];
        const strip = (s: unknown) => String(typeof s === 'function' ? s() : s ?? '').replace(/<[^>]*>/g, '').trim();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matches = board.objectsList.filter((el: any) => el.elType === 'point' || el.elType === 'glider')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((el: any) => strip(el.name) === name && el.visProp.visible !== false && !el.visProp.fixed);
        const el = matches[occurrence];
        if (!el) throw new Error(`No draggable point named "${name}" (#${occurrence}) in chart ${id}`);
        return { x: el.X(), y: el.Y() };
    }, { id, name, occurrence, boardIndex });
}

/** Chart coordinates of any point (draggable or computed), found by its visible name. */
export async function plottedPoint(page: Page, id: string, name: string, boardIndex = 0): Promise<{ x: number; y: number }> {
    return page.evaluate(({ id, name, boardIndex }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const board = (window as any).__charts[id][boardIndex];
        const strip = (s: unknown) => String(typeof s === 'function' ? s() : s ?? '').replace(/<[^>]*>/g, '').trim();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const el = board.objectsList.find((e: any) => (e.elType === 'point' || e.elType === 'glider') && strip(e.name) === name);
        if (!el) throw new Error(`No point named "${name}" in chart ${id}`);
        return { x: el.X(), y: el.Y() };
    }, { id, name, boardIndex });
}

/** Name and fill colour of every visible, named point (e.g. to check correct/incorrect colouring). */
export async function pointStyles(page: Page, id: string, boardIndex = 0): Promise<{ name: string; color: string }[]> {
    return page.evaluate(({ id, boardIndex }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const board = (window as any).__charts[id][boardIndex];
        const strip = (s: unknown) => String(typeof s === 'function' ? s() : s ?? '').replace(/<[^>]*>/g, '').trim();
        return board.objectsList
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((e: any) => (e.elType === 'point' || e.elType === 'glider') && e.visProp.visible !== false && strip(e.name))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((e: any) => ({ name: strip(e.name), color: String(e.visProp.fillcolor).toLowerCase() }));
    }, { id, boardIndex });
}

/** Drag from one page position to another with a real pointer. */
export async function dragScreen(page: Page, from: ScreenPoint, to: ScreenPoint): Promise<void> {
    // Move at human speed: chart libraries may drop pointer moves that arrive faster
    // than their frame rate (JSXGraph's maxFrameRate), which would lose the final position.
    const steps = 10;
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    for (let i = 1; i <= steps; i++) {
        await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
        await page.waitForTimeout(30);
    }
    await page.waitForTimeout(50);
    await page.mouse.move(to.x, to.y);
    await page.mouse.up();
}

/** Drag the named point to the given chart coordinates. */
export async function dragPointTo(page: Page, id: string, name: string, target: { x: number; y: number }, occurrence = 0, boardIndex = 0): Promise<void> {
    const start = await pointPosition(page, id, name, occurrence, boardIndex);

    // Tall charts can put the handle outside the viewport: centre it first
    const first = await toScreen(page, id, start.x, start.y, boardIndex);
    const viewport = page.viewportSize();
    if (viewport && (first.y < 0 || first.y > viewport.height)) {
        await page.evaluate((dy) => window.scrollBy(0, dy), first.y - viewport.height / 2);
        await waitForStableLayout(chart(page, id));
    }

    const from = await toScreen(page, id, start.x, start.y, boardIndex);
    const to = await toScreen(page, id, target.x, target.y, boardIndex);
    await dragScreen(page, from, to);
}

/** Drag the named point by a delta in chart coordinates. */
export async function dragPointBy(page: Page, id: string, name: string, delta: { x: number; y: number }, occurrence = 0, boardIndex = 0): Promise<void> {
    const start = await pointPosition(page, id, name, occurrence, boardIndex);
    await dragPointTo(page, id, name, { x: start.x + delta.x, y: start.y + delta.y }, occurrence, boardIndex);
}

/** All visible text inside a chart, one entry per text element, whitespace-normalised. */
export async function chartTexts(locator: Locator): Promise<string[]> {
    return locator.evaluate((el) => {
        // HTML texts are positioned directly inside the board container; axis labels etc. are SVG text
        const nodes = el.querySelectorAll('.jxgbox > div, .jxgbox text, button, [data-chart-log] > div');
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
