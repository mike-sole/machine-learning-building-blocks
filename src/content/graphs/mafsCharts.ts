import { lazy, type ComponentType } from 'react';

type Chart = ComponentType<{ id: string }>;

/** Loads one named chart from a module only when a post shows it, so posts download just the charts they use. */
function chart<M>(load: () => Promise<M>, name: keyof M): Chart {
    return lazy(() => load().then(m => ({ default: m[name] as Chart })));
}

const functionCharts = () => import('./mafs/FunctionCharts');
const movieVectorCharts = () => import('./mafs/MovieVectorCharts');
const unitCircleCharts = () => import('./mafs/UnitCircleCharts');
const twoVectorCharts = () => import('./mafs/TwoVectorCharts');

/** Every chart a post can show in a ```graph block, by id. Each is a React component built with Mafs. */
export const mafsCharts: Record<string, Chart> = {
    'vector-similarity-intro': chart(twoVectorCharts, 'VectorSimilarityIntro'),
    'dot-product-geometric': chart(twoVectorCharts, 'DotProductGeometric'),
    'dot-product-comparison': chart(twoVectorCharts, 'DotProductComparison'),
    'math-notations': chart(twoVectorCharts, 'MathNotations'),
    'cosine-function': chart(functionCharts, 'CosineFunction'),
    'relu-function': chart(functionCharts, 'ReluFunction'),
    'movie-vectors-normalized': chart(movieVectorCharts, 'MovieVectorsNormalized'),
    'movie-vectors-popularity': chart(movieVectorCharts, 'MovieVectorsPopularity'),
    'cosine-normalized': chart(unitCircleCharts, 'CosineNormalized'),
    'cosine-distance': chart(unitCircleCharts, 'CosineDistance'),
    'distance-comparison': chart(unitCircleCharts, 'DistanceComparison'),
    'perceptron-classification': chart(() => import('./mafs/PerceptronClassification'), 'PerceptronClassification'),
    'perceptron-training': chart(() => import('./mafs/PerceptronTraining'), 'PerceptronTraining'),
    'mlp-architecture': chart(() => import('./mafs/MlpArchitecture'), 'MlpArchitecture'),
    'mlp-decision-boundaries': chart(() => import('./mafs/MlpDecisionBoundaries'), 'MlpDecisionBoundaries'),
};
