# Talley Wealth Packaging Site Map

Last updated: 2026-06-17

This is the first implementation map for `docs/packaging-infrastructure-plan.md`.

Use this before editing pages, creating content batches, or changing Keystone proposal language. It answers: where does each current page sit inside the package architecture, and what should happen next?

## Package Labels

- `RET`: Tax-smart retirement planning
- `BO`: Business owner profit-to-wealth planning
- `ROTH`: Roth conversion and retirement tax-window planning, nested under retirement
- `GLOBAL`: firm/process/pricing/trust page
- `SECONDARY`: valid entry point, but not a primary public market
- `LOCAL`: city or local SEO page

## Action Labels

- `Keep`: already fits the architecture well.
- `Light refine`: mostly right; preserve the current voice and change only routing, labels, related links, or small clarifying copy.
- `Refine`: useful page exists, but the page may need clearer package linking, structure, or supporting sections.
- `Build`: missing page, tool, or asset.
- `Extract`: source material already exists, but it needs to be turned into a clearer public page, referral asset, or reusable content piece.
- `Nest`: keep the page, but make its relationship to a primary package clearer.
- `Measure`: important page for tracking conversion behavior.

## Current Asset Existence Map

This section is meant to prevent accidental overbuilding. Some of the assets below already exist in a strong form. The right move is not to rewrite them into a new voice. The right move is to make the architecture around them easier to understand.

| Asset | Public status | Current source | What exists now | Recommended action |
| --- | --- | --- | --- | --- |
| Retirement flagship offer | Exists | `/financial-advisor-for-pre-retirees` | Strong public page already written in the right general voice. It already carries the "five years before and after retirement" idea, the five retirement questions, Roth/tax-window language, paycheck-after-work language, healthcare, Social Security, investment risk, and spouse/family continuity. | `Light refine`: preserve voice. Add better related-resource routing and make Roth/tax-window clearly nested underneath this lane. |
| Business-owner flagship offer | Exists | `/financial-advisor-for-business-owners` | Strong public page already written around business-owner profit-to-wealth planning. It already covers owner pay, tax, retirement plans, business cash, household planning, concentration risk, and exit/succession. | `Light refine`: preserve voice. Add better related-resource routing and make owner-pay/retirement-plan/cash-to-household topics easier to follow. |
| Roth conversion / retirement tax-window page | Exists | `/roth-conversions-before-retirement-tri-cities-tn` | Strong public decision page with a clear point of view and interactive planning visual. The page is valuable, but it should read as a retirement decision cluster, not a third equal market. | `Nest`: keep the page. Add "part of Tax-Smart Retirement Planning" signals, retirement-page links, and related retirement-tax-window resources. |
| Five retirement questions | Exists as page + section | `/five-retirement-questions-before-you-retire`; `/financial-advisor-for-pre-retirees`; Learning Center section | The raw asset is now a COI-forwardable page and still appears in the retirement flagship and Learning Center. | `Refine / distribute`: next step is PDF/email/social versions, not another rewrite. |
| Retirement paycheck planning | Exists | `/retirement-paycheck-planning-tri-cities-tn`; `/workshop` remains noindex event/registration material | The evergreen decision page now carries the seminar thesis: spending, income sources, guardrails, bucketing, tax sequence, Social Security, and life-use risk. | `Refine / expand`: add visuals or companion articles as the content engine grows. |
| Owner pay planning | Exists | `/owner-pay-planning-tri-cities-tn`; owner flagship, business tax, S-Corp, service/tool sections | The dedicated decision page now separates salary, distributions, pass-through tax misconceptions, reserves, tax estimates, and wealth outside the business. | `Refine / expand`: build supporting pieces around reserves, taxable accounts, and retirement-plan design. |
| Retirement plan design for owners | Partial | Business-owner flagship page, business-owner tax page, S-Corp page, advisory/service copy | Present as a supporting topic, but not packaged as its own decision page. | `Build later`: useful, but probably behind owner-pay and retirement-paycheck assets. |
| Business cash to household wealth | Partial | Business-owner flagship page, city owner pages, advisory/service copy | The idea is central to the package promise, but not isolated as a public page. | `Extract later`: likely a strong article/page once owner-pay structure is clearer. |
| Withdrawal order planning | Partial | Pre-retiree page, Roth page, local retirement pages, blog content | The idea exists throughout the retirement material, but not as one clean decision page. | `Build later`: natural retirement support page after retirement paycheck page. |
| Social Security / Medicare timing | Partial | Pre-retiree page, Medicare learning article, local retirement pages, early-retirement decision page | Strong supporting material exists. It is not yet one clean package-support page. | `Build later`: can be one combined page first, then split only if search/content volume justifies it. |
| IRMAA and retirement tax brackets | Partial | Roth page, pre-retiree page, Medicare references, early-retirement content | Present as a tax-window concern, especially around Roth and Medicare. | `Build later`: high-value supporting page, but should stay nested under retirement/Roth tax-window. |

