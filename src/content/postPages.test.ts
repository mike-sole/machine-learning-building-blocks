import { describe, expect, it } from 'vitest';
import { posts, getPostPath } from './posts';
import { SITE_URL, postFiles, postHtml, postPages } from './postPages';
import indexHtml from '../../index.html?raw';

const INDEX = '<!doctype html>\n<html>\n<head>\n  <title>Machine Learning Building Blocks</title>\n</head>\n<body><div id="root"></div></body>\n</html>';

/** The tag's attribute value, e.g. content of <meta property="og:url">. */
const attr = (html: string, tag: RegExp, name: string): string[] =>
    [...html.matchAll(new RegExp(`<${tag.source}[^>]*>`, 'g'))].map(m => m[0].match(new RegExp(`${name}="([^"]*)"`))![1]);
const meta = (html: string, key: string) => attr(html, new RegExp(`meta (?:name|property)="${key}"`), 'content');

/** The thumbnails deployed with the site, as paths from the site root, e.g. /thumbnails/x.jpg */
const thumbnails = Object.keys(import.meta.glob('../../public/thumbnails/*')).map(f => f.replace('../../public', ''));

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

    it('links every page, including the legacy copy, to the post\'s dated URL', () => {
        const pages = postPages(INDEX);
        for (const post of posts) {
            const url = `${SITE_URL}${getPostPath(post)}`;
            for (const file of postFiles(post)) {
                const { html } = pages.find(p => p.file === file)!;
                expect(meta(html, 'og:url')).toEqual([url]);
                expect(attr(html, /link rel="canonical"/, 'href')).toEqual([url]);
            }
        }
    });

    it('shows every post\'s thumbnail in link previews, as an absolute URL to a .jpg in public/', () => {
        for (const post of posts) {
            const html = postHtml(INDEX, post);
            const [image] = meta(html, 'og:image');
            expect(image.startsWith(`${SITE_URL}/thumbnails/`)).toBe(true);
            // The thumbnails are JPEG; scrapers that check the type drop an image served as image/png
            expect(image).toMatch(/\.jpg$/);
            expect(thumbnails).toContain(image.slice(SITE_URL.length));
            expect(meta(html, 'og:image:width')).toEqual(['1024']);
            expect(meta(html, 'og:image:height')).toEqual(['1024']);
            expect(meta(html, 'twitter:card')).toEqual(['summary_large_image']);
        }
    });

    it('replaces the home page\'s own description, link preview and canonical tags', () => {
        expect(meta(indexHtml, 'og:url')).toEqual([`${SITE_URL}/`]);
        const post = posts[0];
        const html = postHtml(indexHtml, post);
        expect(meta(html, 'description')).toEqual([post.description]);
        expect(meta(html, 'og:type')).toEqual(['article']);
        expect(meta(html, 'og:title')).toEqual([post.title]);
        expect(meta(html, 'og:url')).toEqual([`${SITE_URL}${getPostPath(post)}`]);
        expect(meta(html, 'twitter:card')).toEqual(['summary_large_image']);
        expect(attr(html, /link rel="canonical"/, 'href')).toHaveLength(1);
        expect(html).toContain('<meta charset="UTF-8" />');
    });
});
