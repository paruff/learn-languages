# Planning audit — 2026-11-12

Phase 1 of 3 (audit, read-only). Audited at `main` = `306f81b`.

**Read:** `intent.md`, `spec.md` (v1.7), `plans/README.md`, the three open detail plans, `AGENTS.md`, `REVIEW.md`, `DESIGN.md`, `discovery-brief.md`, `specification-design.md`, `docs/learning-science-references.md`, `docs/phase-1-learner-session-protocol.md`, `docs/tester-readiness.md`, `CHANGELOG.md`; all 32 open issues, the 109 closed ones (state and milestone), the 5 milestones, open PRs (none).

**Not read, and why:**

- **The Acquira project board.** GitHub Projects needs GraphQL, which this session cannot call (`gh project list` → "unknown owner type"; GraphQL → HTTP 403). Every statement below about "gated" or "open" comes from the goal issues' **Gate** line and the milestone descriptions, not from the board's Status column. Board Status is UNVERIFIED throughout.
- **Citations online.** `api.crossref.org` is not reachable from this environment, so no reference was checked against a primary source today (finding 11).

Commands run for evidence: `npm run report:coverage -- <lang> <level>`, `npm run check:coverage`, file counts under `src/content/`, `git ls-remote --tags origin`.

## Summary

| #   | Finding                                                                                          | Impact |
| --- | ------------------------------------------------------------------------------------------------ | ------ |
| 1   | G1's exit is broken: #266 is closed with no verdict, and no learner evidence exists              | High   |
| 2   | The G3 gate is not holding, and its one owner exception is not written where Rule 1 says         | High   |
| 3   | The G4 gate is stated two ways and its target cannot be measured as written                      | High   |
| 4   | The whole critical path is human-only work; nothing on it can go to a cheaper model              | High   |
| 5   | Stale plan rows: done work still listed, closed issues cited, old counts                         | Medium |
| 6   | Stale or wrong spec rows (L13, C5, RK8, M2, L23b, header)                                        | Medium |
| 7   | Content gaps with no plan row or issue: pt-PT (28 nodes), de-DE and es-ES A1–A2 (12 nodes each)  | Medium |
| 8   | No next release is defined; no git tag exists, so spec C12 does not run as written               | Medium |
| 9   | Traceability orphans in both directions                                                          | Medium |
| 10  | GitHub metadata is stale: old signal IDs, a dead row number, wrong titles, Copilot on gated work | Low    |
| 11  | Evidence: citations are listed and mostly logged as verified; some claims have no source         | Low    |
| 12  | `specification-design.md` and `discovery-brief.md` are superseded; archive both                  | Low    |
| 13  | Exit criteria: mostly testable; five rows are vague                                              | Low    |
| 14  | Scope: what to cut, merge or defer                                                               | —      |

## 1. G1's exit is broken (High)

**Evidence**

