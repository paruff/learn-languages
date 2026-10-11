# Changelog

All notable changes to Acquira are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer 2.0](https://semver.org/) (see AGENTS.md §9).

## [Unreleased]

## [0.1.0] - 2026-10-04

First tagged release. Captures everything shipped since the repository was created on 2026-09-19 (see `git log` and the closed issues for the per-change detail).

### Added

- Review loop with active recall (prompt → attempt → reveal → self-grade) and SM-2 spaced repetition, scoped per language pair and direction.
- Five languages (en-GB, pt-PT, es-ES, de-DE, fr-FR), each usable as source or target; CEFR A1–C2 content for pt-PT, es-ES and de-DE, and A1–B2 for fr-FR.
- Learning-science features: interleaved review queue (#44), opt-in typed recall (#45), calibration feedback (#46), post-session reflection (#89), vocabulary images (#34, #35), and lesson exercises.
- Offline use: a service worker caches pages and assets after the first online visit (spec Q7).
- Progress backup: download and restore learner progress as a JSON file from the progress page (spec S5).
- An in-app 404 page with a link back into the app.
- `intent.md`, `spec.md` and `plan.md`: the intent → spec → plan flow that governs product work from now on, plus `docs/learning-science-references.md`.
- CI gate: `npm audit --omit=dev --audit-level=high`.

### Fixed

- Privacy: the Fraunces display font is self-hosted. Previously every page loaded it from Google Fonts, which sent each visitor's IP address to Google (spec S3).
- Progress page layout shift (CLS up to 0.27): the next-up card and backup section now appear in the same step as the level bars instead of being pushed down after first paint.
- Corrupt, blocked or full browser storage no longer breaks the review or progress pages; unreadable saved values fall back to a fresh state (spec S7).

### Security

- Updated `http-cache-semantics` (build-time dependency of Astro) to address GHSA-ch52-4w7c-c8xp.

[Unreleased]: https://github.com/paruff/learn-languages/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/paruff/learn-languages/releases/tag/v0.1.0
