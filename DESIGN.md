# Design — Acquira UI/UX design system

> **What this file is:** the reference for every UI or UX decision. A UI issue cites the section it relies on (`Design: DESIGN.md §n`), and a PR that changes the system updates this file in the same PR.
> It explains _when and why_ to use each piece. Values live in code: tokens in [`src/styles/global.css`](src/styles/global.css), copy in [`src/lib/strings.ts`](src/lib/strings.ts). Behaviour requirements live in [`spec.md`](spec.md) and are cited by ID, not restated.
>
> The general-purpose `visual-design`, `design-system-workflow`, `component-workflow`, `ux-audit` and `accessibility-workflow` skills are written for another site (Jekyll/Liquid). Don't apply them here; this file is the reference.

## 1. How to use this file

- **Before UI work:** read §2 and the sections your change touches. If nothing here covers it, propose the addition in the issue first.
- **In review:** [`REVIEW.md`](REVIEW.md) §7 checks UI changes against this file.
- **Learner journey findings** (what confuses real learners) are in [`plans/2026-10-22-learner-journey-ux-audit.md`](plans/2026-10-22-learner-journey-ux-audit.md). Fixes that become rules land here.

## 2. Principles

Decide ties in this order:

1. **The learning loop comes first.** A UI change must make retrieval, spacing, feedback or the next step easier. Otherwise it's polish, and polish waits (intent P1).
2. **One goal and one next step.** Every page shows where the learner is and the single thing to do next (spec J1). Don't add a second call to action that competes with Continue.
3. **No dark patterns.** No streaks, guilt copy, fake urgency, nagging or ads (intent §6).
4. **Content first, little chrome.** Lesson text and the card in front of the learner matter more than navigation.
5. **Works without JavaScript and offline.** Lesson content is static HTML (Q2). Scripts add interaction on top (Q7).
6. **Plain language.** Short sentences, no jargon. CEFR terms appear only where the learner needs them (#212).

## 3. Tokens

Use a token, never a raw value. If you need a value that has no token, add the token to `global.css` and a row here.

| Role              | Tokens                                                                                                   | Use it for                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Brand             | `--color-primary`, `--color-primary-hover`                                                               | Primary buttons, progress fill, brand marks. Same in both themes                                           |
| Links and nav     | `--color-link`, `--color-link-hover`                                                                     | Text links, current nav item. Changes per theme for contrast                                               |
| Warm accent       | `--color-accent-warm`, `--color-accent-warm-hover`                                                       | Decorative motifs and the C2 badge only. Use sparingly                                                     |
| Grades            | `--color-error` (Again), `--color-warning` (Hard), `--color-grade-good` (Good), `--color-success` (Easy) | Only the four grade buttons and their meaning. Good has its own blue so all four stay distinct at a glance |
| State             | `--color-success`, `--color-warning`, `--color-error`                                                    | Feedback messages that match the grade meaning                                                             |
| Surfaces and text | `--color-bg`, `--color-bg-secondary`, `--color-text`, `--color-text-muted`, `--color-border`             | Page, secondary surfaces, body and muted text, dividers                                                    |
| Focus             | `--color-focus`                                                                                          | The 2px focus outline (§8)                                                                                 |
| Type              | `--font-sans` (body), `--font-display` (headings, brand), `--font-mono`                                  | Body is the system font stack. Fraunces is self-hosted and used only for headings and the brand            |
| Space             | `--spacing-unit` (8px), in multiples: `calc(var(--spacing-unit) * n)`                                    | All margins, padding and gaps                                                                              |
| Shape and depth   | `--radius`, `--radius-lg`, `--shadow-sm`, `--shadow-md`                                                  | Controls use `--radius`, cards use `--radius-lg`                                                           |
| Motion            | `--transition-fast` (150ms), `--transition-normal` (250ms)                                               | Hover/press feedback and progress changes. Reduced motion turns them off globally                          |

**Dark mode** follows `prefers-color-scheme` and only redefines tokens. Never write a component rule that checks the theme itself; the CEFR level badges are the one existing exception.

**Known raw values:** grade-button hover colours and CEFR badge colours are hard-coded in `global.css`. Move them to tokens when you next touch them.

## 4. Layout and responsive

- Content sits in `.container`: up to 800px wide, with a 16px side gutter.
- The header is sticky. The footer carries the feedback link (spec U5).
- Mobile first. Layout must hold at **320, 375 and 1280px** with no horizontal scroll. These are the widths `tests/e2e/layout.spec.ts` checks.
- One breakpoint is in use (`max-width: 480px`). Add a breakpoint only when a layout actually breaks, and note it here.

## 5. Components

Building blocks are BEM classes in `global.css` plus a few Astro components. Reuse them before adding new ones.

| Piece                                              | Where                                       | Contract                                                                                                      |
| -------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `BaseLayout`                                       | `src/layouts/BaseLayout.astro`              | Every page. Header with main nav, `<main class="container">`, footer, Fraunces `@font-face`, `translate="no"` |
| `LessonLayout`                                     | `src/layouts/LessonLayout.astro`            | Lesson pages. Renders build-time lesson HTML                                                                  |
| `Breadcrumb`                                       | `src/components/Breadcrumb.astro`           | Lesson and exercise pages: section → lesson Can-Do title (U3)                                                 |
| `ContinueCard`                                     | `src/components/ContinueCard.astro`         | The one goal and next step (J1): current level, lesson n of m, Continue                                       |
| `LanguagePairSelector`                             | `src/components/LanguagePairSelector.astro` | "I speak → I'm learning", language names, stays on the same kind of page (U6, U1)                             |
| `<audio-player>`                                   | `src/components/audio-player/`              | Custom element with shadow DOM for recorded audio                                                             |
| `.btn` + `--primary` / `--secondary` / `--grade-*` | `global.css`                                | One primary button per view. Grade buttons only in review                                                     |
| `.card`, `.badge--a1…c2`, `.progress-bar`          | `global.css`                                | Grouped content, CEFR level label, progress                                                                   |
| `.sr-only`, `.skip-link`                           | `global.css`                                | Screen-reader text. `BaseLayout` renders `.skip-link` first on every page; it targets `<main id="main">` (U7) |

**Interactive islands** are vanilla TypeScript in `<script>` blocks or custom elements. No UI framework runtime is shipped (AGENTS.md §4.4).

## 6. Interaction patterns

| Pattern         | Rule                                                                                              | Spec     |
| --------------- | ------------------------------------------------------------------------------------------------- | -------- |
| Review loop     | Prompt → attempt → reveal → grade. Nothing on screen gives the answer away before the attempt     | L1       |
| Grade buttons   | Again / Hard / Good / Easy, equal width, one row or 2×2 on narrow screens, never an orphan button | U4       |
| Typed recall    | Highlight the characters that differ and pre-select a suggested grade the learner can change      | L4, L26  |
| After "Again"   | Show the example sentence, its translation and any grammar note before the card comes back        | L10      |
| Session start   | State the Can-Do statements the due cards serve                                                   | L11      |
| Navigation      | Mark the current section with `aria-current="page"`; lesson and exercise pages have a breadcrumb  | U3       |
| Pair choice     | Home, header and Start agree on one pair; it never changes on the way to the first card           | U1, Q9   |
| Translation     | Pages opt out of browser auto-translation so the target language is never rewritten               | U2       |
| Recommendations | Recommend; never lock content                                                                     | L12, L27 |
| Optional extras | Reflection, planning the next session, typed mode: skippable, off the main path, never nagging    | L6, L21  |

## 7. Copy and voice

- All UI text goes through `src/lib/strings.ts`, keyed by the learner's _source_ language with an en-GB fallback. Don't hard-code strings in templates.
- Lesson titles are the node's Can-Do statement.
- Tell the learner what to do next, not how they're doing against other people. No streak, score-chasing or guilt copy.
- Name languages in words (`languageName()` in `src/lib/languageNames.ts`), not codes, wherever the learner sees them (U6).

## 8. Accessibility

WCAG 2.1 AA, checked by axe on every page in CI (Q4). Additionally:

- Visible focus on every control: 2px `--color-focus` outline, 2px offset. Never remove focus without a replacement.
- Colour is never the only signal: grade buttons carry their label text.
- Reduced motion is handled globally in `global.css`. New animation must respect it.
- Every image has alt text (C7). Decorative SVG gets `aria-hidden="true"`.
- Hidden state uses the `hidden` attribute (`global.css` forces `display: none` for it).

## 9. Performance

- Lighthouse mobile: Performance ≥95, Accessibility 100 (Q5).
- No UI framework, no third-party scripts, styles or fonts (S3). Fonts are self-hosted in `public/fonts/`.
- Prefer CSS over JavaScript for anything visual. Animate `transform` and `opacity` only.

## 10. Changing the design system

Change `global.css` (or the component) and this file in the same PR, and cite the reason (a spec ID, an audit finding or learner feedback). Removing or renaming a token means updating every use in the same PR.
