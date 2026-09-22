# Spanish (es-ES) CEFR Mapping — A1–C1 Inventory

Tracks the CEFR A1–C1 Can-Do statement inventory for **en-GB↔es-ES** against `cefr-nodes` and `realisations` content, per issues #40, #41, #42, #56, #57, #58, #59, #60. Mirrors `docs/cefr-mapping.md` (the pt-PT equivalent) in format.

**Source:** [Plan Curricular del Instituto Cervantes (PCIC)](https://cvc.cervantes.es/Ensenanza/biblioteca_ele/plan_curricular/) — "Niveles de referencia para el español", published by the Instituto Cervantes and freely browsable via its Centro Virtual Cervantes (CVC), no paywall or access blocker. This is the Spanish-language equivalent of Referencial Camões PLE used for Portuguese — confirmed as a real, currently-published curriculum document, not assumed. PCIC organizes content into 9 inventories across grammatical, pragmatic-discursive, notional, cultural, and learning-strategy components; the closest equivalent to Referencial Camões's "Componente Pragmática" category structure is inventory #5, **Funciones** (communicative functions), verified directly at `niveles/05_funciones_inventario_a1-a2.htm`.

**Important — this document does not assume PCIC mirrors Referencial Camões's structure**, per the explicit warning in issue #56. It doesn't: PCIC's Funciones inventory has **6** top-level categories at A1-A2 (vs. Camões's 7), with far more granular numbered subcategories (see below) — confirming the two source documents have genuinely different shapes, and this mapping reflects PCIC's real structure rather than an inherited assumption.

## TTS voice verification (#40)

Checked via `speechSynthesis.getVoices()` in a real Chrome browser (desktop, macOS): dedicated `es-ES` voices exist and are distinct from `es-MX` (e.g. "Mónica" — `es-ES`, "Eddy (Spanish (Spain))" — `es-ES`, separate from their `es-MX` counterparts). This mirrors the pt-PT situation (a dedicated regional voice, e.g. "Joana" for `pt-PT`, distinct from `pt-BR`). `pronounce()` (`src/lib/pronounce.ts`) is lang-parametrized and required no changes — it already sets `utterance.lang` explicitly and searches for a voice matching that exact code, so it correctly selects an `es-ES` voice over `es-MX` when both are present. Verified at the same rigor as the original pt-PT check (no formal cross-browser matrix exists for pt-PT either — see `discovery-brief.md` AC-5).

## Status legend

| Status         | Meaning                                                                                |
| -------------- | -------------------------------------------------------------------------------------- |
| ✅ Realised    | Node exists in `cefr-nodes/`, paired en-GB/es-ES realisations exist in `realisations/` |
| 🟡 Node only   | Node exists in `cefr-nodes/`, no es-ES realisation yet                                 |
| ⬜ Not started | Identified but no node file yet                                                        |

## A1 nodes in the repo

All 22 A1 `cefr-nodes/` are language-agnostic Can-Do statements already modeled for the en-GB/pt-PT pair (see `docs/cefr-mapping.md`). CEFR Can-Do statements describe communicative ability, not any one language, so this epic reused every existing A1 node rather than creating duplicates — exactly as issue #56 instructed ("reusing existing nodes where the Can-Do is language-agnostic... check for overlap before creating duplicates"). No new `cefr-nodes/` files were needed; only new `realisations/es-ES/*.yaml` files.

