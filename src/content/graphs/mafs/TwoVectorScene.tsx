import React from 'react';
import { MovablePoint, Polygon, Vector, Line } from 'mafs';
import { SIMILARITY_COLORS as C } from '../colors';
import { vectorLength, distance, ccwAngleDeg, angleSector, angleLabelPosition, type Vec2 } from './geometry';
import { SegmentLabel, VectorName, CentredText } from './labels';

const ORIGIN: Vec2 = [0, 0];

interface TwoVectorSceneProps {
    a: Vec2;
    b: Vec2;
    onMoveA: (a: Vec2) => void;
    onMoveB: (b: Vec2) => void;
}

/**
 * Vectors a and b from the origin, draggable by their tips, labelled with their lengths,
 * the distance between the tips and the counter-clockwise angle from a to b.
 */
export const TwoVectorScene: React.FC<TwoVectorSceneProps> = ({ a, b, onMoveA, onMoveB }) => (
    <>
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
        <MovablePoint point={a} onMove={onMoveA} color={C.aMag} />
        <MovablePoint point={b} onMove={onMoveB} color={C.aMag} />
    </>
);
