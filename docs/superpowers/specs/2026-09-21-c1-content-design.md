# C1 Content — EN→PT Design Specification

> **Epic:** #54 — C1 Content — EN→PT
> **Status:** Draft
> **Date:** 2026-09-21
> **Predecessor:** #53 (B2 Content Completion)

---

## 1. Objective

Complete the C1 CEFR inventory for EN→PT (European Portuguese) by creating paired en-GB/pt-PT realisations covering 10 topic groups (5 inherited from B2 + 5 C1-specific) based on Council of Europe C1 descriptors and Referencial Camões pragmatic categories.

## 2. C1 Level Profile

**C1 — Utilizador Autónomo / Effective Operational Proficiency (Advanced)**

C1 represents "effective operational proficiency" — learners can express themselves fluently and spontaneously, use language flexibly and effectively for social, academic, and professional purposes, and produce clear, well-structured, detailed text on complex subjects.

### 2.1 Key Progression from B2

| B2 (Upper Intermediate) | C1 (Advanced) |
|-------------------------|---------------|
| Can argue and defend viewpoints | Can argue with nuance, hedging, and rhetorical control |
| Can understand complex articles | Can understand implicit meaning, irony, and stylistic variation |
| Can write structured essays | Can write for academic/professional audiences with register control |
| Can use sophisticated discourse markers | Can use complex syntax, ellipsis, inversion, cleft sentences |
| Subjunctive used fluently | Compound tenses, nuanced modality, register switching |

### 2.2 C1 CEFR Can-Do Statements (Council of Europe C1 + Referencial Camões)

**M21 — Argumentação Avançada (Advanced Argumentation):**
- Can present clear, detailed descriptions of complex subjects
- Can develop an argument systematically with appropriate highlighting of significant points and relevant supporting detail
- Can sustain a viewpoint by providing relevant supporting detail and evaluating counter-arguments
- Can express subtle shades of meaning using a wide range of qualifying devices

**M22 — Interação Fluente e Espontânea (Fluent Spontaneous Interaction):**
- Can express him/herself fluently and spontaneously without much obvious searching for expressions
- Can use language flexibly and effectively for social, academic, and professional purposes
- Can formulate ideas and opinions with precision and relate contribution skilfully to those of other speakers
- Can select a suitable phrase from a readily available range of discourse functions to preface remarks

**M23 — Textos Complexos e Implícitos (Complex Implicit Texts):**
- Can understand a wide range of demanding, longer texts, and recognise implicit meaning
- Can understand specialised articles and longer technical instructions, even when not related to own field
- Can appreciate literary texts and recognise stylistic devices
- Can summarise information from different spoken and written sources, reconstructing arguments and accounts

**M24 — Escrita Formal e Académica (Formal Academic Writing):**
- Can write clear, well-structured, detailed text on complex subjects
- Can write an essay or report that develops an argument systematically with appropriate highlighting of significant points and relevant supporting detail
- Can write letters and emails that follow standard conventions with appropriate register
- Can express him/herself in writing with a high degree of grammatical control and vocabulary range

**M25 — Mediação e Registo (Mediation and Register):**
- Can mediate between speakers of Portuguese and English in formal/informal contexts
- Can summarise and paraphrase complex texts preserving nuance
- Can adapt register appropriately across formal, academic, professional, and literary contexts
- Can explain cultural references and implicit meanings

## 3. Content Design

### 3.1 Node Inventory (23 nodes across 10 groups)

