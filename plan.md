# Plan — Acquira (learn-languages)

> **What this file is:** the current, ordered sequence of work that moves `spec.md` requirements from ⬜ to ✅ in service of `intent.md`. It's short-horizon and rewritten freely.
> Each item names its spec IDs, its issue, and its **exit criterion** (evidence, not "merged").
> Task-level breakdowns go in `docs/superpowers/plans/YYYY-MM-DD-<topic>.md` (writing-plans skill). This file only holds the sequence.
>
> Supersedes the phase list in issue #20 as the source of truth. #20 now links here.

**Last updated:** 2026-10-22

## Where we are

- The engineering side is ahead of the evidence. The review loop, SRS, interleaving, typed recall, calibration, reflection, exercises, and multi-language pairing are shipped and tested (spec §2, almost all ✅).
- Content runs A1–C2 for three target languages. Plan #20's sequencing rule 3 ("no A2–C2 or new-language content before #21 learner evidence") was **not followed**. That content is sunk cost now, so we keep it. The lesson is to stop adding more until the signal exists.
- **The gating risk is unchanged:** zero persona-matched learners have been observed (intent S1/S2). The only data point is one informal run by the owner, which found the 404 nav bug (#28, fixed).

## Done outside the gate (2026-10-04)

Launch-blocker fixes from the production audit, done ahead of the gate because they protect the Phase 1 learner sessions themselves: self-hosted font (S3), storage resilience (S7), offline use (Q7), progress backup (S5), in-app 404 (Q8), `npm audit` CI gate, CHANGELOG and v0.1.0. Delete this section once the PR has merged.

## Now (bug and compliance, plan rule 3)

Concept-keyed vocabulary and images, tracked in epic #148 (plan: `docs/superpowers/plans/2026-10-18-concept-keyed-vocabulary-and-images.md`). These are a bug and an attribution/compliance fix, so they proceed ahead of the Phase 1 gate.

| #   | Work                                                                    | Spec   | Issue | Exit criterion                                                                                          |
| --- | ----------------------------------------------------------------------- | ------ | ----- | ------------------------------------------------------------------------------------------------------- |
| B.0 | Phase 0: evidence base, spec and plan rows for concept-keyed content    | C3, C9 | #140  | Docs merged; `npx prettier --check docs spec.md plan.md` clean                                          |
| B.1 | Phase A: fix non-English-source vocabulary pairing by `concept`         | C3, C9 | #139  | `pairLoader` test shows every non-English-source pair pairing correctly; `validate:content` enforces C9 |
| B.2 | Phase B: images keyed by concept, with credits page and coverage report | C7     | #141  | Built site shows one attributed image per concept on every pair; coverage report posted on #141         |

### Phase D: re-author es-ES and de-DE B1–C2 vocabulary

Owner decision, 2026-10-18: re-author es-ES and de-DE B1–C2 vocabulary (#142, #143) so non-English-source pairs fill in above A2. This is an explicit, owner-approved exception to rule 1 and intent P2: it re-authors existing content and adds no new levels. It depends on Phase A (#139) and Phase B (#141, the coverage report).

| #   | Work                                         | Spec   | Issue | Exit criterion                                                         |
| --- | -------------------------------------------- | ------ | ----- | ---------------------------------------------------------------------- |
| D.1 | Re-align es-ES B1–C2 vocabulary by `concept` | C3, C9 | #142  | Coverage report (#141) shows es-ES B1–C2 pairs filled for every source |
| D.2 | Re-align de-DE B1–C2 vocabulary by `concept` | C3, C9 | #143  | Coverage report (#141) shows de-DE B1–C2 pairs filled for every source |

## Now: T0/T1, tester readiness (before inviting learners)

First outside feedback (2026-10-22) found a wrong-language start, browser auto-translate rewriting the target text, no sense of place, and a wrapping grade button. Full analysis and rationale: `docs/superpowers/plans/2026-10-22-ux-audit-and-learner-success.md`. Each row is test-first.

| #    | Work                                                                                                          | Spec   | Issue | Exit criterion                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------- | ------ | ----- | ------------------------------------------------------------------------ |
| T0.1 | Pair resolution: saved preference, else en-GB→pt-PT; home headline "Learn Portuguese with Science"            | U1     | new   | E2E: fresh visitor's Start lands on en-GB/pt-PT; saved es-ES is honoured |
| T0.2 | Translate guard and `lang` on target text, first-run hint                                                     | U2     | new   | E2E: `translate="no"`, target spans carry `lang`                         |
| T0.3 | Active nav state and lesson breadcrumb with Can-Do title                                                      | U3     | new   | E2E: `aria-current` on the right link on every section                   |
| T0.4 | Equal-width grade buttons                                                                                     | U4     | new   | Layout E2E at 320/375/1280 passes                                        |
| T0.5 | Footer feedback `mailto:`; pair selector with names and "I speak → I'm learning"                              | U5, U6 | new   | E2E                                                                      |
| T0.6 | Session report and retention panel                                                                            | M1, M2 | new   | Report has only allow-listed keys; retention panel shows on Progress     |
| T1.1 | Mobile Playwright projects, `first-run.spec.ts`, mobile Lighthouse profile with best-practices and SEO checks | Q9, Q5 | new   | CI green with the new projects                                           |
| T1.2 | `docs/tester-readiness.md` manual device checklist (iPhone Safari, Android Chrome with auto-translate on)     | Q9     | new   | Checklist run once, dated, before each invitation wave                   |

Ability checkpoint (L16) is deliberately **not** here: design it after round-one feedback.

## Now: Phase 1, validate retention (blocks everything below)

| #   | Work                                                                                                                                       | Spec          | Issue   | Exit criterion                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------- | ------------------------------------------------------------------------------------- |
| 1.1 | Run 3–5 persona-matched learner sessions on `/en-GB/pt-PT/review/` following `docs/phase-1-learner-session-protocol.md`                    | Q6, intent S1 | #21     | Filled observation table posted on #21                                                |
| 1.2 | Day-2 follow-up with the same learners                                                                                                     | intent S2     | #21     | "Returned day 2?" column filled in                                                    |
| 1.3 | Fix whatever session-1 friction 1.1 finds, worst first                                                                                     | Q6            | new     | The friction no longer happens when the observed scenario is re-run in a real browser |
| 1.4 | Decide on the outcome: **positive** → Phase 2 as written; **negative** → rescope this plan around what broke; **unclear** → a larger round | —             | #21/#20 | A decision recorded in this file                                                      |

## Next: Phase 2, strengthen the loop for returners (only after 1.4 is positive)

Ordered by how directly each item serves intent §3 ("comes back"). 2.1 and 2.2 come from the learning-science gap review (`docs/learning-science-references.md`): cheap, and strongly evidenced.

| #   | Work                                                                                                                                       | Spec    | Issue      | Exit criterion                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Corrective support on "Again": show the example and translation (and any grammar note) before re-queueing                                  | L10     | new        | E2E: an Again grade shows the example before the next card; learners in a Phase 1 follow-up round notice it                 |
| 2.2 | State the session's learning intention (Can-Do statements) at the start of review                                                          | L11     | new        | E2E: the review page lists the Can-Do statements for the due cards before the first card                                    |
| 2.3 | Opt-in, privacy-preserving return measurement                                                                                              | S6      | new        | Week-2 return rate is observable without breaking S3                                                                        |
| 2.4 | Grammar points in the retrieval loop (pilot: A1-INTRO-001 formality); grammar points may carry a contrastive note keyed by source language | L8, L15 | #126, #144 | One grammar point graded in a real review session with its own SRS state; a contrastive note shows for a non-English source |
| 2.5 | Soft prerequisites: author `prerequisiteNodes` for A1, then recommend unmastered prerequisites first                                       | L12     | new        | Progress's "next up" picks an unmastered prerequisite over a later node; nothing is locked                                  |
| 2.6 | Regional TTS voice detection and fallback hardening                                                                                        | Q3      | —          | The correct voice is verified on iOS Safari and Android Chrome                                                              |
| 2.7 | Opt-in picture-prompt cards (image only, produce the target term), after 2.1                                                               | L13     | #145       | E2E: an opted-in image card shows no text prompt and checks the typed or revealed target term                               |

## Later: Phase 3, breadth (only with S3/S4 trending toward target)

- fr-FR C1–C2 (#111, #112; #108 and #110 content has landed, so close those issues); A2/B1 images (#75, key by concept per #141); contributor tooling (#22)
- False-friend and cognate notes when the source language is not English (L14, #147), plus the image-vs-non-image calibration split for L13 (L5, #146; needs S6)
- Any new language under Epic #39. It needs its own authoritative-source verification first (sequencing rule 4 in #20 still applies)

## Rules for this plan

1. Nothing in **Next** starts before 1.4 is recorded as positive. Nothing in **Later** starts before 2.3 produces data.
2. Feature work follows intent → spec → plan: (a) add or adjust the requirement ID in `spec.md`, (b) add or reorder its row here, (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2), (d) flip the spec status to ✅ in the same PR, with the evidence linked.
3. Bug fixes and small polish don't need a plan row. They still need a spec row if they change behaviour.
4. When an item is done, delete it from here. History lives in git, CHANGELOG, and the issues.
