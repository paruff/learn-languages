# B1 Content — EN→PT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the B1 CEFR inventory for EN→PT — 18 nodes, 36 realisations, covering all 4 B1 modules (M13–M16).

**Architecture:** Create paired en-GB/pt-PT realisation files for each B1 node, following the exact YAML schema established in A1/A2. Each node has a CEFR node file + two realisation files (pt-PT, en-GB). Vocabulary items are paired deterministically for bidirectional review. Grammar points introduce B1-level concepts (imperfeito, condicional, connectors, reported speech, comparisons).

**Tech Stack:** Astro 5.x content collections, Zod schema validation, YAML, TypeScript, Vitest

**Spec:** `docs/superpowers/specs/2026-09-20-b1-content-design.md`

## Global Constraints

- Node ID format: `B1-{SKILL}-{SEQ}` (regex: `/^(B1)-[A-Z]+-\d{3}$/`)
- Vocabulary ID format: `{lang}-{nodeId}-{SEQ}` (e.g., `pt-PT-B1-SOCIAL-001-001`)
- Gender enum: `"masculine"|"feminine"|"neuter"|"n/a"` (no `"common"`)
- Grammar field is `grammar` with `point` (not `term`), `explanation`, `examples`, `cefrNotes`
- `culturalNotes` is a plain string
- No `title` or `overview` fields in realisation schema
- YAML strings with apostrophes must use double-quoted strings
- Vocabulary items per node: 6
- Example sentences: 2 per vocabulary item minimum
- CEFR source: Referencial Camões PLE

---

## Phase 0: Baseline (1 node — schema validation)

### Task 0.1: Create B1-SOCIAL-001 CEFR node + pt-PT realisation

**Files:**
- Create: `src/content/cefr-nodes/b1-social-001.yaml`
- Create: `src/content/realisations/pt-PT/b1-social-001.yaml`

**Interfaces:**
- Produces: `B1-SOCIAL-001` node referenced by pt-PT realisation

- [ ] **Step 1: Create CEFR node file**

```yaml
nodeId: B1-SOCIAL-001
cefrLevel: B1
skill: spoken_interaction
canDo: "Can handle most social situations while travelling in Portugal"
pragmaticFocus: "Social register management"
notionalFocus: "Travel, social encounters"
relatedNodes:
  - B1-SOCIAL-002
  - A1-GREET-001
prerequisiteNodes:
  - A2-JOB-001
```

- [ ] **Step 2: Create pt-PT realisation (6 vocabulary items, 2 grammar points)**

```yaml
nodeId: B1-SOCIAL-001
lang: pt-PT
vocabulary:
  - id: pt-PT-B1-SOCIAL-001-001
    term: "Desculpe, pode ajudar-me?"
    translation: "Excuse me, can you help me?"
    partOfSpeech: phrase
    gender: n/a
    example: "Desculpe, pode ajudar-me a encontrar o metro?"
    exampleTranslation: "Excuse me, can you help me find the metro?"
  - id: pt-PT-B1-SOCIAL-001-002
    term: "Com licença"
    translation: "Pardon me"
    partOfSpeech: phrase
    gender: n/a
    example: "Com licença, onde fica a estação de comboios?"
    exampleTranslation: "Pardon me, where is the train station?"
  - id: pt-PT-B1-SOCIAL-001-003
    term: "falar sobre"
    translation: "to talk about"
    partOfSpeech: verb
    gender: n/a
    example: "Gostava de falar sobre a cultura portuguesa."
    exampleTranslation: "I would like to talk about Portuguese culture."
  - id: pt-PT-B1-SOCIAL-001-004
    term: "a conversa foi interesting"
    translation: "the conversation was interesting"
    partOfSpeech: phrase
    gender: n/a
    example: "A conversa foi muito interessante, obrigado."
    exampleTranslation: "The conversation was very interesting, thank you."
  - id: pt-PT-B1-SOCIAL-001-005
    term: "na minha experiência"
    translation: "in my experience"
    partOfSpeech: phrase
    gender: n/a
    example: "Na minha experiência, os portugueses são muito simpáticos."
    exampleTranslation: "In my experience, Portuguese people are very friendly."
  - id: pt-PT-B1-SOCIAL-001-006
    term: "depende das circunstâncias"
    translation: "it depends on the circumstances"
    partOfSpeech: phrase
    gender: n/a
    example: "Depende das circunstâncias, mas normalmente ajudo."
    exampleTranslation: "It depends on the circumstances, but I usually help."
grammar:
  - id: B1-GRAMMAR-001
    point: "Polite request structures with modal verbs"
    explanation: "Using 'poderia', 'gostaria de', 'pode' for polite requests beyond simple imperative"
    examples:
      - pt: "Poderia ajudar-me?"
        en: "Could you help me?"
      - pt: "Gostaria de saber mais."
        en: "I would like to know more."
    cefrNotes: "B1 learners expand from simple imperative (ajuda-me) to polite modal constructions"
  - id: B1-GRAMMAR-002
    point: "Complex connectors: além disso, no entanto"
    explanation: "Using connectors beyond e, mas, porque to structure extended speech"
    examples:
      - pt: "Além disso, a cultura portuguesa é muito rica."
        en: "Furthermore, Portuguese culture is very rich."
      - pt: "No entanto, às vezes é difícil encontrar ajuda."
        en: "However, sometimes it is difficult to find help."
    cefrNotes: "B1 introduces discourse connectors for extended discourse organisation"
culturalNotes: "Portuguese people are generally helpful to tourists. Starting with 'Desculpe' (excuse me) or 'Com licença' (pardon me) is essential for polite interaction. Direct eye contact and a smile are appreciated."
```

