# Talley Wealth Website Assurance And Growth Game Plan

Last updated: June 1, 2026

## Purpose

The website should be treated as a trust and search foundation, not the entire growth engine. The current objective is to complete enough technical, indexing, and migration cleanup that the site can be watched for 30 days while the main creative effort moves back to repeatable video and content.

The goal is not to keep editing the website until rankings and leads are fully solved. The floor is website assurance. Ranking recovery is the scoreboard. Qualified Explore Calls are the business outcome.

## Solid Enough For Now

The website is solid enough for a 30-day watch period when all of the following are true:

- The deployed sitemap lists only canonical `https://talleywealth.com` URLs.
- Every sitemap URL returns a direct `200`.
- No sitemap URL is a redirect, `noindex`, old `www`, campaign/download page, legal utility page, tenant route, API route, or stale local variant.
- Priority legacy Talley Wealth URLs redirect with one 301 hop to a current canonical page.
- The old `mytalleyfinancial.com` homepage and high-value old URLs 301 to current Talley Wealth pages instead of serving a moved notice or duplicate content.
- Search Console uses the non-www sitemap as the active sitemap source.
- Priority pages can be inspected in Search Console as crawlable and canonical.

## Current Priority

For the next quarter, prioritize pre-retirees while still supporting local broad search and business-owner intent.

Primary search themes:

- Retirement timing and whether work can become optional.
- Roth conversions and multi-year tax windows.
- Retirement income, Social Security, Medicare, and withdrawal sequencing.
- Local retirement planning in Johnson City, Kingsport, Bristol, and the Tri-Cities.
- Tax-integrated planning for people whose investment, tax, estate, and income decisions are connected.

Do not build a large new page series until Search Console shows a clear gap. New pages should be added only when the page can answer a distinct human question better than an existing canonical page.

## Old Domain Migration

`mytalleyfinancial.com` should no longer serve a standalone "we moved" page. It should 301 directly into the current `talleywealth.com` site.

Recommended old-domain redirect defaults:

| Old URL pattern | Target |
|---|---|
| `/` | `https://talleywealth.com/` |
| `/financial-advisor-johnson-city-tn` and `/johnson-city-financial-advisor` | `https://talleywealth.com/financial-advisor-johnson-city-tn` |
| `/financial-advisor-kingsport-tn` | `https://talleywealth.com/financial-advisor-kingsport-tn` |
| `/financial-advisor-bristol-tn-va` | `https://talleywealth.com/financial-advisor-bristol-tn-va` |
| `/retirement-planning` | `https://talleywealth.com/services/retirement-planning` |
| `/financial-planning` | `https://talleywealth.com/services/financial-planning` |
| `/investment-management` | `https://talleywealth.com/services/investment-management` |
| `/tax-planning` and `/proactive-tax-planning` | `https://talleywealth.com/services/tax-planning` |
| `/business-owner-financial-planning` | `https://talleywealth.com/financial-advisor-for-business-owners` |
| `/learning-center` and `/learning-center/1` | `https://talleywealth.com/resources/learning-center` |
| old retirement, tax, investment, financial-planning city-service variants | strongest matching service page unless the city page is canonical |
| old financial-advisor city variants without a current canonical page | `https://talleywealth.com/financial-advisor-tri-cities-tn` |

If the old domain is pointed to this Astro app, the middleware now handles these redirects at the application level. If GoDaddy or another host is still serving the old site, recreate the same 301 map there. In that case, GoDaddy is the live control point and the app-level redirect map is the reference copy, not the active redirect layer.

## 30-Day Watch

During the watch period, track:

- Search Console indexed pages and not-indexed reason buckets.
- Sitemap last-read date and discovered URL count.
- Top queries, clicks, impressions, CTR, and average position.
- Priority page impressions for pre-retiree, retirement planning, Roth conversion, and local financial advisor terms.
- Explore Call form submissions, phone clicks, and Google Business Profile actions.
- Whether old `mytalleyfinancial.com` URLs disappear or consolidate into current Talley Wealth URLs.

Default posture during the watch period:

- Fix genuine crawl/indexing problems.
- Do not reopen site structure for vague anxiety.
- Shift most creative effort to video prompts, recording, repurposing, and distribution.

## Selective Authority Building

Authority building should be selective and credible, not a generic backlink campaign.

Start with:

- Local publications and business/community features.
- Podcast, newsletter, webinar, or workshop appearances.
- Professional directory cleanup and local citations.
- Google Business Profile posts from video content.
- Repurposed David-voice articles from strong videos.
- Local partnerships that naturally mention Talley Wealth.

Escalate into a more aggressive PR/backlink campaign only if the site is technically clean, indexed, and still stuck on impressions/rankings after the watch period.
