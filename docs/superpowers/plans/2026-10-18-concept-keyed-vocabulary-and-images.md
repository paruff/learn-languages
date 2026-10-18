# Concept-Keyed Vocabulary and Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pair review/lesson cards by semantic concept instead of item position, give every concept one image (with per-target-language overrides for culturally specific concepts), and fold the better-evidenced bilingual-lexicon and SLA research into the product roadmap.

**Architecture:** Every vocabulary item gets a required `concept` key: a kebab-case slug of its English gloss (`book`, `to-pay`). Pairing joins on `nodeId + concept`. When the source language is the gloss language (`GLOSS_LANG = 'en-GB'`), a target item with no concept match still becomes a card, using its own English `translation`/`exampleTranslation` as the source side. Images move off realisations into one `concept-images` data collection, with files at `public/vocab-images/{concept}.webp` and optional overrides at `{concept}.{lang}.webp`. Images resolve by the card's target language.

**Tech Stack:** Astro 7 content collections (`glob`/`file` loaders), Zod, TypeScript, Vitest, Playwright, `cwebp`/`sips` for image conversion.

**Spec:** `spec.md` rows C3, C7, C9 (revised/added in Task 0.3), plus L13–L15 (added as ⬜ in Task 0.3). Evidence base: `docs/learning-science-references.md` (rows added in Task 0.3). Background findings: the 2026-10-18 image/pairing review (summarised under "Why" below).

## Why (findings this plan acts on)

