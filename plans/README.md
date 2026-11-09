# Master plan — Acquira (learn-languages)

> **The one place to see the order of work.** Every open piece of work is a row here, in a goal, with its GitHub issue.
> Goals G1–G5 are GitHub milestones, each with a goal issue (label `plan`). **Status lives only on the Acquira project board** (AGENTS.md §12): this file says what and in what order, the board says where each item is.
>
> Flow: [`intent.md`](../intent.md) (why) → [`spec.md`](../spec.md) (what the product must do) → **this file** (what's next, in what order) → issues and PRs (how).
> Detail plans for a single piece of work sit next to this file as `plans/YYYY-MM-DD-<topic>.md`. Finished ones move to [`plans/archive/`](archive/).

**Last updated:** 2026-11-09

## Decisions waiting on the owner

Each is a GitHub issue labelled `question`, assigned to the owner, in _Needs human_ on the board (AGENTS.md §12.5). List them with AGENTS.md §12.3 command 2.

## Where we are

- Engineering is ahead of evidence: the review loop, SRS, interleaving, typed recall, calibration, exercises, multi-language pairing and tester-readiness fixes are shipped and tested (spec §2 and §4, almost all ✅).
- Content runs A1–C2 across all six languages, but not evenly: of 154 nodes, en-GB, fr-FR and it-IT have all 154 realisations, pt-PT has 124 (the gap is mostly B1), and es-ES and de-DE have 123. That happened ahead of the learner gate; it's kept, but no more is added until G1 says the loop works (except owner exceptions below).
- **The gating risk is unchanged:** no persona-matched learner has been observed yet (intent SIG1, SIG2). The owner's own attempt to learn Portuguese got lost quickly, so the learner journey (#194) comes first.
- **Evidence review (2026-10-23, [`docs/research/2026-10-23-sla-evidence-review-and-product-audit.md`](../docs/research/2026-10-23-sla-evidence-review-and-product-audit.md)):** the loop applies the strongest learning-science findings well, but only to single words. Of Nation's four strands, Acquira covers language-focused learning and almost none of meaning-focused input, output or fluency. The new rows below come from that review; D.3 was fixed in #242.

## G1 Prove learners succeed (Phase 1) — **now**

Get real learners through the Portuguese loop, see them return, and find where they get lost. Gates G3 and G4. Intent §3, SIG1, SIG2, SIG7.

| #    | Work                                                                                                                                                                                                                                            | Spec     | Issue           | Exit criterion                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| T1.2 | Run the device checklist (`docs/tester-readiness.md`) before each invitation wave (a wave is one batch of learners invited on the same day)                                                                                                     | Q9       | #195            | A dated run in the checklist's log                                                                   |
| 1.5  | Run and log the spec S8 iOS Safari device check (persistent storage is built and tested; only the dated device run is missing). Must be logged before the day-7 follow-ups in row 1.2                                                           | S8       | #241            | A dated iOS Safari run in `docs/tester-readiness.md`                                                 |
| 1.1  | Run 3–5 persona-matched learner sessions on en-GB→pt-PT, starting at the home page (not `/review/`) so the path measured by Q9 and SIG7 is the one tested. Recruitment, observer script and consent: `docs/phase-1-learner-session-protocol.md` | Q6, SIG1 | #21             | The protocol's observation table, with anonymised IDs (L1, L2…), posted on #21                       |
| 1.2  | Follow up each learner on day 2 and on day 7 (a window of ±1 day). The learner sends the Progress → "Share how it went" report by email, and the observer pastes it, anonymised, into the table                                                 | SIG2, M1 | #21             | The "Returned day 2?", "Returned day 7?" and "Report received?" columns are filled for every learner |
| 1.3  | Fix session-1 friction found in 1.1, worst first (severity: stopped the learner = 1, slowed them = 2, only mentioned = 3)                                                                                                                       | Q6       | new per finding | A new unaided run by a learner who did not take part in 1.1 gets past it                             |
| 1.4  | Record the outcome with the decision rule in the protocol: positive → start G3; negative → rescope; unclear → a larger round                                                                                                                    | —        | #266            | The owner's answer on #266, with its effect written in this file                                     |

## G2 Correct content (concept-keyed) — **now, owner exception**

Every pair shows the right word with the right gloss. Bug and compliance work, allowed ahead of the G1 gate. Epic #148; detail plan [`2026-10-18-concept-keyed-vocabulary-and-images.md`](2026-10-18-concept-keyed-vocabulary-and-images.md).

| #   | Work                                                                                                                                                                                                          | Spec   | Issue | Exit criterion                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D.2 | Re-align de-DE vocabulary to shared concepts. As of 2026-11-09 `report:coverage` shows C1 and C2 clear, B2 missing 2 nodes and B1 missing 17 nodes (concepts in existing nodes are aligned). One PR per level | C3, C9 | #143  | Per level: `npm run report:coverage -- de-DE <level>` exits 0 (it now fails on missing concepts **and** missing nodes); mapping doc names the human reviewer and date |
| D.1 | Re-align es-ES B1–C2 with per-item PCIC review (replaces #142). Same gaps today: B1 missing 17 nodes, B2 missing 2; C1 and C2 report clear but await PCIC review. Starts after D.2 B2 merges                  | C3, C9 | #185  | Same exit command for es-ES per level; reviewer and date recorded in `docs/es-cefr-mapping.md` against PCIC                                                           |

Owner decision 2026-10-18, confirmed 2026-10-22: re-authoring es-ES and de-DE B1–C2 is an explicit exception to rule 1. It re-authors existing content and adds no new levels. de-DE goes first.

## G3 Strengthen the loop for returners (Phase 2) — **after row 1.4 is positive**

Ordered by how directly each serves intent §3 ("comes back").

| #    | Work                                                                                                                            | Spec    | Issue      | Exit criterion                                                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.4  | Grammar points in the retrieval loop, with contrastive notes by source language                                                 | L8, L15 | #126, #144 | One grammar point graded in a real review session                                                                                                               |
| 2.6  | Verify regional TTS voices on devices (`pickVoice` and fallback in `src/lib/pronounce.ts` already ship)                         | Q3      | #200       | A dated device-checklist entry showing the pt-PT voice picked on iOS Safari and Android Chrome                                                                  |
| 2.7  | Redesign the level checkpoint from round-one feedback (first cut shipped in #201)                                               | L20b    | #268       | The owner's answer on #268 on what "I can do this" should feel like, then a redesign PR that links it                                                           |
| 2.8  | L1-grammar accelerator: contrastive modules, metalinguistic tasks, L1 diagnostic, rule-of-thumb notes. Depends on 2.4 (L8, L15) | L16–L19 | #205       | Each requirement shipped with an E2E check                                                                                                                      |
| 2.13 | FSRS scheduling instead of SM-2, with state migration (S11, L33)                                                                | L22     | #247       | A migration test from SM-2 state; `schedule()` stays at 100% coverage (add a per-file threshold in `vitest.config.ts`); M2 still computes from the migrated log |
| 2.14 | Listening cards: audio prompt, recall the meaning (reuse `recordedAudioPath` and `pickVoice`)                                   | L25     | #248       | E2E: no text before reveal; the direction is hidden on a pair with no recorded audio or regional voice                                                          |
| 2.15 | Optional placement check to start above A1                                                                                      | L27     | #249       | E2E: skippable; passing A1 items offers A2                                                                                                                      |
| 2.16 | Fluency round on mastered items                                                                                                 | L28     | #250       | E2E: only mastered items; SRS state unchanged                                                                                                                   |

Rows 2.13–2.16 come from the 2026-10-23 evidence review (ranked there by evidence × cost).

## G4 Breadth: more languages and levels (Phase 3) — **after S6 data trends to target**

Owner decision 2026-10-22: Italian (row 3.1) continues now as an exception to rule 1. It is written and verified the same way as the other languages: concept-keyed against the shared en-GB set, checked against its authoritative source (`docs/it-cefr-mapping.md`), and held by the coverage gate. The other G4 rows stay gated.

| #   | Work                                                                                                        | Spec   | Issue      | Exit criterion                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------- | ------ | ---------- | -------------------------------------------------------------------------------- |
| 3.1 | Italian content A1–C2 — **owner exception**                                                                 | C4, C5 | #160, #166 | `docs/it-cefr-mapping.md` has a named reviewer and date for every level          |
| 3.2 | False-friend and cognate notes for non-English source pairs                                                 | L14    | #147       | Notes shown on a non-English-source pair (E2E)                                   |
| 3.3 | Calibration split for image vs non-image cards. Needs S6 data                                               | L5     | #146       | Progress shows both rates                                                        |
| 3.4 | Graded reading built from studied words (meaning-focused input)                                             | L29    | #251       | One A1 pt-PT text, and a unit test that its share of studied words is computed   |
| 3.5 | Pronunciation perception training, several voices per contrast                                              | L30    | #252       | One pt-PT contrast set with E2E                                                  |
| 3.6 | Speak and compare: local self-recording, nothing stored or sent                                             | L31    | #253       | E2E: playback works, no network request                                          |
| 3.7 | Task cards for practising spoken Can-Dos with a person                                                      | L32    | #254       | Every A1 spoken node in pt-PT has a task card (E2E: card shown on a spoken node) |
| 3.8 | Vocabulary frequency report per language and level (tooling; model on `scripts/report-concept-coverage.ts`) | C10    | #255       | Report runs for pt-PT and es-ES                                                  |
| 3.9 | fr-FR C1: one word per node, fill to parity                                                                 | C5     | #256       | `npm run report:coverage -- fr-FR C1` shows parity with en-GB                    |

## G5 Delivery and quality — **any time, small**

| #   | Work                                                                                    | Spec | Issue | Exit criterion                                                             |
| --- | --------------------------------------------------------------------------------------- | ---- | ----- | -------------------------------------------------------------------------- |
| 5.1 | Show a "progress not saved" notice when an SRS or log write fails (DESIGN §6)           | S9   | #288  | Unit test with a throwing `localStorage`, and an E2E that shows the notice |
| 5.2 | Re-read card state before each grade so two tabs don't overwrite each other             | S10  | #289  | E2E with two pages grading the same card                                   |
| 5.3 | Item IDs immutable: `validate:content` compares IDs and terms with the last release tag | C12  | #290  | A test where a changed term under a shipped ID fails validation            |
| 5.4 | Sense tags in concept slugs, with a ser/estar fixture                                   | C13  | #291  | The fixture pairs correctly and `validate:content` passes                  |
| 5.5 | Local voices by default; network voices only after an opt-in with disclosure            | Q10  | #292  | Unit test of voice choice; E2E shows the opt-in                            |
| 5.6 | Resolve the language pair before first paint, with a no-JS fallback                     | Q11  | #293  | E2E with JavaScript disabled shows the default pair and plain pair links   |
| 5.7 | Precache the current level for offline use                                              | Q12  | #294  | E2E: an unvisited lesson opens offline                                     |

## Known platform limitations

What a static, serverless, zero-surveillance site (intent P3, P5) can't do, what it costs the learner, and how far we can mitigate it without changing the intent. Changing any of these needs an intent edit, not a plan row.

| #    | Limitation                                                                                                                                                                                                                                                                             | What it costs the learner (evidence)                                                                           | Mitigation within the intent                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| P-1  | **Storage can be evicted.** `localStorage` only; Safari deletes it after 7 days without interaction unless the site is on the home screen; private windows and "clear site data" wipe it; quota is a few MB.                                                                           | Lost progress = a likely lost learner (RK1, RK2)                                                               | `navigator.storage.persist()`, install hint and backup (S5, S8; shipped, device run is row 1.5), and the save-failure notice (S9, row 5.1) |
| P-2  | **No automated speaking feedback.** Browser speech recognition in Chrome sends audio to a server (breaks P3); Chrome's opt-in on-device mode is desktop-only, needs a language pack and is experimental; WASM speech models are tens of MB, against the Lighthouse budget (S5 signal). | No pronunciation scoring or spoken-answer checking, though pronunciation instruction works (Lee et al. 2015)   | Perception training (#252), local self-record and compare (#253), recorded model audio                                                     |
| P-3  | **No interlocutor.** No live conversation, tutor or peer (non-goal).                                                                                                                                                                                                                   | Interaction is one of the strongest SLA findings (Mackey & Goo 2007); speaking Can-Dos can't be practised here | Task cards that send the learner to a partner or real situation (#254); honest Can-Do wording (#201)                                       |
| P-4  | **No free-text assessment.** Open writing or speaking can't be marked without a model; an LLM API breaks P3/P5; on-device browser AI is Chrome-only and experimental.                                                                                                                  | Writing Can-Dos (30 nodes) get no feedback                                                                     | Constrained tasks with checkable answers (cloze #245, typed diff #246); revisit on-device AI if it becomes portable                        |
| P-5  | **No push reminders.** Web Push needs a push server; on iOS it works only for home-screen apps.                                                                                                                                                                                        | The app can't bring a learner back                                                                             | Learner-made plan and `.ics` calendar entry (#243). That is also the respectful option (intent §1)                                         |
| P-6  | **No aggregate data.** No server, so no cohort analytics, A/B tests or scheduler tuning across learners.                                                                                                                                                                               | Product decisions rest on small observed cohorts and learner-sent reports (M1)                                 | Observed sessions (#21), opt-in counter if the owner allows it (#236), on-device FSRS fitting later (#247)                                 |
| P-7  | **No cross-device state** (non-goal).                                                                                                                                                                                                                                                  | Phone and laptop progress diverge                                                                              | Backup and restore file (S5)                                                                                                               |
| P-8  | **Audio depends on the device.** TTS voices vary by OS, regional voices are often missing (Q3); only pt-PT has recorded audio. Recording every language, and multi-voice sets for perception training, costs content time and repo size (GitHub Pages: 1 GB site limit).               | Wrong or missing voice for some learners (persona Pedro)                                                       | Recorded audio per language (pt-PT: 694 clips, 8.5 MB, so all languages fit easily); #200                                                  |
| P-9  | **Offline only for visited pages** (runtime-cache service worker).                                                                                                                                                                                                                     | A lesson never opened online isn't available on the bus                                                        | Precache the current level (Q12, row 5.7)                                                                                                  |
| P-10 | **The Can-Do text is English only** (spec RK7). A learner whose source language isn't English still reads English Can-Dos.                                                                                                                                                             | Weakens the any-source promise (C4) for them                                                                   | State it. Localise `canDo` only if a non-English-source learner is observed                                                                |

## Rules

1. Nothing in **G3** starts before row 1.4 is recorded as positive. Nothing in **G4** starts before retention measurement (S6) produces data. Exceptions are owner decisions, written in the goal they apply to. On the board, a gated goal's issue is _Blocked_ and its items stay in _Backlog_.
2. Feature work follows intent → spec → plan: (a) add or change the requirement ID in `spec.md`; (b) add its row here with an issue and a milestone; (c) brainstorming → writing-plans → TDD → verification → review (AGENTS.md §2); (d) flip the spec status when its check passes.
3. Bug fixes and small polish don't need a row. They still need a spec row if they change behaviour.
4. When a row is done, delete it from here, close its issue, and move its detail plan to `plans/archive/`. History lives in git, CHANGELOG and the issues.
5. A question for the owner is a `question` issue (AGENTS.md §12.5), nowhere else. Its answer's effect is written here or in `spec.md` with a link to the issue.
6. Rows never carry status (no ✅, no "done"). Status is on the board.

## Archive

[`plans/archive/`](archive/) holds finished detail plans and designs (A1–C1 Portuguese, French A1–B1, the 2026-10-22 UX audit). Also `2026-10-24-lean-agents-md.md`. Their checkboxes were never ticked; the work is done and merged, so read them as history, not as to-do lists.

Research records (evidence reviews, with how they were verified and how objective they are) live permanently in [`docs/research/`](../docs/research/), not in the archive. Sources and their verification log: [`docs/learning-science-references.md`](../docs/learning-science-references.md).
