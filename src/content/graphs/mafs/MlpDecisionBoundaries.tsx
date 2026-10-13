import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Circle, Line, MovablePointDisplay, Vector, useMovable, useTransformContext, vec } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import { dot, type Vec2 } from './geometry';
import { handlesFor, weightsOf, dragTip, dragAnchor, activation as neuronActivation, type Handles } from './neuronHandles';
import { BoardText } from './labels';
import { HALO } from './halo';
import { keepInside, useTextMetrics } from './fitInside';

/**
 * The XOR network from The Multi-Layered Perceptron, drawn on one board in board units (about 21 × 36) as a
 * network, one layer per row: input nodes at the top, the two hidden neurons side by side as small graphs in
 * circles, and the output neuron's graph below. Phones show the same network, with shorter input titles and
 * smaller labels so that they fit (#72).
 * Each neuron's graph shows its weight vector w (drawn from its decision boundary) and the boundary
 * w · x + b = 0; the reader drags w to turn or stretch it and b to slide the boundary.
 */

const DATA = [
    { at: [2, 2] as Vec2, cls: 1 },
    { at: [-2, -2] as Vec2, cls: 1 },
    { at: [-2, 2] as Vec2, cls: 0 },
    { at: [2, -2] as Vec2, cls: 0 },
];
const className = (cls: number) => (cls === 1 ? 'Spam' : 'Not Spam');
const RED = '#ef4444';
const GREEN = '#22c55e';
const ORANGE = '#D35400';
const W1 = '#1A5276';
const W2 = '#196F3D';
const n = (v: number) => v.toFixed(2);

// ---- Layout (board units) ----
const R_INPUT = 1.5;
const R_NEURON = 4;
const I0: Vec2 = [4.5, 32];
const I1: Vec2 = [10.5, 32];
const I2: Vec2 = [16.5, 32];
const OUT: Vec2 = [10.5, 5.5];

/** A neuron's graph: a circle of radius `r` at `centre` showing local coordinates in [−half, half]². */
interface View { centre: Vec2; half: number; r: number }
const OUT_VIEW: View = { centre: OUT, half: 5, r: R_NEURON };
const scale = (v: View) => v.r / v.half;

/** What differs between wide screens and phones: the same network, sized to fit */
interface Layout {
    h1: View;
    h2: View;
    range: { x: [number, number]; y: [number, number] };
    /** x₀, x₁ and x₂, then the output's bias input */
    inputTitles: [string, string, string, string];
    biasOut: Vec2;
    /** The output's bias input's title under it rather than above */
    biasTitleBelow: boolean;
    /** The weights on the connections: their size, and how far apart the arrows into a neuron end */
    weightSize: number;
    endSpacing: number;
    /** Where each weight sits: beside its arrow's end, or centred under it */
    weightAt: 'beside' | 'under';
    pointLabelSize: number;
    /** From a graph's circle up to its title, and to the ends of the arrows into it */
    titleAbove: number;
    arrowsEndAbove: number;
    /** How far the bias label at each boundary point is raised, in pixels */
    biasLabelRaise: number;
    /** Put each weight vector's label beyond its tip, rather than always above and to the right, clear of the boundary point */
    tipLabelBeyond: boolean;
}
const WIDE: Layout = {
    h1: { centre: [5.5, 20], half: 3, r: R_NEURON },
    h2: { centre: [15.5, 20], half: 3, r: R_NEURON },
    range: { x: [0, 21], y: [0, 36] },
    inputTitles: ['Bias Input (x₀)', 'Input Node 1 (x₁)', 'Input Node 2 (x₂)', 'Bias Input'],
    biasOut: [3.5, 13],
    biasTitleBelow: false,
    weightSize: 13,
    endSpacing: 2.5,
    weightAt: 'beside',
    pointLabelSize: 10,
    titleAbove: 0.7,
    arrowsEndAbove: 2.5,
    biasLabelRaise: 0,
    tipLabelBeyond: false,
};
// Phones: the hidden graphs a little smaller and further apart, so the labels of the points between them have room
const NARROW: Layout = {
    h1: { centre: [5, 20], half: 3, r: 3.6 },
    h2: { centre: [16, 20], half: 3, r: 3.6 },
    range: { x: [-0.3, 21.3], y: [0, 36] },
    inputTitles: ['Bias (x₀)', 'Input (x₁)', 'Input (x₂)', 'Bias (x₀)'],
    // Further left, with its title under it, clear of the labels under h₁'s graph
    biasOut: [2.2, 13.4],
    biasTitleBelow: true,
    weightSize: 10,
    endSpacing: 3.3,
    weightAt: 'under',
    pointLabelSize: 9,
    // The labels of the top points reach nearly as high as the title on a phone
    titleAbove: 1.1,
    arrowsEndAbove: 3,
    // Clear of the output graph's Not Spam labels, which sit just below its boundary point
    biasLabelRaise: 6,
    tipLabelBeyond: true,
};

