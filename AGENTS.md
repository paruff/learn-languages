# AGENTS.md — learn-languages (Acquira)

> How agents work in this repo. Claude Code reads it through the `CLAUDE.md` symlink; OpenCode and GitHub Copilot read it directly. Keep it short: when another doc owns a fact, link to it instead of copying it.

## 1. Repository purpose

**Acquira** (repo `learn-languages`) is a CEFR-aligned language-learning site: Astro 7 + TypeScript, static output on GitHub Pages, vanilla-JS islands. Content is Zod-validated YAML: language-agnostic CEFR nodes plus per-language realisations, joined by `nodeId`. Spaced-repetition state is kept per language pair and review direction. Languages and coverage: `spec.md` C4, C5.

### 1.0 What makes it a good way to learn

The learning loop is the product. A feature must strengthen one of these mechanisms (or remove friction from it); anything else is polish, and polish waits (intent P1). Requirements are in `spec.md` §2; evidence in `docs/learning-science-references.md`.

- **Retrieval:** prompt → attempt → reveal → self-grade; the answer never shows first (L1, `review.astro`)
- **Spacing:** SM-2 in `src/utils/srs.ts` (L2; FSRS planned, L22)
- **Interleaving:** the due queue is round-robined across nodes (L3, `src/lib/reviewSession.ts`)
- **Generation:** opt-in typed recall (L4, L26)
- **Calibration:** confident grades soon followed by Again/Hard are flagged (L5)
- **Dual coding:** optional images with alt text (C7)
- **Zero surveillance:** no accounts, cookies or trackers; `localStorage` only (intent P3)

### 1.1 Delivery stage

Pre-validation: no persona-matched learner has been observed yet, and the biggest risk is that learners don't come back (intent §3). Match process weight to that:

- A thin, working loop in front of real learners beats a complete schema or more content. Goal G1 (#21) gates new content and features (`plans/README.md` Rules).
- CI holds what a pre-launch static site needs. SAST, SBOM and artifact signing were removed on purpose; bring them back once there are real users.
- Spikes and throwaway prototypes may skip the skill ceremony in §2. Feature and content-model work may not.

## 2. How work flows

**Read first:** `intent.md` → `spec.md` → `plans/README.md` → the board (§12). Read `DESIGN.md` before UI work and `REVIEW.md` before reviewing.

- Work traces to a plan row (issue + milestone) and a `spec.md` ID; add them first if they're missing. Behaviour changes update `spec.md` in the same PR.
- Detail plans go in `plans/YYYY-MM-DD-<topic>.md`; finished ones move to `plans/archive/`.
- Questions for the owner are `question` issues (§12.5), never lists in docs.

Use the Superpowers skills in this order (installed by `opencode/sync.sh`, see `opencode/README.md`):

| Task                 | Skills                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| New feature / design | brainstorming → writing-plans → executing-plans → test-driven-development → verification-before-completion → requesting-code-review |
| Bug fix              | systematic-debugging → writing-plans → test-driven-development → verification-before-completion → requesting-code-review            |
| Refactor             | writing-plans → test-driven-development → verification-before-completion → requesting-code-review                                   |
| Documentation        | writing-plans → executing-plans → verification-before-completion                                                                    |

Non-negotiable: root cause before a bug fix, a failing test before production code, evidence before "done", review before merge.

**Where things live:**

| Document                  | Owns                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| `intent.md`               | Why: problem, personas, outcome, success signals, principles, non-goals       |
| `spec.md`                 | What: requirement IDs, the check that verifies each, status                   |
| `plans/README.md`         | Order of work: goals G1–G5 and every open issue. Status is on the board (§12) |
| `DESIGN.md`               | UI/UX design system: cite it for every UI decision                            |
| `REVIEW.md`               | How to review a change. Copilot code review reads it automatically            |
| `specification-design.md` | Original architecture, data model and SRS maths. Frozen reference             |
| `discovery-brief.md`      | Original JTBD, personas and risks. Historical record                          |
| `CHANGELOG.md`            | Keep a Changelog, updated in the PR that makes the change                     |

## 3. GitOps

`main` is production. It deploys only through `.github/workflows/pipe.yml` on push, never by hand. Every change is a reviewed commit; rollback is `git revert` on `main`.

## 4. Code conventions

- **Where things are:** `src/lib/` holds the pure, unit-tested core (SRS, storage, progress, pairing); routes are under `src/pages/[sourceLang]/[targetLang]/`; content YAML is in `src/content/` (`cefr-nodes/`, `realisations/<lang>/`). The schemas are in `src/content.config.ts`; read them there, don't copy them.
- **Rules:** no code path names a specific language (intent P4). All storage goes through `src/lib/storage.ts`. UI text goes through `src/lib/strings.ts`.
- **Styling:** vanilla CSS with tokens in `src/styles/global.css` and BEM class names; no CSS frameworks. Which token or component to use: `DESIGN.md`.

### 4.4 Client interactivity

Static HTML by default. Interactivity is vanilla TypeScript in component `<script>` blocks or custom elements (e.g. `<audio-player>`); no UI framework runtime is shipped.

## 5. CI gates (`pipe.yml`)

Every PR runs all of these, and any failure blocks merge (no `continue-on-error`). On `main` the site then deploys to GitHub Pages, and smoke tests plus Lighthouse run against the live URL (spec D1).

### 5.2 Thresholds

| Gate                | Passes when                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| Typecheck, lint     | 0 errors, 0 warnings (`npm run typecheck`, `npm run lint`: ESLint + Prettier on `src`, `tests`) |
| Content             | `npm run validate:content` passes; `npm audit --omit=dev --audit-level=high` is clean           |
| CEFR coverage       | `npm run check:coverage` holds the committed baseline                                           |
| Unit coverage       | ≥90% lines, functions and statements, ≥80% branches (`vitest.config.ts`)                        |
| Build               | `astro build` succeeds                                                                          |
| E2E + accessibility | Playwright on five browser projects, axe on every page                                          |
| Lighthouse          | The budgets in spec Q5 (`lighthouserc.json`)                                                    |
| Empty diff guard    | A PR changes at least one file                                                                  |

## 6. Testing

- **Unit:** Vitest, `src/**/*.test.ts`, mostly `src/lib/`. `schedule()` keeps 100% coverage.
- **Integration:** `npm run test:integration` (`vitest.integration.config.ts`).
- **E2E:** Playwright in `tests/e2e/`, run against the built `dist/` (`npm run test:e2e` builds first); axe in `a11y.spec.ts`.

### 6.2 TDD

Write one failing test, watch it fail for the right reason, write the least code that passes, then refactor while green (`test-driven-development` skill).

## 7. Privacy and security

Privacy rules are intent P3 and spec S3, S7: no PII, accounts, cookies or third-party requests; state lives in `localStorage` through `storage.ts`. The security checklist for every review is `REVIEW.md` §4. In CI: `npm audit`, the committed lockfile with `npm ci`, and least-privilege workflow `permissions:`.

## 8. Accessibility

WCAG 2.1 AA. axe runs on every page in the E2E job, and nothing merges while it's red. Patterns (focus, reduced motion, alt text, skip link): `DESIGN.md` §8.

## 9. Versioning (SemVer 2.0)

Breaking change → MAJOR, `feat` → MINOR, `fix` / `perf` / `content` → PATCH. **Before 1.0, a breaking change bumps MINOR.**

### 9.3 Content schema

A CEFR node schema change is breaking. A new optional realisation field is MINOR. Adding content without a schema change is PATCH.

**Release:** bump `package.json`, move CHANGELOG `[Unreleased]` under the new version, `git tag -a vX.Y.Z -m "Release vX.Y.Z"`, push the tag.

## 10. Commits

Conventional Commits: `<type>(<scope>): <summary>`, imperative, ≤72 characters. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, plus **`content`** for content-only changes. A breaking change uses `!` and a `BREAKING CHANGE:` footer. Examples: `feat(review): …`, `fix(srs): …`, `content(vocab): …`. Edits to `intent.md` go in their own `docs(intent):` PR.

## 11. Git hooks (lefthook)

`npm install` installs the hooks (`prepare` script).

- **pre-commit:** Prettier and ESLint on staged `src/` and `tests/` files (lint-staged), and `tsc --noEmit`.
- **pre-push:** `npm run validate:content` and the unit tests. E2E runs in CI.
- Never use `--no-verify`. The hooks don't check docs outside `src/` and `tests/`: run `npx prettier --write <file>` on them yourself.

## 12. Workflow: board, goals, decisions, review

Anyone (owner, Claude Code, OpenCode, Copilot) answers "what's next?" and "what waits on a human?" from the **Acquira** GitHub Project board, never from memory or a doc. The board's **Status** is the only place status lives: no status labels, no ✅ in plan rows. Goal membership is the issue's **milestone** (G1–G5). Order and traceability are in `plans/README.md`.

### 12.1 Status values

| Status          | Means                                                                                   | Moved here by                        |
| --------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| Backlog         | Not ready yet, or its goal is gated                                                     | Auto-add (new issues); anyone        |
| Ready for agent | Its goal is open, it has a spec ID (or "n/a: bug/polish") and an **Exit criterion**     | Owner or agent                       |
| In progress     | Claimed. Move it here **before** starting so no one else picks it                       | Whoever starts it or assigns Copilot |
| Needs human     | Waiting on the owner: a decision, a PR to review and merge, or work only a human can do | Agent, when it opens the PR or asks  |
| Blocked         | Can't move until something named in the issue happens                                   | Anyone                               |
| Done            | Closed                                                                                  | Built-in workflow                    |

### 12.2 Goals and gates

Each milestone has one **goal issue** (label `plan`), assigned to whoever drives that goal. Its Status is the gate: **In progress** means the goal is open, **Blocked** means it's gated (the body names what opens it, from `plans/README.md` Rules). Only move an issue to _Ready for agent_ if its goal issue is not Blocked; owner exceptions are written in the plan's goal section. Don't assign goal issues to `@copilot`: it would try to do a whole goal in one PR.

### 12.3 Commands

```bash
P=$(gh project list --owner paruff --format json --jq '.projects[] | select(.title=="Acquira") | .number')

# 1. Next item for an agent: lowest goal, then lowest issue number.
#    Working inside an assigned goal? Add  milestone:"<goal title>"  to the query.
gh project item-list "$P" --owner paruff --limit 200 --query 'status:"Ready for agent" is:open -label:plan' --format json \
  --jq '.items | sort_by(.milestone.title // "~", .content.number) | .[:1][] | "#\(.content.number) \(.title)"'

# 2. Waiting on a human: board items, then every open non-draft PR (each waits on a merge decision)
gh project item-list "$P" --owner paruff --limit 200 --query 'status:"Needs human" is:open' --format json \
  --jq '.items[] | "#\(.content.number) \(.title)"'
gh pr list --state open --draft=false

# Goal gates at a glance
gh project item-list "$P" --owner paruff --limit 200 --query 'label:plan' --format json \
  --jq '.items[] | "\(.status)\t#\(.content.number) \(.title)"'

# Move an item
gh project item-edit "$P" --owner paruff --url https://github.com/paruff/learn-languages/issues/<n> --field Status --value "In progress"
```

### 12.4 Lifecycle of an issue

1. **Pick:** command 1, or the owner points you at an issue. Move it to _In progress_, then branch.
2. **Work:** the skill sequence in §2. UI work follows `DESIGN.md`.
3. **PR:** the body says `Closes #<n>`. Self-review against `REVIEW.md`, then move the issue to _Needs human_. Optional second opinion: `gh pr edit <pr> --add-reviewer @copilot`.
4. **Changes requested:** back to _In progress_. **Stuck:** _Blocked_, with a comment naming the blocker.
5. **Merge:** the owner merges, the issue closes, and the board sets _Done_. Delete the row from `plans/README.md` (its Rule 4).

New issues use the templates in `.github/ISSUE_TEMPLATE/` (agents: the same headings in `--body`) and get a milestone. Add `--project Acquira` to `gh issue create` so the issue lands on the board straight away.

### 12.5 Decisions for the owner

A question only the owner can answer is an issue: the `question` label, assigned to `paruff`, using the "Question for the owner" template headings, then moved to _Needs human_. The owner answers in the issue and closes it. Whoever applies the answer records its effect where it belongs (`spec.md`, `plans/README.md`) with a link to the issue. Don't keep question lists in docs.

### 12.6 GitHub Copilot

- **Hand it an issue:** move the issue to _In progress_, then `gh issue edit <n> --add-assignee @copilot`. Copilot reads this file. Its environment comes from `.github/workflows/copilot-setup-steps.yml`.
- **Failing CI:** open (or reuse) an issue that links the failed run and names the job, then assign it to `@copilot`.
- **Review:** `gh pr edit <pr> --add-reviewer @copilot`. Copilot code review reads `REVIEW.md` and this file automatically.
- Copilot can't move board items. Its PRs show up in command 2 through `gh pr list`.

## 13. Definition of done

- The issue's exit criterion is met, with the check that proves it.
- CI is green (§5).
- Self-reviewed against `REVIEW.md` with no Critical or Important findings open; the issue is in _Needs human_ with the PR linked.
- `spec.md`, `CHANGELOG.md` (for user-visible changes) and any affected docs are updated in the same PR.
- Commits follow §10. The version is bumped at release (§9).

## 14. Key commands

```bash
npm run dev               # Astro dev server (background)
npm run build             # static build to dist/
npm run typecheck         # tsc --noEmit
npm run lint              # ESLint + Prettier check on src/ and tests/
npm run validate:content  # Zod schemas + content integrity
npm test                  # unit tests with coverage gate
npm run test:integration  # integration tests
npm run test:e2e          # builds, then Playwright (E2E + axe)
npm run check:coverage    # CEFR concept-coverage gate; report:coverage for details
npm run install:browsers  # Playwright browsers through a local relay
bash opencode/sync.sh     # install the opencode config from opencode/
```

- **opencode config:** edit `opencode/` in this repo, then run `bash opencode/sync.sh` and restart opencode. `~/.config/opencode` is an install target; hand edits there are overwritten. Details: `opencode/README.md`.
- **Playwright browsers:** the stock downloader hangs on the owner's network, so `npm run install:browsers` fetches the builds with curl through a local relay. Re-run it after every Playwright version bump.
