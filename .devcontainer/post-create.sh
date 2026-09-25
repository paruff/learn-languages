#!/bin/bash
# Post-create script for devcontainer
# Runs after container is created to set up the development environment

set -e

echo "🚀 Setting up learn-languages devcontainer..."

# Install system dependencies for Playwright and PDF processing
echo "📦 Installing system dependencies..."
sudo apt-get update && sudo apt-get install -y \
  poppler-utils \
  xvfb \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpango-1.0-0 \
  libcairo2 \
  libatspi2.0-0 \
  2>/dev/null || true

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm ci

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install --with-deps chromium firefox webkit

# Install lefthook git hooks
echo "🪝 Installing git hooks..."
npx lefthook install

# Verify setup
echo "✅ Verifying setup..."
npm run typecheck --if-present 2>&1 | head -20 || true
npm run lint --if-present 2>&1 | head -20 || true

echo "🎉 Devcontainer setup complete!"
echo "   Run 'npm run dev' to start the Astro dev server"
echo "   Run 'npm run test:e2e' to run Playwright tests"
echo "   Run 'npm run validate:content' to validate content"