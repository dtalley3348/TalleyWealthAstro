# Content Pipeline Status

Last updated: June 23, 2026

This file records what is currently built in the local Talley Wealth video pipeline, what is dry-run only, what is live, and what still needs work.

Root:

`/Users/davidtalley/Code/talley-wealth-astro-site-main/content-pipeline`

Review app:

`http://localhost:4505`

Current batch mode:

- Passive intake is paused with `work/.automation-paused`.
- `com.talley.reviewserver` is still running.
- `com.talley.icloudbridge` and `com.talley.contentpipeline` are unloaded until `scripts/resume-automation.sh` is run.

## Current State

The local pipeline can process a talking-head video end to end from a file in the iCloud-backed inbox into:

- trimmed and pause-cut master video
- Whisper transcript
- branded captioned vertical video
- clean 9:16, 4:5, 1:1, and 16:9 versions
- smart open-eyes cover image
- social captions
- X thread pack
- X-native extra text posts
- Google Business Profile copy
- carousel slide spec and rendered PNG slides
- approval markdown
- review board entry
- dry-run Metricool schedule and payloads
- durable content index and reuse queue candidates

Nothing is currently posting live. Metricool is configured for dry-run payload generation.

## Folders

- `inbox/`: symlink to iCloud Drive at `~/Library/Mobile Documents/com~apple~CloudDocs/TalleyPipeline/Inbox`.
- `inbox-local/`: local processing inbox copied from iCloud by the bridge.
- `work/`: scratch files, logs, transcripts, trim outputs, `.done/` markers, dry-run evidence.
- `output/<video>/`: finished video, cover, captions, social pack, carousel, X pack, content log.
- `approval-queue/`: one local approval markdown file per processed video.
- `content-index.json`: searchable inventory of processed videos, transcripts, routing recommendations, approvals, and output paths.
- `content-inventory.csv`: spreadsheet-friendly inventory export.
- `reuse-backlog.json`: item-level reuse queue for blog, landing-page brief, FAQ, one-pager, email, and website snippet candidates.
- `reuse-output/`: generated local reuse drafts.
- `broll/`: source b-roll bank and frame samples.
- `audio-beds/`: approved instrumental audio-bed library and manifest for B-roll overlay shorts.
- `overlay-specs/`: specs for text-on-b-roll overlays.
- `remotion/`: Remotion project for captioned video, carousel slides, covers, and overlays.
- `launchd/`: plist definitions for bridge, content watcher, and review server.

## Key Scripts

- `scripts/bridge.mjs`: copies iCloud inbox files into `inbox-local/`. It now detects iCloud placeholders and calls `brctl download` before copying.
- `scripts/watch-run.sh`: scans `inbox-local/`, classifies files, runs talking-head or b-roll processing, renders pending carousels/overlays, and rebuilds review HTML.
- `scripts/pause-automation.sh`: unloads the iCloud bridge and watcher and writes the pause marker.
- `scripts/resume-automation.sh`: reloads the iCloud bridge and watcher and removes the pause marker.
- `scripts/run.sh`: main talking-head pipeline.
- `scripts/02-trim.sh`: edge trim plus long middle-pause cutting.
- `scripts/cut-pauses.mjs`: removes interior silence longer than the configured threshold.
- `scripts/01-transcribe.sh`: extracts audio and runs Whisper.
- `scripts/build-captions.mjs`: turns Whisper word timestamps into caption pages.
- `scripts/03-reframe.sh`: clean platform aspect ratios.
- `scripts/cover-picker.mjs`: smart face/open-eyes cover selection.
- `scripts/finalize-cover.mjs`: final cover choice check.
- `scripts/draft-content.mjs`: local OpenAI drafting for social pack, carousel spec, blog draft when eligible, and content log.
- `scripts/draft-x-pack.mjs`: X-native thread drafting.
- `scripts/draft-x-pack.mjs`: X-native thread and extra text-post drafting.
- `scripts/build-content-index.mjs`: scans local outputs and writes `content-index.json` plus `content-inventory.csv`.
- `scripts/build-reuse-backlog.mjs`: turns routing recommendations into stable item-level reuse queue entries in `reuse-backlog.json`.
- `scripts/generate-reuse-draft.mjs`: manually generates local markdown reuse drafts under `reuse-output/<reuse-id>/`.
- `scripts/render-carousel.mjs`: renders carousel PNG slides from `slides.json`.
- `scripts/stage-blog.mjs`: stages eligible blog drafts into the Astro site data.
- `scripts/print-blog-pdf.mjs`: prints a staged blog page to PDF for compliance review.
- `scripts/build-review.mjs`: rebuilds `review.html`.
- `scripts/review-server.mjs`: serves the review app at port 4505. Its "Build schedule" action now runs schedule generation, Metricool dry-run payload generation, and R2 media upload.
- `scripts/sync-metricool-status.mjs`: checks Metricool brand/platform status.
- `scripts/schedule.mjs`: creates `schedule.json` and `schedule.csv` from approved assets.
- `scripts/metricool-dry-run.mjs`: creates Metricool-shaped local payloads without posting.
- `scripts/prepare-metricool-media.mjs`: copies scheduled video/carousel files into a deployable public media folder and writes `work/metricool-media-manifest.json`.
- `scripts/upload-metricool-media-r2.mjs`: uploads scheduled video/carousel files to a separate Cloudflare R2 bucket and writes `work/metricool-media-manifest.json`.
- `scripts/metricool-live.mjs`: guarded live Metricool writer. Supports text-only X items and media items when the media manifest points to public URLs that Metricool can normalize.
- `scripts/reset.sh`: wipes generated content.

