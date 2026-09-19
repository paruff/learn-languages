# Expert Specification & Design Document

## Portuguese Learning Platform — CEFR-Aligned, Language-Pair-Agnostic, Static-First

**Document ID:** SPEC-PLP-001  
**Version:** 1.0  
**Date:** 19 September 2026  
**Status:** Draft for technical review  
**Classification:** Internal — Architecture & Implementation

---

## Table of Contents

1. Executive Summary
2. Goals, Non-Goals, and Success Criteria
3. System Architecture
4. Data Architecture
5. Content Model & CEFR Mapping
6. Spaced Repetition Engine
7. Application Layer & Routing
8. UI/UX Design Specification
9. Accessibility & Internationalisation
10. Performance Budgets
11. Security & Privacy
12. Testing Strategy
13. Deployment & Operations
14. Risks, Assumptions, Dependencies
15. Appendices

---

## 1. Executive Summary

The Portuguese Learning Platform (PLP) is a **static, GitHub Pages-hosted, CEFR-aligned language learning application** for European Portuguese. It is architected around an **abstract content model** that decouples language-independent CEFR learning objectives ("Can-Do" nodes) from language-specific realisations (vocabulary, grammar, examples). This allows the same abstract curriculum to be expressed in multiple source→target language pairs without duplicating pedagogical structure.

The MVP delivers **EN→PT (European Portuguese) at CEFR A1**, with an extensible architecture that supports A2–C2 and additional language pairs in subsequent phases.

The system is built on **Astro** (static site generation with islands architecture), **Vue 3** (interactive islands), **Zod** (content schema validation), and **SM-2** (spaced repetition). It requires **no backend**; all learner state persists in `localStorage`. Deployment is automated via GitHub Actions.

---

## 2. Goals, Non-Goals, and Success Criteria

### 2.1 Goals

| ID | Goal | Rationale |
|---|---|---|
| G1 | Deliver CEFR-aligned A1 content for EN→PT | Addresses the primary learning gap identified in discovery |
| G2 | Implement SM-2 spaced repetition with offline-capable persistence | Respects fragmented-time learner constraints |
| G3 | Provide a transparent CEFR Can-Do progress dashboard | Serves the Credential-Seeker persona |
| G4 | Establish an abstract content model that scales to multiple language pairs | Architectural investment for future phases |
| G5 | Deploy as a static site with zero backend infrastructure | Minimises operational cost and complexity |

### 2.2 Non-Goals (MVP)

| ID | Non-Goal | Deferred To |
|---|---|---|
| NG1 | User accounts, cloud sync, multi-device state | Phase 2+ |
| NG2 | Content beyond CEFR A1 | Phase 2+ |
| NG3 | Language pairs beyond EN→PT | Phase 2+ |
| NG4 | Formal CEFR certification or assessment | Not planned |
| NG5 | Native mobile application | Not planned |
| NG6 | Synchronous tutoring or live sessions | Not planned |
| NG7 | AI-generated content without human review | Not planned |

### 2.3 Success Criteria

| Metric | Baseline | Target (3 months post-launch) | Measurement |
|---|---|---|---|
| Weekly Active Learners | 0 | 50 | Privacy-respecting analytics |
| A1 vocab with SRS interval >21 days | 0 | 60% | localStorage aggregation (opt-in, anonymised) |
| Can-Do statements with >50% mastery | 0 | 10 A1 statements | Dashboard analytics |
| Week-2 return rate | — | 40% | Session tracking |
| Lighthouse Performance score | — | ≥95 | CI Lighthouse audit |
| First Contentful Paint (mobile) | — | <1.2s | Field data |

---

## 3. System Architecture

### 3.1 Architectural Principles

1. **Static-first.** No server runtime. All rendering happens at build time.
2. **Islands architecture.** Interactive components hydrate independently.
3. **Content as data.** All lesson content lives in validated, typed collections.
4. **Abstraction over duplication.** CEFR nodes are defined once; realisations attach to them.
5. **Progressive enhancement.** Core learning functions work without JavaScript where feasible.
6. **Privacy by default.** No PII leaves the device; no third-party trackers.