- [ ] **Step 3: Run validation**

Run: `npm run validate:content`
Expected: Content integrity check passes with correct count

- [ ] **Step 4: Commit**

```bash
git add src/content/cefr-nodes/b1-social-001.yaml src/content/realisations/pt-PT/b1-social-001.yaml
git commit -m "content(b1): add B1-SOCIAL-001 node + pt-PT realisation"
```

---

### Task 0.2: Create en-GB realisation for B1-SOCIAL-001

**Files:**
- Create: `src/content/realisations/en-GB/b1-social-001.yaml`

**Interfaces:**
- Produces: Paired en-GB realisation matching B1-SOCIAL-001 pt-PT vocabulary sequence

- [ ] **Step 1: Create en-GB realisation**

```yaml
nodeId: B1-SOCIAL-001
lang: en-GB
vocabulary:
  - id: en-GB-B1-SOCIAL-001-001
    term: "Excuse me, can you help me?"
    translation: "Desculpe, pode ajudar-me?"
    partOfSpeech: phrase
    gender: n/a
    example: "Excuse me, can you help me find the metro?"
    exampleTranslation: "Desculpe, pode ajudar-me a encontrar o metro?"
  - id: en-GB-B1-SOCIAL-001-002
    term: "Pardon me"
    translation: "Com licença"
    partOfSpeech: phrase
    gender: n/a
    example: "Pardon me, where is the train station?"
    exampleTranslation: "Com licença, onde fica a estação de comboios?"
  - id: en-GB-B1-SOCIAL-001-003
    term: "to talk about"
    translation: "falar sobre"
    partOfSpeech: verb
    gender: n/a
    example: "I would like to talk about Portuguese culture."
    exampleTranslation: "Gostava de falar sobre a cultura portuguesa."
  - id: en-GB-B1-SOCIAL-001-004
    term: "the conversation was interesting"
    translation: "a conversa foi interessante"
    partOfSpeech: phrase
    gender: n/a
    example: "The conversation was very interesting, thank you."
    exampleTranslation: "A conversa foi muito interessante, obrigado."
  - id: en-GB-B1-SOCIAL-001-005
    term: "in my experience"
    translation: "na minha experiência"
    partOfSpeech: phrase
    gender: n/a
    example: "In my experience, Portuguese people are very friendly."
    exampleTranslation: "Na minha experiência, os portugueses são muito simpáticos."
  - id: en-GB-B1-SOCIAL-001-006
    term: "it depends on the circumstances"
    translation: "depende das circunstâncias"
    partOfSpeech: phrase
    gender: n/a
    example: "It depends on the circumstances, but I usually help."
    exampleTranslation: "Depende das circunstâncias, mas normalmente ajudo."
grammar:
  - id: B1-GRAMMAR-001
    point: "Polite request structures with modal verbs"
    explanation: "Using 'poderia', 'gostaria de', 'pode' for polite requests beyond simple imperative"
    examples:
      - pt: "Poderia ajudar-me?"
        en: "Could you help me?"
      - pt: "Gostaria de saber mais."
        en: "I would like to know more."
    cefrNotes: "B1 learners expand from simple imperative (ajuda-me) to polite modal constructions"
  - id: B1-GRAMMAR-002
    point: "Complex connectors: além disso, no entanto"
    explanation: "Using connectors beyond e, mas, porque to structure extended speech"
    examples:
      - pt: "Além disso, a cultura portuguesa é muito rica."
        en: "Furthermore, Portuguese culture is very rich."
      - pt: "No entanto, às vezes é difícil encontrar ajuda."
        en: "However, sometimes it is difficult to find help."
    cefrNotes: "B1 introduces discourse connectors for extended discourse organisation"
culturalNotes: "In British English, politeness is expressed through indirect questions and hedging. 'Would you mind helping me?' is more common than direct requests. 'Sorry to bother you' serves a similar function to Portuguese 'Desculpe'."
```

