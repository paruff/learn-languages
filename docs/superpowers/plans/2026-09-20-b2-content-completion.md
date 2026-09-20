# B2 Content — EN→PT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 18 B2 CEFR nodes and 36 paired realisations (pt-PT + en-GB) covering Argumentation, Spontaneous Interaction, Complex Texts, Formal Writing, and Extended Speech.

**Architecture:** Content-only implementation following established patterns from A1-B1. Each node gets a YAML file in `cefr-nodes/` and paired realisations in `realisations/pt-PT/` and `realisations/en-GB/`. Grammar examples are string arrays (not objects). Vocabulary IDs follow `{lang}-{nodeId}-{SEQ}` format.

**Tech Stack:** Astro 5.x content collections, Zod schema validation, YAML, Prettier formatting

**Spec:** `docs/superpowers/specs/2026-09-20-b2-content-design.md`

## Global Constraints

- Grammar examples must be arrays of strings (not objects)
- Vocabulary IDs: `/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/`
- NodeIds: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`
- Gender enum: `"masculine"|"feminine"|"neuter"|"n/a"`
- 6 vocabulary items per node
- 1-2 grammar points per node
- Run `npx prettier --write` on all YAML files before committing
- Run `npm run validate:content` after each phase

---

## Phase 0: Baseline (B2-SOCIAL-001)

### Task 0.1: Create B2-SOCIAL-001 CEFR node

**Files:**
- Create: `src/content/cefr-nodes/b2-social-001.yaml`

**Interfaces:**
- Consumes: B1-SOCIAL-002 (prerequisite)
- Produces: B2-SOCIAL-001 node file

- [ ] **Step 1: Create node file**

```yaml
nodeId: B2-SOCIAL-001
cefrLevel: B2
skill: spoken_interaction
canDo: "Can interact with a degree of fluency and spontaneity on familiar topics"
pragmaticFocus: "Fluent interaction management"
notionalFocus: "Spontaneous discussion, topic development"
relatedNodes:
  - B2-SOCIAL-002
  - B1-SOCIAL-002
prerequisiteNodes:
  - B1-SOCIAL-002
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/cefr-nodes/b2-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/cefr-nodes/b2-social-001.yaml
git commit -m "content(b2): add B2-SOCIAL-001 node"
```

### Task 0.2: Create B2-SOCIAL-001 pt-PT realisation

**Files:**
- Create: `src/content/realisations/pt-PT/b2-social-001.yaml`

**Interfaces:**
- Consumes: B2-SOCIAL-001 node
- Produces: pt-PT realisation with 6 vocabulary items, 1-2 grammar points

- [ ] **Step 1: Create pt-PT realisation**

```yaml
nodeId: B2-SOCIAL-001
lang: pt-PT
vocabulary:
  - id: pt-PT-B2-SOCIAL-001-001
    term: "aprofundar a discussão"
    translation: "to deepen the discussion"
    partOfSpeech: phrase
    gender: n/a
    example: "Podemos aprofundar a discussão sobre este tema?"
    exampleTranslation: "Can we deepen the discussion about this topic?"
  - id: pt-PT-B2-SOCIAL-001-002
    term: "manter a conversa"
    translation: "to keep the conversation going"
    partOfSpeech: phrase
    gender: n/a
    example: "É importante manter a conversa fluente."
    exampleTranslation: "It is important to keep the conversation flowing."
  - id: pt-PT-B2-SOCIAL-001-003
    term: "reagir espontaneamente"
    translation: "to react spontaneously"
    partOfSpeech: phrase
    gender: n/a
    example: "Consigo reagir espontaneamente em discussões."
    exampleTranslation: "I can react spontaneously in discussions."
  - id: pt-PT-B2-SOCIAL-001-004
    term: "participar ativamente"
    translation: "to participate actively"
    partOfSpeech: phrase
    gender: n/a
    example: "Gosto de participar ativamente nas aulas."
    exampleTranslation: "I like to participate actively in classes."
  - id: pt-PT-B2-SOCIAL-001-005
    term: "expressar ideias com clareza"
    translation: "to express ideas clearly"
    partOfSpeech: phrase
    gender: n/a
    example: "É fundamental expressar ideias com clareza."
    exampleTranslation: "It is fundamental to express ideas clearly."
  - id: pt-PT-B2-SOCIAL-001-006
    term: "interagir com fluidez"
    translation: "to interact with fluency"
    partOfSpeech: phrase
    gender: n/a
    example: "Quero interagir com fluidez em português."
    exampleTranslation: "I want to interact with fluency in Portuguese."
