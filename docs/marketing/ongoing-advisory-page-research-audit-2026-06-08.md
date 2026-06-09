# Ongoing Advisory Page Research Audit

Date: 2026-06-08

## Summary

The ongoing advisory pages are directionally strong, but the current copy still speaks too much from the firm's internal operating model and not enough from the client's lived mental load.

The fix is not to make the pages longer for the sake of length. Google's guidance explicitly points away from arbitrary word count targets and toward useful, complete, people-first content. The better move is to make each page more specific, more answer-driven, and more obviously distinct from the other two pages.

Working diagnosis:

- The service logic is good: two core meeting names, four annual windows, and a strong emphasis that meaningful work happens between meetings.
- The pages risk feeling a little generic because the shared rhythm structure is doing most of the work.
- The pages should become less "here is our service model" and more "here are the decisions we keep from falling through the cracks for someone like you."
- Each page should include a highly specific Q&A section in David's voice, because it helps real readers, improves AI-search usefulness, and makes the pages materially more distinct.

## Current Page Audit

Pages audited:

- `/how-we-work/ongoing-advisory`
- `/how-we-work/ongoing-advisory/retirement`
- `/how-we-work/ongoing-advisory/business-owners`
- `/how-we-work/ongoing-advisory/high-earners`

Source files audited:

- `src/data/talley-wealth/ongoing-advisory.ts`
- `src/pages/brands/talley-wealth/how-we-work/ongoing-advisory/index.astro`
- `src/pages/brands/talley-wealth/how-we-work/ongoing-advisory/[rhythm].astro`

## What Is Working

- The two meeting names are strong:
  - Annual Planning Meeting
  - Strategy Session
- The annual rhythm is intuitive:
  - Tax Season Review
  - Planning Priorities
  - Implementation & Alignment
  - Year-End Strategy
- The pages correctly imply that most of the real work happens outside meetings.
- The content is already tax-aware enough to feel more Talley than generic investment management.
- The shared idea is right: ongoing advisory keeps taxes, investments, income, business decisions, estate issues, benefits, and life changes from being handled in separate rooms.

## What Is Not Connecting Yet

Several phrases are accurate but feel over-designed or slightly AI-ish:

- `durable life plan`
- `planning lens`
- `emotional center`
- `translate business success into personal wealth`
- `convert high income into lasting wealth`
- `cash deployment`
- `career optionality`
- `the work is bigger than the calendar invite`
- repeated use of `connected`, `coordinated`, `rhythm`, and `planning`

These are not all bad phrases, but the density of them makes the page feel a bit constructed. The better Talley voice is more concrete:

- Not: `convert high income into lasting wealth`
- Better: `make sure a strong income is actually building wealth after taxes, spending, benefits, and family priorities`

- Not: `planning lens`
- Better: `the questions we keep coming back to`

- Not: `cash deployment`
- Better: `what to do with extra cash`

## SEO And AI Search Findings

The concern is valid, but the answer is not "make every page long."

Google's helpful-content guidance asks whether content is original, complete, useful, expert, and satisfying to a real reader. It also explicitly warns against writing to a particular word count because someone believes Google prefers one.

Google's AI-search guidance points in the same direction: unique, non-commodity content that fulfills people's needs and answers more specific follow-up questions.

For these pages, the practical SEO/AI rule is:

> If you removed the page title, a reader should still know which audience the page is for.

That test is not fully passed yet. The shared annual rhythm can stay, but each page needs more unique examples, questions, fears, and "what we watch for" material.

FAQ schema should not be treated as a magic lever. As of May 7, 2026, Google says FAQ rich results are no longer broadly appearing in Search and are mainly available for government-focused or health-focused authoritative sites. Visible Q&A is still worth doing for humans and AI-search clarity, but structured FAQ markup should be optional rather than central.

Recommended finished length: roughly 1,200-1,800 useful words per detail page, if the additional material is genuinely specific. Do not pad.

## Shared Rewrite Rule

Each detail page should follow this logic:

1. Name the specific client problem in the hero.
2. Show the Talley annual rhythm.
3. Add a market-specific `What we keep watching for` section.
4. Add a David-voice Q&A section.
5. Link to Keystone, Pricing, the relevant Who We Help page, and the other rhythm pages only where useful.

