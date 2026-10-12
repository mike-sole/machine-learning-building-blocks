import type React from 'react';
import { VectorSimilarityIntro } from './mafs/VectorSimilarityIntro';

/** Charts built with Mafs (React components). Every other chart id is a JSXGraph chart in registry.ts. */
export const mafsCharts: Record<string, React.ComponentType<{ id: string }>> = {
    'vector-similarity-intro': VectorSimilarityIntro,
};
