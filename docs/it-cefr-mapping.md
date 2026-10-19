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