## Implemented Packaging Pass: 2026-06-17

This pass updated the site structure without rewriting the main flagship pages.

- `/financial-advisor-for-pre-retirees` now routes related next steps toward retirement tax-window planning, early-retirement bridge planning, and retirement tools instead of local city pages.
- `/financial-advisor-for-business-owners` now routes related next steps toward business-owner tax planning, S-Corp/owner-pay planning, and the broader business-owner service page instead of local city pages.
- `/roth-conversions-before-retirement-tri-cities-tn` now carries a visible "Part of Tax-Smart Retirement Planning" parent signal and related links that route back to the retirement lane first.
- `/retirement-paycheck-planning-tri-cities-tn`, `/owner-pay-planning-tri-cities-tn`, and `/five-retirement-questions-before-you-retire` now exist as first support pages under the retirement and owner packages.
- `/services/retirement-planning` now routes related pages to the retirement flagship, retirement-paycheck page, and retirement tax-window page.
- `/services/business-owner-planning` now routes related pages to owner-pay planning, business-owner tax planning, and S-Corp planning.

Still not done:

- No PDF/email version of the five retirement questions has been built yet.
- No dedicated owner year-end planning checklist exists yet.
- No standalone withdrawal-order, Social Security/Medicare timing, or owner retirement-plan design page has been built yet.

## Voice Preservation Rule

For the two flagship pages, assume the existing page is the starting point and the voice should be protected.

Do not begin by rewriting the hero, recognition sections, or core problem narrative unless there is a specific mismatch. First look for smaller architectural changes:

- add a related decisions/tools section
- adjust an eyebrow or section title
- add a "part of this planning lane" line
- improve internal links
- add a short bridge into Keystone
- clarify whether a subtopic is a parent lane, child topic, or supporting article

If a page already sounds like David, the job is to make it easier to navigate, not make it sound more produced.

## Priority A: Lobby And Core Conversion Pages

These are the pages most responsible for making the site feel coherent after the front door.

