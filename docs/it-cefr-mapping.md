# Italian (it-IT) CEFR Mapping — A1–B1 and C1 Inventory

Tracks the CEFR A1–B1 and C1 Can-Do inventory for **en-GB↔it-IT** against the shared repository node set and paired `realisations` content. This epic reuses the existing language-agnostic B1 and C1 node inventories rather than creating a duplicate Italian-only schema.

## Source verification

This mapping follows the same evidence rule used elsewhere in the repo: the CEFR inventory is not assumed by language; it is checked against a publicly available institutional descriptor source and then mapped onto the shared node set. For the Italian A1–B1 slices, the repository reuses the language-agnostic CEFR nodes already used across the other verified language pairs.

**Source basis:** Council of Europe CEFR descriptors for A1, A2 and B1, validated against the repository's shared `cefr-nodes/` inventory and the same source model already used for the existing verified pair docs (pt-PT, es-ES, de-DE, fr-FR).

## A1 coverage table

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
| A1-FAMILY-001  | reading            | Can identify immediate family members and basic physical appearance terms | ✅ Realised |
| A1-HOBBY-001   | reading            | Can identify common hobbies and free-time activities                      | ✅ Realised |
| A1-ROUTINE-001 | reading            | Can identify common daily-life objects and rooms in a home                | ✅ Realised |
| A1-SHOP-001    | reading            | Can identify basic shopping and money vocabulary                          | ✅ Realised |
| A1-FORM-001    | writing            | Can fill in a simple form with basic personal details                     | ✅ Realised |
| A1-WRITE-001   | writing            | Can write simple personal messages or short notes                         | ✅ Realised |

A1 coverage: 24/24 nodes fully realised (100%). All A1 node IDs now have paired `en-GB` + `it-IT` realisations and match the shared concept inventory consumed by `npm run report:coverage -- it-IT A1`.

## A2 coverage table

The A2 inventory is the repo's 30 shared A2 `cefr-nodes/`. 20 nodes have an `it-IT` realisation today; the remaining 10 are listed as pending rather than claimed as complete.

| nodeId        | Skill              | Can-Do                                               | Status      |
| ------------- | ------------------ | ---------------------------------------------------- | ----------- |
| A2-CULT-001   | listening          | Can talk about cultural events and traditions        | ✅ Realised |
| A2-CULT-002   | spoken_interaction | Can describe simple aspects of different cultures    | ✅ Realised |
| A2-CULT-003   | spoken_production  | Can express opinions about cultural topics           | ✅ Realised |
| A2-HABIT-001  | spoken_production  | Can describe recent changes in habits                | ✅ Realised |
| A2-HABIT-002  | listening          | Can talk about recent activities                     | ✅ Realised |
| A2-HABIT-003  | reading            | Can understand simple news items about recent events | ✅ Realised |
| A2-HEALTH-001 | spoken_interaction | Can describe symptoms and understand medical advice  | ✅ Realised |
| A2-JOB-001    | spoken_production  | Can describe my job and working hours                | ✅ Realised |
| A2-JOB-002    | spoken_production  | Can talk about daily work routines                   | ✅ Realised |
| A2-JOB-003    | reading            | Can understand simple job advertisements             | ✅ Realised |
| A2-NEWS-001   | reading            | Can understand simple news articles                  | ✅ Realised |
| A2-NEWS-002   | spoken_production  | Can describe events reported in the media            | ✅ Realised |
| A2-NEWS-003   | spoken_production  | Can express basic opinions about news items          | ✅ Realised |
| A2-PAST-001   | spoken_production  | Can describe past events and experiences             | ✅ Realised |
| A2-PAST-002   | spoken_production  | Can talk about changes over time                     | ✅ Realised |
| A2-PAST-003   | listening          | Can understand simple narratives about the past      | ✅ Realised |
| A2-PAST-004   | writing            | Can compare past and present situations              | ✅ Realised |
| A2-STUDY-001  | spoken_production  | Can describe my studies and qualifications           | ✅ Realised |
| A2-STUDY-002  | spoken_interaction | Can talk about my educational background             | ✅ Realised |
| A2-STUDY-003  | reading            | Can understand simple academic texts                 | ✅ Realised |

A2 coverage: 20/30 nodes realised. Pending: `A2-DESCRIBE-001`, `A2-LETTER-001`, `A2-LOC-001`, `A2-MEDIA-001`, `A2-OPIN-001`, `A2-PLANS-001`, `A2-SHOP-001`, `A2-SIGN-001`, `A2-SOCIAL-001`, `A2-WRITE-001`.

## B1 coverage table

