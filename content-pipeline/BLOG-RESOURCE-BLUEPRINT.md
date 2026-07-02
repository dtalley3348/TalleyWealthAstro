# Blog Resource Blueprint

Last updated: June 29, 2026

This blueprint defines the standard for turning a Talley Wealth short-video transcript and reuse recommendation into a durable blog or resource article.

The goal is not to turn every transcript into long-form content. The goal is to turn the right transcript into a useful David-led answer page that can serve search, AI answer visibility, referral trust, email/social link sharing, and compliance review.

## Core Standard

A blog/resource article is worth making only when it turns one short video idea into a clearer planning decision the right person can recognize, understand, and act on.

The page should feel like David explaining the real issue across the table, with enough structure that a searcher, referral partner, or AI answer engine can understand what the page is about and why it is trustworthy.

## When A Transcript Deserves A Blog

Generate or recommend a blog/resource article when at least three of these are true:

- The transcript answers a durable educational question someone might search.
- The idea fits one of the priority audience lanes: retirement transition, business-owner profit-to-wealth, secondary complexity, or referral partner education.
- David makes a judgment that is more useful than a generic definition or checklist.
- The topic connects to Keystone, Ongoing Advisory, Explore Call fit, retirement transition, business-owner planning, or high-complexity family planning.
- The idea can support a decision framework, worked example, threshold map, mistake taxonomy, checklist, or conversion-ready next step.
- The article can link naturally to existing site pages, related resources, or a relevant guide.
- The compliance risk is manageable with caveats, sourcing, and review.

Keep the idea out of blog production when:

- The transcript is mostly a quick opinion, emotional aside, or social-only hook.
- The article would become a generic finance explainer anyone could write.
- The transcript lacks enough substance and there is no clear added framework to build.
- The topic would require individualized advice, unsupported claims, or client-specific facts.
- The best next asset is a Learning Center FAQ, one-pager, email, or website snippet instead.

## Required Inputs

Every blog/resource draft should begin from a brief with these fields:

- Source video id and transcript path.
- Reuse item id, if generated from `reuse-backlog.json`.
- Triage classification: `Website Asset` or `Core POV Asset`, or a manual blog override.
- Primary audience lane and fit strength.
- Core search question in the reader's words.
- Surface question.
- Deeper problem.
- Belief being challenged.
- One-sentence thesis.
- Strongest David line to preserve.
- Information-gain angle: what this page adds that a generic search result would miss.
- Compliance risk notes and claims requiring review.
- Suggested internal links and CTA.

## Required Article Structure

Use this order unless the topic clearly needs a different flow.

### 1. Title And Metadata

- H1 in plain reader language.
- SEO title that is clear, concise, and specific.
- Meta description that summarizes the useful answer, not a pitch.
- Slug under `/resources/blog/`.
- David Talley byline with credentials where appropriate.
- Published date and last reviewed/updated date.
- Source note when useful: adapted from a Talley Wealth educational video and reviewed before publication.

### 2. Answer-First Opening

Open with the answer before the setup.

The first 2 to 4 paragraphs should tell the reader:

- The short answer.
- When the answer changes.
- Who this applies to.
- Who it may not apply to.

Do not start with "In this video..." or a generic definition unless the search intent truly requires it.

### 3. Situation-First Framing

Translate the transcript into a recognizable planning situation.

Good patterns:

- "A couple is five years from retirement and..."
- "A business owner has strong profit but..."
- "A high-income family has plenty of professionals, but..."
- "Someone inherited money and now every decision feels connected..."

Use hypothetical or representative examples unless there is documented client permission and the required compliance path.

### 4. The Deeper Problem

Every article needs an explicit deeper-problem section.

Use the pattern:

- Surface question: what the person thinks they are asking.
- Deeper problem: what is actually driving the planning decision.
- Why it matters: what could go wrong if they answer the surface question only.

This is one of the main Talley Wealth differentiators. Protect it.

### 5. Decision Framework

Build the article around 3 to 5 factors that change the answer.

For each factor, explain:

- What to look at.
- Why it changes the answer.
- What tradeoff or risk it introduces.
- What a planning process would model or coordinate.

