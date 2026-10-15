import type { ElementContent, Root } from 'hast';
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { mathKey, visitMath } from './visitMath';

/**
 * Stands in for rehype-katex: swaps each piece of maths for the HTML KaTeX rendered for it at build
 * time (see renderPostMath), so the page looks the same without loading KaTeX.
 */
export default function rehypePrerenderedMath(html: Record<string, string>) {
    return (tree: Root) => {
        visitMath(tree, (tex, displayMode) => {
            const rendered = html[mathKey(tex, displayMode)];
            if (rendered === undefined) {
                console.error(`No prerendered HTML for maths: ${tex}`);
                return [{
                    type: 'element',
                    tagName: 'span',
                    properties: { className: ['katex-error'], style: 'color:#cc0000' },
                    children: [{ type: 'text', value: tex }],
                }];
            }
            return fromHtmlIsomorphic(rendered, { fragment: true }).children as ElementContent[];
        });
    };
}
