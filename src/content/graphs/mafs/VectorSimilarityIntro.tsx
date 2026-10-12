import React, { useMemo, useState } from 'react';
import { MovablePoint, Polygon, Vector, Line } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import { SIMILARITY_COLORS as C } from '../colors';
import { vectorLength, distance, ccwAngleDeg, angleSector, angleLabelPosition, type Vec2 } from './geometry';
import { SegmentLabel, VectorName, CentredText } from './labels';

const ORIGIN: Vec2 = [0, 0];

/** Two draggable vectors a and b, with their lengths, the distance between their tips and the angle between them. */
export const VectorSimilarityIntro: React.FC<{ id: string }> = ({ id }) => {
    const [a, setA] = useState<Vec2>([3.5, 1]);
    const [b, setB] = useState<Vec2>([2, 4]);

    const points = useMemo(() => [
        { name: 'a', x: a[0], y: a[1], visible: true, draggable: true, color: C.aMag },
        { name: 'b', x: b[0], y: b[1], visible: true, draggable: true, color: C.aMag },
    ], [a, b]);

    return (
        <MafsBoard chartId={id} points={points}>
            <Polygon points={angleSector(a, b, 1)} color={C.angle} fillOpacity={0.3} weight={1} />
            <CentredText at={angleLabelPosition(a, b, 1.4)} text={`${ccwAngleDeg(a, b).toFixed(1)}°`} color={C.vector} />

            <Line.Segment point1={a} point2={b} color={C.vector} style="dashed" weight={2} />
            <Vector tip={a} color={C.vector} weight={3} />
            <Vector tip={b} color={C.vector} weight={3} />

            <SegmentLabel from={ORIGIN} to={a} text={vectorLength(a).toFixed(2)} background={C.aMag} />
            <SegmentLabel from={ORIGIN} to={b} text={vectorLength(b).toFixed(2)} background={C.bMag} />
            <SegmentLabel from={a} to={b} text={distance(a, b).toFixed(2)} background="#ffffff" />

            <VectorName at={a} name="a" />
            <VectorName at={b} name="b" />
            <MovablePoint point={a} onMove={setA} color={C.aMag} />
            <MovablePoint point={b} onMove={setB} color={C.aMag} />
        </MafsBoard>
    );
};
