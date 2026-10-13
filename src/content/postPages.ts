import { posts, getPostPath, type BlogPost } from './posts';

export const SITE_TITLE = 'Machine Learning Building Blocks';

/** A copy of the built index.html written at a post's URL, so GitHub Pages serves it with status 200 rather than 404.html. */
export interface PostPage {
    /** Where the page goes, relative to the build output directory */
    file: string;
    html: string;
}

const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The build output files a post is served from: its dated URL, and the legacy /post/<id> link. */
export const postFiles = (post: BlogPost): string[] => [
    getPostPath(post).slice(1),
    `post/${post.id}/index.html`,
];

/** index.html with the post's own title and description, so search results and link previews show the post. */
export function postHtml(indexHtml: string, post: BlogPost): string {
    const title = escapeHtml(`${post.title} | ${SITE_TITLE}`);
    const description = escapeHtml(post.description);
    const head = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}" />`,
        `<meta property="og:type" content="article" />`,
        `<meta property="og:site_name" content="${SITE_TITLE}" />`,
        `<meta property="og:title" content="${escapeHtml(post.title)}" />`,
        `<meta property="og:description" content="${description}" />`,
    ].join('\n  ');
    if (!/<title>[^<]*<\/title>/.test(indexHtml)) throw new Error('index.html has no <title> to replace');
    return indexHtml.replace(/<title>[^<]*<\/title>/, () => head);
}

/** Every post page to write next to the built index.html. */
export const postPages = (indexHtml: string): PostPage[] =>
    posts.flatMap(post => postFiles(post).map(file => ({ file, html: postHtml(indexHtml, post) })));
