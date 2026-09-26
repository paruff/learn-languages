#!/bin/bash
# Non-blocking devcontainer setup: opencode config sync, git hooks,
# Playwright browsers, and tool self-healing guards.
#
# Invoked detached from post-create.sh (first create) and postStartCommand
# (every start, so a failed run is retried without a rebuild).
#
# Concurrency/failure model:
#   - Exits immediately if the done marker exists (setup already succeeded).
#   - `flock -n` on a lock file: exits if another run holds it. The kernel
#     drops the lock automatically when the holder dies (even SIGKILL on
#     container stop), so a crash mid-run can't leave a stale lock behind.
#   - On failure (`set -e`) the marker is never written and the next
#     container start retries the whole block.
#   - Waits for node_modules/.bin/lefthook (created by post-create's blocking
#     `npm ci`) before steps that need installed deps, so a start that races
#     the first post-create can't run `npx playwright` against a missing tree.

LOG="$HOME/.devcontainer-setup.log"
MARKER="$HOME/.devcontainer-setup.done"

[ -f "$MARKER" ] && exit 0
# flock ships with util-linux (required in the Debian base image). Fail loudly
# rather than treat "flock missing" as "lock held" — `|| exit 0` would then
# silently skip setup forever.
command -v flock >/dev/null 2>&1 || { echo "[setup] flock unavailable" >&2; exit 1; }
exec 9>"$HOME/.devcontainer-setup.lock"
flock -n 9 || exit 0

{
  set -e
  export PATH="$HOME/.local/bin:$PATH"

  # npm ci (post-create, blocking) gates anything that needs node_modules.
  DEPS_READY=0
  for _ in $(seq 1 180); do
    if [ -x node_modules/.bin/lefthook ]; then
      DEPS_READY=1
      break
    fi
    sleep 5
  done
  if [ "$DEPS_READY" -ne 1 ]; then
    echo "[setup] timed out waiting for npm ci (node_modules/.bin/lefthook)"
    exit 1
  fi

  echo "[setup] opencode config sync..."
  bash opencode/sync.sh
  echo "[setup] git hooks..."
  npx lefthook install || true
  echo "[setup] Playwright browsers (fast-path no-op when baked)..."
  npm run install:browsers
  echo "[setup] opencode CLI (only if missing)..."
  command -v opencode >/dev/null || npm install -g opencode-ai@1.18.30
  echo "[setup] uv/uvx (only if missing)..."
  command -v uvx >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
  echo "[setup] done"
  date > "$MARKER"
} >> "$LOG" 2>&1 < /dev/null
