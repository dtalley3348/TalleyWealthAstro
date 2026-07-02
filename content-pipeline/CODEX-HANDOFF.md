# Codex Handoff — finish the automation

This is a working content pipeline for David Talley (Talley Wealth). The code is all here
and proven on a real batch. What's left is making the LOCAL processing fully automatic and
reliable on this Mac, so David drops clips into a Photos/iCloud album and never runs a
command. That's your job. You run directly on the machine and can test, which is exactly
what this last mile needs.

Root: `/Users/davidtalley/Code/talley-wealth-astro-site-main/content-pipeline`

## How the pipeline flows

1. Phone Shortcut saves a video into an iCloud Drive folder:
   `~/Library/Mobile Documents/com~apple~CloudDocs/TalleyPipeline/Inbox`
   (symlinked into the project as `inbox/`).
2. A bridge copies new videos from iCloud into `inbox-local/` (a plain local folder).
3. A watcher scans `inbox-local/`, classifies each clip, and processes it.
4. Outputs land in `output/<name>/` and a review board shows them for approval.

## Folders

- `inbox/` — symlink to the iCloud inbox (phone drop target).
- `inbox-local/` — plain local folder the watcher reads (bridge copies here).
- `work/` — scratch: audio, transcripts, trimmed masters, `.done/` markers, logs.
- `output/<name>/` — per video: captioned_vertical_9x16.mp4, the 4 reframes, carousel/slide-*.png,
  cover.jpg, captions.json, and (written later) social-pack.md, blog-draft.md.
- `output/broll-overlays/` — rendered text-on-b-roll shorts.
- `broll/clips`, `broll/frames`, `broll-library.json` — the b-roll bank.
- `overlay-specs/` — JSON specs for overlay shorts to render.
- `approval-queue/` — per-video checklists.
- `remotion/` — Remotion project (compositions: Captions, CarouselSlide, TextOnBroll, TitleCard).
- `pipeline.config.json`, `DRAFTING-PLAYBOOK.md`, `line-bank.json` — config + rules.

## Scripts (all in `scripts/`)

- `bridge.mjs` — copies new videos iCloud `inbox/` -> `inbox-local/` (skips already-bridged / already-done). THE ONLY THING THAT TOUCHES iCLOUD.
- `watch-run.sh` — scans `inbox-local/`, classifies (classify.sh), runs `run.sh` on talking-heads and `process-broll.mjs` on b-roll, renders pending carousels and overlay specs, regenerates `review.html`. Has a mkdir lock; safe to run repeatedly.
- `classify.sh <video>` — prints talkinghead | broll | uncertain (silence-ratio heuristic; filename/`broll/` override).
- `run.sh <video>` — trim -> transcribe (Whisper medium.en) -> build captions -> (no-speech guard re-routes to b-roll) -> Remotion caption render -> 4 reframes -> smart cover -> local Phase 2 drafting via `draft-content.mjs`.
- `process-broll.mjs <video>` — slices raw b-roll into ~6-8s segments, catalogs them (status needs-description, approved:false).
- `cover-picker.mjs`, `render-cover.mjs` — smart-frame cover / title-card cover.
- `draft-content.mjs <name>` — local AI writing pass. Reads `work/<name>/audio.json` plus the local knowledge docs, then writes `social-pack.md`, `carousel/slides.json`, optional `blog-draft.md`, and `content-log.json`. Requires `OPENAI_API_KEY` in `content-pipeline/.env`; without it, writes `draft-request.md` and leaves the video outputs intact.
- `render-carousel.mjs`, `render-overlay.mjs` — Remotion stills/video for carousels and overlays.
- `build-review.mjs` — writes the static `review.html`.
- `review-server.mjs` — live review board at http://localhost:4505 (approve videos, cover toggle, approve b-roll, Build schedule).
- `schedule.mjs` — lays approved posts onto a staggered calendar -> schedule.json/csv.
- `process-now.sh` — manual fallback: bridge + watch-run in one go.
- `reset.sh` — wipes all generated content.
- Installers: `install-watcher.sh`, `install-bridge.sh`, `install-review-server.sh`.
- launchd plists in `launchd/`: `com.talley.contentpipeline` (watcher), `com.talley.icloudbridge` (bridge), `com.talley.reviewserver` (board).

## What is already done — DO NOT rebuild

- The video pipeline, carousel renderer, b-roll slicing/overlays, scheduler, and review board are built and working.
- The writing layer is being moved local so the system no longer depends on Claude/Cowork. `scripts/draft-content.mjs` now owns social posts, carousel wording, blog drafts, and content-log generation for talking-head clips. It needs `OPENAI_API_KEY` in `content-pipeline/.env` to produce the polished assets passively. Without a key it writes `draft-request.md` instead of fake copy.

## What to finish (the actual task)

Make local processing fully automatic with zero recurring manual steps:

1. The bridge must run automatically. The blocker: a background launchd agent cannot read
   iCloud Drive without Full Disk Access, which is a one-time GUI grant. Please pick and
   verify the cleanest approach ON THIS MACHINE:
   - (a) Get the launchd bridge (`com.talley.icloudbridge`) working with a one-time Full
     Disk Access grant on the node binary (`which node`), and make that grant as painless as
     possible for David (e.g. reveal the exact binary in Finder so it's a single drag/add); or
   - (b) Run the bridge (and/or watcher) as a persistent user-session process that inherits
     iCloud access without Full Disk Access; or
   - (c) Any approach you can verify makes "drop in album -> processed automatically" work.
2. Ensure the watcher (`com.talley.contentpipeline`) runs automatically on `inbox-local/`
   (no Full Disk Access needed; it only reads local files). Confirm the loaded plist points
   at `inbox-local`.
3. Ensure the review board (`com.talley.reviewserver`, port 4505) runs automatically.
4. End-to-end test: drop one clip in the album, confirm it shows up processed in the review
   board with no command run by David.

## Environment notes

- Node: confirmed `which node` is `/usr/local/bin/node` on this Mac; launchd plists use that path.
- Whisper: `/opt/homebrew/bin/whisper`, model `medium.en` (set in pipeline.config.json).
- ffmpeg via Homebrew. Remotion downloads a headless browser once on first render.
- Remotion deps: `cd remotion && npm install` if `node_modules` is missing.
- Brand: navy `#243445`, gold `#BF8C4D`; needle mark at `remotion/public/needle-mark.png`.
- Do NOT post anything anywhere. Posting (Metricool) is a separate future step the user drives.

## Division of labor

- Codex (this machine): all local processing, automation, installs, keeping the bridge /
  watcher / review board running reliably.
- Local AI writer: `scripts/draft-content.mjs` handles the former Cowork writing pass once `OPENAI_API_KEY` is configured.
- David/Codex review: content judgment, approvals, and any future posting decisions.
