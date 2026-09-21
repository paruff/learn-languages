# C1 Content — EN→PT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 23 C1 CEFR nodes and 46 paired realisations (pt-PT + en-GB) covering 10 topic groups (SOCIAL, ARGUE, TEXT, SPOKEN, WRITTEN, ACADEMIC, PROFESSIONAL, NUANCED, LITERARY, MEDIATION).

**Architecture:** Content-only implementation following the B2 pattern. Each node gets a YAML file in `cefr-nodes/` and paired realisations in `realisations/pt-PT/` and `realisations/en-GB/`. Grammar examples are string arrays (not objects). Vocabulary IDs follow `{lang}-{nodeId}-{SEQ}` format. C1 introduces 8 new grammar concepts beyond B2: compound subjunctive tenses, cleft sentences, inversion, ellipsis, nuanced modality, register switching, idiomatic expressions, advanced connectors.

**Tech Stack:** Astro 5.x content collections, Zod schema validation, YAML, Prettier formatting

**Spec:** `docs/superpowers/specs/2026-09-21-c1-content-design.md`

## Global Constraints

- Grammar examples must be arrays of strings (not objects)
- Vocabulary IDs: `/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/`
- NodeIds: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`
- Gender enum: `"masculine"|"feminine"|"neuter"|"n/a"`
- 6 vocabulary items per node
- 1-2 grammar points per node
- Grammar `explanation` must be ≥20 characters
- Vocabulary `example` and `exampleTranslation` must be ≥5 characters
- Run `npx prettier --write` on all YAML files before committing
- Run `npm run validate:content` after each phase
- Work on branch `feat/c1-content-completion` created from `main` (B2 merged via PR #80)
- pt-PT realisation is the source of truth; en-GB pairs its vocabulary items deterministically (same seq numbers)

---

## Phase 0: Baseline (C1-SOCIAL-001)

### Task 0.1: Create C1-SOCIAL-001 CEFR node

**Files:**
- Create: `src/content/cefr-nodes/c1-social-001.yaml`

**Interfaces:**
- Consumes: B2-SOCIAL-001 (prerequisite)
- Produces: C1-SOCIAL-001 node file

- [ ] **Step 1: Create node file**

```yaml
nodeId: C1-SOCIAL-001
cefrLevel: C1
skill: spoken_interaction
canDo: "Can express him/herself fluently and spontaneously without much obvious searching for expressions"
pragmaticFocus: "Fluent spontaneous interaction"
notionalFocus: "Automaticity, flexibility in social contexts"
relatedNodes:
  - C1-SOCIAL-002
  - B2-SOCIAL-001
prerequisiteNodes:
  - B2-SOCIAL-001
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/cefr-nodes/c1-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/cefr-nodes/c1-social-001.yaml
git commit -m "content(c1): add C1-SOCIAL-001 node"
```

### Task 0.2: Create C1-SOCIAL-001 pt-PT realisation

**Files:**
- Create: `src/content/realisations/pt-PT/c1-social-001.yaml`

**Interfaces:**
- Consumes: C1-SOCIAL-001 node
- Produces: pt-PT realisation with 6 vocabulary items, 1 grammar point on compound subjunctive tenses

- [ ] **Step 1: Create pt-PT realisation**

```yaml
nodeId: C1-SOCIAL-001
lang: pt-PT
vocabulary:
  - id: pt-PT-C1-SOCIAL-001-001
    term: "expressar-se com fluidez"
    translation: "to express oneself fluently"
    partOfSpeech: phrase
    gender: n/a
    example: "Consegue expressar-se com fluidez em qualquer situação."
    exampleTranslation: "He/She can express himself/herself fluently in any situation."
  - id: pt-PT-C1-SOCIAL-001-002
    term: "sem hesitação"
    translation: "without hesitation"
    partOfSpeech: phrase
    gender: n/a
    example: "Respondeu sem hesitação às perguntas difíceis."
    exampleTranslation: "He answered the difficult questions without hesitation."
  - id: pt-PT-C1-SOCIAL-001-003
    term: "adaptar o discurso"
    translation: "to adapt one's discourse"
    partOfSpeech: phrase
    gender: n/a
    example: "Sabe adaptar o discurso ao público que tem à frente."
    exampleTranslation: "He knows how to adapt his discourse to the audience in front of him."
  - id: pt-PT-C1-SOCIAL-001-004
    term: "antecipar a reação"
    translation: "to anticipate the reaction"
    partOfSpeech: phrase
    gender: n/a
    example: "Consegue antecipar a reação dos interlocutores."
    exampleTranslation: "He can anticipate the reaction of his interlocutors."
  - id: pt-PT-C1-SOCIAL-001-005
    term: "manter a naturalidade"
    translation: "to maintain naturalness"
    partOfSpeech: phrase
    gender: n/a
    example: "Mesmo em situações formais, mantém a naturalidade."
    exampleTranslation: "Even in formal situations, he maintains his naturalness."
  - id: pt-PT-C1-SOCIAL-001-006
    term: "recorrer a estratégias"
    translation: "to resort to strategies"
    partOfSpeech: phrase
    gender: n/a
    example: "Recorre a estratégias de reformulação para se fazer entender."
    exampleTranslation: "He resorts to reformulation strategies to make himself understood."