grammar:
  - id: B2-GRAMMAR-001
    point: "Subjunctive mood in dependent clauses"
    explanation: "Using presente do conjuntivo after verbs of desire, doubt, emotion"
    examples:
      - "Espero que possas vir amanhã."
      - "Duvido que ele saiba a verdade."
    cefrNotes: "B2 learners use subjunctive fluently in context, not just recognising it"
culturalNotes: "Portuguese conversation values fluency and spontaneity. Speakers often interrupt politely to show engagement. Raising voice slightly signals passion, not anger."
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/realisations/pt-PT/b2-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/pt-PT/b2-social-001.yaml
git commit -m "content(b2): add B2-SOCIAL-001 pt-PT realisation"
```

### Task 0.3: Create B2-SOCIAL-001 en-GB realisation

**Files:**
- Create: `src/content/realisations/en-GB/b2-social-001.yaml`

**Interfaces:**
- Consumes: B2-SOCIAL-001 node, pt-PT realisation (for vocabulary pairing)
- Produces: en-GB realisation with 6 vocabulary items, 1-2 grammar points

- [ ] **Step 1: Create en-GB realisation**

```yaml
nodeId: B2-SOCIAL-001
lang: en-GB
vocabulary:
  - id: en-GB-B2-SOCIAL-001-001
    term: "to deepen the discussion"
    translation: "aprofundar a discussão"
    partOfSpeech: phrase
    gender: n/a
    example: "Can we deepen the discussion about this topic?"
    exampleTranslation: "Podemos aprofundar a discussão sobre este tema?"
  - id: en-GB-B2-SOCIAL-001-002
    term: "to keep the conversation going"
    translation: "manter a conversa"
    partOfSpeech: phrase
    gender: n/a
    example: "It is important to keep the conversation flowing."
    exampleTranslation: "É importante manter a conversa fluente."
  - id: en-GB-B2-SOCIAL-001-003
    term: "to react spontaneously"
    translation: "reagir espontaneamente"
    partOfSpeech: phrase
    gender: n/a
    example: "I can react spontaneously in discussions."
    exampleTranslation: "Consigo reagir espontaneamente em discussões."
  - id: en-GB-B2-SOCIAL-001-004
    term: "to participate actively"
    translation: "participar ativamente"
    partOfSpeech: phrase
    gender: n/a
    example: "I like to participate actively in classes."
    exampleTranslation: "Gosto de participar ativamente nas aulas."
  - id: en-GB-B2-SOCIAL-001-005
    term: "to express ideas clearly"
    translation: "expressar ideias com clareza"
    partOfSpeech: phrase
    gender: n/a
    example: "It is fundamental to express ideas clearly."
    exampleTranslation: "É fundamental expressar ideias com clareza."
  - id: en-GB-B2-SOCIAL-001-006
    term: "to interact with fluency"
    translation: "interagir com fluidez"
    partOfSpeech: phrase
    gender: n/a
    example: "I want to interact with fluency in Portuguese."
    exampleTranslation: "Quero interagir com fluidez em português."
grammar:
  - id: B2-GRAMMAR-001
    point: "Subjunctive mood in dependent clauses"
    explanation: "Using present subjunctive after verbs of desire, doubt, emotion"
    examples:
      - "I hope you can come tomorrow."
      - "I doubt he knows the truth."
    cefrNotes: "B2 learners use subjunctive fluently in context"
