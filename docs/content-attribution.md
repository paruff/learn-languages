# Content Sourcing & Attribution Policy

Establishes where it's safe to source reference material (audio, images, text/vocabulary structure) for any language in this repo, and how to record attribution — per issue #41. Applies to every language, existing (pt-PT) and new (es-ES, and future pairs under Epic #39).

## Why this exists

An earlier session's research into AIMA's "Português Para Todos" course surfaced a real constraint: a course's module _titles_ are useful for cross-checking topic priorities against real-world curricula, but its _content_ (audio, images, text) isn't reusable without a license — see `docs/cefr-mapping.md`'s AIMA cross-reference table, which cites titles only. This document turns that one-off judgment call into a repeatable policy.

## Acceptable sources per media type

### Audio

Default: **platform TTS** (`pronounce()`, `src/lib/pronounce.ts`) — zero licensing risk, since it's synthesized at runtime from the Web Speech API already present in the user's browser, not a distributed asset. This is the sole audio source for every language currently in the repo (pt-PT, es-ES).

Only add pre-recorded audio if TTS quality is genuinely insufficient for a given language (e.g. no `speechSynthesis` voice exists for that BCP-47 code across common browsers). If that happens, source recordings the same way as images (below) and record them in the ledger.

### Images

**CC0/openly-licensed sources only**:

- [Wikimedia Commons](https://commons.wikimedia.org/), filtered by license
- [Openverse](https://openverse.org/)

**Never** scrape a commercial course platform, stock-photo site without a matching license, or any source whose terms don't explicitly grant reuse.

Before referencing a new image from `imageUrl`, verify it's **pedagogically clear**, not just correctly licensed — a technically CC0 photo that doesn't clearly depict the target concept is still the wrong choice (see the `concrete-noun-image-sourcing-relational-words-hard-mode` learned pattern for cases where this is genuinely hard: relational words, isolated body parts).

**Reuse across languages**: a photograph of a concrete concept (a head, a house, a euro coin) is language-independent — the same `public/vocab-images/*.webp` file can be referenced from multiple languages' `imageUrl` fields with no new sourcing or licensing work, as done for all 22 `es-ES` A1 nodes in issue #56 (zero new images sourced; every one reused an existing pt-PT-sourced file already listed in `public/vocab-images/CREDITS.md`). This does not apply to images containing embedded text in a specific language (e.g. a photographed sign or menu) — those remain language-specific.

### Text / vocabulary structure

**National-language-institute CEFR inventories only** — freely published curriculum documents from the relevant country's official language-promotion body:

| Language | Source                                                                                                                                                         | Status                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| pt-PT    | Referencial Camões PLE (Instituto Camões)                                                                                                                      | Verified, documented in `docs/cefr-mapping.md`    |
| es-ES    | Plan Curricular del Instituto Cervantes (PCIC)                                                                                                                 | Verified, documented in `docs/es-cefr-mapping.md` |
| de-DE    | Goethe-Institut Prüfungsziele · Testbeschreibung documents (NOT "Profile Deutsch" — that's a paywalled Langenscheidt/Klett book)                               | Verified, documented in `docs/de-cefr-mapping.md` |
| fr-FR    | CEFR descriptor grid republished by Bureau DELF-DALF / France Éducation international (NOT "Un référentiel pour le français" — not confirmed freely available) | Verified, documented in `docs/fr-cefr-mapping.md` |

**Not** acceptable: textbook content, scraped course-platform text, or any copyrighted teaching material. A commercial course's module _titles_ may be cited for cross-checking topic coverage (as already done for AIMA), but never its written content.

## Attribution ledger

`public/vocab-images/CREDITS.md` is the existing, already-in-use ledger for images — every file referenced from a realisation's `imageUrl` has a row there recording source URL, license, and whether attribution is required. This pattern is the attribution ledger issue #41 asked for; it predates this policy doc and continues unchanged. No separate ledger is needed for audio (TTS carries no licensing obligation) or text (source documents are cited inline in `docs/{lang}-cefr-mapping.md`, e.g. this file's own Source section above).

## Cross-references

- **Spec NG7** ("AI-generated content without human review" — explicitly out of scope per `specification -design.md`): content authored with AI assistance in this repo still goes through the repo's normal PR review before merge — this policy doesn't change that gate, it only governs _where source material comes from_, not who reviews the result.
- **CLAUDE.md §7 (Security & Compliance / Privacy by Default)**: this policy only concerns openly-licensed third-party reference material, not user data — no overlap or conflict with the no-PII/no-tracking constraints there.

## Process for a new language or new image

1. Confirm the CEFR reference document per the table above (or research and add a new row, following the same "confirm access, extract real structure, document it" discipline used for pt-PT and es-ES).
2. For any new concept needing an image: search Wikimedia Commons/Openverse with a license filter, verify pedagogical clarity, add a `CREDITS.md` row before referencing it from any realisation.
3. Prefer reusing an existing `public/vocab-images/` file over sourcing a new one whenever the concept is language-independent.