| nodeId         | Skill              | Can-Do                                                                    | Status      |
| -------------- | ------------------ | ------------------------------------------------------------------------- | ----------- |
| A1-GREET-001   | spoken_interaction | Can greet people and respond to greetings                                 | ✅ Realised |
| A1-GREET-002   | spoken_interaction | Can use basic formulas for leave-taking                                   | ✅ Realised |
| A1-INTRO-001   | spoken_interaction | Can introduce themselves and others                                       | ✅ Realised |
| A1-INTRO-002   | spoken_interaction | Can ask and answer basic questions about personal details                 | ✅ Realised |
| A1-NUMB-001    | reading            | Can recognize and write numbers 1-100                                     | ✅ Realised |
| A1-FOOD-001    | reading            | Can identify common food and drink items                                  | ✅ Realised |
| A1-THANK-001   | spoken_interaction | Can express thanks and respond to thanks                                  | ✅ Realised |
| A1-SORRY-001   | spoken_interaction | Can apologise and respond to apologies                                    | ✅ Realised |
| A1-LOC-001     | spoken_interaction | Can ask for and understand simple directions                              | ✅ Realised |
| A1-TIME-001    | reading            | Can understand basic time and date expressions                            | ✅ Realised |
| A1-REQUEST-001 | spoken_interaction | Can make simple requests using polite forms                               | ✅ Realised |
| A1-OFFER-001   | spoken_production  | Can offer things and make simple invitations                              | ✅ Realised |
| A1-OPIN-001    | spoken_production  | Can express simple opinions about everyday topics                         | ✅ Realised |
| A1-CAPAB-001   | spoken_production  | Can express ability and inability to do things                            | ✅ Realised |
| A1-WANT-001    | spoken_production  | Can express simple desires and intentions                                 | ✅ Realised |
| A1-FEEL-001    | listening          | Can understand and express basic emotions                                 | ✅ Realised |
| A1-CLARIFY-001 | spoken_interaction | Can ask someone to repeat or clarify                                      | ✅ Realised |
| A1-BODY-001    | reading            | Can identify basic body parts and simple health vocabulary                | ✅ Realised |
| A1-FAMILY-001  | spoken_production  | Can identify immediate family members and basic physical appearance terms | ✅ Realised |
| A1-HOBBY-001   | spoken_production  | (hobbies and free time vocabulary)                                        | ✅ Realised |
| A1-ROUTINE-001 | reading            | (daily routine / household vocabulary)                                    | ✅ Realised |
| A1-SHOP-001    | spoken_interaction | (shopping / money vocabulary)                                             | ✅ Realised |

A1 Coverage: 22/22 nodes fully realised (100%).

## PCIC's real Funciones (communicative functions) structure, A1-A2 level

The document organizes communicative functions into **6** top-level categories, each with many numbered subcategories, present across the A1-A2 volume. This is the actual authoritative structure — not inferred or invented — extracted directly from `cvc.cervantes.es/Ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm`:

| Category                                             | Selected A1-relevant subcategories                                                                       | Repo coverage                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **1. Dar y pedir información**                       | 1.2 Pedir información; 1.3 Dar información; 1.6 Describir                                                | ✅ A1-INTRO-002, A1-LOC-001, A1-TIME-001                      |
| **2. Expresar opiniones, actitudes y conocimientos** | 2.2 Dar una opinión; 2.20/2.21 Expresar (des)conocimiento; 2.23 Expresar habilidad para hacer algo       | ✅ A1-OPIN-001, A1-CAPAB-001                                  |
| **3. Expresar gustos, deseos y sentimientos**        | 3.8 Expresar deseos; 3.10 Expresar planes e intenciones; 3.12/3.13 Alegría/tristeza                      | ✅ A1-WANT-001, A1-FEEL-001                                   |
| **4. Influir en el interlocutor**                    | 4.2-4.4 Pedir un favor/objetos/ayuda; 4.14 Ofrecer e invitar                                             | ✅ A1-REQUEST-001, A1-OFFER-001                               |
| **5. Relacionarse socialmente**                      | 5.1/5.2 Saludar/responder; 5.4/5.5 Presentar/responder; 5.10-5.13 Disculparse/agradecer; 5.21 Despedirse | ✅ A1-GREET-001/002, A1-INTRO-001, A1-THANK-001, A1-SORRY-001 |
| **6. Estructurar el discurso**                       | Interaction management, requesting clarification (closest match to A1-CLARIFY-001's function)            | ✅ A1-CLARIFY-001                                             |

Note the genuinely different granularity from Referencial Camões: PCIC's category 2 alone has 26 numbered subcategories at A1-A2 (vs. Camões's Category D having 7). This mapping cites only the subcategories directly relevant to A1 nodes already in the repo, not the full inventory — matching the same "real structure, partial excerpt" discipline already established for the Portuguese doc.

## Sourcing note

