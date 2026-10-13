import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line, MovablePointDisplay, Vector, useMovable } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import { SIMILARITY_COLORS as C } from '../colors';
import { dot, vectorLength, type Vec2 } from './geometry';
import { PointName, VectorName } from './labels';

type Label = 'Spam' | 'Not Spam';
interface DataPoint { at: Vec2; label: Label }

const DATA: DataPoint[] = [
    ...([[4, 5], [2, 4], [0, 3], [-4, 1], [-1, 4]] as Vec2[]).map(at => ({ at, label: 'Spam' as const })),
    ...([[4, 3], [2, 2], [0, 1], [-2, 0], [-4, -1], [1, -1]] as Vec2[]).map(at => ({ at, label: 'Not Spam' as const })),
];

/** Project p onto the line through the origin in the direction of w. */
const projectOnto = (p: Vec2, w: Vec2): Vec2 => {
    const length = vectorLength(w);
    if (length === 0) return p;
    const u: Vec2 = [w[0] / length, w[1] / length];
    const t = dot(p, u);
    return [t * u[0], t * u[1]];
};

/**
 * The chart's score for a point: (w − b) · (point − b), using the weight vector as drawn, from
 * the bias point b to the tip w. Spam is correct when the score is ≥ 0.
 */
const score = (w: Vec2, b: Vec2, p: Vec2) => (w[0] - b[0]) * (p[0] - b[0]) + (w[1] - b[1]) * (p[1] - b[1]);
const isCorrect = (label: Label, s: number) => (label === 'Spam' ? s >= 0 : s < 0);

/** A draggable point drawn as a dot; while it is held, its coordinates show next to it. */
const DraggableDot: React.FC<{ at: Vec2; color: string; onMove: (p: Vec2) => void; onDragStart?: () => void; showCoordinates?: boolean }> = ({ at, color, onMove, onDragStart, showCoordinates }) => {
    const ref = useRef<SVGGElement>(null);
    const { dragging } = useMovable({ gestureTarget: ref as React.RefObject<SVGGElement>, onMove, point: at, constrain: p => p });
    const wasDragging = useRef(false);
    useEffect(() => {
        if (dragging && !wasDragging.current) onDragStart?.();
        wasDragging.current = dragging;
    }, [dragging, onDragStart]);
    return (
        <>
            <MovablePointDisplay ref={ref} point={at} color={color} dragging={dragging} ringRadiusPx={10} />
            {showCoordinates && dragging && <PointName at={at} text={`(${at[0].toFixed(2)}, ${at[1].toFixed(2)})`} dx={10} dy={24} />}
        </>
    );
};

/**
 * The perceptron's decision boundary: the line through the bias point b, perpendicular to the
 * weight vector drawn from b to w. Each data point shows its score and is green when classified
 * correctly, red when not. The reader can drag w, b (which slides along the weight direction,
 * carrying w with it) and every data point.
 */
export const PerceptronClassification: React.FC<{ id: string }> = ({ id }) => {
    const [state, setState] = useState(() => ({
        w: [-2, 2] as Vec2,
        b: [-0.5, 0.5] as Vec2,
        // Where w sits relative to b (w − b), kept when b moves
        offset: [-1.5, 1.5] as Vec2,
        // w and b when the current drag of w or b started
        start: { w: [-2, 2] as Vec2, b: [-0.5, 0.5] as Vec2 },
        data: DATA.map(d => d.at),
    }));
    const { w, b, data } = state;

    const startDrag = useCallback(() => setState(s => ({ ...s, start: { w: s.w, b: s.b } })), []);
    // b stays on the line through the origin along w: where it was when the drag began, projected onto w's new direction.
    // (JSXGraph re-projected b on every pointer event, so where it ended up depended on the path the pointer took.)
    const moveW = (p: Vec2) => setState(s => ({ ...s, w: p, offset: [p[0] - s.start.b[0], p[1] - s.start.b[1]], b: projectOnto(s.start.b, p) }));
    const moveB = (p: Vec2) => setState(s => {
        const b1 = projectOnto(p, s.start.w);
        const w1: Vec2 = [s.offset[0] + b1[0], s.offset[1] + b1[1]];
        return { ...s, w: w1, b: projectOnto(b1, w1) };
    });
    const moveData = (i: number) => (p: Vec2) => setState(s => ({ ...s, data: s.data.map((d, j) => (j === i ? p : d)) }));

    const scored = data.map((at, i) => {
        const s = score(w, b, at);
        const { label } = DATA[i];
        return { at, name: `${label} (${s.toFixed(2)})`, color: isCorrect(label, s) ? 'green' : 'red' };
    });

    const points: ChartPoint[] = useMemo(() => [
        { name: 'w', x: w[0], y: w[1], visible: true, draggable: true, color: 'purple' },
        ...scored.map(p => ({ name: p.name, x: p.at[0], y: p.at[1], visible: true, draggable: true, color: p.color })),
        { name: 'b', x: b[0], y: b[1], visible: true, draggable: true, color: 'purple' },
    ], [w, b, scored]);

    const boundaryDirection: Vec2 = [-(w[1]), w[0]];
    return (
        <MafsBoard chartId={id} points={points} x={[-6, 6]} y={[-6, 6]}>
            {vectorLength(w) > 0 && (
                <Line.ThroughPoints point1={b} point2={[b[0] + boundaryDirection[0], b[1] + boundaryDirection[1]]} color="#000000" style="dashed" weight={3} />
            )}
            <Vector tail={b} tip={w} color={C.vector} weight={2} />
            {scored.map((p, i) => (
                <React.Fragment key={i}>
                    <PointName at={p.at} text={p.name} />
                    <DraggableDot at={p.at} color={p.color} onMove={moveData(i)} showCoordinates />
                </React.Fragment>
            ))}
            <VectorName at={w} name="w" />
            <DraggableDot at={w} color="purple" onMove={moveW} onDragStart={startDrag} />
            <PointName at={b} text="b" color="purple" />
            <DraggableDot at={b} color="purple" onMove={moveB} onDragStart={startDrag} />
        </MafsBoard>
    );
};
