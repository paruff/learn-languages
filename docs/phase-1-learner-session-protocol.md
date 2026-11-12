# Phase 1 Learner Session Protocol

The remaining blocker for plans G1 (#21, decision on #266): direct observational evidence for or against "learners return after session 1" (intent §3, SIG1, SIG2). This can't be produced from a coding session — it needs a human to run real sessions with real people and report back. This doc exists so that person doesn't have to figure out what to do from scratch.

## Who

3-5 people matching a `intent.md` persona (`intent.md` §2):

- **Commuter Carlos** — uses dead time, offline, short sessions
- **Fragmented-Time Fiona** — 5-10 min bursts, needs instant resume, no onboarding

Don't recruit people who already know Portuguese — the point is testing whether an A1 beginner can use the review loop, not whether the content is accurate.

## Before you start

- **Screen:** an adult, not already a Portuguese speaker, with 5–15 minutes free on a phone or laptop they own, who is willing to be observed once and emailed on day 2 and day 7. Recruit through your own contacts; the observer is the owner or someone they name.
- **Consent line (read aloud, once):** "I'm watching how the site works, not testing you. I'll note what you do and say, and I'll email you in two days and a week. Nothing is recorded; you can stop any time."
- **Anonymity:** label learners L1, L2, L3… in everything written down and posted on #21. No names, emails, ages or employers in the issue.
- **Device checklist** (`docs/tester-readiness.md`) is run and logged first (plans row T1.2). It includes the S8 iOS Safari storage check and the regional-voice check.

## What to give them

The home page of the site, on their own device. Say nothing else: no walkthrough, no explanation of SRS or CEFR. Starting at the home page tests the path that spec Q9 and intent SIG7 measure; don't hand over `/review/` directly. If they need instructions to get started, that's a finding, not a setup step to fix first.

Observer script: "Please use this to start learning some Portuguese. Say out loud what you're thinking." Then stay quiet. Only answer "what should I do?" with "what would you do if I weren't here?". Stop after the first graded session or 15 minutes.

## What to observe (session 1)

- Do they understand what to do without being told? (reveal → grade)
- Where do they hesitate or ask "what does this button do"?
- Do they finish the 10-card session, or abandon partway? If they abandon, at what point?
- Any confusion about the four grade buttons (Again/Hard/Good/Easy): is the difference between Hard and Again clear?

## What to record

| Learner | Persona match | Completed unaided? | Abandoned at | Notable friction (severity 1–3) | Returned day 2 unprompted? | Returned day 7 (±1 day)? | Report received? |
| ------- | ------------- | ------------------ | ------------ | ------------------------------- | -------------------------- | ------------------------ | ---------------- |
|         |               |                    |              |                                 |                            |                          |                  |

On day 2 and day 7, email the learner a neutral "did you use it?" note only if they haven't already. Ask them to open Progress → "Share how it went" and email you the text; paste it, anonymised, into the table row. "Returned" means a graded card on that day, as shown in their report. Friction severity: 1 = stopped them, 2 = slowed them, 3 = they only mentioned it.

## Decision rule (n = 3–5)

Count learners who completed session 1 unaided (A) and learners who returned on day 2 unprompted (B), out of n.

- **Positive:** A ≥ 3 of 5 (or 2 of 3, 3 of 4) **and** B ≥ 1. Start G3.
- **Negative:** A < half of n, **or** B = 0 with every learner reached. Don't build more content or UI; rescope from the friction found.
- **Unclear:** anything else. Run a larger or more targeted round.

This is a signal, not a statistically valid sample. The thresholds are intent SIG1 and SIG2.

## Where to record it

Post the filled table as a comment on #21, then give the verdict on #266 (the owner's decision, plans row 1.4). The owner moves G3 accordingly.
