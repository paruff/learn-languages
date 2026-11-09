# Critic review: what happened to each finding

Source: `egm-review/critic_report.md` (Stage 7) and the Stage 9 report. Spec 1.6 and PRs #295, #296 and the follow-up. "Done" means the document or code now says it; "Declined" gives the reason. Move this file to `plans/archive/` once the tracked items close.

## Blockers

| ID    | Outcome                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------- |
| CR-B1 | Done: `docs/alternatives-considered.md`                                                                   |
| CR-B2 | Done: RK2 size estimate (log capped at 2000), S9 notice with unit and E2E tests, DESIGN §6 "Save failure" |
| CR-B3 | Done: C12 and REVIEW §3 (Critical); `npm run check:item-ids` runs in CI                                   |
| CR-B4 | Done: SIG IDs (earlier commit), REVIEW "S6a", legend in spec                                              |

## Major

| ID     | Outcome                                                                                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CR-M1  | Done: S6 🟡, S6b states the cohort limit, intent P3 and S3 agree (#295)                                                                                                                      |
| CR-M2  | Done: L33 logs scheduler, suggested grade, override and typed result; retention is per scheduler (`grade.test.ts`)                                                                           |
| CR-M3  | Done: spec §2.1 transition table                                                                                                                                                             |
| CR-M4  | Done: §2.1 due rule (one representation, queue built once per session, example fixed). A minimum elapsed time is declined: the queue-built-once rule already prevents same-session re-offers |
| CR-M5  | Done: L10–L12, M2, C4 name real checks; C6 🟡; Q3 states its fallback. J1–J3 now name their spec files (`first-run`, `practice-scope`, `progress`)                                           |
| CR-M6  | Done: Q7 states the limit, RK10; Q12 precaches the open level (E2E)                                                                                                                          |
| CR-M7  | Done: C13 ser/estar fixture (valid and pairs by slug)                                                                                                                                        |
| CR-M8  | Done as a stated limit: C1, RK7, P-10                                                                                                                                                        |
| CR-M9  | Done: C6 🟡, REVIEW §8, Reviewers table in `docs/cefr-mapping.md`. Needs the owner to name reviewers → #298                                                                                  |
| CR-M10 | Done: Q10 on-device voices by default, opt-in checkbox, unit tests                                                                                                                           |
| CR-M11 | Done: S11 schema version; newer data is never overwritten and newer backups are rejected. The FSRS migration itself stays plans row 2.13                                                     |
| CR-M12 | Done: S10 `applyGrade` re-reads state before each grade, unit test                                                                                                                           |
| CR-M13 | Done: S5b says merge is idempotent (entries deduped by content), later `lastReviewed` wins, ties keep local; clock skew stays a stated limit (RK5)                                           |
| CR-M14 | Done: Q11 saved pair applied while parsing; no-JS default and plain links (E2E)                                                                                                              |
| CR-M15 | Done: spec §6 RK1–RK12                                                                                                                                                                       |
| CR-M16 | Done: Intent column on §2 and §4; every row cites P#, SIG# or §n                                                                                                                             |
| CR-M17 | Done: §4 split into 4.1–4.5                                                                                                                                                                  |
| CR-M18 | Done: "plan T2", "plan Phase 1", "(G3)" replaced; L13 now #145 everywhere                                                                                                                    |
| CR-M19 | Done: superseded banner, title, footer, GDPR wording, Vue, ≥21 in `discovery-brief.md`                                                                                                       |
| CR-M20 | Done: outcome sentence, SIG1 and SIG2 thresholds (#295)                                                                                                                                      |
| CR-M21 | Done: ≥21 in spec L9, intent SIG4, discovery brief                                                                                                                                           |
| CR-M22 | Done: intent known-limit paragraph (earlier commit)                                                                                                                                          |
| CR-M23 | Done: C7, L2, L20, L23, S5, S6, J2 split into sub-IDs; Q3 fallback stated                                                                                                                    |

## Nits

| ID            | Outcome                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------- |
| CR-N1, N2     | Done earlier (commit dcb323c)                                                                  |
| CR-N3         | Declined for now: the flow line is in `intent.md`; an intent edit needs its own PR. Low value  |
| CR-N4         | Declined: restating thresholds is cheap and AGENTS.md §5.2 is the owner; revisit if they drift |
| CR-N5, N6, N7 | Done: REVIEW §3 heading, purity rule scope, L1 wording                                         |
| CR-N8         | Done: L4 states the accent limit                                                               |
| CR-N9         | Done: Q1 includes `checkpoint`; L20a says it never changes SRS state                           |
| CR-N10        | Done: DESIGN §3                                                                                |
| CR-N11        | Done: DESIGN §6 empty, error, save-failure, offline and focus patterns                         |
| CR-N12, N13   | Done: spec "Terms" and expanded acronyms                                                       |
| CR-N14        | Declined: stylistic; no behaviour change                                                       |
| CR-N15        | Done: advertising is its own non-goal (#295)                                                   |
| CR-N16        | Done: DESIGN cites L4, and offline cites Q7 correctly                                          |
| CR-N17        | Done: Pedro and pt-PT spelling in the brief                                                    |
| CR-N18        | Declined: mixed link styles are harmless                                                       |
| CR-N19        | Done: C5 list simplified. §5 stays prose by design                                             |
| CR-N20        | Done: REVIEW §10 maps Blocker/Major/Nit to the repo scale                                      |
| CR-N21        | Done: GDPR claim reworded                                                                      |

## Stage 9 plan findings

| ID               | Outcome                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IR-B1, B2, B3    | Done: G1 rows 1.1–1.4 and the protocol (day-7 window, report channel, consent, home-page start, decision rule). Protocol now points to #21 and #266        |
| IR-B4            | Done: row 1.5 is the S8 device run; P-1 updated                                                                                                            |
| IR-B5            | Done: `report:coverage` now lists missing nodes and exits 1 on any gap. Today de-DE and es-ES each miss 2 B2 nodes and 17 B1 nodes; D.1 and D.2 state that |
| IR-M1–M3, M5, M6 | Done in the plans rewrite (order, severity scale, reviewer artifacts, exit criteria). Still vague by choice: row 3.5 and 3.6                               |
| IR-M7            | Done: per-language coverage claim corrected                                                                                                                |
| IR-M8, M10       | Done: rows 2.6 and 2.13 reworded. The per-file 100% threshold is part of row 2.13's exit                                                                   |
| IR-M9            | Open: no row for the learner-journey plan #194; check whether it is done and archive it                                                                    |
| IR-M11           | Done                                                                                                                                                       |