### 3.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BUILD TIME (CI/CD)                       │
│                                                              │
│  Content Collections (Markdown + YAML)                       │
│         │                                                    │
│         ▼                                                    │
│  Zod Schema Validation ──► Build fails on invalid content   │
│         │                                                    │
│         ▼                                                    │
│  Astro Static Generation ──► HTML + minimal JS islands       │
│         │                                                    │
│         ▼                                                    │
│  GitHub Actions ──► GitHub Pages (CDN)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     RUNTIME (Browser)                        │
│                                                              │
│  Static HTML ──► Instant render (no JS required for reading) │
│         │                                                    │
│         ├──► Island: FlashcardReview (Vue, hydrated)        │
│         ├──► Island: ProgressDashboard (Vue, hydrated)      │
│         ├──► Island: PronunciationButton (vanilla JS)       │
│         └──► Island: LanguagePairSelector (vanilla JS)      │
│                                                              │
│  localStorage ◄──► SRS State, Language Preference           │
│                                                              │
│  Web Speech API ──► Pronunciation (pt-PT voice)             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| SSG | Astro | 5.x | Islands, i18n, content collections |
| Interactive islands | Vue 3 | 3.5.x | Component model, founder familiarity |
| Build tool | Vite | 6.x | Fast HMR, Astro default |
| Schema validation | Zod | 3.x | Type-safe content validation |
| SRS algorithm | SM-2 (custom) | — | Proven, simple, no dependency |
| Testing | Vitest + Playwright | Latest | Unit + E2E |
| Linting | ESLint + Prettier | Latest | Consistency |
| Deployment | GitHub Actions + Pages | — | Zero-cost, native |
| Analytics | Plausible (self-hosted) or Umami | — | Privacy-respecting |

### 3.4 Directory Structure

```
plp/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── ci.yml
├── docs/
│   ├── architecture-decision-records/
│   ├── cefr-mapping.md
│   ├── reference-implementation.md
│   └── CONTRIBUTING.md
├── public/
│   └── audio/                    # Recorded pronunciation (optional)
├── src/
│   ├── components/
│   │   ├── FlashcardReview.vue
│   │   ├── ProgressDashboard.vue
│   │   ├── PronunciationButton.astro
│   │   ├── LanguagePairSelector.astro
│   │   ├── CanDoChecklist.vue
│   │   └── ui/                   # Shared primitives
│   ├── content/
│   │   ├── cefr-nodes/           # Abstract nodes (language-agnostic)
│   │   │   ├── a1-greetings.yaml
│   │   │   └── ...
│   │   └── realisations/         # Language-specific expressions
│   │       ├── pt-PT/
│   │       │   └── a1-greetings.yaml
│   │       └── en-GB/
│   │           └── a1-greetings.yaml
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── LessonLayout.astro
│   ├── lib/
│   │   ├── srs.ts                # SM-2 implementation
│   │   ├── storage.ts            # localStorage abstraction
│   │   ├── pairLoader.ts         # Language pair joining
│   │   ├── progress.ts           # CEFR progress calculation
│   │   ├── pronounce.ts          # Web Speech API wrapper
│   │   └── i18n.ts               # UI string translation
│   ├── pages/
│   │   ├── index.astro
│   │   └── [sourceLang]/
│   │       └── [targetLang]/
│   │           ├── index.astro
│   │           ├── lessons/
│   │           │   └── [nodeId].astro
│   │           ├── review.astro
│   │           └── progress.astro
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts         # Zod schemas
├── tests/
│   ├── unit/
│   │   ├── srs.test.ts
│   │   ├── storage.test.ts
│   │   └── progress.test.ts
│   └── e2e/
│       └── review-session.spec.ts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 4. Data Architecture

### 4.1 Core Entities

| Entity | Purpose | Storage |
|---|---|---|
| **CEFR Node** | Abstract, language-independent learning objective | Build-time: YAML in `content/cefr-nodes/` |
| **Realisation** | Language-specific expression of a node | Build-time: YAML in `content/realisations/{lang}/` |
| **Vocabulary Item** | A term within a realisation | Nested in Realisation |
| **SRS Card State** | Per-item scheduling state for a learner | Runtime: `localStorage` |
| **Learner Preferences** | Language pair, review direction, TTS voice | Runtime: `localStorage` |
| **Progress Snapshot** | Derived aggregation of SRS states by CEFR level | Runtime: computed, cached in `localStorage` |

### 4.2 Entity Relationships

```
CEFR Node (1) ──── (N) Realisation
     │                     │
     │                     │
     └── nodeId ───────────┘ (foreign key)