grammar:
  - id: C1-GRAMMAR-001
    point: "Compound subjunctive tenses"
    explanation: "Using mais-que-perfeito do conjuntivo and futuro composto do conjuntivo for complex hypothetical and future-completed situations"
    examples:
      - "Se tivesse estudado mais, teria passado no exame."
      - "Quando tiver terminado o trabalho, irei descansar."
    cefrNotes: "C1 learners use compound subjunctive tenses for sophisticated hypothetical reasoning"
culturalNotes: "European Portuguese fluency values spontaneity within politeness norms. Speakers use discourse markers like 'pois é' and 'então' to maintain conversational rhythm, while formal contexts demand slower, more deliberate speech."
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/realisations/pt-PT/c1-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/pt-PT/c1-social-001.yaml
git commit -m "content(c1): add C1-SOCIAL-001 pt-PT realisation"
```

### Task 0.3: Create C1-SOCIAL-001 en-GB realisation

**Files:**
- Create: `src/content/realisations/en-GB/c1-social-001.yaml`

**Interfaces:**
- Consumes: C1-SOCIAL-001 node, pt-PT realisation (for vocabulary pairing)
- Produces: en-GB realisation with 6 paired vocabulary items, 1 grammar point

- [ ] **Step 1: Create en-GB realisation**

```yaml
nodeId: C1-SOCIAL-001
lang: en-GB
vocabulary:
  - id: en-GB-C1-SOCIAL-001-001
    term: "to express oneself fluently"
    translation: "expressar-se com fluidez"
    partOfSpeech: phrase
    gender: n/a
    example: "He can express himself fluently in any situation."
    exampleTranslation: "Consegue expressar-se com fluidez em qualquer situação."
  - id: en-GB-C1-SOCIAL-001-002
    term: "without hesitation"
    translation: "sem hesitação"
    partOfSpeech: phrase
    gender: n/a
    example: "He answered the difficult questions without hesitation."
    exampleTranslation: "Respondeu sem hesitação às perguntas difíceis."
  - id: en-GB-C1-SOCIAL-001-003
    term: "to adapt one's discourse"
    translation: "adaptar o discurso"
    partOfSpeech: phrase
    gender: n/a
    example: "He knows how to adapt his discourse to the audience in front of him."
    exampleTranslation: "Sabe adaptar o discurso ao público que tem à frente."
  - id: en-GB-C1-SOCIAL-001-004
    term: "to anticipate the reaction"
    translation: "antecipar a reação"
    partOfSpeech: phrase
    gender: n/a
    example: "He can anticipate the reaction of his interlocutors."
    exampleTranslation: "Consegue antecipar a reação dos interlocutores."
  - id: en-GB-C1-SOCIAL-001-005
    term: "to maintain naturalness"
    translation: "manter a naturalidade"
    partOfSpeech: phrase
    gender: n/a
    example: "Even in formal situations, he maintains his naturalness."
    exampleTranslation: "Mesmo em situações formais, mantém a naturalidade."
  - id: en-GB-C1-SOCIAL-001-006
    term: "to resort to strategies"
    translation: "recorrer a estratégias"
    partOfSpeech: phrase
    gender: n/a
    example: "He resorts to reformulation strategies to make himself understood."
    exampleTranslation: "Recorre a estratégias de reformulação para se fazer entender."
grammar:
  - id: C1-GRAMMAR-001
    point: "Compound subjunctive tenses"
    explanation: "Using compound subjunctive structures for complex hypothetical and future-completed situations"
    examples:
      - "If I had studied more, I would have passed the exam."
      - "Once I have finished the work, I will rest."
    cefrNotes: "C1 learners use compound subjunctive tenses for sophisticated hypothetical reasoning"
