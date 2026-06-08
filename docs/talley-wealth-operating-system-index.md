# Talley Wealth Operating System Index

Last updated: June 8, 2026

This is the top-level map for Talley Wealth operating work inside Codex. Use this before relying on chat memory.

The rule is simple:

- chats are for thinking
- docs are for memory
- systems are for execution

When an important decision is made in a chat, the durable version should be added to the right document below.

## Current Working Lanes

## Backfills

Use these when a future chat needs context from earlier mixed-use conversations without reading an entire transcript.

- [Context Backfill: Main Mixed-Use Chat](./context-backfill-main-chat-2026-06-05.md)
- [Context Backfill: Client Service Rhythm](./context-backfill-client-service-rhythm-2026-06-05.md)

### Brand, Voice, And Judgment

Start here when writing website copy, emails, video prompts, client-facing summaries, or anything that should "sound like David."

- [Knowledge Hub](./knowledge/README.md)
- [Voice Guide](./knowledge/voice-guide.md)
- [Interpretation Layer](./knowledge/interpretation-layer.md)
- [Point Of View Map](./knowledge/point-of-view-map.md)
- [Source Of Truth Rules](./knowledge/source-of-truth.md)
- [Compliance And Disclaimers](./knowledge/compliance-and-disclaimers.md)

Working shorthand:

When David says "make it sound like me," use the voice guide, interpretation layer, and point-of-view map together. Do not flatten the work into generic financial-advisor language.

### Website, SEO, And Deployment

Use these for website structure, search visibility, deployment handoffs, redirects, indexing, and the assurance plan after site updates.

- [Website Assurance And Growth Game Plan](./website-assurance-growth-game-plan.md)
- [SEO Strategy](./seo-strategy.md)
- [SEO URL Strategy Decisions](./seo-url-strategy-decisions.md)
- [SEO Route Consolidation Audit](./seo-route-consolidation-audit.md)
- [Keyword Map](./keyword-map.md)
- [Talley Wealth Market Architecture](./marketing/talley-wealth-market-architecture.md)
- [Target Market Alignment Audit](./target-market-alignment-audit.md)
- [Learning Center Rebuild Brief](./learning-center-rebuild-brief.md)
- [Analytics And Clarity Setup](./analytics-and-clarity-setup.md)

Current posture:

Website work should separate code changes from deployment handoff. Do not call a website issue resolved until local checks and live-host checks both make sense.

### Marketing Content System

Use these for video-led content, short-form prompts, repurposing transcripts, learning-center expansion, email snippets, and durable Talley Wealth beliefs.

- [Content Engine](./content-engine.md)
- [Social Content Principles](./knowledge/social-content-principles.md)
- [Talley Wealth Market Architecture](./marketing/talley-wealth-market-architecture.md)
- [Two-Lane Marketing System](./marketing/two-lane-marketing-system.md)
- [Client Service Market Rhythm](./marketing/client-service-market-rhythm.md)
- [Email Marketing Plan](./email-marketing-plan.md)
- [Compliance Content Workflow](./compliance-content-workflow.md)
- [Google Reviews And Local Insights](./google-reviews-and-local-insights.md)

Current posture:

The content system is moving toward micro-audience, situation-first prompts. Titles are working labels until the edited transcript exists. The stronger test is whether David wants to record it and whether the transcript reveals how he thinks.

### Relationship System: Slant, Mailchimp, Calendly, Zapier

Use these for prospect lifecycle, Slant/Mailchimp cleanup, Calendly entry paths, Zapier testing, tags, stages, dormant follow-up, and eventual Stephenee workflows.

- [Relationship System Decision Log](./marketing/reconciliation/relationship-system-decision-log.md)
- [Relationship System One Pager](./marketing/reconciliation/talley-wealth-relationship-system-one-pager.md)
- [Calendly Zapier Slant Test Log](./marketing/reconciliation/calendly-zapier-slant-test-log.md)
- [Explore Call Entry Path Production Design](./marketing/reconciliation/explore-call-entry-path-production-design.md)
- [Slant API Capability Map](./marketing/slant-api-capability-map.md)
- [Mailchimp Slant Lifecycle Audit](./marketing/mailchimp-slant-lifecycle-audit.md)
- [Mailchimp Categorization And Entry System](./marketing/reconciliation/mailchimp-categorization-and-entry-system.md)
- [Entry Path And Mailchimp Implementation Plan](./marketing/reconciliation/entry-path-mailchimp-implementation-plan.md)
- [Mailchimp One-Audience Migration Pass Plan](./marketing/reconciliation/mailchimp-one-audience-migration-pass-plan.md)
- [Mailchimp Pass 1 Architecture And Safety Map](./marketing/reconciliation/mailchimp-pass-1-architecture-safety-map.md)
- [Mailchimp Pass 2 Target Structure Build](./marketing/reconciliation/mailchimp-pass-2-target-structure-build.md)
- [Mailchimp Pass 3 Controlled Cleanup](./marketing/reconciliation/mailchimp-pass-3-controlled-cleanup.md)
- [Mailchimp Pass 4 Automation Foundation](./marketing/reconciliation/mailchimp-pass-4-automation-foundation.md)
- [Mailchimp Pass 5 Segment Readiness](./marketing/reconciliation/mailchimp-pass-5-segment-readiness.md)
- [Mailchimp Entry Path Cleanup And Consolidation](./marketing/reconciliation/mailchimp-entry-path-cleanup-and-consolidation-2026-06-08.md)
- [Mailchimp Tag Governance](./marketing/reconciliation/mailchimp-tag-governance.md)
- [Slant Mailchimp Sync Roadmap](./marketing/reconciliation/slant-mailchimp-sync-roadmap-2026-06-08.md)
- [Preferred Name Personalization Plan](./marketing/reconciliation/preferred-name-personalization-plan.md)
- [Mailchimp Slant Reconciliation Summary 2026-06-06](./marketing/reconciliation/mailchimp-slant-reconciliation-summary-2026-06-06.md)
- [Lifecycle System Map](./marketing/reconciliation/lifecycle-system-map.md)
- [Mailchimp Export Handoff](./marketing/reconciliation/mailchimp-export-handoff.md)
- [Latest Slant Lifecycle Summary](./marketing/reconciliation/slant-lifecycle-summary-latest.md)
- [Latest David Review Handoff](./marketing/reconciliation/david-review-handoff-latest.md)