/** Matches the 640px breakpoint in mafs-theme.css */
const NARROW_QUERY = '(max-width: 639px)';
const subscribeNarrow = (onChange: () => void) => {
    const query = window.matchMedia(NARROW_QUERY);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};
const useNarrow = () => useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW_QUERY).matches, () => false);
const toBoard = (v: View, [x, y]: Vec2): Vec2 => [v.centre[0] + x * scale(v), v.centre[1] + y * scale(v)];
const toLocal = (v: View, [x, y]: Vec2): Vec2 => [(x - v.centre[0]) / scale(v), (y - v.centre[1]) / scale(v)];

// Weights from the post's Python code
const INITIAL = {
    h1: handlesFor([1, 1], 0.3),
    h2: handlesFor([-0.95, -1.05], 0.56),
    out: handlesFor([0.84, 0.86], -2.41),
};
type NeuronName = keyof typeof INITIAL;
const TITLES: Record<NeuronName, string> = { h1: 'Hidden Node 1 (h₁)', h2: 'Hidden Node 2 (h₂)', out: 'Output Node' };
const neuronsFor = (layout: Layout): { name: NeuronName; view: View; title: string }[] => [
    { name: 'h1', view: layout.h1, title: TITLES.h1 },
    { name: 'h2', view: layout.h2, title: TITLES.h2 },
    { name: 'out', view: OUT_VIEW, title: TITLES.out },
];