| Page | Current role | Package | Current read | Needed action | CTA destination |
| --- | --- | --- | --- | --- | --- |
| `/` | Front door | GLOBAL | Strong current positioning around retirement, owners, and Roth/tax windows. | Refine only after package names are confirmed. | `/get-started`, `/how-we-work/what-to-expect` |
| `/who-we-help` | Planning Focus hub | GLOBAL | This is the actual lobby. It already shows hierarchy. | Strengthen related resources and package-path clarity. | primary offer pages, `/get-started` |
| `/financial-advisor-for-pre-retirees` | Retirement flagship entry point | RET | Already functions as the retirement offer page. Strong voice; do not treat as a blank rebuild. | Light refine: add clearer retirement-package routing and related resources. | `/get-started`, Keystone, related tools |
| `/financial-advisor-for-business-owners` | Business-owner flagship entry point | BO | Already functions as the owner offer page. Strong voice; do not treat as a blank rebuild. | Light refine: add clearer owner-package routing and related resources. | `/get-started`, Keystone Owner, business tax/S-Corp pages |
| `/roth-conversions-before-retirement-tri-cities-tn` | retirement decision-cluster page | ROTH / RET | High-intent decision page and tool home, but not a separate market. | Nest as flagship retirement tax-window page; add clearer retirement-package routing if needed. | `/get-started`, retirement page, tools |
| `/how-we-work/keystone-method` | Process/method layer | GLOBAL | Should stay visible, but should not be forced to explain market fit alone. | Refine links back to packages; keep Keystone as the engine. | `/get-started`, `/pricing` |
| `/pricing` | Engagement economics | GLOBAL | Recently updated; should explain Keystone as engagement structure, not a market. | Measure and lightly refine once package language settles. | `/get-started`, `/advisory-fees` |
| `/advisory-fees` | Ongoing advisory fee transparency | GLOBAL | Newly added; useful for trust and post-Keystone clarity. | Keep; add package-specific examples only if it stays clean. | `/pricing`, `/get-started` |
| `/resources/tools` | Tool library | GLOBAL | Strong proof layer but still broad. | Refine by tagging tools to packages. | package pages and tools |
| `/resources/learning-center` | Short answer library | GLOBAL | Good raw material for package content paths. | Nest articles by package and add package CTAs. | package pages |

## Priority B: Retirement Package Infrastructure

The retirement package should feel like a complete wing of the site, not one page plus scattered articles.

| Page or asset | Current role | Package | Needed action | Notes |
| --- | --- | --- | --- | --- |
| `/financial-advisor-for-pre-retirees` | flagship entry | RET | Light refine | Already owns the "five years before and after retirement" offer. Protect the current voice. |
| `/services/retirement-planning` | service page | RET | Refine | Link it clearly to the retirement package and Keystone. |
| `/can-i-retire-before-65-tri-cities-tn` | decision page | RET | Keep | Strong decision-cluster support for early retirement. |
| `/calculators` | calculator | RET | Refine | Make package path obvious from calculator output and follow-up CTA. |
| `/guide` | lead magnet | RET | Keep / Measure | Useful top-of-funnel retirement asset. |
| `/resources/blog/health-insurance-options-before-age-65` | article | RET | Keep | Strong pre-65 retirement support. |
| `/learn/retirement-planning/when-can-i-afford-to-retire` | learning article | RET | Keep | Should link to retirement offer page and calculator. |
| `/learn/retirement-planning/when-should-i-claim-social-security` | learning article | RET | Keep | Should link to retirement offer page. |
| `/learn/retirement-planning/medicare-what-i-need-to-know` | learning article | RET | Keep | Important for Medicare/IRMAA cluster. |
| `/retirement-paycheck-planning-tri-cities-tn` | decision/support page | RET | Keep / refine | Evergreen public page built from workshop and David ramble. Workshop remains a separate noindex event page. |
| withdrawal order planning page | partial decision support | RET | Build later | Should connect taxable, IRA, Roth, and tax brackets. Source material already appears across retirement/Roth content. |
| Social Security and Medicare timing page | partial decision support | RET | Build later | Could be one page first, then split only if useful. Source material already exists in retirement/local/learning pages. |
| IRMAA and retirement tax bracket page | partial decision support | RET / ROTH | Build later | Good bridge between retirement and Roth content. Source material exists, but not as a clean standalone page. |
| surviving spouse readiness page | partial decision support | RET | Build later | Highly human, good COI asset seed. Mentioned in the five retirement questions but not yet its own page. |
| `/five-retirement-questions-before-you-retire` | referral/support page | RET | Keep / distribute | COI-forwardable page exists. Next step is PDF/email/social variants. |

## Priority C: Business Owner Package Infrastructure

The business-owner package should make the business and household feel like one planning picture.