- `plans/README.md:33` row 1.4: exit is "The owner's answer on #266, with its effect written in this file".
- #266 is **closed** (2026-11-09, reason "completed") with no verdict. GitHub lists PR #296 as the closing PR, so a `Closes #266` keyword probably closed it by accident; I did not open the PR body to confirm that. Its only comment (2026-11-09) says: "Closed on 2026-11-09 with no verdict written, so plan row 1.4 can't be recorded and G1 (#269) can't close."
- #21 has no observation table. Its last comment is the 2026-10-22 plan audit.
- `docs/tester-readiness.md:29-31`: the run log is an empty table, so row T1.2 (#195) and row 1.5 have never been run.
- #266's body says "first learner data expected from 2026-10-23". That date passed 20 days ago.
- Goal issue #269: "**Exit.** Plan row 1.4 recorded: …/issues/266", which points at a closed issue.

Since the gate was set up on 2026-10-24, no G1 row has produced evidence, while PRs #295–#306 shipped engineering and content.

**Proposed fix**

- Reopen #266 (Phase 3), or open a new decision issue and point row 1.4 and #269 at it.
- Needs your answer (question 1 below): were any learner sessions run?

## 2. The G3 gate is not holding (High)

**Evidence**

- `plans/README.md:102` Rule 1: "Nothing in **G3** starts before row 1.4 is recorded as positive… Exceptions are owner decisions, written in the goal they apply to."
- G3 milestone issues closed while row 1.4 was unrecorded: #201 (L20a), #244 (L23), #245 (L24), #246 (L26), all 2026-10-23/24, and #247 (L22 FSRS, 2026-11-12, PR #305).
- The FSRS exception exists only in the detail plan: `plans/2026-11-12-fsrs-scheduler.md:3` "Started on the owner's instruction while G3 is gated (plans Rule 1)." The G3 section (`plans/README.md:46-61`) has no exception text, unlike G2 (`:44`) and G4 (`:65`).
- Gated issues carry `Copilot` as assignee: #126, #144 (G3), #146, #147 (G4). AGENTS.md §12.6 says to assign Copilot only after moving the issue to _In progress_; Rule 1 says gated items stay in _Backlog_.

**Proposed fix**

- Add the FSRS owner exception to the G3 section, dated, as Rule 1 requires.
- Unassign Copilot from #126, #144, #146, #147 (Phase 3).
- Your call (question 2): keep Rule 1 as a hard rule, or reword it to what is practised ("G3 work needs a written owner exception").

## 3. The G4 gate is stated two ways and cannot be measured as written (High)

**Evidence: two wordings**

- "produces data": `plans/README.md:102` ("before retention measurement (S6) produces data") and goal issue #272.
- "trends to target": `plans/README.md:63` heading ("after S6 data trends to target") and the G4 milestone description.

**Evidence: the target is not measurable**

- The only numeric target is `intent.md:43` SIG3 "40% week-2 return rate".
- `spec.md:103` S6b: the measurement "says nothing about learners who never return (RK3). Do not read it as a population rate".
- `intent.md:54` P3: "return data covers only the observed cohort".
- So a 40% rate can only ever be read off the 3–5 observed learners of row 1.2. With n = 5, "40%" is 2 people.
- `src/lib/gradeLog.ts:107` defines `week2` as a graded card 7–13 days after the first. Row 1.2's day-7 follow-up therefore already yields the only S6 data the product can get. Under the "produces data" wording, G4 opens the moment row 1.2 is filled; under "trends to target", it has no defined test.
- "S6" itself no longer exists; it was split into S6a and S6b (`spec.md:102-103`).

**Proposed fix**

Pick one wording (question 3) and write it once, in Rule 1, with the heading, #272 and the milestone description copying it. My recommendation: "G4 opens when row 1.4 is recorded positive **and** at least 2 of the observed learners have a `week2` return in their report (S6a)". That is testable with the cohort you will actually have.

## 4. The critical path is human-only (High)

Every open exit criterion on the "now" goals needs the owner, a device or a native-speaker reviewer:

| Row              | What is left                                                | Who can do it      |
| ---------------- | ----------------------------------------------------------- | ------------------ |
| T1.2, 1.5 (#195) | A dated device run on iPhone Safari and Android Chrome      | Owner with devices |
| 1.1, 1.2 (#21)   | Recruit, observe and follow up 3–5 learners                 | Owner              |
| 1.4 (#266)       | The verdict                                                 | Owner              |
| D.2 (#143)       | Named native-speaker review; authoring is done              | Human reviewer     |
| D.1 (#185)       | PCIC review per level; authoring is done; 83 items queued   | Human reviewer     |
| 3.1 (#160)       | Named reviewer and date per level; it-IT content has 0 gaps | Human reviewer     |
| #298, #307, #267 | Owner decisions                                             | Owner              |

**Evidence**

- `npm run report:coverage` exits 0 for de-DE and es-ES at B1, B2, C1 and C2, and for it-IT C1. The command half of the D.1, D.2 and 3.1 exits is already met.
- `docs/de-cefr-mapping.md:128` and `docs/es-cefr-mapping.md:160`: "Reviewer and date: _pending_". `docs/it-cefr-mapping.md` has no reviewer record (no match for "reviewer").
- #298 ("who reviews content for each language?") has no answer, and `REVIEW.md:65` says "An agent can't approve content."

So the plan is not short of agent capacity. It is waiting on about a day of owner device work, a recruiting effort, and reviewers who have not been named. More agent work on G3 or G4 does not shorten it.

**Work that can go to a cheaper model** (small, checkable, none on the critical path): the doc fixes in findings 5, 6 and 10; the spot-check test still unwritten from #185's acceptance criteria; adding pt-PT to the coverage report (finding 7).

**Proposed fix:** say this in "Where we are", and answer #298 first, because it unblocks three rows at once.

## 5. Stale plan rows (Medium)

| Where (`plans/README.md`) | Stale text                                                                               | Evidence                                                                                                    | Fix                                       |
| ------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `:56` row 2.13            | FSRS listed as open work                                                                 | #247 closed 2026-11-12, PR #305; `spec.md:60` L22 ✅; `vitest.config.ts:36` has the per-file threshold      | Delete the row (Rule 4)                   |
| `:61`                     | "Rows 2.13–2.16 come from…"                                                              | Follows from the above                                                                                      | "Rows 2.14–2.16"                          |
| `:94` P-6                 | "on-device FSRS fitting later (#247)"                                                    | #247 is closed; fitting was "Not built" (`plans/2026-11-12-fsrs-scheduler.md`, Decisions)                   | Drop the issue number or open a new issue |
| `plans/`                  | `2026-11-12-fsrs-scheduler.md` is still beside the README                                | Rule 4 (`:105`)                                                                                             | Move to `plans/archive/`                  |
| `:29` row 1.5             | Cites #241                                                                               | #241 closed 2026-11-01. The S8 device step is already in the T1.2 checklist (`docs/tester-readiness.md:12`) | Merge row 1.5 into T1.2 (#195)            |
| `:33` row 1.4             | Cites #266                                                                               | Closed, no verdict (finding 1)                                                                              | Reopen or replace                         |
| `:69` row 3.1             | Cites "#160, #166"                                                                       | #166 closed 2026-11-01                                                                                      | Cite #160 only                            |
| `:18`                     | "es-ES and de-DE have 123"                                                               | Each has 142 files in `src/content/realisations/`; PR #303 added 19                                         | "142"                                     |
| `:18`                     | pt-PT gap "is mostly B1"                                                                 | Missing nodes: B1 17, A2 10, A1 1 (`report:coverage`)                                                       | State the three numbers                   |
| `:41-42` rows D.2, D.1    | Rows carry status ("Authored 2026-11-09… waiting only on…")                              | Rule 6 (`:107`): "Rows never carry status"                                                                  | Remove the status sentences               |
| `:42` row D.1             | "Starts after D.2 B2 merges"                                                             | Both were authored in PR #303                                                                               | Remove                                    |
| `:81` G5                  | "No open rows"                                                                           | #292 is open in the G5 milestone (and is done: finding 9)                                                   | Close #292                                |
| `:90` P-2                 | "(S5 signal)"                                                                            | Signals are `SIG<n>` (`intent.md:37`)                                                                       | "SIG5"                                    |
| `:9`                      | "Last updated: 2026-11-09"                                                               | —                                                                                                           | Update when Phase 2 lands                 |
| `:111` Archive            | Does not mention the critic-review ledger, whose own header says to archive it when done | `plans/2026-11-09-critic-review-disposition.md:3`; its one open item is #298                                | Leave until #298 closes                   |

## 6. Stale or wrong spec rows (Medium)

| Where (`spec.md`) | Text                                                                                   | Contradicted by                                                                                                                                                             | Fix                                     |
| ----------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `:50` L13         | Status ⬜, verified by "— (#145)"                                                      | #145 closed "completed" 2026-10-19; `review.astro:722` implements picture mode; `tests/e2e/review.spec.ts:268` tests it; epic #148 lists it as completed                    | ✅, name the test                       |
| `:189` §7         | "L13 → #145" as an open design question                                                | Same                                                                                                                                                                        | Remove L13 from the list                |
| `:23` C5          | "es-ES shared-concept coverage above A2 is reverted pending per-item PCIC review"      | `report:coverage -- es-ES B1…C2` exits 0; `CHANGELOG.md:18`. Review is still pending, coverage is not reverted                                                              | "authored, awaiting PCIC review (#185)" |
| `:181` RK8        | "es-ES above A2 is reverted awaiting review"                                           | Same                                                                                                                                                                        | Same wording                            |
| `:23` C5          | "all six languages A1–C2" with two exceptions                                          | pt-PT has 124 of 154 nodes; de-DE and es-ES 142 (finding 7)                                                                                                                 | Add the node gaps                       |
| `:155` M2         | "alongside S4 mastery"                                                                 | S4 is "The pair selector remembers the last chosen pair" (`:99`). Mastery is L9 / intent SIG4                                                                               | "alongside mastery (L9, SIG4)"          |
| `:62` L23b        | "not a second SM-2 review… never graduates a word to 'mastered' or a 6-day interval"   | SM-2 was replaced (`:60` L22); FSRS first intervals are 1, 1, 2, 8 days (`:80-83`)                                                                                          | Drop "SM-2" and the 6-day figure        |
| `:6`              | "Deep design detail (schemas, SM-2 maths, budgets) lives in `specification-design.md`" | Schemas: `src/content.config.ts` (AGENTS.md §4). Scheduling: spec §2.1. Budgets: `lighthouserc.json` (Q5). That file calls itself frozen and says the others win (its `:3`) | Point at the three real homes           |
| `:169`            | "Platform limits P-1…P-9"                                                              | `plans/README.md:98` has P-10                                                                                                                                               | "P-1…P-10"                              |
| `:105` S8         | Verified by "iOS Safari device check (#241)"                                           | #241 is closed; the run is not logged                                                                                                                                       | Cite #195                               |

Cross-document:

- `intent.md:37` "`spec.md` has its own S1–S8" against `spec.md:9` "Spec IDs S1–S11". Fix belongs in a separate `docs(intent):` PR (AGENTS.md §10).
- `AGENTS.md:25` "Goal G1 (#21) gates new content and features". The G1 goal issue is #269; #21 is the learner-session epic.
- `docs/learning-science-references.md:45` cites "plan Q-4", which no longer exists (it became #267). `:83` cites "non-goal NG7" and "SM-2 already adapts locally"; the NG IDs exist only in `specification-design.md:59-67`.
- `CHANGELOG.md` has two `### Added` headings under `[Unreleased]` (`:8` and `:45`).

## 7. Content gaps with no row or issue (Medium)

**Evidence** (`npm run report:coverage`, today):

| Language | Missing nodes               | In the CI gate?                                              | Tracked by              |
| -------- | --------------------------- | ------------------------------------------------------------ | ----------------------- |
| pt-PT    | 28 (A1 1, A2 10, B1 17)     | No: `scripts/check-concept-coverage.ts:57` filters out pt-PT | Nothing                 |
| de-DE    | 12 (A1 2, A2 10)            | Yes, as an accepted baseline (`docs/coverage-baseline.json`) | Nothing (#143 is B1–C2) |
| es-ES    | 12 (A1 2, A2 10)            | Yes, accepted baseline                                       | Nothing (#185 is B1–C2) |
| fr-FR    | 0 nodes, 125 concepts at C1 | Yes, accepted baseline                                       | Row 3.9, #256           |

pt-PT is the language G1 tests. Its one missing A1 node is the only gap a first-session learner could meet. The report also shows 63 "missing concepts" for pt-PT A1; the script comment at `:48-49` says pt-PT "occasionally uses an alternative key", so I am not certain those 63 are real gaps and have not counted them as such.

**Proposed fix:** do not author anything (P2, Rule 1). Record the numbers in "Where we are" and in C5, and add one G4 row with an issue so the gap is visible. Before wave 1, check by hand whether the missing A1 pt-PT node matters to the first-run path.

## 8. No next release is defined (Medium)

**Evidence**

- `package.json:4` version `0.1.0`; `CHANGELOG.md:67` `[0.1.0] - 2026-10-04`; `[Unreleased]` holds everything since, including the FSRS storage migration (schema 1 → 2).
- `git ls-remote --tags origin` returns 0 tags, and the releases API returns 0 releases. AGENTS.md §9 says a release is tagged.
- `spec.md:31` C12: "`validate:content` fails when an ID present in the last release tag is missing or its `term` changed". `scripts/check-item-ids.ts:1-2` falls back to `origin/main` when no tag exists. So the check compares against `main`, not a release, and "released item ID" has no fixed baseline. C12 is marked ✅.
- No plan row or milestone says what the next version contains.

**Proposed fix:** define the next release as "what learners in wave 1 will use": cut and tag `v0.2.0` from the current `[Unreleased]` before the first invitation (it changes stored state, so pre-1.0 MINOR is right under AGENTS.md §9). Add it as a G5 row with an issue. No new feature is needed to reach it.

## 9. Traceability orphans (Medium)

**Plan rows → issue.** Every row names an issue, but four point at closed ones: 1.5 → #241, 1.4 → #266, 2.13 → #247, 3.1 → #166 (finding 5). Row 1.3 says "new per finding", which is fine until 1.1 runs.

**Plan rows → spec ID.** Row 1.4 has "—" (a decision, acceptable). Row 3.3 (#146) cites L5, which is ✅ and says nothing about an image split; the split is new behaviour with no requirement ID (Rule 2a).

**Open issues → plan row.** Not counting the five goal issues:

| Issue | State                                                                                               | Fix                                                                            |
| ----- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| #292  | Open, G5, no row. Q10 is ✅ (`spec.md:125`) and PR #304 added its E2E                               | Close as completed                                                             |
| #307  | "Decision for Humans": no label, milestone or assignee; bundles four separate decisions             | Make it a proper `question` issue (AGENTS.md §12.5), G2, assigned to the owner |
| #148  | Epic, named in the G2 intro (`plans/README.md:37`); its body still says "while SM-2 already adapts" | Leave; fix the body                                                            |
| #267  | Question in milestone G1, but its body says "Plan: row 3.8" and it affects G4 content scope         | Your call (question 4)                                                         |
| #298  | Question, G2. Not a row (Rule 5), but it blocks D.1, D.2 and 3.1 and the plan does not say so       | Name it in the G2 intro                                                        |
| #236  | Question, G3, cited only in P-6. Body cites "Plan: row 2.3 follow-up"; no row 2.3 exists            | Fix the body                                                                   |
| #268  | Question, G3, cited by row 2.7                                                                      | OK                                                                             |

**Spec rows not ✅ with no open issue or row:** C7a and C7b (🟡, cite closed #141), D1 (🟡, no issue, no stated reason), S8 (🟡, cites closed #241), L13 (finding 6). S6a and S6b are 🟡 by design (stated limits). For C7a, C7b and D1 the spec does not say what is missing; I could not tell from the documents and did not guess.

## 10. Stale GitHub metadata (Low)

To be drafted as changes in Phase 3. Nothing has been changed.

- Old signal IDs (`S1`, `S2`, `S7`, `S8` meaning intent signals, now `SIG<n>`): #269 body, #266 body, #268 body, and the G1 milestone description.
- #256 title says "fr-FR and it-IT C1"; it-IT C1 now reports 0 missing concepts.
- #200 title says "detection and fallback hardening"; row 2.6 (`plans/README.md:53`) says the code already ships and only device verification is left.
- #272 body cites #166 (closed). #143 body cites `docs/superpowers/plans/…` and `plan.md`, paths that no longer exist. #146 and #147 cite "plan.md Later".
- #160 body lists a gate "#21 retention evidence gate must be positive before full A1–C2 authoring proceeds"; the content was authored under the owner exception.
- #185 and #160 have no labels; #21 and #195 have no assignee although only the owner can do them.
- No milestone has a due date.

## 11. Evidence (Low)

**Research citations.** Every author–year citation in `spec.md` §1–§2 and in `plans/README.md` (Lee et al. 2015, Mackey & Goo 2007) has a full entry in `docs/learning-science-references.md`. I found none missing.

- **Logged as verified by the repo:** the 34 SLA sources, checked 2026-10-23 against Crossref and publisher pages (`docs/learning-science-references.md:92`). I did not repeat that check.
- **UNVERIFIED by the repo's own log:** all sources listed before 2026-10-23 (`:94` "Not yet re-verified"): the Tier 1 table from Dunlosky et al. 2013 to Lyster & Saito 2010, and the Tier 2 rows. I recognise these as real publications from memory, but I could not check titles, volumes or pages today, so treat the details as unverified.
- **Weak anchor:** `spec.md:60` gives "Spacing (Ye, Su & Cao 2022)" for L22. As far as I know that paper describes the scheduling model FSRS grew out of, not FSRS-6 or its default weights; you may want to verify this. The repo's only FSRS-vs-SM-2 source is the open-spaced-repetition benchmark, which the references file itself rates Tier 2 ("Not peer reviewed and run by the FSRS author[s]", `:72`). The spec is honest that its own simulation shows no review saving (`spec.md:90`).
- **One specific statistic:** "meta-analysis of 94 tests, d = 0.65" for Gollwitzer & Sheeran 2006 (`docs/learning-science-references.md:52`). It is inside the 2026-10-23 verified set; it matches my memory, but I did not check it.

**Claims with no source in the documents**

| Claim                                                                             | Where                               | Status                                                                                                             |
| --------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| "Duolingo is gamified, Babbel needs a backend account"                            | `intent.md:16`                      | UNVERIFIED. Its cited source (`discovery-brief.md:11`) asserts the same with no evidence                           |
| 40% week-2 return, 60% of A1 vocab at ≥21 days                                    | `intent.md:43-44`                   | Targets, not findings. No benchmark is cited for either number                                                     |
| "Safari deletes it after 7 days without interaction"                              | `plans/README.md:89`, `spec.md:105` | UNVERIFIED here; no link. I believe this is WebKit's documented 7-day cap on script-writable storage; add the link |
| Chrome speech recognition sends audio to a server; on-device mode is desktop-only | `plans/README.md:90`                | UNVERIFIED; no link; may have changed since it was written                                                         |
| Web Push on iOS works only for home-screen apps                                   | `plans/README.md:93`                | UNVERIFIED here; no link                                                                                           |
| GitHub Pages 1 GB site limit                                                      | `plans/README.md:96`                | UNVERIFIED here; no link                                                                                           |

**Claims I checked against the repo and found correct:** 154 nodes; 30 writing nodes (`plans/README.md:92`); 694 pt-PT audio clips, 8.6 MB on disk against the stated 8.5 MB (`:96`); fr-FR C1 "125 missing concepts" (`:77`).

**Missing source file:** `plans/2026-11-09-critic-review-disposition.md:3` cites `egm-review/critic_report.md`, which is not in the repo, so the ledger's findings cannot be read from here.

## 12. Archive the two founding documents (Low)

Both are superseded. Recommendation: move both to `docs/archive/`, keep them unedited, and fix the links.

**`discovery-brief.md`** declares itself superseded (`:3`, `:83`). Still cited as a live source by `intent.md:16` and `:33`, `spec.md:13` and `:169`, `src/lib/pronounce.ts:3`, `src/lib/reviewSession.ts:1`, README, and `.pre-commit-config.yaml:53`. Risks moved to `spec.md` §6; personas are in `intent.md` §2. The JTBD table and AC list live nowhere else, which is the reason to keep the file.

**`specification-design.md`** calls itself a frozen reference (`:3`) but is actively misleading for an agent that opens it:

- `:41` and `:132` specify Vue 3 islands. AGENTS.md §4.4: "no UI framework runtime is shipped".
- `:139` and `:623` specify Plausible or Umami analytics. `intent.md:54`: "the app makes no measurement request itself".
- `:387` specifies SM-2. `spec.md:60`: FSRS-6.
- `:49-55` defines goals **G1–G5** with different meanings from the plan's milestones G1–G5 (its G4 is the abstract content model; the plan's G4 is breadth). Its own status note uses "Goal G4" in the old sense.
- `:59-67` defines NG1–NG7, still cited by `docs/learning-science-references.md:83` and `docs/content-attribution.md:65`.
- Live documents still send readers into it: `spec.md:6`, `docs/content-authoring-playbook.md:7` (§5), `docs/cefr-mapping.md:3` (§5.3), `opencode/commands/plan.md:15`, README `:106` and `:205` ("Full technical specification").

Its rationale table was already replaced by `docs/alternatives-considered.md`. Archiving needs about a dozen link edits, including one in `intent.md` (separate PR) and two code comments.

## 13. Exit criteria (Low)

Testable as written: T1.2, 1.5, 1.1, 1.2, D.1, D.2, 2.6, 2.14, 2.15, 2.16, 3.1, 3.4–3.9. The G1 decision rule (`docs/phase-1-learner-session-protocol.md:42-48`) is numeric and good.

| Row                    | Problem                                                                                                                | Proposed criterion                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 2.8 (`:55`)            | "Each requirement shipped with an E2E check" covers four requirements (L16–L19) with no size or count                  | Split per requirement, each with one named module or task; or defer (finding 14) |
| 2.7 (`:54`)            | Exit is an owner answer "then a redesign PR"; no check on the redesign                                                 | Write the check when #268 is answered                                            |
| 2.4 (`:52`)            | "One grammar point graded in a real review session" does not cover L15 (contrastive notes), though the row claims both | Add "…and one contrastive note shown for a non-English source"                   |
| 3.2 (`:70`)            | "Notes shown on a non-English-source pair" has no count; #147 says "≥3 notes on a pt-PT→es-ES pilot node"              | Use the issue's wording                                                          |
| 3.3 (`:71`)            | "Needs S6 data" with no amount                                                                                         | State a minimum, or defer                                                        |
| Goal G4 (`:63`)        | Finding 3                                                                                                              | Finding 3                                                                        |
| Goal G5 (#273)         | "Exit. None: a standing goal"                                                                                          | Acceptable; no change                                                            |
| `intent.md` SIG3, SIG4 | Rates with no denominator that the product can observe (finding 3)                                                     | Separate `docs(intent):` PR, if you want it                                      |

## 14. Scope (recommendation)

The next release is reachable today, because it needs no new code (finding 8). What stands between now and a G1 verdict is owner time. So the scope question is mostly what to stop carrying.

- **Cut:** row 2.13 (done). #292 (done).
- **Merge:** row 1.5 into T1.2 (same device session, same checklist). Row 2.6 into T1.2 as well: it is a device check with no code, and it serves persona Pedro on the language G1 tests; it does not need to wait for the G3 gate.
- **Defer explicitly** (keep the issue, drop the row to a one-line "later" list so G3 and G4 read as short queues): 2.8 (#205, four requirements, the largest item in G3), 3.5 (#252, needs multi-voice recordings that do not exist), 3.6 (#253), 3.7 (#254).
- **Keep gated, unchanged:** 2.4, 2.7, 2.14, 2.15, 2.16, 3.2, 3.3, 3.4, 3.8, 3.9.
- **Add:** one G5 row for the `v0.2.0` tag; one G4 row for the pt-PT, de-DE and es-ES node gaps (finding 7); the spot-check test from #185 as a small G2 item sized for a cheap model.

G3 would then hold 5 rows and G4 would hold 7.

## Questions for the owner

1. **#266.** Were any learner sessions (rows 1.1, 1.2) run? If yes, what is the verdict and where is the table? If no, I will propose reopening #266.
2. **Rule 1.** Keep it as a hard gate and record FSRS as the one exception, or reword it to "G3 work needs a written owner exception"?
3. **G4 gate.** "Produces data", "trends to target", or the measurable wording proposed in finding 3?
4. **#267** (what the CEFR labels promise). Does it belong to G1 (decide before learners see the labels) or G4?
5. **Archive.** Move `specification-design.md` and `discovery-brief.md` to `docs/archive/`? The `intent.md` link fix would go in its own PR.
6. **Scope.** Accept the cut, merge and defer list in finding 14, or name the rows to keep?
7. **The board.** I cannot read or change it from this session. Do you want Phase 3 to list board moves for you to make by hand?

## Phase 3 draft

Not written yet. Issue and milestone changes will be listed here after Phase 2 is approved. Nothing on GitHub has been changed.