- [ ] **Step 2: Run validation**

Run: `npm run validate:content`
Expected: 110 realisations (74 existing + 1 new pair)

- [ ] **Step 3: Run all gates**

Run: `npm run typecheck && npm run lint && npm test`
Expected: All pass

- [ ] **Step 4: Commit**

```bash
git add src/content/realisations/en-GB/b1-social-001.yaml
git commit -m "content(b1): add B1-SOCIAL-001 en-GB realisation"
```

---

## Phase 1: M13 — Interação Social (3 more nodes)

### Task 1.1: Create B1-SOCIAL-002/003/004 nodes + pt-PT realisations

**Files:**
- Create: `src/content/cefr-nodes/b1-social-002.yaml`
- Create: `src/content/cefr-nodes/b1-social-003.yaml`
- Create: `src/content/cefr-nodes/b1-social-004.yaml`
- Create: `src/content/realisations/pt-PT/b1-social-002.yaml`
- Create: `src/content/realisations/pt-PT/b1-social-003.yaml`
- Create: `src/content/realisations/pt-PT/b1-social-004.yaml`

- [ ] **Step 1: Create B1-SOCIAL-002 node + pt-PT realisation**

Node: spoken_interaction — "Can engage in extended conversation on familiar topics"
Vocabulary: 6 items (extended conversation, familiar topics, follow up questions, paraphrase, check understanding, summarise)
Grammar: Conditional tense introduction

- [ ] **Step 2: Create B1-SOCIAL-003 node + pt-PT realisation**

Node: spoken_interaction — "Can express and respond to feelings and opinions during conversations"
Vocabulary: 6 items (express feelings, respond to opinions, empathise, share perspective, acknowledge difference, express certainty/uncertainty)
Grammar: Expressing feelings with "sentir-se" + adjective

- [ ] **Step 3: Create B1-SOCIAL-004 node + pt-PT realisation**

Node: spoken_production — "Can keep a conversation going by inviting opinions and reacting"
Vocabulary: 6 items (invite opinion, react to news, change topic politely, ask follow-up, summarise common ground, suggest conclusion)
Grammar: Discourse management phrases

- [ ] **Step 4: Run validation**

Run: `npm run validate:content`

- [ ] **Step 5: Commit**

```bash
git add src/content/cefr-nodes/b1-social-00{2,3,4}.yaml src/content/realisations/pt-PT/b1-social-00{2,3,4}.yaml
git commit -m "content(b1): add B1-SOCIAL-002/003/004 nodes + pt-PT realisations"
```

### Task 1.2: Create B1-SOCIAL-002/003/004 en-GB realisations

**Files:**
- Create: `src/content/realisations/en-GB/b1-social-002.yaml`
- Create: `src/content/realisations/en-GB/b1-social-003.yaml`
- Create: `src/content/realisations/en-GB/b1-social-004.yaml`

- [ ] **Step 1: Create en-GB realisations for all 3 nodes**

Paired vocabulary matching pt-PT sequence for each node.

