# French (fr-FR) CEFR Mapping — Walking Skeleton

Tracks the CEFR reference-document verification and 5-node walking skeleton for **en-GB↔fr-FR**, per issue #106. Mirrors `docs/de-cefr-mapping.md` and `docs/es-cefr-mapping.md` in format and rigor. Full A1 authoring (issue #107) follows the same "extract real structure, don't assume" discipline once this skeleton is verified end-to-end.

## Source document verification (#106)

**Candidate ruled out first, per the issue's own warning**: "Un référentiel pour le français" (Beacco et al., commissioned by the Council of Europe / CIEP) is the field's closest analogue to Profile Deutsch/PCIC — a French-specific curriculum inventory layered on top of raw CEFR. It is a commercially published book (Didier), not confirmed freely browsable online in full — the same failure mode as "Profile Deutsch" for German (#62). It was not used as this project's source.

**Source actually used:** [**Descripteurs de compétences du Cadre européen commun de référence**](https://www.delfdalf.ch/fileadmin/user_upload/Unterlagen/Descripteurs/Descripteurs_A1.pdf), redistributed per level (A1 shown here) by the **Bureau DELF-DALF** — a DELF/DALF examination centre operating under license from **France Éducation international** (formerly CIEP, the French Ministry of Education's public body for French-language certification — the direct structural analogue of Instituto Cervantes, Instituto Camões, and the Goethe-Institut). Confirmed freely accessible: downloaded successfully with no login, paywall, or access blocker (311KB PDF), and its text extracted directly (`pdftotext`) to confirm real structure rather than assumed content — the same PDF-download verification method used for German's Prüfungsziele documents.

**Important — this is not a France-specific curriculum layer like PCIC or Prüfungsziele.** Where Referencial Camões, PCIC, and Prüfungsziele each add a national-institute taxonomy on top of raw CEFR (Camões's Componente Pragmática, PCIC's Funciones, Prüfungsziele's per-exam Kompetenzen), the freely-available French document found here is the **Council of Europe's own illustrative descriptor grid** (the CEFR's self-assessment scales), simply republished by the DELF-DALF exam authority as candidate-preparation material. This is a genuinely different shape from the other three languages' sources, not an inherited assumption — confirmed by reading the extracted text directly rather than guessing it would match the established pattern.

**Real structure, extracted from the PDF (`pdftotext -layout`):** Descriptors are organized under three top-level activity groups — **Activités de production et stratégies** (Production orale, Production écrite, + strategies), **Activités de réception et stratégies** (Compréhension orale, Compréhension écrite, + strategies), **Activités d'interaction et stratégies** (Interaction orale, Interaction écrite) — each with named sub-activities (e.g. "MONOLOGUE SUIVI: décrire l'expérience", "ÉCHANGE D'INFORMATION", "OBTENIR DES BIENS ET DES SERVICES"), some marked "Pas de descripteur disponible" at A1 (no descriptor yet exists at that level in the CEFR's own scale). This maps cleanly onto the repo's existing `skill` enum (listening/reading/spoken_interaction/spoken_production/writing) without needing new categories.

**This mapping does not yet extract the full per-activity descriptor breakdown** — that's #107's job (the full A1 epic), mirroring how #56 and #63 did PCIC's and Prüfungsziele's extraction after their respective spikes confirmed access.

## TTS voice verification (#106)

Checked via `speechSynthesis.getVoices()` in a real Chrome browser (desktop, macOS): dedicated `fr-FR` voices exist (e.g. "Daniel", "Jacques", "Marie", "Thomas") and are distinct from `fr-CA` (e.g. "Amélie" — `fr-CA` only), the same disambiguation already confirmed for `es-ES`/`es-MX` and `pt-PT`/`pt-BR`. `pronounce()` (`src/lib/pronounce.ts`) required no changes.

## 5-node walking skeleton

Mirrors the same 5 nodes used for every other pair's skeleton (#21, #42, #62) — all pre-existing, language-agnostic `cefr-nodes/`, so no new node files were needed, only new `realisations/fr-FR/*.yaml`:

| nodeId       | Skill              | Can-Do                                                    | Status      |
| ------------ | ------------------ | --------------------------------------------------------- | ----------- |
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings                 | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking                   | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others                       | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001  | reading            | Can recognize and write numbers 1-100                     | ✅ Realised |

## Sourcing note

No new vocabulary images were sourced — `A1-NUMB-001`'s `imageUrl`s reuse the existing `um.webp`/`dois.webp`/`tres.webp` files (already credited in `public/vocab-images/CREDITS.md`), since the underlying photographs (numeral shapes) are language-independent. See `docs/content-attribution.md` (#41) for the sourcing policy this follows.

## Verification

- `npm run validate:content`: 620 realisations, all reference valid `cefr-nodes`
- `npm run typecheck` / `npm run lint` / `npm test`: clean (see PR for exact numbers)
- `npm run build`: routes generated automatically for `en-GB↔fr-FR`, `es-ES↔fr-FR`, `pt-PT↔fr-FR`, and `de-DE↔fr-FR` — zero code changes, confirming `getAvailablePairs()`/`pairRealisations()` generalize to a fourth language
- Manual browser verification (chrome-devtools) for `en-GB→fr-FR`: Practice page loads with correct "French" branding (via the existing `languageName()` util, unchanged), a full graded review card, and Progress page showing correctly isolated per-pair state