## Main Commands

Manual run for a single file:

```bash
cd /Users/davidtalley/Code/talley-wealth-astro-site-main/content-pipeline
./scripts/run.sh inbox-local/IMG_4459.MOV
node scripts/render-carousel.mjs output/IMG_4459/carousel/slides.json output/IMG_4459/carousel
node scripts/build-review.mjs
```

Bridge iCloud files into the local inbox:

```bash
node scripts/bridge.mjs
```

Build a dry-run schedule:

```bash
node scripts/sync-metricool-status.mjs
node scripts/schedule.mjs
node scripts/metricool-dry-run.mjs
```

Refresh content intelligence and reuse candidates:

```bash
node scripts/build-content-index.mjs
node scripts/build-reuse-backlog.mjs
node scripts/build-content-index.mjs
```

Generate a local reuse draft:

```bash
node scripts/generate-reuse-draft.mjs <reuse-id>
```

Install launch agents:

```bash
./scripts/install-bridge.sh
./scripts/install-watcher.sh
./scripts/install-review-server.sh
```

Check launch agents:

```bash
launchctl list | rg 'talley|contentpipeline|icloudbridge|reviewserver'
```

## Automation Status

Currently loaded:

- `com.talley.reviewserver`: loaded and running.
- `com.talley.icloudbridge`: currently paused/unloaded.
- `com.talley.contentpipeline`: currently paused/unloaded.

Backlog status:

- Generated outputs, approval notes, work files, schedules, dry-run payloads, local inbox copies, and b-roll test segments were deleted.
- Current iCloud pipeline inbox videos were deleted because David is redoing the batch.
- `inbox-local/` is clean and contains explicit `Broll/` and `TalkingHead/` route folders.
- iCloud Inbox contains explicit `Broll/` and `TalkingHead/` route folders.
- Passive intake should remain paused until David is ready to upload the next batch.

## B-roll Intake

Current b-roll routing:

- Normal workflow: upload videos into the main `TalleyPipeline/Inbox` folder from the phone.
- `scripts/classify.sh` now calls `scripts/classify-visual.mjs` first for unlabeled videos, using sampled frames plus light audio metadata to classify `talkinghead`, `broll`, or `uncertain`.
- Optional override folders still exist: `TalleyPipeline/Inbox/Broll` and `TalleyPipeline/Inbox/TalkingHead`.
- Filename overrides also work: names containing `broll` / `b-roll` force b-roll; names containing `talkinghead` / `talking-head` force talking-head.
- If the vision classifier cannot run, the older audio-silence heuristic is used as a fallback.

Current b-roll processing:

- `process-broll.mjs` slices clips into usable segments.
- It samples a frame for each segment.
- If `OPENAI_API_KEY` is present, it writes a concrete visual description, tags, mood, visual category, use cases, avoid-when notes, brand fit, and quality notes into `broll-library.json`.
- `build-review.mjs` now shows a visible b-roll bank in the review app.

