# Content Authoring Playbook

Repeatable patterns for creating CEFR nodes and language-pair realisations. This playbook is the single source of truth for how content enters the repository.

**Audience:** Contributors authoring new CEFR nodes or realisations (vocabulary, grammar, cultural notes).

**Companion docs:** `specification-design.md` §5 (Content Model), `cefr-mapping.md` (coverage tracker).

---

## 1. Architecture Recap

The content model decouples **what** a learner can do (abstract CEFR node) from **how** it's expressed in a specific language (realisation):

```
CEFR Node (language-agnostic)
  └── Realisation (per language pair)
        ├── Vocabulary Items
        ├── Grammar Points
        └── Cultural Notes
```

A single node can have multiple realisations across different language pairs (e.g., `pt-PT` and `en-GB`). Paired realisations for the same node share vocabulary item sequences so review direction is deterministic.

---

## 2. CEFR Node Anatomy

**Location:** `src/content/cefr-nodes/{filename}.yaml`

Each file defines one abstract learning objective. The filename must match the `nodeId`.

### 2.1 Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `nodeId` | Yes | `string` | Format: `{LEVEL}-{SKILL}-{SEQ}` e.g. `A1-GREET-001` |
| `cefrLevel` | Yes | `enum` | One of: `A1`, `A2`, `B1`, `B2`, `C1`, `C2` |
| `skill` | Yes | `enum` | One of: `listening`, `reading`, `spoken_interaction`, `spoken_production`, `writing` |
| `canDo` | Yes | `string` | 10–200 chars. The CEFR Can-Do statement. |
| `pragmaticFocus` | No | `string` | Pragmatic competence focus (e.g., formality, politeness) |
| `notionalFocus` | No | `string` | Notional/semantic domain (e.g., time of day, food) |
| `relatedNodes` | No | `string[]` | NodeIds of nodes that pair well with this one |
| `prerequisiteNodes` | No | `string[]` | NodeIds that should be learned first |

### 2.2 NodeId Format

```
{LEVEL}-{SKILL}-{SEQ}

LEVEL:  A1 | A2 | B1 | B2 | C1 | C2
SKILL:  GREET | INTRO | NUMB | FOOD | SHOP | ... (uppercase letters, 3+ chars)
SEQ:    001 | 002 | 003 (zero-padded, 3 digits)
```

The `nodeId` must start with the `cefrLevel` (validated by Zod `.refine()`).

### 2.3 Example — Complete Node

```yaml
nodeId: A1-GREET-001
cefrLevel: A1
skill: spoken_interaction
canDo: Can greet people and respond to greetings
pragmaticFocus: Use appropriate greeting for time of day and formality
notionalFocus: Time of day, formality register
relatedNodes:
  - A1-GREET-002
  - A1-INTRO-001
prerequisiteNodes: []
```

### 2.4 Example — Minimal Node

```yaml
nodeId: A1-FOOD-001
cefrLevel: A1
skill: reading
canDo: Can identify common food and drink items
pragmaticFocus: Recognize food vocabulary in menus and shops
notionalFocus: Food, drink, meals
relatedNodes:
  - A1-FOOD-002
  - A1-SHOP-001
prerequisiteNodes: []
```

---

## 3. Realisation Anatomy

**Location:** `src/content/realisations/{lang}/{filename}.yaml`

Each file attaches language-specific content to a CEFR node. The filename must match the node's filename.

### 3.1 Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `nodeId` | Yes | `string` | Must match an existing CEFR node's `nodeId` |
| `lang` | Yes | `string` | BCP-47 language code: `pt-PT`, `en-GB`, etc. |
| `vocabulary` | Yes | `VocabularyItem[]` | At least 1 item |
| `grammar` | No | `GrammarPoint[]` | Grammar explanations (default: `[]`) |
| `culturalNotes` | No | `string` | Cultural context for the expressions |

### 3.2 Vocabulary Item

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | `string` | Format: `{lang}-{nodeId}-{SEQ}` e.g. `pt-PT-A1-GREET-001-001` |
| `term` | Yes | `string` | The word/phrase in the target language |
| `translation` | Yes | `string` | Translation in the source language |
| `partOfSpeech` | Yes | `enum` | `noun`, `verb`, `adjective`, `adverb`, `pronoun`, `preposition`, `conjunction`, `interjection`, `phrase` |
| `gender` | No | `enum` | `masculine`, `feminine`, `neuter`, `n/a` (default: `n/a`) |
| `example` | Yes | `string` | Min 5 chars. Example sentence using the term. |
| `exampleTranslation` | Yes | `string` | Min 5 chars. Translation of the example. |
| `audioUrl` | No | `string` | Optional TTS or recorded audio URL |

