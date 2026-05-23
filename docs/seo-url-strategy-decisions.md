# Talley Wealth SEO URL Strategy Decisions

_Last updated: May 23, 2026_

## Purpose

This document is the working decision record for Talley Wealth's URL, sitemap, redirect, and indexation strategy. It exists so the technical cleanup does not lose the marketing strategy underneath it.

The goal is not to make the site as large as possible. The goal is to make the public URL set feel intentional, useful, and worthy of being indexed.

## Positioning Rules

Talley Wealth should be positioned around the client problems people actually feel:

- Retirement is getting close and they want to know what life could actually look like.
- Business income has grown and taxes feel too important to handle reactively.
- Inherited money, equity compensation, or a major transition has made the next decisions feel bigger.
- They are tired of investment-only advice and want a real planning relationship.
- They want a person who can help them think clearly, make decisions, and get the important work done.

"Coordination" is an internal description of the value. It is true, but it usually should not be the lead message because most prospects do not arrive saying they want better coordination. They arrive with questions, uncertainty, complexity, tax pain, retirement timing concerns, or the desire for someone real to help.

## Sitemap Rules

A URL should be in the sitemap only if it is strong enough to represent Talley Wealth in search today.

Include:

- Core brand and conversion pages.
- Keystone/process pages.
- Core service pages.
- Strong persona pages.
- Strong David-voice blog posts.
- Primary local pages with real local relevance.
- Select service-city pages only when the local modifier changes the planning issue in a meaningful way.

Exclude:

- Utility pages.
- Thank-you/download pages.
- Internal index pages.
- Generic learning-center articles until they are upgraded.
- Legal pages unless there is a compliance reason to submit them.
- Borderline local pages until they are reviewed individually.

## Redirect Rules

Use a 301 redirect when an old URL has a clear modern equivalent. Preserve old equity by sending it to the strongest current page that satisfies the same intent.

Use noindex when a page is useful to users but not intended to rank.

Use a 404 or 410 only when the URL has no useful equivalent and should not be preserved.

## Current Pass 1 Scope

This pass is intentionally conservative.

Do now:

- Make `/seo-index` noindex.
- Make utility/campaign pages noindex where appropriate.
- Make `/learn/*` noindex until selected articles are rewritten with David/Talley point of view.
- Redirect obvious stale URLs with direct replacements.
- Redirect `/calculator` to `/calculators`.
- Add direct tenant URL redirects where safe so `/brands/talley-wealth/...` does not create duplicate public pages.
- Keep the sitemap focused and avoid adding borderline local pages.

Do not decide yet:

- Whether Abingdon, Erwin, Greeneville, and Southwest Virginia should remain in the submitted sitemap long term.
- Whether Johnson City service-specific pages should be built as canonical pages.
- Whether broader markets like Knoxville, Asheville, Sevierville, and Morristown should be pursued.
- Whether the Learning Center becomes a major SEO asset.

## Local Page Inclusion Rule

A local page should be indexed only if at least one of these is true:

- Talley Wealth has real local trust, history, clients, or relationships there.
- The location creates a distinct planning issue, such as Bristol TN/VA or Southwest Virginia/Tennessee tax questions.
- Search demand is meaningful and the page is strong enough to satisfy that intent.
- The page has specific proof, examples, and language that do not feel templated.

If the page is mostly swapped city names, employer lists, and generic planning language, keep it out of the sitemap until improved.

## Services Hub Language Rule

A services hub is valuable, but it should not lead with "coordination" as the prospect-facing pain.

Better public framing:

- "Services"
- "How We Help"
- "Financial Planning Services"
- "Planning, Tax, and Investment Services"

Possible headline direction:

"Planning, tax, and investment advice for the decisions you do not want to keep carrying alone."

## Near-Term Improvement Priorities

After Pass 1:

1. Decide whether `/about/our-commitment` should remain a real trust page. Current preference: yes, make it real if it supports confidence and fit.
2. Build a real services hub with prospect-facing language.
3. Review local pages one by one: Johnson City, Bristol, Kingsport, Tri-Cities first; then Southwest Virginia, Abingdon, Greeneville, Erwin.
4. Upgrade selected Learning Center articles into David-voice answer pages before indexing them.
5. Build focused content around business-owner tax planning, pre-retirement tax planning, inherited wealth, and equity compensation.
6. Update or remove `/resources/key-dates`; if kept, it must stay current.

## Notes For Joe / CloudWise

The current live site appears to be serving a broader sitemap than the intended local sitemap. Before submitting to Google Search Console or Bing Webmaster Tools, confirm the deployed build is using the same sitemap and middleware source as the approved local/GitHub version.

The cleanup should be deployed first, then verified live, then submitted to search engines.
