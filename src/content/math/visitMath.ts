import type { ElementContent, Root } from 'hast';
import { toText } from 'hast-util-to-text';
import { SKIP, visitParents } from 'unist-util-visit-parents';

/** Key for one piece of maths in the prerendered HTML map. */
export const mathKey = (tex: string, displayMode: boolean) => `${displayMode ? 'display' : 'inline'}:${tex}`;

/**
 * Finds the maths in a post's HTML tree exactly as rehype-katex does, and replaces each piece with
 * what `render` returns. Shared by the build, which renders the maths, and the browser, which swaps
 * in the prerendered HTML, so both see the same pieces.
 */
export function visitMath(tree: Root, render: (tex: string, displayMode: boolean) => ElementContent[]) {
    visitParents(tree, 'element', (element, parents) => {
        const classes = Array.isArray(element.properties.className) ? element.properties.className : [];
        // ```math blocks, and remark-math's $$ display and $ inline maths
        const languageMath = classes.includes('language-math');
        const mathDisplay = classes.includes('math-display');
        const mathInline = classes.includes('math-inline');
        if (!languageMath && !mathDisplay && !mathInline) return;

        let displayMode = mathDisplay;
        let parent = parents[parents.length - 1];
        let scope: typeof parent | typeof element = element;

        // A ```math block replaces its <pre> and is display maths
        if (element.tagName === 'code' && languageMath && parent?.type === 'element' && parent.tagName === 'pre') {
            scope = parent;
            parent = parents[parents.length - 2];
            displayMode = true;
        }
        if (!parent) return;

        const tex = toText(scope, { whitespace: 'pre' });
        const index = parent.children.indexOf(scope as ElementContent);
        parent.children.splice(index, 1, ...render(tex, displayMode));
        return SKIP;
    });
}
