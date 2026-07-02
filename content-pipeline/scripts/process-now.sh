#!/usr/bin/env bash
# process-now.sh -- run this from Terminal/Codex after dropping a batch into the album.
# It pulls new videos off iCloud (Terminal has iCloud access, no special permission needed)
# and processes the whole batch: classify, caption, format, carousel, b-roll, review page.
set -uo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"

echo "==> Pulling new videos from iCloud..."
node scripts/bridge.mjs || true

echo "==> Processing the batch (this can take a while for a lot of clips)..."
bash scripts/watch-run.sh

echo "==> Done. Open your review board to see the results."
