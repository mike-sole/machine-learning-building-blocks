import { describe, it, expect } from 'vitest';
import {
    vectorLength, distance, midpoint, directionDeg, ccwAngleDeg, polar,
    angleSector, angleLabelPosition, readableRotationDeg, type Vec2,
} from './geometry';

const close = (actual: Vec2, expected: Vec2) => {
    expect(actual[0]).toBeCloseTo(expected[0], 10);
    expect(actual[1]).toBeCloseTo(expected[1], 10);
};

describe('vectorLength and distance', () => {
    it('measures a 3-4-5 triangle', () => {
        expect(vectorLength([3, 4])).toBe(5);
        expect(vectorLength([-3, -4])).toBe(5);
        expect(distance([1, 1], [4, 5])).toBe(5);
        expect(distance([4, 5], [1, 1])).toBe(5);
    });

    it('is zero for the zero vector and identical points', () => {
        expect(vectorLength([0, 0])).toBe(0);
        expect(distance([2, -3], [2, -3])).toBe(0);
    });
});

describe('midpoint', () => {
    it('is halfway between the points', () => {
        expect(midpoint([0, 0], [3.5, 1])).toEqual([1.75, 0.5]);
        expect(midpoint([-2, 4], [2, -4])).toEqual([0, 0]);
    });
});

describe('directionDeg', () => {
    it('measures counter-clockwise from the positive x-axis', () => {
        expect(directionDeg([1, 0])).toBe(0);
        expect(directionDeg([0, 1])).toBe(90);
        expect(directionDeg([-1, 0])).toBe(180);
        expect(directionDeg([0, -1])).toBe(-90);
        expect(directionDeg([1, 1])).toBeCloseTo(45);
    });
});

describe('ccwAngleDeg', () => {
    it('is the counter-clockwise angle from the first vector to the second', () => {
        expect(ccwAngleDeg([1, 0], [0, 1])).toBeCloseTo(90);
        expect(ccwAngleDeg([0, 1], [1, 0])).toBeCloseTo(270);
        expect(ccwAngleDeg([1, 0], [-1, 0])).toBeCloseTo(180);
    });

    it('matches the blog example (a = [3.5, 1], b = [2, 4]): 47.5°', () => {
        expect(ccwAngleDeg([3.5, 1], [2, 4]).toFixed(1)).toBe('47.5');
    });

    it('stays in [0, 360) when crossing the negative x-axis', () => {
        const angle = ccwAngleDeg([-1, 0.01], [-1, -0.01]);
        expect(angle).toBeGreaterThan(0);
        expect(angle).toBeLessThan(2);
        expect(ccwAngleDeg([2, 3], [4, 6])).toBeCloseTo(0);
    });
});

describe('polar', () => {
    it('places a point at the given radius and direction', () => {
        close(polar(2, 0), [2, 0]);
        close(polar(2, 90), [0, 2]);
        close(polar(1, 225), [-Math.SQRT1_2, -Math.SQRT1_2]);
    });
});

describe('angleSector', () => {
    it('starts at the origin and sweeps counter-clockwise from the first vector to the second', () => {
        const sector = angleSector([1, 0], [0, 1], 1, 4);
        expect(sector).toHaveLength(6);
        close(sector[0], [0, 0]);
        close(sector[1], [1, 0]);
        close(sector[3], [Math.SQRT1_2, Math.SQRT1_2]);
        close(sector[5], [0, 1]);
    });

    it('takes the reflex side when the second vector is clockwise of the first', () => {
        const sector = angleSector([0, 1], [1, 0], 1, 2);
        close(sector[1], [0, 1]);
        close(sector[2], [-Math.SQRT1_2, -Math.SQRT1_2]); // through the third quadrant
        close(sector[3], [1, 0]);
    });

    it('keeps every arc point at the radius', () => {
        for (const p of angleSector([3.5, 1], [2, 4], 1.5).slice(1)) {
            expect(vectorLength(p)).toBeCloseTo(1.5);
        }
    });
});

describe('angleLabelPosition', () => {
    it('sits on the bisector of the marked angle', () => {
        close(angleLabelPosition([1, 0], [0, 1], 2), polar(2, 45));
        close(angleLabelPosition([0, 1], [1, 0], 1), polar(1, 225));
    });
});

describe('readableRotationDeg', () => {
    it('follows the segment (SVG rotation is clockwise, so up-slopes are negative)', () => {
        expect(readableRotationDeg([0, 0], [1, 0])).toBeCloseTo(0);
        expect(readableRotationDeg([0, 0], [1, 1])).toBeCloseTo(-45);
        expect(readableRotationDeg([0, 0], [1, -1])).toBeCloseTo(45);
    });

    it('never turns text upside down', () => {
        expect(readableRotationDeg([0, 0], [-1, 0])).toBeCloseTo(0);
        expect(readableRotationDeg([0, 0], [-1, -1])).toBeCloseTo(-45);
        expect(readableRotationDeg([0, 0], [-1, 1])).toBeCloseTo(45);
        expect(readableRotationDeg([0, 0], [0, 1])).toBeCloseTo(90);
        expect(readableRotationDeg([0, 0], [0, -1])).toBeCloseTo(90);
    });

    it('is the same whichever end the segment starts from', () => {
        expect(readableRotationDeg([2, 4], [3.5, 1])).toBeCloseTo(readableRotationDeg([3.5, 1], [2, 4]));
    });
});
