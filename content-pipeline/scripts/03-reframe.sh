#!/usr/bin/env bash
# 03-reframe.sh  <input_video>  <out_dir>
# Produces the four social aspect ratios from a vertical master.
# Assumes subject is centered (selfie talking-head).
set -euo pipefail

INPUT="$1"
OUT="$2"
mkdir -p "$OUT"

enc() {
  local vf="$1"
  local dest="$2"
  ffmpeg -nostdin -y -loglevel error -i "$INPUT" -vf "$vf" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset veryfast \
    -c:a aac -b:a 192k -movflags +faststart "$dest"
}

echo "[reframe] 9:16 vertical (master copy)"
enc "scale=1080:1920:flags=lanczos,format=yuv420p" "$OUT/vertical_9x16.mp4"

echo "[reframe] 4:5 portrait"
enc "crop=1080:1350:0:285" "$OUT/portrait_4x5.mp4"

echo "[reframe] 1:1 square"
enc "crop=1080:1080:0:420" "$OUT/square_1x1.mp4"

echo "[reframe] 16:9 horizontal (blurred fill)"
ffmpeg -nostdin -y -loglevel error -i "$INPUT" -filter_complex \
 "[0:v]scale=480:854,boxblur=10:2,scale=1920:1080,setsar=1[bg];[0:v]scale=-1:1080[fg];[bg][fg]overlay=(W-w)/2:0" \
 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 21 -preset veryfast \
 -c:a aac -b:a 192k -movflags +faststart "$OUT/horizontal_16x9.mp4"

echo "[reframe] done -> $OUT"
