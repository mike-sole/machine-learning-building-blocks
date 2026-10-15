/** Every piece of maths in the posts, rendered by KaTeX at build time (see vite.config.ts). */
declare module 'virtual:post-math' {
    const html: Record<string, string>;
    export default html;
}
