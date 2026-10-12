import { test, expect, type Page } from '@playwright/test';
import { POSTS, chart, openChart, dragPointTo, plottedPoint, pointStyles, expectText } from './driver';
import { type Vec, f } from './maths';

test.describe('perceptron-classification', () => {
    const id = 'perceptron-classification';

    // Data from src/content/graphs/registry.ts
    const spam: Vec[] = [{ x: 4, y: 5 }, { x: 2, y: 4 }, { x: 0, y: 3 }, { x: -4, y: 1 }, { x: -1, y: 4 }];
    const notSpam: Vec[] = [{ x: 4, y: 3 }, { x: 2, y: 2 }, { x: 0, y: 1 }, { x: -2, y: 0 }, { x: -4, y: -1 }, { x: 1, y: -1 }];

    // Score shown next to each point. Note: the chart scores with the weight vector's tip
    // position (w) relative to the bias point (b): score = w · (point - b).
    const score = (w: Vec, b: Vec, p: Vec) => w.x * (p.x - b.x) + w.y * (p.y - b.y);

    async function expectClassification(page: Page, w: Vec, b: Vec, data = { spam, notSpam }) {
        const { spam, notSpam } = data;
        const c = chart(page, id);
        const expected = [
            ...spam.map(p => ({ label: `Spam (${f(score(w, b, p))})`, correct: score(w, b, p) >= 0 })),
            ...notSpam.map(p => ({ label: `Not Spam (${f(score(w, b, p))})`, correct: score(w, b, p) < 0 })),
        ];
        for (const e of expected) await expectText(c, e.label);

        // Correctly classified points are green, mistakes are red
        const styles = await pointStyles(page, id);
        for (const e of expected) {
            const point = styles.find(s => s.name === e.label);
            expect(point?.color, `colour of "${e.label}"`).toBe(e.correct ? 'green' : 'red');
        }
    }

    test('shows the score and classification of every point', async ({ page }) => {
        await openChart(page, POSTS.perceptronModel, id);
        await expectClassification(page, { x: -2, y: 2 }, { x: -0.5, y: 0.5 });
    });

    /** Where w and b actually are (a drag lands within float precision of its target). */
    async function landed(page: Page, w: Vec, b: Vec) {
        const actual = { w: await plottedPoint(page, id, 'w'), b: await plottedPoint(page, id, 'b') };
        for (const [name, got, want] of [['w', actual.w, w], ['b', actual.b, b]] as const) {
            expect(got.x, `${name}.x`).toBeCloseTo(want.x, 3);
            expect(got.y, `${name}.y`).toBeCloseTo(want.y, 3);
        }
        return actual;
    }

    test('rescores points when the weight vector is dragged', async ({ page }) => {
        await openChart(page, POSTS.perceptronModel, id);
        await dragPointTo(page, id, 'w', { x: -3, y: 3 });
        const { w, b } = await landed(page, { x: -3, y: 3 }, { x: -0.5, y: 0.5 });
        await expectClassification(page, w, b);
    });

    test('moving the bias carries the weight vector with it', async ({ page }) => {
        await openChart(page, POSTS.perceptronModel, id);
        await dragPointTo(page, id, 'w', { x: -3, y: 3 });
        await dragPointTo(page, id, 'b', { x: 0.5, y: -0.5 });
        // w keeps its offset from b: (-3, 3) - (-0.5, 0.5) + (0.5, -0.5) = (-2, 2)
        const { w, b } = await landed(page, { x: -2, y: 2 }, { x: 0.5, y: -0.5 });
        await expectClassification(page, w, b);
    });

    test('dragging a data point rescores and recolours it', async ({ page }, testInfo) => {
        // Known bug (#57): on a phone the neighbouring point (-1, 4) is inside JSXGraph's
        // touch radius, so the finger grabs it instead. Remove once fixed.
        test.fail(testInfo.project.name === 'mobile', '#57: touch grabs the neighbouring data point on a phone');
        await openChart(page, POSTS.perceptronModel, id);
        // Spam point (0, 3) scores 4.00 (correct); dragged to (3, -3) it lands on the wrong side
        await dragPointTo(page, id, 'Spam (4.00)', { x: 3, y: -3 });
        const moved = await plottedPoint(page, id, 'Spam (-14.00)');
        expect(moved.x).toBeCloseTo(3, 3);
        expect(moved.y).toBeCloseTo(-3, 3);
        await expectClassification(page, { x: -2, y: 2 }, { x: -0.5, y: 0.5 }, {
            spam: spam.map(p => (p.x === 0 && p.y === 3 ? moved : p)),
            notSpam,
        });
    });

    test('rotating the weight vector keeps every score consistent', async ({ page }) => {
        await openChart(page, POSTS.perceptronModel, id);
        await dragPointTo(page, id, 'w', { x: 2.5, y: 3.5 });
        // The bias point slides onto the new weight direction
        const w = await plottedPoint(page, id, 'w');
        const b = await plottedPoint(page, id, 'b');
        expect(w.x).toBeCloseTo(2.5, 3);
        expect(w.y).toBeCloseTo(3.5, 3);
        expect(b.x * w.y - b.y * w.x, 'bias point lies on the weight direction').toBeCloseTo(0, 5);
        await expectClassification(page, w, b);
    });
});

