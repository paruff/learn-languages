# Changelog

All notable changes to Acquira are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer 2.0](https://semver.org/) (see AGENTS.md §9).

## [Unreleased]

### Fixed

- Accessibility: every page now starts with a "Skip to main content" link (in the learner's source language) that moves focus past the header and nav to the main content (U7).
- es-ES B1–C2 content reverted to the last PCIC-reviewed state. The #155 positional concept re-key had paired concepts with unrelated terms (e.g. `to-justify-the-position` with `cuestión de actualidad`) while dual `old / new` glosses passed the pairing gate; re-alignment now requires per-item human review (#185).
- fr-FR C1: 23 `exampleTranslation` values replaced so lesson pages show a translation of the actual French example instead of an unrelated en-GB sentence.
- CI: removed the unused import that kept `main` red since #179, and formatted the it-IT A2 YAML that Prettier had never checked.

### Added

- Optional end-of-session prompt "When and where will you do your next 10 minutes?", shown again on the next visit, with a locally generated `.ics` calendar entry; the self-sent report records whether it was used (L21, #243).

- Empty Diff Guard and Coverage Gate CI jobs, plus `npm run check:coverage` with a committed baseline.
- fr-FR C1 review-session and lesson e2e coverage restored; it-IT A1 review/lesson tests restored and coverage documented honestly (A1 24/24, A2 20/30, B1 35/35).
- Italian (it-IT) C1 realisations for all 25 shared C1 nodes, aligned concept-by-concept to the en-GB inventory, with a full C1 review session and lesson covered by Playwright (#165, #183).

### Changed

- Workflow: status lives on the Acquira project board; goal issues per milestone; owner decisions are `question` issues; new `DESIGN.md` (UI/UX design system) and `REVIEW.md` (code-review guidance); issue and PR templates; Copilot coding-agent setup steps (AGENTS.md §12).
- Supported-language docs now list it-IT and fr-FR A1–C2; `spec.md` C7 points at the real `concept-images/index.yaml` path.

## [0.1.0] - 2026-10-04

First tagged release. Captures everything shipped since the repository was created on 2026-09-19 (see `git log` and the closed issues for the per-change detail).

### Added

- Review loop with active recall (prompt → attempt → reveal → self-grade) and SM-2 spaced repetition, scoped per language pair and direction.
- Five languages (en-GB, pt-PT, es-ES, de-DE, fr-FR), each usable as source or target; CEFR A1–C2 content for pt-PT, es-ES and de-DE, and A1–B2 content for fr-FR with C1/C2 still pending behind the retention gate.
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
