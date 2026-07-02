#!/usr/bin/env bash
# 02-trim.sh  <input_video>  <work_dir>
# Trims leading/trailing dead air, then removes long interior pauses.
# Writes <work>/trimmed.mp4 (clean H.264 master).
set -euo pipefail

INPUT="$1"
WORK="$2"
mkdir -p "$WORK"

THRESH="${SILENCE_DB:--30}"
MINSIL="${MIN_SILENCE:-0.6}"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$INPUT")

echo "[trim] detecting silence..."
ffmpeg -nostdin -i "$INPUT" -af "silencedetect=noise=${THRESH}dB:d=${MINSIL}" -f null - 2> "$WORK/silence.log" || true

# Parse the log: trims leading silence (starts at ~0) and trailing silence
# (runs to the end). Mid-clip pauses are kept, so we never cut off a clip
# that ends while you're still talking.
RANGE=$(node "$(dirname "$0")/trim-range.mjs" "$WORK/silence.log" "$DUR")
START=$(echo "$RANGE" | cut -d' ' -f1)
END=$(echo "$RANGE" | cut -d' ' -f2)

EDGE="$WORK/trimmed.edges.mp4"

echo "[trim] keeping ${START}s -> ${END}s (source ${DUR}s)"
ffmpeg -nostdin -y -loglevel error -ss "$START" -to "$END" -i "$INPUT" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 19 -preset veryfast \
  -r 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart \
  "$EDGE"

echo "[trim] detecting long interior pauses..."
ffmpeg -nostdin -i "$EDGE" -af "silencedetect=noise=${THRESH}dB:d=${MIDDLE_MIN_SILENCE:-1.2}" -f null - 2> "$WORK/middle-silence.log" || true

node "$(dirname "$0")/cut-pauses.mjs" "$EDGE" "$WORK/middle-silence.log" "$WORK/trimmed.mp4" "${MIDDLE_MIN_SILENCE:-1.2}" "${MIDDLE_SILENCE_PAD:-0.2}"

echo "[trim] done -> $WORK/trimmed.mp4"
