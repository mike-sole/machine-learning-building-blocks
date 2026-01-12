import { describe, it, expect } from 'vitest';
import { calculateDotProduct, relu, calculateDecisionBoundaryAnchor, calculateBiasFromAnchorAndWeight } from '../utils/mlpMath';

describe('MLP Math Utils', () => {
    describe('calculateDotProduct', () => {
        it('should calculate correct dot product', () => {
            const input = { x: 2, y: 3 };
            const state = { w: { x: 4, y: 5 }, b: 6 };
            // 2*4 + 3*5 + 6 = 8 + 15 + 6 = 29
            expect(calculateDotProduct(input, state)).toBe(29);
        });

        it('should handle negative values', () => {
            const input = { x: -2, y: -3 };
            const state = { w: { x: -4, y: 5 }, b: -6 };
            // -2*-4 + -3*5 + -6 = 8 - 15 - 6 = -13
            expect(calculateDotProduct(input, state)).toBe(-13);
        });
    });

    describe('relu', () => {
        it('should return value for positive inputs', () => {
            expect(relu(5)).toBe(5);
            expect(relu(0.1)).toBe(0.1);
        });

        it('should return 0 for negative inputs', () => {
            expect(relu(-5)).toBe(0);
            expect(relu(-0.0001)).toBe(0);
        });

        it('should return 0 for 0', () => {
            expect(relu(0)).toBe(0);
        });
    });

    describe('calculateDecisionBoundaryAnchor', () => {
        it('should return origin for zero weights', () => {
            const state = { w: { x: 0, y: 0 }, b: 10 };
            expect(calculateDecisionBoundaryAnchor(state)).toEqual({ x: 0, y: 0 });
        });

        it('should calculate correct anchor for simple case', () => {
            // w = (0, 1), b = -1
            // normSq = 1
            // k = -(-1)/1 = 1
            // anchor = (0*1, 1*1) = (0, 1)
            const state = { w: { x: 0, y: 1 }, b: -1 };
            expect(calculateDecisionBoundaryAnchor(state)).toEqual({ x: 0, y: 1 });
        });

        it('should calculate correct anchor for diagonal case', () => {
            // w = (1, 1), b = -2
            // normSq = 2
            // k = -(-2)/2 = 1
            // anchor = (1, 1)
            const state = { w: { x: 1, y: 1 }, b: -2 };
            expect(calculateDecisionBoundaryAnchor(state)).toEqual({ x: 1, y: 1 });
        });
    });

    describe('calculateBiasFromAnchorAndWeight', () => {
        it('should reverse calculation correctly', () => {
            const anchor = { x: 0, y: 1 };
            const w = { x: 0, y: 1 };
            // -(0*0 + 1*1) = -1
            expect(calculateBiasFromAnchorAndWeight(anchor, w)).toBe(-1);
        });
    });
});
