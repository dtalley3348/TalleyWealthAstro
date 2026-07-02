# Reuse Layer

This layer keeps useful transcript ideas from disappearing after a social post is created.

Nothing here posts, publishes, uploads, sends, or schedules live. It is local and review-gated.

## What Updates Automatically

After a talking-head video finishes drafting, `scripts/run.sh` now refreshes:

- `content-index.json`
- `content-inventory.csv`
- `reuse-backlog.json`

The index is a durable inventory of processed videos, transcripts, content logs, approval state, selected assets, and output paths.

The reuse backlog is an item-level queue created from routing recommendations in `output/<video>/content-log.json`.

## Resource Threads

Blog candidates can now become a `Resource Thread` when the source video is promising but not strong enough for a complete article yet.

- `8.0+` candidates can generate a full resource/blog preview from the current source.
- `7.0-7.9` candidates should usually get one follow-up recording first.
- `6.0-6.9` candidates stay source material with a follow-up option.
- Below `6.0`, keep the idea in the source library unless David manually revives it.

Follow-up prompts use the Daily Recording Starts shape and begin with a routing cue:

`Part 2 for: <exact resource title>.`

The cue is for the pipeline, not the audience. `scripts/build-resource-threads.mjs` detects that cue, links the new recording to the original blog candidate, trims the cue from clean social exports, and creates a combined horizontal resource video when Part 1 and Part 2 are both available. The combined video is used for blog embeds, YouTube Resource Publishing, timestamps, and compliance packages. The individual follow-up video can still be used as its own social asset.

## Existing Blog Companion Recordings

Older manually written blog posts use a sibling workflow called Blog Companion Recordings.

These are not `Part 2` recordings because they do not strengthen a generated resource candidate. They attach a new source video to an already-published blog so the article can later be refreshed into the newer resource-page format.

The routing cue is:

`Blog companion for: <exact blog title>. Prompt <prompt id>.`

The cue is still internal. `scripts/build-content-index.mjs` detects it and writes `blogCompanionCue` plus `blogCompanionTarget` onto the video record. `scripts/build-resource-threads.mjs` trims the cue from clean social exports and writes matches to `blog-companion-recordings.json`.

The companion prompts live in `blog-companion-prompts.json`. The Resource Publishing view shows them in the "Refresh Current Blogs" section with copyable full recording starts.

Once a companion video is recorded and processed, the intended next step is a refreshed blog preview that uses:

- the original manually written article,
- the companion video transcript,
- any existing calculator or tool context,
- the Blog Resource Blueprint visual structure,
- and 1 to 3 timestamped source moments when the video genuinely improves the article.

## Reuse Queue Types

The backlog can create these candidate items:

- `blog`
- `landing_page_brief`
- `learning_center_faq`
- `one_pager`
- `email_planning_note`
- `website_reuse_snippet`

Blog candidates are tracked in the queue, but the actual blog workflow still uses the existing video/blog process.

Landing pages are only briefs. The pipeline does not create live site pages automatically.

## Review App

Open:

`http://localhost:4505`

Each video card shows high-value future reuse signals near the top. The bottom of the app has a `Reuse queue` section where each candidate shows:

- type
- source video
- title/topic
- recommendation reason
- confidence
- status
- draft link when one exists

Available actions:

- Generate draft
- Open draft
- Mark needs review
- Mark approved
- Decline

Status changes persist to `reuse-backlog.json`.

## Generate Drafts Manually

Generate one draft:

```bash
cd /Users/davidtalley/Code/talley-wealth-astro-site-main/content-pipeline
node scripts/generate-reuse-draft.mjs <reuse-id>
```

Generate all candidate drafts:

```bash
node scripts/generate-reuse-draft.mjs --all-candidates
```

Generate only one type:

```bash
node scripts/generate-reuse-draft.mjs --all-candidates --type landing_page_brief
```

Drafts are written under:

`reuse-output/<reuse-id>/`

Possible draft files:

- `landing-page-brief.md`
- `learning-center-faq-draft.md`
- `one-pager-draft.md`
- `email-planning-note.md`
- `website-snippet-packet.md`
- `blog-workflow-note.md`

If `OPENAI_API_KEY` is missing, the generator writes a local `draft-request` style file instead of failing messily.

## Compliance

All reuse drafts are local drafts.

- Social/video scheduling still requires approval in the review app.
- Website, blog, one-pager, and long-form copy require human review.
- Website-bound material should get a webpage/PDF compliance review before publishing.
- Email drafts should be reviewed before sending.

## Backfill Path

To rebuild the inventory and queue from existing outputs:

```bash
node scripts/build-content-index.mjs
node scripts/build-reuse-backlog.mjs
node scripts/build-content-index.mjs
```

This is safe to rerun. Existing item statuses, notes, compliance status, and draft paths are preserved.
