import React, { useState } from 'react';
import { MafsBoard } from '../../../components/MafsBoard';
import { SIMILARITY_COLORS as c } from '../colors';
import { vectorLength, distance, dot, cosineSimilarity, ccwAngleDeg, type Vec2 } from './geometry';
import { TwoVectorScene } from './TwoVectorScene';
import type { ChartPoint } from '../../../components/chartTestHook';
import { CalculationPanel, V, Value } from './CalculationPanel';

/** The two draggable vectors as reported to the chart tests. */
const twoVectorPoints = (a: Vec2, b: Vec2): ChartPoint[] => [
    { name: 'a', x: a[0], y: a[1], visible: true, draggable: true, color: c.aMag },
    { name: 'b', x: b[0], y: b[1], visible: true, draggable: true, color: c.aMag },
];

type Lines = (a: Vec2, b: Vec2) => React.ReactNode[];

/** Two draggable vectors a and b, starting at a = (3.5, 1) and b = (2, 4), with optional live calculations. */
type Range = { x: [number, number]; y: [number, number] };

const TwoVectorChart: React.FC<{ id: string; lines?: Lines; narrow?: Range } & Range> = ({ id, x, y, lines, narrow }) => {
    const [a, setA] = useState<Vec2>([3.5, 1]);
    const [b, setB] = useState<Vec2>([2, 4]);
    return (
        <MafsBoard chartId={id} points={twoVectorPoints(a, b)} x={x} y={y} narrow={narrow} panel={lines && <CalculationPanel lines={lines(a, b)} />}>
            <TwoVectorScene a={a} b={b} onMoveA={setA} onMoveB={setB} />
        </MafsBoard>
    );
};

const n = (value: number, digits = 2) => value.toFixed(digits);
const angle = (a: Vec2, b: Vec2) => `${n(ccwAngleDeg(a, b), 1)}°`;

export const VectorSimilarityIntro: React.FC<{ id: string }> = ({ id }) => <TwoVectorChart id={id} x={[-5, 5]} y={[-5, 5]} />;

export const DotProductGeometric: React.FC<{ id: string }> = ({ id }) => (
    <TwoVectorChart id={id} x={[-6, 6]} y={[-6, 6]} lines={(a, b) => [
        <><V name="a" /> length = <Value color={c.aMag}>{n(vectorLength(a))}</Value></>,
        <><V name="b" /> length = <Value color={c.ay}>{n(vectorLength(b))}</Value></>,
        <>Euclidean distance = <Value color={c.by}>{n(distance(a, b))}</Value></>,
        <>Cosine similarity = <Value color={c.cos}>{n(cosineSimilarity(a, b))}</Value> = cos({angle(a, b)})</>,
        <>
            Dot product = <Value color={c.bx}>{n(dot(a, b))}</Value> = <Value color={c.aMag}>{n(vectorLength(a))}</Value>
            {' ⋅ '}<Value color={c.ay}>{n(vectorLength(b))}</Value>{' ⋅ '}<Value color={c.cos}>{n(cosineSimilarity(a, b))}</Value>
        </>,
    ]} />
);

const COMPARISON = { ax: '#ff7f0e', ay: '#e377c2', bx: '#2ca02c', by: '#17becf', aLen: '#d62728', bLen: '#9467bd', cos: '#8c564b', dot: '#1f77b4' };

