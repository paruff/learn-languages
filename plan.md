# Plan — Acquira (learn-languages)

> **What this file is:** the current, ordered sequence of work that moves `spec.md` requirements from ⬜ to ✅ in service of `intent.md`. It's short-horizon and rewritten freely.
> Each item names its spec IDs, its issue, and its **exit criterion** (evidence, not "merged").
> Task-level breakdowns go in `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` (writing-plans skill). This file only holds the sequence.
>
> Supersedes the phase list in issue #20 as the source of truth. #20 now links here.

**Last updated:** 2026-10-04

## Where we are

- The engineering side is ahead of the evidence. The review loop, SRS, interleaving, typed recall, calibration, reflection, exercises, and multi-language pairing are shipped and tested (spec §2, almost all ✅).
- Content runs A1–C2 for three target languages. Plan #20's sequencing rule 3 ("no A2–C2 or new-language content before #21 learner evidence") was **not followed**. That content is sunk cost now, so we keep it. The lesson is to stop adding more until the signal exists.
- **The gating risk is unchanged:** zero persona-matched learners have been observed (intent S1/S2). The only data point is one informal run by the owner, which found the 404 nav bug (#28, fixed).

## Done outside the gate (2026-10-04)

Launch-blocker fixes from the production audit, done ahead of the gate because they protect the Phase 1 learner sessions themselves: self-hosted font (S3), storage resilience (S7), offline use (Q7), progress backup (S5), in-app 404 (Q8), `npm audit` CI gate, CHANGELOG and v0.1.0. Delete this section once the PR has merged.

## Now: Phase 1, validate retention (blocks everything below)

| #   | Work                                                                                                                                       | Spec          | Issue   | Exit criterion                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------- | ------------------------------------------------------------------------------------- |
| 1.1 | Run 3–5 persona-matched learner sessions on `/en-GB/pt-PT/review/` following `docs/phase-1-learner-session-protocol.md`                    | Q6, intent S1 | #21     | Filled observation table posted on #21                                                |
| 1.2 | Day-2 follow-up with the same learners                                                                                                     | intent S2     | #21     | "Returned day 2?" column filled in                                                    |
| 1.3 | Fix whatever session-1 friction 1.1 finds, worst first                                                                                     | Q6            | new     | The friction no longer happens when the observed scenario is re-run in a real browser |
| 1.4 | Decide on the outcome: **positive** → Phase 2 as written; **negative** → rescope this plan around what broke; **unclear** → a larger round | —             | #21/#20 | A decision recorded in this file                                                      |

## Next: Phase 2, strengthen the loop for returners (only after 1.4 is positive)

Ordered by how directly each item serves intent §3 ("comes back"). 2.1 and 2.2 come from the learning-science gap review (`docs/learning-science-references.md`): cheap, and strongly evidenced.

| #   | Work                                                                                                      | Spec | Issue | Exit criterion                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------- | ---- | ----- | ----------------------------------------------------------------------------------------------------------- |
| 2.1 | Corrective support on "Again": show the example and translation (and any grammar note) before re-queueing | L10  | new   | E2E: an Again grade shows the example before the next card; learners in a Phase 1 follow-up round notice it |
| 2.2 | State the session's learning intention (Can-Do statements) at the start of review                         | L11  | new   | E2E: the review page lists the Can-Do statements for the due cards before the first card                    |
| 2.3 | Opt-in, privacy-preserving return measurement                                                             | S6   | new   | Week-2 return rate is observable without breaking S3                                                        |
| 2.4 | Grammar points in the retrieval loop (pilot: A1-INTRO-001 formality)                                      | L8   | #126  | One grammar point graded in a real review session with its own SRS state                                    |
| 2.5 | Soft prerequisites: author `prerequisiteNodes` for A1, then recommend unmastered prerequisites first      | L12  | new   | Progress's "next up" picks an unmastered prerequisite over a later node; nothing is locked                  |
| 2.6 | Regional TTS voice detection and fallback hardening                                                       | Q3   | —     | The correct voice is verified on iOS Safari and Android Chrome                                              |

## Later: Phase 3, breadth (only with S3/S4 trending toward target)

- fr-FR C1–C2 (#111, #112; #108 and #110 content has landed, so close those issues); A2/B1 images (#75); contributor tooling (#22)
- Any new language under Epic #39. It needs its own authoritative-source verification first (sequencing rule 4 in #20 still applies)

## Rules for this plan

1. Nothing in **Next** starts before 1.4 is recorded as positive. Nothing in **Later** starts before 2.3 produces data.
2. Feature work follows intent → spec → plan: (a) add or adjust the requirement ID in `spec.md`, (b) add or reorder its row here, (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2), (d) flip the spec status to ✅ in the same PR, with the evidence linked.
3. Bug fixes and small polish don't need a plan row. They still need a spec row if they change behaviour.
4. When an item is done, delete it from here. History lives in git, CHANGELOG, and the issues.
