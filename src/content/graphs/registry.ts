import JXG from 'jsxgraph';
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

    // 'mlp-architecture' is a Mafs chart: see mafsCharts.ts
    // 'mlp-decision-boundaries' is a Mafs chart: see mafsCharts.ts
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
