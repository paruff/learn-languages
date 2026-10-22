# Design: French (fr-FR) B1 Content — EN→FR (#109)

**Date:** 2026-09-23
**Issue:** Epic #109 — Author the B1 Can-Do inventory for en-GB↔fr-FR (playbook #49; part of #39 / #19 / Plan #20 Phase 5; depends on #108, merged as PR #132 / `cc27872`).
**Approach:** A2-parallel single epic (one branch/PR, phased skill-ordered batches) — same pattern validated by #107 (fr A1) and #108 (fr A2). User-approved decisions: full-expansion rule (A), single branch/PR (A), e2e pin `B1-OPINION-001` (A).

## 1. Goal & acceptance criteria

Deliver full B1 content for the en-GB→fr-FR pair and document coverage:

- `docs/fr-cefr-mapping.md` gains a **B1 coverage table** sourced from a verified descriptor extraction.
- `npm run validate:content` passes (warning baseline unchanged at **17**).
- A **full B1 fr-FR review session works end-to-end in a real browser** (e2e, all three browser projects).

Content-only change: no TypeScript/Astro source changes are expected — only the e2e spec file (helper widening + new describe block) changes under `tests/`.

## 2. Verified source

- **PDF:** [Descripteurs_B1.pdf](https://www.delfdalf.ch/fileadmin/user_upload/Unterlagen/Descripteurs/Descripteurs_B1.pdf) — sibling of the A1/A2 documents verified in #106/#108, same redistribution family (Bureau DELF-DALF under license from France Éducation international). Verified free: **HTTP 200, ~350KB** (`Content-Length: 358016`), no login/paywall (HEAD check 2026-09-23).
- **Extraction:** `pdftotext -layout` → `/tmp/descripteurs-b1.txt` (scratch, never committed; line count recorded at execution). Expected structure identical in shape to A1/A2: three top-level activity groups (Activités de production / réception / interaction et stratégies) with named sub-activities, plus cross-cutting Compétences sections. Rows marked `Pas de descripteur disponible` (gaps in the CEFR's own B1 scale) tabulated as gaps.

## 3. Decision rule — full inventory expansion (user-approved, option A)

Applied by end-to-end reading of the extracted B1 text against the **18 existing B1 `cefr-nodes/`**:

- **Reuse** any B1 node whose `canDo` substantively covers the descriptor (wording may differ).
- **Create** a new `B1-{SKILL}-{NNN}` node for every **uncovered descriptor worth modelling** — an assessable learner ability (same bar as A2's full-expansion, not A1's stricter filter).
- **Document as gap** (never a node): `Pas de descripteur disponible` rows; strategy/meta statements that do not model an ability on their own; non-modellable items (scripted performance / prepared auditoire, niche creative writing, formal-meeting-style acts — same categories as A2); each with its reason in the mapping doc.

**Level discipline:** B1 descriptors map only against B1 nodes — never "covered" by an A1/A2 node (wrong level for the coverage table). Substantial cross-level `canDo` duplication is noted as an observation; the B1 node is still created when the descriptor is uncovered at B1.

**New-node deliverables (the full trio):** `cefr-nodes` YAML + paired **en-GB** realisation + paired **fr-FR** realisation. en-GB is mandatory — it is the source side of the EN→FR pair. Atomic trios land together so parity stays green at every commit.

**Node metadata conventions:** `nodeId` matches `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/` with the next-free sequence per skill; `canDo` in repo voice ("Can …"); `relatedNodes`/`prerequisiteNodes` set only where genuinely true.

**Baseline inventory facts (pre-extraction):** 18 nodes — `spoken_interaction` ×5 (DISCOURSE-001, OPINION-002, SOCIAL-001..003), `spoken_production` ×5 (DISCOURSE-002..003, OPINION-001, OPINION-003, SOCIAL-004), `writing` ×5 (DISCOURSE-004..005, OPINION-004, TEXT-004..005), `reading` ×3 (TEXT-001..003); **no baseline `listening` nodes** (extraction may add any). en-GB vocab: **7 items/file** except `b1-social-001` (**8 items**) = 127 baseline French items to author. fr-FR must match en-GB count **per file** (parity rule), not a fixed 6.

## 4. Authoring

**Scope:** 18 existing B1 nodes (127 items) + en-GB/fr-FR files for every new node from §3. **No images** — no en-GB B1 file has an `imageUrl`; nothing to source or mirror.

**Batches — one commit each (skill-ordered; re-check each node's `skill` field if in doubt):**

| Batch | Nodes (baseline)                                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| 1     | `spoken_production` (5) + `writing` (5) = 10 files — turns the B1 session + `B1-OPINION-001` lesson tests GREEN |
| 2     | `spoken_interaction` (5)                                                                                        |
| 3     | `reading` (3)                                                                                                   |
| 4     | New nodes' trios from §3 (cefr-node + en-GB + fr-FR together)                                                   |

Extraction + new-node trios may interleave before/with authoring batches per the implementation plan (A2 precedent: trios land at extraction time so coverage tables and parity stay consistent).

**Conventions (A1/A2, unchanged):** `term` = French · `translation` = English gloss · `example` = French · `exampleTranslation` = English · `gender` = French (nouns only) · `grammar: []` · `culturalNotes` = France-specific only where genuinely useful. Mirror source is the en-GB **`term`/`example` concepts at identical seq numbers**; where an en-GB `translation`/`exampleTranslation` holds stale Portuguese (confirmed present throughout B1 en-GB), ignore the gloss and mirror the concept. Natural **B1-register** French — connected discourse, justification, connectors (`parce que`, `mais`, `d'abord… ensuite`) where the inventory teaches them — not A2-level telegraphic phrases; noun–adjective agreement checked in every example.

## 5. e2e proof (RED first)

Extend `tests/e2e/review-fr.spec.ts` with a `fr-FR B1 review session` describe block (single home for French-pair e2e; no second file). Mechanics mirror the A2 block exactly:

1. **Helpers:** widen `frVocabIds`'s level-prefix union to include `'b1-'` (file-local, `tests/e2e/review-fr.spec.ts` only); add `enB1Terms()` as a copy of `enA2Terms()` scoped to `b1-` (or generalize both helpers to take the level prefix — either is fine, keep it small). Import `SESSION_SIZE` from `src/lib/reviewSession` (already imported for A2). Dynamic only — never hardcode content counts.
2. **Seed (`beforeEach`):** clear localStorage; schedule **all A1 and A2** fr-FR vocab ids (`frVocabIds('a1-')` ∪ `frVocabIds('a2-')`) with dueDate **+1y** — same seed payload as the A2 block — so the interleaved `SESSION_SIZE=15` slice is B1-only (`b1-*` sorts after `a1-*`/`a2-*`). Assert `totalCount === SESSION_SIZE` like the A2 test.
3. **Session test** — grade out; every card front ∈ `enB1Terms()`; summary contains `` `${totalCount}/${totalCount} correct first try` `` (satisfies the AC's full-session requirement).
4. **Pinned lesson test** — `/lessons/B1-OPINION-001/` exists for en-GB→fr-FR; `.vocab-item__term` nth(0) pairs **`in my opinion` ↔ `À mon avis`**, nth(1) pairs **`I think that` ↔ `Je pense que`** (en-GB B1 seq order; both French equivalents already used in `fr-FR/a2-news-003.yaml` at the opposite seqs — cross-level surface dup is fine). If authoring finds clearly better B1-register equivalents, update file **and** test in the same commit.

Both written **RED** before any B1 content exists (empty session / 404 lesson), turned GREEN by the content batches (batch 1 includes `B1-OPINION-001` and enough nodes for a 15-card B1-only slice).

**Precondition:** local `main` is synced first — this e2e file on `origin/main` already has the A1+A2 blocks and helpers; local is only missing merge `cc27872` (plus holds 3 unrelated local commits that rebase cleanly).

## 6. Documentation

`docs/fr-cefr-mapping.md`:

- **B1 source verification note** — sibling PDF URL, HTTP 200, ~350KB, `pdftotext` line count (same method as A1/A2), next to the existing source paragraphs.
- **`## B1 descriptor extraction (#109)`** — four mapping tables (production / reception / interaction / cross-cutting+mediation) in A1/A2 format: source sub-activity | condensed B1 descriptor | repo mapping (node **or** gap + reason). Every PDF sub-activity gets a row — including `Pas` rows, strategy/meta rows, and documented non-modellable gaps — the audit trail for full expansion.
- **`## B1 nodes in the repo (EN→FR)`** — one row per B1 node (18 + new): `nodeId | Skill | Can-Do | ✅ Realised`, closing with `B1 Coverage: N/N nodes fully realised (100%).`
- Intro advances to "A1 + A2 + B1 complete; B2–C2 pending (#110–#112)"; the A1/A2 intro sentence's `#109–#112` range narrows to `#110–#112`. Verification section refreshes realisation total (559 → post-B1 count), warning ≤17, gate results, e2e evidence (B1 block + full 3-browser suite + manual walk); images note: "no images apply at B1 (no en-GB `imageUrl`)".
- New B1 nodes created under §3 get en-GB+fr-FR only (A2 precedent: validation passes; de/es/pt gain their realisations in their own level epics, not here).

## 7. Verification gates (all green before PR)

| Gate                         | Expectation                                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run validate:content`   | passes; warning baseline **stays 17** (new nodes land with both languages at once); fr-FR B1 at exact en-GB per-file parity                                       |
| `npm run typecheck` / `lint` | clean                                                                                                                                                             |
| `npm test`                   | thresholds hold (≥90%; no src code touched)                                                                                                                       |
| `npm run build`              | succeeds                                                                                                                                                          |
| `npm run test:e2e`           | full 3-browser suite green; new B1 tests GREEN, no regressions; axe-timeout flakes handled by isolated re-run with evidence (A1/A2 precedent)                     |
| Manual browser walk          | B1 lessons listed; pinned `B1-OPINION-001` pairs render; cleared review session opens `1 of 15`, reveal, grade → `2 of 15`, `srs:en-GB:fr-FR:forward:*` persisted |

## 8. Risks & handling

| Risk                                                                                            | Handling                                                                                                                                      |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Parity/seq drift between en-GB and fr-FR                                                        | per-file count match (7 or 8); seq mirroring; lesson-pin e2e; `validate:content`                                                              |
| en-GB stale Portuguese glosses misleading authoring                                             | mirror `term`/`example` concepts only                                                                                                         |
| Descriptor extraction incompleteness                                                            | full end-to-end read; every sub-activity tabulated in the mapping doc                                                                         |
| Uneven baseline vocab counts (7 vs 8)                                                           | parity is per-file against en-GB, never a hardcoded constant                                                                                  |
| Seed slice not B1-only                                                                          | seed A1 **and** A2 at +1y; assert every card ∈ `enB1Terms()`                                                                                  |
| Invalid new-node metadata                                                                       | Zod schema rejects at `validate:content`                                                                                                      |
| e2e flakiness under parallel load                                                               | isolated re-runs; evidence-based claims only                                                                                                  |
| Local `main` stale (ahead 3: Playwright installer + A2 spec/plan; behind 1: A2 merge `cc27872`) | sync `main` first (`git pull --rebase` — the 3 local commits touch disjoint files from the merge, no conflicts expected) **before** branching |

## 9. Delivery (NG7)

- Sync `main`, then worktree `.worktrees/feat-fr-FR-b1-content`, branch `feat/fr-FR-b1-content` off latest `main`.
- One Conventional Commit per batch (`content(fr-FR)`, `feat(cefr)`, `test(e2e)`, `docs`).
- RED e2e spec commit lands **before** content batches.
- Push (lefthook pre-push) + **one PR** `content(fr-FR): author full B1 inventory for en-GB↔fr-FR (#109)` using the AGENTS.md template with a Test plan section; explicit flag: **AI-authored language content — human pedagogical review required, no self-merge.**
- Done = issue AC met (B1 coverage table ✓ · `validate:content` ✓ · B1 review session e2e ✓) plus repo gates.

## 10. Out of scope

- B2–C2 French content (#110–#112).
- en-GB stale Portuguese gloss cleanup (pre-existing, noted only where encountered).
- New vocabulary images (none applicable at B1; sourcing policy unchanged in `docs/content-attribution.md`).
- Any `src/**/*.ts` / `src/**/*.astro` changes.
- Merging #108 (already landed as `cc27872` on origin) or reopening A1/A2 decisions.
- fr-FR **B1 grammar/exercise content** — this epic is vocabulary realisations + nodes + e2e + mapping doc, same scope as #107/#108.