culturalNotes: "British conversation values measured participation. Active listening through backchannels ('I see', 'right') shows engagement without interrupting."
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/realisations/en-GB/b2-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/b2-social-001.yaml
git commit -m "content(b2): add B2-SOCIAL-001 en-GB realisation"
```

---

## Phase 1: SOCIAL Nodes (B2-SOCIAL-002/003/004)

### Task 1.1: Create B2-SOCIAL-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-social-002.yaml`
- Create: `src/content/realisations/pt-PT/b2-social-002.yaml`
- Create: `src/content/realisations/en-GB/b2-social-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SOCIAL-002
cefrLevel: B2
skill: spoken_interaction
canDo: "Can take an active part in discussion in familiar contexts"
pragmaticFocus: "Active discussion participation"
notionalFocus: "Familiar topics, group discussion"
relatedNodes:
  - B2-SOCIAL-001
  - B1-SOCIAL-002
prerequisiteNodes:
  - B2-SOCIAL-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on future subjunctive)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

```bash
npx prettier --write src/content/cefr-nodes/b2-social-002.yaml src/content/realisations/pt-PT/b2-social-002.yaml src/content/realisations/en-GB/b2-social-002.yaml
npm run validate:content
git add src/content/cefr-nodes/b2-social-002.yaml src/content/realisations/pt-PT/b2-social-002.yaml src/content/realisations/en-GB/b2-social-002.yaml
git commit -m "content(b2): add B2-SOCIAL-002 node + paired realisations"
```

### Task 1.2: Create B2-SOCIAL-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-social-003.yaml`
- Create: `src/content/realisations/pt-PT/b2-social-003.yaml`
- Create: `src/content/realisations/en-GB/b2-social-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SOCIAL-003
cefrLevel: B2
skill: spoken_interaction
canDo: "Can account for and sustain views by giving relevant explanations and arguments"
pragmaticFocus: "View sustaining with explanations"
notionalFocus: "Justification, argumentation in conversation"
relatedNodes:
  - B2-SOCIAL-001
  - B2-ARGUE-001
prerequisiteNodes:
  - B2-SOCIAL-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on reported speech)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 1.3: Create B2-SOCIAL-004 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-social-004.yaml`
- Create: `src/content/realisations/pt-PT/b2-social-004.yaml`
- Create: `src/content/realisations/en-GB/b2-social-004.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SOCIAL-004
cefrLevel: B2
skill: spoken_interaction
canDo: "Can clarify a detailed point of view clearly"
pragmaticFocus: "Clear clarification of complex ideas"
notionalFocus: "Detail, precision in explanation"
relatedNodes:
  - B2-SOCIAL-003
  - B1-CLARIFY-001
prerequisiteNodes:
  - B2-SOCIAL-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on complex conditionals)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 2: ARGUE Nodes (B2-ARGUE-001/002/003/004)

### Task 2.1: Create B2-ARGUE-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-argue-001.yaml`
- Create: `src/content/realisations/pt-PT/b2-argue-001.yaml`
- Create: `src/content/realisations/en-GB/b2-argue-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-ARGUE-001
cefrLevel: B2
skill: spoken_production
canDo: "Can construct a chain of reasoning"
pragmaticFocus: "Logical argumentation"
notionalFocus: "Reasoning, logical structure"
relatedNodes:
  - B2-ARGUE-002
  - B1-OPINION-001
prerequisiteNodes:
  - B1-OPINION-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on passive voice)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.2: Create B2-ARGUE-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-argue-002.yaml`
- Create: `src/content/realisations/pt-PT/b2-argue-002.yaml`
- Create: `src/content/realisations/en-GB/b2-argue-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-ARGUE-002
cefrLevel: B2
skill: spoken_production
canDo: "Can justify viewpoint on topical issues"
pragmaticFocus: "Topical issue justification"
notionalFocus: "Current issues, personal stance"
relatedNodes:
  - B2-ARGUE-001
  - B2-ARGUE-003
prerequisiteNodes:
  - B2-ARGUE-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on relative clauses)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.3: Create B2-ARGUE-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-argue-003.yaml`
- Create: `src/content/realisations/pt-PT/b2-argue-003.yaml`
- Create: `src/content/realisations/en-GB/b2-argue-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-ARGUE-003
cefrLevel: B2
skill: spoken_production
canDo: "Can develop an argument systematically with appropriate highlighting of significant points"
pragmaticFocus: "Systematic argument development"
notionalFocus: "Structured argumentation, emphasis"
relatedNodes:
  - B2-ARGUE-002
  - B2-ARGUE-004
prerequisiteNodes:
  - B2-ARGUE-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on discourse markers)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.4: Create B2-ARGUE-004 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-argue-004.yaml`