export const DotProductComparison: React.FC<{ id: string }> = ({ id }) => {
    const k = COMPARISON;
    return (
        <TwoVectorChart id={id} x={[-6, 6]} y={[-6, 6]} lines={(a, b) => [
            <><V name="a" /> = [<Value color={k.ax}>{n(a[0], 1)}</Value>, <Value color={k.ay}>{n(a[1], 1)}</Value>]</>,
            <><V name="b" /> = [<Value color={k.bx}>{n(b[0], 1)}</Value>, <Value color={k.by}>{n(b[1], 1)}</Value>]</>,
            <><V name="a" /> length = <Value color={k.aLen}>{n(vectorLength(a))}</Value></>,
            <><V name="b" /> length = <Value color={k.bLen}>{n(vectorLength(b))}</Value></>,
            <>Cosine = <Value color={k.cos}>{n(cosineSimilarity(a, b))}</Value> = cos({angle(a, b)})</>,
            <>
                <V name="a" /> ⋅ <V name="b" /> = <Value color={k.ax}>{n(a[0], 1)}</Value> ⋅ <Value color={k.bx}>{n(b[0], 1)}</Value>
                {' + '}<Value color={k.ay}>{n(a[1], 1)}</Value> ⋅ <Value color={k.by}>{n(b[1], 1)}</Value> = <Value color={k.dot}>{n(dot(a, b))}</Value>
            </>,
            <>
                <V name="a" /> ⋅ <V name="b" /> = <Value color={k.aLen}>{n(vectorLength(a), 1)}</Value> ⋅ <Value color={k.bLen}>{n(vectorLength(b), 1)}</Value>
                {' ⋅ '}<Value color={k.cos}>{n(cosineSimilarity(a, b))}</Value> = <Value color={k.dot}>{n(dot(a, b))}</Value>
            </>,
        ]} />
    );
};

const Fraction: React.FC<{ top: React.ReactNode; bottom: React.ReactNode; topColor?: string }> = ({ top, bottom, topColor }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle' }}>
        <span style={{ display: 'block', borderBottom: '1.5px solid currentColor', padding: '0 4px', color: topColor }}>{top}</span>
        <span style={{ display: 'block', padding: '0 4px' }}>{bottom}</span>
    </span>
);

export const MathNotations: React.FC<{ id: string }> = ({ id }) => (
    <TwoVectorChart id={id} x={[-9, 6]} y={[-4, 5]} narrow={{ x: [-4, 5], y: [-3, 5] }} lines={(a, b) => {
        const [ax, ay] = a.map(v => n(v));
        const [bx, by] = b.map(v => n(v));
        const aLen = <Value color={c.aMag}>{n(vectorLength(a))}</Value>;
        const bLen = <Value color={c.bMag}>{n(vectorLength(b))}</Value>;
        const dotValue = <Value color={c.dot}>{n(dot(a, b))}</Value>;
        const cos = <Value color={c.cos}>{n(cosineSimilarity(a, b))}</Value>;
        const X = (v: string, color: string) => <Value color={color}>{v}</Value>;
        return [
            <><V name="a" /> = ({X(ax, c.ax)}, {X(ay, c.ay)})</>,
            <><V name="b" /> = ({X(bx, c.bx)}, {X(by, c.by)})</>,
            <>||<V name="a" /> - <V name="b" />|| = {n(distance(a, b))} = √(({X(ax, c.ax)} - {X(bx, c.bx)})<sup>2</sup> + ({X(ay, c.ay)} - {X(by, c.by)})<sup>2</sup>)</>,
            <>||<V name="a" />|| = {aLen} = √({X(ax, c.ax)}<sup>2</sup> + {X(ay, c.ay)}<sup>2</sup>)</>,
            <>||<V name="b" />|| = {bLen} = √({X(bx, c.bx)}<sup>2</sup> + {X(by, c.by)}<sup>2</sup>)</>,
            <><V name="a" /> ⋅ <V name="b" /> = {dotValue} = {X(ax, c.ax)} ⋅ {X(bx, c.bx)} + {X(ay, c.ay)} ⋅ {X(by, c.by)}</>,
            <><V name="a" /> ⋅ <V name="b" /> = {dotValue} = ||<V name="a" />|| ||<V name="b" />|| cos θ = {aLen} ⋅ {bLen} ⋅ {cos}</>,
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span>cos θ = {cos} = </span>
                <Fraction top={<><V name="a" /> ⋅ <V name="b" /></>} bottom={<>||<V name="a" />|| ||<V name="b" />||</>} />
                <span> = </span>
                <Fraction topColor={c.dot} top={n(dot(a, b))} bottom={<>{aLen} ⋅ {bLen}</>} />
            </span>,
        ];
    }} />
);
