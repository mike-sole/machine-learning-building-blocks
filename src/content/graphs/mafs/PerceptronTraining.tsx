import React, { useMemo, useState } from 'react';
import { Circle, Line, Point, Vector, useTransformContext, vec } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import { SIMILARITY_COLORS } from '../colors';
import { type Vec2 } from './geometry';
import { PointName } from './labels';
import { HALO } from './halo';
import { ChartButtons, ChartLog } from './ChartControls';

interface Sample { at: Vec2; label: string; cls: 0 | 1 }

const DATA: Sample[] = [
    { at: [4, 5], label: 'spam', cls: 1 },
    { at: [5, 4], label: 'spam', cls: 1 },
    { at: [3, 5.5], label: 'spam', cls: 1 },
    { at: [2, 1], label: 'not spam', cls: 0 },
    { at: [3, 0.5], label: 'not spam', cls: 0 },
    { at: [1, 2], label: 'not spam', cls: 0 },
];

const LEARNING_RATE = 0.05;
const INITIAL = { w: [1, -1] as Vec2, b: -1 };

/** Colours that tie each number in the log to its part of the update rule. */
const K = {
    pointX: '#E67E22', pointY: '#8E44AD',
    wOldX: '#2980B9', wOldY: '#27AE60', wUpX: '#E91E63', wUpY: '#795548', wNewX: '#1A5276', wNewY: '#196F3D',
    bOld: '#D4AC0D', bUp: '#A93226', bNew: '#17202A', distance: '#B22222', error: 'orange',
};
const B: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => <span style={{ color, fontWeight: 'bold' }}>{children}</span>;

const n = (v: number) => v.toFixed(2);
const length = ([x, y]: Vec2) => Math.hypot(x, y);
const boundaryDistance = (w: Vec2, b: number) => Math.abs(b) / length(w);

interface Model { w: Vec2; b: number; next: number; current: number | null; log: React.ReactNode[] }

const START: Model = { ...INITIAL, next: 0, current: null, log: ['Ready to train.'] };

const distanceLines = (w: Vec2, b: number) => [
    'Boundary Distance = |bias| / ||weights||',
    <>Boundary Distance = <B color={K.bNew}>abs({n(b)})</B> / √(<B color={K.wNewX}>{n(w[0])}</B>² + <B color={K.wNewY}>{n(w[1])}</B>²) = <B color={K.distance}>{n(boundaryDistance(w, b))}</B></>,
];

/** One step of the perceptron learning rule on the next data point, in order, with a log explaining it. */
function trainStep(m: Model): Model {
    const p = DATA[m.next];
    const [x, y] = p.at;
    const prediction = m.w[0] * x + m.w[1] * y + m.b > 0 ? 1 : 0;
    const error = p.cls - prediction;
    const point = <>(<B color={K.pointX}>{n(x)}</B>, <B color={K.pointY}>{n(y)}</B>)</>;
    const header = [
        <>Next data point ({m.next + 1} of {DATA.length}): {point}</>,
        `Target = ${p.cls}, Prediction = ${prediction}`,
    ];
    const next = (m.next + 1) % DATA.length;

    if (error === 0) {
        return {
            ...m, next, current: m.next,
            log: [
                ...header,
                'Error = 0 (Correct prediction!)',
                'No update required.',
                '',
                <>Current Weights: [<B color={K.wNewX}>{n(m.w[0])}</B>, <B color={K.wNewY}>{n(m.w[1])}</B>]</>,
                <>Current Bias: <B color={K.bNew}>{n(m.b)}</B></>,
                '',
                ...distanceLines(m.w, m.b),
            ],
        };
    }

    const dw: Vec2 = [LEARNING_RATE * error * x, LEARNING_RATE * error * y];
    const db = LEARNING_RATE * error;
    const w: Vec2 = [m.w[0] + dw[0], m.w[1] + dw[1]];
    const b = m.b + db;
    const e = <B color={K.error}>{error}</B>;
    const old = <>[<B color={K.wOldX}>{n(m.w[0])}</B>, <B color={K.wOldY}>{n(m.w[1])}</B>]</>;
    const update = <>[<B color={K.wUpX}>{n(dw[0])}</B>, <B color={K.wUpY}>{n(dw[1])}</B>]</>;
    return {
        w, b, next, current: m.next,
        log: [
            ...header,
            <>Error = (Target - Prediction) = {e}</>,
            '',
            <>Weights old: {old}</>,
            'Weights Update (Δw) = learning rate * error * selected data point',
            <>Weights Update (Δw) = 0.05 * {e} * [<B color={K.pointX}>{n(x)}</B>, <B color={K.pointY}>{n(y)}</B>] = {update}</>,
            <>Weights new = weights old + Δw = {old} + {update}</>,
            <>Weights new = [<B color={K.wNewX}>{n(w[0])}</B>, <B color={K.wNewY}>{n(w[1])}</B>]</>,
            '',
            <>Bias old: <B color={K.bOld}>{n(m.b)}</B></>,
            <>Bias Update (Δb) = learning rate * error = 0.05 * {e} = <B color={K.bUp}>{n(db)}</B></>,
            <>Bias new = bias old + Δb = <B color={K.bOld}>{n(m.b)}</B> + <B color={K.bUp}>{n(db)}</B> = <B color={K.bNew}>{n(b)}</B></>,
            '',
            ...distanceLines(w, b),
        ],
    };
}

