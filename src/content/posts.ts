import type { BlogPost } from './types';
import { weightedSumPost } from './blog/001-weighted-sum';
import { matrixMultiplicationPost } from './blog/002-matrix-multiplication';
import { vectorSimilarityPost } from './blog/003-vector-similarity-measures';
import { thePerceptronModelPost } from './blog/004-the-perceptron-model';
import { trainingThePerceptronPost } from './blog/005-training-the-perceptron';

import { multiLayeredPerceptronPost } from './blog/006-the-multi-layered-perceptron';
// import { trainingMultiLayeredPerceptronPost } from './blog/007-training-the-multi-layered-perceptron';

export * from './types';

export const posts: BlogPost[] = [
    weightedSumPost,
    matrixMultiplicationPost,
    vectorSimilarityPost,
    thePerceptronModelPost,
    trainingThePerceptronPost,
    multiLayeredPerceptronPost
    // trainingMultiLayeredPerceptronPost
];
