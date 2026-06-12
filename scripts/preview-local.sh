#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="${NODE_BIN:-node}"
PORT="${PORT:-4336}"

cd "$ROOT_DIR"
exec "$NODE_BIN" node_modules/astro/bin/astro.mjs dev --host 127.0.0.1 --port "$PORT"
