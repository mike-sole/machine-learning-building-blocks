import React, { useMemo, useState } from 'react';
import { Circle, Line, MovablePoint, Vector } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import { SIMILARITY_COLORS as C } from '../colors';
import { distance, vectorLength, type Vec2 } from './geometry';
import { SegmentLabel, VectorName } from './labels';
import { AngleMark } from './AngleMark';

const ORIGIN: Vec2 = [0, 0];

/** The three movies from the post, as [action, romance] ratings. */
const MOVIES = [
    { name: 'a', at: [5, 1] as Vec2, color: '#1a73e8', lengthLabel: C.aMag },
    { name: 'b', at: [9, 9] as Vec2, color: '#ea4335', lengthLabel: C.bMag },
    { name: 'c', at: [0.5, 3] as Vec2, color: '#157845', lengthLabel: '#8df5bf' },
];

const normalise = (v: Vec2): Vec2 => {
    const length = vectorLength(v);
    return length === 0 ? [1, 0] : [v[0] / length, v[1] / length];
};

/** Three draggable movie vectors; the reader moves each by its tip. */
function useMovieVectors(start: (v: Vec2) => Vec2) {
    const [tips, setTips] = useState(() => MOVIES.map(m => start(m.at)));
    const move = (i: number) => (p: Vec2) => setTips(t => t.map((v, j) => (j === i ? p : v)));
    const points: ChartPoint[] = useMemo(() => tips.map((t, i) => (
        { name: MOVIES[i].name, x: t[0], y: t[1], visible: true, draggable: true, color: MOVIES[i].color }
    )), [tips]);
    return { tips, move, points };
}

const MovieVector: React.FC<{ index: number; tip: Vec2; onMove: (p: Vec2) => void; showLength: boolean }> = ({ index, tip, onMove, showLength }) => {
    const movie = MOVIES[index];
    return (
        <>
            <Vector tip={tip} color={movie.color} weight={3} />
            {showLength && <SegmentLabel from={ORIGIN} to={tip} text={vectorLength(tip).toFixed(2)} background={movie.lengthLabel} />}
            <VectorName at={tip} name={movie.name} color={movie.color} />
            <MovablePoint point={tip} onMove={onMove} color={movie.color} />
        </>
    );
};

/** The movie vectors scaled to length 1 on the unit circle: each length is 1.00, so only the angles between them remain. */
export const MovieVectorsNormalized: React.FC<{ id: string }> = ({ id }) => {
    const { tips: [a, b, c], move, points } = useMovieVectors(normalise);
    return (
        <MafsBoard chartId={id} points={points} x={[-1.4, 1.4]} y={[-1.4, 1.4]} xAxis={{ lines: 0.2, labels: tick }} yAxis={{ lines: 0.2, labels: tick }}>
            <Circle center={ORIGIN} radius={1} color="#cccccc" strokeStyle="dashed" fillOpacity={0} />
            <AngleMark from={a} to={b} radius={0.5} />
            <AngleMark from={b} to={c} radius={0.4} />
            {[a, b, c].map((tip, i) => <MovieVector key={i} index={i} tip={tip} onMove={move(i)} showLength />)}
        </MafsBoard>
    );
};

/** The movie vectors at full length: lengths, angles and the distances between them. */
export const MovieVectorsPopularity: React.FC<{ id: string }> = ({ id }) => {
    const { tips: [a, b, c], move, points } = useMovieVectors(v => v);
    return (
        <MafsBoard chartId={id} points={points} x={[-1, 10]} y={[-1, 10]}>
            <AngleMark from={a} to={b} radius={1} />
            <AngleMark from={b} to={c} radius={0.75} />
            {[[a, b], [a, c], [b, c]].map(([p, q], i) => (
                <React.Fragment key={i}>
                    <Line.Segment point1={p} point2={q} color={C.vector} style="dashed" weight={2} />
                    <SegmentLabel from={p} to={q} text={distance(p, q).toFixed(2)} background="#ffffff" />
                </React.Fragment>
            ))}
            {[a, b, c].map((tip, i) => <MovieVector key={i} index={i} tip={tip} onMove={move(i)} showLength />)}
        </MafsBoard>
    );
};

/** Tick labels to one decimal place, without floating-point noise (0.6000000000000001). */
const tick = (n: number) => String(Number(n.toFixed(1)));
