import { test, expect } from '@playwright/test';
import { POSTS, openChart, plottedPoint, pointStyles, expectText } from './driver';

/** The 2-3-1 network diagram in The Multi-Layered Perceptron: neurons, their colours and positions, and layer titles. */
const id = 'mlp-architecture';

const INPUT = '#a6cee3';
const HIDDEN = '#fdbf6f';
const OUTPUT = '#b2df8a';

// Layers 4 apart, centred on x = 0; neurons 1.5 apart, centred on y = 0
const NEURONS = [
    { name: 'x1', at: { x: -4, y: 0.75 }, color: INPUT },
    { name: 'x2', at: { x: -4, y: -0.75 }, color: INPUT },
    { name: 'h1,1', at: { x: 0, y: 1.5 }, color: HIDDEN },
    { name: 'h1,2', at: { x: 0, y: 0 }, color: HIDDEN },
    { name: 'h1,3', at: { x: 0, y: -1.5 }, color: HIDDEN },
    { name: 'ŷ', at: { x: 4, y: 0 }, color: OUTPUT },
];

test('shows each neuron, coloured by layer, in its place', async ({ page }) => {
    await openChart(page, POSTS.mlp, id);
    const styles = await pointStyles(page, id);
    expect(styles.map(s => s.name).sort(), 'neurons').toEqual(NEURONS.map(n => n.name).sort());
    for (const n of NEURONS) {
        expect(styles.find(s => s.name === n.name)?.color, `${n.name} colour`).toBe(n.color);
        const at = await plottedPoint(page, id, n.name);
        expect(at.x, `${n.name} x`).toBeCloseTo(n.at.x, 5);
        expect(at.y, `${n.name} y`).toBeCloseTo(n.at.y, 5);
    }
});

test('labels the layers', async ({ page }) => {
    const c = await openChart(page, POSTS.mlp, id);
    for (const title of ['Input Layer', 'Hidden Layer', 'Output Layer']) await expectText(c, title);
    for (const n of NEURONS) await expectText(c, n.name);
});
