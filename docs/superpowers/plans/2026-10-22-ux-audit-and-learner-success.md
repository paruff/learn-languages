# UX audit, tester-readiness and learner-success plan

Date: 2026-10-22. Trigger: first outside feedback (Daniel Mattrazzo, a software engineer). Status: **proposal, awaiting owner approval** (nothing in `intent.md`, `spec.md` or `plan.md` has been changed yet; proposed edits are in §5).

## 1. Feedback traced to root cause

| #   | What the tester saw                                | Root cause (verified in code)                                                                                                                                                                                                                                             | Severity                                                                           |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| F1  | Header said EN/PT, clicking "Start" gave German    | `src/pages/index.astro` uses `pairs[0]` from `getAvailablePairs()`, which is just content-load order (de-DE first). `BaseLayout` defaults to en-GB→pt-PT, so header and CTA disagree. `loadPairPreference()` exists but **no page reads it**; only the selector writes it | **Critical.** First click is wrong, on the one page every learner sees             |
| F2  | Chrome auto-translate showed everything in English | No `translate="no"` anywhere. Chrome translates the Portuguese we are trying to teach, and the exercise answers with it                                                                                                                                                   | **High.** Silently destroys the learning content for anyone with auto-translate on |
| F3  | "Can't tell where I am" in Lessons                 | Nav links have no current-page state. `aria-current` exists only on the lesson breadcrumb, and the `A1 reading · A1-BODY-001` label is jargon                                                                                                                             | Medium                                                                             |
| F4  | "Easy" grade button wrapped to a second line       | `.review-card__grades` is `flex-wrap: wrap` with content-sized buttons; looks like a special button                                                                                                                                                                       | Low (but on the core loop, and worse on phones)                                    |

Related things I noticed while reading, not yet reported by anyone:

- **U1** The pair selector shows raw codes (`en-GB → pt-PT`). `languageName()` already exists. Selecting a target jumps to `/review/`, not the page you were on, which also explains disorientation.
- **U2** The selector changes the target language only; the whole UI string set follows `sourceLang`. A learner who picks German as the source gets a German UI. Fine by design, confusing without a label such as "I speak / I'm learning".
- **U3** Nodes are shown by ID (`A1-BODY-001`). Learners need the Can-Do sentence as the title and the ID as a small secondary label.
- **U4** The homepage copy is science-led ("Krashen", "cognitive load theory"). The less IT-aware invitee wants "what do I do in the next 5 minutes".
- **U5** No on-page way to send feedback, so testers must find you on WhatsApp.

## 2. Do we have Lighthouse and acceptance tests?

Yes, partly. Honest inventory:

| Layer                                | Exists                                                                                                      | Gap                                                                                                                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit (Vitest)                        | 90% gates on `lib/`                                                                                         | None for this plan                                                                                                                                                |
| E2E (Playwright, 6 specs, ~27 tests) | Review loop, FR review, progress, exercises, offline, 404, backup, corrupt storage, no third-party requests | **No test of the first-run journey** (home → Start → correct pair), no nav-state test, no mobile viewport, no layout test (the F4 wrap), no translate guard       |
| Accessibility                        | axe on every page (desktop)                                                                                 | No mobile-viewport run, no keyboard-only walkthrough, no 200% zoom / reflow check                                                                                 |
| Lighthouse CI                        | Performance ≥0.95 and Accessibility =1 on 5 URLs, 3 runs                                                    | **Best-Practices and SEO were not asserted, and the lesson-detail page was not covered.** (Correction: Lighthouse CI already runs the mobile profile by default.) |
| Learner acceptance                   | `docs/phase-1-learner-session-protocol.md` (observation table)                                              | Never run with outsiders; protocol assumes you watch, but your testers are remote                                                                                 |

Note: AGENTS.md lists a "Preview verified" and `npm run test:a11y` gate; neither exists as a script. That doc/reality drift should be fixed or removed.

## 3. Plan

Ordered by value to the testers you are inviting. Each row gets a spec ID and a test written first (TDD, AGENTS.md §2).

### Phase T0, before inviting anyone (target: this week, small)

| #    | Work                                                                                                                                                                                  | Spec (new)       | Test written first                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| T0.1 | **F1:** Home and header resolve one pair: saved preference → `en-GB→pt-PT` default → first available. Never `pairs[0]`. `lib/` function `resolvePair(prefs, pairs)`                   | S4 (extend), U-1 | Unit for `resolvePair`; E2E: fresh visitor clicks Start and lands on `/en-GB/pt-PT/`; after choosing es-ES, return to `/` and Start goes to es-ES |
| T0.2 | **F2:** `<meta name="google" content="notranslate">` on `<html>` plus `lang` + `translate="no"` on target-language text spans; one-line "turn off page translation" hint on first run | U-2              | E2E: `html[translate=no]`, target text carries `lang=pt-PT` (also a WCAG 3.1.2 win)                                                               |
| T0.3 | **F3:** `aria-current="page"` and a visual style on the active nav item; breadcrumb on lesson and exercise pages ("Lessons › Reading: Body parts")                                    | U-3              | E2E: on a lesson page the Lessons link has `aria-current`; axe stays clean                                                                        |
| T0.4 | **F4:** grade buttons in a 4-column grid, equal width, 2×2 below ~360px (never an orphan)                                                                                             | U-4              | Playwright at 320, 375, 1280 widths: all four buttons share the same `y` (or exactly two rows of two)                                             |
| T0.5 | Feedback link in the footer (pre-filled GitHub issue form or `mailto:`) and a "Share my session report" button (see §4)                                                               | U-5, M-1         | E2E: link present, report contains no PII                                                                                                         |
| T0.6 | Selector shows language names, label "I speak → I'm learning", stays on the current page type (lessons stays lessons)                                                                 | U-6              | E2E                                                                                                                                               |

