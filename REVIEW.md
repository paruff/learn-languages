# Review — how to review a change in this repo

> **Who reads this:** every reviewer, human or agent. Copilot code review loads this file automatically. Claude Code and OpenCode are pointed here by [`AGENTS.md`](AGENTS.md) §12.
> Review the PR's diff against its linked issue. Product rules are in [`spec.md`](spec.md) and UI rules in [`DESIGN.md`](DESIGN.md); this file says what to check, not what the product does.

## 1. Severity and output

| Severity      | Meaning                                                                                                       | Merge          |
| ------------- | ------------------------------------------------------------------------------------------------------------- | -------------- |
| **Critical**  | Security or privacy breach, data loss (learner progress), broken learning loop, broken build or deploy        | Blocks         |
| **Important** | A bug, a missing test for changed behaviour, a spec or design rule broken, the issue's exit criterion not met | Blocks         |
| **Minor**     | Clarity, naming, small simplifications                                                                        | Author decides |

For each finding give `file:line`, the severity, what goes wrong (a concrete input or scenario), and a suggested fix. Don't report style that lint or Prettier already enforce. "No findings" is a valid review.

## 2. Correctness

- The PR closes an issue (`Closes #n`), and the change does what that issue's **Exit criterion** says, no more.
- Behaviour changes update `spec.md` in the same PR, and the spec ID's status is flipped only when its check passes.
- Edge cases: empty decks, the first and last card, a new pair with no state, missing optional content (audio, images, grammar notes, prerequisites).
- Dates and intervals: day boundaries, time zones, "due today" vs "overdue", the day-2 and week-2 return calculations (S6).
- `schedule()` and other `src/lib/` functions stay pure: they return new objects and never mutate their inputs.
- No code path names a specific language (intent P4). Language differences live in content, not `if (lang === …)`.

## 3. Learning-loop invariants (Critical if broken)

- L1: nothing reveals the answer before the learner has attempted it, including DOM text, `aria-label`, `title` or the page source of a pre-rendered card.
- L3: the due queue stays interleaved across nodes.
- S1: SRS keys keep the `srs:{source}:{target}:{direction}:{itemId}` format. A key change needs a migration and a test.
- S7: all storage access goes through `src/lib/storage.ts`, and a storage failure never breaks a page.

## 4. Security and privacy

- **No data leaves the browser.** No new network requests, third-party scripts, fonts, analytics or beacons (S3). `tests/e2e/launch-readiness.spec.ts` must still pass.
- No PII, cookies or accounts (intent P3). Exported reports contain allow-listed keys only (M1, S5).
- **HTML injection:** `set:html` and `innerHTML` only with build-time content or escaped values, never with learner input or URL parameters. JSON placed inside `<script>` must not be able to contain `</script>`.
- Restore files and other learner-supplied input are validated before use (S5).
- New dependencies are justified (could a few lines or the platform do it?), and `package-lock.json` is committed. No `eval` or `new Function`.
- Workflows keep least-privilege `permissions:`, and no secrets are written to code or logs.

## 5. Bugs to look for

- Async UI: double submit on the grade buttons, a stale card after a fast click, listeners added twice when navigating.
- Storage: full quota, blocked storage, corrupted JSON in a key, two tabs open at once.
- Content: an item missing an optional field, a node with no realisation in the current target language.
- Accessibility regressions: focus lost after reveal or grade, controls without names, colour as the only signal.

## 6. Tests

- A test fails without the change and passes with it (TDD, AGENTS.md §6.2). Tests check behaviour the learner or caller sees, not implementation details.
- `src/lib/` coverage stays at or above 90%. `schedule()` keeps 100%.
- Anything a learner can see or do has an E2E check, and new pages are in the axe run.

## 7. UI changes

- Cite the `DESIGN.md` section the change follows, or update `DESIGN.md` in the same PR.
- Tokens, not raw values. Works at 320px with no horizontal scroll. Reduced motion respected.
- One goal and one next step per page (J1). No streak, guilt or nag copy.

## 8. Content changes

- Schema-valid (`npm run validate:content`) and checked against the language's authoritative CEFR source, recorded in its `docs/*-cefr-mapping.md` (C6).
- **An agent can't approve content.** A human verifies it before merge (intent P6).

## 9. Docs

- One fact in one place: link instead of copying between `intent.md`, `spec.md`, `plans/README.md`, `DESIGN.md` and `AGENTS.md`.
- `intent.md` edits go in their own `docs(intent):` PR.

## 10. The merge decision

Only the owner merges. Before merging: CI is green, every Critical and Important finding is fixed or answered in the PR, and the spec status matches what shipped.