| Finding (measured 2026-10-18)                                                                                                                               | Consequence                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pairRealisations()` joins on item position. English glosses differ for en→es 586/689, en→de 612/738, pt↔de 630/689 paired items. en→pt 30/694, en→fr 0/653 | es-ES and de-DE review cards mostly teach **wrong translations**. The EN→PT Phase 1 loop is essentially fine |
| `lessons/[nodeId].astro:84` pairs by array index (`source.vocabulary[i]`)                                                                                   | Same bug on the lesson page                                                                                  |
| Concept overlap with en-GB by level: es-ES A1 70/83 but B2 0/108; de-DE A1 116/130 but B2–C2 0                                                              | Strict concept pairing alone would empty those pairs above A2. Hence the gloss-language fallback             |
| `imageOf()` takes the image from either side                                                                                                                | A pt-PT→de-DE card shows an eye photo next to _Bauch_                                                        |
| Images named by pt-PT lemma; es-ES copies 30 filenames, de-DE 0, fr-FR 3; alt text duplicated per language                                                  | No reuse for new languages without per-item copying                                                          |
| `euro.webp` and `dinheiro.webp` are the same photo, in the same node. `pais.webp` is a US flag. `cabeca.webp` reads as "face"                               | These images actively work against telling words apart in EN→PT today                                        |
| Credits live in `public/vocab-images/CREDITS.md`; no page in the app links to them                                                                          | CC BY / BY-SA attribution isn't presented to site users                                                      |
| Wikidata P18 tried on 10 concepts: book → medieval manuscript, school → Pompeii mosaic, money → USD                                                         | P18 is an optional first look only, not a sourcing pipeline                                                  |

## Global Constraints

- Intent P4: no code path names a specific language. The single `GLOSS_LANG = 'en-GB'` constant is a content-model fact ("`translation` fields are English") and lives in one place: `src/lib/pairing.ts`.
- Concept slug format: `/^[a-z0-9]+(-[a-z0-9]+)*$/`.
- SRS keys stay `srs:{source}:{target}:{direction}:{target.id}` (spec S1). Target item ids must not change, so existing learner progress carries over.
- Images: 240px max edge, `cwebp -q 82`, alt text required (WCAG 2.1 AA), licence in {Public Domain, CC0 1.0, CC BY 2.0/3.0/4.0, CC BY-SA 3.0/4.0}.
- Content-schema break (required `concept`, removed `imageUrl`/`imageAlt`): `feat(content)!:` with a `BREAKING CHANGE:` footer, version 0.1.0 → 0.2.0 (pre-1.0, so a minor bump; AGENTS.md §9.3).
- Gates: typecheck 0, lint 0 warnings, `npm run validate:content` passes, unit coverage ≥90% on `src/lib/`, build, E2E, a11y.
- Plan rules: Phase 0, A and B are bug, refactor or compliance work, allowed now under `plan.md` rule 3. Phase C items follow the Phase 1/2 gates in `plan.md`.
- Work on a new branch from `main`, after `fix/launch-blockers-and-sdlc-docs` merges.

## Review Focus

1. **A returning EN→PT learner's progress survives the migration.** Every pt-PT target id that paired before still pairs after. Pinned by the Task A3 Step 6 before/after id-set check.
2. **Two items in one realisation slug to the same concept** (12 such collisions today). Validation must fail with file + concept, never silently drop a card. Pinned by the `checkConcepts` duplicate test (Task A1).
3. **A non-English source with no concept match** (e.g. es-ES→de-DE at B2). The card is skipped without crashing, and the pair only appears in the selector if ≥1 item pairs. Pinned by the Task A3 "non-gloss source skips" test plus the existing `getAvailablePairs` behaviour.
4. **An override or base image file is missing, or a file has no data entry.** The build must fail, never ship a broken `<img>` or an uncredited file. Pinned by the `checkConceptImages` tests (Task B1).
5. **A synthesized gloss card in reverse direction / typed recall.** The prompt shows the English gloss, and the answer checks against the target term. Pinned by the Task A3 synthesized-fields test.

---

## Phase 0: Quick fixes and evidence base (ship first, own PR)

### Task 0.1: Open the tracking issues (DONE 2026-10-18)

Epic **#148** tracks the plan. Goal issues: #139 pairing bug (Phase A), #140 Phase 0, #141 images (Phase B, folds in #75's keying), #142 and #143 es-ES/de-DE B1–C2 re-alignment (Phase D), #144–#147 research features (Phase C). #75 has a comment pointing to #141.

### Task 0.2: Fix the three images that hurt EN→PT today

**Files:**

- Modify: `src/content/realisations/pt-PT/a2-cult-002.yaml` (remove `imageUrl`/`imageAlt` from `pt-PT-A2-CULT-002-004`)
- Delete: `public/vocab-images/pais.webp`
- Replace: `public/vocab-images/dinheiro.webp`, `public/vocab-images/cabeca.webp`
- Modify: `public/vocab-images/CREDITS.md` (drop `pais` row, rewrite `dinheiro` and `cabeca` rows)
- Modify: `src/content/realisations/{pt-PT,es-ES}/a1-shop-001.yaml` and `a1-body-001.yaml` (`imageAlt` for the replaced files)

- [ ] **Step 1: Source `dinheiro` (money).** `python3 scripts/vocab-images/commons_search.py "wallet with banknotes and coins" 10`. Acceptance: a different source file from `euro.webp`, visibly different composition (a wallet or hand holding cash, not a flat spread of euro notes).
- [ ] **Step 2: Source `cabeca` (head).** `python3 scripts/vocab-images/commons_search.py "human head profile side view" 10`. Acceptance: the whole head is visible (crown, back of head, neck), so it can't be read as "face".
- [ ] **Step 3: Download and look at each candidate** (scripts/vocab-images/README.md step 3). Then `sips -Z 240 in.jpg --out r.jpg && cwebp -q 82 r.jpg -o <name>.webp`.
- [ ] **Step 4: Update CREDITS.md rows first**, then the `imageAlt` strings, then remove the `país` image and the flag file.
- [ ] **Step 5: Verify.** `npm run validate:content && npm run build && grep -rn "pais.webp" src public` prints nothing after the build line. Open `/en-GB/pt-PT/lessons/A1-SHOP-001/` in `npm run preview` and confirm euro and dinheiro now look different.
- [ ] **Step 6: Commit** `content(images): replace duplicate money photo, face-only head photo; drop flag for país` (PATCH).

### Task 0.3: Evidence base, spec and plan rows

**Files:** Modify `docs/learning-science-references.md`, `spec.md`, `plan.md`.

- [ ] **Step 1: Add Tier 1 rows** to `docs/learning-science-references.md`:

| Mechanism                                  | Source                                                                                                                                                                                                                                                                           | What it supports in Acquira                                                                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bilingual lexicon: L2 → concept links      | Kroll & Stewart (1994). Category interference in translation and picture naming. _Journal of Memory and Language_, 33, 149–174 (Revised Hierarchical Model)                                                                                                                      | C7/C9: one image per concept; L13 picture-prompt cards. Beginners reach L2 words through L1; direct concept links strengthen with proficiency                            |
| Shared conceptual features                 | de Groot (1992). Determinants of word translation. _JEP: LMC_, 18(5), 1001–1018. van Hell & de Groot (1998). Conceptual representation in bilingual memory. _Bilingualism: Language and Cognition_, 1(3), 193–211 (Distributed Conceptual Feature Model)                         | C7: concrete nouns share most features across languages, so one shared image is enough; abstract and culture-bound words don't, so they get an override or no image      |
| Word-type effects on learning & forgetting | de Groot & Keijzer (2000). What is hard to learn is easy to forget. _Language Learning_, 50(1), 1–56                                                                                                                                                                             | Concrete and cognate words are learned faster and forgotten more slowly. Supports L14 and the image policy. No scheduling change: SM-2 already adapts per item           |
| Pictures vs. translations (a caution)      | Lotto & de Groot (1998). Effects of learning method and word type on acquiring vocabulary in an unfamiliar language. _Language Learning_, 48(1), 31–69. Carpenter & Olson (2012). Are pictures good for learning new vocabulary in a foreign language? _JEP: LMC_, 38(1), 92–101 | Images are a supplement, not a replacement for word–word retrieval. Pictures can inflate confidence, so L13 is opt-in and its effect is checked through calibration (L5) |
| Explicit instruction for adults            | Norris & Ortega (2000). Effectiveness of L2 instruction: A research synthesis and quantitative meta-analysis. _Language Learning_, 50(3), 417–528. Spada & Tomita (2010). _Language Learning_, 60(2), 263–308                                                                    | L8 (grammar in the retrieval loop), L10 (corrective notes), L15 (contrastive grammar notes)                                                                              |
| Cross-linguistic transfer                  | Ringbom (2007). _Cross-linguistic Similarity in Foreign Language Learning_. Multilingual Matters. Odlin (1989). _Language Transfer_. Cambridge University Press                                                                                                                  | L14: cognates help and false friends hurt when the source language is not English                                                                                        |

Add a **"Background only (do not cite as justification)"** section after Tier 2:

> **Universal Grammar** (Chomsky; principles and parameters). It's a theory of child first-language acquisition. Whether adults keep access to UG is unresolved (Bley-Vroman 2009, _SSLA_ 31(2); Schwartz & Sprouse 1996, _Second Language Research_ 12(1)), and its universality claims are disputed (Everett 2005, _Current Anthropology_ 46(4); Evans & Levinson 2009, _BBS_ 32(5)). It names no retrieval, spacing, interleaving, generation, calibration or dual-coding mechanism, so it fails intent P1. Use it only as an authoring hint for contrastive grammar notes (e.g. null subjects in pt-PT/es-ES vs. obligatory subjects in de-DE/fr-FR/en-GB; German verb-second). The language-agnostic CEFR-node design descends from the notional-functional syllabus (van Ek 1975, _The Threshold Level_; Wilkins 1976, _Notional Syllabuses_). Cite those for intent P4, not UG.

- [ ] **Step 2: spec.md.**
  - Revise C3 to "Any two supported languages pair by `nodeId` + vocabulary `concept`, with no per-language code path. When the source is the gloss language (`en-GB`), an unmatched target item pairs against its own English gloss". Status → 🟡 until Task A3.
  - Add **C9**: "Every vocabulary item has a `concept` (kebab-case English-gloss slug), unique within its realisation; items paired across languages have matching English glosses". Verified by: `validate:content`. Status ⬜.
  - Revise C7 to "Images are keyed by concept: one per concept, optional per-target-language override for culturally specific concepts; each has alt text and attribution in `src/content/concept-images.yaml`, shown on the in-app credits page". Status → 🟡.
  - Add ⬜ rows **L13** (opt-in picture-prompt cards: image only, produce the target term; RHM, with the Carpenter & Olson caution), **L14** (false-friend/cognate notes shown when the source language is not English; Ringbom 2007), **L15** (grammar points may carry a contrastive note keyed by source language; Norris & Ortega 2000).
  - Add an open question: "L13: does the picture-prompt mode raise the calibration-flag rate (L5) for image cards? Needs S6."
- [ ] **Step 3: plan.md.** Add a "Now (bug and compliance, rule 3)" table linking this plan's Phases 0/A/B (issues #139–#141, epic #148) and a Phase D row for #142/#143 recording the owner decision of 2026-10-18 as an explicit exception to rule 1. Add L15 to Phase 2 as part of row 2.4, and L13 as row 2.7 (after 2.1). Add L14 and the L13 calibration check to Phase 3. Bump "Last updated".
- [ ] **Step 4: Verify** `npx prettier --check docs spec.md plan.md`.
- [ ] **Step 5: Commit** `docs(research): add bilingual-lexicon, transfer and explicit-instruction evidence; UG as background only`.

---

## Phase A: Pair by concept (the critical issue)

### Task A1: Concept and alignment checks (RED against today's content)

**Files:**

- Modify: `src/lib/contentIntegrity.ts`, `src/lib/contentIntegrity.test.ts`
- Modify: `scripts/validate-content-integrity.ts` (hard gate, not a warning)
- Modify: `src/lib/pairing.ts` (export `GLOSS_LANG`)

**Interfaces (produces):**

```ts
// src/lib/pairing.ts
export const GLOSS_LANG = 'en-GB';

