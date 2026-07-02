# One-time setup (on your Mac)

You only do this once. After that, processing a video is a single command.

## 1. Install the tools

Most Macs have [Homebrew](https://brew.sh). Then:

```bash
# Video engine
brew install ffmpeg

# Whisper (transcription). Runs locally, downloads its model once on first use.
pip3 install -U openai-whisper
```

Node is already on your machine (the website repo uses it). Check with `node -v` (need 18+).

> Note: the `remotion/node_modules` folder that came with this project was installed in a Linux sandbox and won't run on macOS. Delete it and reinstall fresh:

```bash
cd content-pipeline/remotion
rm -rf node_modules
npm install
cd ..
```

The very first Remotion render also downloads a small headless browser once. That's automatic.

## 2. Test it on one clip

Drop a video into `inbox/`, then from inside `content-pipeline/`:

```bash
./scripts/run.sh inbox/your-clip.mov
```

When it finishes, open `output/your-clip/` for the clips and `approval-queue/your-clip.md` for the checklist. Tune the caption look anytime with `cd remotion && npm run studio`.

## 3. Feed it from a Photos album (optional, the convenient part)

Apple Photos isn't a regular folder, so you can't point the pipeline straight at an album. The bridge is a Shortcut that exports new videos to `inbox/`.

1. In Photos, make an album called **To Edit**.
2. Open the **Shortcuts** app, create a new **Personal Automation** (or a manual Shortcut to start).
3. Add the action **Find Photos**: filter where Album is *To Edit* and Media Type is *Video*.
4. Add **Save File** (from the Files actions), destination set to this `inbox/` folder, and turn off "Ask where to save."
5. Save. Now running that Shortcut drops any new videos from the album into `inbox/`, and you run `run.sh` on them.

> iCloud note: if your Photos uses "Optimize Mac Storage," full-resolution videos may live in the cloud, and the export step will download them first. If you want true zero-wait, turn on Photos > Settings > "Download Originals to this Mac." Otherwise expect a short download on export.

Later we can have Cowork watch `inbox/` and run the pipeline automatically whenever a new file appears, so the whole thing becomes: add clip to album, drafts and clips show up in the approval queue. That's the next automation step once the spine feels right.

## Settings you might touch

Everything tunable lives in `pipeline.config.json`:

- `whisper.model` - `small.en` is a good speed/quality balance. Use `medium.en` for higher accuracy if your Mac can spare the time.
- `trim.silenceThresholdDb` / `minSilenceSeconds` - how aggressively dead air is detected.
- `brand` - the navy and gold caption colors (already set to your brand).
- `captions.maxWordsPerLine` - how many words show on screen at once.
