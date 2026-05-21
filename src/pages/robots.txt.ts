import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(`User-agent: *
Allow: /

Sitemap: https://www.talleywealth.com/sitemap.xml
`, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
