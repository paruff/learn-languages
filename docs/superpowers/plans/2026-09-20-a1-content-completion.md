# A1 Content Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete all A1 Can-Do statements from Referencial Camões with paired en-GB/pt-PT realisations, covering all 5 CEFR skills.

**Architecture:** Create CEFR node YAMLs and paired realisation YAMLs following the content-authoring-playbook.md patterns. Each phase adds nodes for one CEFR function category. Validation via Zod schemas at build time.

**Tech Stack:** YAML content files, Zod schema validation (`src/content.config.ts`), Astro content collections

**Spec:** `docs/superpowers/specs/2026-09-20-a1-content-completion-design.md`

## Global Constraints

- All content follows `docs/content-authoring-playbook.md` patterns
- Vocabulary uses pt-PT (European Portuguese), not pt-BR
- Paired realisations must share vocabulary item sequences
- `nodeId` format: `{LEVEL}-{SKILL}-{SEQ}` (regex: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`)
- Vocabulary item `id` format: `{lang}-{nodeId}-{SEQ}` (regex: `/^[a-z]{2}(-[A-Z]{2})?-.+-\d{3}$/`)
- Grammar point `id` format: `{lang}-{nodeId}-G{SEQ}`
- `npm run validate:content` must pass after each phase
- `npm run typecheck` must pass after each phase
- All content PRs require maintainer review for pedagogical accuracy

---

## File Map

### Existing files to modify
- `docs/cefr-mapping.md` — update coverage table after each phase

### Files to create (26 total)

**Phase 0 (2):** `realisations/pt-PT/a1-food-001.yaml`, `realisations/en-GB/a1-food-001.yaml`

**Phase 1 (6):** nodes `a1-thank-001`, `a1-sorry-001` + 4 realisations

**Phase 2 (6):** nodes `a1-loc-001`, `a1-time-001` + 4 realisations

**Phase 3 (6):** nodes `a1-request-001`, `a1-offer-001` + 4 realisations

**Phase 4 (6):** nodes `a1-opin-001`, `a1-capab-001` + 4 realisations

**Phase 5 (6):** nodes `a1-want-001`, `a1-feel-001` + 4 realisations

**Phase 6 (3):** node `a1-clarify-001` + 2 realisations

---

## Phase 0: Complete A1-FOOD-001

### Task 0.1: Create pt-PT realisation for A1-FOOD-001

**Files:** Create `src/content/realisations/pt-PT/a1-food-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation with 5 food/drink vocabulary items (água, pão, café, leite, arroz), no grammar, cultural notes on Portuguese meal times
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git add src/content/realisations/pt-PT/a1-food-001.yaml && git commit -m "content(vocab): add pt-PT realisation for A1-FOOD-001"`

### Task 0.2: Create en-GB realisation for A1-FOOD-001

**Files:** Create `src/content/realisations/en-GB/a1-food-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create en-GB realisation mirroring pt-PT sequence (water, bread, coffee, milk, rice)
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** Update `docs/cefr-mapping.md`: A1-FOOD-001 from 🟡 to ✅, coverage to 6/6 (100%)
- [ ] **Step 4:** `git add src/content/realisations/en-GB/a1-food-001.yaml docs/cefr-mapping.md && git commit -m "content(vocab): add en-GB realisation for A1-FOOD-001, update coverage"`

---

## Phase 1: Category A — Social Interaction

### Task 1.1: Create A1-THANK-001 node

**Files:** Create `src/content/cefr-nodes/a1-thank-001.yaml`

- [ ] **Step 1:** Create node: spoken_interaction, "Can express thanks and respond to thanks", relatedNodes: [A1-SORRY-001, A1-GREET-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-THANK-001 node"`

### Task 1.2: Create A1-THANK-001 realisations

**Files:** Create `src/content/realisations/pt-PT/a1-thank-001.yaml`, `src/content/realisations/en-GB/a1-thank-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation: Obrigado/Obrigada (gendered), De nada, cultural notes on gendered thanks
- [ ] **Step 2:** Create en-GB realisation: Thank you, Thanks, You are welcome
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** `git commit -m "content(vocab): add A1-THANK-001 realisations (pt-PT + en-GB)"`

### Task 1.3: Create A1-SORRY-001 node

**Files:** Create `src/content/cefr-nodes/a1-sorry-001.yaml`

- [ ] **Step 1:** Create node: spoken_interaction, "Can apologise and respond to apologies", relatedNodes: [A1-THANK-001, A1-GREET-002]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-SORRY-001 node"`

### Task 1.4: Create A1-SORRY-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-sorry-001.yaml`, `src/content/realisations/en-GB/a1-sorry-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Desculpe, Com licença, Não faz mal
- [ ] **Step 2:** Create en-GB realisation: Sorry, Excuse me, It's okay
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-THANK-001 and A1-SORRY-001 as ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-SORRY-001 realisations, update coverage"`

---

## Phase 2: Category B — Exchange Information

### Task 2.1: Create A1-LOC-001 node

**Files:** Create `src/content/cefr-nodes/a1-loc-001.yaml`

- [ ] **Step 1:** Create node: spoken_interaction, "Can ask for and understand simple directions", relatedNodes: [A1-TIME-001, A1-INTRO-002]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-LOC-001 node"`

### Task 2.2: Create A1-LOC-001 realisations

**Files:** Create `src/content/realisations/pt-PT/a1-loc-001.yaml`, `src/content/realisations/en-GB/a1-loc-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation: Onde fica...?, À esquerda, À direita, Em frente
- [ ] **Step 2:** Create en-GB realisation: Where is...?, On the left, On the right, Straight ahead
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** `git commit -m "content(vocab): add A1-LOC-001 realisations (pt-PT + en-GB)"`

### Task 2.3: Create A1-TIME-001 node

**Files:** Create `src/content/cefr-nodes/a1-time-001.yaml`

- [ ] **Step 1:** Create node: reading, "Can understand basic time and date expressions", prerequisiteNodes: [A1-NUMB-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-TIME-001 node"`

### Task 2.4: Create A1-TIME-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-time-001.yaml`, `src/content/realisations/en-GB/a1-time-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Que horas são?, hoje, amanhã, ontem + grammar on telling time with horas/São
- [ ] **Step 2:** Create en-GB realisation: What time is it?, today, tomorrow, yesterday
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-LOC-001 and A1-TIME-001 as ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-TIME-001 realisations, update coverage"`

---

## Phase 3: Category C — Influence Interlocutor

### Task 3.1: Create A1-REQUEST-001 node

**Files:** Create `src/content/cefr-nodes/a1-request-001.yaml`

- [ ] **Step 1:** Create node: spoken_interaction, "Can make simple requests using polite forms", relatedNodes: [A1-OFFER-001, A1-SORRY-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-REQUEST-001 node"`

### Task 3.2: Create A1-REQUEST-001 realisations

**Files:** Create `src/content/realisations/pt-PT/a1-request-001.yaml`, `src/content/realisations/en-GB/a1-request-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation: Pode ajudar-me?, Quero..., Poderia...? + grammar on tu/você in requests
- [ ] **Step 2:** Create en-GB realisation: Can you help me?, I want..., Could you...?
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** `git commit -m "content(vocab): add A1-REQUEST-001 realisations (pt-PT + en-GB)"`

### Task 3.3: Create A1-OFFER-001 node

**Files:** Create `src/content/cefr-nodes/a1-offer-001.yaml`

- [ ] **Step 1:** Create node: spoken_production, "Can offer things and make simple invitations", relatedNodes: [A1-REQUEST-001, A1-WANT-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-OFFER-001 node"`

### Task 3.4: Create A1-OFFER-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-offer-001.yaml`, `src/content/realisations/en-GB/a1-offer-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Quer...?, Gostaria de...?, Vamos...? + grammar on tu/você in offers
- [ ] **Step 2:** Create en-GB realisation: Do you want...?, Would you like...?, Shall we...?
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-REQUEST-001 and A1-OFFER-001 as ✅, Category C from ⬜ to ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-OFFER-001 realisations, update coverage"`

---

## Phase 4: Category D — Opinions & Attitudes

### Task 4.1: Create A1-OPIN-001 node

**Files:** Create `src/content/cefr-nodes/a1-opin-001.yaml`

- [ ] **Step 1:** Create node: spoken_production, "Can express simple opinions about everyday topics", relatedNodes: [A1-CAPAB-001, A1-FEEL-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-OPIN-001 node"`

### Task 4.2: Create A1-OPIN-001 realisations

**Files:** Create `src/content/realisations/pt-PT/a1-opin-001.yaml`, `src/content/realisations/en-GB/a1-opin-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation: Acho que..., Gosto de..., Não gosto de..., Na minha opinião...
- [ ] **Step 2:** Create en-GB realisation: I think that..., I like..., I don't like..., In my opinion...
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** `git commit -m "content(vocab): add A1-OPIN-001 realisations (pt-PT + en-GB)"`

### Task 4.3: Create A1-CAPAB-001 node

**Files:** Create `src/content/cefr-nodes/a1-capab-001.yaml`

- [ ] **Step 1:** Create node: spoken_production, "Can express ability and inability to do things", relatedNodes: [A1-OPIN-001, A1-WANT-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-CAPAB-001 node"`

### Task 4.4: Create A1-CAPAB-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-capab-001.yaml`, `src/content/realisations/en-GB/a1-capab-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Consigo..., Não consigo..., Sei/Não sei... + grammar on Consigo vs. Sei
- [ ] **Step 2:** Create en-GB realisation: I can..., I can't..., I know (how to)...
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-OPIN-001 and A1-CAPAB-001 as ✅, Category D from ⬜ to ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-CAPAB-001 realisations, update coverage"`

---

## Phase 5: Category E — Desires & Emotions

### Task 5.1: Create A1-WANT-001 node

**Files:** Create `src/content/cefr-nodes/a1-want-001.yaml`

- [ ] **Step 1:** Create node: spoken_production, "Can express simple desires and intentions", relatedNodes: [A1-FEEL-001, A1-OFFER-001, A1-CAPAB-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-WANT-001 node"`

### Task 5.2: Create A1-WANT-001 realisations

**Files:** Create `src/content/realisations/pt-PT/a1-want-001.yaml`, `src/content/realisations/en-GB/a1-want-001.yaml`

- [ ] **Step 1:** Create pt-PT realisation: Quero..., Vou..., Gostaria de... + grammar on ir + infinitive for future
- [ ] **Step 2:** Create en-GB realisation: I want..., I'm going to..., I would like...
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** `git commit -m "content(vocab): add A1-WANT-001 realisations (pt-PT + en-GB)"`

### Task 5.3: Create A1-FEEL-001 node

**Files:** Create `src/content/cefr-nodes/a1-feel-001.yaml`

- [ ] **Step 1:** Create node: listening, "Can understand and express basic emotions", relatedNodes: [A1-WANT-001, A1-OPIN-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-FEEL-001 node"`

### Task 5.4: Create A1-FEEL-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-feel-001.yaml`, `src/content/realisations/en-GB/a1-feel-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Estou feliz/triste/cansado..., Tenho..., Sinto... + grammar on estar + adjective for emotions
- [ ] **Step 2:** Create en-GB realisation: I am happy/sad/tired..., I have..., I feel...
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-WANT-001 and A1-FEEL-001 as ✅, Category E from ⬜ to ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-FEEL-001 realisations, update coverage"`

---

## Phase 6: Category G — Regulate Communication

### Task 6.1: Create A1-CLARIFY-001 node

**Files:** Create `src/content/cefr-nodes/a1-clarify-001.yaml`

- [ ] **Step 1:** Create node: spoken_interaction, "Can ask someone to repeat or clarify", relatedNodes: [A1-GREET-001, A1-INTRO-001]
- [ ] **Step 2:** Run `npm run validate:content` — expect PASS
- [ ] **Step 3:** `git commit -m "content(cefr): add A1-CLARIFY-001 node"`

### Task 6.2: Create A1-CLARIFY-001 realisations + update coverage

**Files:** Create `src/content/realisations/pt-PT/a1-clarify-001.yaml`, `src/content/realisations/en-GB/a1-clarify-001.yaml`, Modify `docs/cefr-mapping.md`

- [ ] **Step 1:** Create pt-PT realisation: Pode repetir?, Como se diz...?, Não entendo, Pode falar mais devagar?
- [ ] **Step 2:** Create en-GB realisation: Can you repeat?, How do you say...?, I don't understand, Can you speak more slowly?
- [ ] **Step 3:** Run `npm run validate:content` — expect PASS
- [ ] **Step 4:** Update `docs/cefr-mapping.md`: add A1-CLARIFY-001 as ✅, Category G from ⬜ to ✅
- [ ] **Step 5:** `git commit -m "content(vocab): add A1-CLARIFY-001 realisations, update coverage"`

---

## Final Verification

After all phases complete:

- [ ] **Step 1:** Run `npm run validate:content` — expect 15 nodes, 30 realisations
- [ ] **Step 2:** Run `npm run typecheck` — expect 0 errors
- [ ] **Step 3:** Run `npm run lint` — expect clean
- [ ] **Step 4:** Run `npm run build` — expect success
- [ ] **Step 5:** Verify `docs/cefr-mapping.md` shows 15/15 nodes ✅ Realised, 5/5 skills covered, 6/6 categories covered
