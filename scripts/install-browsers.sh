#!/bin/bash
# Offline-resilient Playwright browser installer.
#
# The stock Playwright downloader hangs (30s timeouts on every remote CDN
# host) on this network while curl succeeds. This script resolves the exact
# build zips via `playwright install --dry-run`, downloads them with curl,
# serves them from a local HTTP relay, and points PLAYWRIGHT_DOWNLOAD_HOST
# at the relay.
#
# Usage:
#   scripts/install-browsers.sh                    # everything test:e2e needs
#   scripts/install-browsers.sh webkit ffmpeg      # specific browser(s)
#
# Re-run after every Playwright version bump: build ids are version-specific
# (e.g. firefox-1543), so upgrades require fresh downloads.
#
# Zip cache: ${PLAYWRIGHT_ZIP_CACHE:-${XDG_CACHE_HOME:-$HOME/.cache}/playwright-zips}
# Requires: bash 3.2+, curl, python3. Compatible with macOS /bin/bash.

set -euo pipefail

if [ "$#" -gt 0 ]; then
  BROWSERS=("$@")
else
  BROWSERS=(chromium chromium-headless-shell firefox webkit ffmpeg)
fi

# Fast path: every requested browser already complete -> plain install, no network.
LOCATIONS=$(npx playwright install --dry-run "${BROWSERS[@]}" | sed -n 's/^ *Install location: *//p')
if [ -n "$LOCATIONS" ]; then
  ALL_COMPLETE=1
  while IFS= read -r loc; do
    if [ ! -f "$loc/INSTALLATION_COMPLETE" ]; then
      ALL_COMPLETE=0
      break
    fi
  done <<EOF
$LOCATIONS
EOF
  if [ "$ALL_COMPLETE" -eq 1 ]; then
    npx playwright install "${BROWSERS[@]}"
    echo "Playwright browsers already installed."
    exit 0
  fi
fi

command -v curl >/dev/null || { echo "error: curl is required" >&2; exit 1; }
command -v python3 >/dev/null || { echo "error: python3 is required" >&2; exit 1; }

ZIPS_DIR="${PLAYWRIGHT_ZIP_CACHE:-${XDG_CACHE_HOME:-$HOME/.cache}/playwright-zips}"
mkdir -p "$ZIPS_DIR"

echo "Fetching build zips into $ZIPS_DIR ..."
npx playwright install --dry-run "${BROWSERS[@]}" |
  sed -n 's/^ *Download url: *//p' |
  while IFS= read -r url; do
    rel=$(printf '%s' "$url" | sed -E 's|^https?://[^/]+||; s|^/dbazure/download/playwright||')
    dest="$ZIPS_DIR$rel"
    if [ -s "$dest" ]; then
      echo "  cached: $rel"
      continue
    fi
    mkdir -p "$(dirname "$dest")"
    echo "  fetch:  $url"
    curl -fsSL --retry 3 --retry-delay 1 --connect-timeout 10 -o "$dest" "$url"
  done

PORT=$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')
(cd "$ZIPS_DIR" && exec python3 -m http.server "$PORT" --bind 127.0.0.1) >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

RELAY_UP=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null --max-time 1 "http://127.0.0.1:$PORT/" 2>/dev/null; then
    RELAY_UP=1
    break
  fi
  sleep 0.3
done
if [ "$RELAY_UP" -ne 1 ]; then
  echo "error: local relay failed to start on port $PORT" >&2
  exit 1
fi

echo "Installing via local relay (http://127.0.0.1:$PORT) ..."
if PLAYWRIGHT_DOWNLOAD_HOST="http://127.0.0.1:$PORT" npx playwright install "${BROWSERS[@]}"; then
  echo "Playwright browsers installed via local relay."
  exit 0
fi

echo "error: install failed after relay download." >&2
echo "If a new dependency zip was not listed by --dry-run, re-run with that browser name:" >&2
echo "  scripts/install-browsers.sh <browser-name>" >&2
exit 1
