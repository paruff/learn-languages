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

## A1 nodes in the repo (EN→DE)

All 22 A1 `cefr-nodes/` are language-agnostic Can-Do statements sourced from the Referencial Camões PLE (shared A1 inventory). Paired en-GB/de-DE realisations were authored for all 22 nodes.

| nodeId         | Skill              | Can-Do                                                    | Status      |
| -------------- | ------------------ | --------------------------------------------------------- | ----------- |
| A1-GREET-001   | spoken_interaction | Can greet people and respond to greetings                 | ✅ Realised |
| A1-GREET-002   | spoken_interaction | Can use basic formulas for leave-taking                   | ✅ Realised |
| A1-INTRO-001   | spoken_interaction | Can introduce themselves and others                       | ✅ Realised |
| A1-INTRO-002   | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001    | reading            | Can recognize and write numbers 1-100                     | ✅ Realised |
| A1-FOOD-001    | reading            | Can identify common food and drink items                  | ✅ Realised |
| A1-THANK-001   | spoken_interaction | Can express thanks and respond to thanks                  | ✅ Realised |
| A1-SORRY-001   | spoken_interaction | Can apologise and respond to apologies                    | ✅ Realised |
| A1-LOC-001     | spoken_interaction | Can ask for and understand simple directions              | ✅ Realised |
| A1-TIME-001    | reading            | Can understand basic time and date expressions            | ✅ Realised |
| A1-REQUEST-001 | spoken_interaction | Can make simple requests using polite forms               | ✅ Realised |
| A1-OFFER-001   | spoken_production  | Can offer things and make simple invitations              | ✅ Realised |
| A1-OPIN-001    | spoken_production  | Can express simple opinions about everyday topics         | ✅ Realised |
| A1-CAPAB-001   | spoken_production  | Can express ability and inability to do things            | ✅ Realised |
| A1-WANT-001    | spoken_production  | Can express simple desires and intentions                 | ✅ Realised |
| A1-FEEL-001    | listening          | Can understand and express basic emotions                 | ✅ Realised |
| A1-CLARIFY-001 | spoken_interaction | Can ask someone to repeat or clarify                      | ✅ Realised |
| A1-FAMILY-001  | reading            | Can identify immediate family members                     | ✅ Realised |
| A1-BODY-001    | reading            | Can identify basic body parts and health vocabulary       | ✅ Realised |
| A1-HOBBY-001   | reading            | Can identify common hobbies and free-time activities      | ✅ Realised |
| A1-ROUTINE-001 | reading            | Can identify common daily-life objects and rooms           | ✅ Realised |
| A1-SHOP-001    | reading            | Can identify basic shopping and money vocabulary           | ✅ Realised |

A1 Coverage: 22/22 nodes fully realised (100%).

## A2 nodes in the repo (EN→DE)

20 A2 `cefr-nodes/` — all language-agnostic Can-Do statements. Paired en-DE/de-DE realisations authored for all 20 nodes.

| nodeId         | Skill              | Can-Do                                                    | Status      |
| -------------- | ------------------ | --------------------------------------------------------- | ----------- |
| A2-JOB-001     | spoken_production  | Can describe my job and working hours                     | ✅ Realised |
| A2-JOB-002     | spoken_production  | Can talk about daily work routines                        | ✅ Realised |
| A2-JOB-003     | reading            | Can understand simple job advertisements                  | ✅ Realised |
| A2-STUDY-001   | spoken_production  | Can describe my studies and qualifications                | ✅ Realised |
| A2-STUDY-002   | spoken_interaction | Can talk about my educational background                  | ✅ Realised |
| A2-STUDY-003   | reading            | Can understand simple academic texts                      | ✅ Realised |
| A2-HABIT-001   | spoken_production  | Can describe recent changes in habits                     | ✅ Realised |
| A2-HABIT-002   | listening          | Can talk about recent activities                          | ✅ Realised |
| A2-HABIT-003   | reading            | Can understand simple news items about recent events      | ✅ Realised |
| A2-PAST-001    | spoken_production  | Can describe past events and experiences                   | ✅ Realised |
| A2-PAST-002    | spoken_production  | Can talk about changes over time                          | ✅ Realised |
| A2-PAST-003    | listening          | Can understand simple narratives about the past           | ✅ Realised |
| A2-PAST-004    | writing            | Can compare past and present situations                   | ✅ Realised |
| A2-HEALTH-001  | spoken_interaction | Can describe symptoms and understand medical advice       | ✅ Realised |
| A2-CULT-001    | listening          | Can talk about cultural events and traditions             | ✅ Realised |
| A2-CULT-002    | spoken_interaction | Can describe simple aspects of different cultures         | ✅ Realised |
| A2-CULT-003    | spoken_production  | Can express opinions about cultural topics                | ✅ Realised |
| A2-NEWS-001    | reading            | Can understand simple news articles                       | ✅ Realised |
| A2-NEWS-002    | spoken_production  | Can describe events reported in the media                 | ✅ Realised |
| A2-NEWS-003    | spoken_production  | Can express basic opinions about news items               | ✅ Realised |

A2 Coverage: 20/20 nodes fully realised (100%).

### de-DE realisation totals

| Level | Vocabulary items | Grammar points | Files |
| ----- | ---------------- | -------------- | ----- |
| A1    | 132              | 0              | 22    |
| A2    | 120              | 0              | 20    |
| **Total** | **252**      | **0**          | **42** |

## Sourcing note

No new vocabulary images were sourced — `A1-NUMB-001`'s `imageUrl`s reuse the existing `um.webp`/`dois.webp`/`tres.webp` files (already credited in `public/vocab-images/CREDITS.md`), since the underlying photographs (numeral shapes) are language-independent. See `docs/content-attribution.md` (#41) for the sourcing policy this follows.

## Verification

- `npm run validate:content`: 334 realisations (up from 329), all reference valid `cefr-nodes`
- `npm run typecheck` / `npm run lint` / `npm test`: clean, 98/98 tests, 99%+ coverage (unchanged — no code files touched)
- `npm run build`: 949 pages (up from 769) — `en-GB↔de-DE`, `es-ES↔de-DE`, and `pt-PT↔de-DE` routes and selector entries all generated automatically, zero code changes, confirming `getAvailablePairs()`/`pairRealisations()` generalize to a third language exactly as they did for the second
- Manual browser verification (chrome-devtools) for `en-GB→de-DE`: Practice page loads with correct "German" branding (via the existing `languageName()` util, unchanged), a full graded review card ("Hello" → revealed "Hallo", graded, advanced to card 2/10 showing "Bye"), and Progress page (0/10 mastered, correctly isolated per-pair state)
