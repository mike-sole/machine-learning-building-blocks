import { test, expect, type Locator, type Page } from '@playwright/test';
import { POSTS, openChart, dragPointBy, chartTexts, plottedPoints } from './driver';
import { f, relu } from './maths';

const id = 'mlp-decision-boundaries';

// XOR data in the order each hidden neuron's view labels it
const data = [
    { x: 2, y: 2, label: 'Spam' },
    { x: -2, y: -2, label: 'Spam' },
    { x: -2, y: 2, label: 'Not Spam' },
    { x: 2, y: -2, label: 'Not Spam' },
];

type Neuron = { w1: number; w2: number; b: number };
const NEURONS = ['h1', 'h2', 'out'] as const;

// Weights from the post's Python code
const INITIAL: Record<(typeof NEURONS)[number], Neuron> = {
    h1: { w1: 1.0, w2: 1.0, b: 0.3 },
    h2: { w1: -0.95, w2: -1.05, b: 0.56 },
    out: { w1: 0.84, w2: 0.86, b: -2.41 },
};

/** Read every number the chart shows and check that all copies of each weight agree. */
async function readNetwork(c: Locator) {
    const texts = await chartTexts(c);

    // Weight label next to each neuron's weight vector: "w₁ 1.00, w₂ 1.00" (h1, h2, out)
    const vectors = texts.map(t => t.match(/^w₁ (-?\d+\.\d\d), w₂ (-?\d+\.\d\d)$/)).filter(m => m !== null);
    expect(vectors, 'one weight label per neuron').toHaveLength(3);

    // Bias labels: one on each bias connection, then one at each decision boundary
    const biases = texts.map(t => t.match(/^w₀ (-?\d+\.\d\d)$/)?.[1]).filter(b => b !== undefined);
    expect(biases, 'bias shown on the connection and on the boundary').toHaveLength(6);

    const neurons = {} as Record<(typeof NEURONS)[number], Neuron>;
    NEURONS.forEach((name, i) => {
        const [, w1, w2] = vectors[i]!;
        expect(biases[i], `${name} bias on connection = on boundary`).toBe(biases[i + 3]);
        // The incoming connection labels show the same weights
        expect(texts, `${name} w₁ connection label`).toContain(`w₁ ${w1}`);
        expect(texts, `${name} w₂ connection label`).toContain(`w₂ ${w2}`);
        neurons[name] = { w1: Number(w1), w2: Number(w2), b: Number(biases[i]) };
    });

    // Activation shown for each data point in the hidden neuron views: "Spam (4.30)"
    const activations = texts.map(t => t.match(/^(Spam|Not Spam) \((-?\d+\.\d\d)\)$/)).filter(m => m !== null);
    expect(activations, 'four activations per hidden neuron').toHaveLength(8);

    return { neurons, activations: { h1: activations.slice(0, 4), h2: activations.slice(4, 8) } };
}

/** Each hidden neuron shows ReLU(w · x + b) for every data point. */
async function expectConsistent(c: Locator) {
    const { neurons, activations } = await readNetwork(c);
    for (const h of ['h1', 'h2'] as const) {
        data.forEach((p, i) => {
            const [, label, value] = activations[h][i]!;
            const n = neurons[h];
            expect(label).toBe(p.label);
            // Labels are rounded to 2dp, so allow for rounding in the displayed weights
            expect(Number(value), `${h} activation for (${p.x}, ${p.y})`).toBeCloseTo(relu(n.b + n.w1 * p.x + n.w2 * p.y), 1);
        });
    }
    return neurons;
}

const asText = (n: Neuron) => [f(n.w1), f(n.w2), f(n.b)];

test('shows the weights from the post and the resulting activations', async ({ page }) => {
    const c = await openChart(page, POSTS.mlp, id);
    const neurons = await expectConsistent(c);
    for (const name of NEURONS) expect(asText(neurons[name]), name).toEqual(asText(INITIAL[name]));

    // Exact activations, as listed in the post's output table
    const { activations } = await readNetwork(c);
    expect(activations.h1.map(m => m[2])).toEqual(['4.30', '0.00', '0.30', '0.30']);
    expect(activations.h2.map(m => m[2])).toEqual(['0.00', '4.56', '0.36', '0.76']);
});

