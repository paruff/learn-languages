# Intent — Acquira (learn-languages)

> **What this file is:** the _why_ and the _what-good-looks-like_. It changes rarely and only on purpose.
> Every spec and plan in this repo must trace back to something here. If a proposed change can't, either the change is wrong or this file needs an explicit, reviewed edit first.
>
> Flow: **intent.md** (why) → **spec.md** (what the product must do) → **plan.md** (what we do next, in what order) → issues/PRs (how).

## 1. Problem

Independent adult language learners with fragmented time (commutes, 5–10 minute gaps) don't have a tool that is at once:

- **Structured against a real standard** (CEFR Can-Do statements), not an app's private curriculum
- **Built on how memory actually works** (retrieval practice, spacing, interleaving), not on engagement mechanics
- **Respectful**: no account, no ads, no streak-guilt, no tracking, works offline

Existing options make trade-offs: Duolingo is gamified, Babbel needs a backend account, and most apps don't trace progress back to CEFR. (Source: `discovery-brief.md` §1, which stays as the historical record.)

## 2. Who it's for

| Persona                     | What they need from us                                               |
| --------------------------- | -------------------------------------------------------------------- |
| **Commuter Carlos**         | A useful session in under 15 minutes, offline, without needing audio |
| **Fragmented-Time Fiona**   | Instant resume, no onboarding, value in 5 minutes                    |
| **Credential-Seeker Chloe** | Progress mapped to CEFR Can-Do statements that she can show someone  |
| **Pronunciation Pedro**     | The right regional voice (pt-PT, not pt-BR; es-ES, not es-MX)        |

## 3. Desired outcome

> **A learner who opens Acquira for 10 minutes measurably remembers more of a CEFR-mapped language than they would have from re-reading, and comes back the next day without being nagged.**

The first half is the learning mechanism (spec §2). The second half (_comes back_) is the **biggest unvalidated risk** (discovery-brief R3) and the main thing this repo has to prove next.

## 4. Success signals

Ordered by how soon we can observe them. Earlier signals gate later investment.

| #   | Signal                                                                | Status (2026-10-04)                              |
| --- | --------------------------------------------------------------------- | ------------------------------------------------ |
| S1  | 3–5 persona-matched first-time learners finish session 1 without help | **Not yet measured**: 1 informal owner run (#21) |
| S2  | Some of them return on day 2 without a reminder                       | **Not yet measured**                             |
| S3  | 40% week-2 return rate                                                | Needs real users and opt-in measurement          |
| S4  | 60% of A1 vocab reviewed reaches an SRS interval of more than 21 days | Needs real users                                 |
| S5  | Lighthouse Performance ≥95 and Accessibility 100 on every page        | Enforced in CI                                   |

## 5. Principles (decide ties with these)

1. **Learning mechanism over decoration.** A feature must strengthen retrieval, spacing, interleaving, generation, calibration, or dual coding, or remove friction from them. Otherwise it is polish, and polish waits. (AGENTS.md §1.0; evidence base and source tiers: `docs/learning-science-references.md`)
2. **Evidence before investment.** Don't build more content or UI on a loop no learner has validated. Content volume is the cheapest thing to add later.
3. **Zero surveillance.** No accounts, cookies, PII, or third-party scripts. State lives in `localStorage` only. Any measurement is opt-in, anonymous, and self-hosted.
4. **Language-agnostic core.** CEFR nodes are abstract. Languages are realisations joined by `nodeId`. No code path names a specific language.
5. **Static and free to run.** GitHub Pages, no backend, no running costs.
6. **Human-reviewed content.** AI may draft content, but nothing ships without verification against an authoritative CEFR source (Referencial Camões, PCIC, Profile Deutsch, Référentiel FLE).

## 6. Non-goals

| Non-goal                                     | Why                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| Accounts, cloud sync, multi-device state     | Breaks principle 3. Revisit only if retention is proven and users ask for it |
| Formal CEFR certification or assessment      | We map to CEFR; we don't certify against it                                  |
| Native mobile apps                           | The web plus offline support covers the persona needs                        |
| Live tutoring or social features             | Out of scope for a static product                                            |
| Gamification: streaks, XP, leaderboards, ads | Directly contradicts the problem statement                                   |
| Unreviewed AI-generated content              | Principle 6                                                                  |

## 7. Constraints

- Astro 5.x static output on GitHub Pages; vanilla-JS islands; no CSS framework
- Zod-validated YAML content; the build fails on invalid content
- WCAG 2.1 AA; reduced-motion respected
- Conventional Commits and SemVer; `main` is production (GitOps)

## 8. Changing this file

Edit it in its own PR with a `docs(intent):` commit, and say which spec or plan sections the change affects. Intent edits are rare by design. If you're editing this file often, the edits probably belong in `spec.md` or `plan.md`.