Prefer clear section headings over clever headings.

### 6. Practical Added-Value Block

Every durable article must include at least one of these:

- Decision checklist.
- Worked hypothetical example.
- Threshold map.
- Mistake taxonomy.
- Comparison table.
- "If this, then consider that" guide.
- Questions to bring to a planning conversation.

If none of these can be added honestly, the transcript probably should not become a blog.

### 7. David's Point Of View

Preserve at least one sharp David line or first-person judgment when it genuinely adds trust.

Examples of acceptable patterns:

- "The plan tells us what the investments need to do."
- "The first question is not always the real question."
- "A retirement number by itself does not tell you how to live with confidence."

Do not over-polish David's voice into marketing mush.

### 8. Risks, Limits, And Caveats

For planning, tax, estate, retirement, investment, Medicare, Social Security, charitable, and business-owner topics, include a balanced section that explains what could limit the strategy.

Examples:

- Roth conversions may raise current-year taxes and affect Medicare-related costs.
- Tax strategies may depend on entity type, cash flow, income timing, and future law.
- Investment decisions involve risk and should be tied to the plan.
- Estate and legal decisions need the right attorney and full facts.
- Business-owner decisions can affect both the business and the household.

Use hedging verbs where appropriate: may, might, could, can help evaluate, can model, can coordinate.

### 9. FAQ Or Follow-Up Questions

Use FAQs to answer natural follow-up questions, not keyword variants.

Good FAQ questions are:

- Real questions a prospect would ask next.
- Narrow enough to answer directly.
- Clear enough to stand alone.
- Useful even without rich-result display.

Do not rely on FAQ schema as the visibility play. Use FAQ sections because they help readers and answer systems understand the page.

### Optional: Timestamped Source Moments

When the article is adapted from a source video, include 1 to 3 timestamped source moments only when they make the article clearer.

Good source moments:

- Directly answer a question in the article or FAQ.
- Preserve a sharp David explanation or line.
- Help the reader connect the written answer to the original video.
- Support a major decision section, not a minor aside.

Avoid source moments when:

- The clip only repeats what the paragraph already says.
- The timestamp would interrupt the reading flow.
- More than 3 moments are needed to make the article work.
- The page does not embed or otherwise support the source video.

Best placements:

- One near the answer box when the clip explains the core idea.
- One inside a decision-framework section when the video makes the tradeoff clearer.
- One inside the FAQ when a common question has a direct video answer.

Data contract:

- `timestamp`: display time such as `0:42`.
- `seconds`: numeric start time such as `42`.
- `label`: short moment label.
- `question`: optional FAQ-style question.
- `answer`: optional 1 to 2 sentence answer.
- `transcriptExcerpt`: optional short cleaned source line.
- `sectionId`: optional related article anchor.

### 10. Internal Links And Next Step

Every article should include 3 to 5 internal links when relevant:

- Upward link to a pillar or service page.
- Sideways link to a related article or guide.
- Downward link to an action page or next step.

Use descriptive anchor text. Avoid vague "learn more" links.

The CTA should match the reader's readiness:

- Early: related guide, checklist, or article.
- Middle: questions to ask before a planning decision.
- Late: Schedule an Explore Call or see how Keystone works.

Keep CTAs calm and fit-based. No hard-sell language.

### 11. Sources And Review Notes

When the article includes factual claims, link to appropriate sources:

- IRS, SSA, Medicare, SEC, FINRA, CFP Board, or official government sources.
- High-quality institutional sources such as Vanguard, Fidelity, Schwab, Morningstar, or academic/research sources when useful.
- Talley Wealth methodology pages or internal site resources when the claim is about the firm's process.

Do not invent source links. If a claim needs sourcing and no source is available, mark it for review.

### 12. Disclosure

Close with a humanized disclosure:

For discussion purposes only. This is not individualized legal, tax, or investment advice. Estate, tax, retirement, and investment decisions should be reviewed against the full facts and with the right professional before implementation.

Adjust the disclosure when the topic is narrower, but preserve the educational-only posture.

## Component Inventory

The article template should support these content components:

