#!/bin/bash
# Post-create script for devcontainer
# Blocking path: ONLY `npm ci` — everything else runs in the background so the
# container becomes usable in seconds instead of minutes.
# The image (.devcontainer/Dockerfile) already bakes uv/uvx + the serena cache,
# the pinned opencode CLI, Playwright browsers, and ~/.config/opencode — so the
# background script below is only self-healing guards for anything missing/stale.
# Background work is logged to ~/.devcontainer-setup.log and finishes with a
# marker at ~/.devcontainer-setup.done (see .devcontainer/wait-setup.sh).

set -e

echo "🚀 Setting up learn-languages devcontainer (fast path)..."

# Install Node dependencies (this also runs `prepare` -> `npx lefthook install`)
echo "📦 Installing Node dependencies (blocking)..."
# node_modules is a named volume (devcontainer.json mounts); a fresh volume
# can land root-owned depending on how the mountpoint was created — make
# sure the node user can write it before npm ci.
if [ -d node_modules ] && [ ! -w node_modules ]; then
  sudo chown -R "$(id -u):$(id -g)" node_modules
fi
npm ci

# Everything else runs detached so it does not hold up container readiness.
# Each step is a guard: the baked layers satisfy it instantly; only drift
# (edited opencode/, Playwright bump, missing tool) costs real work.
# The script is idempotent (marker + flock) and is re-launched from
# postStartCommand, so a failed run is retried on the next container start
# instead of requiring a rebuild.
LOG="$HOME/.devcontainer-setup.log"
MARKER="$HOME/.devcontainer-setup.done"
rm -f "$MARKER"

echo "⚙️  Remaining setup continues in the background (log: $LOG)"
setsid nohup bash .devcontainer/setup-bg.sh >/dev/null 2>&1 </dev/null &

echo "🎉 Blocking setup complete!"
echo "   Run 'npm run dev' to start the Astro dev server"
echo "   ⏳ Background setup still running — check:  tail -f ~/.devcontainer-setup.log"
echo "   ⏳ Before 'npm run test:e2e' or opencode:  bash .devcontainer/wait-setup.sh"
echo "   Run 'npm run validate:content' to validate content"