| # | nodeId | Group | Skill | Can-Do |
|---|--------|-------|-------|--------|
| 1 | C1-SOCIAL-001 | SOCIAL | spoken_interaction | Can express him/herself fluently and spontaneously without much obvious searching for expressions |
| 2 | C1-SOCIAL-002 | SOCIAL | spoken_interaction | Can use language flexibly and effectively for social purposes |
| 3 | C1-ARGUE-001 | ARGUE | spoken_production | Can present clear, detailed descriptions of complex subjects |
| 4 | C1-ARGUE-002 | ARGUE | spoken_production | Can develop an argument systematically with nuanced evaluation of counter-arguments |
| 5 | C1-ARGUE-003 | ARGUE | spoken_production | Can express subtle shades of meaning using a wide range of qualifying devices |
| 6 | C1-ARGUE-004 | ARGUE | writing | Can sustain a viewpoint by providing relevant supporting detail and evaluating counter-arguments |
| 7 | C1-TEXT-001 | TEXT | reading | Can understand a wide range of demanding, longer texts, and recognise implicit meaning |
| 8 | C1-TEXT-002 | TEXT | reading | Can understand specialised articles and longer technical instructions |
| 9 | C1-TEXT-003 | TEXT | reading | Can appreciate literary texts and recognise stylistic devices |
| 10 | C1-TEXT-004 | TEXT | reading | Can summarise information from different spoken and written sources |
| 11 | C1-SPOKEN-001 | SPOKEN | listening | Can understand extended speech even when not clearly structured and relationships are implied |
| 12 | C1-SPOKEN-002 | SPOKEN | listening | Can understand television programmes and films without too much effort |
| 13 | C1-SPOKEN-003 | SPOKEN | spoken_production | Can present a complex topic with appropriate structure and rhetorical control |
| 14 | C1-WRITTEN-001 | WRITTEN | writing | Can write clear, well-structured, detailed text on complex subjects |
| 15 | C1-WRITTEN-002 | WRITTEN | writing | Can write an essay or report that develops an argument with rhetorical sophistication |
| 16 | C1-WRITTEN-003 | WRITTEN | writing | Can write letters and emails that follow standard conventions with appropriate register |
| 17 | C1-ACADEMIC-001 | ACADEMIC | reading | Can understand academic lectures and research papers in own field |
| 18 | C1-ACADEMIC-002 | ACADEMIC | writing | Can write a research abstract or literature review with appropriate conventions |
| 19 | C1-PROFESSIONAL-001 | PROFESSIONAL | spoken_interaction | Can participate effectively in formal meetings and negotiations |
| 20 | C1-PROFESSIONAL-002 | PROFESSIONAL | writing | Can write formal reports, proposals, and correspondence |
| 21 | C1-NUANCED-001 | NUANCED | spoken_production | Can express irony, metaphor, and register shifts appropriately |
| 22 | C1-LITERARY-001 | LITERARY | reading | Can appreciate literary texts and recognise stylistic devices |
| 23 | C1-MEDIATION-001 | MEDIATION | writing | Can mediate complex information between Portuguese and English |

### 3.2 Skill Distribution

| Skill | Count | Percentage |
|-------|-------|------------|
| listening | 2 | 9% |
| reading | 6 | 26% |
| spoken_interaction | 3 | 13% |
| spoken_production | 5 | 22% |
| writing | 7 | 30% |
| **Total** | **23** | **100%** |

### 3.3 CEFR Category Coverage (Referencial Camões A-G)

| Category | Nodes | Notes |
|----------|-------|-------|
| A. Social Interaction | C1-SOCIAL-001/002 | Fluent spontaneous interaction |
| B. Information Exchange | C1-TEXT-002, C1-PROFESSIONAL-002 | Technical, specialised information |
| C. Influencing the Interlocutor | C1-ARGUE-002/003, C1-PROFESSIONAL-001 | Persuasion, negotiation, nuance |
| D. Expressing Positioning | C1-ARGUE-001/004, C1-NUANCED-001 | Sophisticated argumentation |
| E. Expressing Desires/Emotions | C1-NUANCED-001 | Irony, metaphor, subtle emotion |
| F. Organising Discourse | C1-ARGUE-002, C1-ACADEMIC-002, C1-WRITTEN-002 | Rhetorical structure, academic organisation |
| G. Regulating Communication | C1-SOCIAL-002, C1-MEDIATION-001 | Register management, mediation |

## 4. Grammar Progression

### 4.1 New Grammar Concepts at C1

