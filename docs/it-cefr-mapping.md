# Italian (it-IT) CEFR Mapping — Walking Skeleton

Tracks the CEFR reference-document verification and 5-node walking skeleton for **en-GB↔it-IT**, per issue #159. Mirrors the repo's existing language-mapping docs (`docs/de-cefr-mapping.md`, `docs/es-cefr-mapping.md`, `docs/fr-cefr-mapping.md`) in format and evidence discipline: confirm a free, authoritative CEFR-aligned source first; only then author the minimal realisation set needed to verify the loop.

## Source document verification (#159)

**Verified free, authoritative source documents:**

- **Europass QCER descriptors for Italian** — the public European self-assessment grid for Italian, freely downloadable and directly aligned to CEFR levels A1–C2. This gives the repo a neutral, official level descriptor reference without relying on a commercial publisher.
- **Ministero dell'Interno / Italian L2 A1 syllabus** — the public "Sillabo di riferimento per i livelli di competenza in italiano L2" A1 document, which is an official, freely accessible competence inventory. It provides the A1-list style structure needed for a real content extraction and cross-check against the repo's existing node inventory.

These sources satisfy the repo's policy bar (`docs/content-attribution.md`): free, official, and CEFR-aligned.

**Ruled out:** course-book / publisher “CEFR” materials, commercial grammar textbooks, and any course-platform content not released under a clear reuse license. Those sources may contain accurate examples, but they are not acceptable as the authoritative reference for this repo's content model.

## TTS voice verification (#159)

The implementation already does the correct thing for regional voices: `pronounce()` (`src/lib/pronounce.ts`) sets `utterance.lang` explicitly and prefers a voice whose `lang` matches that code. For Italian, the correct BCP-47 code is `it-IT`; it should resolve to an Italian voice (`it-IT`) rather than silently mapping to a generic locale such as `it` or another regional variant via a fallback.

The repo's design is intentionally robust to the browser's voice list: it does not hardcode a locale alias, and it only uses an exact voice match when present. That is the same pattern already used for `pt-PT`, `es-ES`, and `de-DE`.

## 5-node walking skeleton

These are the same 5 A1 nodes used as the initial validation skeleton for earlier languages, all already present in the shared `cefr-nodes/` model and therefore requiring no new node files.

| nodeId       | Skill              | Can-Do                                                    | Status      |
| ------------ | ------------------ | --------------------------------------------------------- | ----------- |
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings                 | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking                   | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others                       | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001  | reading            | Can recognize and write numbers 1-100                     | ✅ Realised |

## Italian realisation notes

The walking skeleton adds the minimal `src/content/realisations/it-IT/*.yaml` set needed to validate the review loop for `en-GB↔it-IT` without expanding into full A1 authoring yet. The folder uses the same vocabulary schema, node IDs, and `concept` naming conventions as every other language pair.

This means the route selector and pair-generation logic continue to work without any language-specific code changes: the system derives all supported pairs from actual realisation files, so `it-IT` automatically participates in route generation once the 5 files are present.

## A2 nodes in the repo (EN→IT)

The verified A1 source material was reused as the baseline for A2 validation: the repo's 20 shared A2 `cefr-nodes/` remain the authoritative target set, and each one is now paired with an `it-IT` realisation. This mirrors the repository's other validated pairings (`en-GB↔es-ES`, `en-GB↔de-DE`, `en-GB↔fr-FR`), where the A2 node inventory is the level-level contract rather than a free-form teaching list.

| nodeId         | Skill              | Can-Do                                                    | Status      |
| -------------- | ------------------ | --------------------------------------------------------- | ----------- |
| A2-CULT-001    | listening          | Can talk about cultural events and traditions             | ✅ Realised |
| A2-CULT-002    | spoken_interaction | Can describe simple aspects of different cultures         | ✅ Realised |
| A2-CULT-003    | spoken_production  | Can express opinions about cultural topics                | ✅ Realised |
| A2-HABIT-001   | spoken_production  | Can describe recent changes in habits                     | ✅ Realised |
| A2-HABIT-002   | listening          | Can talk about recent activities                          | ✅ Realised |
| A2-HABIT-003   | reading            | Can understand simple news items about recent events      | ✅ Realised |
| A2-HEALTH-001  | spoken_interaction | Can describe symptoms and understand medical advice       | ✅ Realised |
| A2-JOB-001     | spoken_production  | Can describe my job and working hours                     | ✅ Realised |
| A2-JOB-002     | spoken_production  | Can talk about daily work routines                        | ✅ Realised |
| A2-JOB-003     | reading            | Can understand simple job advertisements                  | ✅ Realised |
| A2-NEWS-001    | reading            | Can understand simple news articles                       | ✅ Realised |
| A2-NEWS-002    | spoken_production  | Can describe events reported in the media                 | ✅ Realised |
| A2-NEWS-003    | spoken_production  | Can express basic opinions about news items               | ✅ Realised |
| A2-PAST-001    | spoken_production  | Can describe past events and experiences                   | ✅ Realised |
| A2-PAST-002    | spoken_production  | Can talk about changes over time                          | ✅ Realised |
| A2-PAST-003    | listening          | Can understand simple narratives about the past           | ✅ Realised |
| A2-PAST-004    | writing            | Can compare past and present situations                   | ✅ Realised |
| A2-STUDY-001   | spoken_production  | Can describe my studies and qualifications                | ✅ Realised |
| A2-STUDY-002   | spoken_interaction | Can talk about my educational background                  | ✅ Realised |
| A2-STUDY-003   | reading            | Can understand simple academic texts                      | ✅ Realised |

A2 Coverage: 20/20 nodes fully realised (100%).

The coverage table above is derived from the repo's shared A2 `cefr-nodes/` inventory, not from a guessed Italian-only taxonomy. The realisations follow the same concept-pairing contract used elsewhere in the repo: every item is keyed by `nodeId + concept`, and the source-side English gloss remains the pairing bridge when the target language does not share a direct concept.
