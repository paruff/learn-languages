#!/bin/bash
# Blocks until the background post-create setup has finished.
# Usage: bash .devcontainer/wait-setup.sh
MARKER="$HOME/.devcontainer-setup.done"
LOG="$HOME/.devcontainer-setup.log"
TIMEOUT=900
if [ -f "$MARKER" ]; then
  echo "✅ Devcontainer background setup already complete."
  exit 0
fi
echo "⏳ Waiting for background setup (log: $LOG)..."
ELAPSED=0
while [ ! -f "$MARKER" ]; do
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "❌ Timed out after ${TIMEOUT}s waiting for background setup." >&2
    echo "   Inspect the log for details:  tail -100 $LOG" >&2
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
echo "✅ Background setup complete."