Realisation (1) ──── (N) Vocabulary Item
Realisation (1) ──── (N) Grammar Point

Vocabulary Item (1) ──── (1) SRS Card State  [joined at runtime by item id]
```

### 4.3 Key Invariants

- **I1:** Every Realisation MUST reference an existing `nodeId` in the CEFR Node collection.
- **I2:** Every Vocabulary Item MUST have a stable, globally unique `id` (format: `{lang}-{nodeId}-{seq}`).
- **I3:** Paired realisations (e.g., pt-PT and en-GB) for the same node SHOULD share vocabulary item sequences so pairing is deterministic.
- **I4:** SRS state keys MUST be scoped by language pair and direction to prevent cross-contamination: `srs:{source}:{target}:{direction}:{itemId}`.
- **I5:** CEFR level MUST be one of `A1, A2, B1, B2, C1, C2`.

---

## 5. Content Model & CEFR Mapping

### 5.1 CEFR Node Schema (Zod)

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const cefrNodeSchema = z.object({
  nodeId: z.string().regex(/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/),
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  skill: z.enum([
    'listening',
    'reading',
    'spoken_interaction',
    'spoken_production',
    'writing',
  ]),
  canDo: z.string().min(10).max(200),
  pragmaticFocus: z.string().optional(),
  notionalFocus: z.string().optional(),
  relatedNodes: z.array(z.string()).default([]),
  prerequisiteNodes: z.array(z.string()).default([]),
  contentNotes: z.string().optional(),
});

export const collections = {
  'cefr-nodes': defineCollection({
    type: 'data',
    schema: cefrNodeSchema,
  }),
  realisations: defineCollection({
    type: 'data',
    schema: realisationSchema,
  }),
};
```

### 5.2 Realisation Schema (Zod)

```typescript
const vocabularyItemSchema = z.object({
  id: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/),
  term: z.string().min(1),
  translation: z.string().min(1),
  partOfSpeech: z.enum([
    'noun', 'verb', 'adjective', 'adverb', 'pronoun',
    'preposition', 'conjunction', 'interjection', 'phrase',
  ]),
  gender: z.enum(['masculine', 'feminine', 'neuter', 'n/a']).default('n/a'),
  example: z.string().min(5),
  exampleTranslation: z.string().min(5),
  audioUrl: z.string().optional(),
  notes: z.string().optional(),
});

const grammarPointSchema = z.object({
  id: z.string(),
  point: z.string().min(5),
  explanation: z.string().min(20),
  examples: z.array(z.string()).min(1),
  cefrNotes: z.string().optional(),
});

const realisationSchema = z.object({
  nodeId: z.string(),
  lang: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
  vocabulary: z.array(vocabularyItemSchema).min(1),
  grammar: z.array(grammarPointSchema).default([]),
  culturalNotes: z.string().optional(),
});
```

### 5.3 CEFR Mapping Process

1. **Source:** Referencial Camões PLE (authoritative Portuguese RLD).
2. **Extraction:** Manual extraction of Can-Do statements per level, per skill.
3. **Node Creation:** Each statement becomes a `cefr-node` YAML file.
4. **Realisation Authoring:** For each node, a pt-PT and en-GB realisation is authored.
5. **Validation:** Build-time Zod validation + a custom CI check that verifies pairing completeness.
6. **Coverage Tracking:** `docs/cefr-mapping.md` tracks % of nodes with complete realisations per level.

### 5.4 Example Content Files

