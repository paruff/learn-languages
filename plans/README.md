# Master plan — Acquira (learn-languages)

> **The one place to see what's next.** Every open piece of work is a row here, in a goal, with its GitHub issue.
> Goals G1–G5 are mirrored as GitHub milestones, so `Issues → Milestones` shows the same picture with live status.
>
> Flow: [`intent.md`](../intent.md) (why) → [`spec.md`](../spec.md) (what the product must do) → **this file** (what's next, in what order) → issues and PRs (how).
> Detail plans for a single piece of work sit next to this file as `plans/YYYY-MM-DD-<topic>.md`. Finished ones move to [`plans/archive/`](archive/).

**Last updated:** 2026-10-22

## Decisions waiting on the owner

The only list of open questions for the owner. Each one says what changes depending on the answer.

| #   | Question                                                                                                                                                                                                                 | Why it matters  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| Q-2 | **Row 1.4, after the learner round:** positive → start G3; negative → rescope around what broke; unclear → a larger round. Not answerable yet: it needs rows 1.1–1.3 first. First learner data expected from 2026-10-23. | Gates G3 and G4 |

## Where we are

- Engineering is ahead of evidence: the review loop, SRS, interleaving, typed recall, calibration, exercises, multi-language pairing and tester-readiness fixes are shipped and tested (spec §2 and §4, almost all ✅).
- Content runs A1–C2 for pt-PT, es-ES, de-DE and fr-FR, and most of it-IT. That happened ahead of the learner gate; it's kept, but no more is added until G1 says the loop works (except owner exceptions below).
- **The gating risk is unchanged:** no persona-matched learner has been observed yet (intent S1, S2). The owner's own attempt to learn Portuguese got lost quickly, so the learner journey (#194) comes first.

## G1 Prove learners succeed (Phase 1) — **now**

Get real learners through the Portuguese loop, see them return, and find where they get lost. Gates G3 and G4. Intent §3, S1, S2, S7.

| #    | Work                                                                                                   | Spec          | Issue           | Exit criterion                                                   |
| ---- | ------------------------------------------------------------------------------------------------------ | ------------- | --------------- | ---------------------------------------------------------------- |
| 1.0  | Learner-journey UX/UI audit (done: `plans/2026-10-22-learner-journey-ux-audit.md`)                     | Q6, Q9        | #194            | Ranked findings in `plans/`, one issue per Critical/High, in G1  |
| 1.0b | Bugs found by the audit: broken listening exercise, empty credits page                                 | Q6, C7        | #209, #211      | Fixed with a test each                                           |
| 1.0c | Practise only what you've studied (lesson-scoped practice, daily new-word cap)                         | J2            | #207            | E2E: a fresh learner is never quizzed on unseen words            |
| 1.0d | One goal and one next step: ordered A1 path with Continue                                              | J1            | #208            | E2E: Continue walks a fresh learner through A1 in teaching order |
| 1.0e | Progress leads with the level goal as a Can-Do checklist                                               | J3            | #210            | E2E: Progress shows A1 Can-Dos first                             |
| 1.0f | Plain-language polish pass                                                                             | Q6            | #212            | The owner can follow the path without getting lost               |
| T1.2 | Run the device checklist (`docs/tester-readiness.md`) before each invitation wave                      | Q9            | #195            | A dated run in the checklist's log                               |
| 1.1  | Run 3–5 persona-matched learner sessions on en-GB→pt-PT (`docs/phase-1-learner-session-protocol.md`)   | Q6, intent S1 | #21             | Filled observation table posted on #21                           |
| 1.2  | Day-2 and day-7 follow-up with the same learners (they send the Progress → "Share how it went" report) | intent S2, M1 | #21             | "Returned day 2?" column filled in                               |
| 1.3  | Fix whatever session-1 friction 1.1 finds, worst first                                                 | Q6            | new per finding | The friction no longer happens when the observer reruns it       |
| 1.4  | Record the outcome (Q-2 above)                                                                         | —             | #21             | A decision written in this file                                  |

## G2 Correct content (concept-keyed) — **now, owner exception**

Every pair shows the right word with the right gloss. Bug and compliance work, allowed ahead of the G1 gate. Epic #148; detail plan [`2026-10-18-concept-keyed-vocabulary-and-images.md`](2026-10-18-concept-keyed-vocabulary-and-images.md).

| #   | Work                                                                                               | Spec   | Issue | Exit criterion                                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- | ------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D.2 | Re-align de-DE B1–C2 vocabulary to shared concepts (one PR per level: B1 in #203, then B2, C1, C2) | C3, C9 | #143  | `npm run report:coverage -- de-DE` shows 0 missing for the level; check against the Goethe-Institut B1–C2 Prüfungsziele recorded in `docs/de-cefr-mapping.md`; human review before merge |
| D.1 | Re-align es-ES B1–C2 with per-item PCIC review (replaces #142)                                     | C3, C9 | #185  | Same, for es-ES against PCIC                                                                                                                                                             |

Owner decision 2026-10-18, confirmed 2026-10-22: re-authoring es-ES and de-DE B1–C2 is an explicit exception to rule 1. It re-authors existing content and adds no new levels. de-DE goes first.

## G3 Strengthen the loop for returners (Phase 2) — **after row 1.4 is positive**

Ordered by how directly each serves intent §3 ("comes back").

| #   | Work                                                                                                  | Spec    | Issue      | Exit criterion                                                         |
| --- | ----------------------------------------------------------------------------------------------------- | ------- | ---------- | ---------------------------------------------------------------------- |
| 2.1 | Corrective support on "Again": example, translation and grammar note before re-queueing               | L10     | #196       | E2E: an Again grade shows the example before the next card             |
| 2.2 | State the session's learning intention (Can-Do statements) at the start of review                     | L11     | #197       | E2E: the review page lists the Can-Do statements before the first card |
| 2.3 | Week-2 return measurement beyond the manual report                                                    | S6      | #198       | Done #234: on-device flags in report (owner: enough)                   |
| 2.4 | Grammar points in the retrieval loop, with contrastive notes by source language                       | L8, L15 | #126, #144 | One grammar point graded in a real review session                      |
| 2.5 | Soft prerequisites for A1, recommended first                                                          | L12     | #199       | Progress "next up" picks an unmastered prerequisite                    |
| 2.6 | Regional TTS voice detection and fallback                                                             | Q3      | #200       | Correct voice verified on iOS Safari and Android Chrome                |
| 2.7 | Level checkpoint on unseen items, designed from round-one feedback                                    | L20     | #201       | Spec L20 designed and E2E-tested                                       |
| 2.8 | L1-grammar accelerator: contrastive modules, metalinguistic tasks, L1 diagnostic, rule-of-thumb notes | L16–L19 | #205       | Each requirement shipped with an E2E check, after 2.4 (L8, L15)        |

## G4 Breadth: more languages and levels (Phase 3) — **after S6 data trends to target**

Owner decision 2026-10-22: Italian (row 3.1) continues now as an exception to rule 1. It is written and verified the same way as the other languages: concept-keyed against the shared en-GB set, checked against its authoritative source (`docs/it-cefr-mapping.md`), and held by the coverage gate. The other G4 rows stay gated.

| #   | Work                                                            | Spec   | Issue      | Exit criterion                                 |
| --- | --------------------------------------------------------------- | ------ | ---------- | ---------------------------------------------- |
| 3.1 | Italian content (A2 to 30 nodes, C2) — **now, owner exception** | C4, C5 | #160, #166 | `docs/it-cefr-mapping.md` verified per level   |
| 3.2 | False-friend and cognate notes for non-English source pairs     | L14    | #147       | Notes shown on a non-English-source pair (E2E) |
| 3.3 | Calibration split for image vs non-image cards                  | L5     | #146       | Progress shows both rates; needs S6 data       |

## G5 Delivery and quality — **any time, small**

| #   | Work                                          | Spec | Issue | Exit criterion                                               |
| --- | --------------------------------------------- | ---- | ----- | ------------------------------------------------------------ |
| 5.1 | Post-deploy smoke tests against the live site | Q9   | #193  | `smoke-production` job passes on `main` against the live URL |

## Rules

1. Nothing in **G3** starts before row 1.4 is recorded as positive. Nothing in **G4** starts before retention measurement (S6) produces data. Exceptions are owner decisions, written in the goal they apply to.
2. Feature work follows intent → spec → plan: (a) add or change the requirement ID in `spec.md`; (b) add its row here with an issue and a milestone; (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2); (d) flip the spec status when its check passes.
3. Bug fixes and small polish don't need a row. They still need a spec row if they change behaviour.
4. When a row is done, delete it from here, close its issue, and move its detail plan to `plans/archive/`. History lives in git, CHANGELOG and the issues.
5. A question for the owner goes in **Decisions waiting on the owner**, nowhere else.

## Archive

[`plans/archive/`](archive/) holds finished detail plans and designs (A1–C1 Portuguese, French A1–B1, the 2026-10-22 UX audit). Their checkboxes were never ticked; the work is done and merged, so read them as history, not as to-do lists.
