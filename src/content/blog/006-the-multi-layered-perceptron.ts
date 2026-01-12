import type { BlogPost } from '../types';
import content from './006-the-multi-layered-perceptron.md?raw';

export const multiLayeredPerceptronPost: BlogPost = {
    id: 'the-multi-layered-perceptron',
    title: 'The Multi-Layered Perceptron Model',
    date: 'Jan 10, 2026',
    thumbnail: '/thumbnails/multi-layered-perceptron-detailed.png',
    description: 'Building upon the perceptron model, we explore how adding layers results in non-linear decision boundaries.',
    content
};
