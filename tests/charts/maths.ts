/**
 * Independent reference maths for the chart tests.
 * Deliberately does not import anything from src/, so a bug in the app's maths
 * cannot also hide in the expected values.
 */

export type Vec = { x: number; y: number };

export const f = (n: number, digits = 2) => n.toFixed(digits);

export const length = (a: Vec) => Math.hypot(a.x, a.y);
export const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
export const distance = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
export const cosine = (a: Vec, b: Vec) => dot(a, b) / (length(a) * length(b));

/** Counter-clockwise angle from a to b in degrees, in [0, 360). */
export const angleDeg = (a: Vec, b: Vec) => {
    const deg = ((Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x)) * 180) / Math.PI;
    return ((deg % 360) + 360) % 360;
};

export const onUnitCircle = (deg: number): Vec => ({
    x: Math.cos((deg * Math.PI) / 180),
    y: Math.sin((deg * Math.PI) / 180),
});

export const relu = (z: number) => Math.max(0, z);