Current B-roll overlay audio:

- Raw b-roll source audio is intentionally not used by default.
- `audio-beds/manifest.json` controls which instrumental beds are approved and enabled.
- `scripts/add-audio-bed.mjs <file>` copies a licensed/owned MP3, M4A, WAV, or AAC into `audio-beds/library/` and enables it.
- `scripts/select-audio-bed.mjs <overlay-spec>` shows the audio decision for a given overlay.
- `scripts/render-overlay.mjs` selects an approved bed when available, mixes it quietly through Remotion, and writes the audio decision back to the overlay spec.
- If no approved bed exists, B-roll overlays render silently and the review app shows `Audio: silent`.
- Trending/platform-native audio should remain a manual finishing step, not an automated Metricool/API default.

Verified:

- A disposable generated b-roll smoke clip was sliced, described, displayed in the review app, and then removed by reset.

## iCloud Download Boundary

The iPhone Shortcut saves files into iCloud Drive. macOS sometimes shows the file before the bytes are actually downloaded locally. In that state, the file can look real but have `0B` local disk usage, and a copy attempt can fail with:

```text
Unknown system error -11
```

The bridge has been updated to handle this automation path:

- check local disk blocks before copying
- if the file is a placeholder, call `/usr/bin/brctl download <file>`
- skip copying until the next bridge pass sees real local bytes
- then copy into `inbox-local/`

So yes: the forced iCloud download behavior is now part of the automated bridge script. The remaining thing to verify is a fresh phone upload with the watcher re-enabled after backlog cleanup.

## Recent Verified Test

Test asset:

`IMG_4459.MOV`

Observed path:

- iCloud inbox file appeared first as a placeholder.
- `brctl download` pulled it local.
- `bridge.mjs` copied it into `inbox-local/`.
- `run.sh` processed it end to end.
- `render-carousel.mjs` rendered 7 carousel PNGs.
- `build-review.mjs` rebuilt the review board.
- `metricool-dry-run.mjs` produced 8 dry-run payloads.
- No posting or uploading happened.

Generated output folder:

`output/IMG_4459/`

Main captioned file:

`output/IMG_4459/captioned_vertical_9x16.mp4`

Pause cutting:

- one interior pause removed
- removed about 3.53 seconds
- raw pause was around the 20 to 24 second mark

Original dry-run schedule for `IMG_4459` before X extras:

- 2026-06-23 10:00 Google Business Profile post
- 2026-06-23 11:00 Instagram video
- 2026-06-23 21:00 X thread
- 2026-06-24 09:00 Facebook video
- 2026-06-25 08:00 LinkedIn video
- 2026-06-26 11:00 Instagram carousel
- 2026-06-27 09:00 Facebook carousel
- 2026-06-28 08:00 LinkedIn carousel

Upgraded dry-run schedule after X extras:

- 2026-06-23 09:30 X thread
- 2026-06-23 10:00 Google Business Profile post
- 2026-06-23 11:00 Instagram video
- 2026-06-24 09:00 Facebook video
- 2026-06-25 08:00 LinkedIn video
- 2026-06-26 09:30 X extra 1
- 2026-06-26 11:00 Instagram carousel
- 2026-06-27 09:00 Facebook carousel
- 2026-06-28 08:00 LinkedIn carousel
- 2026-06-29 09:30 X extra 2
- 2026-07-02 09:30 X extra 3
- 2026-07-05 09:30 X extra 4

## Dry-Run And Live Boundaries

Current `.env` state:

- `METRICOOL_DRY_RUN=true`
- `METRICOOL_LIVE_WRITE` is not set in `.env`, so live writes require a one-off command prefix.
- `METRICOOL_ENABLE_X=auto`

Current approvals:

- `approvals.json` is `[]`

Meaning:

- No approved assets are currently queued for real scheduling.
- Metricool schedule payloads are generated locally by default.
- Live writes are blocked unless `METRICOOL_LIVE_WRITE=true` and `--confirm-live` are both present.
- The system must not post, publish, upload, or send unless David explicitly authorizes that in the current workflow.