The hub page should stay shorter. It should explain the concept and route people to the three detail pages.

## Retirement / Retirees

### Audience Intent

Likely searches and questions:

- Can I retire yet?
- How much can I safely withdraw?
- When should I take Social Security?
- Roth conversion before RMDs
- How to avoid IRMAA
- Tax-efficient retirement income
- Medicare planning before retirement
- Will I run out of money in retirement?

Likely emotional anxieties:

- "I think we're probably okay, but I do not actually know."
- Fear of running out of money.
- Worry about inflation, healthcare costs, Medicare, Social Security, market volatility, and longer life.
- Anxiety that retirement tax decisions interact more than expected: IRA withdrawals, Social Security taxation, Medicare premiums, capital gains, Roth conversions, RMDs, and QCDs.
- Fear of making an irreversible timing mistake.
- Concern that one spouse may not be prepared to manage the plan alone.

Buying questions:

- Will this help me make the next five to ten years of decisions in the right order?
- Are taxes, income, investments, Medicare, and estate issues being watched together?
- Will I hear from you before something becomes a problem?
- Can this help us spend with confidence instead of just preserve nervously?

### Content That Should Be Added

- The bridge years between work ending, Social Security, Medicare, and RMDs.
- Withdrawal order and tax-bracket management.
- Roth conversion windows.
- IRMAA-aware income planning.
- RMD and QCD planning.
- Surviving-spouse readiness.
- Turning a portfolio into a paycheck without pretending the plan is static.

### David-Voice Q&A Bank

**Do we really need to revisit the plan every year once we retire?**

Usually, yes. Retirement is not one decision. Taxes, withdrawals, Social Security, Medicare, portfolio income, and estate details keep interacting, and small changes can matter more once you are living from the plan.

**What if we are already retired?**

That still fits. The work usually shifts from "Can we retire?" to "Are we taking income in the right order, managing taxes well, and keeping the plan organized if one spouse has to carry it alone?"

**Do you look at Roth conversions every year?**

We look at them when they may matter. Some years the answer is yes. Some years the tax cost is not worth it. The point is to decide before year-end, not after the opportunity is gone.

**Is this mostly investment management?**

No. Investments matter, but the bigger question is whether the portfolio, withdrawal plan, tax picture, cash needs, and estate details are working together.

**What makes retirement planning different from normal investment advice?**

Once paychecks stop, every withdrawal has a job. The question is not just what the portfolio earned. It is what needs to come out, where it should come from, what tax year it lands in, and how it affects the rest of the plan.

**What happens if markets are down when we need income?**

That is part of the planning. We want cash needs, portfolio risk, withdrawal order, and tax decisions reviewed together so a market decline does not automatically turn into a rushed income decision.

**Do you help with Medicare and IRMAA planning?**

Yes, where it connects to income planning. Medicare premiums can be affected by taxable income, so Roth conversions, capital gains, IRA withdrawals, and other decisions should not be made in isolation.

**What does surviving-spouse readiness mean?**

It means the plan should still make sense if one spouse has to carry it alone. That can include account organization, beneficiary reviews, estate documents, cash flow, key contacts, and making sure the surviving spouse knows what is already handled.

## Business Owners

### Audience Intent

Likely searches and questions:

- Financial planning for business owners
- Business owner tax strategy
- S corp reasonable compensation
- How much should I pay myself?
- Retirement plan for small business owner
- Cash balance plan vs 401(k)
- Business succession planning
- How to sell my business tax efficiently
- Business valuation for exit planning

Likely emotional anxieties:

- The business is valuable, but the owner is not sure it is actually retirement-ready.
- Cash flow feels strong some years and chaotic in others.
- Tax planning often feels reactive.
- The owner is tired of advisors seeing only one slice: CPA, investment advisor, attorney, payroll, banker, insurance.
- Succession is emotionally loaded because it touches identity, employees, family, spouse, lifestyle, buyer readiness, and control.

Buying questions:

- Do you understand how my business and personal life are financially tangled together?
- Can you coordinate with my tax picture instead of giving generic investment advice?
- Will you help me make decisions before year-end?
- Can this help me reduce dependence on the business?
- Can this help me take money out of the business more intentionally?

### Content That Should Be Added

- Owner compensation and distributions.
- Estimated taxes and business/household cash flow.
- Entity and deduction check-ins.
- Retirement plan design: 401(k), profit sharing, cash balance, SEP/SIMPLE where relevant.
- Tax planning before December, not after.
- Succession and exit planning years before a sale.
- Personal balance sheet outside the business.
- Estate planning when much of the family wealth is tied to the company.

### David-Voice Q&A Bank

**How is this different for business owners?**

The business is usually both the engine and the risk. We look at owner pay, taxes, retirement plans, cash reserves, household goals, insurance, and eventual exit planning together instead of treating the business and personal plan separately.

**Do you coordinate with my CPA?**

If you have an outside CPA, yes, when it helps. If Talley is also handling the tax work, that coordination is built into the relationship instead of being a separate handoff.

**What if I am not planning to sell my business soon?**

That is fine. Exit planning is not only about selling. It is also about reducing dependence on the business, building personal wealth outside it, and making sure the business could handle disruption.

**Why is year-end such a big deal?**

Because a lot of owner decisions have deadlines. Compensation, retirement plan funding, deductions, estimated taxes, and entity-related decisions are much easier to plan before the year closes.

**Can you help me figure out how much to pay myself?**

Yes, as part of the broader picture. Owner pay affects taxes, retirement plan contributions, cash flow, and sometimes lending or benefit decisions. It should not be decided only by whatever cash happens to be available.

**What if most of my net worth is in the business?**

That is common, but it is also a risk. Part of the work is building personal wealth outside the business so your retirement, family security, and future options do not depend entirely on one eventual sale.

**Do you help with retirement plans for the company?**

Yes, where it fits. Sometimes the question is contribution limits. Sometimes it is employee retention. Sometimes it is tax planning. Sometimes it is whether the plan is creating more complexity than value.

**What makes this different from just having a CPA?**

A good CPA is important. The difference is that ongoing advisory should connect the tax return to the household plan, investments, risk, retirement, estate issues, and business decisions that need to happen before the return is filed.

## High Earners / Accumulators

### Audience Intent

Likely searches and questions:

- Tax planning for high income earners
- Backdoor Roth IRA
- Mega backdoor Roth
- RSU tax planning
- Equity compensation financial advisor
- Deferred compensation plan pros and cons
- HSA investment strategy
- 529 college savings high income
- How much life insurance do I need?
- Executive financial planning

Likely emotional anxieties:

- They make good money but feel oddly unorganized.
- They suspect they are missing obvious tax or benefit moves.
- They have too many accounts, benefits, plan options, bonuses, RSUs, 529s, insurance decisions, and competing goals.
- They may not feel wealthy yet because income is high but obligations are also high.
- They worry that success is creating complexity faster than they are building a system.

Buying questions:

- Am I using all the tax-advantaged options available to me?
- Should I be doing Roth, pre-tax, backdoor Roth, mega backdoor Roth, taxable investing, HSA, 529, or something else?
- How do benefits, equity comp, cash flow, taxes, and investments fit together?
- Am I overconcentrated in company stock?
- Am I making smart decisions now, or is income covering up disorganization?

### Content That Should Be Added

- Benefits review and open enrollment.
- Equity compensation decisions: RSUs, ESPP, options, concentration risk.
- Tax-efficient savings order.
- Backdoor/mega backdoor Roth eligibility and coordination.
- Deferred compensation tradeoffs.
- HSA and 529 strategy.
- Insurance gaps: life, disability, umbrella.
- Cash flow design for people whose income is strong but scattered.

### David-Voice Q&A Bank

**If we have a strong income, why do we need this much planning?**

High income helps, but it does not automatically become wealth. Taxes, spending, benefits, equity compensation, college, insurance, and cash decisions can quietly pull in different directions.

**Do you help with benefits and open enrollment?**

Yes, when it matters. Health plans, HSAs, disability coverage, life insurance, deferred comp, and other benefits can have real planning impact, especially for high-income households.

