# A2 Content — EN→PT Design Specification

> **Epic:** #51 — A2 Content — EN→PT
> **Status:** Draft
> **Date:** 2026-09-20
> **Predecessor:** #50 (A1 Content Completion)

---

## 1. Objective

Complete the A2 CEFR inventory for EN→PT (European Portuguese) by creating paired en-GB/pt-PT realisations covering all 6 A2 modules from the Referencial Camões PLE.

## 2. A2 Level Profile

**A2 — Nível Elementar (Elementary)**

A2 learners can handle simple daily situations involving social relations. They can communicate in tasks requiring only a simple exchange of information on familiar and habitual topics. They can describe their education, surroundings, and refer to matters relating to immediate needs.

### 2.1 Key Progression from A1

| A1 (Foundation) | A2 (Elementary) |
|-----------------|-----------------|
| Present tense only | Past tense (pretérito perfeito) introduced |
| Isolated phrases | Simple sentence connectors (e, mas, porque) |
| No opinion expression | Simple opinions (gosto, acho que) |
| Concrete topics | Abstract topics (past experiences, changes) |
| No narration | Simple narrative about past events |

### 2.2 A2 CEFR Can-Do Statements (Referencial Camões)

**M7 — Profissões e Trabalho (Professions and Work):**
- Can describe their job and working hours
- Can talk about daily work routines
- Can understand simple job advertisements

**M8 — Estudos e Experiência Profissional (Studies and Professional Experience):**
- Can describe their studies and qualifications
- Can talk about their educational background
- Can understand simple academic texts

**M9 — Passado e Presente (Past and Present):**
- Can describe past events and experiences
- Can talk about changes over time
- Can understand simple narratives about the past
- Can compare past and present situations

**M10 — Hábitos Recentes (Recent Habits):**
- Can describe recent changes in habits
- Can talk about recent activities
- Can understand simple news items about recent events

**M11 — Notícias e Outros Textos (News and Other Texts):**
- Can understand simple news articles
- Can describe events reported in the media
- Can express basic opinions about news items

**M12 — Cidadania e Diversidade Cultural (Citizenship and Cultural Diversity):**
- Can talk about cultural events and traditions
- Can describe simple aspects of different cultures
- Can express opinions about cultural topics

## 3. Content Design

### 3.1 Node Inventory (20 nodes)

| # | nodeId | Category | Skill | Can-Do |
|---|--------|----------|-------|--------|
| 1 | A2-JOB-001 | B. Information Exchange | spoken_production | Can describe my job and working hours |
| 2 | A2-JOB-002 | B. Information Exchange | spoken_production | Can talk about daily work routines |
| 3 | A2-JOB-003 | B. Information Exchange | reading | Can understand simple job advertisements |
| 4 | A2-STUDY-001 | B. Information Exchange | spoken_production | Can describe my studies and qualifications |
| 5 | A2-STUDY-002 | B. Information Exchange | spoken_interaction | Can talk about my educational background |
| 6 | A2-STUDY-003 | B. Information Exchange | reading | Can understand simple academic texts |
| 7 | A2-PAST-001 | E. Past/Present | spoken_production | Can describe past events and experiences |
| 8 | A2-PAST-002 | E. Past/Present | spoken_production | Can talk about changes over time |
| 9 | A2-PAST-003 | E. Past/Present | listening | Can understand simple narratives about the past |
| 10 | A2-PAST-004 | E. Past/Present | writing | Can compare past and present situations |
| 11 | A2-HABIT-001 | E. Past/Present | spoken_production | Can describe recent changes in habits |
| 12 | A2-HABIT-002 | E. Past/Present | listening | Can talk about recent activities |
| 13 | A2-HABIT-003 | E. Past/Present | reading | Can understand simple news items about recent events |
| 14 | A2-NEWS-001 | D. Opinions | reading | Can understand simple news articles |
| 15 | A2-NEWS-002 | D. Opinions | spoken_production | Can describe events reported in the media |
| 16 | A2-NEWS-003 | D. Opinions | spoken_production | Can express basic opinions about news items |
| 17 | A2-CULT-001 | A. Social Relations | listening | Can talk about cultural events and traditions |
| 18 | A2-CULT-002 | A. Social Relations | spoken_interaction | Can describe simple aspects of different cultures |
| 19 | A2-CULT-003 | A. Social Relations | spoken_production | Can express opinions about cultural topics |
| 20 | A2-HEALTH-001 | A. Social Relations | spoken_interaction | Can describe symptoms and understand medical advice |

**Skill distribution:** listening (4), reading (4), spoken_interaction (4), spoken_production (6), writing (2)

