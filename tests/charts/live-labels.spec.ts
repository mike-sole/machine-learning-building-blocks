import { test, expect, type Page, type Locator } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { POSTS, openChart, holdPointAt, pointPosition, chartTexts } from './driver';
import { onUnitCircle, type Vec } from './maths';

/**
 * Live label parity: every label and line of text a reader sees change while they drag a point
 * (or press a button) must change in exactly the same way after a chart is rebuilt.
 *
 * Each case below is played through and, after every step, compares the chart's texts before and
 * after: which texts appeared and which disappeared while the point is still held, then again when
 * it is released. Texts that never change (axis numbers, names) drop out of the comparison, so
 * the recording only holds the live parts of a chart.
 *
 * The recordings in live-labels/ were made from the JSXGraph charts with
 *   LIVE_LABELS=record npx playwright test live-labels --project=chromium
 * A rebuilt chart passes only if it reproduces them exactly, on desktop and on a touch screen.
 * Re-record only in a commit that deliberately changes what a chart shows, and say why.
 */

type Step =
    | { drag: string; occurrence?: number; board?: number; to?: Vec; by?: Vec }
    | { click: string };

interface Case {
    name: string;
    id: string;
    post: string;
    steps: Step[];
    /** Known touch-screen bug: the case is expected to fail on the mobile project */
    mobileBug?: string;
}

const A1 = { x: -3, y: 1 };
const B1 = { x: 1, y: -2 };
const twoVectors = (id: string): Case => ({
    name: id, id, post: POSTS.vectorSimilarity,
    steps: [{ drag: 'a', to: A1 }, { drag: 'b', to: B1 }],
});
const unitCircle = (id: string): Case => ({
    name: id, id, post: POSTS.vectorSimilarity,
    steps: [{ drag: 'a', to: onUnitCircle(120) }, { drag: 'a', to: onUnitCircle(250) }],
});

const CASES: Case[] = [
    twoVectors('vector-similarity-intro'),
    twoVectors('dot-product-geometric'),
    twoVectors('dot-product-comparison'),
    twoVectors('math-notations'),
    unitCircle('cosine-normalized'),
    unitCircle('cosine-distance'),
    unitCircle('distance-comparison'),
    {
        name: 'movie-vectors-normalized', id: 'movie-vectors-normalized', post: POSTS.vectorSimilarity,
        steps: [{ drag: 'b', to: onUnitCircle(60) }, { drag: 'a', to: onUnitCircle(10) }, { drag: 'c', to: onUnitCircle(100) }],
    },
    {
        name: 'movie-vectors-popularity', id: 'movie-vectors-popularity', post: POSTS.vectorSimilarity,
        steps: [{ drag: 'a', to: { x: 7, y: 2 } }, { drag: 'b', to: { x: 6, y: 8 } }, { drag: 'c', to: { x: 2, y: 5 } }],
    },
    {
        name: 'perceptron-classification-weights-and-bias', id: 'perceptron-classification', post: POSTS.perceptronModel,
        // Targets where no score is exactly 0, which would show as 0.00 or -0.00 depending on sub-pixel rounding
        steps: [{ drag: 'w', to: { x: -3, y: 2 } }, { drag: 'b', to: { x: 0.5, y: -0.5 } }, { drag: 'w', to: { x: 2.5, y: 3.5 } }],
    },
    {
        name: 'perceptron-classification-data-point', id: 'perceptron-classification', post: POSTS.perceptronModel,
        steps: [{ drag: 'Spam (4.00)', to: { x: 3, y: -3 } }],
    },
    {
        name: 'perceptron-training', id: 'perceptron-training', post: POSTS.trainingPerceptron,
        steps: [{ click: 'Train Step' }, { click: 'Train Step' }, { click: 'Train Step' }, { click: 'Reset' }, { click: 'Train Step' }],
    },
    {
        name: 'mlp-decision-boundaries-weights', id: 'mlp-decision-boundaries', post: POSTS.mlp,
        steps: [0, 1, 2].map(occurrence => ({ drag: 'w', occurrence, by: { x: 0.4, y: -0.3 } })),
    },
    {
        name: 'mlp-decision-boundaries-boundaries', id: 'mlp-decision-boundaries', post: POSTS.mlp,
        steps: [0, 1, 2].map(occurrence => ({ drag: 'b', occurrence, by: { x: 0.2, y: 0.2 } })),
        mobileBug: '#45: the boundary handle is too close to the weight handle to touch on a phone',
    },
];

