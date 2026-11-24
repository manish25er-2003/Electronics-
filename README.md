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

## Product catalog API (optional)

The storefront can use a separate REST API for shared product data, admin
authentication, and image uploads. This repository does not include that
backend or a database. Without an API URL, product changes use browser
`localStorage` only and are not shared across browsers or devices.

Set `VITE_PRODUCT_API_BASE_URL` to the HTTPS base URL of your API:

- Local development: put the value in an ignored `.env.local` file.
- Cloudflare Pages: add it under **Settings → Environment variables** for both
  Production and Preview, then trigger a new deployment.
- `.env.example` contains the variable name only. Never put Cloudinary secrets,
  database credentials, or other private keys in `VITE_*` variables; Vite
  exposes those values to browsers.

The API must support these routes (all JSON responses should use the
`Content-Type: application/json` header):

| Method and path | Behavior |
| --- | --- |
| `GET /products` | Public, published products as an array or `{ "products": [] }`. |
| `GET /admin/session` | Return `{ "authenticated": true }` only for a valid admin session. |
| `GET /admin/products` | Return the complete inventory to an authenticated admin. |
| `POST /products` | Create a product; return the created product, including its `id`. |
| `PATCH /products/:id` | Update a product; preserve image fields unless explicitly changed. |
| `DELETE /products/:id` | Delete a product; `204 No Content` is supported. |
| `POST /admin/products/images` | Authenticated multipart form with `file`; return `{ "url": "https://..." }`. |

Use secure, HTTP-only session cookies and configure API CORS to allow the
storefront origin with credentials. The backend must enforce authorization on
every admin read, write, and image-upload route, and must filter unpublished
products from the public endpoint. Hiding admin UI in React is not an
authorization boundary.

For Cloudinary, keep the API secret on the backend. The backend should validate
image type/size, create a signed upload, and return the resulting HTTPS image
URL. Product records should include `name`, `brand`, `category`, `price`,
optional `discountPrice`, `shortDescription`, `description`, `specs` (string
array), `availabilityStatus`, `image`, optional `images` (URL array),
`isFeatured`, and `published`. The API is not end-to-end verifiable until a
compatible backend and its credentials are configured.

The Cloudflare project must be created as **Pages**, not **Workers**.
Do not set a custom deploy command or add `wrangler.toml`/`wrangler.jsonc`
for this static Vite site. If the dashboard currently shows a `workers.dev`
deployment URL, change the Git integration project to a Pages project or
create a new Pages project for this GitHub repository.
