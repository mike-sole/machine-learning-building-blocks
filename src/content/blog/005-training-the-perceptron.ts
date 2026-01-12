import type { BlogPost } from '../types';
import content from './005-training-the-perceptron.md?raw';

export const trainingThePerceptronPost: BlogPost = {
    id: 'training-the-perceptron',
    title: 'Training the Perceptron',
    date: 'Jan 4, 2026',
    description: 'Building upon the Perceptron model, this post introduces the Perceptron Learning Algorithm - the process of iteratively adjusting weights and bias to learn accurate binary decisions.',
    thumbnail: "/thumbnails/training-perceptron-detailed.png",
    content
};
