# B2 Content — EN→PT Design Specification

> **Epic:** #53 — B2 Content — EN→PT
> **Status:** Draft
> **Date:** 2026-09-20
> **Predecessor:** #52 (B1 Content Completion)

---

## 1. Objective

Complete the B2 CEFR inventory for EN→PT (European Portuguese) by creating paired en-GB/pt-PT realisations covering all 5 topic groups for the B2 level.

## 2. B2 Level Profile

**B2 — Nível Intermédio Superior (Upper Intermediate / Vantage)**

B2 is the "effective operational proficiency" threshold — learners can interact with fluency, produce clear detailed text, argue viewpoints with pros/cons, and understand complex texts including contemporary literature.

### 2.1 Key Progression from B1

| B1 (Intermediate) | B2 (Upper Intermediate) |
|-------------------|-------------------------|
| Can express opinions with reasons | Can argue and defend viewpoints persuasively |
| Can understand factual articles | Can understand complex articles and reports |
| Can narrate events in sequence | Can narrate with detail, nuance, and evaluation |
| Can use complex connectors | Can use sophisticated discourse markers |
| Can write connected text | Can write structured essays and formal correspondence |
| Subjunctive introduced | Subjunctive used fluently in context |

### 2.2 B2 CEFR Can-Do Statements (Council of Europe B2 + Referencial Camões categories)

**M17 — Argumentação (Argumentation):**
- Can construct a chain of reasoning
- Can justify viewpoint on topical issues
- Can develop an argument systematically with appropriate highlighting of significant points
- Can sustain viewpoint by providing relevant supporting detail

**M18 — Interação Espontânea (Spontaneous Interaction):**
- Can interact with a degree of fluency and spontaneity
- Can take an active part in discussion in familiar contexts
- Can account for and sustain views by giving relevant explanations and arguments
- Can clarify a detailed point of view clearly

**M19 — Textos Complexos (Complex Texts):**
- Can read with a large degree of independence
- Can understand articles and reports concerned with contemporary problems
- Can recognise the line of argument in the treatment of the issue presented
- Can understand contemporary literary prose

**M20 — Escrita Formal (Formal Writing):**
- Can write clear, detailed text on a wide range of subjects
- Can write an essay or report passing on information or giving reasons
- Can write letters highlighting the personal significance of events and experiences

## 3. Content Design

### 3.1 Node Inventory (18 nodes)

| # | nodeId | Group | Skill | Can-Do |
|---|--------|-------|-------|--------|
| 1 | B2-SOCIAL-001 | SOCIAL | spoken_interaction | Can interact with a degree of fluency and spontaneity on familiar topics |
| 2 | B2-SOCIAL-002 | SOCIAL | spoken_interaction | Can take an active part in discussion in familiar contexts |
| 3 | B2-SOCIAL-003 | SOCIAL | spoken_interaction | Can account for and sustain views by giving relevant explanations and arguments |
| 4 | B2-SOCIAL-004 | SOCIAL | spoken_interaction | Can clarify a detailed point of view clearly |
| 5 | B2-ARGUE-001 | ARGUE | spoken_production | Can construct a chain of reasoning |
| 6 | B2-ARGUE-002 | ARGUE | spoken_production | Can justify viewpoint on topical issues |
| 7 | B2-ARGUE-003 | ARGUE | spoken_production | Can develop an argument systematically with appropriate highlighting of significant points |
| 8 | B2-ARGUE-004 | ARGUE | writing | Can sustain viewpoint by providing relevant supporting detail |
| 9 | B2-TEXT-001 | TEXT | reading | Can read with a large degree of independence on familiar topics |
| 10 | B2-TEXT-002 | TEXT | reading | Can understand articles and reports concerned with contemporary problems |
| 11 | B2-TEXT-003 | TEXT | reading | Can recognise the line of argument in the treatment of the issue presented |
| 12 | B2-TEXT-004 | TEXT | reading | Can understand contemporary literary prose |
| 13 | B2-SPOKEN-001 | SPOKEN | spoken_production | Can present clear, detailed descriptions on a wide range of subjects |
| 14 | B2-SPOKEN-002 | SPOKEN | spoken_production | Can develop a topic systematically with appropriate highlighting of significant points and relevant supporting detail |
| 15 | B2-SPOKEN-003 | SPOKEN | listening | Can understand extended speech even when it is not clearly structured |
| 16 | B2-WRITTEN-001 | WRITTEN | writing | Can write clear, detailed text on a wide range of subjects |
| 17 | B2-WRITTEN-002 | WRITTEN | writing | Can write an essay or report passing on information or giving reasons |
| 18 | B2-WRITTEN-003 | WRITTEN | writing | Can write letters highlighting the personal significance of events and experiences |

### 3.2 Skill Distribution

| Skill | Count | Percentage |
|-------|-------|------------|
| listening | 1 | 6% |
| reading | 4 | 22% |
| spoken_interaction | 4 | 22% |
| spoken_production | 4 | 22% |
| writing | 5 | 28% |
| **Total** | **18** | **100%** |

