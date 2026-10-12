import { test, expect } from '@playwright/test';
import { POSTS, openChart, plotSamples, expectText } from './driver';
import { distance, relu } from './maths';

/**
 * The functions each chart plots, checked by sampling every plotted curve across its range.
 * A chart must plot exactly these functions on each board (in any order), over these ranges.
 */
type Fn = { label: string; from: number; to: number; f: (x: number) => number };

const TAU = 2 * Math.PI;
const cos: Fn = { label: 'cos x', from: 0, to: TAU, f: Math.cos };
const oneMinusCos: Fn = { label: '1 - cos x', from: 0, to: TAU, f: x => 1 - Math.cos(x) };
// Distance from b = (1, 0) to a = (cos x, sin x) on the unit circle
const unitCircleDistance: Fn = { label: 'Euclidean distance', from: 0, to: TAU, f: x => distance({ x: Math.cos(x), y: Math.sin(x) }, { x: 1, y: 0 }) };

const PLOTS: { id: string; post: string; boards: Fn[][] }[] = [
    { id: 'cosine-function', post: POSTS.vectorSimilarity, boards: [[cos]] },
    { id: 'cosine-normalized', post: POSTS.vectorSimilarity, boards: [[], [cos]] },
    { id: 'cosine-distance', post: POSTS.vectorSimilarity, boards: [[], [oneMinusCos]] },
    { id: 'distance-comparison', post: POSTS.vectorSimilarity, boards: [[], [oneMinusCos, unitCircleDistance]] },
    { id: 'relu-function', post: POSTS.mlp, boards: [[{ label: 'max(0, x)', from: -5, to: 5, f: relu }]] },
];

for (const { id, post, boards } of PLOTS) {
    test(`${id} plots ${boards.flat().map(f => f.label).join(' and ')}`, async ({ page }) => {
        await openChart(page, post, id);
        for (const [boardIndex, expected] of boards.entries()) {
            const plots = await plotSamples(page, id, boardIndex);
            expect(plots.length, `number of curves on board ${boardIndex}`).toBe(expected.length);

            // Pair each expected function with the one curve that matches it
            const unmatched = [...plots];
            for (const fn of expected) {
                const i = unmatched.findIndex(p =>
                    Math.abs(p.from - fn.from) < 1e-9 && Math.abs(p.to - fn.to) < 1e-9 &&
                    p.samples.every(s => Math.abs(s.y - fn.f(s.x)) < 1e-9));
                expect(i, `board ${boardIndex} plots ${fn.label} from ${fn.from} to ${fn.to.toFixed(2)}`).toBeGreaterThan(-1);
                unmatched.splice(i, 1);
            }
        }
    });
}

test('relu-function shows its formula', async ({ page }) => {
    const c = await openChart(page, POSTS.mlp, 'relu-function');
    await expectText(c, 'f(x) = max(0, x)');
});
