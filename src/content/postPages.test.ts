import { describe, expect, it } from 'vitest';
import { posts, getPostPath } from './posts';
import { postFiles, postHtml, postPages } from './postPages';

const INDEX = '<!doctype html>\n<html>\n<head>\n  <title>Machine Learning Building Blocks</title>\n</head>\n<body><div id="root"></div></body>\n</html>';

describe('post pages', () => {
    it('writes a page at every post\'s dated path and legacy /post/<id> path', () => {
        const files = postPages(INDEX).map(p => p.file);
        for (const post of posts) {
            expect(files).toContain(getPostPath(post).slice(1));
            expect(files).toContain(`post/${post.id}/index.html`);
        }
        expect(new Set(files).size).toBe(files.length);
    });

    it('uses the dated path of the legacy Jekyll site', () => {
        const post = posts.find(p => p.id === 'the-perceptron-model')!;
        expect(postFiles(post)).toEqual(['2026/01/03/the-perceptron-model.html', 'post/the-perceptron-model/index.html']);
    });

    it('gives each page the post\'s title and description, escaped', () => {
        const html = postHtml(INDEX, { id: 'x', title: 'A & B', date: 'Jan 1, 2026', description: 'Say "hi" <now>', content: '' });
        expect(html).toContain('<title>A &amp; B | Machine Learning Building Blocks</title>');
        expect(html).toContain('<meta name="description" content="Say &quot;hi&quot; &lt;now&gt;" />');
        expect(html).toContain('<meta property="og:title" content="A &amp; B" />');
        expect(html).toContain('<div id="root"></div>');
        expect(html.match(/<title>/g)).toHaveLength(1);
    });
});
