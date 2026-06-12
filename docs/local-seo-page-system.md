# Local SEO Page System

Local pages are entry points into one connected Talley Wealth planning system. They should confirm local relevance, recognize the person clearly, and route them to the right next page.

Do not build a page from a city name and generic service copy. Start with a local page strategy brief, then write the public copy.

## Routing Hierarchy

Local hub pages are situation first:

- Primary path: Retirement is the main question.
- Primary path: The business is driving the complexity.
- Secondary path: local context such as Johnson City, Bristol, or Kingsport.
- Escape hatch: "I'm both, not sure, or something else."

A visitor can be both nearing retirement and in Bristol, or both an owner and close to retirement. The right path is chosen by the decision creating pressure, not by a perfect identity label.

## Strategy Brief Fields

Every city record should define:

- `localTruth`: what is actually true about this place.
- `whoThisIsReallyFor`: the real person pattern, not a keyword.
- `whatTheyAreProbablyFeeling`: the emotion or pressure behind the search.
- `whatNotToOverdo`: the local angle that can become fake if pushed too hard.
- `voiceNotes`: how David would say it plainly.

Every local audience page should add archetype depth. For business owners, include:

- owner identity
- business stage
- tax pressure
- cash-flow reality
- spouse/family layer
- pride, control, and delegation tension
- whether retirement, succession, or exit is actually on the table

## Required Public Sections

Every approved local page should render:

- `Who this page is for`: a compact answer-summary block for humans, Google, and AI answer systems.
- `Local proof and service area`: office/service-area facts, meeting modes, and public review themes only.
- `Decision depth`: one section that explains the concrete decision this city/audience page can answer better than a generic page.

Do not use invented testimonials. If a testimonial is quoted or paraphrased, it must come from a real public Google review and should be handled through the approved review system.

## David Voice Rules

Use local detail only if it does at least one of these:

- changes the planning decision
- reveals the person
- builds trust

Avoid clever SEO lines, generic city swaps, and jokes that sound manufactured. Prefer plain observations, for example: "The state line matters when it changes the numbers. It does not need to be the whole story."

Never call Talley Wealth fee-only. Use flat-fee planning language only where Keystone or pricing naturally belongs.

Do not name specific employers in local SEO copy or metadata. It is acceptable to describe broad patterns such as major regional employers, healthcare employers, manufacturers, local colleges, long-career benefit decisions, or employer-shaped wealth. Do not imply affiliation, endorsement, or employer-specific benefit expertise unless compliance has approved the page.

## Publishing Gate

No new local city, service-city, local-audience, sub-persona, or decision-cluster page should become a public route unless it has a quality gate with:

- `approvedForIndex: true`
- `uniqueLocalDecision`
- `specificFit`
- `specificNonFit`
- `proofStandard`
- `reviewNotes`

The route generator now requires approval gates for city hubs and local-audience pages. Service-city pages require an approved service override. This keeps research records and future ideas in the data file without automatically publishing thin keyword combinations.

## First Cluster

Refine these before expanding:

- Tri-Cities regional hub
- Johnson City hub
- Bristol hub
- Kingsport hub
- Johnson City retirement page
- Johnson City business-owner page
- Bristol retirement page
- Bristol business-owner page
- Kingsport retirement page
- Kingsport business-owner page

Do not expand dramatically until the first cluster passes manual voice review, `npm run check`, `npm run build`, and real-browser preview.

## Relationship To Decision Clusters

Local pages answer "Are you local and relevant?" Decision-cluster pages answer "Do you understand the decision I am trying to make?"

Use `docs/decision-cluster-page-system.md` for pages such as business-owner tax planning, retirement income planning, Roth conversion planning, or owner compensation planning. Local context can support those pages, but it should not be the reason the page exists.
