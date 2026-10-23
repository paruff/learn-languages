# Tester readiness checklist

Run before each wave of invitations (about 15 minutes). Automated checks cover layout, nav, pair choice and accessibility; this list covers what only a real device shows. Date and initial each run at the bottom.

## Automated (CI must be green)

`E2E + Accessibility Tests` passes on desktop, `mobile-chrome` and `mobile-safari`; Lighthouse passes (mobile profile).

## Devices

- [ ] **iPhone Safari, persistent storage (S8):** grade a card, open Progress; if no "Keep your progress safe" hint shows, storage was granted. If it shows, "Got it" hides it for good.
- [ ] **iPhone Safari:** open the site fresh (private tab). Home says "Learn Portuguese with Science"; Start goes to Lessons for English → Portuguese.
- [ ] **Android Chrome with page translation switched ON** (Chrome menu → Translate): no translate prompt appears, and Portuguese stays Portuguese.
- [ ] **Chrome desktop at 200% zoom:** nothing overlaps; grade buttons stay in a tidy grid.

## First-run walk (as a stranger, no help)

- [ ] Home → Start → open a lesson → the menu shows **Lessons** highlighted and a breadcrumb shows where you are.
- [ ] Practice: reveal a card, the four grade buttons sit together on one even row (or 2×2 on a narrow phone).
- [ ] Progress: the "Share how it went" box builds a report. The email link opens a message addressed to you with the report in the body. The preview contains no words from the cards.
- [ ] Offline: after one visit, switch to airplane mode and reload Practice.

## Sending the invitation

Tell testers only: the link, "10 minutes, any time", "no instructions on purpose, tell me where you got stuck", and that **Progress → Share how it went** is how to send their results. Message them yourself on day 2 and day 7.

## Run log

| Date | Who | Notes |
| ---- | --- | ----- |
|      |     |       |
