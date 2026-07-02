#!/usr/bin/env bash
# install-review-server.sh  -- run once on the Mac to start the review board.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$HERE/launchd/com.talley.reviewserver.plist"
DEST="$HOME/Library/LaunchAgents/com.talley.reviewserver.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST" "$DEST"
launchctl unload "$DEST" 2>/dev/null || true
launchctl load "$DEST"

echo "Review board running at http://localhost:4505"
echo "  Log:   $HERE/work/review-server.log"
echo "  Stop:  launchctl unload \"$DEST\""
