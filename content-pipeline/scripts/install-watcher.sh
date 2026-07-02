#!/usr/bin/env bash
# install-watcher.sh  -- run once on the Mac to turn the auto-watcher on.
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$HERE/launchd/com.talley.contentpipeline.plist"
DEST="$HOME/Library/LaunchAgents/com.talley.contentpipeline.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST" "$DEST"

# Reload cleanly if it was already loaded.
launchctl unload "$DEST" 2>/dev/null || true
launchctl load "$DEST"

echo "Watcher installed and running."
echo "  Logs:   $HERE/work/watcher.log"
echo "  Stop:   launchctl unload \"$DEST\""
echo "  Start:  launchctl load \"$DEST\""