### Phase T1, test step-up (alongside T0, before invitations go out)

1. **Playwright projects:** add `mobile-chrome` (Pixel 7) and `mobile-safari` (iPhone 14) to run the existing specs, not just desktop. Cheapest way to catch F4-type regressions.
2. **`first-run.spec.ts`:** the journey a stranger takes: home → Start → lesson → exercise → review → progress, asserting the pair never changes and the nav state is right on every page. This is the acceptance test for Q6.
3. **Lighthouse:** assert `best-practices ≥0.95` and `seo ≥0.9`, add the lesson-detail URL, and upload the report as an artifact so regressions are readable.
4. **axe at mobile width** and a keyboard-only test for the review loop (Tab to reveal, grade by keys; the shortcuts 1–4 are a likely quick win).
5. **Manual checklist (once, 15 min, before each invite wave):** iPhone Safari, Android Chrome with auto-translate **on**, and Chrome desktop at 200% zoom. Written into `docs/tester-readiness.md`. Not automated because that is where "less IT-aware" problems actually live.
6. Reconcile AGENTS.md with reality (`test:a11y`, preview gate).

### Phase T2, run the feedback round well (during the weeks of testing)

- Adapt the existing protocol for **remote, unobserved** testers: a 5-line "what to try" message, no walkthrough (the first-run friction is the data), and three questions after: _Where did you get stuck? What did you think a button did that it didn't? Would you open it again tomorrow?_
- Triage every report into the table in §1 format (symptom → root cause → severity). Fix criticals before the next invitee.
- Day-2 and day-7 nudge from **you** (a message), not the app. Keeps the non-goal of no notifications.

## 4. Learner success: how do we know an English speaker learning Portuguese is succeeding?

Current intent §3 says "measurably remembers more … and comes back". It lists S1–S5 but has no measure that a learner has **gained ability**; S4 (60% of A1 vocab reaching a 21-day interval) is a retention proxy and needs weeks. Proposed: define success at three levels, cheapest first, all compatible with "zero surveillance".

| Level         | Question                                | Measure                                                                                                                                                                                                                                                                                                                             | Where it lives                                                               |
| ------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Behaviour** | Do they come back?                      | Sessions per learner, day-2 and week-2 return, session completion rate                                                                                                                                                                                                                                                              | Learner's own `localStorage` history, surfaced in the session report (below) |
| **Memory**    | Do they retain what they studied?       | _Delayed recall rate_: of cards first graded ≥7 days ago, % graded Good/Easy on the next review; plus S4 mastery (interval ≥21d); plus calibration (L5) so overconfidence is visible                                                                                                                                                | Already computed from SRS state; add a "retention" panel on Progress         |
| **Ability**   | Can they now _do_ the Can-Do statement? | **Level checkpoint:** after N mastered items in a node group, a short unseen-item production check ("say/write …") ending in a self-rated "I can do this: Yes / Nearly / No" against the CEFR Can-Do. Pass = ≥80% unseen items right **and** Yes. Unseen items matter; otherwise you measure memorising the cards, not the language | New (spec L16); content already has exercises to draw from                   |

For _you, as the English speaker learning Portuguese_: success at A1 = 80% on an unseen A1 checkpoint taken ≥7 days after studying, with a week-2 return, and being able to read a real A1 text (menu, sign, short message). That last item is an **external validity check** that no in-app number can replace: do one cold test yourself (a short real-world task) before and after four weeks. Same test for each tester, if they agree.

### Do we need to track metrics?

Yes for the testing weeks, but not with an analytics script (intent principle 3 and S3 say no, and GitHub Pages has no backend). Lazy, privacy-compatible option:

- **"Share my session report"** (M-1): a button that builds a small, human-readable JSON/text block from local data (sessions, dates, cards reviewed, grade distribution, retention rate, checkpoint results, plus an optional free-text comment) and lets the learner copy it or open a pre-filled feedback email/issue. Learner reads it before sending; nothing leaves automatically; no PII by construction; a test asserts the allowed keys.
- That satisfies S6 for a friendly cohort of ~10 people without a server. If it later needs scale, the options are a cookieless self-hosted counter (e.g. GoatCounter on your own domain) behind an opt-in. **Skipped:** event-level analytics, session replay, any third party. Add when the cohort is too large to ask.

## 5. Proposed document edits (on approval, each in its own PR)

- **`intent.md` §3/§4:** add outcome sentence "…and can _demonstrate_ the CEFR Can-Do statement they studied" and success signals S6 _ability_ (checkpoint pass on unseen items, ≥7 days after study) and S7 _first-run success_ (a stranger reaches a graded card in <2 min with no help; zero wrong-pair or lost-orientation reports).
- **`spec.md`:** new IDs U-1…U-6 (UX), M-1 (session report), L16 (level checkpoint), Q9 (mobile + first-run acceptance).
- **`plan.md`:** insert T0/T1 as a new "Now" block ahead of Phase 1.1 (the tester round _is_ 1.1, this makes it worth running); T2 replaces the manual parts of the protocol.

## 6. Decisions I need from you

1. **Scope of the checkpoint (L16):** build it now, or only the session report and retention panel for the first round and the checkpoint after feedback? My recommendation: report and retention panel now, checkpoint after round one, since the testers' feedback will shape what "I can do this" should feel like.
2. **Feedback channel:** pre-filled GitHub issue (needs a GitHub account) or `mailto:` / WhatsApp reply for non-technical testers? Recommendation: `mailto:` plus the copyable report.
3. **Default pair on the home page:** en-GB→pt-PT for new visitors even though 5 languages ship? Recommendation: yes; saved preference wins on return visits.
