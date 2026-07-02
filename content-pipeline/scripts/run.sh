#!/usr/bin/env bash
# run.sh <input_video>
# Phase 1 spine: transcript -> trim -> captions render -> multi-format -> approval queue.
# Run from the content-pipeline/ directory:  ./scripts/run.sh inbox/clip.mov
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"

INPUT="$1"
[ -f "$INPUT" ] || { echo "No such file: $INPUT"; exit 1; }
NAME="$(basename "${INPUT%.*}")"

WORK="$HERE/work/$NAME"
OUTDIR="$HERE/output/$NAME"
mkdir -p "$WORK" "$OUTDIR"

review_ready() {
  [ -s "$OUTDIR/content-log.json" ] \
    && [ -s "$OUTDIR/social-pack.md" ] \
    && [ -s "$HERE/approval-queue/$NAME.md" ] \
    && ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUTDIR/captioned_vertical_9x16.mp4" >/dev/null 2>&1
}

cleanup_incomplete() {
  status=$?
  if [ "$status" -ne 0 ] && ! review_ready; then
    echo "[run] incomplete output for $NAME removed so it will not appear blank in review"
    rm -rf "$OUTDIR" "$HERE/approval-queue/$NAME.md"
  fi
  exit "$status"
}
trap cleanup_incomplete EXIT

echo "=== [1/5] trim dead air ==="
bash scripts/02-trim.sh "$INPUT" "$WORK"

echo "=== [2/5] transcribe (on the TRIMMED clip, so caption timing matches the video) ==="
bash scripts/01-transcribe.sh "$WORK/trimmed.mp4" "$WORK"

echo "=== [3/5] build captions ==="
node scripts/build-captions.mjs "$WORK/audio.json" "$OUTDIR/captions.json" 4

if node scripts/should-discard-transcript.mjs "$WORK/audio.json"; then
  :
else
  status=$?
  if [ "$status" -eq 10 ]; then
    set +e
    route_out="$(node scripts/route-signoff-visual.mjs "$INPUT" 2>&1)"
    route_status=$?
    set -e
    rm -rf "$OUTDIR" "$HERE/approval-queue/$NAME.md" 2>/dev/null || true
    if [ "$route_status" -eq 20 ]; then
      echo "[run] sign-off audio but useful visuals -> routing $NAME to b-roll ($route_out)"
      node scripts/process-broll.mjs "$INPUT" || true
      exit 0
    fi
    echo "[run] discard filler/sign-off clip -> $NAME ($route_out)"
    exit 0
  fi
  exit "$status"
fi

# No real speech? Then it's actually b-roll (ambient audio fooled the classifier).
# Re-route to the b-roll library and skip the talking-head render.
PAGES=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$OUTDIR/captions.json','utf8')).length)}catch(e){console.log(0)}")
if [ "${PAGES:-0}" -eq 0 ]; then
  echo "[run] no speech detected -> routing $NAME to the b-roll library instead"
  node scripts/process-broll.mjs "$INPUT" || true
  rm -rf "$OUTDIR" 2>/dev/null || true
  exit 0
fi

echo "=== [4/5] render branded captions (Remotion) ==="
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/trimmed.mp4")
mkdir -p remotion/public
cp -f "$WORK/trimmed.mp4" remotion/public/input.mp4
node -e "
const fs=require('fs');
const caps=JSON.parse(fs.readFileSync('$OUTDIR/captions.json','utf8'));
fs.writeFileSync('remotion/public/props.json', JSON.stringify({videoFile:'input.mp4', durationSec:$DUR, captions:caps}, null, 2));
"
( cd remotion && npx remotion render src/index.ts Captions "$OUTDIR/captioned_vertical_9x16.mp4" --props=public/props.json )

echo "=== [5/5] multi-format reframes (clean, no captions) ==="
bash scripts/03-reframe.sh "$WORK/trimmed.mp4" "$OUTDIR"

echo "=== cover (smart frame) ==="
node scripts/cover-picker.mjs "$NAME" || true

echo "=== queue for approval ==="
cat > "$HERE/approval-queue/$NAME.md" <<EOF
# Pending approval: $NAME
Generated: $(date)

## Video clips (output/$NAME/)
- captioned_vertical_9x16.mp4  (hero, branded captions)
- vertical_9x16.mp4 / portrait_4x5.mp4 / square_1x1.mp4 / horizontal_16x9.mp4 (clean)

## Transcript
- work/$NAME/audio.json

## Drafts (Phase 2 - not yet generated)
- [ ] Blog post
- [ ] Social captions (IG / FB / LinkedIn / X)
- [ ] Email
- [ ] Landing page copy

## Compliance
- [ ] Reviewed and approved for posting
EOF

echo "=== [phase 2] local drafting (social, carousel, blog when eligible) ==="
node scripts/draft-content.mjs "$NAME" || echo "[draft] skipped/failed for $NAME; video outputs are still ready"

echo "=== x-native drafting ==="
node scripts/draft-x-pack.mjs "$NAME" || echo "[x] skipped/failed for $NAME"

echo "=== stage blog page if eligible ==="
node scripts/stage-blog.mjs "$NAME" || echo "[blog] staging skipped/failed for $NAME"

echo "=== final cover check ==="
node scripts/finalize-cover.mjs "$NAME" || echo "[cover] final cover check skipped/failed for $NAME"

echo "=== content index + reuse queue refresh ==="
node scripts/build-content-index.mjs || echo "[index] refresh skipped/failed"
node scripts/build-distribution-routing.mjs || echo "[distribution] refresh skipped/failed"
node scripts/build-reuse-backlog.mjs || echo "[reuse] refresh skipped/failed"
node scripts/build-resource-threads.mjs || echo "[threads] refresh skipped/failed"
node scripts/build-content-index.mjs || echo "[index] final refresh skipped/failed"

echo "DONE. Review: approval-queue/$NAME.md"
