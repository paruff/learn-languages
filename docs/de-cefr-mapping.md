# German (de-DE) CEFR Mapping — Walking Skeleton

Tracks the CEFR reference-document verification and 5-node walking skeleton for **en-GB↔de-DE**, per issue #62. Mirrors `docs/es-cefr-mapping.md` (the es-ES equivalent) in format and rigor. Full A1 authoring (issue #63) follows the same "extract real structure, don't assume" discipline once this skeleton is verified end-to-end.

## Source document verification (#62)

**"Profile Deutsch" is not usable as this project's reference document.** It's the German-teaching field's de facto standard inventory (organizes vocabulary into 15 thematic areas and communicative functions across A1–C2), and it's associated with the Goethe-Institut — but it is a **paywalled Langenscheidt/Klett publication**, sold as a book with an accompanying CD-ROM, with no freely-browsable online edition. That fails this repo's own sourcing bar (`docs/content-attribution.md`, #41): "national-language-institute CEFR inventories only — freely published curriculum documents," the same bar Referencial Camões PLE and PCIC both cleared. Assuming Profile Deutsch was usable because it's the "obvious" German equivalent would have repeated the exact mistake issue #56 warned against for PCIC — reaching for an assumed structure instead of verifying real access first.

**Source:** [Goethe-Institut Prüfungsziele · Testbeschreibung](https://www.goethe.de/pro/relaunch/prf/en/Pruefungsziele_Testbeschreibung_A1_Fit1.pdf) documents — one freely-downloadable PDF per exam level (A1 Start Deutsch 1 / Fit in Deutsch 1, A2 Fit in Deutsch 2, B1, B2, C1, C2 GDS), published directly by the Goethe-Institut itself (Germany's state-backed language- and culture-promotion institute — the direct structural analogue of Instituto Cervantes for Spanish and Instituto Camões for Portuguese, rather than a third-party publisher). Confirmed freely accessible: the A1 PDF downloaded successfully with no login, paywall, or access blocker (1.3MB, `goethe.de/pro/relaunch/prf/`). Each document describes the Kompetenzen (Can-Do competencies) the exam targets per skill (Hören/Lesen/Schreiben/Sprechen), aligned to that level's CEFR descriptors — the same kind of institutional, CEFR-aligned Can-Do source as PCIC and Referencial Camões, just structured as one exam-goals document per level rather than a single cross-level inventory.

**This mapping does not yet extract Prüfungsziele's full per-skill Can-Do breakdown** — that structural extraction is #63's job (the full A1 epic), mirroring how #56 did PCIC's real extraction after #40 confirmed access. This skeleton only needed to confirm a freely-accessible, institutionally-published source exists before authoring against it, which it now has.

## TTS voice verification (#62)

Checked via `speechSynthesis.getVoices()` in a real Chrome browser (desktop, macOS): multiple dedicated `de-DE` voices exist (e.g. "Anna", "Helena", "Martin", "Grandma (German (Germany))"). No `de-AT` or `de-CH` voices are present on this system to distinguish against — unlike the `es-ES`/`es-MX` or `pt-PT`/`pt-BR` cases, there was nothing to disambiguate here, only to confirm `de-DE` itself resolves to real voices. `pronounce()` (`src/lib/pronounce.ts`) required no changes — it's lang-parametrized and already selects a voice matching the exact BCP-47 code.

## 5-node walking skeleton

Mirrors the same 5 nodes used for the original en-GB/pt-PT skeleton (#21) and the es-ES skeleton (#42) — all pre-existing, language-agnostic `cefr-nodes/`, so no new node files were needed, only new `realisations/de-DE/*.yaml`:

| nodeId       | Skill              | Can-Do                                                    | Status      |
| ------------ | ------------------ | --------------------------------------------------------- | ----------- |
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings                 | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking                   | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others                       | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001  | reading            | Can recognize and write numbers 1-100                     | ✅ Realised |

## Sourcing note

No new vocabulary images were sourced — `A1-NUMB-001`'s `imageUrl`s reuse the existing `um.webp`/`dois.webp`/`tres.webp` files (already credited in `public/vocab-images/CREDITS.md`), since the underlying photographs (numeral shapes) are language-independent. See `docs/content-attribution.md` (#41) for the sourcing policy this follows.

## Verification

- `npm run validate:content`: 334 realisations (up from 329), all reference valid `cefr-nodes`
- `npm run typecheck` / `npm run lint` / `npm test`: clean, 98/98 tests, 99%+ coverage (unchanged — no code files touched)
- `npm run build`: 949 pages (up from 769) — `en-GB↔de-DE`, `es-ES↔de-DE`, and `pt-PT↔de-DE` routes and selector entries all generated automatically, zero code changes, confirming `getAvailablePairs()`/`pairRealisations()` generalize to a third language exactly as they did for the second
- Manual browser verification (chrome-devtools) for `en-GB→de-DE`: Practice page loads with correct "German" branding (via the existing `languageName()` util, unchanged), a full graded review card ("Hello" → revealed "Hallo", graded, advanced to card 2/10 showing "Bye"), and Progress page (0/10 mastered, correctly isolated per-pair state)
