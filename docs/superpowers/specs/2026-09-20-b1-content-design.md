# B1 Content — EN→PT Design Specification

> **Epic:** #52 — B1 Content — EN→PT
> **Status:** Draft
> **Date:** 2026-09-20
> **Predecessor:** #51 (A2 Content Completion)

---

## 1. Objective

Complete the B1 CEFR inventory for EN→PT (European Portuguese) by creating paired en-GB/pt-PT realisations covering all 4 B1 modules from the Referencial Camões PLE.

## 2. B1 Level Profile

**B1 — Nível Intermédio (Intermediate)**

B1 is the "independent user" threshold — learners can handle most situations while travelling, describe experiences and opinions with reasons, and produce connected text on familiar topics. Categories D (opinion/attitude expression) and F (organising discourse — connecting, comparing, concluding) become genuinely relevant for the first time at this level.

### 2.1 Key Progression from A2

| A2 (Elementary) | B1 (Intermediate) |
|-----------------|-------------------|
| Simple past (perfeito) only | Imperfeito introduced alongside perfeito |
| Simple opinions (gosto, acho que) | Opinions with reasons (porque, na minha opinião) |
| Isolated sentences | Connected discourse with connectors |
| Concrete descriptions | Abstract comparison and contrast |
| Understand simple texts | Understand authentic articles and reports |

### 2.2 B1 CEFR Can-Do Statements (Referencial Camões)

**M13 — Interação Social (Social Interaction):**
- Can handle most social situations while travelling in Portugal
- Can engage in extended conversation on familiar topics
- Can express and respond to feelings and opinions during conversations
- Can keep a conversation going by inviting opinions and reacting

**M14 — Opiniões e Atitudes (Opinions and Attitudes):**
- Can express opinions with supporting reasons
- Can agree and disagree politely
- Can describe advantages and disadvantages
- Can write simple opinions about current events

**M15 — Discurso Organizado (Organised Discourse):**
- Can narrate a sequence of events in the correct order
- Can describe how to do something step by step
- Can understand the main points of news articles on familiar topics
- Can write connected text about experiences and events
- Can follow extended speech on familiar topics

**M16 — Textos Autênticos (Authentic Texts):**
- Can understand the main points of clear standard speech
- Can understand the main point of radio/TV programmes on familiar topics
- Can understand articles and reports on contemporary problems
- Can understand contemporary literary prose in simplified form
- Can summarise and report what they have read or heard

## 3. Content Design

### 3.1 Node Inventory (18 nodes)

| # | nodeId | Module | Skill | Can-Do |
|---|--------|--------|-------|--------|
| 1 | B1-SOCIAL-001 | M13 | spoken_interaction | Can handle most social situations while travelling in Portugal |
| 2 | B1-SOCIAL-002 | M13 | spoken_interaction | Can engage in extended conversation on familiar topics |
| 3 | B1-SOCIAL-003 | M13 | spoken_interaction | Can express and respond to feelings and opinions during conversations |
| 4 | B1-SOCIAL-004 | M13 | spoken_production | Can keep a conversation going by inviting opinions and reacting |
| 5 | B1-OPINION-001 | M14 | spoken_production | Can express opinions with supporting reasons |
| 6 | B1-OPINION-002 | M14 | spoken_interaction | Can agree and disagree politely |
| 7 | B1-OPINION-003 | M14 | spoken_production | Can describe advantages and disadvantages |
| 8 | B1-OPINION-004 | M14 | writing | Can write simple opinions about current events |
| 9 | B1-DISCOURSE-001 | M15 | spoken_production | Can narrate a sequence of events in the correct order |
| 10 | B1-DISCOURSE-002 | M15 | spoken_production | Can describe how to do something step by step |
| 11 | B1-DISCOURSE-003 | M15 | reading | Can understand the main points of news articles on familiar topics |
| 12 | B1-DISCOURSE-004 | M15 | writing | Can write connected text about experiences and events |
| 13 | B1-DISCOURSE-005 | M15 | listening | Can follow extended speech on familiar topics |
| 14 | B1-TEXT-001 | M16 | listening | Can understand the main points of clear standard speech |
| 15 | B1-TEXT-002 | M16 | listening | Can understand the main point of radio/TV programmes on familiar topics |
| 16 | B1-TEXT-003 | M16 | reading | Can understand articles and reports on contemporary problems |
| 17 | B1-TEXT-004 | M16 | reading | Can understand contemporary literary prose in simplified form |
| 18 | B1-TEXT-005 | M16 | spoken_production | Can summarise and report what they have read or heard |

