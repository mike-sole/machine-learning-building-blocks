/// <reference types="vitest/config" />
import { defineConfig, runnerImport, type Plugin, type ResolvedConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), postPages()],
  base: '/machine-learning-building-blocks/',
  test: {
    include: ['src/**/*.test.ts'],
  },
})
