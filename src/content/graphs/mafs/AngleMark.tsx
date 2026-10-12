import React from 'react';
import { Polygon } from 'mafs';
import { SIMILARITY_COLORS as C } from '../colors';
import { ccwAngleDeg, angleSector, angleLabelPosition, type Vec2 } from './geometry';
import { CentredText } from './labels';

/** The counter-clockwise angle from vector `from` to vector `to`, shaded at the origin and labelled in degrees. */
export const AngleMark: React.FC<{ from: Vec2; to: Vec2; radius?: number }> = ({ from, to, radius = 1 }) => (
    <>
        <Polygon points={angleSector(from, to, radius)} color={C.angle} fillOpacity={0.3} weight={1} />
        <CentredText at={angleLabelPosition(from, to, radius * 1.4)} text={`${ccwAngleDeg(from, to).toFixed(1)}°`} color={C.vector} />
    </>
);
