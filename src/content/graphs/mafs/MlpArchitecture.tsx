import React from 'react';
import { Circle, Vector } from 'mafs';
import { MafsBoard } from '../../../components/MafsBoard';
import type { ChartPoint } from '../../../components/chartTestHook';
import type { Vec2 } from './geometry';
import { BoardText } from './labels';

const LAYERS = [2, 3, 1];
const LAYER_SPACING = 4;
const NEURON_SPACING = 1.5;
const RADIUS = 0.5;

interface Neuron { at: Vec2; color: string; symbol: string; index?: string }

/** Each layer's neurons: centred vertically, layers 4 apart and centred on x = 0. */
const NETWORK: Neuron[][] = LAYERS.map((size, layer) => {
    const x = -((LAYERS.length - 1) * LAYER_SPACING) / 2 + layer * LAYER_SPACING;
    const top = ((size - 1) * NEURON_SPACING) / 2;
    return Array.from({ length: size }, (_, i) => {
        const at: Vec2 = [x, top - i * NEURON_SPACING];
        if (layer === 0) return { at, color: '#a6cee3', symbol: 'x', index: `${i + 1}` };
        if (layer === LAYERS.length - 1) return { at, color: '#b2df8a', symbol: 'ŷ', index: size > 1 ? `${i + 1}` : undefined };
        return { at, color: '#fdbf6f', symbol: 'h', index: `${layer},${i + 1}` };
    });
});

const TITLES = ['Input Layer', 'Hidden Layer', 'Output Layer'];

const POINTS: ChartPoint[] = NETWORK.flat().map(n => (
    { name: n.symbol + (n.index ?? ''), x: n.at[0], y: n.at[1], visible: true, draggable: false, color: n.color }
));

/** From the edge of neuron a's circle to the edge of neuron b's. */
const connection = (a: Vec2, b: Vec2): [Vec2, Vec2] => {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / d;
    const uy = (b[1] - a[1]) / d;
    return [[a[0] + ux * RADIUS, a[1] + uy * RADIUS], [b[0] - ux * RADIUS, b[1] - uy * RADIUS]];
};

/** A 2-3-1 multi-layer perceptron: every neuron connected to every neuron in the next layer. */
export const MlpArchitecture: React.FC<{ id: string }> = ({ id }) => (
    <MafsBoard chartId={id} points={POINTS} x={[-5, 5]} y={[-3.5, 2.5]} aspect={5 / 3} grid={false}>
        {NETWORK.slice(0, -1).flatMap((layer, l) => layer.flatMap((from, i) => NETWORK[l + 1].map((to, j) => {
            const [tail, tip] = connection(from.at, to.at);
            return <Vector key={`${l}-${i}-${j}`} tail={tail} tip={tip} color="#999999" weight={1.5} opacity={0.8} />;
        })))}
        {NETWORK.flat().map((n, i) => (
            <React.Fragment key={i}>
                <Circle center={n.at} radius={RADIUS} color="#333333" weight={2} fillOpacity={1} svgEllipseProps={{ style: { fill: n.color } }} />
                <BoardText at={n.at} anchor="middle" baseline="central" size={14}>
                    <tspan style={{ fontStyle: 'italic' }}>{n.symbol}</tspan>
                    {n.index && <tspan baselineShift="sub" style={{ fontSize: 11 }}>{n.index}</tspan>}
                </BoardText>
            </React.Fragment>
        ))}
        {TITLES.map((title, layer) => (
            <BoardText key={title} at={[NETWORK[layer][0].at[0], -2.5]} anchor="middle" size={14}>{title}</BoardText>
        ))}
    </MafsBoard>
);
