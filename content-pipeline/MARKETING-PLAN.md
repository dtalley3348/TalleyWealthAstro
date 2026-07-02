# Talley Wealth Growth and Marketing Plan

Written: July 1, 2026
Status: v1, agreed direction from David + Claude strategy session
Owner: David (decisions), Claude (execution support, builds, drafts)

This is the canonical marketing strategy document. The content engine docs (OPERATING-BRIEF, DISTRIBUTION-ARCHITECTURE, etc.) describe *how content gets made and routed*. This document describes *why*, *for whom*, and *what has to be true for the business goal to be hit*.

---

## 1. The Goal and the Math

**Goal:** 36-40 new client households per year, worth $10-20k/yr each (~$570k new recurring revenue per year at full run rate). Entry is always the Keystone Method (~$5-6k). Minimum $500k investable (or $5k offset fee, avoided when possible). Sweet spot $1-2M, range $500k-$3M, moving upmarket over time.

**Funnel model (David's numbers, July 2026):**

| Stage | Rate | Notes |
|---|---|---|
| Explore calls | — | Currently ~5/month (30 in Jan-Jun 2026) |
| → Qualified | ~57% | Holding steady; the filter works |
| → Strategy session booked | ~50% | **The big leak.** Stephenee emails 2-3 days later with a scheduling link |
| → Becomes client | ~80% | Strategy session is nearly a close |

Per 100 explore calls: ~57 qualified → ~28 strategy sessions → ~23 clients.

**Required volume for the goal:** ~165 explore calls/year ≈ **13-14/month**, vs. ~5/month today. BUT — see Section 4: fixing the session-booking leak first reduces the required call volume to ~10-11/month. Fix conversion before scaling volume.

**Capacity:** at 3+ Keystones/month David hires. Long-term intent is a team of advisors with David eventually not client-facing. Implication: everything we build (method, review moat, content library, funnel machinery) should compound as a **firm asset**, not a David-calendar asset. Keystone the method — not only David the person — is the hero of positioning over time.

---

## 2. The Market: One Market, Three Doorways

**The market is the retirement transition:** households within ~5 years of work becoming optional (or forced), with $500k-$3M saved, who have "a lot of stuff to get clarity on" — the retirement paycheck, the tax window between last paycheck and RMDs, Social Security timing, pension elections, withdrawal sequencing.

Positioning sentence (internal north star): *"People in and around the Tri-Cities figuring out how to turn what they've saved into a retirement paycheck."*

**Doorways into the one market:**

1. **Employed pre-retirees** (the core; David's best clients are "virtually all retirees" contacting him a few years out)
2. **Business owners whose exit is their retirement** — same trigger, they own the asset they're retiring from. Younger profitable-but-not-exiting owners remain a content lane at reduced weight (Keystone economics are fine at ~$12k but recurring value is low until assets exist)
3. **Sudden transitions** — widowhood, inheritance, severance/buyout. Low volume, very high intent

**Explicitly NOT a persona:** "families whose professionals don't talk to each other." That is a diagnosis David gives, not a pain people search for. Keep as a proof point inside conversations and content.

**Not a fit (the filter):** low complexity, under $500k with no near-term path over it, project-only shoppers, the permanently fee-allergic. The Keystone framing filters these on purpose; a ~50% qualified close rate is the intended trade vs. the old free-plan ~80%.

**Content mix implication (adjusts the 90-day mix in OPERATING-BRIEF):** retirement transition ~50%, owner-exit-as-retirement ~15%, coordination/Keystone proof points ~10%, local/real-life ~10%, sudden transitions ~10%, David POV/referral-partner ~5%.

**Compliance guardrail:** never name specific employers (Eastman, Ballad, etc.) — endorsement risk. Use situation-specific instead: "retiring with a pension in East Tennessee," "the five years before your last paycheck," "401(k) plus pension election decisions." Same search intent, no named employer.

---

## 3. Where Clients Come From (and the channel plan)

Actual sources: ~40% Google search, ~40% referrals (friends/clients; CPA referrals got harder after Talley Tax launched — CPAs now see a competitor), 10-20% random (seminars, social). Explore-call tracker (Jan-Jun 2026) confirms: Google 15/30 calls with a strong qualified rate; referrals 9/30 with the highest qualified rate.

### Channel A — Google / local (defend the moat, then extend)
- David is one of the only advisors in the area with many Google reviews. This is the moat behind the 40-50% Google share. **Defend it:** keep review velocity up (within Cambridge rules), monitor competitors' counts.
- GBP posting cadence already automated via the engine. Keep.
- **Extend:** situation-specific local SEO pages generated from transcripts through the existing explainer-page + compliance-PDF workflow ("retirement paycheck," "pension election," "Roth window," each × plain-English × local framing). Target: own the long tail in a metro this size with ~40 good pages.
- Audit Search Console: what queries drive the 15 Google calls — branded vs. intent. Build pages toward the intent queries that already show impressions.

### Channel B — Post-call conversion and reactivation (cheapest revenue in the business)
- **Book the strategy session live at the end of the explore call.** Do not leave it to a 2-3 day email. Target: session-booking 50% → 70%+. Worth ~8 clients/yr at current volume alone.
- Same-day follow-up: short personalized recap + "what we need from you" (engine can draft from call notes; Stephenee sends).
- **Dormant-100 reactivation:** ~100 previously-qualified prospects sit in Mailchimp. Quarterly reactivation campaign + inclusion in the weekly letter. Even 3-5 reactivated clients = $45-75k/yr recurring at near-zero cost.
- Nurture track for qualified-but-stalled: they get the weekly letter + a 3-touch sequence.

### Channel C — Email nurture (the missing layer, now the connective tissue)
- Mailchimp exists: ~500 contacts (200 clients, 150 guide/seminar prospects, 100 dormant qualified, ~30 COIs). Rudimentary. Claude gets API access (key lives in content-pipeline/.env only).
- **Weekly plain-English letter** assembled by the engine from that week's transcript/reuse queue, approved in the review app, sent to prospects + clients (clients forward it; it does referral work too).
- **Gated guides:** turn existing reuse-layer one-pagers/FAQs into downloadable guides behind an email capture on the site. Feeds the list from the 40% Google traffic that isn't ready to book.

### Channel D — Referrals and COIs
- Client referrals: give clients a repeatable sentence (the positioning sentence) and a forwardable artifact (the weekly letter, specific videos).
- COIs: estate attorneys and other non-competing professionals move up; CPAs de-emphasized as a channel (Talley Tax tension is real). Quarterly COI-facing brief ("what I'm seeing with retiring households this quarter") drafted by the engine.
- Seminars stay opportunistic (they produce qualified calls; the sheet shows it) — engine can produce seminar follow-up packs.

### Channel E — The content engine (trust layer, not lead gen)
- Its job: when anyone checks David out — post-referral, post-search, post-seminar, post-tax-appointment — they find a deep, current, unmistakably-David body of work, and it converts the check-out moment.
- Secondary job: feed every other channel (letter content, guide content, SEO pages, COI briefs, GBP posts, social presence).
- Volume target: enough talking-head videos to feed the system (several/week per David's cadence), quality per social-content-principles.

---

## 4. Sequencing: fix conversion → capture → volume

**Phase 1 (July): stop the bleeding + instrument**
1. Book-on-the-call process change (David + Stephenee; script tweak, zero build)
2. Tracker upgrade: strategy-session and close columns actually maintained (engine can assist/backfill); UTM tagging on all engine-scheduled links; Calendly webhook → leads ledger with source
3. Mailchimp audit once API key is in .env

**Phase 2 (July-Aug): the nurture layer**
4. Weekly letter v1 (engine-drafted, review-app approved)
5. Dormant-100 reactivation campaign #1
6. Same-day follow-up pack for qualified calls

**Phase 3 (Aug-Sep): capture + SEO**
7. First gated guide live on site (retirement-paycheck theme) wired to Mailchimp
8. First batch of situation-specific explainer pages through compliance workflow
9. Search Console audit → page roadmap

**Phase 4 (Sep-Oct): scale volume + cockpit**
10. Review-app → cockpit redesign (Today view, pipeline view, phone approval, Record Next queue, per-asset results once attribution flows)
11. Increase recording cadence against the new mix; analytics feedback loop informs prompts

**Measurement targets:** explore calls 5/mo → 8/mo by Sep → 11-12/mo by Dec. Qualified rate hold ≥55%. Session-booking 50% → 70%. Monthly one-page scorecard (calls, qualified, sessions, closes, by source) — engine-generated.

---

## 5. Parked Decisions (dated so they don't drift)

- **Talley Tax membership opening** (currently Keystone-grads only; 12 returns in trial year; the constraint is positioning, not capacity or compliance). Revisit **October 2026** ahead of tax season. Note: the tracker already shows a Talley Tax-sourced qualified call; tax-to-advisory is a real pipeline if positioned carefully.
- **Hiring trigger:** revisit when Keystone pace sustainably exceeds ~3/month or pipeline forecasts it.
- **David-personal X account** and broader personal-brand build: deferred per DISTRIBUTION-ARCHITECTURE; personal LinkedIn only for now.
- **YouTube** remains excluded from automated posting for compliance.

---

## 6. Division of Labor

- **David:** records, approves, takes calls, makes the parked decisions, supplies judgment.
- **Stephenee:** post-call process, sends (nothing sends autonomously).
- **Claude:** drafts everything, builds the attribution/nurture/capture machinery, reads analytics and produces the scorecard + "record this next" recommendations, redesigns the cockpit, keeps this plan current as facts change.
- **Compliance (Cambridge):** blog/site pages via PDF approval workflow; social via review-app approval; no named employers; no testimonials/endorsement claims without the proper path; education-not-advice framing throughout.
