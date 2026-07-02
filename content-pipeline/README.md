# Talley Content Pipeline

A contained system for turning a raw talking-head video into postable, on-brand social clips, with everything landing in an approval queue before anything goes out.

This is **Phase 1: the spine.** It takes one video and produces a transcript, a trimmed master, a branded captioned vertical clip, and the other social aspect ratios. Phase 2 (blog / social / email / landing-page drafts from the transcript) gets layered on after the spine is solid.

Nothing here auto-posts. Every output waits in `approval-queue/` for your review, which is also where compliance sign-off happens.

## The flow

```
raw video (inbox/)
   -> transcript          (Whisper, local)
   -> trimmed master      (ffmpeg, dead air removed)
   -> branded captions    (Remotion, navy + gold word highlight)
   -> 4 aspect ratios     (ffmpeg: 9:16, 4:5, 1:1, 16:9)
   -> approval queue      (you review + approve)
```

## Folder map

| Folder | What's in it |
|---|---|
| `inbox/` | Drop raw videos here (or have a Photos Shortcut drop them, see SETUP.md) |
| `work/` | Scratch: extracted audio, transcript JSON, trimmed master |
| `output/<name>/` | Finished clips + captions.json for each video |
| `approval-queue/` | One markdown checklist per video, pending your review |
| `scripts/` | The pipeline steps (transcribe, trim, reframe, orchestrator) |
| `remotion/` | The branded caption template (React video) |
| `pipeline.config.json` | Brand colors, Whisper model, trim and format settings |
| `BLOG-RESOURCE-BLUEPRINT.md` | The standard for deciding when a transcript deserves a blog/resource page and what that page must include |

`inbox/`, `work/`, `output/`, `approval-queue/`, and `node_modules` are git-ignored, so none of this touches your website repo or deploys.

## Running it (after one-time setup in SETUP.md)

From inside `content-pipeline/`:

```bash
./scripts/run.sh inbox/your-clip.mov
```

That runs the whole spine and writes a checklist to `approval-queue/your-clip.md`. Open `output/your-clip/` to see the clips.

## Run a single step

```bash
./scripts/01-transcribe.sh inbox/clip.mov work/clip      # transcript
./scripts/02-trim.sh        inbox/clip.mov work/clip      # trimmed master
./scripts/03-reframe.sh     work/clip/trimmed.mp4 output/clip   # aspect ratios
```

## Preview / tweak the caption look

```bash
cd remotion
npm run studio
```

Opens Remotion Studio in your browser where you can see the captions live and adjust styling in `src/brand.ts` and `src/Captions.tsx`.

## Hands-off mode (the auto-watcher)

Once turned on, you never run anything manually. A small macOS launch agent
watches the iCloud inbox and runs the pipeline automatically whenever a new clip
syncs in from your phone.

Turn it on once:

```bash
./scripts/install-watcher.sh
```

Pause or resume passive intake:

```bash
./scripts/pause-automation.sh
./scripts/resume-automation.sh
```

After that, drop any video into the inbox (phone Shortcut or a drag) and the watcher
sorts it automatically:

- Talking-head (has speech): runs the full pipeline; clips and checklist land in
  `output/` and `approval-queue/`.
- B-roll (little or no speech): auto-sliced into ~6-8s segments and added to the
  b-roll library (`broll-library.json`) with sampled frames. If `OPENAI_API_KEY`
  is set, the sampled frame is described and tagged automatically for later matching.
- Uncertain (the messy middle): flagged in `work/.uncertain/` for a quick confirm. To
  force a type, drop the file in `Inbox/Broll`, `Inbox/TalkingHead`, or put
  "broll" / "talking-head" in the filename.

It also auto-renders any carousel that has a `slides.json` but no images yet, so the
carousel render is never a manual step either.

- Live log: `work/watcher.log`
- Processed clips are tracked in `work/.done/` (delete a marker to reprocess).
- Stop it: `launchctl unload ~/Library/LaunchAgents/com.talley.contentpipeline.plist`

## Media hosting for Metricool

Video and carousel posts need public file URLs before Metricool can schedule them.
This pipeline uses a separate Cloudflare R2 bucket, not the website repo.
The R2 upload and Metricool draft-only media path were verified end to end.
The review app's `Build schedule` button now includes R2 media upload for scheduled video/carousel assets.
See `MEDIA-HOSTING.md`.

## What's intentionally NOT here yet (Phase 2)

- Blog / social / email / landing-page drafts from the transcript
- Captioned versions of the 4:5, 1:1, and 16:9 cuts (right now captions are baked into the 9:16 hero only)
- Pull-quote graphics and highlight-clip extraction
- Photos album auto-ingest (the Shortcut in SETUP.md covers this)