- [ ] **Step 2: Run validation**

Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/b1-social-00{2,3,4}.yaml
git commit -m "content(b1): add B1-SOCIAL-002/003/004 en-GB realisations"
```

---

## Phase 2: M14 — Opiniões e Atitudes (4 nodes)

### Task 2.1: Create B1-OPINION-001/002/003/004 nodes + pt-PT realisations

**Files:**
- Create: `src/content/cefr-nodes/b1-opinion-001.yaml` through `b1-opinion-004.yaml`
- Create: `src/content/realisations/pt-PT/b1-opinion-001.yaml` through `b1-opinion-004.yaml`

- [ ] **Step 1: Create B1-OPINION-001 node + pt-PT**

Node: spoken_production — "Can express opinions with supporting reasons"
Vocabulary: 6 items (na minha opinião, acho que, penso que, concordo/discordo, porque, por outro lado)
Grammar: Complex connectors (além disso, no entanto, por outro lado, embora)

- [ ] **Step 2: Create B1-OPINION-002 node + pt-PT**

Node: spoken_interaction — "Can agree and disagree politely"
Vocabulary: 6 items (concordo totalmente, discordo educadamente, tem razão, isso depende, entendo o seu ponto, however)
Grammar: Polite disagreement structures

- [ ] **Step 3: Create B1-OPINION-003 node + pt-PT**

Node: spoken_production — "Can describe advantages and disadvantages"
Vocabulary: 6 items (vantagem, desvantagem, por um lado, por outro lado, a favor, contra)
Grammar: Comparison structures (mais...do que, tão...como)

- [ ] **Step 4: Create B1-OPINION-004 node + pt-PT**

Node: writing — "Can write simple opinions about current events"
Vocabulary: 6 items (actualidade, acontecimento, na minha perspetiva, considero que, é importante notar, em resumo)
Grammar: Written register connectors

- [ ] **Step 5: Run validation**

Run: `npm run validate:content`

- [ ] **Step 6: Commit**

```bash
git add src/content/cefr-nodes/b1-opinion-00{1,2,3,4}.yaml src/content/realisations/pt-PT/b1-opinion-00{1,2,3,4}.yaml
git commit -m "content(b1): add B1-OPINION-001/002/003/004 nodes + pt-PT realisations"
```

### Task 2.2: Create B1-OPINION-001/002/003/004 en-GB realisations

- [ ] **Step 1: Create en-GB realisations for all 4 nodes**

- [ ] **Step 2: Run validation**

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/b1-opinion-00{1,2,3,4}.yaml
git commit -m "content(b1): add B1-OPINION-001/002/003/004 en-GB realisations"
```

---

## Phase 3: M15 — Discurso Organizado (5 nodes)

### Task 3.1: Create B1-DISCOURSE-001/002/003/004/005 nodes + pt-PT realisations

**Files:**
- Create: `src/content/cefr-nodes/b1-discourse-001.yaml` through `b1-discourse-005.yaml`
- Create: `src/content/realisations/pt-PT/b1-discourse-001.yaml` through `b1-discourse-005.yaml`

- [ ] **Step 1: Create B1-DISCOURSE-001 node + pt-PT**

Node: spoken_production — "Can narrate a sequence of events in the correct order"
Vocabulary: 6 items (primeiro, depois, a seguir, entretanto, finalmente, por fim)
Grammar: Pretérito imperfeito introduction (context: ongoing background in narratives)

- [ ] **Step 2: Create B1-DISCOURSE-002 node + pt-PT**

Node: spoken_production — "Can describe how to do something step by step"
Vocabulary: 6 items (passo, primeiro passo, em seguida, para começar, não se esqueça de, por último)
Grammar: Imperative + infinitive constructions

- [ ] **Step 3: Create B1-DISCOURSE-003 node + pt-PT**

Node: reading — "Can understand the main points of news articles on familiar topics"
Vocabulary: 6 items (artigo, jornal, notícias, headline, segundo o autor, de acordo com)
Grammar: Reading comprehension strategies (scanning, skimming)

- [ ] **Step 4: Create B1-DISCOURSE-004 node + pt-PT**

Node: writing — "Can write connected text about experiences and events"
Vocabulary: 6 items (experiência, aconteceu, na ocasião, lembro-me de, foi uma experiência, aprendi que)
Grammar: Connected writing with connectors

- [ ] **Step 5: Create B1-DISCOURSE-005 node + pt-PT**

Node: listening — "Can follow extended speech on familiar topics"
Vocabulary: 6 items (segundo o orador, o ponto principal, em resumo, ou seja, parafraseando, a ideia central)
Grammar: Listening comprehension strategies

- [ ] **Step 6: Run validation**

- [ ] **Step 7: Commit**

```bash
git add src/content/cefr-nodes/b1-discourse-00{1,2,3,4,5}.yaml src/content/realisations/pt-PT/b1-discourse-00{1,2,3,4,5}.yaml
git commit -m "content(b1): add B1-DISCOURSE-001/002/003/004/005 nodes + pt-PT realisations"
```

### Task 3.2: Create B1-DISCOURSE-001/002/003/004/005 en-GB realisations