// src/lib/contentIntegrity.ts
export interface ConceptRef {
  file: string;
  nodeId: string;
  lang: string;
  items: { id: string; concept: string | undefined; term: string; translation: string }[];
}
export function glossOf(lang: string, item: { term: string; translation: string }): string; // term when lang === GLOSS_LANG, else translation
export function normaliseGloss(gloss: string): string[]; // alternative set
export function checkConcepts(refs: ConceptRef[]): string[]; // error lines; [] = valid
export function checkPairAlignment(refs: ConceptRef[]): string[]; // error lines; [] = valid
```

`normaliseGloss`: NFKD + strip combining marks, lowercase, remove `(...)`, split on `/ , ;`. For each part: trim, strip trailing `...`/`…`, strip a leading `to `, collapse spaces. Drop empty parts.

- [ ] **Step 1: Write the failing tests** in `contentIntegrity.test.ts`:
  - `checkConcepts reports an item with no concept`: an error contains the file and `pt-PT-A1-BODY-001-004`.
  - `checkConcepts rejects a non-kebab concept`: `concept: 'Eye'` gives an error containing `Eye`.
  - `checkConcepts reports two items with the same concept in one realisation`: an error contains the file and `eye`.
  - `checkPairAlignment flags same-concept items whose glosses differ`: pt-PT `{concept:'eye', translation:'eye'}` vs de-DE `{concept:'eye', translation:'belly'}` gives one error containing `A1-BODY-001`, `eye`, `pt-PT`, `de-DE`.
  - `checkPairAlignment accepts overlapping alternatives`: `'till'` vs `'till / cash register'` gives `[]`.
  - `checkPairAlignment uses term as the gloss for GLOSS_LANG`: en-GB `{term:'eye', translation:'olho'}` vs pt-PT `{translation:'eye'}` gives `[]`.
  - `normaliseGloss('To pay (for)...')` equals `['pay']`.
- [ ] **Step 2: Run** `npx vitest --run src/lib/contentIntegrity.test.ts`. Expected: FAIL, functions not exported.
- [ ] **Step 3: Implement** the four functions. Load `ConceptRef[]` in the validator via the existing `findYamlFiles`. On any error, print each line and `process.exit(1)`.
- [ ] **Step 4: Run the unit tests.** Expected: PASS. Run `npm run validate:content`. Expected: **FAIL**, with one missing-concept error per item (about 3,500). This is the RED evidence that the content needs the migration.
- [ ] **Step 5: Commit** (local only; CI stays red until A2): `test(content): gate on vocabulary concepts and cross-language gloss alignment`.

### Task A2: Add `concept` to every item

**Files:**

- Create, run, then delete in the same commit: `scripts/migrate-add-concepts.ts`
- Modify: `src/content.config.ts` (add `concept: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)` to `vocabularyItemSchema`)
- Modify: every `src/content/realisations/**/*.yaml`

- [ ] **Step 1: Write the migration.** For each item, insert `    concept: '<slug>'` directly after its `id:` line, as text insertion so comments and formatting survive. Slug algorithm:

```ts
const slug = (gloss: string) =>
  gloss
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .split('/')[0]
    .replace(/\.\.\.|…/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
// gloss = glossOf(lang, item) from Task A1. Verbs keep "to-" (to-pay ≠ pay).
```

- [ ] **Step 2: Run it.** `node --experimental-strip-types scripts/migrate-add-concepts.ts`. Then `npm run validate:content`. Expected: the only failures left are about 12 duplicates and some alignment errors.
- [ ] **Step 3: Resolve duplicates by hand.** Disambiguate by meaning (`dance` vs `to-dance`, `bank-money` vs `bank-river`), never by adding `-2`.
- [ ] **Step 4: Resolve EN→PT near-misses by hand.** List en-GB/pt-PT concepts per node that exist on only one side (`checkPairAlignment` plus a quick diff). Where the meaning is the same (e.g. "I would like..." / "I want..."), make both items' concept and gloss agree. Where it differs, leave them unpaired and list them in the PR body. Do the same for pt-PT↔fr-FR (29 items).
- [ ] **Step 5: Add `concept` to the schema.** Run `npm run validate:content && npm run typecheck`. Expected: PASS.
- [ ] **Step 6: Delete the migration script.** Commit `feat(content)!: add a concept key to every vocabulary item` with the footer `BREAKING CHANGE: vocabulary items require a kebab-case concept; realisations pair on it`.

### Task A3: Pair on concept, with gloss fallback; fix the lesson page

**Files:**

- Modify: `src/lib/pairing.ts`, `src/lib/pairLoader.test.ts`
- Modify: `src/pages/[sourceLang]/[targetLang]/review.astro` (type: `seq` → `concept`)
- Modify: `src/pages/[sourceLang]/[targetLang]/lessons/[nodeId].astro:83-100`
- Modify: `spec.md` (C3 ✅, C9 ✅)

**Interfaces:**

- Consumes: `GLOSS_LANG` (A1); `concept` on items (A2).
- Produces:

```ts
export interface VocabularyPairItem {
  id;
  concept: string;
  term;
  translation;
  example;
  exampleTranslation;
} // image fields removed in B2
export interface PairedVocabularyItem {
  nodeId: string;
  concept: string;
  source: VocabularyPairItem;
  target: VocabularyPairItem;
}
export function pairRealisations(realisations, sourceLang, targetLang): PairedVocabularyItem[]; // same signature
export function glossSide(target: VocabularyPairItem): VocabularyPairItem;
// → { id: `${target.id}:gloss`, concept: target.concept, term: target.translation,
//     translation: target.term, example: target.exampleTranslation, exampleTranslation: target.example }
```

- [ ] **Step 1: Write the failing tests** in `pairLoader.test.ts`:
  - `pairs items by concept, not position`: target vocabulary in reverse order still pairs `hello`↔`olá`.
  - `does not pair different concepts at the same position`: en-GB `eye` at 004 and pt-PT `belly` at 004, with source `de-DE`, give no pair.
  - `source = GLOSS_LANG: an unmatched target item pairs against its own gloss`: expect `source` toEqual `glossSide(target)`, and `target.id` unchanged.
  - `non-gloss source: an unmatched target item is skipped`.
  - `glossSide swaps term/translation and example/exampleTranslation`.
  - Update existing fixtures to carry `concept`. Delete the `seq` expectations.
- [ ] **Step 2: Run** `npx vitest --run src/lib/pairLoader.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** Replace `seqFromId` with a `Map<concept, item>` per target node. Use the `GLOSS_LANG` fallback when the source realisation for the node is missing too, so a node with a target realisation and no en-GB realisation still yields cards.
- [ ] **Step 4: Fix the lesson page.** Build `const sourceByConcept = new Map((source?.vocabulary ?? []).map((v) => [v.concept, v]))` and use `sourceByConcept.get(targetItem.concept)?.term ?? targetItem.translation`.
- [ ] **Step 5: Run** `npm test && npm run typecheck && npm run test:e2e`. Expected: PASS (review.spec, review-fr.spec, exercises, a11y).
- [ ] **Step 6: Check progress carry-over (Review Focus 1).** Before and after the change, dump `pairRealisations(all,'en-GB','pt-PT').map(p => p.target.id)` with a throwaway `vitest` snippet or node script. Expected: before ⊆ after. Put both counts in the PR body. Also record the per-pair card counts (en→es and en→de should cover every target item).
- [ ] **Step 7: Flip spec C3 and C9 to ✅** with the test names. Commit `fix(pairing): join cards on concept with en-GB gloss fallback; lesson page matches by concept` and reference the issue from Task 0.1.

---

## Phase B: One image per concept (folds in #75's keying)

### Task B1: Concept-image data, resolver and file checks

**Files:**

- Create: `src/lib/conceptImages.ts`, `src/lib/conceptImages.test.ts`
- Modify: `src/content.config.ts` (new `concept-images` collection, `file('src/content/concept-images.yaml')` loader)
- Modify: `scripts/validate-content-integrity.ts` (hard gate)

**Interfaces (produces):**

```ts
export interface ImageCredit {
  alt: string;
  source: string;
  author: string;
  license: License;
}
export interface ConceptImage extends ImageCredit {
  id: string; // the concept
  wikidata?: string; // /^Q\d+$/, optional
  culturallySpecific: boolean; // default false
  overrides: Record<string, ImageCredit>; // keyed by lang, default {}
}
export interface ResolvedImage {
  file: string;
  alt: string;
}
export function imageFileName(concept: string, lang?: string): string; // `${concept}.webp` | `${concept}.${lang}.webp`
export function resolveConceptImage(
  concept: string,
  targetLang: string,
  images: ReadonlyMap<string, ConceptImage>
): ResolvedImage | undefined;
export function attachImages(
  paired: PairedVocabularyItem[],
  targetLang: string,
  images: ReadonlyMap<string, ConceptImage>
): (PairedVocabularyItem & { image?: ResolvedImage })[];
export function checkConceptImages(images: ConceptImage[], files: string[]): string[];
```

The Zod schema mirrors `ConceptImage`. `license` is the enum from Global Constraints, `alt` is `min(5)`, `source` is `.url()`.

- [ ] **Step 1: Write the failing tests:**
  - `resolveConceptImage prefers the target-language override`: `pharmacy` with a `pt-PT` override resolves to `{file:'pharmacy.pt-PT.webp', alt:<override alt>}` for `pt-PT`, and to `pharmacy.webp` for `de-DE`.
  - `resolveConceptImage returns undefined for a concept with no entry`.
  - `attachImages leaves items without an image untouched`.
  - `checkConceptImages reports a missing base file`, `...a missing override file`, `...an orphan file with no entry` (each error names the file). It ignores non-`.webp` files (e.g. a README).
- [ ] **Step 2: Run** `npx vitest --run src/lib/conceptImages.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.** In the validator, read `readdirSync('public/vocab-images')` and the parsed YAML, and exit 1 on errors.
- [ ] **Step 4: Run** the unit tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(images): concept-keyed image data, resolver and integrity checks`.

### Task B2: Migrate the images and switch consumers

**Files:**

- Rename: every `public/vocab-images/*.webp` → `{concept}.webp` (`git mv`, concept taken from the pt-PT item that referenced it)
- Create: `src/content/concept-images.yaml` (one entry per file, built from CREDITS.md rows + the pt-PT `imageAlt`)
- Replace: `public/vocab-images/CREDITS.md` with a two-line pointer to the YAML and the credits page
- Modify: `src/content.config.ts` (remove `imageUrl`, `imageAlt` and their refine), `src/lib/pairing.ts`, `src/lib/pairLoader.ts` (load `concept-images`, call `attachImages`)
- Modify: `review.astro` (delete `imageOf`; use `item.image`), `lessons/[nodeId].astro` (resolve with `resolveConceptImage(targetItem.concept, targetLang, images)`)
- Modify: every realisation YAML with `imageUrl` (delete both lines)
- Test: `tests/e2e/review.spec.ts` or a new `tests/e2e/images.spec.ts`

- [ ] **Step 1: Write the failing E2E test** `a de-DE lesson shows the shared concept image`. On `/en-GB/de-DE/lessons/A1-FOOD-001/`, an `img` with `src` ending `/vocab-images/bread.webp` and a non-empty `alt` is visible. (de-DE has 0 images today.)
- [ ] **Step 2: Run** `npx playwright test images.spec.ts`. Expected: FAIL (no img).
- [ ] **Step 3: Migrate.** Write a throwaway script in the scratchpad: map pt filename → concept, `git mv`, emit the YAML, strip `imageUrl`/`imageAlt` lines. Mark `pharmacy`, `school`, `shop` and `till` `culturallySpecific: true`. Add `wikidata` only where you already know the QID.
- [ ] **Step 4: Switch the consumers** as listed. Delete the image assertions from `pairLoader.test.ts` (now covered by `attachImages` tests).
- [ ] **Step 5: Verify.** `npm run validate:content && npm test && npm run typecheck && npm run lint && npm run test:e2e` all pass. `grep -rn "imageUrl\|imageAlt" src` prints nothing.
- [ ] **Step 6: Commit** `feat(images)!: one image per concept, resolved by target language` with the footer `BREAKING CHANGE: imageUrl/imageAlt removed from vocabulary items; images live in concept-images.yaml`. Update spec C7 → ✅.

### Task B3: Credits page (licence compliance)

**Files:**

- Create: `src/pages/[sourceLang]/[targetLang]/credits.astro`
- Modify: `src/layouts/BaseLayout.astro:80-82` (footer link), `src/lib/strings.ts` (`credits` key in all five languages)
- Test: `tests/e2e/images.spec.ts`, `tests/e2e/a11y.spec.ts` (add the route)

- [ ] **Step 1: Write the failing E2E test** `credits page lists every concept image with author and licence`. On `/en-GB/pt-PT/credits/`, the row count equals the number of base entries plus overrides in `concept-images.yaml` (read the file in the test), and the `bread` row contains its author and licence text. The footer on `/en-GB/pt-PT/review/` has a link to it.
- [ ] **Step 2: Run it.** Expected: FAIL (404).
- [ ] **Step 3: Implement.** A static table: thumbnail, concept, author, licence, source link. Use BEM classes `credits-table__*` and existing tokens.
- [ ] **Step 4: Run** `npm run test:e2e`. Expected: PASS, including axe on the new page.
- [ ] **Step 5: Commit** `feat(credits): in-app image attribution page`.

### Task B4: Locale overrides and the new-language workflow

**Files:**

- Create: `scripts/report-pair-coverage.ts`. Its pure part goes in `src/lib/contentIntegrity.ts` as `pairCoverage(refs: ConceptRef[], images: ConceptImage[], lang: string): { missingConcepts: Record<string, string[]>; imagesNeedingReview: string[] }`
- Modify: `src/content/concept-images.yaml`, `public/vocab-images/` (pharmacy overrides)
- Modify: `docs/content-attribution.md`, `docs/content-authoring-playbook.md`, `scripts/vocab-images/README.md`
- Test: `src/lib/contentIntegrity.test.ts`

- [ ] **Step 1: Write the failing test** `pairCoverage lists node concepts the language lacks, and culturally specific images without an override for it`. Fixture: node with en-GB concepts `{bread, pharmacy}`, de-DE `{bread}`, and `pharmacy` marked `culturallySpecific` with no override. Expect `{ missingConcepts: {'A1-X-001': ['pharmacy']}, imagesNeedingReview: ['pharmacy'] }`.
- [ ] **Step 2: Run it** (expect FAIL), implement, run it again (expect PASS). Add the CLI wrapper `npm run report:coverage -- de-DE`.
- [ ] **Step 3: Source pharmacy overrides** for each language whose realisations use `pharmacy`: a green-cross pharmacy front for `pt-PT`/`es-ES`, the red "A" Apotheke sign for `de-DE`. Same eyeball and convert steps as Task 0.2. Keep the base `pharmacy.webp` neutral (no US-specific signage).
- [ ] **Step 4: Rewrite the docs** around the concept workflow:
  1. Author items with `concept` first: reuse the node's existing concepts (`report:coverage`) before inventing new ones.
  2. A concept that already has an image needs no sourcing.
  3. For `culturallySpecific` concepts, look at the image again for the new language and add an override if it doesn't fit.
  4. For a new image, try Wikidata P18 for the concept's QID as a first look (expect a low hit rate: it's chosen for encyclopedia entries, not flashcards), then use `commons_search.py`.
  5. Image policy (DCFM): concrete, cross-culturally shared concepts get a base image. Culture-bound ones get overrides. Abstract ones get none.
