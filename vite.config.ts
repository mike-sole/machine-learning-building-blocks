/// <reference types="vitest/config" />
import { defineConfig, runnerImport, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { renderPostMath } from './src/content/math/renderPostMath'

/**
 * GitHub Pages only serves real files, so without these a post URL falls back to 404.html and is
 * served with status 404 (#56). Write a copy of index.html at every post's URL, with the post's title
 * and description.
 */
function postPages(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'post-pages',
    apply: 'build',
    configResolved(resolved) {
      config = resolved
    },
    async closeBundle() {
      const outDir = resolve(config.root, config.build.outDir)
      const indexHtml = await readFile(join(outDir, 'index.html'), 'utf8')
      // The posts import their Markdown with ?raw, so load them through Vite rather than Node
      const { module } = await runnerImport<{ postPages: (html: string) => { file: string; html: string }[] }>(
        resolve(config.root, 'src/content/postPages.ts'),
        { configFile: false, root: config.root, logLevel: 'error' },
      )
      const pages = module.postPages(indexHtml)
      for (const page of pages) {
        const file = join(outDir, page.file)
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, page.html)
      }
      config.logger.info(`post-pages: wrote ${pages.length} post pages`)
    },
  }
}

/**
 * Renders the posts' maths with KaTeX at build time and serves the HTML as `virtual:post-math`, so
 * readers' browsers only need KaTeX's CSS and fonts, not its JavaScript.
 */
function postMath(): Plugin {
  const id = 'virtual:post-math'
  const resolvedId = '\0' + id
  let blogDir: string
  return {
    name: 'post-math',
    configResolved(config) {
      blogDir = resolve(config.root, 'src/content/blog')
    },
    resolveId(source) {
      if (source === id) return resolvedId
    },
    async load(loadId) {
      if (loadId !== resolvedId) return
      const files = (await readdir(blogDir)).filter(file => file.endsWith('.md')).map(file => join(blogDir, file))
      const posts = await Promise.all(files.map(file => {
        this.addWatchFile(file)
        return readFile(file, 'utf8')
      }))
      return `export default ${JSON.stringify(renderPostMath(posts))}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), postPages(), postMath()],
  build: {
    rollupOptions: {
      // Mafs imports KaTeX for a LaTeX component the charts don't use, and KaTeX doesn't declare
      // itself free of side effects, so without this its 265 kB of JavaScript ships with the charts.
      // Its CSS, which every page needs, is left alone.
      treeshake: {
        moduleSideEffects: id => !(id.includes('/node_modules/katex/') && !id.endsWith('.css')),
      },
      output: {
        // The prerendered maths is mostly KaTeX's markup and would push the post chunk past the
        // 500 kB warning; on its own it compresses well and stays cached until a post changes
        manualChunks(id) {
          if (id === '\0virtual:post-math') return 'post-math'
        },
      },
    },
  },
  base: '/machine-learning-building-blocks/',
  test: {
    include: ['src/**/*.test.ts'],
  },
})