test("while h1's weight vector is dragged, its boundary point keeps its projection from where the drag began", async ({ page }) => {
    // h1 starts with w = (1, 1), b = 0.3: boundary point (-0.15, -0.15), tip (0.85, 0.85), in h1's own coordinates.
    // Dragging the tip by (0.4, -0.3) on the board moves it by (0.3, -0.225) in h1's graph (4 board units per 3).
    const c = await openChart(page, POSTS.mlp, id);
    await dragPointBy(page, id, 'w', { x: 0.4, y: -0.3 }, 0);
    const tip = { x: 1.15, y: 0.625 };
    const t = (-0.15 * tip.x - 0.15 * tip.y) / (tip.x ** 2 + tip.y ** 2);
    const anchor = { x: t * tip.x, y: t * tip.y };
    const w = { x: tip.x - anchor.x, y: tip.y - anchor.y };
    const b = -(anchor.x * w.x + anchor.y * w.y);
    await expect.poll(async () => asText((await readNetwork(c)).neurons.h1)).toEqual([f(w.x), f(w.y), f(b)]);
});

/**
 * The output neuron's graph plots each data point at (h1, h2): its activations in the two hidden neurons.
 * The graph is centred at (10.5, 5.5) on the board, 0.8 board units per unit.
 */
async function expectOutputPoints(page: Page, neurons: Record<(typeof NEURONS)[number], Neuron>) {
    const act = (n: Neuron, p: { x: number; y: number }) => relu(n.b + n.w1 * p.x + n.w2 * p.y);
    for (const label of ['Spam', 'Not Spam']) {
        const expected = data.filter(p => p.label === label).map(p => ({ x: 10.5 + 0.8 * act(neurons.h1, p), y: 5.5 + 0.8 * act(neurons.h2, p) }));
        const actual = await plottedPoints(page, id, label);
        expect(actual, `${label} output points`).toHaveLength(expected.length);
        expected.forEach((e, i) => {
            // Weights are read from 2dp labels, so allow for their rounding
            expect(actual[i].x, `${label} #${i} at h1`).toBeCloseTo(e.x, 1);
            expect(actual[i].y, `${label} #${i} at h2`).toBeCloseTo(e.y, 1);
        });
    }
}

test('the output graph plots each data point at its hidden activations (h1, h2)', async ({ page }) => {
    const c = await openChart(page, POSTS.mlp, id);
    await expectOutputPoints(page, INITIAL);
    // h1's weights change, so the points move along h1
    await dragPointBy(page, id, 'w', { x: 0.4, y: -0.3 }, 0);
    await expect.poll(async () => asText((await readNetwork(c)).neurons.h1)).not.toEqual(asText(INITIAL.h1));
    await expectOutputPoints(page, (await readNetwork(c)).neurons);
});

for (const [occurrence, name] of NEURONS.entries()) {
    test(`dragging ${name}'s weight vector updates only ${name}, everywhere it is shown`, async ({ page }) => {
        const c = await openChart(page, POSTS.mlp, id);
        await dragPointBy(page, id, 'w', { x: 0.4, y: -0.3 }, occurrence);

        await expect.poll(async () => asText((await readNetwork(c)).neurons[name])).not.toEqual(asText(INITIAL[name]));
        const neurons = await expectConsistent(c);
        for (const other of NEURONS.filter(n => n !== name)) {
            expect(asText(neurons[other]), `${other} unchanged`).toEqual(asText(INITIAL[other]));
        }
    });

    test(`dragging ${name}'s boundary changes its bias but not its weights`, async ({ page }) => {
        const c = await openChart(page, POSTS.mlp, id);
        await dragPointBy(page, id, 'b', { x: 0.2, y: 0.2 }, occurrence);

        await expect.poll(async () => f((await readNetwork(c)).neurons[name].b)).not.toEqual(f(INITIAL[name].b));
        const neurons = await expectConsistent(c);
        expect(f(neurons[name].w1)).toBe(f(INITIAL[name].w1));
        expect(f(neurons[name].w2)).toBe(f(INITIAL[name].w2));
    });
}