No new vocabulary images were sourced for this epic — every `imageUrl` in the new `es-ES` realisations reuses an existing file from `public/vocab-images/` (already credited in `public/vocab-images/CREDITS.md`), since the underlying photographs depict concrete concepts (a head, a house, a euro coin) independent of language. See `docs/content-attribution.md` (#41) for the sourcing policy this follows.

## Process for adding a node

Same as `docs/cefr-mapping.md` §Process for adding a node, with one addition specific to a second target language: before creating a new `cefr-nodes/` file, check whether an existing node's Can-Do statement already covers the concept — CEFR Can-Do statements are language-agnostic, so a new target language should reuse nodes rather than duplicate them whenever the underlying ability is the same.

## A2 nodes in the repo

All 20 A2 `cefr-nodes/` are language-agnostic Can-Do statements already modeled for the en-GB/pt-PT pair (see `docs/cefr-mapping.md`). CEFR Can-Do statements describe communicative ability, not any one language, so this epic reused every existing A2 node rather than creating duplicates — exactly as the A1 epic did.

| nodeId        | Skill              | Can-Do                                               | Status      |
| ------------- | ------------------ | ---------------------------------------------------- | ----------- |
| A2-JOB-001    | spoken_production  | Can describe my job and working hours                | ✅ Realised |
| A2-JOB-002    | spoken_production  | Can talk about daily work routines                   | ✅ Realised |
| A2-JOB-003    | reading            | Can understand simple job advertisements             | ✅ Realised |
| A2-STUDY-001  | spoken_production  | Can describe my studies and qualifications           | ✅ Realised |
| A2-STUDY-002  | spoken_interaction | Can talk about my educational background             | ✅ Realised |
| A2-STUDY-003  | reading            | Can understand simple academic texts                 | ✅ Realised |
| A2-PAST-001   | spoken_production  | Can describe past events and experiences             | ✅ Realised |
| A2-PAST-002   | spoken_production  | Can talk about changes over time                     | ✅ Realised |
| A2-PAST-003   | listening          | Can understand simple narratives about the past      | ✅ Realised |
| A2-PAST-004   | writing            | Can compare past and present situations              | ✅ Realised |
| A2-HABIT-001  | spoken_production  | Can describe recent changes in habits                | ✅ Realised |
| A2-HABIT-002  | listening          | Can talk about recent activities                     | ✅ Realised |
| A2-HABIT-003  | reading            | Can understand simple news items about recent events | ✅ Realised |
| A2-NEWS-001   | reading            | Can understand simple news articles                  | ✅ Realised |
| A2-NEWS-002   | spoken_production  | Can describe events reported in the media            | ✅ Realised |
| A2-NEWS-003   | spoken_production  | Can express basic opinions about news items          | ✅ Realised |
| A2-CULT-001   | listening          | Can talk about cultural events and traditions        | ✅ Realised |
| A2-CULT-002   | spoken_interaction | Can describe simple aspects of different cultures    | ✅ Realised |
| A2-CULT-003   | spoken_production  | Can express opinions about cultural topics           | ✅ Realised |
| A2-HEALTH-001 | spoken_interaction | Can describe symptoms and understand medical advice  | ✅ Realised |

A2 Coverage: 20/20 nodes fully realised (100%).

## B1 nodes in the repo

All 18 B1 `cefr-nodes/` are language-agnostic Can-Do statements already modeled for the en-GB/pt-PT pair (see `docs/cefr-mapping.md`). CEFR Can-Do statements describe communicative ability, not any one language, so this epic reused every existing B1 node rather than creating duplicates — exactly as the A1 and A2 epics did.

| nodeId          | Skill              | Can-Do                                                   | Status      |
| --------------- | ------------------ | -------------------------------------------------------- | ----------- |
| B1-SOCIAL-001   | spoken_interaction | Can handle most social situations while travelling       | ✅ Realised |
| B1-SOCIAL-002   | spoken_interaction | Can engage in extended conversation on familiar topics   | ✅ Realised |
| B1-SOCIAL-003   | spoken_interaction | Can express and respond to feelings and opinions         | ✅ Realised |
| B1-SOCIAL-004   | spoken_production  | Can keep a conversation going by inviting opinions       | ✅ Realised |
| B1-DISCOURSE-001| spoken_interaction | Can use connectors to link ideas in extended speech      | ✅ Realised |
| B1-DISCOURSE-002| spoken_production  | Can narrate events in correct temporal sequence          | ✅ Realised |
| B1-DISCOURSE-003| spoken_production  | Can describe cause and effect relationships              | ✅ Realised |
| B1-DISCOURSE-004| writing            | Can write a simple narrative with temporal markers       | ✅ Realised |
| B1-DISCOURSE-005| writing            | Can write short reports describing experiences           | ✅ Realised |
| B1-OPINION-001  | spoken_production  | Can express opinions with supporting reasons             | ✅ Realised |
| B1-OPINION-002  | spoken_interaction | Can agree and disagree politely                          | ✅ Realised |
| B1-OPINION-003  | spoken_production  | Can describe advantages and disadvantages                | ✅ Realised |
| B1-OPINION-004  | writing            | Can write simple opinions about current events           | ✅ Realised |
| B1-TEXT-001     | reading            | Can understand factual articles on topics of interest    | ✅ Realised |
| B1-TEXT-002     | reading            | Can identify the main points in news articles            | ✅ Realised |
| B1-TEXT-003     | reading            | Can read simple technical information in their field     | ✅ Realised |
| B1-TEXT-004     | writing            | Can write straightforward connected text on familiar topics | ✅ Realised |
| B1-TEXT-005     | writing            | Can write a letter or email describing experiences       | ✅ Realised |

B1 Coverage: 18/18 nodes fully realised (100%).

### B1 skill distribution

| Skill              | Count | Nodes                              |
| ------------------ | ----- | ---------------------------------- |
| spoken_interaction | 4     | SOCIAL-001/002/003, DISCOURSE-001  |
| spoken_production  | 5     | SOCIAL-004, DISCOURSE-002/003, OPINION-001/003 |
| writing            | 5     | DISCOURSE-004/005, OPINION-004, TEXT-004/005 |
| reading            | 4     | TEXT-001/002/003                    |
| listening          | 0     | —                                  |

## B2 nodes in the repo

All 18 B2 `cefr-nodes/` are language-agnostic Can-Do statements already modeled for the en-GB/pt-PT pair (see `docs/cefr-mapping.md`). CEFR Can-Do statements describe communicative ability, not any one language, so this epic reused every existing B2 node rather than creating duplicates.

| nodeId          | Skill              | Can-Do                                                         | Status      |
| --------------- | ------------------ | -------------------------------------------------------------- | ----------- |
| B2-ARGUE-001    | spoken_production  | Can construct a chain of reasoning                              | ✅ Realised |
| B2-ARGUE-002    | spoken_production  | Can justify viewpoint on topical issues                         | ✅ Realised |
| B2-ARGUE-003    | spoken_production  | Can develop an argument systematically                          | ✅ Realised |
| B2-ARGUE-004    | writing            | Can sustain viewpoint by providing relevant supporting detail   | ✅ Realised |
| B2-SOCIAL-001   | spoken_interaction | Can interact with a degree of fluency and spontaneity           | ✅ Realised |
| B2-SOCIAL-002   | spoken_interaction | Can take an active part in discussion                           | ✅ Realised |
| B2-SOCIAL-003   | spoken_interaction | Can account for and sustain views by giving explanations        | ✅ Realised |
| B2-SOCIAL-004   | spoken_interaction | Can clarify a detailed point of view clearly                    | ✅ Realised |
| B2-SPOKEN-001   | listening          | Can understand extended speech and lectures                     | ✅ Realised |
| B2-SPOKEN-002   | listening          | Can understand most TV news, current affairs and films          | ✅ Realised |
| B2-SPOKEN-003   | listening          | Can understand the main ideas of complex speech                 | ✅ Realised |
| B2-TEXT-001     | reading            | Can read with a large degree of independence                    | ✅ Realised |
| B2-TEXT-002     | reading            | Can understand articles and reports on contemporary problems    | ✅ Realised |
| B2-TEXT-003     | reading            | Can recognise the line of argument in treatment of issues       | ✅ Realised |
| B2-TEXT-004     | reading            | Can understand the main conclusions of argumentative texts      | ✅ Realised |
| B2-WRITTEN-001  | writing            | Can write clear, detailed text on a wide range of subjects     | ✅ Realised |
| B2-WRITTEN-002  | writing            | Can write an essay or report that develops an argument          | ✅ Realised |
| B2-WRITTEN-003  | writing            | Can write with correct spelling and punctuation                 | ✅ Realised |

B2 Coverage: 18/18 nodes fully realised (100%).

### B2 skill distribution

| Skill              | Count | Nodes                                       |
| ------------------ | ----- | ------------------------------------------- |
| spoken_interaction | 4     | SOCIAL-001/002/003/004                       |
| spoken_production  | 3     | ARGUE-001/002/003                            |
| writing            | 4     | ARGUE-004, WRITTEN-001/002/003               |
| reading            | 4     | TEXT-001/002/003/004                         |
| listening          | 3     | SPOKEN-001/002/003                            |

## C1 nodes in the repo

All 25 C1 `cefr-nodes/` are language-agnostic Can-Do statements already modeled for the en-GB/pt-PT pair (see `docs/cefr-mapping.md`). CEFR Can-Do statements describe communicative ability, not any one language, so this epic reused every existing C1 node rather than creating duplicates.

| nodeId            | Skill              | Can-Do                                                                               | Status      |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------ | ----------- |
| C1-ACADEMIC-001   | writing            | Can write a dissertation or report of substance with reasoned conclusion             | ✅ Realised |
| C1-ACADEMIC-002   | spoken_production  | Can present complex content to specialist or general audience                         | ✅ Realised |
| C1-ARGUE-001      | spoken_production  | Can present clear, detailed descriptions of complex subjects                         | ✅ Realised |
| C1-ARGUE-002      | spoken_production  | Can develop an argument systematically while evaluating counter-arguments             | ✅ Realised |
| C1-ARGUE-003      | spoken_production  | Can express subtle shades of meaning using qualifying devices                         | ✅ Realised |
| C1-ARGUE-004      | writing            | Can sustain a viewpoint in writing by evaluating counter-arguments                    | ✅ Realised |
| C1-LITERARY-001   | reading            | Can appreciate implicit layers of meaning in literary texts                           | ✅ Realised |
| C1-MEDIATION-001  | spoken_production  | Can explain complicated issues to non-experts without losing accuracy                 | ✅ Realised |
| C1-NUANCED-001    | spoken_interaction | Can handle disagreement with nuance, adjusting expression to context                  | ✅ Realised |
| C1-PROFESSIONAL-001| spoken_interaction | Can make well-structured proposals in professional contexts                            | ✅ Realised |
| C1-PROFESSIONAL-002| writing            | Can write clear, well-structured documents on complex subjects                        | ✅ Realised |
| C1-SOCIAL-001     | spoken_interaction | Can express self fluently and spontaneously without searching for expressions          | ✅ Realised |
| C1-SOCIAL-002     | spoken_interaction | Can use language flexibly and effectively for social purposes                          | ✅ Realised |
| C1-SPOKEN-001     | spoken_production  | Can give elaborate descriptions embedding sub-themes with appropriate conclusion       | ✅ Realised |
| C1-SPOKEN-002     | spoken_production  | Can express ideas without searching for expressions, using idiomatic expressions       | ✅ Realised |
| C1-SPOKEN-003     | spoken_interaction | Can keep up fluent conversation on abstract and complex topics                         | ✅ Realised |
| C1-SPOKEN-004     | listening          | Can understand extended speech even when not clearly structured                        | ✅ Realised |
| C1-SPOKEN-005     | listening          | Can understand television programmes and films without too much effort                 | ✅ Realised |
| C1-TEXT-001       | reading            | Can understand a wide range of demanding, longer texts and recognise implicit meaning  | ✅ Realised |
| C1-TEXT-002       | reading            | Can understand specialised articles and longer technical instructions                  | ✅ Realised |
| C1-TEXT-003       | reading            | Can appreciate contemporary literary texts including idiomatic and cultural allusions   | ✅ Realised |
| C1-TEXT-004       | reading            | Can understand complex argumentative texts and identify line of argumentation          | ✅ Realised |
| C1-WRITTEN-001    | writing            | Can write a convincing text on abstract and topical subjects                           | ✅ Realised |
| C1-WRITTEN-002    | writing            | Can write a critical review of a film, exhibition or work                             | ✅ Realised |
| C1-WRITTEN-003    | writing            | Can write a well-structured personal narrative of a complex experience                 | ✅ Realised |

C1 Coverage: 25/25 nodes fully realised (100%).

### C1 skill distribution

| Skill              | Count | Nodes                                                        |
| ------------------ | ----- | ------------------------------------------------------------ |
| spoken_interaction | 5     | SOCIAL-001/002, NUANCED-001, PROFESSIONAL-001, SPOKEN-003    |
| spoken_production  | 6     | ACADEMIC-002, ARGUE-001/002/003, MEDIATION-001, SPOKEN-001/002 |
| writing            | 7     | ACADEMIC-001, ARGUE-004, PROFESSIONAL-002, WRITTEN-001/002/003 |
| reading            | 5     | LITERARY-001, TEXT-001/002/003/004                             |
| listening          | 2     | SPOKEN-004/005                                                 |

## C2 nodes in the repo

All 20 C2 `cefr-nodes/` are language-agnostic Can-Do statements sourced from the CEFR C2 descriptors (Council of Europe Companion Volume). CEFR Can-Do statements describe communicative ability, not any one language, so this epic created new C2 nodes and paired es-ES realisations.

| nodeId            | Skill              | Can-Do                                                                               | Status      |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------ | ----------- |
| C2-MODALITY-001   | spoken_interaction | Can express spontaneously, fluently and precisely, differentiating finer shades       | ✅ Realised |
| C2-MODALITY-002   | spoken_production  | Can present a clear, smoothly-flowing accurate description or argument               | ✅ Realised |
| C2-MODALITY-003   | listening          | Can understand any kind of spoken language at fast native speed                       | ✅ Realised |
| C2-MODALITY-004   | reading            | Can understand virtually everything heard or read, summarising from different sources  | ✅ Realised |
| C2-MODALITY-005   | writing            | Can write clear, smoothly-flowing text on a complex subject with appropriate style    | ✅ Realised |
| C2-SUMMARY-001    | writing            | Can summarise concisely information from extended spoken and written sources          | ✅ Realised |
| C2-ARGUE-001      | writing            | Can select appropriate formulation from a broad range of language                     | ✅ Realised |
| C2-ARGUE-002      | spoken_interaction | Can take active part in discussion in all registers, constructing chains of reasoning | ✅ Realised |
| C2-NUANCE-001     | spoken_interaction | Can express clearly and precisely, differentiating finer shades of meaning            | ✅ Realised |
| C2-PROFESSIONAL-001| writing           | Can write excellent, well-structured summaries of complex factual material            | ✅ Realised |
| C2-PROFESSIONAL-002| spoken_interaction| Can express fluently with near-native command of vocabulary and syntax                 | ✅ Realised |
| C2-LITERARY-001   | reading            | Can read and appreciate complex literary texts, poetry, song lyrics, opinion pieces   | ✅ Realised |
| C2-LITERARY-002   | writing            | Can write with precision and subtlety, adapting style to text and audience            | ✅ Realised |
| C2-ACADEMIC-001   | writing            | Can write clearly and fluently on complex subjects with coherent, convincing text     | ✅ Realised |
| C2-ACADEMIC-002   | spoken_production  | Can present clear, detailed and accurate descriptions of complex subjects             | ✅ Realised |
| C2-MEDIATION-001  | spoken_interaction | Can act as effective intermediary, simplifying messages and resolving disagreements   | ✅ Realised |
| C2-MEDIATION-002  | reading            | Can understand all forms of written language including abstract and complex texts     | ✅ Realised |
| C2-SOCIAL-001     | spoken_interaction | Can interact with native speakers with fluency, spontaneity and precision             | ✅ Realised |
| C2-WRITTEN-001    | writing            | Can write clear, detailed texts developing arguments and hypotheses                   | ✅ Realised |
| C2-WRITTEN-002    | writing            | Can write with precision and subtlety, conveying intended effect on the reader        | ✅ Realised |

C2 Coverage: 20/20 nodes fully realised (100%).

### C2 skill distribution

| Skill              | Count | Nodes                                                        |
| ------------------ | ----- | ------------------------------------------------------------ |
| spoken_interaction | 6     | MODALITY-001/003, ARGUE-002, NUANCE-001, PROFESSIONAL-002, MEDIATION-001, SOCIAL-001 |
| spoken_production  | 2     | MODALITY-002, ACADEMIC-002                                    |
| writing            | 8     | MODALITY-005, SUMMARY-001, ARGUE-001, PROFESSIONAL-001, LITERARY-002, ACADEMIC-001, WRITTEN-001/002 |
| reading            | 3     | MODALITY-004, LITERARY-001, MEDIATION-002                     |
| listening          | 1     | MODALITY-003                                                  |

### es-ES realisation totals

| Level | Vocabulary items | Grammar points | Files |
| ----- | ---------------- | -------------- | ----- |
| A1    | 132              | 0              | 22    |
| A2    | 120              | 8              | 20    |
| B1    | 108              | 9              | 18    |
| B2    | 108              | 9              | 18    |
| C1    | 150              | 12             | 25    |
| C2    | 120              | 10             | 20    |
| **Total** | **738**      | **48**         | **123** |
