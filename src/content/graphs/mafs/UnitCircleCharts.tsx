import React, { useMemo, useState } from 'react';
import { Circle, Line, MovablePoint, Point, Vector } from 'mafs';
import { MafsBoard, type BoardPlot } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import { SIMILARITY_COLORS as C } from '../colors';
import { distance, vectorLength, type Vec2 } from './geometry';
import { SegmentLabel, VectorName, PointName } from './labels';
import { AngleMark } from './AngleMark';

const ORIGIN: Vec2 = [0, 0];
const B: Vec2 = [1, 0];
const TAU = 2 * Math.PI;

const onCircle = (v: Vec2): Vec2 => {
    const length = vectorLength(v);
    return length === 0 ? B : [v[0] / length, v[1] / length];
};

/** Angle of a point on the unit circle, counter-clockwise from b = (1, 0), in radians in [0, 2π). */
const angleOf = ([x, y]: Vec2) => (Math.atan2(y, x) + TAU) % TAU;

/** A similarity measure as a function of the angle between a and b. */
interface Measure {
    name: string;
    f: (angle: number) => number;
    curveColor: string;
    pointColor: string;
}

const COSINE: Measure = { name: 'Cosine Similarity', f: Math.cos, curveColor: C.vector, pointColor: '#1a73e8' };
const COSINE_DISTANCE: Measure = { name: '1 - Cosine Similarity', f: t => 1 - Math.cos(t), curveColor: C.vector, pointColor: '#1a73e8' };
const EUCLIDEAN: Measure = { name: 'Euclidean Distance', f: t => distance([Math.cos(t), Math.sin(t)], B), curveColor: '#ff0000', pointColor: '#ff33ff' };

const degrees = (radians: number) => `${((radians * 180) / Math.PI).toFixed(1)}°`;
const tick = (n: number) => String(Number(n.toFixed(1)));

/**
 * Vector a slides around the unit circle while b stays at (1, 0). The left board shows the vectors
 * and the angle between them; the right board plots each measure against that angle and marks its current value.
 */
const UnitCircleChart: React.FC<{ id: string; measures: Measure[]; showDistance?: boolean }> = ({ id, measures, showDistance }) => {
    const [a, setA] = useState<Vec2>(() => onCircle([1, 1]));
    const angle = angleOf(a);

    const circlePoints: ChartPoint[] = useMemo(() => [
        { name: 'a', x: a[0], y: a[1], visible: true, draggable: true },
        { name: 'b', x: B[0], y: B[1], visible: true, draggable: false },
    ], [a]);
    const plots: BoardPlot[] = useMemo(() => measures.map(m => ({ name: '', from: 0, to: TAU, y: m.f, color: m.curveColor })), [measures]);
    const measurePoints: ChartPoint[] = useMemo(() => measures.map(m => (
        { name: m.name, x: angle, y: m.f(angle), visible: true, draggable: false, color: m.pointColor }
    )), [measures, angle]);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', maxWidth: '1040px', justifyContent: 'center' }}>
            <MafsBoard
                chartId={id} boardIndex={0} boardCount={2} sideBySide maxWidth={500} points={circlePoints}
                x={[-1.2, 1.2]} y={[-1.2, 1.2]} xAxis={{ lines: 0.2, labels: tick }} yAxis={{ lines: 0.2, labels: tick }}
            >
                <Circle center={ORIGIN} radius={1} color={C.vector} strokeStyle="dashed" fillOpacity={0} />
                <AngleMark from={B} to={a} labelRadius={1.08} />
                {/* The components of a: the lines through it perpendicular to each axis */}
                <Line.ThroughPoints point1={[a[0], 0]} point2={[a[0], 1]} color="#000000" weight={1.5} />
                <Line.ThroughPoints point1={[0, a[1]]} point2={[1, a[1]]} color="#000000" weight={1.5} />
                {showDistance && (
                    <>
                        <Line.Segment point1={a} point2={B} color={C.vector} style="dashed" weight={2} />
                        <SegmentLabel from={a} to={B} text={distance(a, B).toFixed(2)} background="#ffffff" />
                    </>
                )}
                <Vector tip={a} color={C.vector} weight={3} />
                <Vector tip={B} color={C.vector} weight={3} />
                <SegmentLabel from={ORIGIN} to={a} text={vectorLength(a).toFixed(2)} background={C.aMag} />
                <SegmentLabel from={ORIGIN} to={B} text={vectorLength(B).toFixed(2)} background={C.bMag} />
                <VectorName at={a} name="a" />
                <VectorName at={B} name="b" />
                <MovablePoint point={a} onMove={setA} constrain={onCircle} color={C.aMag} />
            </MafsBoard>
            <MafsBoard
                chartId={id} boardIndex={1} boardCount={2} sideBySide maxWidth={500} stretch points={measurePoints} plots={plots}
                x={[-1, 7]} y={[-2.5, 2.5]} xAxis={{ lines: Math.PI / 2, labels: degrees }} yAxis={{ lines: 0.5 }}
            >
                {measurePoints.map(p => (
                    <React.Fragment key={p.name}>
                        <Point x={p.x} y={p.y} color={p.color} />
                        <PointName at={[p.x, p.y]} text={p.name} />
                    </React.Fragment>
                ))}
            </MafsBoard>
        </div>
    );
};

const COSINE_ONLY = [COSINE];
const COSINE_DISTANCE_ONLY = [COSINE_DISTANCE];
const DISTANCES = [EUCLIDEAN, COSINE_DISTANCE];

export const CosineNormalized: React.FC<{ id: string }> = ({ id }) => <UnitCircleChart id={id} measures={COSINE_ONLY} />;
export const CosineDistance: React.FC<{ id: string }> = ({ id }) => <UnitCircleChart id={id} measures={COSINE_DISTANCE_ONLY} />;
export const DistanceComparison: React.FC<{ id: string }> = ({ id }) => <UnitCircleChart id={id} measures={DISTANCES} showDistance />;