- [ ] **Step 5: Verify** `npm test && npm run validate:content && npm run test:e2e`.
- [ ] **Step 6: Commit** `feat(content): pair-coverage report and locale image overrides for new languages`.

---

## Phase C: Put the research into the product (gated; each item gets its own brainstorm → plan)

How the research changes existing and future development, ordered by expected learner impact:

| #   | Change                                                                                                                                                                                 | Evidence                                                                                                  | Effect on existing site                                                                   | Spec | Gate (plan.md)        | Exit criterion                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | --------------------- | ---------------------------------------------------------------------------------------------- |
| C.1 | **Correct pairing (Phase A).** The largest single effectiveness gain: es-ES/de-DE learners stop memorising wrong translations                                                          | Basic validity: retrieval strengthens whatever is retrieved                                               | All es/de cards become correct. Any-direction pairs above A2 get thinner but correct      | C3   | Now                   | Phase A merged                                                                                 |
| C.2 | **Image policy by concept type (Phase B docs).** Shared image for concrete concepts, overrides for culture-bound ones, none for abstract ones                                          | DCFM (de Groot 1992); de Groot & Keijzer 2000                                                             | de-DE/fr-FR get images for free; new languages pay only for culture-bound overrides       | C7   | Now                   | Phase B merged                                                                                 |
| C.3 | **Contrastive grammar notes**: optional `contrast: Record<lang, string>` on grammar points (null subjects, V2, ser/estar), shown with the grammar card and in L10's corrective support | Norris & Ortega 2000; Spada & Tomita 2010                                                                 | Enriches #126's grammar-in-SRS pilot; no new UI surface                                   | L15  | Phase 2, with row 2.4 | A1-INTRO-001 pilot shows a contrast note for one source language in a real review              |
| C.4 | **Opt-in picture-prompt cards**: for concepts with an image, the front shows the image only and the learner produces the target term (works with typed recall)                         | RHM (Kroll & Stewart 1994); generation effect; **caution**: Lotto & de Groot 1998, Carpenter & Olson 2012 | A third prompt mode next to forward/reverse; images move from decoration to retrieval cue | L13  | Phase 2, after 2.1    | E2E: picture mode shows no text on the front; Phase 1 follow-up learners can use it unprompted |
| C.5 | **Image-confidence check**: split calibration flags (L5) by cards with and without an image                                                                                            | Carpenter & Olson 2012                                                                                    | Tells us whether C.4 creates a fluency illusion; retire C.4 if it does                    | L5   | Phase 3, needs S6     | Calibration rate for image vs. non-image cards visible on progress                             |
| C.6 | **False-friend/cognate notes** for non-English sources: optional `falseFriends: [{lang, term, meaning}]` on items, shown on reveal and on "Again"                                      | Ringbom 2007; de Groot & Keijzer 2000                                                                     | Only matters once learners use pt↔es-style pairs; content cost per pair                   | L14  | Phase 3               | pt-PT→es-ES pilot node with ≥3 false friends authored and shown                                |
| —   | **No change**: per-word-type scheduling (SM-2 already adapts per item); UG-motivated features; extra chunking work (keep authoring A1 `phrase` items as now)                           | de Groot & Keijzer 2000; UG background note                                                               | Avoids building on weak or redundant evidence                                             | —    | —                     | —                                                                                              |