- [ ] **Step 1: Create en-GB realisations for all 5 nodes**

- [ ] **Step 2: Run validation**

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/b1-discourse-00{1,2,3,4,5}.yaml
git commit -m "content(b1): add B1-DISCOURSE-001/002/003/004/005 en-GB realisations"
```

---

## Phase 4: M16 — Textos Autênticos (5 nodes)

### Task 4.1: Create B1-TEXT-001/002/003/004/005 nodes + pt-PT realisations

**Files:**
- Create: `src/content/cefr-nodes/b1-text-001.yaml` through `b1-text-005.yaml`
- Create: `src/content/realisations/pt-PT/b1-text-001.yaml` through `b1-text-005.yaml`

- [ ] **Step 1: Create B1-TEXT-001 node + pt-PT**

Node: listening — "Can understand the main points of clear standard speech"
Vocabulary: 6 items (palestra, apresentação, discurso, o ponto principal, de acordo com, em relação a)
Grammar: Reported speech introduction

- [ ] **Step 2: Create B1-TEXT-002 node + pt-PT**

Node: listening — "Can understand the main point of radio/TV programmes on familiar topics"
Vocabulary: 6 items (programa, emissão, televisão, rádio, apresentador, audiência)
Grammar: Understanding media language

- [ ] **Step 3: Create B1-TEXT-003 node + pt-PT**

Node: reading — "Can understand articles and reports on contemporary problems"
Vocabulary: 6 items (problema, questão, solução, debate público, opinião pública, sociedade)
Grammar: Formal register vocabulary

- [ ] **Step 4: Create B1-TEXT-004 node + pt-PT**

Node: reading — "Can understand contemporary literary prose in simplified form"
Vocabulary: 6 items (romance, autor, personagem, enredo, capítulo, narrativa)
Grammar: Literary past tenses (imperfeito vs. perfeito in narrative)

- [ ] **Step 5: Create B1-TEXT-005 node + pt-PT**

Node: spoken_production — "Can summarise and report what they have read or heard"
Vocabulary: 6 items (resumir, de acordo com o texto, o autor afirma, em suma, a principal conclusão, segundo as notícias)
Grammar: Reported speech structures

- [ ] **Step 6: Run validation**

- [ ] **Step 7: Commit**

```bash
git add src/content/cefr-nodes/b1-text-00{1,2,3,4,5}.yaml src/content/realisations/pt-PT/b1-text-00{1,2,3,4,5}.yaml
git commit -m "content(b1): add B1-TEXT-001/002/003/004/005 nodes + pt-PT realisations"
```

### Task 4.2: Create B1-TEXT-001/002/003/004/005 en-GB realisations

- [ ] **Step 1: Create en-GB realisations for all 5 nodes**

- [ ] **Step 2: Run validation**

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/b1-text-00{1,2,3,4,5}.yaml
git commit -m "content(b1): add B1-TEXT-001/002/003/004/005 en-GB realisations"
```

---

## Phase 5: Update cefr-mapping.md

### Task 5.1: Update CEFR mapping with B1 section

**Files:**
- Modify: `docs/cefr-mapping.md`

- [ ] **Step 1: Add B1 nodes table**

Add a new section after A2 with all 18 B1 nodes marked as ✅ Realised.

- [ ] **Step 2: Update skill distribution table**

Add B1 row to the combined skill distribution table.

- [ ] **Step 3: Update AIMA module coverage table**

Add B1M13–B1M16 rows showing full coverage.

- [ ] **Step 4: Run all gates**

Run: `npm run typecheck && npm run lint && npm run build && npm test`

- [ ] **Step 5: Commit**

```bash
git add docs/cefr-mapping.md
git commit -m "docs(cefr): update mapping — 55 nodes realised (17 A1 + 20 A2 + 18 B1)"
```

---

## Phase 6: Final Verification

### Task 6.1: Full validation suite

- [ ] **Step 1: Run content validation**

Run: `npm run validate:content`
Expected: 148 realisations (74 existing + 74 new B1)

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: 0 errors

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: ESLint + Prettier clean

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: ~117 pages built

- [ ] **Step 5: Run unit tests**

Run: `npm test`
Expected: 52/52 pass

- [ ] **Step 6: Run E2E tests**

Run: `npm run test:e2e`
Expected: All pass (review session dynamic total)

---

*Plan written for learn-languages Epic #52. Execute via superpowers:executing-plans or superpowers:subagent-driven-development.*
