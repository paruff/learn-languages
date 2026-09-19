# Reference Implementation — EN→PT A1 Language Pair

Documents the process used to author the first complete language pair (issue #7), so a future pair follows the same steps. Covers 5 A1 nodes: greetings (2), introductions (2), numbers (1).

## Process

1. **Pick the CEFR node.** Start from `src/content/cefr-nodes/{node}.yaml` — it already exists or gets created per spec §5.1 (nodeId, cefrLevel, skill, canDo, pragmaticFocus, notionalFocus).
2. **Author the target-language realisation** (`src/content/realisations/{targetLang}/{node}.yaml`): vocabulary items with `id: {lang}-{nodeId}-{seq}`, `term`, `translation`, `partOfSpeech`, `example`, `exampleTranslation`, and optionally `grammar`/`culturalNotes`.
3. **Author the paired source-language realisation** (`src/content/realisations/{sourceLang}/{node}.yaml`): same `nodeId`, same vocabulary item **sequence numbers** (spec invariant I3), with `term`/`translation` swapped relative to the target realisation, and examples translated (not the same sentence structure necessarily — natural in each language).
4. **Run `npm run validate:content` locally.** This runs Zod schema validation (astro sync) plus the referential-integrity check (#4/#25) that every realisation's `nodeId` matches a real `cefr-node`.
5. **Verify pairing works**: `loadPair('en-GB', 'pt-PT')` (see `src/lib/pairLoader.ts`) should return the node's vocabulary joined by sequence number, not by coincidence of file order.
6. **Verify it renders**: the lesson view at `/{sourceLang}/{targetLang}/lessons/{nodeId}/` and the review loop at `/{sourceLang}/{targetLang}/review/` should both pick up the new content automatically — no code changes needed for new content within an existing pair.

## What "reference quality" meant in practice

- Every vocabulary item has a full sentence example in both languages, not just a word-pair — the spec's UI (lesson view) expects `example`/`exampleTranslation` on every item.
- Grammar points were only added where genuinely relevant (e.g. tu/você formality on A1-INTRO-001), not padded in for every node — A1-GREET-002, A1-INTRO-002, and A1-NUMB-001 have none, and that's correct, not incomplete.
- Numbers (A1-NUMB-001) needed content authored from scratch — no prior vocabulary existed for that node before this pair.

## Known gaps (see #14, #5)

- A1-FOOD-001 has a `cefr-nodes` entry but no realisations yet — deliberately out of scope for the walking skeleton (#21), which targets only the 5 nodes needed to prove the pairing abstraction end-to-end.
- This pair covers only 2 of 5 CEFR skills (spoken_interaction, reading) — no listening or spoken_production nodes exist yet. See `docs/cefr-mapping.md`.
