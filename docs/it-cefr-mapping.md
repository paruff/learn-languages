# Italian (it-IT) CEFR Mapping — A1 Inventory

Tracks the CEFR A1 Can-Do inventory for **en-GB↔it-IT** against the shared repository node set and the paired `realisations` content. This issue reuses the existing language-agnostic A1 node inventory rather than creating a duplicate Italian-only schema.

## Source verification

This mapping follows the same evidence rule used elsewhere in the repo: the CEFR inventory is not assumed by language; it is checked against a publicly available institutional descriptor source and then mapped onto the shared node set. For the Italian A1 slice, the repository uses the common CEFR A1 skill structure already reflected in the shared `cefr-nodes/` YAML files.

**Source basis:** the Council of Europe CEFR A1 descriptors combined with the repo’s verified language-agnostic A1 nodes already used for en-GB/pt-PT/es-ES/de-DE/fr-FR. The A1 inventory is a shared capability model, and the Italian realisations are language-specific surface forms of those already-validated Can-Do statements.

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

A1 coverage: 23/23 nodes fully realised (100%). All A1 node IDs now have paired `en-GB` + `it-IT` realisations and match the shared concept inventory consumed by `npm run report:coverage -- it-IT A1`.

## Notes

- This epic follows the repository’s existing playbook: reuse the shared CEFR A1 nodes, author the target-language realisation layer, and verify content integrity rather than creating language-specific node IDs.
- The route set is derived from actual realisations via `getAvailablePairs()`, so adding the `it-IT` A1 files creates the `en-GB↔it-IT` review and lesson routes automatically.
- Browser validation is done via the real `en-GB→it-IT` A1 flow, with SRS state persisted under the pair key `srs:en-GB:it-IT:forward:*`.
