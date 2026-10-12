import React from 'react';
import { MafsBoard, type BoardPlot } from '../../../components/MafsBoard';
import { TextAt } from './labels';

const degrees = (radians: number) => `${((radians * 180) / Math.PI).toFixed(1)}°`;

const COSINE: BoardPlot[] = [{ name: '', from: 0, to: 2 * Math.PI, y: Math.cos, color: '#1a73e8' }];

/** cos x from 0° to 360°, with the x-axis marked in degrees. */
export const CosineFunction: React.FC<{ id: string }> = ({ id }) => (
    <MafsBoard
        chartId={id} plots={COSINE} height={300} maxWidth={525}
        x={[-1, 7]} y={[-1.5, 1.5]}
        xAxis={{ lines: Math.PI / 2, labels: degrees }} yAxis={{ lines: 0.5 }}
    >
        {null}
    </MafsBoard>
);

const RELU: BoardPlot[] = [{ name: '', from: -5, to: 5, y: x => Math.max(0, x), color: '#1A5276', weight: 3 }];

/** The ReLU activation function, f(x) = max(0, x). */
export const ReluFunction: React.FC<{ id: string }> = ({ id }) => (
    <MafsBoard chartId={id} plots={RELU} height={300} maxWidth={500} x={[-5, 5]} y={[-1, 5.5]}>
        <TextAt at={[-4, 3]} text="f(x) = max(0, x)" />
    </MafsBoard>
);