| Page or asset | Current role | Package | Needed action | Notes |
| --- | --- | --- | --- | --- |
| `/financial-advisor-for-business-owners` | flagship entry | BO | Light refine | Already owns "turning profit into personal wealth." Protect the current voice. |
| `/services/business-owner-planning` | service page | BO | Refine | Should route into owner package and Keystone Owner. |
| `/business-owner-tax-planning-tri-cities-tn` | decision page | BO | Keep | Strong owner tax planning page. |
| `/s-corp-planning-tri-cities-tn` | decision page | BO | Keep | Strong S-Corp decision page. |
| `/learn/s-corp-tax-savings-explained` | visual explainer | BO | Keep | Useful tool/explainer for owner-pay decisions. |
| `/learn/s-corp-explained` | article/explainer | BO | Keep | Companion content. |
| `/resources/blog/should-i-elect-s-corp-status` | article | BO | Keep | Strong long-form support. |
| `/owner-pay-planning-tri-cities-tn` | decision support | BO | Keep / refine | Dedicated page exists. Next support pages should probably cover owner reserves, retirement-plan design, or business cash-to-household wealth. |
| retirement plan design for owners page | partial decision support | BO | Build later | SEP/SIMPLE/401(k)/cash balance comparison, with fit boundaries. Source material exists as supporting copy. |
| business cash-to-household wealth page | partial offer support | BO | Extract later | Directly supports the package promise, but should probably follow owner-pay structure. |
| owner liquidity and reserves page | partial decision support | BO | Build later | Good practical planning topic. Some source material exists in owner cash-flow language. |
| exit readiness planning page | partial decision support | BO | Build later | Useful for owners, COIs, business brokers, attorneys. Already appears as an owner planning theme. |
| owner year-end planning checklist | referral/content asset | BO | Build | Good COI-forwardable asset. |

## Priority D: Retirement Decision Cluster: Roth And Retirement Tax Windows

Roth should remain a high-intent retirement decision cluster. It should not sit beside retirement and business owners as a third market.

| Page or asset | Current role | Package | Needed action | Notes |
| --- | --- | --- | --- | --- |
| `/roth-conversions-before-retirement-tri-cities-tn` | flagship retirement tax-window page | ROTH / RET | Keep / Measure | Current home for Roth conversion page and visual. |
| Roth Conversion Threshold Visual | interactive tool | ROTH | Keep | Should be reused carefully where it clarifies the decision. |
| `/services/tax-planning` | service page | ROTH / RET / BO | Refine | Tax planning is a support service, not a standalone market. |
| `/resources/blog/phantom-checkbox-roth-conversions` | article | ROTH | Keep | Strong POV article, but verify current policy references before republishing. |
| Roth conversion basics page | article / primer | ROTH | Build later | Lower-friction intro than the more advanced page. Not urgent while flagship page is strong. |
| year-by-year conversion pacing page | partial decision support | ROTH | Extract later | The current Roth page already argues for pacing. Could become a narrower page if useful. |
| IRMAA/Roth conversion page | partial decision support | ROTH / RET | Extract later | High search and planning relevance. Current Roth page already contains IRMAA logic. |
| RMD pressure and Roth page | partial decision support | ROTH / RET | Extract later | Good older pre-retiree/retiree asset. Current Roth page already contains RMD pressure logic. |
| Roth bad-fit FAQ | missing content module | ROTH | Build | Helps avoid overpromising and slop. Good near-term addition because it reinforces judgment. |
| Roth conversion checklist | referral/lead asset | ROTH | Build later | Could be used by COIs and paid search after retirement package routing is clear. |

## Priority E: Secondary Entry Points

These can remain valuable, but they should be nested under the architecture instead of competing with the two core markets.

