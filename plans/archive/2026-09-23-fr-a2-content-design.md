# Design: French (fr-FR) A2 Content — EN→FR (#108)

**Date:** 2026-09-23
**Issue:** Epic #108 — Author the A2 Can-Do inventory for en-GB↔fr-FR (playbook #49; part of #39 / #19 / Plan #20 Phase 5; depends on #107, merged as PR #131).
**Approach:** A1-parallel single epic (one branch/PR, phased batches) — same pattern validated by #56 (es), #63 (de), #107 (fr A1).

## 1. Goal & acceptance criteria

Deliver full A2 content for the en-GB→fr-FR pair and document coverage:

- `docs/fr-cefr-mapping.md` gains an **A2 coverage table** sourced from a verified descriptor extraction.
- `npm run validate:content` passes (warning baseline unchanged at **17**).
- A **full A2 fr-FR review session works end-to-end in a real browser** (e2e, all three browser projects).

Content-only change: no TypeScript/Astro source changes are expected outside the e2e spec edit.

## 2. Verified source

- **PDF:** [Descripteurs_A2.pdf](https://www.delfdalf.ch/fileadmin/user_upload/Unterlagen/Descripteurs/Descripteurs_A2.pdf) — sibling of the A1 document verified in #106, same redistribution family (Bureau DELF-DALF under license from France Éducation international). Verified free: HTTP 200, 347KB, no login/paywall.
- **Extraction:** `pdftotext -layout` → `/tmp/descripteurs-a2.txt` (418 lines; scratch, never committed). Structure identical in shape to A1: three top-level activity groups (Activités de production / réception / interaction et stratégies) with named sub-activities, plus cross-cutting Compétences sections. 4 rows marked `Pas de descripteur disponible` (gaps in the CEFR's own A2 scale).

## 3. Decision rule — full inventory expansion (user-approved, option 3)

Applied by end-to-end reading of the extracted A2 text against the **20 existing A2 `cefr-nodes/`**:

- **Reuse** any A2 node whose `canDo` substantively covers the descriptor (wording may differ).
- **Create** a new `A2-{SKILL}-{NNN}` node for every **uncovered descriptor worth modelling** — an assessable learner ability. This is a deliberately **lower bar than A1's** "clearly uncovered" filter; expect a handful of new nodes rather than A1's single `A1-WRITE-001`.
- **Document as gap** (never a node): the 4 `Pas de descripteur disponible` rows; strategy/meta statements that do not model an ability on their own; anything else out of scope — each with its reason in the mapping doc.

**Level discipline:** A2 descriptors map only against A2 nodes — never "covered" by an A1 node (wrong level for the coverage table). Substantial A1/A2 `canDo` duplication is noted as an observation; the A2 node is still created.

**New-node deliverables (the full trio):** `cefr-nodes` YAML + paired **en-GB** realisation + paired **fr-FR** realisation. en-GB is mandatory — it is the source side of the EN→FR pair.

**Node metadata conventions:** `nodeId` matches `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/` with the next-free sequence per skill; `canDo` in repo voice ("Can …"); `relatedNodes`/`prerequisiteNodes` set only where genuinely true; new-node files carry the uniform **7-item** A2 sequence.

## 4. Authoring

**Scope:** 20 existing A2 nodes × 7 items = 140 French items, plus all new nodes from §3. **No images** — no en-GB A2 file has an `imageUrl`; nothing to source or mirror.

**Batches — one commit each:**

| Batch | Nodes |
| --- | --- |
| 1 | `spoken_production` (9) + `writing` (1) |
| 2 | `listening` (3) + `spoken_interaction` (3) |
| 3 | `reading` (4) |
| 4 | New nodes' en-GB + fr-FR files (from §3) |

**Conventions (A1, unchanged):** `term` = French · `translation` = English gloss · `example` = French · `exampleTranslation` = English · `gender` = French · `culturalNotes` = France-specific where useful. Mirror source is the en-GB **`term`/`example` concepts at identical seq numbers**; where an en-GB `translation` holds stale German/Portuguese glosses (pre-existing, out of scope), ignore the gloss and mirror the concept. Natural A2-register French, not calques; noun–adjective agreement checked in every example.

## 5. e2e proof (RED first)

Extend `tests/e2e/review-fr.spec.ts` with an `fr-FR A2` describe block (single home for French-pair e2e; no second file):

1. **Session test** — seeded A2 cards → reveal/grade loop → session-complete summary (satisfies the AC's full-session requirement).
2. **Lesson parity test** — one pinned A2 node renders English prompts paired with aligned French answers (catches seq/parity drift like the A1 greeting test).

Both written **RED** before any content exists (empty session / 404), turned GREEN by the content batches. The exact parity-test node is pinned in the implementation plan.

## 6. Documentation

`docs/fr-cefr-mapping.md`:

- **A2 descriptor extraction section** — four mapping tables (production / reception / interaction / cross-cutting) in A1 format: source sub-activity | condensed A2 descriptor | repo mapping (node **or** gap + reason). Every PDF sub-activity gets a row — the audit trail for full expansion.
- **`## A2 nodes in the repo (EN→FR)`** — one row per A2 node (20 + new): `nodeId | Skill | Can-Do | ✅ Realised`, closing with `A2 Coverage: N/N nodes fully realised (100%).`
- Source paragraph records the A2 PDF's free-access verification; intro line advances to "A1 + A2 complete, B1–C2 pending"; verification totals refreshed; images note unchanged.

## 7. Verification gates (all green before PR)

| Gate | Expectation |
| --- | --- |
| `npm run validate:content` | passes; warning baseline **stays 17** (new nodes land with both languages at once) |
| `npm run typecheck` / `lint` | clean |
| `npm test` | 126/126; coverage thresholds hold |
| `npm run build` | succeeds |
| `npm run test:e2e` | full 3-browser suite **runnable locally** after the install-browsers spike (`79da765`); new A2 tests GREEN, no regressions; axe-timeout flakes handled by isolated re-run with evidence (A1 precedent) |

## 8. Risks & handling

| Risk | Handling |
| --- | --- |
| Parity/seq drift between en-GB and fr-FR | seq mirroring discipline; lesson-parity e2e test; `validate:content` |
| Descriptor extraction incompleteness | full end-to-end read; every sub-activity tabulated in the mapping doc |
| Stale en-GB DE/PT glosses misleading authoring | mirror `term`/`example` only |
| Invalid new-node metadata | Zod schema rejects at `validate:content` |
| e2e flakiness under parallel load | isolated re-runs; evidence-based claims only |

## 9. Delivery (NG7)

- Worktree `.worktrees/feat-fr-FR-a2-content`, branch `feat/fr-FR-a2-content` off latest `main`.
- One Conventional Commit per batch (`content(fr-FR)`, `feat(cefr)`, `test(e2e)`, `docs`).
- RED e2e spec commit lands **before** content batches.
- PR against #108 using the AGENTS.md template with a Test plan section; explicit flag: **AI-authored language content — human pedagogical review required, no self-merge.**
- Done = issue AC met (A2 coverage table ✓ · `validate:content` ✓ · A2 review session e2e ✓) plus repo gates.

## 10. Out of scope

- B1–C2 French content (#109–#112).
- en-GB stale German/Portuguese gloss cleanup (pre-existing, noted only where encountered).
- New vocabulary images (none applicable at A2; sourcing policy unchanged in `docs/content-attribution.md`).
- Any `src/**/*.ts` / `src/**/*.astro` changes beyond the e2e spec.
