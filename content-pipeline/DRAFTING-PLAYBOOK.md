# Drafting Playbook

The rules the written-draft step follows, so every social pack, carousel, and blog
comes out sounding like David and staying compliance-safe. Built from his docs
(content-engine.md, social-content-principles.md, brand-system-refined.md,
compliance-content-workflow.md) and global voice rules.

## Triage (which assets to make)

Read the transcript and classify:

- **Post Only** — quick personal thought, no lasting search value. Make: 1 caption only.
- **Caption / Post** — one clean tip worth a clip. Make: social pack + carousel.
- **Website Asset** — answers an evergreen question someone would Google. Make:
  social pack + carousel + blog.
- **Core POV Asset** — foundational point about how David thinks. Make: social pack +
  carousel + blog (and flag it as reusable on persona/POV pages).

The classification is a suggestion. David confirms it in review.

## Persona fit

Use the current intentional persona lanes as judgment lenses, not labels to force onto
every transcript.

- **Retirement transition:** last paycheck, retirement paycheck, 401(k), Social
  Security, Medicare, tax windows, withdrawal order, spouse/family continuity, and the
  first years before or after retirement.
- **Business owner profit-to-wealth:** owner pay, distributions, salary/reasonable
  compensation, business cash, tax estimates, retirement plans, personal investments,
  and the problem of converting business profit into owner freedom.
- **Coordination and implementation:** CPA/advisor/attorney gaps, sequencing decisions,
  Keystone-style implementation ownership, and situations where competent professionals
  still leave the client carrying the handoffs.
- **Local/regional/real-life market:** Johnson City, the Tri-Cities, local employers,
  local owners, local retirees, and regional realities when they make the story more
  recognizable. This should not read like generic local SEO.
- **Secondary complexity:** equity compensation, inherited wealth, estate/charitable
  decisions, high-income professional complexity, or successful families with too many
  disconnected professionals.
- **Referral partner:** useful enough for a CPA, attorney, HR leader, or friend to pass
  along without needing to explain Talley Wealth.

Apply each lane on a spectrum:

- **Direct fit:** use the lane's language plainly.
- **Partial fit:** borrow only the relevant pieces.
- **Adjacent fit:** talk about the decision, not the persona.
- **No fit:** keep it as general POV or mark it for manual review.

Especially for business-owner content, do not make a solo owner sound like a large
multi-partner practice, and do not make every owner-pay question sound like a full exit
or succession problem.

## Asset routing recommendations

The model should decide what the transcript deserves, then explain the recommendation.
Do not maximize asset count. A thin transcript should not become long-form content just
because the pipeline can generate it.

- **Blog post:** use when the transcript answers one durable educational question,
  contains enough substance for a useful answer-first article, and could serve search,
  email, or social link-share value. Blog is the default long-form output for
  Website/Core assets.
- **Landing page:** do not generate routinely from one video. Flag as a candidate when
  the topic represents a repeatable high-intent decision, package support page, referral
  asset, or future destination URL. The AI may recommend it, but David/Codex should build
  it deliberately after reviewing fit, existing site coverage, and internal links.
- **Learning Center / FAQ:** use for narrow answers, definitions, or one-decision
  explainers that are too small for a full blog.
- **One-pager:** use for referral-partner explanations, Keystone fit, retirement
  transition handouts, business-owner planning themes, or client education that should
  be forwardable as a PDF.
- **Email:** use sparingly. Recommend only when the idea is broad enough, sharp enough,
  or timely enough to send as a planning note without fatiguing the list.
- **Website reuse:** preserve strong David lines, examples, or explanations for service
  pages, persona pages, FAQs, future hooks, and internal-linking support.

## Voice

- Conversational, plain English, short grounded sentences, first person where his
  judgment matters. Calm confidence, willing to say what isn't a fit.
- Anti-pitch, expressed naturally in a sentence, never as a slogan or stacked fragments.
- Hard bans: em dashes, exclamation points, staccato catchphrase fragments.
- Avoid: holistic, synergy, roadmap, financial journey, unlock, empower, optimize,
  "solutions," peace of mind, deep dive, leverage, elevate, transform, game-changer.
  Also avoid influencer voice, fake urgency, and dunking on other advisors.
- Avoid AI-ish density: don't stack "durable life plan / planning lens / coordinated /
  rhythm / convert high income into lasting wealth."
- Useful phrasing: "real financial planning," "plan first," "plain-English," "the plan
  tells us what the investments need to do," "decisions that affect each other."

## Per-platform specs

Same core message everywhere; only change the first line, length, and hashtags.

- **LinkedIn:** longer ok, line breaks between thoughts, 1-2 hashtags, soft CTA.
- **Instagram:** punchy hook line, conversational body, 3-4 hashtags at the end.
- **Facebook:** warm, conversational, few or no hashtags.
- **X/Twitter:** a short thread (2-4 posts), each under ~280 characters.
- **Short caption:** one or two lines, the hook, to sit under the captioned Reel.
- **Google Business Profile:** a short local-flavored educational post (up to ~1500
  chars) with a soft CTA and a link. Local and plain-English; this is a local-SEO touch.
- **Carousel (4:5):** 6-8 slides. Render with `scripts/render-carousel.mjs`. Rules:
  - The needle mark (`needle-mark.png`, the gold-and-white compass needle made for dark
    backgrounds) in the top corner of every slide, barely dimmed (~0.88). No wordmark,
    no bare URL footer.
  - Vary slide types so they don't look stamped: `cover` (promise the payoff), `point`,
    `number` (one big stat), `quote` (a real David line in gold), `cta`.
  - Momentum: progress dots and a "keep going" nudge on every slide except the last, and
    each slide should leave a small open loop so people swipe.
  - The cover promises a payoff, not just the topic.
  - The last slide is a social-native ask (follow / save), NOT a cold "book a call." The
    actual link lives in the caption / link-in-bio (see Destination below).

