# Discovery Brief — Portuguese Learning Platform (PLP)

> **Status note:** this brief captures the *original* MVP scoping (EN→PT, A1 only) and is kept as-written for historical record — it is not a living document. The product has since expanded past this scope (es-ES/de-DE/pt-PT now have full A1–C2 content, fr-FR has a walking skeleton — Epic #39) while the JTBD/personas/risks below remain the founding rationale. See `AGENTS.md` §1 for current state.

## 1. Problem Statement

**Who:** Independent adult learners of European Portuguese (PT-PT) at CEFR A1 level.

**What:** They lack a structured, offline-capable, CEFR-aligned learning tool that respects their time constraints and cognitive load limits. Existing apps are either gamified (Duolingo), backend-dependent (Babbel), or lack CEFR traceability.

**Why it matters:** Learners with fragmented schedules (commuters, parents, shift workers) need deterministic progress tracking against an internationally recognised framework (CEFR), without forced streaks, ads, or data collection.

## 2. Jobs-to-Be-Done (JTBD)

| Job ID | When… | I want to… | So that… |
|--------|-------|------------|----------|
| JTBD-1 | I have 10 minutes on the bus | Review due flashcards offline | I make progress without signal |
| JTBD-2 | I'm planning my week | See which Can-Do statements I've mastered | I focus study time on gaps |
| JTBD-3 | I encounter a new phrase | Hear native pronunciation | I internalise correct phonology |
| JTBD-4 | I reach a milestone | Export a portable progress record | I can show a tutor or employer |
| JTBD-5 | I switch between EN↔PT | Keep separate SRS state per direction | I don't contaminate recall data |

## 3. Personas

| Persona | Primary Motivation | Key Constraints |
|---------|-------------------|-----------------|
| **Commuter Carlos** | Uses dead time (commute) | Offline, <15 min sessions, no audio-out in public |
| **Credential-Seeker Chloe** | Needs CEFR proof for visa/job | Must export verifiable progress, values structure |
| **Fragmented-Time Fiona** | Studies in 5-10 min bursts | Low friction entry, instant resume, no onboarding |
| **Pronunciation-Pedro** | Wants authentic PT-PT accent | TTS must use pt-PT voice, not pt-BR |

## 4. Acceptance Criteria (MVP)

| AC ID | Criterion | Test Type |
|-------|-----------|-----------|
| AC-1 | A1 vocabulary items with SRS interval ≥21 days count as "mastered" | Unit (SRS) |
| AC-2 | All CEFR A1 Can-Do statements have paired EN/PT realisations | Content validation |
| AC-3 | Review session persists state across browser reloads | E2E (Playwright) |
| AC-4 | Language pair switch updates all content without page reload | E2E |
| AC-5 | TTS uses `pt-PT` voice, not `pt-BR` | Integration |
| AC-6 | Lighthouse Performance ≥95, Accessibility 100 | CI (Lighthouse CI) |
| AC-7 | Zero third-party trackers; no cookies set | Manual audit |
| AC-8 | Build fails on invalid content schema | CI (Zod validation) |
| AC-9 | SRS state scoped by language pair + direction | Unit (storage) |
| AC-10 | Static HTML renders without JS for lesson reading | Lighthouse |

## 5. Constraints

| Type | Constraint |
|------|------------|
| **Technical** | Static site only (GitHub Pages); no backend |
| **Technical** | Astro 5.x + Vue 3 islands; Zod for validation |
| **Technical** | `localStorage` only for state; no cookies |
| **Technical** | Web Speech API for TTS (pt-PT) |
| **Content** | Referencial Camões PLE as authoritative CEFR source |
| **Content** | A1 only for MVP; A2+ deferred |
| **Content** | EN→PT only for MVP; other pairs deferred |
| **Legal** | No PII collected; GDPR compliant by design |
| **Operational** | Zero-cost deployment; CI/CD via GitHub Actions |

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Abstract schema can't model PT-specific grammar (ser/estar, tu/você) | Medium | High | Schema spike with ser/estar before full build |
| Camões extraction slower than estimated | High | Medium | Time-box; ship A1 subset first |
| Learners don't return after session 1 | Medium | High | User test review flow; minimise friction |
| Content authoring doesn't scale beyond founder | Medium | Medium | Simple schema + CONTRIBUTING.md |

## 7. Success Metrics (3 months post-launch)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Weekly Active Learners | 50 | Privacy-respecting analytics |
| A1 vocab with SRS interval >21 days | 60% | localStorage aggregation (opt-in) |
| Can-Do statements with >50% mastery | 10 A1 statements | Dashboard analytics |
| Week-2 return rate | 40% | Session tracking |

---

**Document Status:** Approved for implementation  
**Next Step:** Specification & Design document (specification-design.md) → Implementation