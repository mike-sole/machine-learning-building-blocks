import { describe, it, expect } from 'vitest';
import { handlesFor, weightsOf, projectOnto, dragTip, dragAnchor, relu, activation } from './neuronHandles';
import { dot, type Vec2 } from './geometry';

const close = (a: Vec2, b: Vec2) => {
    expect(a[0]).toBeCloseTo(b[0], 10);
    expect(a[1]).toBeCloseTo(b[1], 10);
};

describe('handlesFor and weightsOf', () => {
    it('place the anchor on the boundary, nearest the origin, and the tip at anchor + w', () => {
        // h1 from the post: w = (1, 1), b = 0.3
        const h = handlesFor([1, 1], 0.3);
        close(h.anchor, [-0.15, -0.15]);
        close(h.tip, [0.85, 0.85]);
        // The anchor is on the boundary w · x + b = 0
        expect(dot([1, 1], h.anchor) + 0.3).toBeCloseTo(0, 10);
    });

    it('round-trip the weights and bias', () => {
        for (const [w, b] of [[[1, 1], 0.3], [[-0.95, -1.05], 0.56], [[0.84, 0.86], -2.41]] as [Vec2, number][]) {
            const back = weightsOf(handlesFor(w, b));
            close(back.w, w);
            expect(back.b).toBeCloseTo(b, 10);
        }
    });
});

describe('projectOnto', () => {
    it('projects onto the line through the origin', () => {
        close(projectOnto([2, 0], [1, 1]), [1, 1]);
        close(projectOnto([3, 4], [2, 0]), [3, 0]);
        close(projectOnto([-1, 1], [1, 1]), [0, 0]);
    });
});

describe('dragTip', () => {
    it('moves the tip and keeps the anchor on the new weight direction', () => {
        const start = handlesFor([1, 1], 0.3);
        const moved = dragTip(start, [1.15, 0.625]);
        close(moved.tip, [1.15, 0.625]);
        const { w } = weightsOf(moved);
        // anchor, tip and origin stay on one line, so the anchor is still the boundary point nearest the origin
        expect(moved.anchor[0] * moved.tip[1] - moved.anchor[1] * moved.tip[0]).toBeCloseTo(0, 10);
        expect(w[0]).toBeCloseTo(1.3287, 3);
        expect(w[1]).toBeCloseTo(0.7221, 3);
    });
});

describe('dragAnchor', () => {
    it('slides the boundary along w, carrying the tip, so the weights stay the same and only the bias changes', () => {
        const start = handlesFor([1, 1], 0.3);
        const moved = dragAnchor(start, [0.24, 0.24]);
        close(moved.anchor, [0.24, 0.24]);
        const { w, b } = weightsOf(moved);
        close(w, [1, 1]);
        expect(b).toBeCloseTo(-0.48, 10);
    });

    it('ignores movement across the weight direction', () => {
        const start = handlesFor([1, 1], 0.3);
        close(dragAnchor(start, [1, -1]).anchor, [0, 0]);
    });
});

describe('relu and activation', () => {
    it('ReLU clips negatives to 0', () => {
        expect(relu(-2)).toBe(0);
        expect(relu(0)).toBe(0);
        expect(relu(1.5)).toBe(1.5);
    });

    it("matches the post's activations for h1 (w = (1, 1), b = 0.3)", () => {
        const h1 = { w: [1, 1] as Vec2, b: 0.3 };
        expect(activation(h1, [2, 2]).toFixed(2)).toBe('4.30');
        expect(activation(h1, [-2, -2]).toFixed(2)).toBe('0.00');
        expect(activation(h1, [-2, 2]).toFixed(2)).toBe('0.30');
    });
});