## Destination (where social drives)

- Topic-based. If the video is about retirement, the link is the guide ("Are You Actually
  On Track?"). For other topics, default the link to the blog post until more guides exist.
- Links can't be clicked inside a carousel, so the destination link goes in the caption
  (LinkedIn/Facebook/X) and in link-in-bio (Instagram). The carousel only earns the
  follow/save.

## Posting targets

- Auto-scheduled via Metricool: Facebook, Instagram, X, LinkedIn, and Google Business
  Profile. Social posts do not need pre-approval.
- Produced through Resource Publishing only: YouTube companion videos. Normal short-form
  approvals do not queue YouTube. If a video is part of a blog/resource compliance
  package, the package step may queue the final horizontal resource video to YouTube
  through Metricool with a title, description, and article link.
- Asset to platform: captioned video -> IG, FB, LinkedIn, X;
  carousel -> IG, LinkedIn, FB; b-roll overlay -> IG, FB, X, LinkedIn; GBP post -> GBP;
  blog -> website + a link-share post to LinkedIn, FB, X; resource video -> YouTube
  only through the Resource Publishing package path.
- Flow: approving a post in the review board IS the authorization. Approved posts
  auto-schedule and post on the plan. There is NO separate batch confirmation.

## CTAs

Use: "Schedule an Explore Call," "Read the article," "See how Keystone works,"
"Download the guide." Avoid: "Learn More," "Get Started," "Book a Consultation."

## Compliance (never skip)

- Never auto-publish. Drafts go to the approval queue. Long-form and website copy then
  go through David's Cambridge PDF approval.
- Banned claims: "fee-only," "no commissions," "no product sales," "guaranteed"
  anything, "best advisor," "beats the market," "eliminates risk," employer endorsements.
- Use hedging verbs: may, might, could, can help evaluate, can model, can coordinate.
- Client stories are illustrative/representative, framed as "picture a couple..." rather
  than implying a specific identifiable client. Never present as a testimonial.
- Disclaimers: use a humanized line, not boilerplate (per voice-guide.md and
  compliance-and-disclaimers.md).
  - Social: "This is general education, not advice for your specific situation."
  - Client/estate/tax deliverables (preferred pattern): "For discussion purposes only.
    This is not individualized legal or tax advice. Estate, tax, and investment
    decisions should be reviewed against the full facts and with the right professional
    before implementation."
  - Talley Tax content: add the separate-business + non-affiliation language.

## Interpretation first (from interpretation-layer.md)

Before drafting, name the real tension, the belief being challenged, the surface
question vs the deeper problem, and a one-sentence organizing thesis. Protect David's
sharp source lines ("the plan dictates the investments," "a retirement answer alone
doesn't change their life") instead of polishing them away. The plan dictates the
assets, not the other way around. If the transcript lacks human texture, mark the draft
"needs David input" rather than filling with generic warmth.

## Blog template (Website/Core only)

Use `BLOG-RESOURCE-BLUEPRINT.md` as the controlling standard. A blog is not a
dressed-up transcript. It should be a David-led answer page with an answer-first
opening, situation-first framing, the deeper problem behind the surface question,
a 3-5 factor decision framework, at least one practical added-value block
(checklist, worked example, threshold map, mistake taxonomy, comparison table, or
questions to bring to planning), risks/limits, 3-5 internal links when relevant,
a compliance-safe disclaimer, and a CTA to Explore Call, Keystone, a guide, or a
related article.

~1,200-1,800 words when the topic supports it, no padding. Slug under
`/resources/blog/`.

## Content-log fields (fill for every asset)

title; format; target audience; target query/topic; claims requiring review;
disclosures used; approval status; approval date; published URL; archive location.

## B-roll overlay shorts

A distinct content type: one short line set over a b-roll segment.

- Raw b-roll is auto-sliced into ~6-8s segments (scene cuts when present, else fixed
  windows) and each segment is cataloged in `broll-library.json` (status
  needs-description). The night task views each segment's frame and fills description,
  mood, and tags, then sets status "ready".
- Overlay text comes from two sources: the strongest standalone lines in talking-head
  transcripts, and `line-bank.json` (evergreen POV lines). Lines must be compliance-safe.
- Only segments David has APPROVED in the review board (approved=true and status ready)
  are eligible for use. Describing a segment does not make it usable; approval does.
- Match a line to an approved segment by mood (calm line over a calm clip, etc.); prefer
  vertical segments. Write the pairing to `overlay-specs/<id>.json`.
- The render (line over the clip, navy legibility scrim, needle mark, gold rule) is the
  `TextOnBroll` Remotion composition, produced automatically by the watcher.
- One segment can carry many different lines over time; the bank is reusable.

### B-roll overlay audio

Default posture: restrained, instrumental, owned/licensed, and optional.

- Do not use raw B-roll source audio by default. It is usually wind, room noise,
  people, or accidental background sound.
- Do not automate trending/platform-native sounds. If a post needs a native trend, mark
  it for manual finishing inside that platform.
- Approved beds live in `audio-beds/library/` and are controlled by
  `audio-beds/manifest.json`.
- Keep volume low enough that the words and visual idea remain the asset. Default volume
  is `0.08`.
- Good beds should feel calm, warm, steady, and human. Avoid vocals, obvious stock
  corporate music, dramatic swells, and beat drops.
- The review app should show the chosen bed or show that the overlay is silent.
