# DevContainer Dockerfile for learn-languages
# Provides a fully-configured development environment with all tools.
# Build context = repo root (devcontainer.json: "context": ".."). Layers are
# ordered cache-first: repo-independent tool installs come before any COPY of
# repo files, so routine repo edits only invalidate the layers that consume them.

FROM mcr.microsoft.com/devcontainers/typescript-node:26-bookworm

# Install additional system packages (Playwright OS deps). curl + python3 ship
# in the base image — scripts/install-browsers.sh and opencode/validate.sh need them.
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

# Playwright browsers are baked into the image at this path (see below);
# node-writable so post-create's guard can top up after a version bump
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN mkdir -p /ms-playwright && chown node:node /ms-playwright

# Switch to node user (devcontainers default); tool installs below must land in
# paths the devcontainer user can read and execute
USER node

# uv/uvx — Serena MCP runtime (opencode.jsonc mcp.serena). Installed to
# ~/.local/bin, then pre-warmed so first `uvx --from serena-agent serena` at
# runtime is a cache hit instead of a 70-package resolve + download.
ENV PATH="/home/node/.local/bin:${PATH}"
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && uvx --from serena-agent serena --version

# opencode CLI, pinned (post-create skips this when the layer already provided it)
ARG OPENCODE_VERSION=1.18.30
RUN npm install -g opencode-ai@${OPENCODE_VERSION}

# Playwright browsers: install ONLY the playwright package at the lockfile's
# version — a full `npm ci` would unpack the whole 623-package tree and run repo
# lifecycle scripts (prepare -> lefthook) inside the image build.
# --chown: COPY defaults to root ownership, but the RUN below executes as node
# and must write package.json + node_modules into /tmp/pw.
COPY --chown=node:node package-lock.json /tmp/pw/package-lock.json
RUN cd /tmp/pw \
    && printf '{"name":"pw-bake","private":true}\n' > package.json \
    && PW_VER=$(node -p "require('/tmp/pw/package-lock.json').packages['node_modules/@playwright/test'].version") \
    && npm install --no-save --no-package-lock playwright@"$PW_VER"
# Download through the repo's curl + local-relay installer (the stock CDN
# downloader hangs on this network). Zip cache is removed in the SAME layer so
# it never commits — the INSTALLATION_COMPLETE markers in /ms-playwright are
# what the runtime fast path keys on, not the zips.
COPY --chown=node:node scripts/install-browsers.sh /tmp/pw/install-browsers.sh
RUN cd /tmp/pw \
    && bash install-browsers.sh \
    && rm -rf /home/node/.cache/playwright-zips

# opencode config: sync.sh resolves paths relative to itself, so run it from the
# copied tree — npm ci's the pinned plugin deps (SHA-pinned superpowers) into
# ~/.config/opencode and validate.sh checks the invariants
COPY --chown=node:node opencode/ /tmp/opencode-src/
RUN bash /tmp/opencode-src/sync.sh && rm -rf /tmp/opencode-src

# node_modules named volume (see devcontainer.json mounts): docker seeds an
# empty volume from this image path on first mount — pre-creating it
# node-owned keeps the mountpoint writable for the node user. This is what
# separates the container's linux dependency tree from the host's darwin one
# (they previously clobbered each other via the bind-mounted workspace).
USER root
RUN mkdir -p /workspaces/learn-languages/node_modules \
    && chown -R node:node /workspaces/learn-languages

USER node
WORKDIR /workspaces/learn-languages
CMD ["sleep", "infinity"]