**`src/content/cefr-nodes/a1-greetings.yaml`:**
```yaml
nodeId: A1-GREET-001
cefrLevel: A1
skill: spoken_interaction
canDo: "Can greet people and respond to greetings"
pragmaticFocus: "Use appropriate greeting for time of day and formality"
notionalFocus: "Time of day, formality register"
relatedNodes: [A1-GREET-002, A1-INTRO-001]
prerequisiteNodes: []
```

**`src/content/realisations/pt-PT/a1-greetings.yaml`:**
```yaml
nodeId: A1-GREET-001
lang: pt-PT
vocabulary:
  - id: pt-PT-A1-GREET-001-001
    term: "Olá"
    translation: "Hello"
    partOfSpeech: interjection
    example: "Olá, como estás?"
    exampleTranslation: "Hello, how are you?"
  - id: pt-PT-A1-GREET-001-002
    term: "Bom dia"
    translation: "Good morning"
    partOfSpeech: phrase
    example: "Bom dia, senhor Silva."
    exampleTranslation: "Good morning, Mr. Silva."
grammar:
  - id: pt-PT-A1-GREET-001-G1
    point: "Formal vs. informal address (tu/você)"
    explanation: "European Portuguese distinguishes informal 'tu' from formal 'você'. Use 'você' with strangers, elders, and professional contexts."
    examples:
      - "Como estás? (informal)"
      - "Como está? (formal)"
culturalNotes: "Handshakes are standard in formal greetings; cheek kisses (one or two) are common among friends."
```

### 5.5 Content Authoring Workflow

1. Contributor identifies a missing CEFR node from `docs/cefr-mapping.md`.
2. Contributor creates the abstract node YAML.
3. Contributor creates paired realisations (source and target).
4. Contributor runs `npm run validate:content` locally.
5. Contributor submits PR; CI runs full validation.
6. Maintainer reviews for pedagogical accuracy.
7. Merge triggers deploy.

---

## 6. Spaced Repetition Engine

### 6.1 Algorithm: SM-2

The SM-2 algorithm is specified in detail below. It is implemented as a pure function with no side effects.

### 6.2 State Model

```typescript
interface SRSCardState {
  reps: number;           // consecutive successful reviews
  interval: number;       // days until next review
  ef: number;             // ease factor (min 1.3)
  due: number;            // epoch ms
  lastReviewed: number | null;
  lapses: number;         // times forgotten
}

type Quality = 1 | 2 | 3 | 4;  // Again | Hard | Good | Easy
```

### 6.3 Scheduling Logic

```typescript
export function newState(now = Date.now()): SRSCardState {
  return { reps: 0, interval: 0, ef: 2.5, due: now, lastReviewed: null, lapses: 0 };
}

export function schedule(state: SRSCardState, quality: Quality, now = Date.now()): SRSCardState {
  let { reps, interval, ef, lapses } = state;

  if (quality < 3) {
    reps = 0;
    interval = 1;
    lapses += 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ef);
    reps += 1;
  }

  // Map 1-4 quality to SM-2's 0-5 scale
  const q = quality === 1 ? 1 : quality === 2 ? 3 : quality === 3 ? 4 : 5;
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return {
    reps,
    interval: Math.max(1, interval),
    ef: Math.round(ef * 100) / 100,
    due: now + interval * 86_400_000,
    lastReviewed: now,
    lapses,
  };
}
```

### 6.4 Storage Keys

```
srs:{sourceLang}:{targetLang}:{direction}:{itemId}
```
Where `direction` is `forward` (source→target) or `reverse` (target→source).

Example: `srs:en-GB:pt-PT:forward:pt-PT-A1-GREET-001-001`

### 6.5 Session Flow

1. Load all vocabulary items for the current language pair.
2. Filter to items where `due <= now`.
3. Sort by `due` ascending, then by `lapses` descending (struggling items first).
4. Present up to 20 cards per session.
5. After each grade, persist new state immediately.
6. On session end, show summary: cards reviewed, accuracy, next due time.

### 6.6 Mastery Definition

A vocabulary item is **mastered** when `interval >= 21 days`. This threshold is used for CEFR progress calculation.

---

## 7. Application Layer & Routing