export const MlpDecisionBoundaries: React.FC<{ id: string }> = ({ id }) => {
    const layout = useNarrow() ? NARROW : WIDE;
    const NEURONS = neuronsFor(layout);
    const { h1: H1, h2: H2, biasOut: BIAS_OUT } = layout;
    const [handles, setHandles] = useState(INITIAL);
    // Handles when the current drag began: dragging w turns the line b slides on, and b keeps
    // its projection from where the drag began (path-independent; see moveTip)
    const dragStart = useRef(INITIAL);
    const startDrag = useCallback(() => setHandles(h => (dragStart.current = h)), []);

    const weights = {
        h1: weightsOf(handles.h1),
        h2: weightsOf(handles.h2),
        out: weightsOf(handles.out),
    };
    const activation = (name: 'h1' | 'h2', at: Vec2) => neuronActivation(weights[name], at);

    /** Dragging w: the tip follows the pointer, and b keeps its projection from where the drag began (path-independent). */
    const moveTip = (name: NeuronName, view: View) => (p: Vec2) =>
        setHandles(h => ({ ...h, [name]: dragTip(dragStart.current[name], toLocal(view, p)) }));
    /** Dragging b: it slides along the line through the origin and w, carrying w with it (so w stays the same). */
    const moveAnchor = (name: NeuronName, view: View) => (p: Vec2) =>
        setHandles(h => ({ ...h, [name]: dragAnchor(dragStart.current[name], toLocal(view, p)) }));

    const outputs = DATA.map(d => ({ ...d, at: toBoard(OUT_VIEW, [activation('h1', d.at), activation('h2', d.at)]) }));

    const points: ChartPoint[] = [
        ...outputs.map(o => ({ name: className(o.cls), x: o.at[0], y: o.at[1], visible: true, draggable: false, color: o.cls === 1 ? RED : GREEN })),
        ...NEURONS.flatMap(({ name, view }) => {
            const a = toBoard(view, handles[name].anchor);
            const t = toBoard(view, handles[name].tip);
            return [
                { name: 'b', x: a[0], y: a[1], visible: true, draggable: true, color: ORANGE },
                { name: 'w', x: t[0], y: t[1], visible: true, draggable: true, color: ORANGE },
            ];
        }),
    ];

    // Connections into each neuron, labelled with the weight they carry (in this order, as the tests read them).
    // Each arrow ends above its neuron's graph, at its slot: left, middle or right.
    const connections: { input: number; from: Vec2; fromR: number; to: View; dxStart: number; slot: number; dyStart?: number; color: string; label: string }[] = [
        { input: 0, from: I0, fromR: R_INPUT, to: H1, dxStart: -0.5, slot: -1, color: 'purple', label: `w₀ ${n(weights.h1.b)}` },
        { input: 0, from: I0, fromR: R_INPUT, to: H2, dxStart: 0.5, slot: -1, color: 'purple', label: `w₀ ${n(weights.h2.b)}` },
        { input: 1, from: I1, fromR: R_INPUT, to: H1, dxStart: -0.5, slot: 0, color: W1, label: `w₁ ${n(weights.h1.w[0])}` },
        { input: 1, from: I1, fromR: R_INPUT, to: H2, dxStart: 0.5, slot: 0, color: W1, label: `w₁ ${n(weights.h2.w[0])}` },
        { input: 2, from: I2, fromR: R_INPUT, to: H1, dxStart: -0.5, slot: 1, color: W2, label: `w₂ ${n(weights.h1.w[1])}` },
        { input: 2, from: I2, fromR: R_INPUT, to: H2, dxStart: 0.5, slot: 1, color: W2, label: `w₂ ${n(weights.h2.w[1])}` },
        { input: 0, from: BIAS_OUT, fromR: R_INPUT, to: OUT_VIEW, dxStart: 1.5, slot: -1, dyStart: 1.5, color: 'purple', label: `w₀ ${n(weights.out.b)}` },
        { input: 1, from: H1.centre, fromR: H1.r, to: OUT_VIEW, dxStart: 0, slot: 0, color: W1, label: `w₁ ${n(weights.out.w[0])}` },
        { input: 2, from: H2.centre, fromR: H2.r, to: OUT_VIEW, dxStart: 0, slot: 1, color: W2, label: `w₂ ${n(weights.out.w[1])}` },
    ];

    const { range } = layout;
    const aspect = (range.x[1] - range.x[0]) / (range.y[1] - range.y[0]);
    return (
        <MafsBoard chartId={id} points={points} x={range.x} y={range.y} aspect={aspect} grid={false} frameless>
            {connections.map((c, i) => {
                const start: Vec2 = [c.from[0] + c.dxStart, c.from[1] - c.fromR + (c.dyStart ?? 0)];
                const end: Vec2 = [c.to.centre[0] + c.slot * layout.endSpacing, c.to.centre[1] + c.to.r + layout.arrowsEndAbove];
                return (
                    <React.Fragment key={i}>
                        <Vector tail={start} tip={end} color="#9ca3af" weight={2} />
                        {layout.weightAt === 'beside'
                            ? <BoardText at={end} dx={5} dy={5} baseline="hanging" size={layout.weightSize} color={c.color} bold>{c.label}</BoardText>
                            : <BoardText at={end} dy={3} anchor="middle" baseline="hanging" size={layout.weightSize} color={c.color} bold halo>{c.label}</BoardText>}
                    </React.Fragment>
                );
            })}
            <InputNode at={I0} title={layout.inputTitles[0]} />
            <InputNode at={I1} title={layout.inputTitles[1]} />
            <InputNode at={I2} title={layout.inputTitles[2]} />
            <InputNode at={BIAS_OUT} title={layout.inputTitles[3]} below={layout.biasTitleBelow} />

            {NEURONS.map(({ name, view, title }) => (
                <React.Fragment key={name}>
                    <NeuronView view={view} title={title} titleAbove={layout.titleAbove} />
                    {name !== 'out' && DATA.map((d, i) => <DataPoint key={i} view={view} at={d.at} cls={d.cls} value={activation(name, d.at)} size={layout.pointLabelSize} />)}
                </React.Fragment>
            ))}
            {outputs.map((o, i) => (
                <Circle key={i} center={o.at} radius={0.12} color="#374151" weight={1} fillOpacity={1} svgEllipseProps={{ style: { fill: o.cls === 1 ? RED : GREEN } }} />
            ))}
            <OutputLabels points={outputs} />

            {NEURONS.map(({ name, view }) => (
                <NeuronWeights
                    key={name} view={view} handles={handles[name]} weights={weights[name]}
                    tipLabelBeyond={layout.tipLabelBeyond} biasLabelRaise={layout.biasLabelRaise} onMoveTip={moveTip(name, view)} onMoveAnchor={moveAnchor(name, view)} onDragStart={startDrag}
                />
            ))}
        </MafsBoard>
    );
};