- Create: `src/content/realisations/pt-PT/b2-argue-004.yaml`
- Create: `src/content/realisations/en-GB/b2-argue-004.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-ARGUE-004
cefrLevel: B2
skill: writing
canDo: "Can sustain viewpoint by providing relevant supporting detail"
pragmaticFocus: "Written viewpoint sustainability"
notionalFocus: "Supporting evidence, written argument"
relatedNodes:
  - B2-ARGUE-003
  - B2-WRITTEN-001
prerequisiteNodes:
  - B2-ARGUE-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on future subjunctive)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 3: TEXT Nodes (B2-TEXT-001/002/003/004)

### Task 3.1: Create B2-TEXT-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-text-001.yaml`
- Create: `src/content/realisations/pt-PT/b2-text-001.yaml`
- Create: `src/content/realisations/en-GB/b2-text-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-TEXT-001
cefrLevel: B2
skill: reading
canDo: "Can read with a large degree of independence on familiar topics"
pragmaticFocus: "Independent reading strategies"
notionalFocus: "Self-directed text comprehension"
relatedNodes:
  - B2-TEXT-002
  - B1-TEXT-001
prerequisiteNodes:
  - B1-TEXT-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on passive voice)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.2: Create B2-TEXT-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-text-002.yaml`
- Create: `src/content/realisations/pt-PT/b2-text-002.yaml`
- Create: `src/content/realisations/en-GB/b2-text-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-TEXT-002
cefrLevel: B2
skill: reading
canDo: "Can understand articles and reports concerned with contemporary problems"
pragmaticFocus: "Contemporary issue comprehension"
notionalFocus: "News, reports, current affairs"
relatedNodes:
  - B2-TEXT-003
  - B1-TEXT-002
prerequisiteNodes:
  - B1-TEXT-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on complex conditionals)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.3: Create B2-TEXT-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-text-003.yaml`
- Create: `src/content/realisations/pt-PT/b2-text-003.yaml`
- Create: `src/content/realisations/en-GB/b2-text-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-TEXT-003
cefrLevel: B2
skill: reading
canDo: "Can recognise the line of argument in the treatment of the issue presented"
pragmaticFocus: "Argument recognition in texts"
notionalFocus: "Text structure, argumentation analysis"
relatedNodes:
  - B2-TEXT-002
  - B2-ARGUE-001
prerequisiteNodes:
  - B2-TEXT-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on relative clauses)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.4: Create B2-TEXT-004 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-text-004.yaml`
- Create: `src/content/realisations/pt-PT/b2-text-004.yaml`
- Create: `src/content/realisations/en-GB/b2-text-004.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-TEXT-004
cefrLevel: B2
skill: reading
canDo: "Can understand contemporary literary prose"
pragmaticFocus: "Literary text comprehension"
notionalFocus: "Literature, narrative style"
relatedNodes:
  - B2-TEXT-003
  - B2-WRITTEN-001
prerequisiteNodes:
  - B2-TEXT-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on subjunctive mood)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 4: SPOKEN Nodes (B2-SPOKEN-001/002/003)

### Task 4.1: Create B2-SPOKEN-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-spoken-001.yaml`
- Create: `src/content/realisations/pt-PT/b2-spoken-001.yaml`
- Create: `src/content/realisations/en-GB/b2-spoken-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SPOKEN-001
cefrLevel: B2
skill: spoken_production
canDo: "Can present clear, detailed descriptions on a wide range of subjects"
pragmaticFocus: "Detailed presentation"
notionalFocus: "Description, explanation, detail"
relatedNodes:
  - B2-SPOKEN-002
  - B1-DISCOURSE-002
prerequisiteNodes:
  - B1-DISCOURSE-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on passive voice)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 4.2: Create B2-SPOKEN-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-spoken-002.yaml`
