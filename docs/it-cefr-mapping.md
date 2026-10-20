# Italian (it-IT) CEFR Mapping — A1–A2 Inventory

Tracks the CEFR A1–A2 Can-Do inventory for **en-GB↔it-IT** against the shared repository node set and the paired `realisations` content. This reuses the existing language-agnostic node inventory rather than creating a duplicate Italian-only schema.

## Source verification

This mapping follows the same evidence rule used elsewhere in the repo: the CEFR inventory is not assumed by language; it is checked against a publicly available institutional descriptor source and then mapped onto the shared node set. For the Italian slice, the repository uses the common CEFR A1–A2 skill structure already reflected in the shared `cefr-nodes/` YAML files.

**Source basis:** the Council of Europe CEFR descriptors combined with the repo’s verified language-agnostic A1–A2 nodes already used for en-GB/pt-PT/es-ES/de-DE/fr-FR. The inventory is a shared capability model, and the Italian realisations are language-specific surface forms of those already-validated Can-Do statements.

## A1 coverage table

| nodeId | Skill | Can-Do | Status |
| --- | --- | --- | --- |
| A1-GREET-001 | spoken_interaction | Can greet people and respond to greetings | ✅ Realised |
| A1-GREET-002 | spoken_interaction | Can use basic formulas for leave-taking | ✅ Realised |
| A1-INTRO-001 | spoken_interaction | Can introduce themselves and others | ✅ Realised |
| A1-INTRO-002 | spoken_interaction | Can ask and answer basic questions about personal details | ✅ Realised |
| A1-NUMB-001 | reading | Can recognize and write numbers 1-100 | ✅ Realised |
| A1-FOOD-001 | reading | Can identify common food and drink items | ✅ Realised |
| A1-THANK-001 | spoken_interaction | Can express thanks and respond to thanks | ✅ Realised |
| A1-SORRY-001 | spoken_interaction | Can apologise and respond to apologies | ✅ Realised |
| A1-LOC-001 | spoken_interaction | Can ask for and understand simple directions | ✅ Realised |
| A1-TIME-001 | reading | Can understand basic time and date expressions | ✅ Realised |
| A1-REQUEST-001 | spoken_interaction | Can make simple requests using polite forms | ✅ Realised |
| A1-OFFER-001 | spoken_production | Can offer things and make simple invitations | ✅ Realised |
| A1-OPIN-001 | spoken_production | Can express simple opinions about everyday topics | ✅ Realised |
| A1-CAPAB-001 | spoken_production | Can express ability and inability to do things | ✅ Realised |
| A1-WANT-001 | spoken_production | Can express simple desires and intentions | ✅ Realised |
| A1-FEEL-001 | listening | Can understand and express basic emotions | ✅ Realised |
| A1-CLARIFY-001 | spoken_interaction | Can ask someone to repeat or clarify | ✅ Realised |
| A1-BODY-001 | reading | Can identify basic body parts and simple health vocabulary | ✅ Realised |
| A1-FAMILY-001 | reading | Can identify immediate family members and basic physical appearance terms | ✅ Realised |
| A1-HOBBY-001 | reading | Can identify common hobbies and free-time activities | ✅ Realised |
| A1-ROUTINE-001 | reading | Can identify common daily-life objects and rooms in a home | ✅ Realised |
| A1-SHOP-001 | reading | Can identify basic shopping and money vocabulary | ✅ Realised |
| A1-FORM-001 | writing | Can fill in a simple form with basic personal details | ✅ Realised |
| A1-WRITE-001 | writing | Can write simple personal messages or short notes | ✅ Realised |

A1 coverage: 24/24 nodes fully realised (100%). All A1 node IDs have paired `en-GB` + `it-IT` realisations and match the shared concept inventory consumed by `npm run report:coverage -- it-IT A1`.

## A2 nodes in the repo (EN→IT)

The A2 inventory is the repo's 30 shared A2 `cefr-nodes/`, not a guessed Italian-only taxonomy. 20 of the 30 nodes have an `it-IT` realisation today; the remaining 10 are listed as pending rather than claimed as complete.

| nodeId         | Skill              | Can-Do                                                    | Status      |
| -------------- | ------------------ | --------------------------------------------------------- | ----------- |
| A2-CULT-001    | listening          | Can talk about cultural events and traditions             | ✅ Realised |
| A2-CULT-002    | spoken_interaction | Can describe simple aspects of different cultures         | ✅ Realised |
| A2-CULT-003    | spoken_production  | Can express opinions about cultural topics                | ✅ Realised |
| A2-HABIT-001   | spoken_production  | Can describe recent changes in habits                     | ✅ Realised |
| A2-HABIT-002   | listening          | Can talk about recent activities                          | ✅ Realised |
| A2-HABIT-003   | reading            | Can understand simple news items about recent events      | ✅ Realised |
| A2-HEALTH-001  | spoken_interaction | Can describe symptoms and understand medical advice       | ✅ Realised |
| A2-JOB-001     | spoken_production  | Can describe my job and working hours                     | ✅ Realised |
| A2-JOB-002     | spoken_production  | Can talk about daily work routines                        | ✅ Realised |
| A2-JOB-003     | reading            | Can understand simple job advertisements                  | ✅ Realised |
| A2-NEWS-001    | reading            | Can understand simple news articles                       | ✅ Realised |
| A2-NEWS-002    | spoken_production  | Can describe events reported in the media                 | ✅ Realised |
| A2-NEWS-003    | spoken_production  | Can express basic opinions about news items               | ✅ Realised |
| A2-PAST-001    | spoken_production  | Can describe past events and experiences                   | ✅ Realised |
| A2-PAST-002    | spoken_production  | Can talk about changes over time                          | ✅ Realised |
| A2-PAST-003    | listening          | Can understand simple narratives about the past           | ✅ Realised |
| A2-PAST-004    | writing            | Can compare past and present situations                   | ✅ Realised |
| A2-STUDY-001   | spoken_production  | Can describe my studies and qualifications                | ✅ Realised |
| A2-STUDY-002   | spoken_interaction | Can talk about my educational background                  | ✅ Realised |
| A2-STUDY-003   | reading            | Can understand simple academic texts                      | ✅ Realised |

A2 coverage: 20/30 nodes realised. Pending: `A2-DESCRIBE-001`, `A2-LETTER-001`, `A2-LOC-001`, `A2-MEDIA-001`, `A2-OPIN-001`, `A2-PLANS-001`, `A2-SHOP-001`, `A2-SIGN-001`, `A2-SOCIAL-001`, `A2-WRITE-001`.

## Notes

The route set is derived from actual realisations via `getAvailablePairs()`, so the `it-IT` files create the `en-GB↔it-IT` review and lesson routes automatically — no language-specific routing code. Browser validation runs the real `en-GB→it-IT` flow, with SRS state persisted under the pair key `srs:en-GB:it-IT:forward:*`.
