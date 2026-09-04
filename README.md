# Personal Portfolio with AI Assistant

A personal portfolio web application with an integrated AI assistant, built with **React**, **TypeScript**, **Three.js** and **Tailwind CSS**. It showcases my academic and professional journey — skills, education and experience — and features an interactive 3D avatar rendered with Three.js.

**Live demo:** [vallabh-portfolio777.netlify.app](https://vallabh-portfolio777.netlify.app)

## Features

- **AI Assistant** — an in-page assistant backed by Groq (`openai/gpt-oss-120b`) that answers questions about my background. The API key stays server-side in a Netlify Function.
- **3D Avatar** — an animated avatar rendered with Three.js / React Three Fiber.
- **Responsive design** — verified with no horizontal overflow from 320px through 1920px.
- **Accessible** — keyboard-navigable, labelled controls, visible focus, and honours `prefers-reduced-motion`.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in GROQ_API_KEY
netlify dev            # serves the site *and* the assistant function
```

`npm run dev` also works and is faster, but Vite alone does not run the function,
so the assistant needs `VITE_GROQ_API_KEY` in `.env` to talk to Groq directly.
That path is dev-only — see Configuration.

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

Copy `.env.example` to `.env`.

**`GROQ_API_KEY`** — no `VITE_` prefix, so Vite never compiles it into the client
bundle. Only `netlify/functions/chat.mts` reads it; the browser posts to
`/api/chat` on its own origin and never sees a credential. On Netlify, set it
under *Site configuration → Environment variables*.

Do **not** set `VITE_GROQ_API_KEY` on Netlify. Anything `VITE_`-prefixed is
compiled into the bundle and readable in devtools — that is how the key used to
leak. It is supported for local `npm run dev` only, behind an
`import.meta.env.DEV` guard that strips the branch from production builds.

To confirm nothing leaks after a change:

```bash
npm run build
grep -r "gsk_\|api.groq.com" dist/   # must return nothing
```

### The assistant function

`netlify/functions/chat.mts` serves `POST /api/chat`. It injects the system prompt
server-side (so the endpoint cannot be repurposed as a free LLM), caps the payload
at 20 turns / 20k characters, rejects foreign `Origin`s, and walks a model
fallback chain — Groq retires model ids without notice, which is what took the
assistant offline when `llama-3.3-70b-versatile` was decommissioned.

If the assistant ever fails, check which models Groq still serves:

```bash
curl -s https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY" | grep -o '"id":"[^"]*"'
```

## Technologies

React · TypeScript · Vite · Tailwind CSS · Three.js · React Three Fiber · drei · Groq · EmailJS
