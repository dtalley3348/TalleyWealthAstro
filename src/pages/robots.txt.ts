import type { APIRoute } from 'astro';

export const GET: APIRoute = () => new Response(`# Talley Wealth robots policy
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /assessment-result/
Allow: /

Sitemap: https://talleywealth.com/sitemap.xml
`, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
