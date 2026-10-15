import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, type PluggableList } from 'unified';
import { describe, expect, it } from 'vitest';
import { postSanitizeSchema } from './sanitizeSchema';

const posts = Object.entries(
    import.meta.glob<string>('./blog/*.md', { query: '?raw', import: 'default', eager: true }),
).map(([file, markdown]) => [file.replace('./blog/', ''), markdown]);

/** A post's HTML tree as react-markdown builds it in Post.tsx, before the maths is swapped in, as JSON without source positions. */
function html(markdown: string, sanitize: PluggableList) {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(sanitize);
    const tree = processor.runSync(processor.parse(markdown));
    return JSON.stringify(tree, (key, value) => (key === 'position' ? undefined : value));
}

const sanitized = (markdown: string) => html(markdown, [[rehypeSanitize, postSanitizeSchema]]);

describe('post HTML sanitising', () => {
    it.each(posts)('%s is unchanged by sanitising', (_file, markdown) => {
        expect(sanitized(markdown)).toEqual(html(markdown, []));
    });

    it('keeps coloured text, maths and graph blocks', () => {
        const out = sanitized('<span style="color: red">x</span> $a$\n\n$$\nb\n$$\n\n```graph\nid\n```\n');
        expect(out).toContain('"tagName":"span","properties":{"style":"color: red"}');
        expect(out).toContain('"className":["language-math","math-inline"]');
        expect(out).toContain('"className":["language-math","math-display"]');
        expect(out).toContain('"className":["language-graph"]');
    });

    it('removes scripts, event handlers and javascript: links', () => {
        const out = sanitized(
            '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)"> <a href="javascript:alert(1)">a</a> [b](javascript:alert(1))\n\n<iframe src="https://example.com"></iframe>',
        );
        expect(out).not.toMatch(/script|onerror|javascript:|iframe/i);
    });
});
