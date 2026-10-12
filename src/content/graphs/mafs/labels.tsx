import React from 'react';
import { useTransformContext, vec } from 'mafs';
import { midpoint, readableRotationDeg, type Vec2 } from './geometry';

/** A rounded label laid along the segment from `from` to `to`, at its middle (like JSXGraph's smartlabels). */
export const SegmentLabel: React.FC<{ from: Vec2; to: Vec2; text: string; background: string }> = ({ from, to, text, background }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(midpoint(from, to), viewTransform);
    const width = text.length * 7.5 + 14;
    return (
        <g transform={`translate(${px} ${py}) rotate(${readableRotationDeg(from, to)})`}>
            <rect x={-width / 2} y={-10} width={width} height={20} rx={10} fill={background} />
            <text textAnchor="middle" dominantBaseline="central" style={{ fill: '#000000', fontSize: 14 }}>{text}</text>
        </g>
    );
};

/** A vector's name in italics with an arrow above it, just above and to the right of its tip. */
export const VectorName: React.FC<{ at: Vec2; name: string }> = ({ at, name }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    return (
        <g transform={`translate(${px + 14} ${py - 10})`} style={{ fill: '#000000' }}>
            <text textAnchor="middle" style={{ fontSize: 16, fontStyle: 'italic', fontFamily: "'Times New Roman', serif" }}>{name}</text>
            <text y={-11} textAnchor="middle" style={{ fontSize: 11 }}>→</text>
        </g>
    );
};

/** Plain text centred on a chart position. */
export const CentredText: React.FC<{ at: Vec2; text: string; color: string }> = ({ at, text, color }) => {
    const { viewTransform } = useTransformContext();
    const [px, py] = vec.transform(at, viewTransform);
    return (
        <text x={px} y={py} textAnchor="middle" dominantBaseline="central" style={{ fill: color, fontSize: 14 }}>{text}</text>
    );
};