/**
 * The perceptron learning rule, one data point per "Train Step": the decision boundary
 * w · x + b = 0, the weight vector drawn from the boundary point nearest the origin, its
 * components and the boundary's distance from the origin.
 */
export const PerceptronTraining: React.FC<{ id: string }> = ({ id }) => {
    const [model, setModel] = useState<Model>(START);
    const { w, b } = model;

    // The boundary point nearest the origin: (−b / |w|²) w
    const k = -b / (w[0] ** 2 + w[1] ** 2);
    const anchor: Vec2 = [k * w[0], k * w[1]];
    const tip: Vec2 = [anchor[0] + w[0], anchor[1] + w[1]];
    const corner: Vec2 = [tip[0], anchor[1]];

    const points: ChartPoint[] = useMemo(() => [
        ...DATA.map(d => ({ name: d.label, x: d.at[0], y: d.at[1], visible: true, draggable: false, color: d.cls === 1 ? 'red' : 'green' })),
        { name: 'b', x: anchor[0], y: anchor[1], visible: true, draggable: false, color: 'purple' },
    ], [anchor[0], anchor[1]]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <ChartButtons actions={{
                'Train Step': () => setModel(trainStep),
                'Reset': () => setModel({ ...START, log: ['Reset. Ready to train.'] }),
            }} />
            <ChartLog lines={model.log} />
            <MafsBoard chartId={id} points={points} x={[-6, 6]} y={[-6, 6]}>
                {/* Decision boundary: w · x + b = 0 */}
                <Line.ThroughPoints point1={anchor} point2={[anchor[0] - w[1], anchor[1] + w[0]]} color="#000000" style="dashed" weight={2} />
                <Line.Segment point1={[0, 0]} point2={anchor} color={K.distance} style="dashed" weight={1} />
                <Line.Segment point1={anchor} point2={corner} color={K.wNewX} style="dashed" weight={1} />
                <Line.Segment point1={corner} point2={tip} color={K.wNewY} style="dashed" weight={1} />
                <Vector tail={anchor} tip={tip} color={SIMILARITY_COLORS.vector} weight={3} />
                <VectorLabels anchor={anchor} w={w} distance={boundaryDistance(w, b)} />
                {DATA.map((d, i) => (
                    <React.Fragment key={i}>
                        {d.cls === 1 ? <Cross at={d.at} /> : <Point x={d.at[0]} y={d.at[1]} color="green" />}
                        <PointName at={d.at} text={d.label} dx={5} dy={-5} />
                    </React.Fragment>
                ))}
                {model.current !== null && <Circle center={DATA[model.current].at} radius={0.25} color="orange" fillOpacity={0} weight={2} />}
                <Point x={anchor[0]} y={anchor[1]} color="purple" />
            </MafsBoard>
        </>
    );
};