Owner decision (2026-10-18): re-author es-ES and de-DE B1–C2 vocabulary so non-English-source pairs fill in above A2. That's Phase D below. It is an explicit exception to plan.md rule 1 / intent P2 (no new content before Phase 1 evidence): it re-authors existing content and adds no new levels.

---

## Phase D: Re-align es-ES and de-DE B1–C2 to shared concepts (#142, #143; after Phases A and B)

Each task is a content-authoring task. The implementer drafts, and a human verifies against the authoritative CEFR source before merge (intent P6, spec C6): PCIC for es-ES, Profile Deutsch for de-DE. One PR per language per CEFR level (8 PRs). Detailed per-level task breakdowns are written when Phase B lands, using the shape of `docs/superpowers/plans/2026-09-23-fr-b1-content-109.md`.

### Task D.1: Coverage baseline

**Files:** none (uses `npm run report:coverage -- es-ES` and `-- de-DE` from Task B4).

- [ ] **Step 1: Record the baseline.** Run the report for each language. Commit the missing-concept counts per node into the #142/#143 issue bodies as a checklist, one line per node.

### Task D.2: Re-author per level (repeat for B1, B2, C1, C2, per language)

**Files:** Modify `src/content/realisations/{es-ES,de-DE}/{b1,b2,c1,c2}-*.yaml`; modify `docs/{es,de}-cefr-mapping.md`.

**Interfaces:**

- Consumes: each node's concept set (the union of en-GB and pt-PT concepts for that node) from `report:coverage`; `checkPairAlignment` from Task A1.
- Produces: realisations whose items cover that set, with `concept` equal to the shared concept and `translation` matching the en-GB gloss.

- [ ] **Step 1: Run `npm run report:coverage -- <lang>`** for the level's nodes. Expected: lists the missing concepts.
- [ ] **Step 2: For each missing concept, write the item.** Keep the existing item's `id` where its concept is retained (SRS progress carries over). New items get the next free sequence number. Replaced items whose concept is dropped keep no id.
- [ ] **Step 3: Verify.** `npm run validate:content` passes, and the report shows 0 missing concepts for the level.
- [ ] **Step 4: Authoritative-source check.** Add the checked entries and source references to `docs/{es,de}-cefr-mapping.md`. A human reviews before merge.
- [ ] **Step 5: Commit** `content(es-ES): align B1 vocabulary to shared concepts (#142)` (PATCH).
