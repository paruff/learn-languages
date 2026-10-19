# Contributing

Thanks for helping expand Acquira content. This guide is the shortest path to author one complete CEFR node + paired realisations.

## Quickstart: author one node + two realisations

### 1) Create or update a CEFR node
Create `src/content/cefr-nodes/<node-file>.yaml`:

```yaml
nodeId: A1-SHOP-002
cefrLevel: A1
skill: spoken_interaction
canDo: Can ask for common items and prices in a shop
pragmaticFocus: Polite requests
notionalFocus: Shopping and money
relatedNodes:
  - A1-SHOP-001
prerequisiteNodes: []
```

Rules:
- `{LEVEL}` must be one of: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`
- `nodeId` format: `{LEVEL}-{TOPIC}-{SEQ}` (example: `A1-SHOP-002`)
- `{TOPIC}` is an uppercase domain code (for example `SHOP`, `GREET`, `INTRO`), not the `skill` field value
- `{TOPIC}` must be uppercase letters only (no digits or hyphens); `{SEQ}` must be a zero-padded 3-digit number (`001`, `002`, ...)
- `cefrLevel` must match the start of `nodeId`

### 2) Author paired realisations
Create matching files in:
- `src/content/realisations/<sourceLang>/<node-file>.yaml`
- `src/content/realisations/<targetLang>/<node-file>.yaml`

Each vocabulary item must include `concept` (kebab-case English gloss slug). Pairing is done by `nodeId + concept`, so the same concept must exist across paired languages. This is enforced by the current schema and integrity checks in `src/content.config.ts` and `npm run validate:content`.
In the examples below, replace `<lang>` and `<nodeId>` in `id` with concrete values (for example, `pt-PT-A1-SHOP-002-001`).

Example (`pt-PT`):

```yaml
nodeId: A1-SHOP-002
lang: pt-PT
vocabulary:
  - id: <lang>-<nodeId>-001
    concept: ask-price
    term: Quanto custa?
    translation: How much is it?
    partOfSpeech: phrase
    gender: n/a
    example: Quanto custa este livro?
    exampleTranslation: How much is this book?
grammar: []
```

Example (`en-GB`):

```yaml
nodeId: A1-SHOP-002
lang: en-GB
vocabulary:
  - id: <lang>-<nodeId>-001
    concept: ask-price
    term: How much is it?
    translation: Quanto custa?
    partOfSpeech: phrase
    gender: n/a
    example: How much is this book?
    exampleTranslation: Quanto custa este livro?
grammar: []
```

### 3) Validate locally
From the repository root run:

```bash
npm run validate:content
```

This checks schema + integrity rules (including node references and concept-based pairing constraints).

## Worked example
For `A1-SHOP-002`, the complete minimal pair is:

1. Add `src/content/cefr-nodes/a1-shop-002.yaml` with `nodeId: A1-SHOP-002`.
2. Add `src/content/realisations/pt-PT/a1-shop-002.yaml`.
3. Add `src/content/realisations/en-GB/a1-shop-002.yaml`.
4. Keep shared `concept` values between language files (for example `ask-price`).
5. Run `npm run validate:content`.

## PR checklist (content contributions)
Before opening a PR:

- [ ] CEFR node file added/updated under `src/content/cefr-nodes/`
- [ ] Paired realisations added/updated under `src/content/realisations/<lang>/` for the same `nodeId`
- [ ] Vocabulary `concept` values are kebab-case and aligned across paired languages
- [ ] `npm run validate:content` passes locally
- [ ] PR description states which node(s) were added and which language pair(s) were updated
