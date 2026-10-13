import React from 'react';
import { useTransformContext, vec } from 'mafs';
import { midpoint, readableRotationDeg, type Vec2 } from './geometry';
import { HALO } from './halo';
import { keepInside, useTextMetrics } from './fitInside';

/**
 * A rounded label laid along the segment from `from` to `to` (like JSXGraph's smartlabels), at its middle
 * or at `position` (0 at `from`, 1 at `to`).
 */
export const SegmentLabel: React.FC<{ from: Vec2; to: Vec2; text: string; background: string; position?: number }> = ({ from, to, text, background, position = 0.5 }) => {
    const { viewTransform } = useTransformContext();
    const at: Vec2 = position === 0.5 ? midpoint(from, to) : [from[0] + (to[0] - from[0]) * position, from[1] + (to[1] - from[1]) * position];
    const [px, py] = vec.transform(at, viewTransform);
    const width = text.length * 7.5 + 14;
    return (
        <g transform={`translate(${px} ${py}) rotate(${readableRotationDeg(from, to)})`}>
            <rect x={-width / 2} y={-10} width={width} height={20} rx={10} fill={background} />
            <text textAnchor="middle" dominantBaseline="central" style={{ fill: '#000000', fontSize: 14 }}>{text}</text>
        </g>
    );
};

/** A vector's name in italics with an arrow above it, just above and to the right of its tip. */
export const VectorName: React.FC<{ at: Vec2; name: string; color?: string }> = ({ at, name, color = '#000000' }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    // One text element, so the name and its arrow are one label
    return (
        <text x={px + 14} y={py - 10} textAnchor="middle" style={{ fill: color, fontSize: 16, fontStyle: 'italic', fontFamily: "'Times New Roman', serif", ...HALO }}>
            {name}
            <tspan x={px + 14} dy={-11} style={{ fontSize: 11, fontStyle: 'normal' }}>→</tspan>
        </text>
    );
};

/** Plain text centred on a chart position. */
export const CentredText: React.FC<{ at: Vec2; text: string; color: string }> = ({ at, text, color }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    return (
        <text x={px} y={py} textAnchor="middle" dominantBaseline="central" style={{ fill: color, fontSize: 14, ...HALO }}>{text}</text>
    );
};

/** Text starting at a chart position, sitting on it like a line of writing. */
export const TextAt: React.FC<{ at: Vec2; text: string; color?: string; size?: number }> = ({ at, text, color = '#000000', size = 16 }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    return <text x={px} y={py} style={{ fill: color, fontSize: size, ...HALO }}>{text}</text>;
};

/** A point's name, offset in pixels to the right of and above the point, slid back onto the board if it would run off. */
export const PointName: React.FC<{ at: Vec2; text: string; color?: string; dx?: number; dy?: number }> = ({ at, text, color = '#000000', dx = 10, dy = -10 }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    const { ref, metrics } = useTextMetrics();
    const [x, y] = keepInside(metrics, px + dx, py + dy, 'start');
    // Smaller where the grid is tight (under 40px a unit, as on a phone), so neighbouring points' names have room
    const size = Math.abs(viewTransform[0]) < 40 ? 10 : 12;
    return <text ref={ref} x={x} y={y} style={{ fill: color, fontSize: size, ...HALO }}>{text}</text>;
};

/**
 * Text at a chart position with full control of its alignment: `anchor` sets which end (or the middle)
 * sits on the position, `baseline` whether the text hangs below it, sits on it or is centred on it,
 * and `dx`/`dy` shift it in pixels.
 */
export const BoardText: React.FC<{
    at: Vec2;
    children: React.ReactNode;
    anchor?: 'start' | 'middle' | 'end';
    baseline?: 'hanging' | 'central' | 'auto';
    dx?: number;
    dy?: number;
    size?: number;
    color?: string;
    bold?: boolean;
    /** Outline the text in white, so it stays readable over grid lines and axis numbers */
    halo?: boolean;
    /** A number on an axis, which other labels may be drawn over (the chart tests check the rest never overlap) */
    axisLabel?: boolean;
}> = ({ at, children, anchor = 'start', baseline = 'auto', dx = 0, dy = 0, size = 12, color = '#000000', bold, halo, axisLabel }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    // Slid sideways back onto the board if it would run off an edge (its baseline may not be its bottom, so not up or down)
    const { ref, metrics } = useTextMetrics();
    const [x] = keepInside(metrics, px + dx, py + dy, anchor);
    return (
        <text ref={ref} x={x} y={py + dy} textAnchor={anchor} dominantBaseline={baseline} data-axis-label={axisLabel || undefined}
            style={{ fill: color, fontSize: size, fontWeight: bold ? 'bold' : undefined, ...(halo && HALO) }}>
            {children}
        </text>
    );
};
