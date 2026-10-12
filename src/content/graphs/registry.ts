import JXG from 'jsxgraph';
import { MultiLayerPerceptronChart } from './MultiLayerPerceptronChart';
import { MLPDecisionBoundariesChart } from './MLPDecisionBoundariesChart';
import { initSigmoid } from './ActivationFunctionsChart';

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

    // 'cosine-normalized', 'cosine-distance' and 'distance-comparison' are Mafs charts: see mafsCharts.ts
    // 'movie-vectors-normalized' and 'movie-vectors-popularity' are Mafs charts: see mafsCharts.ts

    // 'math-notations' is a Mafs chart: see mafsCharts.ts

    // 'perceptron-classification' is a Mafs chart: see mafsCharts.ts

    // 'perceptron-training' is a Mafs chart: see mafsCharts.ts

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
