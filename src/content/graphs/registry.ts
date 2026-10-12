import JXG from 'jsxgraph';
import { UnitCircleChart } from './UnitCircleCharts';
import { PerceptronChart } from './PerceptronChart';
import { PerceptronTrainingChart } from './PerceptronTrainingChart';
import { MultiLayerPerceptronChart } from './MultiLayerPerceptronChart';
import { MLPDecisionBoundariesChart } from './MLPDecisionBoundariesChart';
import { initSigmoid } from './ActivationFunctionsChart';
import * as h from './helpers';

export type GraphInitializer = (
    board: JXG.Board,
    onLogUpdate?: (logs: string[]) => void,
    onRegisterActions?: (actions: Record<string, () => void>) => void
) => void;

export type MultiGraphInitializer = (
    boards: JXG.Board[],
    onLogUpdate?: (logs: string[]) => void,
    onRegisterActions?: (actions: Record<string, () => void>) => void
) => void;

export interface GraphConfig {
    initializer: GraphInitializer | MultiGraphInitializer;
    isMultiBoard?: boolean;
    boardAttributes?: Record<string, any>;
    boardAttributes2?: Record<string, any>;
    containerStyle?: React.CSSProperties;
}

const registry: Record<string, GraphInitializer | GraphConfig> = {
    // 'vector-similarity-intro' is a Mafs chart: see mafsCharts.ts
    // 'cosine-function' is a Mafs chart: see mafsCharts.ts
    // 'dot-product-geometric' and 'dot-product-comparison' are Mafs charts: see mafsCharts.ts

    // 5. Cosine Normalized (Unit Circle)
    'cosine-normalized': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1]).withCosineSimilarityMeasure(false);
        }
    } as GraphConfig,

    // 6. Cosine Distance
    'cosine-distance': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1]).withCosineSimilarityMeasure(true);
        }
    } as GraphConfig,

    // 7. Distance Comparison (Graph)
    'distance-comparison': {
        isMultiBoard: true,
        boardAttributes: {
            boundingbox: [-1.2, 1.2, 1.2, -1.2],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            }
        },
        boardAttributes2: {
            boundingbox: [-1, 2.5, 7, -2.5],
            keepaspectratio: false
        },
        initializer: (boards: JXG.Board[]) => {
            new UnitCircleChart(boards[0], boards[1])
                .withEuclideanDistanceMetric()
                .withCosineSimilarityMeasure(true);
        }
    } as GraphConfig,

    // 8. Movie Vectors (Normalized)
    'movie-vectors-normalized': {
        boardAttributes: {
            boundingbox: [-1.4, 1.4, 1.4, -1.4],
            defaultAxes: {
                x: { ticks: { insertTicks: false, ticksDistance: 0.2 } },
                y: { ticks: { insertTicks: false, ticksDistance: 0.2 } }
            },
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const coordsA = [5, 1];
            const coordsB = [4, 4];
            const coordsC = [0.5, 3];

            const normalize = (v: number[]) => {
                const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
                return [v[0] / mag, v[1] / mag];
            };

            const nA = normalize(coordsA);
            const nB = normalize(coordsB);
            const nC = normalize(coordsC);

            board.create('circle', [[0, 0], [1, 0]], { dash: 2, fixed: true, strokeColor: '#ccc' });
            const o = h.createOrigin(board);

            const pA = h.createVector(board, o, board.create('point', nA, { visible: false }), '#1a73e8', 'smart-label-circle-vector-a');
            pA.point2.setAttribute({ name: `<span class="vector-label" style="color:#1a73e8">a</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            const pB = h.createVector(board, o, board.create('point', nB, { visible: false }), '#ea4335', 'smart-label-circle-vector-b');
            pB.point2.setAttribute({ name: `<span class="vector-label" style="color:#ea4335">b</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            const pC = h.createVector(board, o, board.create('point', nC, { visible: false }), '#157845', 'smart-label-circle-vector-c');
            pC.point2.setAttribute({ name: `<span class="vector-label" style="color:#157845">c</span>`, visible: true, size: 0, withLabel: true, useMathJax: false });

            h.createAngleLabel(board, pA.point2, o, pB.point2, '#feae02', 0.5);
            h.createAngleLabel(board, pB.point2, o, pC.point2, '#feae02', 0.4);
        }
    } as GraphConfig,

    // 9. Movie Vectors (Popularity/Magnitude)
    'movie-vectors-popularity': {
        boardAttributes: {
            boundingbox: [-1, 10, 10, -1],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const o = h.createOrigin(board);

            const pA = h.createVector(board, o, board.create('point', [5, 1], { visible: false }), '#1a73e8', 'smart-label-circle-vector-a');
            pA.point2.setAttribute({ name: `<span class="vector-label" style="color:#1a73e8">a</span>`, visible: true, size: 0, withLabel: true });

            const pB = h.createVector(board, o, board.create('point', [9, 9], { visible: false }), '#ea4335', 'smart-label-circle-vector-b');
            pB.point2.setAttribute({ name: `<span class="vector-label" style="color:#ea4335">b</span>`, visible: true, size: 0, withLabel: true });

            const pC = h.createVector(board, o, board.create('point', [0.5, 3], { visible: false }), '#157845', 'smart-label-circle-vector-c');
            pC.point2.setAttribute({ name: `<span class="vector-label" style="color:#157845">c</span>`, visible: true, size: 0, withLabel: true });

            h.createAngleLabel(board, pA.point2, o, pB.point2, '#feae02', 1);
            h.createAngleLabel(board, pB.point2, o, pC.point2, '#feae02', 0.75);

            h.createMeasurementLine(board, pA.point2, pB.point2);
            h.createMeasurementLine(board, pA.point2, pC.point2);
            h.createMeasurementLine(board, pB.point2, pC.point2);
        }
    } as GraphConfig,

    // 'math-notations' is a Mafs chart: see mafsCharts.ts

    'perceptron-classification': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false
        },
        initializer: (board: JXG.Board) => {
            const classOnePoints = [
                { x: 4, y: 5, label: "spam" },
                { x: 2, y: 4, label: "spam" },
                { x: 0, y: 3, label: "spam" },
                { x: -4, y: 1, label: "spam" },
                { x: -1, y: 4, label: "spam" },
            ];

            const classTwoPoints = [
                { x: 4, y: 3, label: "not spam" },
                { x: 2, y: 2, label: "not spam" },
                { x: 0, y: 1, label: "not spam" },
                { x: -2, y: 0, label: "not spam" },
                { x: -4, y: -1, label: "not spam" },
                { x: 1, y: -1, label: "not spam" },
            ];

            new PerceptronChart(board, 1, classOnePoints, classTwoPoints, true);
        }
    } as GraphConfig,

    'perceptron-training': {
        boardAttributes: {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false,
            navigation: {
                button: false // Disable the default zoom/pan buttons to keep it clean
            }
        },
        initializer: (
            board: JXG.Board,
            onLogUpdate?: (logs: string[]) => void,
            onRegisterActions?: (actions: Record<string, () => void>) => void
        ) => {
            const data = [
                { x: 4.0, y: 5.0, label: "spam", class: 1 },
                { x: 5.0, y: 4.0, label: "spam", class: 1 },
                { x: 3.0, y: 5.5, label: "spam", class: 1 },

                { x: 2.0, y: 1.0, label: "not spam", class: 0 },
                { x: 3.0, y: 0.5, label: "not spam", class: 0 },
                { x: 1.0, y: 2.0, label: "not spam", class: 0 },
            ];

            new PerceptronTrainingChart(board, data, onLogUpdate, onRegisterActions);
        }
    } as GraphConfig,

    'mlp-architecture': {
        containerStyle: { width: '100%', aspectRatio: '5/3', margin: '0 auto' },
        boardAttributes: {
            boundingbox: [-5, 2.5, 5, -3.5],
            axis: false,
            showCopyright: false,
            showNavigation: false,
            pan: { enabled: false } as any,
            zoom: { enabled: false } as any
        },
        initializer: (board: JXG.Board) => {
            // 2 inputs, 3 hidden, 1 output - Classic XOR or simple MLP structure
            new MultiLayerPerceptronChart(board, [2, 3, 1]);
        }
    } as GraphConfig,
    'mlp-decision-boundaries': {
        containerStyle: { width: '100%', aspectRatio: '21/36', margin: '0 auto', border: 'none' },
        boardAttributes: {
            axis: false, // We draw our own
            keepaspectratio: true,
            showCopyright: false,
            showNavigation: false,
            pan: { enabled: false } as any,
            zoom: { enabled: false } as any
        },
        initializer: (board: JXG.Board) => {
            new MLPDecisionBoundariesChart(board);
        }
    } as GraphConfig,
    'sigmoid-function': {
        containerStyle: { maxWidth: '500px', height: '300px', margin: '0 auto' },
        boardAttributes: {
            axis: true,
            showCopyright: false,
            showNavigation: false,
            pan: { enabled: false } as any,
            zoom: { enabled: false } as any,
            keepaspectratio: false
        },
        initializer: initSigmoid
    } as GraphConfig,
    // 'relu-function' is a Mafs chart: see mafsCharts.ts
};

export default registry;