culturalNotes: "British English fluency balances spontaneity with turn-taking fairness. Overlapping is rare; pausing signals thoughtfulness. The pronoun 'one' or passive forms are preferred in formal register."
```

- [ ] **Step 2: Format and validate**

Run: `npx prettier --write src/content/realisations/en-GB/c1-social-001.yaml`
Run: `npm run validate:content`

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/c1-social-001.yaml
git commit -m "content(c1): add C1-SOCIAL-001 en-GB realisation"
```

---

## Phase 1: SOCIAL-002 + ARGUE Nodes (C1-SOCIAL-002, C1-ARGUE-001/002/003/004)

### Task 1.1: Create C1-SOCIAL-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-social-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-social-002.yaml`
- Create: `src/content/realisations/en-GB/c1-social-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-SOCIAL-002
cefrLevel: C1
skill: spoken_interaction
canDo: "Can use language flexibly and effectively for social purposes in a wide range of contexts"
pragmaticFocus: "Flexible social register management"
notionalFocus: "Register switching, social nuance"
relatedNodes:
  - C1-SOCIAL-001
  - C1-NUANCED-001
prerequisiteNodes:
  - C1-SOCIAL-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on register flexibility; 1 grammar point on register switching — formal/informal verb forms like "pode fazer" vs "fazer")

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

```bash
npx prettier --write src/content/cefr-nodes/c1-social-002.yaml src/content/realisations/pt-PT/c1-social-002.yaml src/content/realisations/en-GB/c1-social-002.yaml
npm run validate:content
git add src/content/cefr-nodes/c1-social-002.yaml src/content/realisations/pt-PT/c1-social-002.yaml src/content/realisations/en-GB/c1-social-002.yaml
git commit -m "content(c1): add C1-SOCIAL-002 node + paired realisations"
```

### Task 1.2: Create C1-ARGUE-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-argue-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-argue-001.yaml`
- Create: `src/content/realisations/en-GB/c1-argue-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ARGUE-001
cefrLevel: C1
skill: spoken_production
canDo: "Can present clear, detailed descriptions of complex subjects integrating sub-themes and developing particular points"
pragmaticFocus: "Complex subject presentation"
notionalFocus: "Structure, integration of sub-themes"
relatedNodes:
  - C1-ARGUE-002
  - B2-ARGUE-003
prerequisiteNodes:
  - B2-ARGUE-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on complex description; 1 grammar point on cleft sentences with "ser" + relative clauses)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 1.3: Create C1-ARGUE-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-argue-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-argue-002.yaml`
- Create: `src/content/realisations/en-GB/c1-argue-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ARGUE-002
cefrLevel: C1
skill: spoken_production
canDo: "Can develop an argument systematically with appropriate highlighting of significant points and relevant supporting detail while evaluating counter-arguments"
pragmaticFocus: "Systematic argumentation with counter-argument evaluation"
notionalFocus: "Reasoning, counter-argumentation, emphasis"
relatedNodes:
  - C1-ARGUE-001
  - C1-ARGUE-003
  - B2-ARGUE-002
prerequisiteNodes:
  - C1-ARGUE-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on argumentation; 1 grammar point on advanced connectors — "na medida em que", "tendo em conta que")

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 1.4: Create C1-ARGUE-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-argue-003.yaml`
- Create: `src/content/realisations/pt-PT/c1-argue-003.yaml`
- Create: `src/content/realisations/en-GB/c1-argue-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ARGUE-003
cefrLevel: C1
skill: spoken_production
canDo: "Can express subtle shades of meaning using a wide range of qualifying devices"
pragmaticFocus: "Subtle meaning and qualifying devices"
notionalFocus: "Hedging, mitigation, nuance"
relatedNodes:
  - C1-ARGUE-002
  - C1-NUANCED-001
prerequisiteNodes:
  - C1-ARGUE-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on qualifying/hedging; 1 grammar point on nuanced modality — epistemic adverbs "decerto", "possivelmente", "talvez" with subjunctive)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 1.5: Create C1-ARGUE-004 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-argue-004.yaml`
