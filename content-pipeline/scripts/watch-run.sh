#!/usr/bin/env bash
# watch-run.sh
# Invoked by the launchd agent when the inbox changes (and every few minutes as a
# safety net). For each new, fully-downloaded video it:
#   - classifies talking-head vs b-roll
#   - talking-head: runs the full content pipeline
#   - b-roll: catalogs it into the b-roll library
#   - uncertain: flags it for a quick human confirm, leaves it for next time
# Then it renders any carousel that has slides but no images yet.
# Safe to run repeatedly.
set -uo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.local/bin:$PATH"

mkdir -p work/.done work/.uncertain
if [ -e "work/.automation-paused" ]; then
  echo "[watch] $(date '+%H:%M:%S') automation paused, skipping"
  exit 0
fi

LOCKDIR="work/.watcher.lock"
if ! mkdir "$LOCKDIR" 2>/dev/null; then
  echo "[watch] $(date '+%H:%M:%S') another run in progress, skipping"; exit 0
fi
trap 'rmdir "$LOCKDIR" 2>/dev/null || true' EXIT

ts() { date '+%H:%M:%S'; }
review_ready() {
  local name="$1"
  [ -s "output/$name/content-log.json" ] \
    && [ -s "output/$name/social-pack.md" ] \
    && [ -s "approval-queue/$name.md" ] \
    && ffprobe -v error -show_entries format=duration -of csv=p=0 "output/$name/captioned_vertical_9x16.mp4" >/dev/null 2>&1
}
cleanup_incomplete_review_output() {
  local name="$1"
  if ! review_ready "$name"; then
    mkdir -p "work/.failed-output"
    if [ -d "output/$name" ]; then
      rm -rf "work/.failed-output/$name"
      mv "output/$name" "work/.failed-output/$name"
      echo "[watch] $(ts) preserved incomplete review output for $name -> work/.failed-output/$name"
    fi
    rm -f "approval-queue/$name.md"
  fi
}
notify_failure() {
  local name="$1"
  local reason="$2"
  /usr/bin/osascript -e "display notification \"${name}: ${reason}\" with title \"Talley Pipeline needs attention\"" >/dev/null 2>&1 || true
}
write_failure_log() {
  local name="$1"
  local src="$2"
  local status="$3"
  local message="$4"
  mkdir -p work/.failed
  {
    echo "time=$(date -Iseconds)"
    echo "source=$src"
    echo "source_name=$(basename "$src")"
    echo "source_size=$(stat -f%z "$src" 2>/dev/null || echo "")"
    echo "source_mtime=$(stat -f '%Sm' -t '%Y-%m-%d %H:%M:%S' "$src" 2>/dev/null || echo "")"
    echo "duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src" 2>/dev/null | awk '{printf "%d:%02d", $1/60, $1%60}' || echo "")"
    echo "status=$status"
    echo "message=$message"
    [ -d "work/$name" ] && echo "partial_work=work/$name"
    [ -d "output/$name" ] && echo "partial_output=output/$name"
  } > "work/.failed/$name.log"
}

while IFS= read -r -d '' f; do
  name="$(basename "${f%.*}")"
  [ -e "work/.done/$name" ] && continue

  # fully downloaded + not still growing?
  s1=$(stat -f%z "$f" 2>/dev/null || echo 0); sleep 2; s2=$(stat -f%z "$f" 2>/dev/null || echo 0)
  if [ "$s1" != "$s2" ]; then echo "[watch] $(ts) $name still downloading"; continue; fi
  if [ "${s2:-0}" -lt 100000 ]; then echo "[watch] $(ts) $name placeholder/too small, skip"; continue; fi

  fp_out="$(node scripts/media-fingerprint.mjs check "$f" "$name" 2>&1)"
  fp_status=$?
  if [ "$fp_status" -eq 10 ]; then
    touch "work/.done/$name"
    echo "[watch] $(ts) duplicate skipped: $name ($fp_out)"
    continue
  elif [ "$fp_status" -ne 0 ]; then
    echo "[watch] $(ts) fingerprint check failed for $name: $fp_out"
  fi

  label="$(bash scripts/classify.sh "$f" 2>/dev/null || echo uncertain)"
  echo "[watch] $(ts) $name classified as: $label"

  case "$label" in
	    talkinghead)
	      if bash scripts/run.sh "$f"; then
	        node scripts/media-fingerprint.mjs register "$f" "$name" >/dev/null 2>&1 || true
	        touch "work/.done/$name"
        if [ -e "approval-queue/$name.md" ]; then
          echo "[watch] $(ts) done $name -> approval-queue/$name.md"
        elif node -e "const fs=require('fs');let x=[];try{x=JSON.parse(fs.readFileSync('broll-library.json','utf8'))}catch{};process.exit(x.some(i=>i.parent==='${name}')?0:1)" >/dev/null 2>&1; then
          echo "[watch] $(ts) routed + cataloged b-roll $name"
        else
          echo "[watch] $(ts) skipped $name (no review asset created)"
        fi
	      else
	        cleanup_incomplete_review_output "$name"
	        write_failure_log "$name" "$f" "pipeline_failed" "Pipeline failed before review-ready output was created. Source video is still in inbox-local."
	        notify_failure "$name" "processing failed; source video was kept"
	        echo "[watch] $(ts) FAILED pipeline for $name"
	      fi
	      ;;
    broll)
      if node scripts/process-broll.mjs "$f"; then node scripts/media-fingerprint.mjs register "$f" "$name" >/dev/null 2>&1 || true; touch "work/.done/$name"; echo "[watch] $(ts) sliced + cataloged b-roll $name"
      else write_failure_log "$name" "$f" "broll_failed" "B-roll processing failed. Source video is still in inbox-local."; notify_failure "$name" "b-roll processing failed; source video was kept"; echo "[watch] $(ts) FAILED slicing $name"; fi
      ;;
	    *)
	      touch "work/.uncertain/$name"
	      write_failure_log "$name" "$f" "classification_uncertain" "Pipeline could not confidently classify this upload as talking-head or b-roll. Source video is still in inbox-local."
	      notify_failure "$name" "needs manual classification"
	      echo "[watch] $(ts) $name is UNCERTAIN. Confirm type, then move/rename or drop in broll/ to route it."
	      ;;
  esac
done < <(find inbox-local -type f \( -iname '*.mov' -o -iname '*.mp4' -o -iname '*.m4v' \) -print0 | sort -z)

# Auto-render any carousel that has slides but no rendered images yet.
for sj in output/*/carousel/slides.json; do
  [ -e "$sj" ] || continue
  dir="$(dirname "$sj")"
  if [ ! -e "$dir/slide-01.png" ]; then
    echo "[watch] $(ts) rendering carousel: $sj"
    node scripts/render-carousel.mjs "$sj" "$dir" || echo "[watch] $(ts) carousel render failed: $sj"
  fi
done

# Auto-render any text-on-b-roll overlay spec that hasn't been rendered yet.
for spec in overlay-specs/*.json; do
  [ -e "$spec" ] || continue
  id="$(basename "${spec%.json}")"
  if [ ! -e "output/broll-overlays/$id.mp4" ]; then
    echo "[watch] $(ts) rendering overlay: $id"
    node scripts/render-overlay.mjs "$spec" || echo "[watch] $(ts) overlay render failed: $id"
  fi
done

node scripts/build-review.mjs >/dev/null 2>&1 || true
echo "[watch] $(ts) pass complete"
exit 0