- `EditorialBrief`
- `AnswerBox`
- `SituationIntro`
- `DeeperProblem`
- `DecisionFactors`
- `PlanningExample`
- `Checklist`
- `ThresholdMap`
- `CommonMistakes`
- `FAQBlock`
- `SourceVideoEmbed`
- `TimestampedSourceMoments`
- `TranscriptDrawer`
- `RelatedLinksCluster`
- `AuthorReviewerByline`
- `LastReviewed`
- `ComplianceReviewedBadge`
- `PrimaryCTA`
- `SecondaryCTA`
- `DisclosureFooter`
- `ArticleSchema`
- `VideoObjectSchema`
- `BreadcrumbSchema`

Not every article needs every visible component. Every article does need the strategic parts: answer-first opening, deeper problem, decision framework, added-value block, risks/limits, internal links, CTA, and disclosure.

## Technical SEO And AEO Notes

The current best practice is not to write special AI-only pages. Optimize for helpful, crawlable, expert-led search content that is easy for humans and systems to understand.

Required technical standards:

- Indexable page with a canonical URL.
- Clear H1 and descriptive H2/H3 structure.
- Concise title and meta description.
- `Article` or `BlogPosting` structured data when the page is published.
- Accurate author markup and author URL.
- `datePublished` and `dateModified` when available.
- Representative image that matches the topic.
- Descriptive alt text for images.
- Sitemap inclusion after publishing.
- Embedded source video when useful, with nearby explanatory text.
- Video metadata when the page includes the source video.
- `Clip` structured data for 1 to 3 source moments when the video is embedded, the URLs are stable, and the moments are useful.
- No stale date changes unless the content was meaningfully updated.

For ChatGPT Search visibility, do not block `OAI-SearchBot` if the site wants content eligible for ChatGPT search answers. This is separate from `GPTBot`, which is associated with training controls.

## Compliance Review Packet

Every website-bound article should preserve:

- Draft path.
- Staged URL.
- Source transcript path.
- Source video path or id.
- Claims requiring review.
- Sources used.
- Disclosure used.
- Author/reviewer.
- Approval status.
- Approval date.
- PDF path for Cambridge review.
- Published URL after approval.

The local draft is not approval. The staged page is not approval. Website/blog publication requires the intended Cambridge PDF review path before going live.

## Pass/Fail Gate

Before a blog/resource draft is accepted, answer these:

- Does the page answer a real reader question early?
- Does it make David's judgment visible?
- Does it name the deeper problem behind the surface question?
- Does it include a decision framework, not just an explanation?
- Does it include at least one added-value block?
- Does it avoid generic AI-like finance filler?
- Does it include risks, limits, and caveats?
- Does it use accurate, bounded language?
- Does it avoid banned claims and banned Talley language?
- Does it include relevant internal links?
- Does it have a calm, relevant CTA?
- Does it include review metadata and disclosure?
- Would the right reader feel more capable after reading it?

If the answer is no to any major item, revise the draft or demote it to another reuse type.

## Blog Draft Output Contract

When an AI writer returns a `blogDraft`, the markdown should include:

1. H1 title.
2. Short direct answer.
3. Byline placeholder.
4. Key takeaways or "What to know first" section when useful.
5. Situation-first intro.
6. Deeper problem section.
7. Decision framework sections.
8. Added-value block.
9. Risks/limits section.
10. FAQ or follow-up questions.
11. Internal link suggestions.
12. CTA.
13. Disclosure.
14. Compliance notes with claims requiring review.
15. Optional 1 to 3 timestamped source moments when the video has moments worth surfacing.

The draft should be roughly 1,200 to 1,800 words when the topic supports it. There is no magic word count. Do not pad.

## Recommended Pipeline Flow

1. Read transcript and reuse recommendation.
2. Classify whether the idea deserves long-form.
3. Build the editorial brief.
4. Decide the article angle and search question.
5. Draft the answer-first article.
6. Add the practical added-value block.
7. Add risks, limits, FAQ, links, CTA, and disclosure.
8. Write compliance metadata.
9. Stage locally.
10. Print PDF for review.
11. Publish only after approval.

The reuse queue remains a judgment queue. Blog/resource drafts should be generated only when the idea deserves a durable page.
