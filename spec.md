# Spec — Acquira (learn-languages)

> **What this file is:** the living, testable contract for _what the product does_. Each requirement has an ID, traces to `intent.md`, and names the check that proves it.
> **Update it in the same PR as any behaviour change.** If code and spec disagree, that's a bug in one of them, and the PR must say which.
>
> Deep design detail (schemas, SM-2 maths, tokens, budgets) lives in `specification-design.md`. This file stays at the requirement level and links into it instead of copying it.
> Per-feature design notes go in `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and must cite the requirement IDs they add or change here.

**Spec version:** 1.4 (2026-10-20) · **Status legend:** ✅ shipped and verified · 🟡 partial · ⬜ not started

## 1. Content model

| ID  | Requirement                                                                                                                                                                                                                    | Intent   | Verified by                                   | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------- | ------ |
| C1  | CEFR nodes are language-agnostic (`nodeId`, level, skill, Can-Do) and contain no language-specific text                                                                                                                        | P4       | Zod schema, `npm run validate:content`        | ✅     |
| C2  | Every realisation references an existing node (invariant I1)                                                                                                                                                                   | P4       | `src/lib/contentIntegrity.ts` + test          | ✅     |
| C3  | Any two supported languages pair by `nodeId` + vocabulary `concept`, with no per-language code path. When the source is the gloss language (`en-GB`), an unmatched target item pairs against its own English gloss             | P4       | `src/lib/pairLoader.test.ts` (#139, Task A3)  | ✅     |
| C4  | Supported languages: en-GB, pt-PT, es-ES, de-DE, fr-FR, it-IT. Each one can be the source or the target                                                                                                                        | §2       | `getAvailablePairs()` tests                   | ✅     |
| C5  | Coverage: pt-PT, es-ES, de-DE and fr-FR A1–C2; it-IT A1–A2 (B1 in #180). es-ES shared-concept coverage above A2 is reverted pending per-item PCIC review (#185)                                                                | §3       | `docs/*cefr-mapping.md`, `npm run check:coverage` | 🟡     |
| C6  | Content is checked against the language's authoritative CEFR source before merge                                                                                                                                               | P6       | Mapping docs + PR review                      | ✅     |
| C7  | Images are keyed by concept: one per concept, optional per-target-language override for culturally specific concepts; each has alt text and attribution in `src/content/concept-images/index.yaml`, shown on the in-app credits page | P1, a11y | Schema + `docs/content-attribution.md` (#141) | 🟡     |
| C8  | Invalid content fails the build                                                                                                                                                                                                | §7       | CI `validate:content`                         | ✅     |
| C9  | Every vocabulary item has a `concept` (kebab-case English-gloss slug), unique within its realisation; items paired across languages have matching English glosses                                                              | P4       | `validate:content` (#139)                     | ✅     |

## 2. Learning loop (the product)

| ID  | Requirement                                                                                                                                                                       | Mechanism                                                    | Verified by                                                      | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- | ------ |
| L1  | Review always runs prompt → attempt → reveal → self-grade (Again/Hard/Good/Easy). The answer is never shown before an attempt                                                     | Retrieval                                                    | `tests/e2e/review.spec.ts`                                       | ✅     |
| L2  | SM-2 schedules each card; state is immutable (pure `schedule()`)                                                                                                                  | Spacing                                                      | `src/utils/srs.ts` tests (100% coverage)                         | ✅     |
| L3  | The due queue is round-robined across CEFR nodes                                                                                                                                  | Interleaving                                                 | `interleaveByNode` in `src/lib/reviewSession.test.ts`            | ✅     |
| L4  | Opt-in typed-recall mode; answers are checked ignoring case, accents, whitespace, and trailing punctuation                                                                        | Generation                                                   | `src/lib/exerciseCheck.test.ts`                                  | ✅     |
| L5  | Progress flags confident grades (Good/Easy) that were soon followed by Again/Hard                                                                                                 | Calibration                                                  | `src/lib/calibration.test.ts`                                    | ✅     |
| L6  | Optional post-session reflection: skippable, never graded, never sent anywhere, scoped per day                                                                                    | Reflection                                                   | `src/lib/reflection.test.ts`                                     | ✅     |
| L7  | Lesson exercises (including multi-question passages) score per answerable question                                                                                                | Retrieval                                                    | `src/lib/exerciseScoring.test.ts`, `tests/e2e/exercises.spec.ts` | ✅     |
| L8  | Grammar points are practised through retrieval in the SRS loop, not only read                                                                                                     | Retrieval/Spacing                                            | — (#126)                                                         | ⬜     |
| L9  | A vocabulary item counts as "mastered" when its SRS interval is at least 21 days                                                                                                  | Calibration (G3)                                             | `src/lib/progress.test.ts`                                       | ✅     |
| L10 | Grading a card "Again" shows corrective support (the item's example sentence and translation, and any grammar note) before the card is re-queued — not just the bare answer again | Feedback (Hattie & Timperley 2007)                           | —                                                                | ⬜     |
| L11 | A review session opens by stating its learning intention: the CEFR Can-Do statement(s) the due cards serve ("Where am I going?")                                                  | Feedback, learning intentions                                | —                                                                | ⬜     |
| L12 | Nodes declare `prerequisiteNodes`, and lessons/progress recommend unmastered prerequisites first. Recommendation only: nothing is ever locked                                     | Mastery learning (Bloom 1968), soft                          | —                                                                | ⬜     |
| L13 | Opt-in picture-prompt cards: image only, the learner produces the target term                                                                                                     | Dual coding, retrieval (RHM; Carpenter & Olson 2012 caution) | `tests/e2e/review.spec.ts` (#145)                                | ✅     |
| L14 | False-friend and cognate notes are shown when the source language is not English                                                                                                  | Transfer (Ringbom 2007)                                      | — (#147)                                                         | ⬜     |
| L15 | Grammar points may carry a contrastive note keyed by source language                                                                                                              | Explicit instruction (Norris & Ortega 2000)                  | — (#144)                                                         | ⬜     |
| L16 | Contrastive grammar modules explicitly compare the learner's source language and target language for high-interference features                                                   | Metalinguistic awareness, noticing, transfer                 | —                                                                | ⬜     |
| L17 | Metalinguistic analysis tasks ask learners to explain and compare why a form is wrong or right, not just pick an answer                                                           | Metalinguistic awareness, explicit analysis                  | —                                                                | ⬜     |
| L18 | Optional L1 grammar diagnostic identifies likely L1 gaps and recommends relevant contrastive L2 modules                                                                           | Metalinguistic awareness, calibration                        | —                                                                | ⬜     |
| L19 | Tricky grammar points include short "rule-of-thumb" notes tied to likely L1→L2 interference patterns, shown in lessons and corrective support                                     | Explicit instruction, transfer                               | —                                                                | ⬜     |

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
- L13: does the picture-prompt mode raise the calibration-flag rate (L5) for image cards? Needs S6. The image-vs-non-image calibration split is tracked in #146.
- L16/L17: should contrastive grammar and metalinguistic tasks run inside the same review queue as L8 items, or be a linked practice surface from lessons?
- L18: should L1 diagnostics stay self-report + lightweight quizzes only, or include adaptive follow-up checks before recommending modules?
- L19: how opinionated should "rule-of-thumb" guidance be per language pair before it becomes overgeneralized advice?
