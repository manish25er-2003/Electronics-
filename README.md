# Verma Electronics React App

## Local development

Use Node.js 20.19 or newer.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Cloudflare Pages

- Framework preset: `React (Vite)`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Production branch: `main`
- Node.js version: `20.19.0` or newer

No environment variables or secrets are required by the current application.

The Cloudflare project must be created as **Pages**, not **Workers**.
Do not set a custom deploy command or add `wrangler.toml`/`wrangler.jsonc`
for this static Vite site. If the dashboard currently shows a `workers.dev`
deployment URL, change the Git integration project to a Pages project or
create a new Pages project for this GitHub repository.