## Reuse / Content Intelligence Layer

Current behavior:

- Every future completed talking-head pipeline run refreshes `content-index.json`, `content-inventory.csv`, and `reuse-backlog.json`.
- `content-index.json` stores each source video's transcript path/text, title, triage, pillar, persona fit, routing recommendations, source lines, approval state, selected assets, scheduled assets, timestamps, and output paths.
- `reuse-backlog.json` now uses stable item-level ids such as `img-4168__learning_center_faq`.
- The reuse queue supports `blog`, `landing_page_brief`, `learning_center_faq`, `one_pager`, `email_planning_note`, and `website_reuse_snippet`.
- Re-running the backlog builder does not duplicate recommendations and preserves statuses, notes, compliance status, and draft paths.
- The review app shows high-value reuse recommendations on each video card and a full reuse queue section below the asset cards.
- Reuse drafts are generated only when David clicks `Generate draft` or runs `scripts/generate-reuse-draft.mjs`; they are not generated automatically during video processing.
- Landing pages are briefs only. They are not created as live pages.
- Blog candidates stay visible in the queue, but the existing blog workflow remains the source of actual blog drafts.

Important Metricool boundary:

- X text threads and X extras are live-write verified at the API level.
- Metricool media ingestion is live-write verified at the API level with draft-only tests.
- Text-only GBP is still dry-run only until separately tested.
- Video and carousel posts now have a working public media path through Cloudflare R2.
- Therefore, dry-run success proves schedule/caption/platform shaping, while the live smoke tests prove the Metricool text-write, media-ingestion, and R2 public-media paths.

## Metricool Status

Canonical Metricool brand:

- Brand: Talley Wealth
- Brand/blog ID: `3305339`
- User ID: `2631611`
- X handle: `talleywealth`

Connected platform status from last local check:

- Facebook: connected
- Instagram: connected
- LinkedIn: connected
- Google Business Profile: connected
- YouTube: connected, but excluded from this automated posting workflow for compliance reasons
- X: connected as `talleywealth`

Legacy brand:

- `DO NOT USE - Legacy mytalleyfinancial.com`
- X was disconnected from the legacy brand.
- Leave it dormant unless cleanup is explicitly requested.

Metricool login email remains old-brand, but the active brand and platform connections are the Talley Wealth ones.

Live-write verification on June 22, 2026:

- Read-only profile check succeeded for Talley Wealth.
- Read-only scheduler list succeeded.
- A draft-only X test item was created through `scripts/metricool-live.mjs`.
- Metricool returned ID `340422124`, provider `twitter`, `draft: true`, and `autoPublish: false`.
- The scheduler list then returned one item.
- The test draft was deleted through the API.
- The scheduler list returned zero items afterward.
- A draft-only X image/media test was created through the API; Metricool copied the image to `static.metricool.com`; the test draft was deleted.
- A draft-only X video/media test was created with a public MP4 URL; Metricool copied the MP4 to `static.metricool.com`; the test draft was deleted.
- A draft-only Instagram Reel-shaped video test was created with a public MP4 URL; Metricool returned media and `instagramData.type: REEL`; the test draft was deleted.
- Final scheduler list returned zero items.

R2 public-media verification on June 23, 2026:

- Cloudflare R2 bucket `talley-pipeline-media` is active.
- Public development URL is enabled: `https://pub-39b74d81e39345909e29e5a82f0cac1d.r2.dev`
- `scripts/upload-metricool-media-r2.mjs` uploaded a disposable scheduled carousel PNG to R2.
- The public R2 URL returned `HTTP/1.1 200 OK`.
- `scripts/metricool-live.mjs --from-schedule --include-media` created a draft-only Metricool media item from the R2 URL.
- Metricool returned draft ID `340746457`, `draft: true`, `autoPublish: false`, and one retained media item.
- The Metricool draft was deleted through the API, and the final scheduler list returned zero items.
- The disposable local smoke schedule/output and R2 smoke object were deleted afterward.
- A narrow bucket-scoped R2 `Object Read & Write` token failed with `403 AccessDenied`; the working upload credential is an R2 `Admin Read & Write` token stored only in `.env`.

Media body shape verified:

