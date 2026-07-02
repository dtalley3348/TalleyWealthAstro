# Audio Beds

Put owned or properly licensed MP3, M4A, WAV, or AAC files in `audio-beds/library/`.

Use:

```bash
node scripts/add-audio-bed.mjs /path/to/track.mp3 --name "Warm Ambient" --mood "calm, steady, optimistic"
```

The pipeline only uses beds that are marked `approved: true` in `audio-beds/manifest.json`.

Brand rules:

- No vocals.
- No recognizable trending/platform audio unless it is separately licensed for this use.
- No aggressive beat drops, finance-commercial stock music, or dramatic cinematic swells.
- Keep the rendered volume low. The default is `0.08`.
- If a post truly needs a native trending sound, mark it for manual finishing inside the platform instead of baking it into the automated file.