| Concept | Description | Example |
|---------|-------------|---------|
| Compound subjunctive tenses | Mais-que-perfeito do conjuntivo, futuro composto do conjuntivo | Se tivesse chegado mais cedo, teria visto; Quando tiver chegado, ligo-te |
| Cleft sentences | Focusing structures with ser + relativo | Foi ontem que ele chegou; É o João que sabe |
| Inversion | Subject-verb inversion for emphasis | Raramente vi tanta beleza; Só assim compreendi |
| Ellipsis | Omission of understood elements | Quem quer vir? (Eu) Quero; Pode fazer melhor do que (eu) fiz |
| Nuanced modality | Epistemic and deontic modality with adverbs | Decerto virá; Possivelmente não conseguirá; Deverias ter ido |
| Register switching | Formal/informal, hedging, mitigation strategies | Se me permite...; A meu ver...; Não sei se concordará... |
| Idiomatic expressions | Collocations, fixed expressions, proverbs | Dar com os burros n'água; Ficar a ver navios; Nem que a vaca tussa |
| Advanced connectors | Multi-word discourse markers for rhetorical control | Na medida em que; Tendo em conta que; Não obstante o facto de |

### 4.2 Grammar per Node

Each realisation file introduces grammar via the `grammar` array:

```yaml
grammar:
  - id: C1-GRAMMAR-001
    point: "Compound subjunctive tenses"
    explanation: "Using mais-que-perfeito and futuro composto do conjuntivo for complex hypotheticals"
    examples:
      - "Se tivesse estudado mais, teria passado no exame."
      - "Quando tiver terminado o trabalho, irei descansar."
    cefrNotes: "C1 learners use compound subjunctive tenses for sophisticated hypothetical reasoning"
```

### 4.3 Vocabulary Density

- 6 vocabulary items per node (consistent with A1-B2)
- Total: ~138 items (6 × 23 nodes)
- Each item includes term, translation, part of speech, gender, example sentence, example translation

### 4.4 Cultural Notes

Each realisation includes a `culturalNotes` string covering:
- Portuguese cultural context relevant to the topic
- Cross-cultural differences between PT-PT and en-GB
- Pragmatic usage notes (register, formality, regional variation, rhetorical conventions)

## 5. Content Constraints

### 5.1 Paired Realisations

Every node has two realisation files:
- `src/content/realisations/pt-PT/c1-{topic}-{seq}.yaml` — Portuguese
- `src/content/realisations/en-GB/c1-{topic}-{seq}.yaml` — English

Vocabulary items must be paired deterministically (same `seq` numbers) for bidirectional review.

### 5.2 Schema Compliance

All content must pass Zod schema validation (`src/content.config.ts`):
- `grammar.examples` must be arrays of strings (not objects)
- Vocabulary IDs must match regex: `/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/`
- Gender enum: `"masculine"|"feminine"|"neuter"|"n/a"`
- NodeIds must match regex: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`

## 6. File Structure

### 6.1 CEFR Node Format

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

### 6.2 Realisation Format

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
grammar:
  - id: C1-GRAMMAR-001
    point: "Compound subjunctive tenses"
    explanation: "Using mais-que-perfeito and futuro composto do conjuntivo"
    examples:
      - "Se tivesse sabido, teria vindo."
      - "Quando tiver chegado, aviso."
    cefrNotes: "C1 learners use compound subjunctive for complex hypotheticals"
culturalNotes: "Portuguese fluency values natural flow over grammatical perfection. Speakers use discourse markers like 'pois é', 'então', 'pronto' to maintain conversational momentum."
```

## 7. Verification

### 7.1 Acceptance Criteria

- [ ] 23 CEFR node files created in `src/content/cefr-nodes/`
- [ ] 46 realisation files created (23 pt-PT + 23 en-GB)
- [ ] `npm run validate:content` passes (all realisations valid)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `docs/cefr-mapping.md` updated with C1 section
- [ ] Full C1 review session works end-to-end in browser

### 7.2 Coverage Targets

| Metric | Target |
|--------|--------|
| Nodes | 23/23 (100%) |
| Realisations | 46/46 (100%) |
| Vocabulary items | ~138 |
| Skills covered | 5/5 |
| CEFR categories | 7/7 (A-G) |
| Pages built | ~199 (153 existing + 46 new lesson pages) |

---

*Spec written for learn-languages Epic #54. Review before proceeding to implementation plan.*