- `media: ["https://public-file-url"]` is the working shape.
- `media: { mediaId: ... }` and `media: [{ mediaId: ... }]` were accepted by Metricool but media was silently dropped, so the live writer does not use those shapes.
- The live writer deletes a created draft and errors if Metricool returns fewer media items than expected.

## Approval Workflow

The review app is the working approval surface:

`http://localhost:4505`

Current intended flow:

1. Video lands in iCloud inbox from iPhone Shortcut.
2. Bridge copies it into `inbox-local/`.
3. Watcher processes it.
4. Review page shows video, cover, carousel, captions, X pack, approval note, and approval controls.
5. David approves or holds.
6. Scheduler reads `approvals.json`.
7. The review app's "Build schedule" action generates schedule files, Metricool dry-run payloads, and the R2 media manifest.
8. Video/carousel media assets are uploaded to Cloudflare R2 as part of that schedule action.
9. Live Metricool writes remain blocked unless `METRICOOL_LIVE_WRITE=true` and `--confirm-live` are both present.

The review UI now includes per-asset schedule toggles when those assets are present:

- Video
- Carousel
- Google Business Profile
- X thread
- X extras
- Blog

The toggles write to `asset-decisions.json`. The scheduler respects disabled toggles for video, carousel, GBP, X thread, and X extras. Blog remains a staging/PDF workflow rather than an auto-posting schedule item.

## Blog And PDF Workflow

Current blog status:

- Blog drafting exists in the pipeline but only runs when `draft-content.mjs` classifies a transcript as Website/Core eligible.
- `stage-blog.mjs` can turn `output/<video>/blog-draft.md` into a generated Astro blog page.
- `print-blog-pdf.mjs` can print the staged local page to `output/<video>/compliance/<slug>.pdf`.

Current limitation:

- Recent test files `IMG_4161`, `IMG_4168`, and `IMG_4459` did not generate blog drafts because the triage did not classify them as blog-worthy.

Desired workflow:

1. Transcript is classified as Website/Core or David toggles blog on.
2. Blog draft is generated.
3. Blog page is staged locally.
4. David opens the local page in the browser.
5. PDF is printed from that page for Cambridge compliance.
6. After approval and edits, the page can be published through the site workflow.

## Open Issues

- Need one clean passive end-to-end test with a fresh phone upload after intake is resumed.
- Need test one real approved pipeline video through the review app's Build schedule button, R2 media upload, and draft-only Metricool scheduling.
- Need more review UI polish: clearer "what happens if approved," better approval-note language, and more obvious blog/PDF controls.
- Need stronger X-native derivative quality control over time. The first implementation supports one thread plus up to four X extras.
- Need blog toggle behavior: if David turns blog on, stage the page and create the compliance PDF path.
- Need b-roll bank expansion and stronger matching rules before b-roll overlays become routine.
- Need final confirmation that `bridge.mjs` placeholder download behavior works in a fresh passive upload without manual intervention after the reset.

## Next Recommended Steps

1. Walk through the review/approval behavior in plain English before the new batch.
2. Resume passive intake only when David is ready to upload fresh files.
3. Drop one fresh phone video into the Shortcut folder and watch it go from iCloud to review board without manual commands.
4. Upload b-roll into `TalleyPipeline/Inbox/Broll` so the bank is intentionally classified.
5. Run one real approved video as a draft-only media scheduling rehearsal through R2, inspect in Metricool, then delete or keep as appropriate.
6. Keep `METRICOOL_DRY_RUN=true` for the full platform batch until a final live-posting rehearsal is approved.

## Practical Scheduling Recommendation

The current scheduler gave `IMG_4459` two posts each for Instagram, Facebook, and LinkedIn, but only one X thread. That is platform-fit correct for the current asset model, but not enough for X as a channel.

Recommended fix:

- Keep video and carousel counts moderate on Instagram, Facebook, and LinkedIn.
- Treat X as a higher-frequency text-native channel.
- For each strong transcript, generate:
  - one thread
  - one short standalone take
  - one quote-style post
  - one misconception-correction post
  - optionally one reply/continuation angle
- Schedule those X extras over the following 7 to 21 days.
- Do not force extra X posts from weak transcripts.

This increases X frequency without bloating the other platforms or reposting the same asset everywhere.
