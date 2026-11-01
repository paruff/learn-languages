# Master plan — Acquira (learn-languages)

> **The one place to see the order of work.** Every open piece of work is a row here, in a goal, with its GitHub issue.
> Goals G1–G5 are GitHub milestones, each with a goal issue (label `plan`). **Status lives only on the Acquira project board** (AGENTS.md §12): this file says what and in what order, the board says where each item is.
>
> Flow: [`intent.md`](../intent.md) (why) → [`spec.md`](../spec.md) (what the product must do) → **this file** (what's next, in what order) → issues and PRs (how).
> Detail plans for a single piece of work sit next to this file as `plans/YYYY-MM-DD-<topic>.md`. Finished ones move to [`plans/archive/`](archive/).

**Last updated:** 2026-10-24

## Decisions waiting on the owner

Each is a GitHub issue labelled `question`, assigned to the owner, in _Needs human_ on the board (AGENTS.md §12.5). List them with AGENTS.md §12.3 command 2.

## Where we are

- Engineering is ahead of evidence: the review loop, SRS, interleaving, typed recall, calibration, exercises, multi-language pairing and tester-readiness fixes are shipped and tested (spec §2 and §4, almost all ✅).
- Content runs A1–C2 for pt-PT, es-ES, de-DE and fr-FR, and most of it-IT. That happened ahead of the learner gate; it's kept, but no more is added until G1 says the loop works (except owner exceptions below).
- **The gating risk is unchanged:** no persona-matched learner has been observed yet (intent S1, S2). The owner's own attempt to learn Portuguese got lost quickly, so the learner journey (#194) comes first.
- **Evidence review (2026-10-23, [`docs/research/2026-10-23-sla-evidence-review-and-product-audit.md`](../docs/research/2026-10-23-sla-evidence-review-and-product-audit.md)):** the loop applies the strongest learning-science findings well, but only to single words. Of Nation's four strands, Acquira covers language-focused learning and almost none of meaning-focused input, output or fluency. The new rows below come from that review; one is a bug worth fixing now (1.5; D.3 fixed in #242).

## G1 Prove learners succeed (Phase 1) — **now**

Get real learners through the Portuguese loop, see them return, and find where they get lost. Gates G3 and G4. Intent §3, S1, S2, S7.

| #    | Work                                                                                                   | Spec          | Issue           | Exit criterion                                             |
| ---- | ------------------------------------------------------------------------------------------------------ | ------------- | --------------- | ---------------------------------------------------------- |
| T1.2 | Run the device checklist (`docs/tester-readiness.md`) before each invitation wave                      | Q9            | #195            | A dated run in the checklist's log                         |
| 1.1  | Run 3–5 persona-matched learner sessions on en-GB→pt-PT (`docs/phase-1-learner-session-protocol.md`)   | Q6, intent S1 | #21             | Filled observation table posted on #21                     |
| 1.2  | Day-2 and day-7 follow-up with the same learners (they send the Progress → "Share how it went" report) | intent S2, M1 | #21             | "Returned day 2?" column filled in                         |
| 1.3  | Fix whatever session-1 friction 1.1 finds, worst first                                                 | Q6            | new per finding | The friction no longer happens when the observer reruns it |
| 1.4  | Record the outcome: positive → start G3; negative → rescope; unclear → a larger round                  | —             | #266            | The owner's answer, with its effect written in this file   |
| 1.5  | Ask for persistent storage so Safari's 7-day cap can't wipe progress before the day-7 follow-up        | S8            | #241            | Unit test + dated iOS Safari run in the device checklist   |

## G2 Correct content (concept-keyed) — **now, owner exception**

Every pair shows the right word with the right gloss. Bug and compliance work, allowed ahead of the G1 gate. Epic #148; detail plan [`2026-10-18-concept-keyed-vocabulary-and-images.md`](2026-10-18-concept-keyed-vocabulary-and-images.md).

| #   | Work                                                                                               | Spec   | Issue | Exit criterion                                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- | ------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D.2 | Re-align de-DE B1–C2 vocabulary to shared concepts (one PR per level: B1 in #203, then B2, C1, C2) | C3, C9 | #143  | `npm run report:coverage -- de-DE` shows 0 missing for the level; check against the Goethe-Institut B1–C2 Prüfungsziele recorded in `docs/de-cefr-mapping.md`; human review before merge |
| D.1 | Re-align es-ES B1–C2 with per-item PCIC review (replaces #142)                                     | C3, C9 | #185  | Same, for es-ES against PCIC                                                                                                                                                             |

Owner decision 2026-10-18, confirmed 2026-10-22: re-authoring es-ES and de-DE B1–C2 is an explicit exception to rule 1. It re-authors existing content and adds no new levels. de-DE goes first.

## G3 Strengthen the loop for returners (Phase 2) — **after row 1.4 is positive**

Ordered by how directly each serves intent §3 ("comes back").

| #    | Work                                                                                                  | Spec    | Issue      | Exit criterion                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------- | ------- | ---------- | ------------------------------------------------------------------------------ |
| 2.4  | Grammar points in the retrieval loop, with contrastive notes by source language                       | L8, L15 | #126, #144 | One grammar point graded in a real review session                              |
| 2.6  | Regional TTS voice detection and fallback                                                             | Q3      | #200       | Correct voice verified on iOS Safari and Android Chrome                        |
| 2.7  | Redesign the level checkpoint from round-one feedback (first cut shipped in #201)                     | L20     | #268       | The owner's answer on what "I can do this" should feel like, then the redesign |
| 2.8  | L1-grammar accelerator: contrastive modules, metalinguistic tasks, L1 diagnostic, rule-of-thumb notes | L16–L19 | #205       | Each requirement shipped with an E2E check, after 2.4 (L8, L15)                |
| 2.13 | FSRS scheduling instead of SM-2, with state migration                                                 | L22     | #247       | Migration test; 100% coverage kept; M2 still computes                          |
| 2.14 | Listening cards: audio prompt, recall the meaning                                                     | L25     | #248       | E2E: no text before reveal; off without audio                                  |
| 2.15 | Optional placement check to start above A1                                                            | L27     | #249       | E2E: skippable; passing A1 items offers A2                                     |
| 2.16 | Fluency round on mastered items                                                                       | L28     | #250       | E2E: only mastered items; SRS state unchanged                                  |

Rows 2.13–2.16 come from the 2026-10-23 evidence review (ranked there by evidence × cost).

## G4 Breadth: more languages and levels (Phase 3) — **after S6 data trends to target**

Owner decision 2026-10-22: Italian (row 3.1) continues now as an exception to rule 1. It is written and verified the same way as the other languages: concept-keyed against the shared en-GB set, checked against its authoritative source (`docs/it-cefr-mapping.md`), and held by the coverage gate. The other G4 rows stay gated.

| #   | Work                                                            | Spec   | Issue      | Exit criterion                                 |
| --- | --------------------------------------------------------------- | ------ | ---------- | ---------------------------------------------- |
| 3.1 | Italian content (A2 to 30 nodes, C2) — **now, owner exception** | C4, C5 | #160, #166 | `docs/it-cefr-mapping.md` verified per level   |
| 3.2 | False-friend and cognate notes for non-English source pairs     | L14    | #147       | Notes shown on a non-English-source pair (E2E) |
| 3.3 | Calibration split for image vs non-image cards                  | L5     | #146       | Progress shows both rates; needs S6 data       |
| 3.4 | Graded reading built from studied words (meaning-focused input) | L29    | #251       | One A1 pt-PT text with a coverage check        |
| 3.5 | Pronunciation perception training, several voices per contrast  | L30    | #252       | One pt-PT contrast set with E2E                |
| 3.6 | Speak and compare: local self-recording, nothing stored or sent | L31    | #253       | E2E: playback works, no network request        |
| 3.7 | Task cards for practising spoken Can-Dos with a person          | L32    | #254       | A1 spoken nodes in one language                |
| 3.8 | Vocabulary frequency report per language and level (tooling)    | C10    | #255       | Report runs for pt-PT and es-ES                |
| 3.9 | fr-FR and it-IT C1: one word per node, fill to parity           | C5     | #256       | `report:coverage` parity for C1                |

## G5 Delivery and quality — **any time, small**

| #   | Work                                                                | Spec | Issue | Exit criterion                                                                                |
| --- | ------------------------------------------------------------------- | ---- | ----- | --------------------------------------------------------------------------------------------- |
| 5.3 | Trim AGENTS.md to what agents act on; enforce the 90% coverage gate | —    | #275  | ~200 lines, no broken `AGENTS.md §` links, every command and path exists; CI gate 90/80/90/90 |

## Known platform limitations

What a static, serverless, zero-surveillance site (intent P3, P5) can't do, what it costs the learner, and how far we can mitigate it without changing the intent. Changing any of these needs an intent edit, not a plan row.

| #   | Limitation                                                                                                                                                                                                                                                                             | What it costs the learner (evidence)                                                                           | Mitigation within the intent                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| P-1 | **Storage can be evicted.** `localStorage` only; Safari deletes it after 7 days without interaction unless the site is on the home screen; private windows and "clear site data" wipe it; quota is a few MB.                                                                           | Lost progress = a likely lost learner (R3)                                                                     | `navigator.storage.persist()`, install hint, backup (S5, S8, #241)                                                  |
| P-2 | **No automated speaking feedback.** Browser speech recognition in Chrome sends audio to a server (breaks P3); Chrome's opt-in on-device mode is desktop-only, needs a language pack and is experimental; WASM speech models are tens of MB, against the Lighthouse budget (S5 signal). | No pronunciation scoring or spoken-answer checking, though pronunciation instruction works (Lee et al. 2015)   | Perception training (#252), local self-record and compare (#253), recorded model audio                              |
| P-3 | **No interlocutor.** No live conversation, tutor or peer (non-goal).                                                                                                                                                                                                                   | Interaction is one of the strongest SLA findings (Mackey & Goo 2007); speaking Can-Dos can't be practised here | Task cards that send the learner to a partner or real situation (#254); honest Can-Do wording (#201)                |
| P-4 | **No free-text assessment.** Open writing or speaking can't be marked without a model; an LLM API breaks P3/P5; on-device browser AI is Chrome-only and experimental.                                                                                                                  | Writing Can-Dos (30 nodes) get no feedback                                                                     | Constrained tasks with checkable answers (cloze #245, typed diff #246); revisit on-device AI if it becomes portable |
| P-5 | **No push reminders.** Web Push needs a push server; on iOS it works only for home-screen apps.                                                                                                                                                                                        | The app can't bring a learner back                                                                             | Learner-made plan and `.ics` calendar entry (#243). That is also the respectful option (intent §1)                  |
| P-6 | **No aggregate data.** No server, so no cohort analytics, A/B tests or scheduler tuning across learners.                                                                                                                                                                               | Product decisions rest on small observed cohorts and learner-sent reports (M1)                                 | Observed sessions (#21), opt-in counter if the owner allows it (#236), on-device FSRS fitting later (#247)          |
| P-7 | **No cross-device state** (non-goal).                                                                                                                                                                                                                                                  | Phone and laptop progress diverge                                                                              | Backup and restore file (S5)                                                                                        |
| P-8 | **Audio depends on the device.** TTS voices vary by OS, regional voices are often missing (Q3); only pt-PT has recorded audio. Recording every language, and multi-voice sets for perception training, costs content time and repo size (GitHub Pages: 1 GB site limit).               | Wrong or missing voice for some learners (persona Pedro)                                                       | Recorded audio per language (pt-PT: 694 clips, 8.5 MB, so all languages fit easily); #200                           |
| P-9 | **Offline only for visited pages** (runtime-cache service worker).                                                                                                                                                                                                                     | A lesson never opened online isn't available on the bus                                                        | Precache the current level when needed (review finding A11)                                                         |

## Rules

1. Nothing in **G3** starts before row 1.4 is recorded as positive. Nothing in **G4** starts before retention measurement (S6) produces data. Exceptions are owner decisions, written in the goal they apply to. On the board, a gated goal's issue is _Blocked_ and its items stay in _Backlog_.
2. Feature work follows intent → spec → plan: (a) add or change the requirement ID in `spec.md`; (b) add its row here with an issue and a milestone; (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2); (d) flip the spec status when its check passes.
3. Bug fixes and small polish don't need a row. They still need a spec row if they change behaviour.
4. When a row is done, delete it from here, close its issue, and move its detail plan to `plans/archive/`. History lives in git, CHANGELOG and the issues.
5. A question for the owner is a `question` issue (AGENTS.md §12.5), nowhere else. Its answer's effect is written here or in `spec.md` with a link to the issue.
6. Rows never carry status (no ✅, no "done"). Status is on the board.

## Archive

[`plans/archive/`](archive/) holds finished detail plans and designs (A1–C1 Portuguese, French A1–B1, the 2026-10-22 UX audit). Their checkboxes were never ticked; the work is done and merged, so read them as history, not as to-do lists.

Research records (evidence reviews, with how they were verified and how objective they are) live permanently in [`docs/research/`](../docs/research/), not in the archive. Sources and their verification log: [`docs/learning-science-references.md`](../docs/learning-science-references.md).
