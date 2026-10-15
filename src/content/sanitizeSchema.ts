import { defaultSchema, type Options } from 'rehype-sanitize';

/**
 * What a post's HTML may contain once rehype-raw has parsed the raw HTML in its Markdown: GitHub's
 * safe subset (no scripts, event handlers or javascript: links), plus what the posts use on top:
 * coloured <span style> text, and the classes that mark maths for rehypePrerenderedMath.
 */
export const postSanitizeSchema: Options = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        code: [['className', /^language-./, 'math-inline', 'math-display']],
        span: [...(defaultSchema.attributes?.span ?? []), 'style'],
    },
};
