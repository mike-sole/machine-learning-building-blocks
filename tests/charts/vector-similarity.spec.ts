import { test, expect, type Locator } from '@playwright/test';
import { POSTS, openChart, dragPointTo, plottedPoint, expectText, chartTexts } from './driver';
import { type Vec, f, length, dot, distance, cosine, angleDeg, onUnitCircle } from './maths';

const A0: Vec = { x: 3.5, y: 1 };
const B0: Vec = { x: 2, y: 4 };

// Targets avoid zero coordinates so labels never show "-0.00"
const A1: Vec = { x: -3, y: 1 };
const B1: Vec = { x: 1, y: -2 };

const angleLabel = (a: Vec, b: Vec) => `${f(angleDeg(a, b), 1)}°`;

async function expectTexts(c: Locator, texts: string[]) {
    for (const t of texts) await expectText(c, t);
}

test.describe('vector-similarity-intro', () => {
    const id = 'vector-similarity-intro';

    const expected = (a: Vec, b: Vec) => [
        angleLabel(a, b),
        f(length(a)),
        f(length(b)),
        f(distance(a, b)),
    ];

    test('shows the angle, vector lengths and distance', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await expectTexts(c, expected(A0, B0));
    });

    test('updates when vectors are dragged', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await dragPointTo(page, id, 'a', A1);
        await expectTexts(c, expected(A1, B0));
        await dragPointTo(page, id, 'b', B1);
        await expectTexts(c, expected(A1, B1));
    });
});

test.describe('dot-product-geometric', () => {
    const id = 'dot-product-geometric';

    const expected = (a: Vec, b: Vec) => [
        `a length = ${f(length(a))}`,
        `b length = ${f(length(b))}`,
        `Euclidean distance = ${f(distance(a, b))}`,
        `Cosine similarity = ${f(cosine(a, b))} = cos(${angleLabel(a, b)})`,
        `Dot product = ${f(dot(a, b))} = ${f(length(a))} ⋅ ${f(length(b))} ⋅ ${f(cosine(a, b))}`,
    ];

    test('shows the similarity measures', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await expectTexts(c, expected(A0, B0));
    });

    test('updates every measure when vectors are dragged', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await dragPointTo(page, id, 'a', A1);
        await expectTexts(c, expected(A1, B0));
        await dragPointTo(page, id, 'b', B1);
        await expectTexts(c, expected(A1, B1));
    });
});

test.describe('dot-product-comparison', () => {
    const id = 'dot-product-comparison';

    const expected = (a: Vec, b: Vec) => [
        `a = [${f(a.x, 1)}, ${f(a.y, 1)}]`,
        `b = [${f(b.x, 1)}, ${f(b.y, 1)}]`,
        `a length = ${f(length(a))}`,
        `b length = ${f(length(b))}`,
        `Cosine = ${f(cosine(a, b))} = cos(${angleLabel(a, b)})`,
        `a ⋅ b = ${f(a.x, 1)} ⋅ ${f(b.x, 1)} + ${f(a.y, 1)} ⋅ ${f(b.y, 1)} = ${f(dot(a, b))}`,
        `a ⋅ b = ${f(length(a), 1)} ⋅ ${f(length(b), 1)} ⋅ ${f(cosine(a, b))} = ${f(dot(a, b))}`,
    ];

    test('shows the algebraic and geometric dot product', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await expectTexts(c, expected(A0, B0));
    });

    test('both calculations agree after dragging', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await dragPointTo(page, id, 'a', A1);
        await expectTexts(c, expected(A1, B0));
        await dragPointTo(page, id, 'b', B1);
        await expectTexts(c, expected(A1, B1));
    });
});

test.describe('math-notations', () => {
    const id = 'math-notations';

    const expected = (a: Vec, b: Vec) => [
        `a = (${f(a.x)}, ${f(a.y)})`,
        `b = (${f(b.x)}, ${f(b.y)})`,
        `||a - b|| = ${f(distance(a, b))} = √((${f(a.x)} - ${f(b.x)})2 + (${f(a.y)} - ${f(b.y)})2)`,
        `||a|| = ${f(length(a))} = √(${f(a.x)}2 + ${f(a.y)}2)`,
        `||b|| = ${f(length(b))} = √(${f(b.x)}2 + ${f(b.y)}2)`,
        `a ⋅ b = ${f(dot(a, b))} = ${f(a.x)} ⋅ ${f(b.x)} + ${f(a.y)} ⋅ ${f(b.y)}`,
        `a ⋅ b = ${f(dot(a, b))} = ||a|| ||b|| cos θ = ${f(length(a))} ⋅ ${f(length(b))} ⋅ ${f(cosine(a, b))}`,
        `cos θ = ${f(cosine(a, b))} = a ⋅ b ||a|| ||b|| = ${f(dot(a, b))} ${f(length(a))} ⋅ ${f(length(b))}`,
    ];

    test('shows every equation with the current values', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await expectTexts(c, expected(A0, B0));
    });

    test('updates every equation when vectors are dragged', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        await dragPointTo(page, id, 'a', A1);
        await expectTexts(c, expected(A1, B0));
        await dragPointTo(page, id, 'b', B1);
        await expectTexts(c, expected(A1, B1));
    });
});