| nodeId            | Skill              | Can-Do                                                      | Status      |
| ----------------- | ------------------ | ----------------------------------------------------------- | ----------- |
| B1-ARGUMENT-001   | writing            | Can identify the main points in an argument                 | ✅ Realised |
| B1-CLARIFY-001    | spoken_interaction | Can ask for and give clarification in conversations         | ✅ Realised |
| B1-CONSULT-001    | spoken_interaction | Can describe symptoms and consult a professional            | ✅ Realised |
| B1-CORRESPOND-001 | writing            | Can keep up a correspondence with a pen friend              | ✅ Realised |
| B1-DESCRIBE-001   | spoken_production  | Can describe experiences and feelings in detail             | ✅ Realised |
| B1-DISCOURSE-001  | spoken_interaction | Can use connectors to link ideas in extended speech         | ✅ Realised |
| B1-DISCOURSE-002  | spoken_production  | Can narrate events in correct temporal sequence             | ✅ Realised |
| B1-DISCOURSE-003  | spoken_production  | Can describe cause and effect relationships                 | ✅ Realised |
| B1-DISCOURSE-004  | writing            | Can write a simple narrative with temporal markers          | ✅ Realised |
| B1-DISCOURSE-005  | writing            | Can write short reports describing experiences              | ✅ Realised |
| B1-EXCHANGE-001   | spoken_interaction | Can exchange information on familiar topics                 | ✅ Realised |
| B1-EXPERIENCE-001 | spoken_production  | Can relate personal experiences and reactions               | ✅ Realised |
| B1-INSTRUCT-001   | spoken_interaction | Can give clear instructions and procedures                  | ✅ Realised |
| B1-LISTEN-001     | listening          | Can follow the main points of a clear discussion            | ✅ Realised |
| B1-LOCATE-001     | reading            | Can locate specific information in a text                   | ✅ Realised |
| B1-MEDIA-001      | listening          | Can understand the gist of radio and media content          | ✅ Realised |
| B1-MESSAGE-001    | writing            | Can relay a message and clarify key points                  | ✅ Realised |
| B1-NOTES-001      | writing            | Can take notes on key information in a lecture              | ✅ Realised |
| B1-OPINION-001    | spoken_production  | Can express opinions with supporting reasons                | ✅ Realised |
| B1-OPINION-002    | spoken_interaction | Can agree and disagree politely                             | ✅ Realised |
| B1-OPINION-003    | spoken_production  | Can describe advantages and disadvantages                   | ✅ Realised |
| B1-OPINION-004    | writing            | Can write simple opinions about current events              | ✅ Realised |
| B1-PROCEDURE-001  | reading            | Can follow a process or set of instructions                 | ✅ Realised |
| B1-RECAP-001      | spoken_production  | Can summarise and recap information clearly                 | ✅ Realised |
| B1-SERVICE-001    | spoken_interaction | Can manage typical service and administrative interactions  | ✅ Realised |
| B1-SOCIAL-001     | spoken_interaction | Can handle most social situations while travelling          | ✅ Realised |
| B1-SOCIAL-002     | spoken_interaction | Can engage in extended conversation on familiar topics      | ✅ Realised |
| B1-SOCIAL-003     | spoken_interaction | Can express and respond to feelings and opinions            | ✅ Realised |
| B1-SOCIAL-004     | spoken_production  | Can keep a conversation going by inviting opinions          | ✅ Realised |
| B1-SUMMARY-001    | writing            | Can summarise the main points of a factual text             | ✅ Realised |
| B1-TEXT-001       | reading            | Can understand factual articles on topics of interest       | ✅ Realised |
| B1-TEXT-002       | reading            | Can identify the main points in news articles               | ✅ Realised |
| B1-TEXT-003       | reading            | Can read simple technical information in their field        | ✅ Realised |
| B1-TEXT-004       | writing            | Can write straightforward connected text on familiar topics | ✅ Realised |
| B1-TEXT-005       | writing            | Can write a letter or email describing experiences          | ✅ Realised |

B1 coverage: 35/35 nodes fully realised (100%). The Italian B1 slice reuses the shared CEFR B1 node set and adds paired `en-GB` + `it-IT` realisations for every B1 node in `src/content/realisations/it-IT`.

## C1 coverage table

