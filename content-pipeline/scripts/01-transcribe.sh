#!/usr/bin/env bash
# 01-transcribe.sh  <input_video>  <work_dir>
# Extracts audio and runs Whisper locally to produce a word-timestamped transcript.
# Runs on YOUR Mac (Whisper downloads its model once, then works offline).
set -euo pipefail

INPUT="$1"
WORK="$2"
mkdir -p "$WORK"

CFG="$(cd "$(dirname "$0")/.." && pwd)/pipeline.config.json"
MODEL="${WHISPER_MODEL:-$(node -e "try{process.stdout.write(require('$CFG').whisper.model||'medium.en')}catch(e){process.stdout.write('medium.en')}" 2>/dev/null || echo medium.en)}"

echo "[transcribe] extracting audio..."
ffmpeg -y -loglevel error -i "$INPUT" -vn -ac 1 -ar 16000 "$WORK/audio.wav"

echo "[transcribe] running whisper ($MODEL) with word timestamps..."
# openai-whisper CLI. Outputs audio.json into $WORK.
whisper "$WORK/audio.wav" \
  --model "$MODEL" \
  --language en \
  --word_timestamps True \
  --output_format json \
  --output_dir "$WORK" \
  --verbose False

# Whisper writes <basename>.json -> audio.json
echo "[transcribe] done -> $WORK/audio.json"
