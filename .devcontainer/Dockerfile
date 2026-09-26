# DevContainer Dockerfile for learn-languages
# Provides a fully-configured development environment with all tools

FROM mcr.microsoft.com/devcontainers/typescript-node:26-bookworm

# Install additional system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    && rm -rf /var/lib/apt/lists/*

# Set up Playwright browsers directory (node-writable so post-create can install)
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN mkdir -p /ms-playwright && chown node:node /ms-playwright

# Switch to node user (devcontainers default)
USER node

# Working directory
WORKDIR /workspaces/learn-languages

# Default command
CMD ["sleep", "infinity"]