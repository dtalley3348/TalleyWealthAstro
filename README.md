# Talley Wealth Astro Tenant

This repo is the extracted Talley Wealth tenant site from the Tri-Cities platform.

The tenant source keeps the same paths used by the platform:

- `src/pages/brands/talley-wealth/`
- `src/components/talley-wealth/`
- `src/styles/talley-wealth/`
- `src/data/talley-wealth/`
- `public/brands/talley-wealth/`

The wrapper files make the tenant editable and buildable without cloning the full platform.

## Local Work

```bash
npm install
npm run dev
```

Open `http://localhost:4321/`. Middleware rewrites root URLs to the Talley tenant pages, so `/about` works locally while the source still lives at `src/pages/brands/talley-wealth/about.astro`.

## Platform Compatibility

Do not move the tenant folders unless the platform is changed too. The sync boundary is the folder set above.

Forms use local compatibility API routes:

- `/api/talley/contact`
- `/api/newsletter/subscribe`
- `/api/register`

By default those routes return local success responses for editing. Set `PLATFORM_API_BASE_URL` to proxy submissions to the platform during integration testing.