- Create: `src/content/realisations/pt-PT/c1-argue-004.yaml`
- Create: `src/content/realisations/en-GB/c1-argue-004.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ARGUE-004
cefrLevel: C1
skill: writing
canDo: "Can sustain a viewpoint in writing by providing relevant supporting detail and evaluating counter-arguments"
pragmaticFocus: "Written viewpoint sustainability"
notionalFocus: "Evidence, counter-argument, written argument"
relatedNodes:
  - C1-ARGUE-002
  - C1-WRITTEN-002
prerequisiteNodes:
  - C1-ARGUE-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on written argumentation; 1 grammar point on inversion for emphasis — "só assim", "raramente")

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 2: TEXT Nodes (C1-TEXT-001/002/003/004)

### Task 2.1: Create C1-TEXT-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-text-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-text-001.yaml`
- Create: `src/content/realisations/en-GB/c1-text-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-TEXT-001
cefrLevel: C1
skill: reading
canDo: "Can understand a wide range of demanding, longer texts and recognise implicit meaning"
pragmaticFocus: "Implicit meaning recognition"
notionalFocus: "Inference, demanding texts"
relatedNodes:
  - C1-TEXT-002
  - B2-TEXT-003
prerequisiteNodes:
  - B2-TEXT-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on inference/critical reading; 1 grammar point on compound subjunctive in reading comprehension contexts)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.2: Create C1-TEXT-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-text-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-text-002.yaml`
- Create: `src/content/realisations/en-GB/c1-text-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-TEXT-002
cefrLevel: C1
skill: reading
canDo: "Can understand specialised articles and longer technical instructions, even when not related to their own field"
pragmaticFocus: "Specialised technical comprehension"
notionalFocus: "Technical vocabulary, instruction following"
relatedNodes:
  - C1-TEXT-001
  - C1-ACADEMIC-001
prerequisiteNodes:
  - C1-TEXT-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on technical/specialised language; 1 grammar point on ellipsis in dense technical writing)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.3: Create C1-TEXT-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-text-003.yaml`
- Create: `src/content/realisations/pt-PT/c1-text-003.yaml`
- Create: `src/content/realisations/en-GB/c1-text-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-TEXT-003
cefrLevel: C1
skill: reading
canDo: "Can appreciate variety of style and recognise explicit and implicit meaning in literary and non-literary texts"
pragmaticFocus: "Stylistic appreciation"
notionalFocus: "Style, tone, register in texts"
relatedNodes:
  - C1-LITERARY-001
  - B2-TEXT-004
prerequisiteNodes:
  - B2-TEXT-004
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on style/appreciation; 1 grammar point on idiomatic expressions used stylistically)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 2.4: Create C1-TEXT-004 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-text-004.yaml`
- Create: `src/content/realisations/pt-PT/c1-text-004.yaml`
- Create: `src/content/realisations/en-GB/c1-text-004.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-TEXT-004
cefrLevel: C1
skill: reading
canDo: "Can summarise information from different spoken and written sources, reconstructing arguments and accounts"
pragmaticFocus: "Cross-source summarisation"
notionalFocus: "Synthesis, reconstruction of arguments"
relatedNodes:
  - C1-TEXT-001
  - C1-MEDIATION-001
prerequisiteNodes:
  - C1-TEXT-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on summarisation/synthesis; 1 grammar point on advanced connectors for synthesis)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 3: SPOKEN + WRITTEN Nodes (C1-SPOKEN-001/002/003, C1-WRITTEN-001/002/003)

### Task 3.1: Create C1-SPOKEN-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-spoken-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-spoken-001.yaml`
- Create: `src/content/realisations/en-GB/c1-spoken-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-SPOKEN-001
cefrLevel: C1
skill: listening
canDo: "Can understand extended speech even when it is not clearly structured and when relationships are only implied"
pragmaticFocus: "Implied relationships in speech"
notionalFocus: "Extended unstructured speech, implication"
relatedNodes:
  - C1-SPOKEN-002
  - B2-SPOKEN-003
prerequisiteNodes:
  - B2-SPOKEN-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on understanding implied speech; 1 grammar point on inversion in spoken emphasis)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.2: Create C1-SPOKEN-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-spoken-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-spoken-002.yaml`
- Create: `src/content/realisations/en-GB/c1-spoken-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-SPOKEN-002
cefrLevel: C1
skill: listening
canDo: "Can understand television programmes and films without too much effort"
pragmaticFocus: "Media comprehension"
notionalFocus: "Films, TV, colloquial registers"
relatedNodes:
  - C1-SPOKEN-001
  - C1-NUANCED-001
prerequisiteNodes:
  - C1-SPOKEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on media/colloquial language; 1 grammar point on idiomatic expressions in colloquial speech)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.3: Create C1-SPOKEN-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-spoken-003.yaml`
