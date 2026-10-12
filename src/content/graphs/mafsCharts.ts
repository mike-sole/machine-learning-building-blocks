import type React from 'react';
import { VectorSimilarityIntro, DotProductGeometric, DotProductComparison, MathNotations } from './mafs/TwoVectorCharts';

/** Charts built with Mafs (React components). Every other chart id is a JSXGraph chart in registry.ts. */
export const mafsCharts: Record<string, React.ComponentType<{ id: string }>> = {
    'vector-similarity-intro': VectorSimilarityIntro,
    'dot-product-geometric': DotProductGeometric,
    'dot-product-comparison': DotProductComparison,
    'math-notations': MathNotations,
};