| Page | Current role | Package | Needed action | Notes |
| --- | --- | --- | --- | --- |
| `/financial-advisor-for-inherited-wealth` | secondary persona | SECONDARY | Nest | Route into retirement, estate/family, or cross-lens planning based on context. |
| `/financial-advisor-for-executives-equity-comp` | secondary persona | SECONDARY | Nest | Good high-earner entry point; do not make it an equal homepage market. |
| `/financial-advisor-for-healthcare-professionals` | secondary persona | SECONDARY | Nest | Good local/professional page; keep secondary. |
| `/financial-advisor-for-kingsport-employer-benefits` | secondary/local entry | SECONDARY / LOCAL | Nest | Often retirement-adjacent through benefits and pension decisions. |
| city hub pages | local proof and SEO | LOCAL | Refine | City pages should route to RET, BO, or ROTH paths. |
| local pre-retiree pages | local-audience SEO | RET / LOCAL | Keep | Make sure they feed the retirement package. |
| local business-owner pages | local-audience SEO | BO / LOCAL | Keep | Make sure they feed the owner package. |

## Priority F: Process, Trust, And Support Pages

These should reinforce the packages without becoming package pages themselves.

| Page | Current role | Package | Needed action | Notes |
| --- | --- | --- | --- | --- |
| `/how-we-work/what-to-expect` | journey page | GLOBAL | Refine | Should show that different packages enter the same Keystone path. |
| `/how-we-work/ongoing-advisory` | post-Keystone service model | GLOBAL | Refine | Add examples by retirement and owner rhythm only if it improves clarity. |
| `/how-we-work/success-stories` | examples/composites | GLOBAL | Refine | Eventually group examples by package. |
| `/services` | service index | GLOBAL | Refine | Should show services as support underneath package doors. |
| `/about` | trust/about | GLOBAL | Keep | Should not become package-heavy. |
| `/about/meet-david-talley` | founder trust | GLOBAL | Keep | Preserve voice and story. |
| `/meet-the-team` | team trust | GLOBAL | Keep | No need to package heavily. |
| `/about/our-commitment` | trust/compliance | GLOBAL | Keep | Avoid unnecessary offer copy. |
| `/contact` | contact | GLOBAL | Keep | Measure CTA behavior if possible. |
| `/get-started` | Explore Call conversion | GLOBAL | Measure | Eventually add hidden package/source fields if traffic routing supports it. |

## Package-Aware Content Metadata

Every new content item should carry this minimal record:

```text
title:
source:
primary_package:
secondary_package:
entry_question:
audience:
funnel_stage:
format:
distribution_channels:
cta:
related_pages:
approval_status:
published_url:
```

Recommended primary package values:

- `retirement`
- `business-owner`
- `secondary`
- `global`
- `unclear`

Recommended secondary package / entry-question values:

- `roth-tax-window`
- `early-retirement`
- `owner-pay`
- `s-corp`
- `tax-planning`

Recommended funnel stages:

- `awareness`
- `decision-education`
- `fit-evaluation`
- `conversion`
- `client-service`
- `coi-referral`

## Next Implementation Checklist

1. Confirm final public package names.
2. Update future Planning Focus architecture so Roth is nested under retirement, not presented as a third visible market door.
3. Audit the two flagship offer pages plus the Roth decision-cluster page:
   - `/financial-advisor-for-pre-retirees`
   - `/financial-advisor-for-business-owners`
   - `/roth-conversions-before-retirement-tri-cities-tn`
4. Add related-resource sections to those pages.
5. Add package tags to tools, blog posts, learning-center articles, and future video outputs.
6. Build the next support assets from the first page set:
   - five retirement questions PDF/email/social versions
   - retirement paycheck visual or companion article set
   - owner-pay supporting page around reserves, taxable accounts, or retirement-plan design
   - Roth conversion bad-fit FAQ from the existing Roth point of view
7. Add package classification to Keystone proposal intake.
8. Turn the COI-forwardable retirement page into a repeatable referral asset workflow before trying to build the whole referral system.

## Practical Warning

The biggest risk is not being too narrow. The biggest risk is creating a sprawling content system that loses the hierarchy.

Specific pages can multiply. The center should stay simple.