/** Texts in `after` but not `before`, and the reverse, counting repeats; each list sorted. */
function changes(before: string[], after: string[]) {
    const minus = (xs: string[], ys: string[]) => {
        const left = [...ys];
        return xs.filter(x => {
            const i = left.indexOf(x);
            if (i === -1) return true;
            left.splice(i, 1);
            return false;
        }).sort();
    };
    return { appeared: minus(after, before), disappeared: minus(before, after) };
}

/** The chart's texts once they have stopped changing. */
async function settledTexts(page: Page, chart: Locator): Promise<string[]> {
    let previous = JSON.stringify(await chartTexts(chart));
    for (let i = 0; i < 50; i++) {
        await page.waitForTimeout(100);
        const current = JSON.stringify(await chartTexts(chart));
        if (current === previous) return JSON.parse(current);
        previous = current;
    }
    throw new Error('chart texts kept changing');
}

const describeStep = (s: Step) => 'click' in s
    ? `click "${s.click}"`
    : `drag ${s.drag}${s.occurrence ? ` #${s.occurrence}` : ''} ${s.to ? `to (${s.to.x.toFixed(2)}, ${s.to.y.toFixed(2)})` : `by (${s.by!.x}, ${s.by!.y})`}`;

const recordingDir = join(process.cwd(), 'tests/charts/live-labels');

for (const c of CASES) {
    test(`${c.name}: labels and text change as they did with JSXGraph`, async ({ page }, testInfo) => {
        test.fail(!!c.mobileBug && testInfo.project.name === 'mobile', c.mobileBug);
        const chart = await openChart(page, c.post, c.id);
        let texts = await settledTexts(page, chart);
        const recording: { step: string; changed?: ReturnType<typeof changes>; whileHeld?: ReturnType<typeof changes>; onRelease?: ReturnType<typeof changes> }[] = [];

        for (const step of c.steps) {
            if ('click' in step) {
                await chart.getByRole('button', { name: step.click }).click();
                const after = await settledTexts(page, chart);
                recording.push({ step: describeStep(step), changed: changes(texts, after) });
                texts = after;
                continue;
            }
            const start = await pointPosition(page, c.id, step.drag, step.occurrence, step.board);
            const target = step.to ?? { x: start.x + step.by!.x, y: start.y + step.by!.y };
            const held = await holdPointAt(page, c.id, step.drag, target, step.occurrence, step.board);
            const whileHeld = await settledTexts(page, chart);
            await held.release();
            const released = await settledTexts(page, chart);
            recording.push({
                step: describeStep(step),
                whileHeld: changes(texts, whileHeld),
                onRelease: changes(whileHeld, released),
            });
            texts = released;
        }

        const file = join(recordingDir, `${c.name}.json`);
        if (process.env.LIVE_LABELS === 'record') {
            // A step that changes nothing would record a no-op: the drag or click missed
            for (const r of recording) {
                const changed = 'changed' in r ? r.changed : r.whileHeld;
                expect(changed!.appeared.length, `${r.step} changes what the chart shows`).toBeGreaterThan(0);
            }
            mkdirSync(recordingDir, { recursive: true });
            writeFileSync(file, `${JSON.stringify(recording, null, 2)}\n`);
            return;
        }
        expect(recording).toEqual(JSON.parse(readFileSync(file, 'utf8')));
    });
}