- Create: `src/content/realisations/pt-PT/b2-spoken-002.yaml`
- Create: `src/content/realisations/en-GB/b2-spoken-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SPOKEN-002
cefrLevel: B2
skill: spoken_production
canDo: "Can develop a topic systematically with appropriate highlighting of significant points and relevant supporting detail"
pragmaticFocus: "Systematic topic development"
notionalFocus: "Structured speech, emphasis, detail"
relatedNodes:
  - B2-SPOKEN-001
  - B2-ARGUE-003
prerequisiteNodes:
  - B2-SPOKEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on discourse markers)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 4.3: Create B2-SPOKEN-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-spoken-003.yaml`
- Create: `src/content/realisations/pt-PT/b2-spoken-003.yaml`
- Create: `src/content/realisations/en-GB/b2-spoken-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-SPOKEN-003
cefrLevel: B2
skill: listening
canDo: "Can understand extended speech even when it is not clearly structured"
pragmaticFocus: "Extended speech comprehension"
notionalFocus: "Unstructured speech, lectures, discussions"
relatedNodes:
  - B2-SPOKEN-002
  - B1-DISCOURSE-005
prerequisiteNodes:
  - B1-DISCOURSE-005
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on complex conditionals)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 5: WRITTEN Nodes (B2-WRITTEN-001/002/003)

### Task 5.1: Create B2-WRITTEN-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-written-001.yaml`
- Create: `src/content/realisations/pt-PT/b2-written-001.yaml`
- Create: `src/content/realisations/en-GB/b2-written-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-WRITTEN-001
cefrLevel: B2
skill: writing
canDo: "Can write clear, detailed text on a wide range of subjects"
pragmaticFocus: "Clear detailed writing"
notionalFocus: "Range of subjects, written detail"
relatedNodes:
  - B2-WRITTEN-002
  - B1-TEXT-004
prerequisiteNodes:
  - B1-TEXT-004
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on relative clauses)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 5.2: Create B2-WRITTEN-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-written-002.yaml`
- Create: `src/content/realisations/pt-PT/b2-written-002.yaml`
- Create: `src/content/realisations/en-GB/b2-written-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-WRITTEN-002
cefrLevel: B2
skill: writing
canDo: "Can write an essay or report passing on information or giving reasons"
pragmaticFocus: "Essay and report writing"
notionalFocus: "Information transfer, reasoned writing"
relatedNodes:
  - B2-WRITTEN-003
  - B2-ARGUE-004
prerequisiteNodes:
  - B2-WRITTEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on subjunctive mood)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 5.3: Create B2-WRITTEN-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/b2-written-003.yaml`
- Create: `src/content/realisations/pt-PT/b2-written-003.yaml`
- Create: `src/content/realisations/en-GB/b2-written-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: B2-WRITTEN-003
cefrLevel: B2
skill: writing
canDo: "Can write letters highlighting the personal significance of events and experiences"
pragmaticFocus: "Personal correspondence with significance"
notionalFocus: "Letters, personal meaning"
relatedNodes:
  - B2-WRITTEN-002
  - B1-TEXT-005
prerequisiteNodes:
  - B1-TEXT-005
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items, 1 grammar point on reported speech)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 6: Final Verification

### Task 6.1: Update cefr-mapping.md

**Files:**
- Modify: `docs/cefr-mapping.md`

- [ ] **Step 1: Add B2 section**

Add B2 node table, skill distribution, and category coverage after B1 section.

- [ ] **Step 2: Update combined skill distribution table**

Update to include B2 column: 55 existing + 18 B2 = 73 total nodes.

- [ ] **Step 3: Commit**

```bash
git add docs/cefr-mapping.md
git commit -m "docs(cefr-mapping): add B2 section and update skill distribution"
```

### Task 6.2: Final verification

- [ ] **Step 1: Run full validation**

```bash
npm run validate:content
npm run typecheck
npm run lint
npm run build
npm test
```

- [ ] **Step 2: Verify all gates pass**

Expected:
- validate:content: 146 realisations, 73 nodes
- typecheck: 0 errors
- lint: clean
- build: ~153 pages
- test: 52/52 passing

- [ ] **Step 3: Final commit if any fixes needed**

---

*Plan complete. 18 tasks across 6 phases. Estimated ~2-3 hours of implementation.*
