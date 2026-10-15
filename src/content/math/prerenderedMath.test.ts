import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, type PluggableList } from 'unified';
import { describe, expect, it } from 'vitest';
import rehypePrerenderedMath from './rehypePrerenderedMath';
import { renderPostMath } from './renderPostMath';

const posts = Object.entries(
    import.meta.glob<string>('../blog/*.md', { query: '?raw', import: 'default', eager: true }),
).map(([file, markdown]) => [file.replace('../blog/', ''), markdown]);

/** A post's HTML tree as react-markdown builds it in Post.tsx, without source positions. */
function htmlTree(markdown: string, mathPlugins: PluggableList) {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(mathPlugins);
    const tree = processor.runSync(processor.parse(markdown));
    return JSON.parse(JSON.stringify(tree, (key, value) => (key === 'position' ? undefined : value)));
}

describe('prerendered maths', () => {
    it.each(posts)('%s renders exactly as rehype-katex does', (_file, markdown) => {
        const prerendered = htmlTree(markdown, [[rehypePrerenderedMath, renderPostMath([markdown])]]);
        expect(JSON.stringify(prerendered)).toContain('katex');
        expect(prerendered).toEqual(htmlTree(markdown, [rehypeKatex]));
    });

    it('covers inline, display and ```math maths, but not dollars in code', () => {
        const html = renderPostMath(['Inline $a^2$ and `$b$`.\n\n$$\nc_1\n$$\n\n```math\nd\n```\n']);
        expect(Object.keys(html).sort()).toEqual(['display:c_1', 'display:d\n', 'inline:a^2']);
    });

    it('fails the build on TeX KaTeX cannot render', () => {
        expect(() => renderPostMath(['$\\frac{1}$'])).toThrow();
    });
});
