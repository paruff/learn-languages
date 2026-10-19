# Italian (it-IT) CEFR Mapping — A1 Inventory

Tracks the CEFR A1 Can-Do inventory for **en-GB↔it-IT** against the shared repository node set and the paired `realisations` content. This issue reuses the existing language-agnostic A1 node inventory rather than creating a duplicate Italian-only schema.

## Source verification

This mapping follows the same evidence rule used elsewhere in the repo: the CEFR inventory is not assumed by language; it is checked against a publicly available institutional descriptor source and then mapped onto the shared node set. For the Italian A1 slice, the repository uses the common CEFR A1 skill structure already reflected in the shared `cefr-nodes/` YAML files.

**Source basis:** the Council of Europe CEFR A1 descriptors combined with the repo’s verified language-agnostic A1 nodes already used for en-GB/pt-PT/es-ES/de-DE/fr-FR. The A1 inventory is a shared capability model, and the Italian realisations are language-specific surface forms of those already-validated Can-Do statements.

## A1 coverage table

| nodeId | Skill | Can-Do | Status |
| --- | --- | --- | --- |
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others | ✅ Realised |
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
