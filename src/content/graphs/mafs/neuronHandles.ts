import { dot, type Vec2 } from './geometry';

/**
 * A neuron's weights w and bias b, kept as the two handles the reader drags (in the neuron's own coordinates):
 * the anchor, the point of the decision boundary w · x + b = 0 nearest the origin (−b w / |w|²), and the tip, anchor + w.
 */
export interface Handles { anchor: Vec2; tip: Vec2 }

export const handlesFor = (w: Vec2, b: number): Handles => {
    const k = -b / dot(w, w);
    const anchor: Vec2 = [k * w[0], k * w[1]];
    return { anchor, tip: [anchor[0] + w[0], anchor[1] + w[1]] };
};

export const weightsOf = ({ anchor, tip }: Handles): { w: Vec2; b: number } => {
    const w: Vec2 = [tip[0] - anchor[0], tip[1] - anchor[1]];
    return { w, b: -dot(anchor, w) };
};

/** Project p onto the line through the origin and `through`. */
export const projectOnto = (p: Vec2, through: Vec2): Vec2 => {
    const t = dot(p, through) / dot(through, through);
    return [t * through[0], t * through[1]];
};

/** Dragging w to `tip`: the anchor keeps its projection, from where the drag began, onto the new direction. */
export const dragTip = (start: Handles, tip: Vec2): Handles => ({ tip, anchor: projectOnto(start.anchor, tip) });

/** Dragging b towards `to`: the anchor slides along the line through the origin and w, carrying the tip, so w is unchanged. */
export const dragAnchor = (start: Handles, to: Vec2): Handles => {
    const anchor = projectOnto(to, start.tip);
    return { anchor, tip: [start.tip[0] + anchor[0] - start.anchor[0], start.tip[1] + anchor[1] - start.anchor[1]] };
};

export const relu = (z: number) => Math.max(0, z);

/** The neuron's output for an input: ReLU(w · x + b). */
export const activation = ({ w, b }: { w: Vec2; b: number }, x: Vec2) => relu(dot(w, x) + b);
