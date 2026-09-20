# Design Spec: Epic — A1 Content Completion (EN→PT)

**Date:** 20 September 2026  
**Status:** Draft for review  
**Issue:** #50  
**Depends on:** #49 (Content Authoring Playbook)

---

## 1. Goal

Complete all A1 Can-Do statements from Referencial Camões with paired en-GB/pt-PT realisations, covering all 5 CEFR skills (listening, reading, spoken_interaction, spoken_production, writing).

**Acceptance Criterion (from discovery-brief AC-2):** All CEFR A1 Can-Do statements have paired EN/PT realisations.

---

## 2. Current State

### 2.1 Existing Nodes (6)

| nodeId | Skill | Can-Do | Status |
|--------|-------|--------|--------|
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001 | reading | Can recognize and write numbers 1-100 | ✅ Realised |
| A1-FOOD-001 | reading | Can identify common food and drink items | 🟡 Node only |

### 2.2 Skill Coverage Gap

| Skill | Current Nodes | Target |
|-------|---------------|--------|
| listening | 0 | ≥1 |
| reading | 2 | ≥2 |
| spoken_interaction | 4 | ≥5 |
| spoken_production | 0 | ≥2 |
| writing | 0 | ≥1 |

### 2.3 Category Coverage Gap (Referencial Camões)

| Category | Description | Current | Target |
|----------|-------------|---------|--------|
| A. Interagir socialmente | Social interaction | ✅ partial | ✅ complete |
| B. Trocar informações | Exchange information | 🟡 partial | ✅ complete |
| C. Influir sobre o interlocutor | Influence interlocutor | ⬜ none | ✅ complete |
| D. Exprimir posicionamentos | Express positions | ⬜ none | ✅ complete |
| E. Expressar desejos e emoções | Express desires/emotions | ⬜ none | ✅ complete |
| F. Organizar o discurso | Organize discourse | ⬜ | Out of scope (B1+) |
| G. Regular a comunicação | Regulate communication | ⬜ none | ✅ complete |

---

## 3. Phased Implementation

### Phase 0: Fix Existing (A1-FOOD-001)

**Deliverables:**
- `src/content/realisations/pt-PT/a1-food-001.yaml`
- `src/content/realisations/en-GB/a1-food-001.yaml`
- Updated `docs/cefr-mapping.md`

**Nodes:** 0 new, 1 completed  
**Files:** 2 realisation YAMLs + 1 markdown update

---

### Phase 1: Category A — Social Interaction (Completing)

**New nodes:**
- `A1-THANK-001` — Can express gratitude (spoken_interaction)
- `A1-SORRY-001` — Can apologise and respond to apologies (spoken_interaction)

**Deliverables per node:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 2 new  
**Files:** 2 node YAMLs + 4 realisation YAMLs + 1 markdown update

---

### Phase 2: Category B — Exchange Information

**New nodes:**
- `A1-LOC-001` — Can ask for and give simple directions (spoken_interaction)
- `A1-TIME-001` — Can understand and use basic time/date expressions (reading, listening)

**Deliverables per node:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 2 new  
**Files:** 2 node YAMLs + 4 realisation YAMLs + 1 markdown update

---

### Phase 3: Category C — Influence Interlocutor

**New nodes:**
- `A1-REQUEST-001` — Can make simple requests (spoken_interaction, spoken_production)
- `A1-OFFER-001` — Can offer things and make invitations (spoken_interaction, spoken_production)

**Deliverables per node:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 2 new  
**Files:** 2 node YAMLs + 4 realisation YAMLs + 1 markdown update

---

### Phase 4: Category D — Opinions & Attitudes

**New nodes:**
- `A1-OPINION-001` — Can express simple opinions (spoken_production, writing)
- `A1-CAPABLE-001` — Can express ability/inability (spoken_production, writing)

**Deliverables per node:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 2 new  
**Files:** 2 node YAMLs + 4 realisation YAMLs + 1 markdown update

---

### Phase 5: Category E — Desires & Emotions

**New nodes:**
- `A1-WANT-001` — Can express simple desires and intentions (spoken_production, listening)
- `A1-FEEL-001` — Can express basic emotions (spoken_production, listening)

**Deliverables per node:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 2 new  
**Files:** 2 node YAMLs + 4 realisation YAMLs + 1 markdown update

---

### Phase 6: Category G — Regulate Communication

**New nodes:**
- `A1-CLARIFY-001` — Can ask someone to repeat or clarify (spoken_interaction, listening)

**Deliverables:**
- 1 CEFR node YAML
- 2 realisation YAMLs (pt-PT + en-GB)
- Updated `docs/cefr-mapping.md`

**Nodes:** 1 new  
**Files:** 1 node YAML + 2 realisation YAMLs + 1 markdown update

---

## 4. Content Source Strategy

| Source | Use For | Limitations |
|--------|---------|-------------|
| Referencial Camões PDF | Category structure, existing Can-Do statements | Illustrative excerpt only — not complete inventory |
| Web research | Supplementary Can-Do statements, vocabulary | Must be flagged for pedagogical review |
| Existing content patterns | ID conventions, field structure | Per content-authoring-playbook.md |

**Rule:** All content PRs require maintainer review for pedagogical accuracy (discovery-brief NG7: no unreviewed AI-generated content).

---

## 5. Final State

After all phases:

| Metric | Before | After |
|--------|--------|-------|
| Total A1 nodes | 6 | 15 |
| Fully realised nodes | 5 | 15 |
| CEFR skills covered | 2/5 | 5/5 |
| Categories covered | 2/6 | 6/6 |
| Total realisations | 10 | 30 |
| Total vocabulary items | ~20 | ~60+ |

---

## 6. Out of Scope

- **Category F (Organize discourse):** Mostly B1+, not needed at A1
- **A2+ content:** Deferred per discovery-brief NG2
- **Non-EN/PT language pairs:** Deferred per discovery-brief NG3
- **Audio recordings:** `audioUrl` field left empty; TTS handles pronunciation at runtime
- **Exercise authoring:** Exercises are a separate collection; not part of this epic

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| PDF excerpt incomplete for some categories | Web research + flag for review; don't invent content |
| Content accuracy without native speaker review | PR review gate; maintainer must approve pedagogical accuracy |
| Large total diff across all phases | Phased PRs keep each reviewable; merge incrementally |
| Vocabulary item sequencing breaks between phases | Each phase is self-contained; sequencing within a node, not across nodes |

---

## 8. Dependencies

- **#49 (Content Authoring Playbook):** Completed — provides repeatable patterns
- **Referencial Camões:** Authoritative source for Can-Do statements
- **Zod schemas (`content.config.ts`):** Enforce structure at build time