test.describe('perceptron-training', () => {
    const id = 'perceptron-training';

    // Data and settings from the chart (and the post's Python code)
    const data = [
        { x: 4.0, y: 5.0, cls: 1 }, { x: 5.0, y: 4.0, cls: 1 }, { x: 3.0, y: 5.5, cls: 1 },
        { x: 2.0, y: 1.0, cls: 0 }, { x: 3.0, y: 0.5, cls: 0 }, { x: 1.0, y: 2.0, cls: 0 },
    ];
    const learningRate = 0.05;
    const initial = { w: { x: 1, y: -1 }, b: -1 };

    /** Reference perceptron: visits points in order, one per "Train Step". */
    function* train() {
        const w = { ...initial.w };
        let b = initial.b;
        for (let step = 0; ; step++) {
            const p = data[step % data.length];
            const prediction = w.x * p.x + w.y * p.y + b > 0 ? 1 : 0;
            const error = p.cls - prediction;
            const old = { w: { ...w }, b };
            w.x += learningRate * error * p.x;
            w.y += learningRate * error * p.y;
            b += learningRate * error;
            yield { p, prediction, error, old, w: { ...w }, b, distance: Math.abs(b) / Math.hypot(w.x, w.y) };
        }
    }

    const log = (page: Page) => chart(page, id).locator('[data-chart-log]');

    test('starts ready to train with the initial weights', async ({ page }) => {
        const c = await openChart(page, POSTS.trainingPerceptron, id);
        await expect(log(page)).toHaveText('Ready to train.');
        await expectText(c, f(initial.w.x));
        await expectText(c, f(initial.w.y));
        await expectText(c, f(Math.abs(initial.b) / Math.hypot(initial.w.x, initial.w.y)));
    });

    test('each Train Step applies the perceptron update rule', async ({ page }) => {
        const c = await openChart(page, POSTS.trainingPerceptron, id);
        const steps = train();

        for (let i = 0; i < 12; i++) {
            const s = steps.next().value!;
            await c.getByRole('button', { name: 'Train Step' }).click();

            const lines = log(page);
            await expect(lines).toContainText(`(${f(s.p.x)}, ${f(s.p.y)})`);
            await expect(lines).toContainText(`Actual = ${s.p.cls}, Expected = ${s.prediction}`);
            if (s.error !== 0) {
                await expect(lines).toContainText(`Error = (Actual - Expected) = ${s.error}`);
                await expect(lines).toContainText(`Weights new = [${f(s.w.x)}, ${f(s.w.y)}]`);
                await expect(lines).toContainText(`Bias new = bias old + Δb = ${f(s.old.b)} + ${f(learningRate * s.error)} = ${f(s.b)}`);
            } else {
                await expect(lines).toContainText('Error = 0 (Correct prediction!)');
                await expect(lines).toContainText(`Current Weights: [${f(s.w.x)}, ${f(s.w.y)}]`);
                await expect(lines).toContainText(`Current Bias: ${f(s.b)}`);
            }
            await expect(lines).toContainText(`Boundary Distance = abs(${f(s.b)}) / √(${f(s.w.x)}² + ${f(s.w.y)}²) = ${f(s.distance)}`);

            // The chart's own labels follow the weights
            await expectText(c, f(s.w.x));
            await expectText(c, f(s.w.y));
            await expectText(c, f(s.distance));
        }
    });

    test('Reset restores the initial state', async ({ page }) => {
        const c = await openChart(page, POSTS.trainingPerceptron, id);
        for (let i = 0; i < 3; i++) await c.getByRole('button', { name: 'Train Step' }).click();
        await c.getByRole('button', { name: 'Reset' }).click();
        await expect(log(page)).toHaveText('Reset. Ready to train.');
        await expectText(c, f(initial.w.x));
        await expectText(c, f(initial.w.y));

        // Training again starts from the first point
        const first = train().next().value!;
        await c.getByRole('button', { name: 'Train Step' }).click();
        await expect(log(page)).toContainText(`(${f(first.p.x)}, ${f(first.p.y)})`);
    });
});