- Create: `src/content/realisations/pt-PT/c1-spoken-003.yaml`
- Create: `src/content/realisations/en-GB/c1-spoken-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-SPOKEN-003
cefrLevel: C1
skill: spoken_production
canDo: "Can present a complex topic to an audience with an appropriate structure and rhetorical control"
pragmaticFocus: "Rhetorical presentation"
notionalFocus: "Audience-aware structure, rhetoric"
relatedNodes:
  - C1-SPOKEN-001
  - C1-ARGUE-001
prerequisiteNodes:
  - C1-SPOKEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on public speaking/rhetoric; 1 grammar point on cleft sentences and inversion for rhetorical effect)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.4: Create C1-WRITTEN-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-written-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-written-001.yaml`
- Create: `src/content/realisations/en-GB/c1-written-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-WRITTEN-001
cefrLevel: C1
skill: writing
canDo: "Can write clear, well-structured, detailed text on complex subjects in a controlled, effective register"
pragmaticFocus: "Controlled complex writing"
notionalFocus: "Structure, register control"
relatedNodes:
  - C1-WRITTEN-002
  - B2-WRITTEN-001
prerequisiteNodes:
  - B2-WRITTEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on formal writing; 1 grammar point on register switching and advanced connectors)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.5: Create C1-WRITTEN-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-written-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-written-002.yaml`
- Create: `src/content/realisations/en-GB/c1-written-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-WRITTEN-002
cefrLevel: C1
skill: writing
canDo: "Can write an essay or report that develops an argument systematically with appropriate highlighting of significant points and relevant supporting detail"
pragmaticFocus: "Systematic written argument"
notionalFocus: "Essay/report structure, emphasis, evidence"
relatedNodes:
  - C1-WRITTEN-001
  - C1-ARGUE-004
  - C1-ACADEMIC-002
prerequisiteNodes:
  - C1-WRITTEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on essay/report writing; 1 grammar point on compound subjunctive in counterfactual argumentation)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 3.6: Create C1-WRITTEN-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-written-003.yaml`
- Create: `src/content/realisations/pt-PT/c1-written-003.yaml`
- Create: `src/content/realisations/en-GB/c1-written-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-WRITTEN-003
cefrLevel: C1
skill: writing
canDo: "Can write letters and emails that follow standard conventions with an appropriate degree of formality"
pragmaticFocus: "Formal correspondence"
notionalFocus: "Letter conventions, formality"
relatedNodes:
  - C1-WRITTEN-001
  - C1-PROFESSIONAL-002
prerequisiteNodes:
  - C1-WRITTEN-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on correspondence; 1 grammar point on nuanced modality / hedging in polite correspondence)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 4: ACADEMIC + LITERARY Nodes (C1-ACADEMIC-001/002, C1-LITERARY-001)

### Task 4.1: Create C1-ACADEMIC-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-academic-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-academic-001.yaml`
- Create: `src/content/realisations/en-GB/c1-academic-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ACADEMIC-001
cefrLevel: C1
skill: reading
canDo: "Can understand academic lectures and research papers in familiar and related fields"
pragmaticFocus: "Academic comprehension"
notionalFocus: "Lectures, research papers, academic register"
relatedNodes:
  - C1-ACADEMIC-002
  - B2-TEXT-002
prerequisiteNodes:
  - C1-TEXT-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on academic language; 1 grammar point on impersonal constructions and inversion in academic prose)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 4.2: Create C1-ACADEMIC-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-academic-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-academic-002.yaml`
- Create: `src/content/realisations/en-GB/c1-academic-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-ACADEMIC-002
cefrLevel: C1
skill: writing
canDo: "Can write a research abstract or literature review with appropriate academic conventions"
pragmaticFocus: "Academic writing conventions"
notionalFocus: "Abstracts, literature review, citation"
relatedNodes:
  - C1-ACADEMIC-001
  - C1-WRITTEN-002
prerequisiteNodes:
  - C1-ACADEMIC-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on academic writing; 1 grammar point on advanced connectors and compound subjunctive in academic register)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 4.3: Create C1-LITERARY-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-literary-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-literary-001.yaml`
