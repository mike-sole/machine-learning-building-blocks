import katex from 'katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { mathKey, visitMath } from './visitMath';

// The Markdown pipeline Post.tsx gives react-markdown, up to the maths
const toHtmlTree = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw);

/**
 * Runs at build time: renders every piece of maths in the posts with KaTeX, so readers' browsers
 * get finished HTML and never download KaTeX's JavaScript. Fails on TeX that KaTeX can't render.
 */
export function renderPostMath(posts: string[]): Record<string, string> {
    const html: Record<string, string> = {};
    for (const markdown of posts) {
        const tree = toHtmlTree.runSync(toHtmlTree.parse(markdown));
        visitMath(tree, (tex, displayMode) => {
            html[mathKey(tex, displayMode)] ??= katex.renderToString(tex, { displayMode, throwOnError: true });
            return [];
        });
    }
    return html;
}
