# Plan — leaner AGENTS.md

**Starts after:** PR #264 is merged (it rewrites AGENTS.md §12 and fixes earlier drift). Branch from the updated `main`: `docs/lean-agents-md`.
**Goal:** cut AGENTS.md from ~590 lines to ~200 without losing a rule. Every fact lives in the one doc that owns it; AGENTS.md keeps only what an agent needs to act, plus links.
**Plan row:** G5, under #274 (workflow docs) or a new G5 issue, as the owner chooses.

## Constraints

- **Keep section numbers that other files link to**, or update the link in the same PR: §1.0 (`intent.md`, `docs/learning-science-references.md`), §2 (`plans/README.md`), §4.4 (`DESIGN.md`), §5 and §5.2 (`spec.md`, `docs/fr-cefr-mapping.md`), §6.2 (`REVIEW.md`), §9 and §9.3 (`CHANGELOG.md`, `plans/2026-10-18-…`), §12.x (`plans/README.md`, `spec.md`, the setup script, `copilot-setup-steps.yml`). Find them with `git grep -n 'AGENTS.md §'`.
- **Keep §12 (workflow) as it is.** It was just written and verified against the live board.
- No new rules. Anything removed is either a copy of another doc or untrue.

## Audit: section by section

| §   | Now                                                                 | Problem                                                                                                                                                                 | Action                                                                                                                                     |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| —   | Header blurb and closing footer                                     | Boilerplate                                                                                                                                                             | One line: what the file is, which tools read it, "link, don't copy"                                                                        |
| 1   | Purpose paragraph                                                   | Long history ("originally EN→PT")                                                                                                                                       | 3 lines: stack, content model, link to spec C4/C5                                                                                          |
| 1.0 | 7 mechanisms, a paragraph each                                      | Repeats spec §2 and intent P1                                                                                                                                           | One line per mechanism with its spec ID; keep the "learning mechanism or polish" test                                                      |
| 1.1 | Delivery stage                                                      | Useful, wordy                                                                                                                                                           | 3 bullets                                                                                                                                  |
| 2   | Read-first paragraph, mermaid diagram, table, NEVER list, red flags | Same skill sequence said 4 ways; the skills enforce themselves                                                                                                          | Read-first line, the table, one "non-negotiable" line. Move the §16 document map here                                                      |
| 3   | 7-row GitOps principles table                                       | Generic                                                                                                                                                                 | 2 lines: `main` = production via `pipe.yml` only; rollback = `git revert`                                                                  |
| 4   | Project tree, content schema code block, styling, islands           | The schema block is **stale** (no `concept` field, undefined `realisationSchema`) and duplicates `src/content.config.ts`; the tree is partial                           | Key paths only; point to `content.config.ts`; add the non-obvious rules (no per-language code paths, `storage.ts`, `strings.ts`); keep 4.4 |
| 5   | Stage list, gates table, deploy                                     | Lists the same gates twice. **Wrong:** "lint on staged files"; coverage "≥90%" isn't what CI enforces; omits npm audit, the CEFR coverage gate and the empty-diff guard | One accurate list matching the `pipe.yml` jobs; keep §5.2 as the gate list (linked from elsewhere)                                         |
| 6   | Test pyramid, TDD rules                                             | The TDD rules copy the TDD skill                                                                                                                                        | 4 bullets: unit, integration (`npm run test:integration`), E2E against `dist/`, TDD in one line; keep the §6.2 anchor                      |
| 7   | Privacy and security tables                                         | **Stale:** "Vue escapes interpolations, no `v-html`", "Dependabot enabled" (no `dependabot.yml` exists); repeats intent P3 and REVIEW.md §4                             | 2 lines linking intent P3, spec S3/S7 and REVIEW.md §4; keep the true CI facts (`npm audit`, `npm ci`, least-privilege permissions)        |
| 8   | Accessibility table                                                 | Repeats DESIGN.md §8                                                                                                                                                    | 1 line: AA, axe on every page in CI, patterns in DESIGN.md §8                                                                              |
| 9   | SemVer format, generic bump table, content rules, release steps     | Generic SemVer explanation                                                                                                                                              | Keep the project-specific content-schema rules (§9.3 is linked) and a 1-line release recipe                                                |
| 10  | Conventional Commits format, types, scopes, breaking, examples      | Mostly the public spec                                                                                                                                                  | Types including the custom `content` type, the breaking-change rule, 3 examples                                                            |
| 11  | Lefthook install, config copy, lint-staged copy, behaviour table    | **Wrong:** says install with `go install` (it's `npm`'s `prepare`), copied config shows pre-push E2E (it's commented out) and old globs                                 | 3 true lines: what pre-commit and pre-push run, never `--no-verify`, docs outside `src/`/`tests/` need a manual Prettier run               |
| 12  | Workflow                                                            | —                                                                                                                                                                       | Keep                                                                                                                                       |
| 13  | Definition of Done                                                  | "live-system" tests and "API" wording don't fit                                                                                                                         | 5 bullets aligned with REVIEW.md §10                                                                                                       |
| 14  | Commands                                                            | **Wrong:** `npm run lighthouse` doesn't exist; `git status` padding                                                                                                     | Real scripts only (`package.json`); keep the opencode and Playwright notes                                                                 |
| 15  | References (external links)                                         | Agents don't need the Astro/SemVer homepages                                                                                                                            | Delete                                                                                                                                     |
| 16  | Document map                                                        | Useful                                                                                                                                                                  | Move into §2                                                                                                                               |

## Decision for the owner

**Decided (#276):** CI enforces 90% lines, functions and statements and 80% branches (`vitest.config.ts`). Tests for `src/lib/pronounce.ts` lifted coverage so the gate holds.

## Steps

1. Branch from the updated `main` after #264 merges.
2. Rewrite §1–§11 and §13–§16 per the table; leave §12 untouched.
3. `git grep -n 'AGENTS.md §'` and fix any link whose target moved.
4. Check every command and file path in AGENTS.md exists (`package.json` scripts, `pipe.yml` jobs, paths).
5. `npx prettier --write AGENTS.md`; confirm the `CLAUDE.md` symlink still resolves.
6. Commit `docs(agents): trim AGENTS.md to what agents act on`, open the PR, move its issue to _Needs human_.

## Done when

- AGENTS.md is about 200 lines, and every removed rule is either untrue or owned by another doc that AGENTS.md links.
- No broken `AGENTS.md §` links in the repo.
- Every command in it runs, and every path in it exists.