### 3.3 Grammar Point

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | `string` | Format: `{lang}-{nodeId}-G{SEQ}` e.g. `pt-PT-A1-INTRO-001-G1` |
| `point` | Yes | `string` | Min 5 chars. Name of the grammar point. |
| `explanation` | Yes | `string` | Min 20 chars. Clear explanation for learners. |
| `examples` | Yes | `string[]` | At least 1 example |
| `cefrNotes` | No | `string` | CEFR-level context for the grammar point |

### 3.4 Example — Complete Realisation (pt-PT)

```yaml
nodeId: A1-GREET-001
lang: pt-PT
vocabulary:
  - id: pt-PT-A1-GREET-001-001
    term: 'Olá'
    translation: 'Hello'
    partOfSpeech: interjection
    example: 'Olá, como estás?'
    exampleTranslation: 'Hello, how are you?'
  - id: pt-PT-A1-GREET-001-002
    term: 'Bom dia'
    translation: 'Good morning'
    partOfSpeech: phrase
    example: 'Bom dia, senhor Silva.'
    exampleTranslation: 'Good morning, Mr. Silva.'
grammar: []
culturalNotes: 'Handshakes are standard in formal greetings; cheek kisses (one or two) are common among friends.'
```

### 3.5 Example — Realisation with Grammar (pt-PT)

```yaml
nodeId: A1-INTRO-001
lang: pt-PT
vocabulary:
  - id: pt-PT-A1-INTRO-001-001
    term: 'Chamo-me'
    translation: 'My name is'
    partOfSpeech: phrase
    example: 'Chamo-me João.'
    exampleTranslation: 'My name is João.'
  - id: pt-PT-A1-INTRO-001-002
    term: 'Prazer'
    translation: 'Nice to meet you'
    partOfSpeech: interjection
    example: 'Prazer em conhecê-lo.'
    exampleTranslation: 'Nice to meet you (literally: pleasure to know you).'
grammar:
  - id: pt-PT-A1-INTRO-001-G1
    point: 'Formal vs. informal address (tu/você)'
    explanation: "European Portuguese distinguishes informal 'tu' from formal 'você'. Use 'você' with strangers, elders, and professional contexts."
    examples:
      - 'Como te chamas? (informal)'
      - 'Como se chama? (formal)'
```

### 3.6 Example — Paired Realisation (en-GB)

```yaml
nodeId: A1-GREET-001
lang: en-GB
vocabulary:
  - id: en-GB-A1-GREET-001-001
    term: 'Hello'
    translation: 'Olá'
    partOfSpeech: interjection
    example: 'Hello, how are you?'
    exampleTranslation: 'Olá, como estás?'
  - id: en-GB-A1-GREET-001-002
    term: 'Good morning'
    translation: 'Bom dia'
    partOfSpeech: phrase
    example: 'Good morning, Mr. Silva.'
    exampleTranslation: 'Bom dia, senhor Silva.'
grammar: []
```

---

## 4. ID Naming Conventions

### 4.1 NodeId

```
{LEVEL}-{SKILL}-{SEQ}

Examples:
  A1-GREET-001    A1 greeting skill, first node
  A1-INTRO-002    A1 introduction skill, second node
  B1-WRITE-003    B1 writing skill, third node
```

### 4.2 Vocabulary Item Id

```
{lang}-{nodeId}-{SEQ}

Examples:
  pt-PT-A1-GREET-001-001    pt-PT realisation of A1-GREET-001, first vocab item
  en-GB-A1-GREET-001-002    en-GB realisation of A1-GREET-001, second vocab item
```

### 4.3 Grammar Point Id

```
{lang}-{nodeId}-G{SEQ}

Examples:
  pt-PT-A1-INTRO-001-G1     pt-PT realisation of A1-INTRO-001, first grammar point
```

### 4.4 Pairing Rule

Paired realisations (e.g., `pt-PT` and `en-GB` for the same node) **must** share vocabulary item sequences. Item `001` in `pt-PT` corresponds to item `001` in `en-GB`. This ensures deterministic pairing for bidirectional review.

---

## 5. Step-by-Step Workflow

### Step 1: Identify the Gap

Open `docs/cefr-mapping.md` and find a node with status ⬜ (Not Started) or 🟡 (Node Only). Check the Referencial Camões or your CEFR source for the Can-Do statement.

### Step 2: Create the CEFR Node

Create `src/content/cefr-nodes/{level}-{skill}-{seq}.yaml`:

```yaml
nodeId: A1-SHOP-001
cefrLevel: A1
skill: spoken_interaction
canDo: Can make simple purchases in shops
pragmaticFocus: Use polite request forms
notionalFocus: Shopping, money, quantities
relatedNodes: []
prerequisiteNodes: []
```

### Step 3: Validate the Node

```bash
npm run validate:content
```

Fix any Zod errors before proceeding.

### Step 4: Create Paired Realisations

Create both `pt-PT` and `en-GB` realisations in `src/content/realisations/{lang}/`:

