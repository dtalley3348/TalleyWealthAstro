# Decision Cluster Page System

Decision-cluster pages explain the real planning decisions Talley Wealth helps people make. They are not generic service pages and they are not city-name keyword swaps.

Current prototypes:

- `business-owner-tax-planning-tri-cities-tn`
- `s-corp-planning-tri-cities-tn`
- `can-i-retire-before-65-tri-cities-tn`
- `roth-conversions-before-retirement-tri-cities-tn`

## Core Rule

No decision-cluster page exists because a keyword exists. A page exists because a specific person is trying to make a specific decision, and Talley Wealth has a real way to help.

Decision-cluster pages should clarify:

- who is asking the question
- what they think the problem is
- what the real decision usually is
- what tradeoffs matter
- when the page is a poor fit
- how Talley Wealth coordinates the work

## Interview Method

Use the ramble-first method when the decision topic is nuanced or voice-sensitive.

Ask one broad prompt:

> Imagine a real prospect asked you this question. What would you want them to understand? What do they usually misunderstand? What are the real decisions underneath the question?

Then ask only one follow-up if needed:

> When is someone a bad fit for this kind of planning?

Do not start by drafting page copy and asking David to pick it apart. First extract a decision brief from David's own language.

## Decision Brief Fields

Every decision-cluster record should carry:

- `decisionQuestion`
- `sourceMethod`
- `whoThisIsFor`
- `surfaceQuestion`
- `realQuestion`
- `commonMisunderstanding`
- `talleyPointOfView`
- `badFitBoundary`
- `davidPhrases`
- `whatToAvoid`
- `localRelevanceRule`
- `voiceNotes`

## Required Public Sections

Every approved decision-cluster page should render:

- `Who this page is for`
- `Decision depth`
- `Local proof and service area`, when the page has a local modifier
- `Representative situation`
- `Common questions`
- Related next steps back into persona, local, and Keystone pages

## Visual Explainers

Some decision clusters need a reusable visual. Use a visual when the real issue is hard to understand from paragraphs alone.

Good visual topics:

- payroll-tax layers and S-Corp reasonable compensation
- Roth conversion threshold maps
- retirement bridge-period timing
- withdrawal order across taxable, tax-deferred, and Roth accounts
- owner-decision webs where tax, liquidity, estate, and investment planning all touch

Rules:

- Make the visual explain the decision shape.
- Label whether it is a planning frame, explainer, or calculator.
- Do not present a planning frame as a personalized calculation.
- Do not put exact annual thresholds in a visual unless the source and review year are clear.
- If thresholds use different income definitions, say so. Taxable income, AGI, and MAGI are different planning measures.
- Use the same visual component in related blogs or tools pages only when it truly helps the reader understand the decision.

## Business Owner Tax Planning Prototype

The core point of view:

Tax preparation reports what happened. Business-owner tax planning helps decide what should happen next.

The difference is not "CPA bad, Talley good." A CPA may do excellent compliance work. The planning gap appears when taxes need to be coordinated with owner pay, business cash flow, liquidity, retirement contributions, personal wealth, estate considerations, and eventual transition options.

Important David-language:

- "Taxes are dollars too."
- "Cash is the lifeblood of any business."
- "Most owners have a concentrated balance sheet, even if they do not think about it that way."
- "The foresight window needs to be longer when you own a concentrated asset."

Bad-fit boundary:

This work is usually not the right first step for brand-new, low-profit, low-bracket, or cash-constrained businesses where the tax leverage and complexity do not yet justify the planning fee.

## Roth Conversion Before Retirement Prototype

The core point of view:

For many high-earning pre-retirees, the best answer before retirement is usually patience. The real planning work is building a year-by-year conversion pace for the years after earned income drops and before RMDs, Social Security, Medicare thresholds, or future tax brackets reduce flexibility.

Important David-language:

- "The conversion amount needs a target."
- "The better question is pacing."
- "The planning depth is the differentiator."
- "You are trying to lower cumulative lifetime tax, not just this April."

Planning targets to consider:

- federal bracket room
- senior deduction or other AGI-sensitive lines
- IRMAA and Medicare MAGI thresholds
- 22% and 24% bracket tops when future RMD pressure may justify using them
- outside cash available to pay the conversion tax
- investment growth and estate goals

Bad-fit boundary:

This is usually weak for households still in peak earning years with no future tax projection, little tax-deferred money, no liquidity to pay taxes, or no practical reason to accelerate taxable income.

## Compliance And Voice Guardrails

- Do not call Talley Wealth fee-only.
- Do not over-insert compensation disclaimers.
- Do not bash CPAs or imply they are not skilled.
- Do not promise tax savings.
- Do not quote or invent testimonials.
- Do not name local employers.
- Use local context only when it changes the decision, reveals the person, or builds trust.
- Use flat-fee planning language only where Keystone or pricing naturally belongs.
- Avoid the repeated AI-sounding contrast pattern: "X, not Y" or "X, not a Y." Use it only when David would naturally say it. Prefer direct phrasing that says what the thing does, who it helps, and where the limit is without the rhetorical comma-not construction.

## Publishing Gate

Decision-cluster pages require a quality gate before publishing:

- `approvedForIndex: true`
- `uniqueLocalDecision`
- `specificFit`
- `specificNonFit`
- `proofStandard`
- `reviewNotes`

If the page cannot explain why it deserves to exist beyond keyword volume, it should remain unpublished.