const InputNode: React.FC<{ at: Vec2; title: string; below?: boolean }> = ({ at, title, below }) => (
    <>
        <Circle center={at} radius={R_INPUT} color="#374151" weight={2} fillOpacity={1} svgEllipseProps={{ style: { fill: '#f3f4f6' } }} />
        {below
            ? <BoardText at={[at[0], at[1] - R_INPUT - 0.3]} anchor="middle" baseline="hanging" size={13} bold>{title}</BoardText>
            : <BoardText at={[at[0], at[1] + R_INPUT + 0.7]} anchor="middle" size={13} bold>{title}</BoardText>}
    </>
);

/** A neuron's graph: circle, title, grid, axes and tick labels at every whole number inside the circle. */
const NeuronView: React.FC<{ view: View; title: string; titleAbove: number }> = ({ view, title, titleAbove }) => {
    const { viewTransform } = useTransformContext();
    // Ticks closer than 22px (the output graph on a phone) are numbered every other one, so the numbers have room
    const numberEvery = Math.abs(viewTransform[0]) * scale(view) < 22 ? 2 : 1;
    const [cx, cy] = view.centre;
    const r = view.r;
    const tick = 0.05 * r;
    const values = Array.from({ length: 2 * view.half + 1 }, (_, i) => i - view.half).filter(v => v !== 0 && Math.abs(v * scale(view)) < r);
    return (
        <>
            <Circle center={view.centre} radius={r} color="#374151" weight={2} fillOpacity={1} svgEllipseProps={{ style: { fill: '#ffffff' } }} />
            <BoardText at={[cx, cy + r + titleAbove]} anchor="middle" size={13} bold>{title}</BoardText>
            {values.map(v => {
                const offset = v * scale(view);
                const chord = Math.sqrt(r * r - offset * offset);
                return (
                    <React.Fragment key={v}>
                        <Line.Segment point1={[cx + offset, cy - chord]} point2={[cx + offset, cy + chord]} color="#e5e7eb" weight={1} />
                        <Line.Segment point1={[cx - chord, cy + offset]} point2={[cx + chord, cy + offset]} color="#e5e7eb" weight={1} />
                    </React.Fragment>
                );
            })}
            <Line.Segment point1={[cx - r, cy]} point2={[cx + r, cy]} color="#9ca3af" weight={1.5} />
            <Line.Segment point1={[cx, cy - r]} point2={[cx, cy + r]} color="#9ca3af" weight={1.5} />
            {values.map(v => {
                const offset = v * scale(view);
                return (
                    <React.Fragment key={v}>
                        <Line.Segment point1={[cx + offset, cy - tick]} point2={[cx + offset, cy + tick]} color="#6b7280" weight={1.5} />
                        <Line.Segment point1={[cx - tick, cy + offset]} point2={[cx + tick, cy + offset]} color="#6b7280" weight={1.5} />
                        {v % numberEvery === 0 && (
                            <>
                                <BoardText at={[cx + offset, cy - tick - 0.2]} anchor="middle" baseline="hanging" size={9} color="#6b7280" axisLabel>{v}</BoardText>
                                <BoardText at={[cx - tick - 0.2, cy + offset]} anchor="end" baseline="central" size={9} color="#6b7280" axisLabel>{v}</BoardText>
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};

/**
 * The output graph's data points can sit almost on top of each other (both Not Spam points start near
 * (0.3, 0.5)), so each label goes to the left of its point and is pushed down until it clears the
 * labels above it.
 */
const OutputLabels: React.FC<{ points: { at: Vec2; cls: number }[] }> = ({ points }) => {
    const { viewTransform } = useTransformContext();
    const LINE = 11;
    const placed = points.map(p => {
        const [x, y] = vec.transform(p.at, viewTransform);
        return { x: x - 6, y, text: className(p.cls) };
    });
    const byHeight = [...placed].sort((a, b) => a.y - b.y);
    byHeight.forEach((label, i) => {
        for (const above of byHeight.slice(0, i)) {
            if (Math.abs(above.x - label.x) < 50 && label.y - above.y < LINE) label.y = above.y + LINE;
        }
    });
    return (
        <>
            {placed.map((l, i) => (
                <text key={i} x={l.x} y={l.y} textAnchor="end" dominantBaseline="central"
                    style={{ fill: '#000000', fontSize: 10, ...HALO }}>{l.text}</text>
            ))}
        </>
    );
};

/** A data point in a hidden neuron's graph, labelled on two lines with its class and the neuron's activation. */
const DataPoint: React.FC<{ view: View; at: Vec2; cls: number; value: number; size: number }> = ({ view, at, cls, value, size }) => {
    const { viewTransform } = useTransformContext();
    const p = toBoard(view, at);
    const dx = p[0] - view.centre[0];
    const dy = p[1] - view.centre[1];
    const d = Math.hypot(dx, dy) || 1;
    // The label sits just beyond the point, away from the centre, aligned to whichever side faces the point
    const [lx, ly] = vec.transform([p[0] + (dx / d) * 0.5, p[1] + (dy / d) * 0.5], viewTransform);
    const firstLine = dy > 0 ? ly - 14 : ly + 10;
    const anchor = dx > 0 ? 'start' : 'end';
    // Slid sideways back onto the board if it would run off an edge (on a phone, beside the outer points)
    const { ref, metrics } = useTextMetrics();
    const [x] = keepInside(metrics, lx, firstLine, anchor);
    return (
        <>
            <Circle center={p} radius={0.12} color={cls === 1 ? RED : GREEN} weight={1} fillOpacity={1} />
            <text ref={ref} x={x} y={firstLine} textAnchor={anchor} style={{ fill: '#000000', fontSize: size }}>
                {className(cls)}
                <tspan x={x} dy={12}>{` (${n(value)})`}</tspan>
            </text>
        </>
    );
};

/**
 * The weight vector w drawn from the boundary's nearest point to the origin, the boundary across the
 * neuron's circle, the bias at the boundary and the weights by w's tip, with draggable handles for b and w.
 */
const NeuronWeights: React.FC<{
    view: View;
    handles: Handles;
    weights: { w: Vec2; b: number };
    tipLabelBeyond: boolean;
    biasLabelRaise: number;
    onMoveTip: (p: Vec2) => void;
    onMoveAnchor: (p: Vec2) => void;
    onDragStart: () => void;
}> = ({ view, handles, weights: { w, b }, tipLabelBeyond, biasLabelRaise, onMoveTip, onMoveAnchor, onDragStart }) => {
    const { viewTransform } = useTransformContext();
    const anchor = toBoard(view, handles.anchor);
    const tip = toBoard(view, handles.tip);

    // Above and to the right of the tip, or beyond it: to the left if w points left, below if it points down
    const tipLabel = !tipLabelBeyond
        ? { dx: 11, dy: -9, anchor: 'start' as const }
        : { dx: w[0] < 0 ? -11 : 11, dy: w[1] < 0 ? 18 : -9, anchor: w[0] < 0 ? ('end' as const) : ('start' as const) };

    // The boundary, through the anchor and perpendicular to w, clipped to the circle
    const length = Math.hypot(w[0], w[1]);
    const along: Vec2 = length ? [-w[1] / length, w[0] / length] : [1, 0];
    const fromCentre: Vec2 = [anchor[0] - view.centre[0], anchor[1] - view.centre[1]];
    const t0 = dot(fromCentre, along);
    const disc = t0 * t0 - (dot(fromCentre, fromCentre) - view.r * view.r);
    const chord = disc > 0 ? [-t0 - Math.sqrt(disc), -t0 + Math.sqrt(disc)] : null;

    // Each handle can be picked up within 30px, or half way to the other if they are closer (so a finger always gets the nearer one)
    const pixelsPerUnit = Math.abs(viewTransform[0]);
    const apart = Math.hypot(tip[0] - anchor[0], tip[1] - anchor[1]) * pixelsPerUnit;
    const reach = Math.min(30, apart / 2);

    return (
        <>
            {chord && length > 0 && (
                <Line.Segment
                    point1={[anchor[0] + along[0] * chord[0], anchor[1] + along[1] * chord[0]]}
                    point2={[anchor[0] + along[0] * chord[1], anchor[1] + along[1] * chord[1]]}
                    color="#000000" style="dashed" weight={2}
                />
            )}
            <Vector tail={anchor} tip={tip} color="#000000" weight={2} />
            {/* Offset in pixels to clear the handles' rings, drawn over them */}
            <BoardText at={anchor} anchor="end" baseline="central" dx={-13} dy={-biasLabelRaise} size={10} color="purple" bold halo>{`w₀ ${n(b)}`}</BoardText>
            <BoardText at={tip} dx={tipLabel.dx} dy={tipLabel.dy} anchor={tipLabel.anchor} size={10} bold halo>
                <tspan style={{ fill: W1 }}>{`w₁ ${n(w[0])}`}</tspan>
                {', '}
                <tspan style={{ fill: W2 }}>{`w₂ ${n(w[1])}`}</tspan>
            </BoardText>
            <Handle at={anchor} reach={reach} onMove={onMoveAnchor} onDragStart={onDragStart} />
            <Handle at={tip} reach={reach} onMove={onMoveTip} onDragStart={onDragStart} />
        </>
    );
};

/** A draggable handle that can be picked up within `reach` pixels. */
const Handle: React.FC<{ at: Vec2; reach: number; onMove: (p: Vec2) => void; onDragStart: () => void }> = ({ at, reach, onMove, onDragStart }) => {
    const ref = useRef<SVGGElement>(null);
    const { dragging } = useMovable({ gestureTarget: ref as React.RefObject<SVGGElement>, onMove, point: at, constrain: p => p });
    const { viewTransform } = useTransformContext();
    // The first pointer event of a drag never moves the point, so the drag's starting state is recorded before any move
    useEffect(() => {
        if (dragging) onDragStart();
    }, [dragging, onDragStart]);
    const [px, py] = vec.transform(at, viewTransform);
    return (
        <g ref={ref} style={{ cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}>
            <circle cx={px} cy={py} r={reach} fill="transparent" />
            {/* Only the circle above picks the handle up: the display's own 30px hit area would reach over the other handle */}
            <g style={{ pointerEvents: 'none' }}>
                <MovablePointDisplay point={at} color={ORANGE} dragging={dragging} ringRadiusPx={Math.min(10, reach)} />
            </g>
        </g>
    );
};
