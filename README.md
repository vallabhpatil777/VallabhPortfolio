# Personal Portfolio with AI Assistant

A personal portfolio web application with an integrated AI assistant, built with **React**, **TypeScript**, **Three.js** and **Tailwind CSS**. It showcases my academic and professional journey — skills, education and experience — and features an interactive 3D avatar rendered with Three.js.

**Live demo:** [vallabh-portfolio777.netlify.app](https://vallabh-portfolio777.netlify.app)

## Features

- **AI Assistant** — an in-page assistant backed by Groq's Llama 3.3 that answers questions about my background.
- **3D Avatar** — an animated avatar rendered with Three.js / React Three Fiber.
- **Responsive design** — verified with no horizontal overflow from 320px through 1920px.
- **Accessible** — keyboard-navigable, labelled controls, visible focus, and honours `prefers-reduced-motion`.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in VITE_GROQ_API_KEY
npm run dev
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and produce a production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run assets:images` | Re-encode `src/assets` rasters to sized WebP (needs Python + Pillow) |
| `npm run assets:model` | Re-compress the avatar GLB — `... <input.glb> <output.glb>` |
| `npm run assets:draco` | Refresh `public/draco/` from the installed `three` version |

## Performance notes

The critical path is deliberately small. Everything heavy is behind a dynamic
`import()`, so the first paint only needs the entry chunk, React and the CSS.

| | Before | After |
| --- | --- | --- |
| Critical-path JS + CSS (gzip) | 567 kB | 70 kB |
| Total build output | 51.5 MB | 4.4 MB |
| Avatar model | 12.5 MB | 2.0 MB |
| DOMContentLoaded (Slow 4G) | 3154 ms | 687 ms |

Things worth knowing before changing the build:

- **`three` must stay dynamically imported.** `src/Components/MiddlePart/Avatar3D.tsx`
  is only reached through `React.lazy`. If anything imports it statically, ~790 kB
  of Three.js moves onto the critical path.
- **Virtual helpers are pinned in `vite.config.ts`.** Rollup's shared runtime
  helpers must not land inside a lazy vendor chunk — if they do, the entry chunk
  statically imports that whole chunk and the lazy loading silently stops working.
  The `manualChunks` comment explains it; there is a check below to catch it.
- **`assetsInlineLimit` is 0** on purpose, so lazy images are not base64-inlined
  into the entry chunk.
- **The avatar GLB carries no morph targets.** The Avaturn export contained 187
  unused facial blendshapes (~6.4 MB). `scripts/optimize-model.mjs` strips them and
  refuses to run if any animation actually drives morph weights.

To confirm the critical path after a dependency change:

```bash
npm run build
grep -oE '(src|href)="/assets/[^"]*\.(js|css)"' dist/index.html
```

That should list only the entry chunk, the `react` chunk and the stylesheet. If a
`three`-sized chunk appears there, the lazy loading has regressed.

## Configuration

Copy `.env.example` to `.env`. Note that `VITE_`-prefixed variables are compiled
into the client bundle and are visible to anyone who opens devtools — the Groq key
is exposed by design in this browser-only setup. For anything beyond a personal
demo key, proxy the Groq call through a small serverless function.

## Technologies

React · TypeScript · Vite · Tailwind CSS · Three.js · React Three Fiber · drei · Groq · EmailJS