/** A class-1 data point, drawn as a red cross. */
const Cross: React.FC<{ at: Vec2 }> = ({ at: [x, y] }) => {
    const d = 0.12;
    return (
        <>
            <Line.Segment point1={[x - d, y - d]} point2={[x + d, y + d]} color="red" weight={2} />
            <Line.Segment point1={[x - d, y + d]} point2={[x + d, y - d]} color="red" weight={2} />
        </>
    );
};

/**
 * The labels around the weight vector, placed in pixels from the geometry so they stay apart however
 * short the vector is on screen: "b" behind the boundary point (away from w), the boundary distance
 * beside the line from the origin (away from w's components), w's components outside the right-angled
 * triangle they form, and "w (x, y)" beyond the tip.
 */
const VectorLabels: React.FC<{ anchor: Vec2; w: Vec2; distance: number }> = ({ anchor, w, distance }) => {
    const { viewTransform } = useTransformContext();
    const toPx = (p: Vec2) => vec.transform(p, viewTransform);
    const [ax, ay] = toPx(anchor);
    const [tx, ty] = toPx([anchor[0] + w[0], anchor[1] + w[1]]);
    const [ox, oy] = toPx([0, 0]);
    // w's direction on screen (y down)
    const length = Math.hypot(tx - ax, ty - ay) || 1;
    const [ux, uy] = [(tx - ax) / length, (ty - ay) / length];
    // The side of the line through the origin and b away from the triangle: the perpendicular pointing away from w's x component
    const side = -Math.sign(ux * -uy) || 1;
    const [px, py] = [-uy * side, ux * side];
    // "b" goes behind the boundary point and to the other side from the distance label
    const [bx, by] = [(-ux - px) / Math.SQRT2, (-uy - py) / Math.SQRT2];
    const right = tx >= ax;
    const down = ty >= ay;
    return (
        <>
            <text x={ax + bx * 14} y={ay + by * 14} textAnchor="middle" dominantBaseline="central" style={{ fill: '#000000', fontSize: 12, ...HALO }}>b</text>
            <text x={(ox + ax) / 2 + px * 16} y={(oy + ay) / 2 + py * 16} textAnchor="middle" dominantBaseline="central" style={{ fill: K.distance, fontSize: 10, ...HALO }}>{n(distance)}</text>
            <text x={(ax + tx) / 2} y={ay + (down ? -5 : 5)} textAnchor="middle" dominantBaseline={down ? 'auto' : 'hanging'} style={{ fill: K.wNewX, fontSize: 10, ...HALO }}>{n(w[0])}</text>
            <text x={tx + (right ? 5 : -5)} y={(ay + ty) / 2} textAnchor={right ? 'start' : 'end'} dominantBaseline="central" style={{ fill: K.wNewY, fontSize: 10, ...HALO }}>{n(w[1])}</text>
            <WeightLabel x={tx + (right ? 6 : -6)} y={ty + (down ? 8 : -8)} anchor={right ? 'start' : 'end'} baseline={down ? 'hanging' : 'auto'} w={w} />
        </>
    );
};

/** "w (x, y)" beside the weight vector's tip, with each component in its colour. */
const WeightLabel: React.FC<{ x: number; y: number; anchor: 'start' | 'end'; baseline: 'hanging' | 'auto'; w: Vec2 }> = ({ x, y, anchor, baseline, w }) => {
    return (
        <text x={x} y={y} textAnchor={anchor} dominantBaseline={baseline} style={{ fill: SIMILARITY_COLORS.vector, fontSize: 12, ...HALO }}>
            <tspan style={{ fontStyle: 'italic', fontFamily: "'Times New Roman', serif" }}>w</tspan>
            {' ('}<tspan style={{ fill: K.wNewX, fontWeight: 'bold' }}>{n(w[0])}</tspan>
            {', '}<tspan style={{ fill: K.wNewY, fontWeight: 'bold' }}>{n(w[1])}</tspan>{')'}
        </text>
    );
};