| nodeId              | Skill              | Can-Do                                                                                                                                                       | Status      |
| ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| C1-ACADEMIC-001     | writing            | Can write a dissertation or report of substance, presenting a reasoned conclusion and engaging with the sources consulted                                    | ✅ Realised |
| C1-ACADEMIC-002     | spoken_production  | Can present complex content to a specialist or general audience, structuring the talk coherently and adapting it to the listeners                            | ✅ Realised |
| C1-ARGUE-001        | spoken_production  | Can present clear, detailed descriptions of complex subjects integrating sub-themes and developing particular points                                         | ✅ Realised |
| C1-ARGUE-002        | spoken_production  | Can develop an argument systematically with appropriate highlighting of significant points and relevant supporting detail while evaluating counter-arguments | ✅ Realised |
| C1-ARGUE-003        | spoken_production  | Can express subtle shades of meaning using a wide range of qualifying devices                                                                                | ✅ Realised |
| C1-ARGUE-004        | writing            | Can sustain a viewpoint in writing by providing relevant supporting detail and evaluating counter-arguments                                                  | ✅ Realised |
| C1-LITERARY-001     | reading            | Can appreciate the wider, implicit layers of meaning in literary texts, including allusion, irony and cultural reference                                     | ✅ Realised |
| C1-MEDIATION-001    | spoken_production  | Can explain a complicated issue in a way that makes it accessible to a non-expert, reformulating and simplifying without losing accuracy                     | ✅ Realised |
| C1-NUANCED-001      | spoken_interaction | Can handle a disagreement in a conversation with nuance, adjusting the choice of expression to the interlocutor and the stakes                               | ✅ Realised |
| C1-PROFESSIONAL-001 | spoken_interaction | Can make a well-structured proposal or presentation in a professional context and deal confidently with questions and objections                             | ✅ Realised |
| C1-PROFESSIONAL-002 | writing            | Can write clear, well-structured documents on complex subjects in a formal professional register, highlighting decisive points                               | ✅ Realised |
| C1-SOCIAL-001       | spoken_interaction | Can express him/herself fluently and spontaneously without much obvious searching for expressions                                                            | ✅ Realised |
| C1-SOCIAL-002       | spoken_interaction | Can use language flexibly and effectively for social purposes in a wide range of contexts                                                                    | ✅ Realised |
| C1-SPOKEN-001       | spoken_production  | Can give elaborate descriptions and narratives, embedding sub-themes, developing particular aspects and rounding off with an appropriate conclusion          | ✅ Realised |
| C1-SPOKEN-002       | spoken_production  | Can express ideas and opinions without much searching for expressions, using idiomatic expressions appropriately                                             | ✅ Realised |
| C1-SPOKEN-003       | spoken_interaction | Can keep up a fluent conversation on abstract and complex topics, using a variety of devices to structure and emphasise discourse                            | ✅ Realised |
| C1-SPOKEN-004       | listening          | Can understand extended speech even when it is not clearly structured and when relationships are only implied and not signalled explicitly                   | ✅ Realised |
| C1-SPOKEN-005       | listening          | Can understand television programmes and films without too much effort                                                                                       | ✅ Realised |
| C1-TEXT-001         | reading            | Can understand a wide range of demanding, longer texts and recognise implicit meaning                                                                        | ✅ Realised |
| C1-TEXT-002         | reading            | Can understand specialised articles and longer technical instructions, even when not related to their own field                                              | ✅ Realised |
| C1-TEXT-003         | reading            | Can appreciate contemporary literary texts including idiomatic, cultural and historic allusions                                                              | ✅ Realised |
| C1-TEXT-004         | reading            | Can understand complex argumentative texts and identify the author's line of argumentation, claims, evidence and conclusion                                  | ✅ Realised |
| C1-WRITTEN-001      | writing            | Can write a convincing, coherent text on abstract and topical subjects, adapting the register to the intended reader                                         | ✅ Realised |
| C1-WRITTEN-002      | writing            | Can write a critical review of a film, exhibition or work, choosing the style appropriate to the intended publication                                        | ✅ Realised |
| C1-WRITTEN-003      | writing            | Can write a well-structured personal narrative of a complex experience with a coherent, convincing and personal point of view                                | ✅ Realised |

C1 coverage: 25/25 nodes realised (100% of nodes, 1 concept per node). C1 landed ahead of B2 by explicit product direction; Italian B2 remains in progress under #182, so the C1 slice reuses the shared C1 node set without a complete B2 bridge. Depth matches the accepted fr-FR C1 pattern (1 concept per node) rather than the 6-concept en-GB/pt-PT/es-ES/de-DE sets; `validate:content` reports that depth gap as an informational parity warning. Every C1 concept key is copied from the shared en-GB realisation for the same node, so prompts and answers pair without a divergent Italian taxonomy.

## Notes

- C1 review and lesson routes work with the same pair key and SRS scoping as the lower levels; `tests/e2e/review-it.spec.ts` exercises a full C1 session and the `C1-SPOKEN-002` lesson.
- The route set is derived from actual realisations via `getAvailablePairs()`, so the `en-GB↔it-IT` review and lesson routes become available automatically once the B1 files are in place.
- Browser validation is done via the real `en-GB→it-IT` review flow, with SRS state persisted under the pair key `srs:en-GB:it-IT:forward:*`.
- This update follows the repository playbook: reuse the shared CEFR node inventory, author the target-language realisation layer, and validate integrity rather than duplicating the node model.
