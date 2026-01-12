
export interface Vector2 {
    x: number;
    y: number;
}

export interface WeightState {
    w: Vector2;
    b: number;
}

/**
 * Calculates the dot product of input vector and weight vector plus bias.
 * z = w.x * x + w.y * y + b
 */
export const calculateDotProduct = (input: Vector2, state: WeightState): number => {
    return input.x * state.w.x + input.y * state.w.y + state.b;
};

/**
 * Rectified Linear Unit function.
 * Returns max(0, z)
 */
export const relu = (z: number): number => {
    return Math.max(0, z);
};

/**
 * Calculates the anchor point for visualizing a decision boundary.
 * The anchor is the point on the weight vector line closest to the origin
 * that satisfies w.x * x + w.y * y + b = 0.
 * Geometrically, this is P0 = -b * w / |w|^2
 */
export const calculateDecisionBoundaryAnchor = (state: WeightState): Vector2 => {
    const { w, b } = state;
    const normSq = w.x * w.x + w.y * w.y;
    if (normSq === 0) return { x: 0, y: 0 };
    const k = -b / normSq;
    return { x: k * w.x, y: k * w.y };
};

/**
 * Calculates the derived bias 'b' given an anchor point and a weight vector.
 * Inverse of calculateDecisionBoundaryAnchor logic for user interaction.
 * b = -(anchor.x * w.x + anchor.y * w.y)
 */
export const calculateBiasFromAnchorAndWeight = (anchor: Vector2, w: Vector2): number => {
    return -(anchor.x * w.x + anchor.y * w.y);
};
