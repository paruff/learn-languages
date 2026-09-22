# learn-languages (Acquira)

> A research-backed, CEFR-aligned language-learning platform — live as **Acquira**. Static-first, privacy-respecting, offline-capable, and language-pair-agnostic: en-GB, pt-PT, es-ES, de-DE, and fr-FR all work as either source or target.

[![CI](https://github.com/paruff/learn-languages/actions/workflows/ci.yml/badge.svg)](https://github.com/paruff/learn-languages/actions/workflows/ci.yml)
[![Deploy](https://github.com/paruff/learn-languages/actions/workflows/deploy.yml/badge.svg)](https://github.com/paruff/learn-languages/actions/workflows/deploy.yml)
[![Lighthouse](https://img.shields.io/badge/lighthouse-perf%20%3E%3D95%20%7C%20a11y%20100-brightgreen)](https://github.com/paruff/learn-languages/actions)

## Overview

**Acquira** delivers structured, CEFR-aligned language learning through a static site deployed to GitHub Pages. It started as European Portuguese only (see `discovery-brief.md` for the original MVP scope) — the abstract CEFR-node + realisation content model proved out past that single pair, and pt-PT/es-ES/de-DE now have full A1–C2 content, with fr-FR at an early walking-skeleton stage. No backend, no accounts, no tracking — just evidence-based retrieval-practice principles (spacing, interleaving, generation effect, calibration feedback — see `AGENTS.md` §1.0), SM-2 spaced repetition, and transparent CEFR progress tracking.

### Key Features

| Feature | Description |
|---------|-------------|
| **CEFR-Aligned Content** | Abstract, language-agnostic Can-Do nodes mapped to per-language realisations (vocabulary, grammar, cultural notes) |
| **Any Language Pair** | en-GB, pt-PT, es-ES, de-DE, fr-FR all work as source *or* target — routes and the language-pair selector are derived from content, not hardcoded |
| **Spaced Repetition** | SM-2 algorithm with 4-grade recall (Again/Hard/Good/Easy), offline in `localStorage`, scoped per pair *and* direction |
| **Evidence-Based Review** | Interleaved due-card queue, opt-in typed-recall (generation effect), calibration feedback on over-confident grading |
| **Transparent Progress** | Per-skill Can-Do mastery dashboard; exportable, verifiable |
| **Native Pronunciation** | Web Speech API, exact-locale voice selection (e.g. `pt-PT` not `pt-BR`, `es-ES` not `es-MX`) |
| **Privacy by Default** | Zero PII, no cookies, no third-party trackers, `localStorage` only |
| **Static Deployment** | GitHub Pages via GitOps; instant loads, global CDN, zero cost |

---

## Quick Start

```bash
# Install dependencies
npm ci

# Start dev server (background mode)
npm run dev

# Run all quality gates
npm run typecheck && npm run lint && npm run test:unit && npm run build

# Deploy preview (automatic on PR)
# Deploy production (automatic on merge to main)
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Content (YAML) │────►│  Zod Validation  │────►│  Astro Build    │
│  cefr-nodes/    │     │  (CI gate)       │     │  (static HTML)  │
│  realisations/  │     └──────────────────┘     └────────┬────────┘
└─────────────────┘                                      │
                                                         ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  GitHub Pages   │◄────│  GitHub Actions  │◄────│  dist/ artifact │
│  (CDN, HTTPS)   │     │  (deploy.yml)    │     └─────────────────┘
└─────────────────┘     └──────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| SSG | Astro 5.x |
| Interactive Islands | Vue 3.5 |
| Schema Validation | Zod 3.x |
| SRS Algorithm | SM-2 (custom, pure TS) |
| Testing | Vitest + Playwright |
| Deployment | GitHub Actions → GitHub Pages |

---

## Content Model

The platform uses a **two-tier content architecture** that separates pedagogical intent from language expression:

```
CEFR Node (language-agnostic)  ──►  Realisation (language-specific)
```

| Tier | Purpose | Example |
|------|---------|---------|
| **CEFR Node** | Abstract Can-Do statement | "Can greet people and respond to greetings" (A1-GREET-001) |
| **Realisation** | PT-PT vocabulary + grammar | "Olá", "Bom dia", "Boa tarde" with examples |

This enables future language pairs (EN→ES, FR→PT, etc.) without duplicating curriculum structure.

---

## Spaced Repetition (SM-2)

- **Algorithm**: SuperMemo SM-2 (pure TypeScript, zero dependencies)
- **Grades**: Again (1) / Hard (2) / Good (3) / Easy (4)
- **Storage**: `localStorage` scoped by `languagePair:direction:itemId`
- **Mastery**: Interval ≥ 21 days
- **Test Coverage**: 100% (unit tests in `src/lib/srs.test.ts`)

---

## Project Structure

```
learn-languages/
├── .github/workflows/     # CI/CD pipelines
├── .lefthook.yml          # Git hooks (pre-commit, pre-push)
├── discovery-brief.md     # JTBD, personas, acceptance criteria
├── specification-design.md # Full technical specification
├── src/
│   ├── components/        # Vue islands + Astro components
│   ├── content/           # Zod-validated content collections
│   │   ├── cefr-nodes/    # Abstract Can-Do nodes (YAML)
│   │   └── realisations/  # Language-specific content
│   ├── lib/               # Pure functions (SRS, storage, progress)
│   ├── pages/             # File-based routing (i18n)
│   └── styles/            # CSS tokens + BEM components
├── tests/                 # Unit + E2E tests
└── AGENTS.md              # Agent governance (this repo's constitution)
```

---

## Development

### Prerequisites
- Node.js ≥20.18.0
- pnpm (recommended) or npm

### Commands

```bash
npm run dev              # Astro dev server (background)
npm run build            # Static export to dist/
npm run preview          # Preview production build locally

# Quality gates
npm run typecheck        # TypeScript strict check
npm run lint             # ESLint + Prettier
npm run validate:content # Zod schema validation
npm run test:unit        # Vitest with coverage
npm run test:e2e         # Playwright E2E
npm run lighthouse       # Lighthouse CI audit

# Git hooks (auto-installed via prepare)
npx lefthook install
```

### Git Hooks (Lefthook)

| Hook | Trigger | Runs |
|------|---------|------|
| `pre-commit` | Staged files | `lint-staged` (format + lint) + `tsc --noEmit` |
| `pre-push` | All files | `validate:content` + `test:unit` + `test:e2e` |

---

## Deployment

### GitOps Flow

1. **Push to `main`** → CI runs all gates
2. **All gates pass** → `deploy.yml` builds and deploys to GitHub Pages
3. **Rollback** → `git revert <sha>` on `main` triggers redeploy

### Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| Production | `https://paruff.github.io/learn-languages/` | Push to `main` |
| Preview | PR-specific (Cloudflare Pages optional) | Open PR |

---

## Contributing

### Commit Convention (Conventional Commits 1.0.0)

```
<type>[scope]: <description>

[body]

[footer]
```

| Type | Version Bump |
|------|--------------|
| `feat` | MINOR |
| `fix` | PATCH |
| `content` | PATCH (no schema change) |
| `refactor!` / `feat!` | MAJOR |

### SemVer 2.0

- **MAJOR**: Breaking schema/API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, content additions

---

## Documentation

| Document | Purpose |
|----------|---------|
| `discovery-brief.md` | Problem, JTBD, personas, acceptance criteria |
| `specification-design.md` | Architecture, data model, SRS, UI, testing, deployment |
| `AGENTS.md` | Agent governance, GitOps, conventions |
| `CHANGELOG.md` | Keep a Changelog format |

---

## License

MIT — see [LICENSE](LICENSE) for details.

Content authored for this project is CC-BY-4.0.

---

## Acknowledgments

- **Referencial Camões PLE** — Authoritative CEFR reference for Portuguese
- **SuperMemo SM-2** — Proven spaced repetition algorithm
- **Astro** — Islands architecture for optimal static sites
- **GitHub Pages** — Free, reliable static hosting