import type React from 'react';
import { CosineFunction, ReluFunction } from './mafs/FunctionCharts';
import { MovieVectorsNormalized, MovieVectorsPopularity } from './mafs/MovieVectorCharts';
import { PerceptronClassification } from './mafs/PerceptronClassification';
import { PerceptronTraining } from './mafs/PerceptronTraining';
import { MlpArchitecture } from './mafs/MlpArchitecture';
import { MlpDecisionBoundaries } from './mafs/MlpDecisionBoundaries';
import { CosineNormalized, CosineDistance, DistanceComparison } from './mafs/UnitCircleCharts';
import { VectorSimilarityIntro, DotProductGeometric, DotProductComparison, MathNotations } from './mafs/TwoVectorCharts';

/** Charts built with Mafs (React components). Every other chart id is a JSXGraph chart in registry.ts. */
export const mafsCharts: Record<string, React.ComponentType<{ id: string }>> = {
    'vector-similarity-intro': VectorSimilarityIntro,
    'dot-product-geometric': DotProductGeometric,
    'dot-product-comparison': DotProductComparison,
    'math-notations': MathNotations,
    'cosine-function': CosineFunction,
    'relu-function': ReluFunction,
    'movie-vectors-normalized': MovieVectorsNormalized,
    'movie-vectors-popularity': MovieVectorsPopularity,
    'cosine-normalized': CosineNormalized,
    'cosine-distance': CosineDistance,
    'distance-comparison': DistanceComparison,
    'perceptron-classification': PerceptronClassification,
    'perceptron-training': PerceptronTraining,
    'mlp-architecture': MlpArchitecture,
    'mlp-decision-boundaries': MlpDecisionBoundaries,
};
