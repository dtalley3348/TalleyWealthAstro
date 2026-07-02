#!/usr/bin/env bash
# pause-automation.sh -- stop passive intake while keeping the review app available.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
BRIDGE="$HOME/Library/LaunchAgents/com.talley.icloudbridge.plist"
WATCHER="$HOME/Library/LaunchAgents/com.talley.contentpipeline.plist"

launchctl unload "$BRIDGE" 2>/dev/null || true
launchctl unload "$WATCHER" 2>/dev/null || true
touch "$HERE/work/.automation-paused"

echo "Passive intake paused."
echo "Review app stays available if com.talley.reviewserver is loaded."
echo "Resume with: $HERE/scripts/resume-automation.sh"