### 7.1 URL Structure

```
/                                         → Redirect to default or last-used pair
/{sourceLang}/{targetLang}/               → Language pair home
/{sourceLang}/{targetLang}/lessons/       → Lesson index
/{sourceLang}/{targetLang}/lessons/{nodeId} → Individual lesson
/{sourceLang}/{targetLang}/review/        → SRS review session
/{sourceLang}/{targetLang}/progress/      → CEFR progress dashboard
```

### 7.2 Astro i18n Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/plp',
  i18n: {
    locales: ['en-GB', 'pt-PT', 'es-ES', 'fr-FR'],
    defaultLocale: 'en-GB',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [vue()],
  output: 'static',
});
```

### 7.3 Static Path Generation

```typescript
// src/pages/[sourceLang]/[targetLang]/lessons/[nodeId].astro
export async function getStaticPaths() {
  const nodes = await getCollection('cefr-nodes');
  const pairs = await getValidLanguagePairs(); // computed from realisations
  return pairs.flatMap(({ source, target }) =>
    nodes
      .filter(n => hasRealisations(n.nodeId, source, target))
      .map(node => ({
        params: { sourceLang: source, targetLang: target, nodeId: node.data.nodeId },
        props: { node, source, target },
      }))
  );
}
```

### 7.4 Client-Side State Management

No global state library is required. State is managed through:
- **Astro props** for build-time data.
- **Vue `ref`/`reactive`** within islands.
- **Custom events** (`window.dispatchEvent`) for cross-island communication (e.g., language pair change).
- **localStorage** as the persistence layer.

### 7.5 Cross-Island Communication

```typescript
// src/lib/events.ts
export const EVENTS = {
  LANGUAGE_PAIR_CHANGED: 'plp:languagePairChanged',
  SRS_STATE_UPDATED: 'plp:srsStateUpdated',
} as const;

export function emit(event: string, detail: unknown) {
  window.dispatchEvent(new CustomEvent(event, { detail }));
}