- Create: `src/content/realisations/en-GB/c1-literary-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-LITERARY-001
cefrLevel: C1
skill: reading
canDo: "Can appreciate literary texts and recognise stylistic devices and their effect"
pragmaticFocus: "Literary appreciation"
notionalFocus: "Fiction, poetry, stylistic devices"
relatedNodes:
  - C1-TEXT-003
  - B2-TEXT-004
prerequisiteNodes:
  - C1-TEXT-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on literary analysis; 1 grammar point on ellipsis and idiomatic expressions in literary register)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 5: PROFESSIONAL + NUANCED + MEDIATION Nodes (C1-PROFESSIONAL-001/002, C1-NUANCED-001, C1-MEDIATION-001)

### Task 5.1: Create C1-PROFESSIONAL-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-professional-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-professional-001.yaml`
- Create: `src/content/realisations/en-GB/c1-professional-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-PROFESSIONAL-001
cefrLevel: C1
skill: spoken_interaction
canDo: "Can participate effectively in formal meetings and negotiations, asserting views and negotiating outcomes"
pragmaticFocus: "Formal meeting participation"
notionalFocus: "Negotiation, meetings, persuasion"
relatedNodes:
  - C1-PROFESSIONAL-002
  - C1-ARGUE-002
prerequisiteNodes:
  - C1-ARGUE-002
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on meetings/negotiation; 1 grammar point on register switching and nuanced modality for polite assertion)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 5.2: Create C1-PROFESSIONAL-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-professional-002.yaml`
- Create: `src/content/realisations/pt-PT/c1-professional-002.yaml`
- Create: `src/content/realisations/en-GB/c1-professional-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-PROFESSIONAL-002
cefrLevel: C1
skill: writing
canDo: "Can write formal reports, proposals, and correspondence appropriate to the professional context"
pragmaticFocus: "Professional written output"
notionalFocus: "Reports, proposals, formal documents"
relatedNodes:
  - C1-PROFESSIONAL-001
  - C1-WRITTEN-003
prerequisiteNodes:
  - C1-PROFESSIONAL-001
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on professional writing; 1 grammar point on advanced connectors and impersonal constructions)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 5.3: Create C1-NUANCED-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-nuanced-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-nuanced-001.yaml`
- Create: `src/content/realisations/en-GB/c1-nuanced-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-NUANCED-001
cefrLevel: C1
skill: spoken_production
canDo: "Can express irony, metaphor, and register shifts appropriately to convey precise meaning and effect"
pragmaticFocus: "Irony, metaphor, register control"
notionalFocus: "Figurative language, irony, tone"
relatedNodes:
  - C1-ARGUE-003
  - C1-SPOKEN-002
  - B2-SOCIAL-003
prerequisiteNodes:
  - C1-ARGUE-003
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on figurative/ironic language; 1 grammar point on idiomatic expressions and register switching for irony/tone)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

### Task 5.4: Create C1-MEDIATION-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/c1-mediation-001.yaml`
- Create: `src/content/realisations/pt-PT/c1-mediation-001.yaml`
- Create: `src/content/realisations/en-GB/c1-mediation-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: C1-MEDIATION-001
cefrLevel: C1
skill: writing
canDo: "Can mediate complex information between speakers of Portuguese and English, preserving nuance and adapting register"
pragmaticFocus: "Cross-language mediation"
notionalFocus: "Paraphrase, summarisation, register adaptation"
relatedNodes:
  - C1-TEXT-004
  - C1-PROFESSIONAL-002
prerequisiteNodes:
  - C1-TEXT-004
```

- [ ] **Step 2: Create pt-PT realisation** (6 vocabulary items on mediation/paraphrase; 1 grammar point on advanced connectors for preserving nuance in reformulation)

- [ ] **Step 3: Create en-GB realisation** (paired with pt-PT)

- [ ] **Step 4: Format, validate, commit**

---

## Phase 6: Final Verification

### Task 6.1: Update cefr-mapping.md

**Files:**
- Modify: `docs/cefr-mapping.md`

- [ ] **Step 1: Add C1 section**

Add C1 node table (23 nodes), skill distribution, and category coverage after B2 section. Update title to "A1/A2/B1/B2/C1 Inventory".

- [ ] **Step 2: Update combined skill distribution table**

Update to include C1 column: 73 existing + 23 C1 = 96 total nodes.

- [ ] **Step 3: Commit**

```bash
git add docs/cefr-mapping.md
git commit -m "docs(cefr-mapping): add C1 section and update skill distribution"
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
- validate:content: 192 realisations, 96 nodes
- typecheck: 0 errors
- lint: clean
- build: ~199 pages
- test: all passing (≥90% coverage maintained)

- [ ] **Step 3: Final commit if any fixes needed**

---

*Plan complete. 23 tasks across 7 phases. Estimated ~3-4 hours of implementation.*