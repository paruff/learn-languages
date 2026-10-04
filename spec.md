# Spec — Acquira (learn-languages)

> **What this file is:** the living, testable contract for _what the product does_. Each requirement has an ID, traces to `intent.md`, and names the check that proves it.
> **Update it in the same PR as any behaviour change.** If code and spec disagree, that's a bug in one of them, and the PR must say which.
>
> Deep design detail (schemas, SM-2 maths, tokens, budgets) lives in `specification-design.md`. This file stays at the requirement level and links into it instead of copying it.
> Per-feature design notes go in `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and must cite the requirement IDs they add or change here.

**Spec version:** 1.1 (2026-10-04) · **Status legend:** ✅ shipped and verified · 🟡 partial · ⬜ not started

## 1. Content model

| ID  | Requirement                                                                                             | Intent   | Verified by                            | Status |
| --- | ------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------- | ------ |
| C1  | CEFR nodes are language-agnostic (`nodeId`, level, skill, Can-Do) and contain no language-specific text | P4       | Zod schema, `npm run validate:content` | ✅     |
| C2  | Every realisation references an existing node (invariant I1)                                            | P4       | `src/lib/contentIntegrity.ts` + test   | ✅     |
| C3  | Any two supported languages pair by `nodeId` alone, with no per-language code path                      | P4       | `src/lib/pairLoader.test.ts`           | ✅     |
| C4  | Supported languages: en-GB, pt-PT, es-ES, de-DE, fr-FR. Each one can be the source or the target        | §2       | `getAvailablePairs()` tests            | ✅     |
| C5  | Coverage: pt-PT, es-ES, and de-DE A1–C2; fr-FR A1–B2; fr-FR C1–C2 not started (#111, #112)              | §3       | `docs/*cefr-mapping.md`                | 🟡     |
| C6  | Content is checked against the language's authoritative CEFR source before merge                        | P6       | Mapping docs + PR review               | ✅     |
| C7  | Images are optional, require alt text, and are attributed                                               | P1, a11y | Schema + `docs/content-attribution.md` | ✅     |
| C8  | Invalid content fails the build                                                                         | §7       | CI `validate:content`                  | ✅     |

## 2. Learning loop (the product)

| ID  | Requirement                                                                                                                                                                       | Mechanism                           | Verified by                                                      | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- | ------ |
| L1  | Review always runs prompt → attempt → reveal → self-grade (Again/Hard/Good/Easy). The answer is never shown before an attempt                                                     | Retrieval                           | `tests/e2e/review.spec.ts`                                       | ✅     |
| L2  | SM-2 schedules each card; state is immutable (pure `schedule()`)                                                                                                                  | Spacing                             | `src/utils/srs.ts` tests (100% coverage)                         | ✅     |
| L3  | The due queue is round-robined across CEFR nodes                                                                                                                                  | Interleaving                        | `interleaveByNode` in `src/lib/reviewSession.test.ts`            | ✅     |
| L4  | Opt-in typed-recall mode; answers are checked ignoring case, accents, whitespace, and trailing punctuation                                                                        | Generation                          | `src/lib/exerciseCheck.test.ts`                                  | ✅     |
| L5  | Progress flags confident grades (Good/Easy) that were soon followed by Again/Hard                                                                                                 | Calibration                         | `src/lib/calibration.test.ts`                                    | ✅     |
| L6  | Optional post-session reflection: skippable, never graded, never sent anywhere, scoped per day                                                                                    | Reflection                          | `src/lib/reflection.test.ts`                                     | ✅     |
| L7  | Lesson exercises (including multi-question passages) score per answerable question                                                                                                | Retrieval                           | `src/lib/exerciseScoring.test.ts`, `tests/e2e/exercises.spec.ts` | ✅     |
| L8  | Grammar points are practised through retrieval in the SRS loop, not only read                                                                                                     | Retrieval/Spacing                   | — (#126)                                                         | ⬜     |
| L9  | A vocabulary item counts as "mastered" when its SRS interval is at least 21 days                                                                                                  | Calibration (G3)                    | `src/lib/progress.test.ts`                                       | ✅     |
| L10 | Grading a card "Again" shows corrective support (the item's example sentence and translation, and any grammar note) before the card is re-queued — not just the bare answer again | Feedback (Hattie & Timperley 2007)  | —                                                                | ⬜     |
| L11 | A review session opens by stating its learning intention: the CEFR Can-Do statement(s) the due cards serve ("Where am I going?")                                                  | Feedback, learning intentions       | —                                                                | ⬜     |
| L12 | Nodes declare `prerequisiteNodes`, and lessons/progress recommend unmastered prerequisites first. Recommendation only: nothing is ever locked                                     | Mastery learning (Bloom 1968), soft | —                                                                | ⬜     |

## 3. Learner state & privacy

| ID  | Requirement                                                                                                                                                                   | Intent | Verified by                                                     | Status |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------- | ------ |
| S1  | SRS state is keyed by pair and direction: `srs:{source}:{target}:{direction}:{itemId}`                                                                                        | JTBD-5 | `src/lib/storage.test.ts`                                       | ✅     |
| S2  | State persists across reloads                                                                                                                                                 | JTBD-1 | E2E review spec (AC-3)                                          | ✅     |
| S3  | Storage is `localStorage` only. No cookies, PII, or third-party requests (fonts self-hosted in `public/fonts/`)                                                               | P3     | `tests/e2e/launch-readiness.spec.ts` (no non-local requests)    | ✅     |
| S4  | The pair selector remembers the last chosen pair                                                                                                                              | Fiona  | `src/lib/pairPreference.test.ts`                                | ✅     |
| S5  | Progress can be downloaded as a JSON backup and restored; only Acquira's own keys are exported or written, and restore files are validated                                    | JTBD-4 | `src/lib/storage.test.ts`, `tests/e2e/launch-readiness.spec.ts` | ✅     |
| S6  | Retention can be measured with opt-in, anonymous, self-hosted measurement only. Needed to measure intent signals S3 and S4                                                    | §4     | —                                                               | ⬜     |
| S7  | Unreadable, blocked or full browser storage never breaks a page: reads fall back to defaults, failed writes are ignored. All storage access goes through `src/lib/storage.ts` | R3     | `src/lib/storage.test.ts`, `tests/e2e/launch-readiness.spec.ts` | ✅     |

## 4. Experience & quality

| ID  | Requirement                                                                                           | Verified by                                     | Status |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| Q1  | Routes: `/{source}/{target}/{lessons,lessons/[nodeId],exercises/[nodeId],review,progress}`            | Build output, `urls.test.ts`                    | ✅     |
| Q2  | Lesson content renders as static HTML without JS (AC-10)                                              | Lighthouse                                      | ✅     |
| Q3  | TTS uses the target's regional voice (`pt-PT`, not `pt-BR`) and degrades gracefully when it's missing | `pronounce.ts`, manual                          | 🟡     |
| Q4  | WCAG 2.1 AA; axe-core is clean on every page                                                          | `tests/e2e/a11y.spec.ts`                        | ✅     |
| Q5  | Lighthouse Performance ≥95, Accessibility 100                                                         | `lighthouserc.json` in CI                       | ✅     |
| Q6  | A first-time learner can start a review with no instructions                                          | Learner sessions (plan Phase 1)                 | ⬜     |
| Q7  | Works offline after the first visit (service worker, `public/sw.js`)                                  | `tests/e2e/launch-readiness.spec.ts` (Chromium) | ✅     |
| Q8  | Unknown URLs show an in-app 404 with a link back into the app                                         | `tests/e2e/launch-readiness.spec.ts`            | ✅     |

## 5. Engineering gates

Unchanged from AGENTS.md §5 and §13: typecheck 0 errors, lint 0 warnings, content 100% valid, unit coverage ≥90% for `lib/`, build, E2E, a11y, Lighthouse. A requirement is ✅ only when its "Verified by" check runs in CI or has dated evidence linked from its issue.

## 6. Open questions

- Q6 vs C5: should first-run clarity come before more fr-FR levels? Proposed answer in `plan.md`: yes.
- L12: prerequisite data doesn't exist yet (`prerequisiteNodes` is in the schema, but no node fills it in). Is authoring it worth the cost before L10 and L11 show value?
- L8: does grammar share the vocabulary SRS queue (interleaved) or get its own? To be decided in #126.
- S6: what is the smallest privacy-preserving way to know whether anyone came back on day 2? Options: a manual learner log, or opt-in self-hosted counters.