**What if most of our complexity is stock compensation?**

Then the planning needs to account for concentration risk, taxes, timing, cash flow, and how much of your future is already tied to your employer. The answer is rarely just "sell" or "hold."

**Is this just for executives?**

No. Executives are one example. The broader fit is households with strong income and enough moving parts that tax, savings, benefits, investments, and family priorities need to be coordinated.

**What does tax planning look like for high earners?**

It usually starts with making sure the obvious pieces are not being missed: withholding, retirement contributions, Roth or backdoor Roth options, HSA/FSA choices, charitable giving, equity comp, and the timing of income or deductions where there is flexibility.

**Can you help us decide what to do with extra cash?**

Yes. Extra cash sounds simple, but the answer depends on emergency reserves, debt, taxable investing, retirement accounts, college, insurance, future home or business goals, and how much flexibility you want.

**Do we need estate planning if we are still accumulating?**

Often, yes, at least at the basic level. If you have children, significant assets, life insurance, or accounts with beneficiaries, estate planning is not only an end-of-life issue. It is a family-protection issue.

**How often should we revisit the plan?**

At least annually, and usually again before year-end if there are tax, benefit, equity, or cash-flow decisions with deadlines. The goal is not more meetings. The goal is fewer things drifting until they become urgent.

## Recommended Page Structure

### Hub Page

Keep the hub concise. Recommended sections:

1. Hero: Keystone builds the plan; ongoing advisory keeps it current.
2. Short explanation of two planned meetings and between-meeting work.
3. Three path cards:
   - Retirement / Retirees
   - Business Owners
   - High Earners / Accumulators
4. Shared annual windows.
5. CTA to Explore Call or Keystone.

### Detail Pages

Recommended sections:

1. Hero with a client-facing problem, not just the service category.
2. `The questions we keep coming back to` replacing `Planning Lens`.
3. `What we keep watching for` with market-specific items.
4. Annual rhythm section with the four windows.
5. David-voice Q&A section.
6. Cross-links:
   - Keystone Method
   - Pricing / Ongoing Advisory
   - Relevant Who We Help page
   - Other rhythm pages

## Implementation Notes

- Keep the shared seasonal rhythm, but make the page bodies, Q&As, and examples different enough to stand alone.
- Consider storing Q&A content in `src/data/talley-wealth/ongoing-advisory.ts` so the dynamic template can render each page consistently.
- Do not use FAQ schema as a primary SEO tactic. Add visible Q&A first; schema only if easy and strictly aligned with visible content.
- The detail pages should not become blog posts. They should still feel like premium service pages.
- Avoid making high earners sound like a third equal public homepage lane. This remains an operational/service rhythm and an entry-point layer, consistent with the market architecture.

## Source Notes

- Google Search Central, helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, AI-generated content guidance: https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
- Google Search Central, AI search success guidance: https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
- Google Search Central, canonicalization guidance: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google Search Central, canonical URL methods: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central, FAQ structured data guidance: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- EBRI, 2026 Retirement Confidence Survey summary: https://www.ebri.org/publications/research-publications/center-publications/content/summary/2026-retirement-confidence-survey-finds-americans-less-confident-about-retirement-as-worries-grow-over-social-security--medicare-and-rising-costs
- SSA, IRMAA life-changing event page: https://www.ssa.gov/medicare/lower-irmaa
- IRS, IRA/Roth conversion/RMD/QCD FAQ page: https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-iras
- IRS, S corporation compensation and medical insurance issues: https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues
- IRS, S corporation retirement plan contributions FAQ: https://www.irs.gov/retirement-plans/retirement-plan-faqs-regarding-contributions-s-corporation
- IRS, retirement plans for small entities and self-employed: https://www.irs.gov/retirement-plans/retirement-plans-for-small-entities-and-self-employed
- HealthCare.gov, HSA-eligible plans: https://www.healthcare.gov/high-deductible-health-plan/hdhp-hsa-information/
- IRS, qualified tuition programs / 529 plans: https://www.irs.gov/taxtopics/tc313
- IRS Publication 525, stock/RSU tax background: https://www.irs.gov/publications/p525
