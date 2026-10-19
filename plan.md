# Plan — Acquira (learn-languages)

> **What this file is:** the current, ordered sequence of work that moves `spec.md` requirements from ⬜ to ✅ in service of `intent.md`. It's short-horizon and rewritten freely.
> Each item names its spec IDs, its issue, and its **exit criterion** (evidence, not "merged").
> Task-level breakdowns go in `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` (writing-plans skill). This file only holds the sequence.
>
> Supersedes the phase list in issue #20 as the source of truth. #20 now links here.

**Last updated:** 2026-10-19

## Where we are

- The core learning loop is shipped and tested: retrieval, spacing, interleaving, typed recall, calibration, reflection and exercises (spec §2 mostly ✅).
- Coverage reality: pt-PT/es-ES/de-DE are A1–C2, fr-FR is A1–B2, and every supported language works as source or target (spec C4/C5).
- **Primary gate remains #21**: no major net-new content expansion should start before real learner retention evidence (intent S1/S2).

## Now: alignment + issue hygiene + retention gate

| #   | Work                                                                                                                              | Spec                 | Issue           | Exit criterion                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| N.1 | Align product docs/spec with shipped reality and add L1-grammar accelerator requirements + evidence mapping                       | C4, C5, L16–L19      | this PR         | `spec.md`, `plan.md`, `README.md`, and `docs/learning-science-references.md` are internally consistent          |
| N.2 | Issue hygiene pass: close stale completed issues, align language epic status, and wire active research-feature issues to spec IDs | C5, L8, L13–L15, L17 | #39, #108, #110 | Issue state matches shipped code/content and every active research issue cites the requirement IDs it satisfies |
| N.3 | Run 3–5 persona-matched learner sessions on `/en-GB/pt-PT/review/` and day-2 follow-up                                            | Q6, intent S1/S2     | #21             | Filled observation table and day-2 follow-up evidence posted on #21                                             |
| N.4 | Fix highest-friction session-1 blockers found in N.3                                                                              | Q6                   | new             | Reproduced friction no longer occurs in a real browser walkthrough                                              |
| N.5 | Decide gate outcome for #21 and record it (positive / negative / unclear)                                                         | —                    | #21, #20        | Decision recorded in this file and reflected in issue sequencing comments                                       |

## Next: Phase 2 — L1 grammar as an accelerator (only after N.5 is positive)

| #   | Work                                                                                                     | Spec     | Issue | Exit criterion                                                                                    |
| --- | -------------------------------------------------------------------------------------------------------- | -------- | ----- | ------------------------------------------------------------------------------------------------- |
| 2.1 | Corrective support on "Again": show example + translation + relevant grammar support before re-queueing  | L10      | new   | E2E confirms corrective support appears before next card                                          |
| 2.2 | State the session learning intention (Can-Do statements) before first card                               | L11      | new   | E2E confirms due-card Can-Do statements are shown at review start                                 |
| 2.3 | Grammar points in retrieval loop (pilot on A1-INTRO-001)                                                 | L8       | #126  | One grammar point is graded in a live review session with its own SRS state                       |
| 2.4 | Contrastive grammar modules by source→target pair                                                        | L16, L15 | new   | One pair-specific contrastive module is shipped and validated in browser                          |
| 2.5 | Metalinguistic analysis tasks (error explanation/comparison prompts)                                     | L17      | new   | At least one analysis task type is live and scored in lessons/review with tests                   |
| 2.6 | Optional L1 grammar diagnostic with recommendations into contrastive modules                             | L18      | new   | Diagnostic runs end-to-end and produces recommendation links without breaking privacy constraints |
| 2.7 | Rule-of-thumb support notes tied to L1→L2 interference patterns, shown in lessons and corrective support | L19      | new   | One verified interference pattern per active pair is shown where relevant and covered by tests    |
| 2.8 | Opt-in picture-prompt cards (after corrective support)                                                   | L13      | #145  | E2E confirms image-only front in picture mode with correct answer checking                        |
| 2.9 | Opt-in privacy-preserving return measurement                                                             | S6       | new   | Week-2 return trend is observable without violating S3                                            |

## Later: breadth and expansion (only after retention + Phase 2 signals)

- fr-FR C1–C2 (#111, #112), with priority held behind #21 unless retention and demand justify advanced-level spend.
- Italian expansion under #39 (decision/source verification + 5-node skeleton, then gated A1–C2).
- False-friend/cognate notes (#147, L14) and calibration split for image vs non-image cards (#146, L5 extension), gated by S6.
- Residual image sourcing work (#75) and contributor workflow scaling (#22).

## Rules for this plan

1. Nothing in **Next** starts before N.5 is recorded as positive. Nothing in **Later** starts before retention measurement exists (S6).
2. Feature work follows intent → spec → plan: (a) add or adjust the requirement ID in `spec.md`, (b) add or reorder its row here, (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2), (d) flip the spec status to ✅ in the same PR, with the evidence linked.
3. Bug fixes and small polish don't need a plan row. They still need a spec row if they change behaviour.
4. When an item is done, delete it from here. History lives in git, CHANGELOG, and the issues.