### 3.3 CEFR Category Coverage

| Category | Nodes | Notes |
|----------|-------|-------|
| A. Social Interaction | B2-SOCIAL-001/002/003/004 | Spontaneous, fluent interaction |
| B. Information Exchange | B2-TEXT-002, B2-WRITTEN-002 | Reports, essays |
| C. Influencing the Interlocutor | B2-ARGUE-002/003 | Persuasion, justification |
| D. Expressing Positioning | B2-ARGUE-001/004, B2-TEXT-003 | Argumentation, line of reasoning |
| E. Expressing Desires/Emotions | — | Covered by B1 |
| F. Organising Discourse | B2-SPOKEN-002, B2-WRITTEN-001 | Systematic development |
| G. Regulating Communication | B2-SOCIAL-003/004 | Sustaining views, clarifying |

## 4. Grammar Progression

### 4.1 New Grammar Concepts at B2

| Concept | Description | Example |
|---------|-------------|---------|
| Subjunctive mood (full) | Presente do conjuntivo in all tenses | É importante que ele venha |
| Future subjunctive | Less common but needed for B2 | Quando eu for mais velho, vou viajar |
| Reported speech (complex) | Indirect speech with tense sequence | Ele disse que teria vindo se pudesse |
| Complex conditionals | Mixed conditionals, past hypotheticals | Se tivesse estudado, teria passado |
| Passive voice | Passive constructions for formality | O projeto foi desenvolvido pela equipa |
| Relative clauses (extended) | Non-restrictive, prepositional | O livro, que comprei ontem, é excelente |
| Discourse markers (advanced) | Sophisticated connectors | Aliás, não obstante, em contrapartida |

### 4.2 Grammar per Node

Each realisation file introduces grammar via the `grammar` array:

```yaml
grammar:
  - id: B2-GRAMMAR-001
    point: "Subjunctive mood in dependent clauses"
    explanation: "Using presente do conjuntivo after verbs of desire, doubt, emotion"
    examples:
      - "Espero que possas vir amanhã."
      - "Duvido que ele saiba a verdade."
    cefrNotes: "B2 learners use subjunctive fluently in context, not just recognising it"
```

### 4.3 Vocabulary Density

- 6 vocabulary items per node (consistent with A1-B1)
- Total: ~108 items (6 × 18 nodes)
- Each item includes term, translation, part of speech, gender, example sentence, example translation

### 4.4 Cultural Notes

Each realisation includes a `culturalNotes` string covering:
- Portuguese cultural context relevant to the topic
- Cross-cultural differences between PT-PT and en-GB
- Pragmatic usage notes (register, formality, regional variation)

## 5. Content Constraints

### 5.1 Paired Realisations

Every node has two realisation files:
- `src/content/realisations/pt-PT/b2-{topic}-{seq}.yaml` — Portuguese
- `src/content/realisations/en-GB/b2-{topic}-{seq}.yaml` — English

Vocabulary items must be paired deterministically (same `seq` numbers) for bidirectional review.

### 5.2 Schema Compliance

All content must pass Zod schema validation (`src/content.config.ts`):
- `grammar.examples` must be arrays of strings (not objects)
- Vocabulary IDs must match regex: `/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/`
- Gender enum: `"masculine"|"feminine"|"neuter"|"n/a"`
- NodeIds must match regex: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`

## 6. File Structure

### 6.1 CEFR Node Format (unchanged from B1)

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

### 6.2 Realisation Format (unchanged from B1)

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
grammar:
  - id: B2-GRAMMAR-001
    point: "Subjunctive mood in dependent clauses"
    explanation: "Using presente do conjuntivo after verbs of desire, doubt, emotion"
    examples:
      - "Espero que possas vir amanhã."
      - "Duvido que ele saiba a verdade."
    cefrNotes: "B2 learners use subjunctive fluently in context"
culturalNotes: "Portuguese debate culture values reasoned argument with emotional engagement. Raising voice slightly signals passion, not anger."
```

## 7. Verification

### 7.1 Acceptance Criteria

- [ ] 18 CEFR node files created in `src/content/cefr-nodes/`
- [ ] 36 realisation files created (18 pt-PT + 18 en-GB)
- [ ] `npm run validate:content` passes (all 146 realisations valid)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (52/52)
- [ ] `docs/cefr-mapping.md` updated with B2 section
- [ ] Full B2 review session works end-to-end in browser

### 7.2 Coverage Targets

| Metric | Target |
|--------|--------|
| Nodes | 18/18 (100%) |
| Realisations | 36/36 (100%) |
| Vocabulary items | ~108 |
| Skills covered | 5/5 |
| CEFR categories | 6/7 (A, B, C, D, F, G) |
| Pages built | ~153 (117 existing + 36 new lesson pages) |

---

*Spec written for learn-languages Epic #53. Review before proceeding to implementation plan.*