export function on(event: string, handler: (e: CustomEvent) => void) {
  window.addEventListener(event, handler as EventListener);
}
```

---

## 8. UI/UX Design Specification

### 8.1 Design Principles

1. **Content first.** Lesson text is legible, readable, and instant.
2. **Minimal chrome.** Navigation is unobtrusive; the learner's focus is on the content.
3. **Immediate feedback.** Every interaction (grade, pronunciation, navigation) responds within 100ms.
4. **No dark patterns.** No streak guilt, no artificial scarcity, no forced notifications.
5. **Accessible by default.** WCAG 2.1 AA compliance.

### 8.2 Key Screens

#### 8.2.1 Language Pair Home

- **Purpose:** Orient the learner and provide entry points.
- **Elements:** Language pair selector, current CEFR level indicator, "Continue where you left off" CTA, due-card count, links to Lessons / Review / Progress.
- **Astro/Vue:** Mostly static; language selector is a small island.

#### 8.2.2 Lesson View

- **Purpose:** Present a CEFR node's content.
- **Elements:** Can-Do statement as the title, vocabulary list with pronunciation buttons, grammar points with examples, cultural notes, "Add to review" CTA.
- **Astro/Vue:** Static content; pronunciation buttons are vanilla JS islands.

#### 8.2.3 Flashcard Review

- **Purpose:** SRS review session.
- **Elements:** Card front (term or translation, per direction), reveal button, four grading buttons (Again/Hard/Good/Easy), progress indicator ("7 of 20"), session summary on completion.
- **Astro/Vue:** Full Vue island, hydrating on `client:load` when the review page is opened.

#### 8.2.4 Progress Dashboard

- **Purpose:** Show CEFR-aligned progress.
- **Elements:** Per-level progress bars (A1–C2), Can-Do checklist with mastery indicators, "next recommended node" card, stats (total cards, mastered, due today).
- **Astro/Vue:** Vue island, hydrating on `client:visible`.

### 8.3 Component Contracts

| Component | Type | Hydration | Props |
|---|---|---|---|
| `LanguagePairSelector` | Astro + vanilla JS | `client:load` | `pairs: LanguagePair[]`, `current: LanguagePair` |
| `PronunciationButton` | Astro + vanilla JS | `client:idle` | `term: string`, `lang: string` |
| `FlashcardReview` | Vue | `client:load` | `sourceLang`, `targetLang`, `items: VocabularyItem[]` |
| `ProgressDashboard` | Vue | `client:visible` | `sourceLang`, `targetLang`, `nodes: CEFRNode[]` |
| `CanDoChecklist` | Vue | `client:visible` | `nodes: CEFRNode[]`, `progress: ProgressMap` |

### 8.4 Visual Design Tokens

```css
:root {
  /* Colour */
  --color-bg: #fdfdfd;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #5a5a5a;
  --color-accent: #006b5e;      /* Portuguese green */
  --color-accent-hover: #005247;
  --color-success: #2e7d32;
  --color-warning: #ed6c02;
  --color-error: #c62828;

  /* Typography */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-size-base: 1rem;        /* 16px */
  --line-height-base: 1.6;

  /* Spacing (8px scale) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121212;
    --color-surface: #1e1e1e;
    --color-text: #e8e8e8;
    --color-text-muted: #a0a0a0;
    --color-accent: #4dd0b8;
  }
}
```

### 8.5 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | <640px | Single column, stacked nav |
| Tablet | 640–1024px | Single column, wider margins |
| Desktop | >1024px | Two-column lesson layout (content + sidebar) |

---

## 9. Accessibility & Internationalisation

### 9.1 Accessibility Requirements

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA contrast | All text ≥4.5:1; large text ≥3:1 |
| Keyboard navigation | All interactive elements reachable via Tab; visible focus rings |
| Screen reader support | Semantic HTML, ARIA labels on icon buttons, live regions for grade feedback |
| Reduced motion | Respect `prefers-reduced-motion`; disable card flip animations |
| Text scaling | Layout remains functional at 200% zoom |
| Pronunciation access | Text alternatives for audio; TTS as an accessible fallback |

### 9.2 Internationalisation (i18n)

- **UI strings** are stored in `src/i18n/{lang}.json` and loaded via a lightweight helper.
- **Content** is already language-scoped through the realisations model.
- **Date/number formatting** uses `Intl.DateTimeFormat` and `Intl.NumberFormat`.
- **RTL support** is not required for MVP (no RTL source/target languages), but layout uses logical properties (`margin-inline`, `padding-block`) to ease future support.

### 9.3 Text-to-Speech

```typescript
// src/lib/pronounce.ts
export function pronounce(term: string, lang: string): void {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = lang; // e.g., 'pt-PT'
  utterance.rate = 0.9;
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === lang);
  if (preferred) utterance.voice = preferred;
  speechSynthesis.speak(utterance);
}
```

---

## 10. Performance Budgets

| Metric | Budget | Enforcement |
|---|---|---|
| Initial HTML (per page) | <30 KB (gzipped) | CI bundle analysis |
| Total JS (per page) | <50 KB (gzipped) | CI bundle analysis |
| Total CSS | <20 KB (gzipped) | CI bundle analysis |
| Lighthouse Performance | ≥95 | Lighthouse CI |
| Lighthouse Accessibility | 100 | Lighthouse CI |
| First Contentful Paint (mobile, 4G) | <1.2s | Field data |
| Time to Interactive (review page) | <2.0s | Field data |
| Cumulative Layout Shift | <0.1 | Lighthouse CI |

**Strategy:** Astro's default zero-JS output plus targeted hydration (`client:visible` for below-fold islands) keeps budgets achievable.

---

## 11. Security & Privacy

### 11.1 Security Posture

| Concern | Mitigation |
|---|---|
| XSS | Astro escapes content by default; Vue escapes interpolations; no `v-html` on user content |
| Content injection via YAML | Zod validation with strict types; no `eval` or dynamic code execution |
| Dependency vulnerabilities | `npm audit` in CI; Dependabot enabled |
| Supply chain | Lockfile committed; CI uses `npm ci` |
| GitHub Actions permissions | Least-privilege `permissions:` block in workflows |

### 11.2 Privacy Posture

- **No PII collected.** No accounts, no emails, no names.
- **No third-party trackers.** Analytics are self-hosted and cookieless (Plausible or Umami).
- **localStorage is device-local.** No data leaves the browser.
- **Opt-in anonymised telemetry** (if implemented) is explicit, revocable, and aggregated.
- **GDPR posture:** No personal data processing; no cookie banner required if no cookies are set.

---

## 12. Testing Strategy

### 12.1 Test Pyramid

| Layer | Tool | Coverage Target | Scope |
|---|---|---|---|
| Unit | Vitest | ≥90% for `lib/` | SRS, storage, progress, pair loader |
| Content validation | Custom script + Zod | 100% of content files | All YAML validates against schema |
| Integration | Vitest + jsdom | Key flows | Pair loader + SRS + storage together |
| E2E | Playwright | Critical paths | Review session, language switch, progress view |
| Accessibility | axe-core via Playwright | All pages | WCAG 2.1 AA |
| Performance | Lighthouse CI | All pages | Budgets from §10 |

### 12.2 Critical Test Cases

**SRS:**
- New card + Good → interval 1, reps 1
- New card + Again → interval 1, reps 0, lapses 1
- Mature card + Good → interval grows by EF
- EF never drops below 1.3
- Due date computed correctly

**Pair Loader:**
- Given EN→PT, returns correctly paired vocabulary
- Missing realisations are handled gracefully
- Item IDs are unique across pairs

**Progress:**
- Mastery threshold (interval ≥21) is respected
- Per-level aggregation is correct
- Empty state renders without error

**E2E:**
- Complete a review session; verify state persists after reload
- Switch language pair; verify content updates
- Trigger pronunciation; verify no console errors

### 12.3 CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run validate:content
      - run: npm run test:unit
      - run: npm run build
      - run: npm run test:e2e
      - run: npm run lighthouse
```

---

## 13. Deployment & Operations

### 13.1 Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 13.2 Environments

| Environment | URL | Trigger |
|---|---|---|
| Production | `https://<user>.github.io/plp/` | Push to `main` |
| Preview | PR-specific preview (optional via Cloudflare Pages) | PR opened |
| Local | `http://localhost:4321` | `npm run dev` |

### 13.3 Operational Concerns

| Concern | Approach |
|---|---|
| Rollback | Revert commit; GitHub Actions redeploys previous state |
| Content updates | PR-based; validated in CI before merge |
| Monitoring | Plausible/Umami dashboard; Lighthouse CI trend |
| Error tracking | Sentry (optional, client-side, privacy-configured) |
| Uptime | GitHub Pages SLA; no additional monitoring for MVP |

---

## 14. Risks, Assumptions, Dependencies

### 14.1 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Abstract schema cannot cleanly represent cross-linguistic grammar differences | Medium | High | Schema spike before full build; validate with ser/estar and tu/você |
| R2 | Referencial Camões extraction is slower than estimated | High | Medium | Time-box extraction; ship A1 subset first |
| R3 | Learners do not return after first session | Medium | High | User testing of review flow; minimise friction |
| R4 | Content authoring does not scale beyond founder | Medium | Medium | Simple schema + CONTRIBUTING.md; validate with 1 contributor |
| R5 | Astro i18n routing becomes complex with many language pairs | Low | Medium | Start with 1 pair; add pairs incrementally |

### 14.2 Assumptions

- The founder has access to the Referencial Camões PLE document.
- Astro 5.x remains stable and supported throughout the project.
- GitHub Pages continues to offer free static hosting for public repositories.
- Learners have modern browsers supporting `localStorage` and Web Speech API.

### 14.3 Dependencies

| Dependency | Type | Risk if unavailable |
|---|---|---|
| Astro | Framework | High — architectural foundation |
| Vue 3 | Island framework | Medium — could substitute React/Svelte |
| Zod | Schema validation | Medium — could hand-roll validation |
| Referencial Camões PLE | Content source | High — required for CEFR mapping |
| GitHub Pages | Hosting | Low — could migrate