**Category distribution:** A. Social Relations (4), B. Information Exchange (6), C. Influence (0), D. Opinions (3), E. Past/Present (7)

### 3.2 Vocabulary Strategy

Each node will include **6 vocabulary items** covering:
- **3 job/study-specific terms** (nouns, verbs, adjectives)
- **2 temporal connectors** (agora, antes, entretanto, recentemente)
- **1 opinion expression** (acho que, na minha opinião, gosto de)

**Total vocabulary items:** ~120

### 3.3 Grammar Progression

A2 introduces past tense and sentence connectors. Grammar points per node:

| Grammar Concept | Nodes | Example |
|-----------------|-------|---------|
| Pretérito perfeito | A2-PAST-001, A2-PAST-002, A2-PAST-003, A2-PAST-004, A2-HABIT-001 | Visitou, comeu, estudou |
| connectors (e, mas, porque) | A2-JOB-001, A2-STUDY-001, A2-NEWS-001 | Trabalho e estudo porque gosto |
| Opinions (gosto de, acho que) | A2-NEWS-003, A2-CULT-003 | Acho que é importante |
| Comparisons (mais...que, menos...que) | A2-PAST-004 | Antes era mais difícil |
| Adverbs of frequency (sempre, às vezes) | A2-JOB-002, A2-HABIT-002 | Sempre como no restaurante |

### 3.4 Realisation Structure

Each realisation follows the established pattern:

```yaml
id: pt-A2-JOB-001
nodeId: A2-JOB-001
lang: pt-PT
title: Descrever o meu emprego
overview: >
  Learners describe their job, workplace, and working hours using
  present tense and basic connectors.
vocabulary:
  - id: pt-A2-JOB-001-V01
    term: emprego
    translation: job
    partOfSpeech: noun
    gender: masculine
    example: Tenho um emprego no centro da cidade.
    exampleTranslation: I have a job in the city centre.
  # ... 5 more items
grammarPoints:
  - id: pt-A2-JOB-001-G01
    term: connectors (e, mas, porque)
    explanation: Used to link ideas about work
    examples:
      - Trabalho num escritório e gosto do meu emprego.
      - Não trabalho aos fins de semana porque preciso de descansar.
culturalNotes:
  - >
    Portuguese work culture values punctuality and personal relationships.
    Colleagues often address each other by first name after initial formal greetings.
```

## 4. Implementation Approach

### 4.1 Phased Execution (6 phases)

| Phase | Module | Nodes | Est. Files |
|-------|--------|-------|------------|
| 0 | M7. Professions & Work | A2-JOB-001 (baseline pair) | 3 |
| 1 | M7-M8. Professions & Studies | A2-JOB-002, A2-JOB-003, A2-STUDY-001 | 9 |
| 2 | M8-M9. Studies & Past/Present | A2-STUDY-002, A2-STUDY-003, A2-PAST-001 | 9 |
| 3 | M9. Past/Present (continued) | A2-PAST-002, A2-PAST-003, A2-PAST-004 | 9 |
| 4 | M10-M11. Recent Habits & News | A2-HABIT-001, A2-HABIT-002, A2-HABIT-003, A2-NEWS-001, A2-NEWS-002, A2-NEWS-003 | 18 |
| 5 | M12. Citizenship & Culture | A2-CULT-001, A2-CULT-002, A2-CULT-003, A2-HEALTH-001 | 12 |

### 4.2 Per-Phase Pattern

1. Create CEFR node YAML
2. Create pt-PT realisation with vocabulary, grammar, cultural notes
3. Create en-GB realisation with matched sequences
4. Validate: `npm run validate:content`
5. Validate: `npm run typecheck && npm run lint`
6. Commit with conventional commit message

## 5. Verification Criteria

- [ ] 20 A2 CEFR nodes created
- [ ] 40 realisations created (20 pt-PT + 20 en-GB)
- [ ] All nodes validated against Zod schema
- [ ] `validate:content` passes (60+ realisations total: 34 A1 + 26 A2+)
- [ ] `typecheck` passes (0 errors)
- [ ] `lint` passes (0 errors)
- [ ] `build` succeeds
- [ ] `npm test` passes (52+ tests)
- [ ] Vocabulary items have sequential IDs within each node
- [ ] Grammar points cover A2-specific concepts (past tense, connectors, opinions)
- [ ] Cultural notes are relevant to pt-PT

## 6. Out of Scope

- Audio recordings (deferred until TTS integration)
- Review session UI (depends on FlashcardReview component)
- SRS integration (depends on storage layer)
- Other language pairs (FR→PT, DE→PT)
- Levels beyond A2