### 3.2 Skill Distribution

| Skill | Count | Percentage |
|-------|-------|------------|
| listening | 4 | 22% |
| reading | 3 | 17% |
| spoken_interaction | 4 | 22% |
| spoken_production | 5 | 28% |
| writing | 2 | 11% |
| **Total** | **18** | **100%** |

### 3.3 CEFR Category Coverage

| Category | Nodes | Notes |
|----------|-------|-------|
| A. Social Interaction | B1-SOCIAL-001/002/003/004 | Extended social situations |
| B. Information Exchange | — | Covered by A1/A2 |
| C. Influencing the Interlocutor | B1-OPINION-002 | Agreeing/disagreeing |
| D. Expressing Positioning | B1-OPINION-001/003/004 | Opinions with reasons, pros/cons |
| E. Expressing Desires/Emotions | B1-SOCIAL-003 | Feelings in conversation |
| F. Organising Discourse | B1-DISCOURSE-001/002/004 | Sequence, process, connected text |
| G. Regulating Communication | B1-SOCIAL-004 | Keeping conversation going |

## 4. Grammar Progression

### 4.1 New Grammar Concepts at B1

| Concept | Description | Example |
|---------|-------------|---------|
| Pretérito imperfeito | Ongoing/habitual past | Eu estudava quando era pequeno |
| Condicional | Polite requests, hypotheticals | Eu gostaria de visitar Lisboa |
| Complex connectors | Beyond e, mas, porque | Além disso, no entanto, por outro lado, embora |
| Reported speech | Indirect speech | Ele disse que vinha amanhã |
| Comparison structures | Comparatives | Mais...do que, tão...como, menos...que |

### 4.2 Grammar per Node

Each realisation file introduces grammar via the `grammar` array. Each grammar point includes:
- `id`: unique identifier (e.g., `B1-GRAMMAR-001`)
- `point`: grammar concept name
- `explanation`: clear description
- `examples`: array of example sentences with translations
- `cefrNotes`: pedagogical notes on level appropriateness

## 5. Content Constraints

### 5.1 Vocabulary Density

- 6 vocabulary items per node (consistent with A1/A2)
- Total: ~108 items (6 × 18 nodes)
- Each item includes term, translation, part of speech, gender, example sentence, example translation

### 5.2 Cultural Notes

Each realisation includes a `culturalNotes` string covering:
- Portuguese cultural context relevant to the topic
- Cross-cultural differences between PT-PT and en-GB
- Pragmatic usage notes (register, formality, regional variation)

### 5.3 Paired Realisations

Every node has two realisation files:
- `src/content/realisations/pt-PT/b1-{topic}-{seq}.yaml` — Portuguese
- `src/content/realisations/en-GB/b1-{topic}-{seq}.yaml` — English

Vocabulary items must be paired deterministically (same `seq` numbers) for bidirectional review.

## 6. File Structure

### 6.1 CEFR Node Format (unchanged from A2)

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

### 6.2 Realisation Format (unchanged from A2)

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
grammar:
  - id: B1-GRAMMAR-001
    point: "Polite request structures"
    explanation: "Using modal verbs for polite requests"
    examples:
      - pt: "Poderia ajudar-me?"
        en: "Could you help me?"
    cefrNotes: "B1 learners expand beyond simple imperative to polite modal constructions"
culturalNotes: "Portuguese people are generally helpful to tourists. Starting with 'Desculpe' (excuse me) or 'Com licença' (pardon me) is essential for polite interaction."
```

## 7. Verification

### 7.1 Acceptance Criteria

- [ ] 18 CEFR node files created in `src/content/cefr-nodes/`
- [ ] 36 realisation files created (18 pt-PT + 18 en-GB)
- [ ] `npm run validate:content` passes (all 110 realisations valid)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (52/52)
- [ ] `docs/cefr-mapping.md` updated with B1 section
- [ ] Full B1 review session works end-to-end in browser

### 7.2 Coverage Targets

| Metric | Target |
|--------|--------|
| Nodes | 18/18 (100%) |
| Realisations | 36/36 (100%) |
| Vocabulary items | ~108 |
| Skills covered | 5/5 |
| CEFR categories | 5/7 (A, C, D, E, F) |
| Pages built | ~117 (81 existing + 36 new lesson pages) |

---

*Spec written for learn-languages Epic #52. Review before proceeding to implementation plan.*
