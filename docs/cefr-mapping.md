# CEFR Mapping — A1 Inventory

Tracks the CEFR A1 Can-Do statement inventory against `cefr-nodes` and `realisations` content, per `specification-design.md` §5.3 (CEFR Mapping Process) and issue #5.

**Source:** Referencial Camões PLE (authoritative Portuguese RLD). Extraction from that document requires access to it directly — this file tracks what has been extracted into the repo so far, not a full inventory of the source document itself. Whoever has access to Referencial Camões should extend the "Not yet extracted" section below as they work through it.

## Status legend

| Status | Meaning |
|---|---|
| ✅ Realised | Node exists in `cefr-nodes/`, paired en-GB/pt-PT realisations exist in `realisations/` |
| 🟡 Node only | Node exists in `cefr-nodes/`, no realisations yet |
| ⬜ Not started | Identified but no node file yet |

## A1 nodes in the repo

| nodeId | Skill | Can-Do | Status |
|---|---|---|---|
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001 | reading | Can recognize and write numbers 1-100 | ✅ Realised |
| A1-FOOD-001 | reading | Can identify common food and drink items | 🟡 Node only |

Coverage: 5/6 nodes fully realised (83%), 1/6 node-only.

## Not yet extracted from Referencial Camões

The nodes above cover only greetings, introductions, and numbers — a slice big enough to prove the pairing abstraction (#21) and small enough not to front-load content work ahead of learner validation (see #20 Plan, Phase 1 vs Phase 2 sequencing).

Skills and topic areas Referencial Camões A1 is known to cover that have no node yet (from `relatedNodes`/`prerequisiteNodes` references already present in the repo, e.g. `A1-FAMILY-001`, `A1-SHOP-001` referenced by A1-INTRO-002 and A1-FOOD-001 respectively):

- [ ] Family and relationships (A1-FAMILY-001+)
- [ ] Shopping and prices (A1-SHOP-001+)
- [ ] Time, days, dates
- [ ] Directions and locations
- [ ] Daily routine
- [ ] Weather
- [ ] Listening skill nodes (all nodes above are spoken_interaction/reading — no listening or spoken_production nodes exist yet, and the CEFR node schema requires covering all 5 skills for genuine A1 completeness)

Extracting these requires direct access to Referencial Camões PLE — flagging here rather than inventing content, per AGENTS.md §10 (`content` PRs need pedagogical review) and spec NG7 (no unreviewed AI-generated content).

## Process for adding a node

1. Identify the Can-Do statement in Referencial Camões.
2. Add a row to the table above as "Not started".
3. Create the `cefr-nodes/` YAML file (see #3) — row becomes "🟡 Node only".
4. Author paired `en-GB`/`pt-PT` realisations (see #4, #7) — row becomes "✅ Realised".
