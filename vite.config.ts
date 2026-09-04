import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Packages pinned into the shared `react` chunk.
 *
 * Everything else is deliberately left to Rollup: a package reached only through
 * a dynamic `import()` (three.js, markdown-it, EmailJS) then gets emitted inside
 * that lazy chunk along with its transitive dependencies. Hand-listing the vendor
 * split instead put fiber's own dependencies — react-reconciler, zustand,
 * its-fine — into an eagerly loaded chunk, quietly dragging ~100 kB back onto the
 * critical path.
 */
const REACT_PACKAGES = ['react', 'react-dom', 'scheduler']

/**
 * Virtual runtime modules Rollup/Vite synthesise. They are shared between the
 * entry and the lazy chunks, and if Rollup parks them inside a lazy vendor chunk
 * the entry ends up statically importing that whole chunk — which is how ~790 kB
 * of three.js silently became a render-blocking download. Pinning them next to
 * React keeps the lazy chunks genuinely lazy.
 */
const VIRTUAL_HELPERS = [
  'vite/preload-helper',
  'vite/modulepreload-polyfill',
  'commonjsHelpers',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    // Compressed-size reporting gzips every chunk; skipping it keeps builds quick.
    reportCompressedSize: false,
    // Do not inline images as base64. Every skill/project image is `loading="lazy"`
    // and below the fold; inlining them would move ~65 kB of icon bytes into the
    // entry chunk, where they block first paint and cannot be cached separately.
    assetsInlineLimit: 0,
    // The three.js chunk is ~790 kB minified, but it is dynamically imported and
    // only fetched once the hero avatar actually renders.
    chunkSizeWarningLimit: 950,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Rollup ids use OS separators on Windows; normalise before matching.
          const path = id.split('\\').join('/')

          if (VIRTUAL_HELPERS.some((helper) => path.includes(helper))) return 'react'
          if (!path.includes('/node_modules/')) return

          const packageName = path.split('/node_modules/').pop()?.split('/')[0]
          if (packageName && REACT_PACKAGES.includes(packageName)) return 'react'
        },
      },
    },
  },
})
