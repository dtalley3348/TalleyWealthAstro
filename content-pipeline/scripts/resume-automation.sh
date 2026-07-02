#!/usr/bin/env bash
# resume-automation.sh -- restart iCloud bridge and content watcher.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
BRIDGE="$HOME/Library/LaunchAgents/com.talley.icloudbridge.plist"
WATCHER="$HOME/Library/LaunchAgents/com.talley.contentpipeline.plist"

rm -f "$HERE/work/.automation-paused"
launchctl unload "$BRIDGE" 2>/dev/null || true
launchctl unload "$WATCHER" 2>/dev/null || true
launchctl load "$BRIDGE"
launchctl load "$WATCHER"

echo "Passive intake resumed."
echo "Bridge log:  $HERE/work/bridge.log"
echo "Watcher log: $HERE/work/watcher.log"
