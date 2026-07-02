#!/usr/bin/env bash
# install-bridge.sh -- installs the iCloud -> local inbox bridge.
# IMPORTANT one-time step: grant Full Disk Access to Node so the bridge can read iCloud.
#   System Settings > Privacy & Security > Full Disk Access > + >
#   press Cmd+Shift+G, enter: /usr/local/bin/node  > enable it.
# Then run this script.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
PLIST="$HERE/launchd/com.talley.icloudbridge.plist"
DEST="$HOME/Library/LaunchAgents/com.talley.icloudbridge.plist"

mkdir -p "$HOME/Library/LaunchAgents"
cp "$PLIST" "$DEST"
launchctl unload "$DEST" 2>/dev/null || true
launchctl load "$DEST"

echo "Bridge installed. It copies new iCloud inbox videos into inbox-local."
echo "  Log:  $HERE/work/bridge.log"
echo "If the log shows 'needs Full Disk Access', grant it to /usr/local/bin/node (see top of this script)."
