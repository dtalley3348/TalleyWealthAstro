# Pass 2 SEO Crawl Report

Date: 2026-05-23
Preview tested: http://localhost:5181

## Result
- Build passes.
- Astro check passes with 0 errors, 0 warnings, 0 hints.
- Sitemap contains 48 submitted URLs.
- All 48 submitted URLs return 200 on the built preview.
- No noindex URLs are submitted in the sitemap.
- Public pages checked have titles, meta descriptions, canonicals, and one H1.
- Old URL redirects tested return 301 to their clean destinations.
- Direct /brands/talley-wealth page URLs now 301 to public URLs.
- /brands/talley-wealth asset URLs still return 200 for images and PDFs.
- Robots.txt returns 200 and points to https://talleywealth.com/sitemap.xml.

## Fixes Made
- Changed dynamic tenant routes back to server-rendered routes so middleware rewrites work on clean public URLs.
- Removed stale getStaticPaths helpers/imports from server-rendered learning-center pages.
- Added page-only redirects from /brands/talley-wealth/* to the public URL equivalents while preserving asset/PDF access.
- Kept /services/keystone-plan redirected to /how-we-work/keystone-method.

## Conversion And Utility Checks
- /api/talley/contact accepts local smoke-test submissions when no platform API is configured.
- /api/register accepts local smoke-test submissions when no platform API is configured.
- /api/newsletter/subscribe rejects invalid emails with 400, confirming validation is active.
- /resources/portal, /guide-download, /explore-call-read, /privacy, and /terms are noindex/follow and not submitted in sitemap.

## Remaining For Pass 3
- Optimize large image assets.
- Review homepage and core conversion path copy/design.
- Review services, who-we-help, pricing, get-started, and contact for launch quality.
- Decide whether noindex learning-center pages should stay noindex or become indexable after deeper content review.