**`src/content/realisations/pt-PT/a1-shop-001.yaml`:**
```yaml
nodeId: A1-SHOP-001
lang: pt-PT
vocabulary:
  - id: pt-PT-A1-SHOP-001-001
    term: 'Quanto custa?'
    translation: 'How much does it cost?'
    partOfSpeech: phrase
    example: 'Quanto custa esta camisola?'
    exampleTranslation: 'How much does this t-shirt cost?'
  - id: pt-PT-A1-SHOP-001-002
    term: 'Por favor'
    translation: 'Please'
    partOfSpeech: interjection
    example: 'Um café, por favor.'
    exampleTranslation: 'A coffee, please.'
grammar: []
culturalNotes: 'Bargaining is not common in Portuguese shops; prices are fixed.'
```

**`src/content/realisations/en-GB/a1-shop-001.yaml`:**
```yaml
nodeId: A1-SHOP-001
lang: en-GB
vocabulary:
  - id: en-GB-A1-SHOP-001-001
    term: 'How much does it cost?'
    translation: 'Quanto custa?'
    partOfSpeech: phrase
    example: 'How much does this t-shirt cost?'
    exampleTranslation: 'Quanto custa esta camisola?'
  - id: en-GB-A1-SHOP-001-002
    term: 'Please'
    translation: 'Por favor'
    partOfSpeech: interjection
    example: 'A coffee, please.'
    exampleTranslation: 'Um café, por favor.'
grammar: []
```

### Step 5: Validate Everything

```bash
npm run validate:content
npm run typecheck
```

### Step 6: Update Coverage Tracker

Add a row to `docs/cefr-mapping.md` and update the status to ✅ Realised.

### Step 7: Submit PR

The CI pipeline runs full validation (lint, typecheck, content validation, tests, build). A maintainer reviews for pedagogical accuracy before merge.

---

## 6. Quality Checklist

Before submitting a PR, verify:

### Content Quality
- [ ] `canDo` is a genuine CEFR Can-Do statement (10–200 chars)
- [ ] Vocabulary items are accurate Portuguese (pt-PT, not Brazilian pt-BR)
- [ ] Examples use natural, contemporary language
- [ ] Grammar explanations are clear for A1-level learners
- [ ] Cultural notes are factual and relevant

### Schema Compliance
- [ ] Node filename matches `nodeId`
- [ ] `nodeId` starts with `cefrLevel`
- [ ] Vocabulary item IDs follow `{lang}-{nodeId}-{SEQ}` format
- [ ] All required fields are present
- [ ] `npm run validate:content` passes

### Pairing Completeness
- [ ] Both `pt-PT` and `en-GB` realisations exist for the node
- [ ] Vocabulary item sequences are mirrored (same `SEQ` in both)
- [ ] Both realisations have the same number of vocabulary items

### Relationships
- [ ] `relatedNodes` references valid, existing nodeIds
- [ ] `prerequisiteNodes` references valid, existing nodeIds (or is empty)

---

## 7. Common Patterns

### 7.1 Greeting Nodes (spoken_interaction)

- Include time-of-day variants (bom dia, boa tarde, boa noite)
- Address formality (tu vs. você in pt-PT)
- Cultural notes on physical greetings (handshakes, cheek kisses)

### 7.2 Introduction Nodes (spoken_interaction)

- Name-giving phrases (chamo-me, o meu nome é)
- Pleasure expressions (prazer, prazer em conhecê-lo)
- Grammar: formal vs. informal address

### 7.3 Number Nodes (reading/writing)

- Cardinal numbers in the relevant range
- Written vs. spoken forms if they differ
- Example sentences showing numbers in context

### 7.4 Food/Shopping Nodes (reading/spoken_interaction)

- Menu/shop vocabulary
- Request phrases (quanto custa, quero, por favor)
- Cultural notes on dining customs

---

## 8. Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|--------------|----------------|-----|
| Mixing pt-BR and pt-PT | Platform targets European Portuguese | Use pt-PT exclusively |
| Skipping paired realisations | Breaks bidirectional review | Always create both pt-PT and en-GB |
| Vague `canDo` statements | CEFR requires specific, observable abilities | Use official CEFR Can-Do phrasing |
| Missing examples | Vocabulary without context doesn't stick | Every item needs an example + translation |
| Inconsistent item sequencing | Breaks pairing between realisations | Use same SEQ in both language realisations |
| Grammar without examples | Abstract explanations don't teach | Always include at least 1 example per grammar point |

---

## 9. Validation Commands

```bash
# Validate all content against Zod schemas
npm run validate:content

# Typecheck (catches schema mismatches)
npm run typecheck

# Full quality gate (lint + typecheck + validate + test + build)
npm run lint && npm run test:unit && npm run build
```

---

## 10. Reference: Schema Source

The canonical schemas are defined in `src/content.config.ts`. This playbook documents the patterns; the Zod schemas enforce them at build time. If this playbook conflicts with the schema, the schema wins.
