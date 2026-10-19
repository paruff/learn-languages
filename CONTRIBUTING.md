# Contributing

Thanks for helping expand Acquira content. This guide is the shortest path to author one complete CEFR node + paired realisations.

## Quickstart: author one node + two realisations

### 1) Create or update a CEFR node
Create `/home/runner/work/learn-languages/learn-languages/src/content/cefr-nodes/<node-file>.yaml`:

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
- `nodeId` format: `{LEVEL}-{SKILL}-{SEQ}` (example: `A1-SHOP-002`)
- `cefrLevel` must match the start of `nodeId`

### 2) Author paired realisations
Create matching files in:
- `/home/runner/work/learn-languages/learn-languages/src/content/realisations/<sourceLang>/<node-file>.yaml`
- `/home/runner/work/learn-languages/learn-languages/src/content/realisations/<targetLang>/<node-file>.yaml`

Each vocabulary item must include `concept` (kebab-case English gloss slug). Pairing is done by `nodeId + concept`, so the same concept must exist across paired languages.

Example (`pt-PT`):

```yaml
nodeId: A1-SHOP-002
lang: pt-PT
vocabulary:
  - id: pt-PT-A1-SHOP-002-001
    concept: ask-price
    term: Quanto custa?
    translation: How much is it?
    partOfSpeech: phrase
    example: Quanto custa este livro?
    exampleTranslation: How much is this book?
grammar: []
```

Example (`en-GB`):

```yaml
nodeId: A1-SHOP-002
lang: en-GB
vocabulary:
  - id: en-GB-A1-SHOP-002-001
    concept: ask-price
    term: How much is it?
    translation: Quanto custa?
    partOfSpeech: phrase
    example: How much is this book?
    exampleTranslation: Quanto custa este livro?
grammar: []
```

### 3) Validate locally
From `/home/runner/work/learn-languages/learn-languages` run:

```bash
npm run validate:content
```

This checks schema + integrity rules (including node references and concept-based pairing constraints).

## Worked example
- For the first complete EN→PT A1 implementation notes, see:
  `/home/runner/work/learn-languages/learn-languages/docs/reference-implementation.md`

## PR checklist (content contributions)
Before opening a PR:

- [ ] CEFR node file added/updated under `src/content/cefr-nodes/`
- [ ] Paired realisations added/updated under `src/content/realisations/<lang>/` for the same `nodeId`
- [ ] Vocabulary `concept` values are kebab-case and aligned across paired languages
- [ ] `npm run validate:content` passes locally
- [ ] PR description states which node(s) were added and which language pair(s) were updated

Maintainers use this issue acceptance criterion for #22: at least one non-founder contributor successfully merges a node+realisation pair using this document alone.
