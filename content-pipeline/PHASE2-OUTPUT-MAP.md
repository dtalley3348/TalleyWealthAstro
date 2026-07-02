# Phase 2 Output Map

What each video becomes, and how it flows. This is the spec the drafting step automates.
It is built from David's own docs (content-engine.md, social-content-principles.md,
compliance-content-workflow.md, email-marketing-plan.md, brand-system-refined.md,
seo-strategy.md, keyword-map.md), not invented from scratch.

## How it runs (where the checkpoints are)

The automation runs unattended. There is exactly one human checkpoint.

1. Clip syncs in from the phone, the watcher runs the video pipeline.
2. The transcript is classified (triage) and all written drafts are generated.
3. Everything lands in `approval-queue/` as drafts. Nothing is published.
4. CHECKPOINT: David reviews the queue whenever he likes, approves what he wants.
   Long-form and website copy then go through Resource Publishing: preview,
   package, compliance PDF/video ZIP, then publication. YouTube is only queued
   automatically from that Resource Publishing package path, not from normal
   short-form approval.

Triage is automatic and never pauses the run. Doing several videos a day just means
several finished draft sets waiting in the queue.

## Routing / triage

Each transcript is classified into one of David's existing buckets:

- Post Only
- Caption / Post
- Website Asset
- Core POV Asset

The bucket decides how deep the drafting goes. The classification is a suggestion;
it can be overridden in the queue, and a clip can be re-run at a different depth.

## Generated for EVERY video

- Social pack: one core message lightly adapted for LinkedIn, Instagram, Facebook,
  and X. Only the first line, length, and hashtags change per platform (per
  social-content-principles.md, do not over-customize). The post's hook type
  (structural / teacherly / emotional / contrarian) is preserved.
- Short-form caption for the Reel / Short itself.
- Carousel: 6-8 branded slides at 4:5 for Instagram and LinkedIn, navy (#243445)
  and gold (#BF8C4D), built from the video's key points.
- YouTube title/description may be generated for Resource Publishing companions, but
  normal short-form clips do not auto-queue YouTube.
- Google Business Profile post (short, local).
- Compliance metadata record auto-filled to the content-log schema: title, format,
  target audience, target query/topic, claims requiring review, disclosures used,
  approval status, approval date, published URL, archive location.

## Generated only for WEBSITE / CORE assets

- Blog article in David's template: short direct answer near the top, David Talley
  CFP(R) byline, local / client-fit context, deeper-problem framing, a decision
  framework, a practical added-value block, 3 to 5 internal links, balanced
  risks/limits, compliance-safe disclaimer, and CTA to Explore Call, Keystone, a
  guide, or a related article. Use `BLOG-RESOURCE-BLUEPRINT.md` as the controlling
  standard. ~1,200 to 1,800 words when the topic supports it, no padding. Slug
  under `/resources/blog/`.
- One "Planning Note" email (see Email below).

## Email approach

- Start simple: only the strongest videos (Website / Core) produce an email, drafted
  as a single plain-English "Planning Note" to the main marketing audience
  (`Talley Wealth - Marketing`). David decides when to send.
- Pacing: email is the most selective output. Do not email per video. A weekly note
  or only the best clips, to avoid list fatigue.
- Every email ends with the educational disclaimer and David's signature
  (per email-marketing-plan.md).
- Later: build the four intent segments (retirement / business-owner / Roth / general)
  in Mailchimp once, then turn on routing by intent. Not possible yet because those
  segments do not exist.

## Landing-page copy

- Not a routine per-video output. The AI should flag landing-page candidates when a
  transcript maps to a repeatable high-intent decision, package support page, referral
  handout, or future destination URL.
- Landing pages are built deliberately by David/Codex after reviewing whether the topic
  already has site coverage, whether the page would help conversion or search, and how it
  should connect to existing internal links.
- A single strong video can justify a landing-page recommendation, but the safer default
  is to collect several related clips/transcripts before building a permanent page unless
  the topic is obviously central.

## Compliance guardrails (baked into every draft)

- Nothing long-form or website-bound auto-publishes. Draft to queue, then Cambridge
  PDF approval, then publish.
- Banned-claims filter: no "fee-only," "no commissions," "no product sales,"
  "guaranteed outcomes / tax savings," "best advisor," "beats the market,"
  "eliminates risk," no employer endorsements.
- Use hedging verbs (may, might, could, can help evaluate, can model, can coordinate).
  Label hypotheticals as hypothetical. Testimonials: first name + last initial only,
  with the not-a-guarantee disclosure.
- Voice: avoid the documented avoid-words list and AI-ish density; use the anti-pitch
  CTAs. No em dashes, no exclamation points, no staccato fragments.
- Talley Tax content carries the separate-business and non-affiliation language.

## Cadence guidance (from the docs)

- ~1 strong search-intent answer per day for social.
- 2 to 3 website articles per week from the strongest videos.
- Email sparingly (see above).
- Recording-source mix target for the next 90 days: 35% retirement transition,
  25% business owner profit-to-wealth, 15% coordination and implementation,
  10% local/regional/real-life market, 10% secondary complexity, and 5% David
  POV/referral partner. Treat this as source-material guidance, not a rigid posting
  quota.
- Talley Wealth is the parent judgment brand. Retire With Talley can receive adapted
  retirement clips, but it should not absorb all retirement thinking or leave Talley
  Wealth as the leftover owner-content channel.

## Open items to revisit

- Live Mailchimp tag/segment list (only two tags are documented today).
- Voice/POV knowledge files (voice-guide.md, point-of-view-map.md) are referenced but
  missing from this checkout; adding them would sharpen voice fidelity.
- Social handles and how posts are actually published (manual vs tool).
- Approved standing disclaimer strings for blog, landing page, social, and GBP.
