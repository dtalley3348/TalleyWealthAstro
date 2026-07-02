#!/usr/bin/env bash
# reset.sh -- wipe all generated content so a fresh batch can run clean.
# Keeps: scripts, remotion templates + brand assets, docs, config, line-bank, the inbox.
# Clears: outputs, work files + done markers, approval notes, b-roll library +
#         clips + frames, overlay specs, approvals, schedules, dry-run payloads,
#         review.html, local inbox copies.
set -uo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"

read -r -p "This deletes all generated content (outputs, b-roll library, schedule). Type 'reset' to confirm: " ok
[ "$ok" = "reset" ] || { echo "Cancelled."; exit 0; }

rm -rf output/* 2>/dev/null || true
rm -rf work/* work/.done work/.uncertain work/.watcher.lock 2>/dev/null || true
rm -f approval-queue/*.md 2>/dev/null || true
rm -rf broll/clips/* broll/frames/* 2>/dev/null || true
rm -rf overlay-specs/* 2>/dev/null || true
rm -rf inbox-local/* 2>/dev/null || true
rm -f schedule.json schedule.csv metricool-dry-run.json asset-decisions.json review.html 2>/dev/null || true
echo "[]" > broll-library.json
echo "[]" > approvals.json
mkdir -p output work/.done broll/clips broll/frames overlay-specs inbox-local

echo "Reset complete. Drop fresh videos in and the pipeline starts clean."
