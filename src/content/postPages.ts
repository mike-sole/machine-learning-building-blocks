import { posts, getPostPath, type BlogPost } from './posts';

export const SITE_TITLE = 'Machine Learning Building Blocks';

/** Where the site is deployed. Open Graph and canonical links need absolute URLs. */
export const SITE_URL = 'https://mike-sole.github.io/machine-learning-building-blocks';

/** The thumbnails are all square, at this size. */
const THUMBNAIL_SIZE = 1024;

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

/** The absolute URL of a post's page. The legacy /post/<id> copy points here too, so it isn't counted as a duplicate. */
export const postUrl = (post: BlogPost): string => `${SITE_URL}${getPostPath(post)}`;

/** The home page's own description, link preview and canonical tags, which each post page replaces with its own. */
const SITE_TAGS = /^[ \t]*<(?:meta (?:name|property)="(?:description|og:[^"]*|twitter:[^"]*)"|link rel="canonical")[^>]*>[ \t]*\r?\n/gm;

/** index.html with the post's own title, description, URL and thumbnail, so search results and link previews show the post. */
export function postHtml(indexHtml: string, post: BlogPost): string {
    const title = escapeHtml(`${post.title} | ${SITE_TITLE}`);
    const description = escapeHtml(post.description);
    const url = escapeHtml(postUrl(post));
    const image = post.thumbnail && [
        `<meta property="og:image" content="${escapeHtml(SITE_URL + post.thumbnail)}" />`,
        `<meta property="og:image:width" content="${THUMBNAIL_SIZE}" />`,
        `<meta property="og:image:height" content="${THUMBNAIL_SIZE}" />`,
        `<meta property="og:image:alt" content="${escapeHtml(post.title)}" />`,
    ];
    const head = [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="article" />`,
        `<meta property="og:site_name" content="${SITE_TITLE}" />`,
        `<meta property="og:title" content="${escapeHtml(post.title)}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:url" content="${url}" />`,
        ...(image || []),
        `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    ].join('\n  ');
    if (!/<title>[^<]*<\/title>/.test(indexHtml)) throw new Error('index.html has no <title> to replace');
    return indexHtml.replace(SITE_TAGS, '').replace(/<title>[^<]*<\/title>/, () => head);
}

/** Every post page to write next to the built index.html. */
export const postPages = (indexHtml: string): PostPage[] =>
    posts.flatMap(post => postFiles(post).map(file => ({ file, html: postHtml(indexHtml, post) })));