// Unit circle charts: vector a slides on the unit circle, b is fixed at (1, 0),
// and the right-hand board plots the measure against the angle.
const unitCircleCharts = [
    { id: 'cosine-normalized', plots: [{ name: 'Cosine Similarity', value: (a: Vec) => a.x }] },
    { id: 'cosine-distance', plots: [{ name: '1 - Cosine Similarity', value: (a: Vec) => 1 - a.x }] },
    {
        id: 'distance-comparison',
        plots: [
            { name: '1 - Cosine Similarity', value: (a: Vec) => 1 - a.x },
            { name: 'Euclidean Distance', value: (a: Vec) => distance(a, { x: 1, y: 0 }) },
        ],
    },
];

for (const { id, plots } of unitCircleCharts) {
    test.describe(id, () => {
        const b: Vec = { x: 1, y: 0 };

        test('starts at 45 degrees', async ({ page }) => {
            const c = await openChart(page, POSTS.vectorSimilarity, id);
            await expectText(c, '45.0°');
        });

        for (const deg of [120, 250]) {
            test(`plots the measure for vector a at ${deg} degrees`, async ({ page }) => {
                const c = await openChart(page, POSTS.vectorSimilarity, id);
                const a = onUnitCircle(deg);
                await dragPointTo(page, id, 'a', a);

                await expectText(c, angleLabel(b, a));
                if (id === 'distance-comparison') await expectText(c, f(distance(a, b)));

                for (const plot of plots) {
                    const p = await plottedPoint(page, id, plot.name, 1);
                    expect(p.x, `${plot.name} angle (radians)`).toBeCloseTo((deg * Math.PI) / 180, 2);
                    expect(p.y, `${plot.name} value`).toBeCloseTo(plot.value(a), 2);
                }
            });
        }
    });
}

test.describe('movie vectors', () => {
    // Values match the tables in the blog post
    test('normalised movie vectors show the expected angles', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, 'movie-vectors-normalized');
        await expectTexts(c, ['33.7°', '35.5°']);
    });

    test('normalised movie vectors each show length 1.00', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, 'movie-vectors-normalized');
        await expect.poll(async () => (await chartTexts(c)).filter(t => t === '1.00').length, { message: 'three 1.00 length labels' }).toBe(3);
    });

    const popularity = (a: Vec, b: Vec, cv: Vec) => [
        angleLabel(a, b), angleLabel(b, cv),
        f(length(a)), f(length(b)), f(length(cv)),
        f(distance(a, b)), f(distance(a, cv)), f(distance(b, cv)),
    ];
    const MOVIES = { a: { x: 5, y: 1 }, b: { x: 9, y: 9 }, c: { x: 0.5, y: 3 } };

    test('popularity vectors show the lengths, angles and distances from the post', async ({ page }) => {
        const c = await openChart(page, POSTS.vectorSimilarity, 'movie-vectors-popularity');
        await expectTexts(c, popularity(MOVIES.a, MOVIES.b, MOVIES.c));
        await expectTexts(c, ['5.10', '12.73', '3.04', '8.94', '4.92', '10.40']);
    });

    test('dragging a popularity vector updates its length, angle and distances', async ({ page }) => {
        const id = 'movie-vectors-popularity';
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        const a = { x: 7, y: 2 };
        await dragPointTo(page, id, 'a', a);
        await expectTexts(c, popularity(a, MOVIES.b, MOVIES.c));
    });

    test('dragging a normalised vector updates the angles', async ({ page }) => {
        const id = 'movie-vectors-normalized';
        const c = await openChart(page, POSTS.vectorSimilarity, id);
        const b = onUnitCircle(60);
        await dragPointTo(page, id, 'b', b);
        const a = onUnitCircle(angleDeg({ x: 1, y: 0 }, MOVIES.a));
        const cv = onUnitCircle(angleDeg({ x: 1, y: 0 }, MOVIES.c));
        await expectTexts(c, [angleLabel(a, b), angleLabel(b, cv)]);
    });
});

test('cosine-function shows degree tick labels', async ({ page }) => {
    const c = await openChart(page, POSTS.vectorSimilarity, 'cosine-function');
    await expectTexts(c, ['90.0°', '180.0°', '270.0°', '360.0°']);
});