Current posture:

Slant is the relationship truth. Mailchimp is the communication engine. Calendly can trigger only the Wealth Explore Call in Zapier. The published Zapier flow uses Webhooks `GET` plus a Filter before Webhooks `POST`, so it creates a Slant Prospect household only when no exact-email Slant household already exists. Creating a household at first Explore Call is intentional; Mailchimp remains individual-contact oriented. Code by Zapier was abandoned because the runtime timed out. The unused Formatter step was removed. Phone is mapped from Calendly `Scheduled Event Location` into Slant `phone_number`. A new-household note step posts Calendly Q&A context to Slant using `note__content` with Zapier `Unflatten = Yes`. Existing households still stop at the duplicate-prevention filter and do not yet receive a new note. David upgraded to Zapier Pro and the Zap was published; Zapier confirmed version `v1` is on. Published-Zap testing passed, the fake Calendly booking was canceled, and fake Slant households were destroyed in the Slant UI. Mailchimp API access is live locally. `Talley Wealth - Marketing` is the primary operational audience. On June 8, the newsletter endpoint was updated to send normalized tag IDs for guide/footer signups, normalized backfill was applied to 3 primary-audience records, and Mailchimp automation metadata showed 0 legacy tag matches. Relationship-core, Legacy Advisory, and Legacy Brokerage records were imported into the primary audience with 0 errors. Old `Talley Wealth` prospects are quarantined and must not be bulk-imported; the audit found 4 Slant-matched candidates, 12 obvious suppress/do-not-import records, and 261 manual-review records. Current next work is governed by the Slant Mailchimp Sync Roadmap: fix five lifecycle conflicts via dry-run, build the Slant-to-Mailchimp mirror dry-run, finish existing-household notes in the Explore Call Zap, rerun passive-entry tests, and only then revisit sending segments.

### Keystone Method And Client Deliverables

Use these for Keystone language, proposal structure, client deliverables, summary documents, and the distinction between the concentrated work and ongoing advisory.

- [Keystone Method](./knowledge/keystone-method.md)
- [Source Of Truth Rules](./knowledge/source-of-truth.md)

Current posture:

The public website remains the public source of truth for Keystone language unless David explicitly changes it. Keystone deliverables should feel personalized from real transcripts and notes, not like a generic AI summary.

### Client Service And Internal Ops

Use these for Slant workflows, service cadence, supplemental revenue, client status, and internal execution rules.

- [Slant Supplemental Revenue Workflow](./slant-supplemental-revenue-workflow.md)
- [Relationship System Decision Log](./marketing/reconciliation/relationship-system-decision-log.md)
- [Client Service Market Rhythm](./marketing/client-service-market-rhythm.md)

Current posture:

Service model is separate from lifecycle. Ongoing Advisory + Tax gets the normal advisory experience plus tax prep, withholding/estimate, and fall strategy touchpoints. Legacy relationships should not imply a proactive planning cadence that is not actually being delivered.

## Chat Organization

Do not treat chat titles as the source of truth. Use titles to make the active work easier to find.

Use the [Chat Routing And Memory Capture Protocol](./chat-routing-and-memory-capture-protocol.md) to decide:

- whether a conversation should stay in the current chat or move to another lane
- whether a decision or preference is important enough to save in a durable doc

Suggested pinned chats:

- `Talley OS - CRM, Mailchimp, Zapier`
- `Talley OS - Website + SEO`
- `Talley OS - Marketing Content`
- `Talley OS - Keystone Deliverables`
- `Talley OS - Client Service Model`
- `Talley OS - Stephenee AI Setup`

If a chat has covered too many topics, name it for the lane that is most likely to need the old context. Then rely on this index for everything else.

For the current mixed-use chat, a reasonable name is:

`Talley OS - Website, Marketing, CRM Build`

That acknowledges the mess instead of pretending it was only one thing.

## Pause List

These are not dead; they are paused until the next concrete trigger.

- Slant/Zapier production test: Zapier-native duplicate prevention is live in the published Zap. The published test created fake household `K0XhF7LXz3` with name, email, phone, Prospect type, and fake note `4BfOV9itVB`; cleanup was completed afterward. Existing households still stop at the duplicate-prevention filter and do not yet receive a new note.
- Stephenee AI operating manual: paused until the core relationship system is stable enough to hand off cleanly.
- Larger Mailchimp/Slant cleanup: Passes 1-5 established the primary Marketing audience, starter tags, safe cleanup, Slant-derived lifecycle tags, and first sending-lane readiness. Do not merge audiences until pre-send hygiene and COI/professional-network review are complete.

## Working Rule For Future Codex Sessions

Before making a material change in any lane:

1. Read this index.
2. Read the [Chat Routing And Memory Capture Protocol](./chat-routing-and-memory-capture-protocol.md).
3. Read the linked source-of-truth doc for the relevant lane.
4. Confirm what is current vs paused vs untested.
5. Make the smallest durable update that moves the system forward.
6. If a new decision is made, update the relevant doc before relying on chat memory.
