/**
 * Plane geometry for the Mafs charts. Pure functions, unit tested in geometry.test.ts.
 */

export type Vec2 = [number, number];

export const vectorLength = ([x, y]: Vec2): number => Math.hypot(x, y);

export const distance = (a: Vec2, b: Vec2): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

export const midpoint = (a: Vec2, b: Vec2): Vec2 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** Direction of a vector in degrees, counter-clockwise from the positive x-axis, in (-180, 180]. */
export const directionDeg = ([x, y]: Vec2): number => (Math.atan2(y, x) * 180) / Math.PI;

/** Counter-clockwise angle from vector `from` to vector `to`, in degrees, in [0, 360). */
export const ccwAngleDeg = (from: Vec2, to: Vec2): number => {
    const deg = directionDeg(to) - directionDeg(from);
    return ((deg % 360) + 360) % 360;
};

/** Point at `radius` from the origin in direction `deg`. */
export const polar = (radius: number, deg: number): Vec2 => [
    radius * Math.cos((deg * Math.PI) / 180),
    radius * Math.sin((deg * Math.PI) / 180),
];

/**
 * Corners of the pie slice marking the counter-clockwise angle from `from` to `to`:
 * the origin, then `steps + 1` points along the arc of the given radius.
 */
export const angleSector = (from: Vec2, to: Vec2, radius: number, steps = 32): Vec2[] => {
    const start = directionDeg(from);
    const sweep = ccwAngleDeg(from, to);
    return [[0, 0], ...Array.from({ length: steps + 1 }, (_, i) => polar(radius, start + (sweep * i) / steps))];
};

/** Where to label the angle from `from` to `to`: on its bisector, `radius` from the origin. */
export const angleLabelPosition = (from: Vec2, to: Vec2, radius: number): Vec2 =>
    polar(radius, directionDeg(from) + ccwAngleDeg(from, to) / 2);

/**
 * Clockwise rotation in degrees (SVG convention, y down) that lays text along the segment
 * from `p` to `q`, kept in (-90, 90] so the text never reads upside down.
 */
export const readableRotationDeg = (p: Vec2, q: Vec2): number => {
    let deg = -directionDeg([q[0] - p[0], q[1] - p[1]]);
    if (deg > 90) deg -= 180;
    if (deg <= -90) deg += 180;
    return deg;
};

export const dot = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1];

/** Cosine of the angle between the vectors; 0 when either has no length. */
export const cosineSimilarity = (a: Vec2, b: Vec2): number => {
    const lengths = vectorLength(a) * vectorLength(b);
    return lengths === 0 ? 0 : dot(a, b) / lengths;
};
