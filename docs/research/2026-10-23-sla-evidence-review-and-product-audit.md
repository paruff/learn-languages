# SLA evidence review and product audit

Date: 2026-10-23. Asked by the owner: review the plan against the objective evidence for effective second-language acquisition (SLA), say what else we can do, record where the platform limits us, and audit the current product. Outputs: new spec rows (L21–L32, C10, C11, S8), master-plan rows 1.5, 1.6, D.3, 2.10–2.16 and 3.4–3.9, the **Known platform limitations** section in [`plans/README.md`](../../plans/README.md), and issues #241–#256.

Method: read `intent.md`, `spec.md`, the master plan, `docs/learning-science-references.md`, the review loop (`review.astro`, `reviewSession.ts`, `srs.ts`, `exerciseCheck.ts`, `pronounce.ts`), the content collections and the built `dist/`. Evidence comes from meta-analyses and primary studies in SLA and cognitive psychology (citations in §8). Every citation was checked online on 2026-10-23 (Crossref metadata, publisher pages, abstracts); §9 records what was checked and what changed.

## 1. Summary

- **What we do is well supported, but it is one quarter of what language learning needs.** Retrieval, spacing, interleaving, generation and calibration are the strongest findings in learning science, and Acquira applies them carefully. But they are applied to one thing: single words on flashcards. Nation's four strands (2007) say a balanced course gives roughly equal time to meaning-focused input, meaning-focused output, language-focused learning, and fluency development. Acquira is almost entirely the third strand.
- **The CEFR labels overstate what a learner can reach.** Each language has ~800 vocabulary items for A1–C2. Reading comfortably needs 95–98% of words known, which takes several thousand word families (Laufer & Ravenhorst-Kalovski 2010; Nation 2006). And 122 of 154 Can-Do nodes are listening, speaking or writing skills that are practised only as vocabulary cards.
- **The cheapest wins left are in the loop itself**, not new surfaces: learn new words to criterion, use the example sentences we already wrote, sharper feedback on typed answers, a better scheduler, and an implementation-intention prompt for coming back.
- **Two real bugs** found: exercises show Portuguese on every pair, and Safari can silently delete a learner's progress after 7 days away.

## 2. The frame: Nation's four strands

| Strand                                                                     | Evidence                                                                                                                                                            | Acquira today                                                                              | Gap → row                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Language-focused learning** (deliberate study of words, grammar, sounds) | Strong: intentional vocabulary learning works (Webb, Yanagisawa & Uchihara 2020); explicit instruction works for adults (Norris & Ortega 2000; Spada & Tomita 2010) | Strong for vocabulary (L1–L5, L10–L12). Grammar is read-only (L8 ⬜). Pronunciation absent | 2.10, 2.11, 2.12, 2.13 (loop); 2.4/2.8 (grammar, existing); 3.5 (sounds) |
| **Meaning-focused input** (reading and listening for meaning)              | Strong: extensive reading (Jeon & Day 2016); coverage thresholds (Hu & Nation 2000)                                                                                 | None. Example sentences exist but are only shown after "Again"                             | 2.11 (cloze in context), 2.14 (listening cards), 3.4 (graded reading)    |
| **Meaning-focused output** (speaking and writing to communicate)           | Moderate–strong: output and noticing (Swain 1985); interaction (Mackey & Goo 2007); TBLT (Bryfonski & McKay 2019)                                                   | None. Typed recall produces single words only                                              | 3.6 (self-record), 3.7 (task cards). Interaction itself: platform limit  |
| **Fluency development** (fast, easy use of what you know)                  | Moderate: automaticity (DeKeyser 2007; de Jong & Perfetti 2011)                                                                                                     | None. Every card is new or effortful by design                                             | 2.16 (fluency round)                                                     |

This doesn't mean Acquira must become a full course. Intent §1 is a tool for fragmented time, and language-focused learning is the strand that fits 10-minute sessions best. It does mean the product should **say** what it covers (Progress, "Why this works") and point learners to the other three strands, which costs copy, not code.

## 3. Evidence by mechanism

Strength: **High** = several meta-analyses agree; **Moderate** = one meta-analysis or consistent primary studies; **Low/mixed** = small or conflicting studies.

| Mechanism                           | Strength                 | Key sources                                                                    | In Acquira                                        | Action                                                        |
| ----------------------------------- | ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------- |
| Retrieval practice                  | High                     | Roediger & Karpicke 2006; Barcroft 2007 (L2 vocabulary)                        | ✅ L1, L7                                         | Keep                                                          |
| Spacing                             | High                     | Cepeda et al. 2006; Kim & Webb 2022 (L2 meta-analysis)                         | ✅ L2 (SM-2)                                      | L22 (FSRS) for fewer reviews; see §9 caveats                  |
| Successive relearning to criterion  | High                     | Rawson & Dunlosky 2011; Rawson, Dunlosky & Sciartelli 2013                     | 🟡 one re-queue after Again                       | L23                                                           |
| Interleaving                        | Moderate                 | Rohrer & Taylor 2007; Dunlosky et al. 2013                                     | ✅ L3                                             | Keep                                                          |
| Generation / productive retrieval   | Moderate–High            | Slamecka & Graf 1978; Webb 2009 (productive vs receptive)                      | ✅ L4; default direction is productive            | Keep. L26 makes its feedback useful                           |
| Corrective feedback                 | High                     | Li 2010; Lyster & Saito 2010; Hattie & Timperley 2007                          | 🟡 L10 on Again; typed recall is right/wrong only | L26 (show the diff, suggest the grade)                        |
| Set size                            | Weak (no effect)         | Nakata & Webb 2016: set size mattered little once spacing was equal            | ✅ J2 daily cap of 10 new                         | Keep J2 for workload and spacing, not as a set-size effect    |
| Words in context and in chunks      | Moderate                 | Boers & Lindstromberg 2012; Webb et al. 2020                                   | ⬜ example sentences unused in practice           | L24 (cloze from our own sentences)                            |
| Frequency-first vocabulary          | High                     | Nation 2006; Milton 2010; Laufer & Ravenhorst-Kalovski 2010                    | ⬜ chosen by topic, never checked                 | C10 (frequency report)                                        |
| Extensive reading / input           | High                     | Jeon & Day 2016; Hu & Nation 2000; Uchihara, Webb & Yanagisawa 2019            | ⬜                                                | L29 (graded reading) — G4, content cost                       |
| Listening instruction               | Moderate                 | Vandergrift & Tafaghodtari 2010                                                | ⬜ 15 listening nodes, no listening card          | L25 (audio-prompt cards)                                      |
| Pronunciation instruction           | High                     | Lee, Jang & Plonsky 2015 (d = 0.80 vs comparison groups); Saito & Plonsky 2019 | ⬜ TTS/recorded playback only                     | L30 (perception training)                                     |
| High-variability phonetic training  | Moderate–High            | Thomson 2018; Sakai & Moorman 2018                                             | ⬜                                                | L30                                                           |
| Output / shadowing                  | Moderate                 | Swain 1985; Hamada 2016                                                        | ⬜                                                | L31 (local self-record)                                       |
| Interaction with a person           | High                     | Mackey & Goo 2007                                                              | ⬜ non-goal                                       | Platform limit; L32 (task cards for a partner)                |
| Task-based practice                 | Moderate–High            | Bryfonski & McKay 2019                                                         | ⬜                                                | L32                                                           |
| Fluency / automaticity              | Moderate                 | DeKeyser 2007; de Jong & Perfetti 2011; Nation 2007                            | ⬜                                                | L28 (fluency round)                                           |
| Explicit grammar, contrastive notes | High                     | Norris & Ortega 2000; Spada & Tomita 2010                                      | ⬜ L8, L15–L19 (planned)                          | Existing rows 2.4, 2.8                                        |
| Cognates and transfer               | Moderate                 | Ringbom 2007; de Groot & Keijzer 2000                                          | ⬜ L14 (planned)                                  | Existing row 3.2                                              |
| Implementation intentions (return)  | High (general behaviour) | Gollwitzer & Sheeran 2006 (d = 0.65); Lally et al. 2010                        | ⬜                                                | L21. Not SLA-specific evidence; it targets the R3 return risk |
| Self-assessment accuracy            | Moderate                 | Ross 1998                                                                      | L20 asks "I can do this"                          | Pair it with an objective score (comment on #201)             |
| Placement by vocabulary size        | Moderate                 | Milton 2010; Lemhöfer & Broersma 2012 (LexTALE)                                | ⬜ everyone starts at A1                          | L27                                                           |
| Keyword mnemonics                   | Low (long-term)          | Dunlosky et al. 2013                                                           | —                                                 | Don't build                                                   |
| Gamification, streaks               | Mixed                    | Duolingo literature review: Shortt et al. 2023                                 | Non-goal                                          | Don't build                                                   |
| "Learning styles" matching          | Unsupported              | Pashler, McDaniel, Rohrer & Bjork 2008                                         | —                                                 | Don't build                                                   |

**What app-only learning achieves.** The evidence is thin. The most-cited study is a case study of 9 learners of Turkish on Duolingo over a semester: they improved, and time on the app correlated moderately with gains (Loewen et al. 2019). That can't tell us how app study transfers to speaking. The case for rows 3.6–3.7 rests on the output and interaction evidence above (Swain 1985; Mackey & Goo 2007), not on app studies.

## 4. What else we can do (ranked by evidence × cost)

| Rank | Row  | Spec | Issue | What                                                     | Evidence                    | Cost                            |
| ---- | ---- | ---- | ----- | -------------------------------------------------------- | --------------------------- | ------------------------------- |
| 1    | 1.6  | L21  | #243  | Plan the next session (implementation intention, `.ics`) | High, targets return        | Small; moved to G1 (owner, Q-3) |
| 2    | 2.10 | L23  | #244  | Learn new words to criterion in the first session        | High                        | Small (`reviewSession.ts`)      |
| 3    | 2.11 | L24  | #245  | Sentence-cloze cards from existing example sentences     | Moderate                    | Small, no new content           |
| 4    | 2.12 | L26  | #246  | Typed recall: diff feedback + suggested grade            | High                        | Small                           |
| 5    | 2.13 | L22  | #247  | FSRS instead of SM-2                                     | Moderate (Tier 2 benchmark) | Medium, state migration         |
| 6    | 2.14 | L25  | #248  | Listening cards                                          | Moderate                    | Medium; pt-PT audio exists      |
| 7    | 2.15 | L27  | #249  | Placement check                                          | Moderate                    | Medium; needs C10 data          |
| 8    | 2.16 | L28  | #250  | Fluency round on mastered items                          | Moderate                    | Small                           |
| 9    | 3.8  | C10  | #255  | Frequency report per language                            | High                        | Small tooling; licence check    |
| 10   | 3.4  | L29  | #251  | Graded reading                                           | High                        | Large content                   |
| 11   | 3.5  | L30  | #252  | Pronunciation perception training                        | High                        | Large: multi-voice audio        |
| 12   | 3.7  | L32  | #254  | Task cards for a conversation partner                    | High (interaction)          | Medium content                  |
| 13   | 3.6  | L31  | #253  | Speak and compare (local recording)                      | Moderate                    | Medium                          |

All of 2.10–2.16 wait for row 1.4 (rule 1) unless the owner makes an exception. Ranks 1–4 are small and directly strengthen the existing loop, so they are the best candidates if round one is positive.

## 5. Platform limits

Recorded in the master plan under **Known platform limitations**, with mitigations. The short version: a static, serverless, zero-surveillance site can't do automated speaking feedback, live interaction, push reminders, cross-device sync or aggregate analytics, and Safari can evict its storage. None of these is a reason to change the intent; each has a partial mitigation that stays within it.

## 6. Product audit (new findings)

The 2026-10-22 learner-journey audit (`plans/archive/` once closed) covered navigation and copy. This one covers correctness, durability and what the content can support.

| #   | Sev      | Finding (evidence)                                                                                                                                                                                                                                                 | Fix                                                                                 | Issue          |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------- |
| A1  | **High** | Safari deletes script-writable storage after 7 days without interaction (unless installed to home screen). No `navigator.storage.persist()` call exists. An iPhone learner who skips a week loses everything — the day-7 follow-up (row 1.2) is exactly this case. | Request persistent storage; hint to install or back up when not granted (S8)        | #241           |
| A2  | **High** | Exercises are grouped by `lessonId` only, and all of them are pt-PT. `dist/en-GB/de-DE/exercises/A1-FOOD-001/` asks "How do you say 'bread' in Portuguese?". The lesson page links there on every pair.                                                            | Key exercises by target language (C11)                                              | #242           |
| A3  | Medium   | fr-FR and it-IT C1 have one vocabulary item per node (25 items) versus ~7 for pt-PT/es-ES/de-DE (162–175). Spec C5 listed fr-FR as A1–C2 complete.                                                                                                                 | Spec C5 corrected in this PR; fill under G4                                         | #256           |
| A4  | Medium   | ~800 vocabulary items per language for A1–C2. Comprehension at B2 and above needs several thousand word families (Nation 2006; Laufer & Ravenhorst-Kalovski 2010). Vocabulary is chosen by topic and never checked against frequency.                              | Frequency report (C10); honest level copy on "Why this works"                       | #255           |
| A5  | Medium   | 122 of 154 nodes are listening, speaking or writing Can-Dos, practised only as vocabulary cards. The Can-Do checklist (J3) and checkpoint (L20) risk claiming a skill that was never practised.                                                                    | Word results as "you know the words for this" until the skill is practised          | #201 (comment) |
| A6  | Medium   | Every item has an example sentence and translation, but they appear only after "Again" (L10). The richest content we have is barely used in practice.                                                                                                              | Cloze cards (L24)                                                                   | #245           |
| A7  | Medium   | A new word graded Again is re-queued once, then scheduled for tomorrow; a learner can leave a session never having recalled it.                                                                                                                                    | Learn to criterion (L23)                                                            | #244           |
| A8  | Low      | Typed recall shows only right/wrong, and the learner still self-grades with no suggestion.                                                                                                                                                                         | L26                                                                                 | #246           |
| A9  | Low      | Recorded audio exists for pt-PT only (694 clips, 8.5 MB); other languages rely on device TTS, whose regional voices vary (Q3, row 2.6).                                                                                                                            | Existing #200; recorded audio per language when content allows                      | #200           |
| A10 | Low      | Everyone starts at A1 (J1), including learners who already know some of the language.                                                                                                                                                                              | Placement (L27)                                                                     | #249           |
| A11 | Low      | The service worker caches only pages already visited (deliberate `ponytail:` note). A learner who opens a new lesson offline gets nothing.                                                                                                                         | Precache the current level's lessons when J1 knows it. Not filed: wait for a report | —              |

## 7. Changes made with this review

- `spec.md`: C5 corrected; new ⬜ rows C10, C11, S8, L21–L32.
- `docs/learning-science-references.md`: SLA sources added to Tier 1 and FSRS benchmark to Tier 2.
- `plans/README.md`: rows 1.5, 1.6 (Q-3 answered yes), D.3, 2.10–2.16, 3.4–3.9; **Known platform limitations**; owner decision Q-4.
- Issues #241–#256; comment on #201.

## 8. Sources

- Barcroft, J. (2007). Effects of opportunities for word retrieval during second language vocabulary learning. _Language Learning_, 57(1), 35–56.
- Boers, F., & Lindstromberg, S. (2012). Experimental and intervention studies on formulaic sequences in a second language. _Annual Review of Applied Linguistics_, 32, 83–110.
- Bryfonski, L., & McKay, T. H. (2019). TBLT implementation and evaluation: A meta-analysis. _Language Teaching Research_, 23(5), 603–632.
- de Jong, N., & Perfetti, C. A. (2011). Fluency training in the ESL classroom. _Language Learning_, 61(2), 533–568.
- DeKeyser, R. (Ed.) (2007). _Practice in a Second Language_. Cambridge University Press.
- Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis. _Advances in Experimental Social Psychology_, 38, 69–119.
- Hamada, Y. (2016). Shadowing: Who benefits and how? _Language Teaching Research_, 20(1), 35–52.
- Hu, M., & Nation, I. S. P. (2000). Unknown vocabulary density and reading comprehension. _Reading in a Foreign Language_, 13(1), 403–430.
- Jeon, E.-Y., & Day, R. R. (2016). The effectiveness of ER on reading proficiency: A meta-analysis. _Reading in a Foreign Language_, 28(2), 246–265.
- Kim, S. K., & Webb, S. (2022). The effects of spaced practice on second language learning: A meta-analysis. _Language Learning_, 72(1), 269–319.
- Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed. _European Journal of Social Psychology_, 40(6), 998–1009.
- Laufer, B., & Ravenhorst-Kalovski, G. C. (2010). Lexical threshold revisited. _Reading in a Foreign Language_, 22(1), 15–30.
- Lee, J., Jang, J., & Plonsky, L. (2015). The effectiveness of second language pronunciation instruction: A meta-analysis. _Applied Linguistics_, 36(3), 345–366.
- Lemhöfer, K., & Broersma, M. (2012). Introducing LexTALE. _Behavior Research Methods_, 44, 325–343.
- Li, S. (2010). The effectiveness of corrective feedback in SLA: A meta-analysis. _Language Learning_, 60(2), 309–365.
- Loewen, S., Crowther, D., Isbell, D. R., Kim, K. M., Maloney, J., Miller, Z. F., & Rawal, H. (2019). Mobile-assisted language learning: A Duolingo case study. _ReCALL_, 31(3), 293–311.
- Mackey, A., & Goo, J. (2007). Interaction research in SLA: A meta-analysis and research synthesis. In A. Mackey (Ed.), _Conversational Interaction in SLA_ (pp. 407–452). Oxford University Press.
- Milton, J. (2010). The development of vocabulary breadth across the CEFR levels. In I. Bartning, M. Martin & I. Vedder (Eds.), _Communicative Proficiency and Linguistic Development_ (EUROSLA Monographs 1), 211–232.
- Nakata, T., & Webb, S. (2016). Does studying vocabulary in smaller sets increase learning? _Studies in Second Language Acquisition_, 38(3), 523–552.
- Nation, I. S. P. (2006). How large a vocabulary is needed for reading and listening? _Canadian Modern Language Review_, 63(1), 59–82.
- Nation, I. S. P. (2007). The four strands. _Innovation in Language Learning and Teaching_, 1(1), 2–13.
- Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. _Psychological Science in the Public Interest_, 9(3), 105–119.
- Rawson, K. A., & Dunlosky, J. (2011). Optimizing schedules of retrieval practice for durable and efficient learning. _Journal of Experimental Psychology: General_, 140(3), 283–302.
- Rawson, K. A., Dunlosky, J., & Sciartelli, S. M. (2013). The power of successive relearning. _Educational Psychology Review_, 25, 523–548.
- Ross, S. (1998). Self-assessment in second language testing: A meta-analysis. _Language Testing_, 15(1), 1–20.
- Saito, K., & Plonsky, L. (2019). Effects of second language pronunciation teaching revisited. _Language Learning_, 69(3), 652–708.
- Sakai, M., & Moorman, C. (2018). Can perception training improve the production of second language phonemes? _Applied Psycholinguistics_, 39(1), 187–224.
- Shortt, M., et al. (2023). Gamification in mobile-assisted language learning: A systematic review of Duolingo literature. _Computer Assisted Language Learning_, 36(3), 517–554.
- Swain, M. (1985). Communicative competence: Some roles of comprehensible input and comprehensible output. In S. Gass & C. Madden (Eds.), _Input in Second Language Acquisition_ (pp. 235–253). Newbury House. (Page range not confirmed online.)
- Thomson, R. I. (2018). High variability [pronunciation] training (HVPT). _Journal of Second Language Pronunciation_, 4(2), 208–231.
- Uchihara, T., Webb, S., & Yanagisawa, A. (2019). The effects of repetition on incidental vocabulary learning: A meta-analysis. _Language Learning_, 69(3), 559–599.
- Vandergrift, L., & Tafaghodtari, M. H. (2010). Teaching L2 learners how to listen does make a difference. _Language Learning_, 60(2), 470–497.
- Webb, S. (2009). The effects of receptive and productive learning of word pairs on vocabulary knowledge. _RELC Journal_, 40(3), 360–376.
- Webb, S., Yanagisawa, A., & Uchihara, T. (2020). How effective are intentional vocabulary-learning activities? A meta-analysis. _The Modern Language Journal_, 104(4), 715–738.
- Ye, J., Su, J., & Cao, Y. (2022). A stochastic shortest path algorithm for optimizing spaced repetition scheduling. _Proceedings of KDD '22_, 4381–4390.
- Tier 2: open-spaced-repetition, _srs-benchmark_ (GitHub), FSRS vs SM-2 on Anki review logs. Not peer reviewed.

Already in `docs/learning-science-references.md` and not repeated: Dunlosky et al. 2013, Roediger & Karpicke 2006, Cepeda et al. 2006, Rohrer & Taylor 2007, Slamecka & Graf 1978, Bjork et al. 2013, Hattie & Timperley 2007, Mayer 2021, Norris & Ortega 2000, Spada & Tomita 2010, Lyster & Saito 2010, Ringbom 2007, de Groot & Keijzer 2000.

## 9. Verification of the evidence (2026-10-23)

Checked online after the first draft, at the owner's request. Bibliographic details were checked against Crossref and publisher pages; claims were checked against abstracts. Strength ratings in §3 are this review's judgement from the study designs (meta-analysis vs single study), not a formal grading.

**Bibliographic check.** All 34 cited works exist with the authors, journal, volume, issue and pages given, except as noted below. Year differences in Crossref (Bryfonski & McKay 2017, Hamada 2015, Lally 2009, Lemhöfer & Broersma 2011, Sakai & Moorman 2017) are online-first dates; the print years given in §8 are correct.

| Item                              | Found                                                                                                                                                                                                                                      | Change                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Nakata & Webb 2016 (was †)        | 38(3), 523–552 confirmed. **Finding is the opposite of how it was used:** splitting into smaller sets had little effect once spacing was equal; spacing mattered more                                                                      | §3 row rewritten; J2's cap now justified by workload/spacing |
| Saito & Plonsky 2019 (was †)      | 69(3), 652–708 confirmed (subtitle: "A proposed measurement framework and meta-analysis")                                                                                                                                                  | † removed                                                    |
| Shortt et al. 2023 (was †)        | 36(3), 517–554 confirmed via a reference list; no publisher page reached                                                                                                                                                                   | † removed                                                    |
| Lee, Jang & Plonsky 2015          | 36(3), 345–366; 86 reports. d = 0.89 is the **within-group** figure; **between-group** (vs no pronunciation instruction) is d = 0.80. Larger with longer treatment and feedback                                                            | Quote d = 0.80                                               |
| Loewen et al. 2019                | 31(3), 293–311. **n = 9** learners of Turkish; gains, moderate correlation with time on app. Says nothing about speaking transfer. No funding statement visible on the abstract page                                                       | Overclaim removed from §3                                    |
| Gollwitzer & Sheeran 2006         | pp. 69–119, d = 0.65 confirmed; **94 independent tests**, not 94 studies. General behaviour change, not language learning                                                                                                                  | Wording fixed in #243                                        |
| Ye, Su & Cao 2022                 | KDD '22, 4381–4390 confirmed. Authors are affiliated with **MaiMemo**, a commercial app, and trained on its 220 million logs; the paper describes SSP-MMC, the precursor of FSRS. The srs-benchmark is run by the FSRS authors             | Conflict of interest noted in #247 and the references doc    |
| Kim & Webb 2022                   | 72(1), 269–319; 37 studies; spacing has a medium-to-large effect. **Equal and expanding schedules performed about the same**, so a smarter expanding schedule (L22) is not shown to improve L2 learning; its claimed gain is fewer reviews | Caveat added to #247                                         |
| Laufer & Ravenhorst-Kalovski 2010 | 22(1), 15–30; 95% coverage ≈ 4,000–5,000 word families, 98% ≈ 8,000 (with proper nouns) confirmed                                                                                                                                          | —                                                            |
| Milton 2010                       | pp. 211–232 confirmed. Per-level vocabulary bands circulating online come from Milton 2009, not this chapter; this review quotes no per-level numbers                                                                                      | Don't quote per-level figures as Milton 2010                 |
| Jeon & Day 2016                   | 28(2), 246–265; actual title "The effectiveness of ER on reading proficiency: A meta-analysis"                                                                                                                                             | Title fixed                                                  |
| Mackey & Goo 2007                 | pp. 407–452 in most sources (one repository says 407–453)                                                                                                                                                                                  | —                                                            |
| Swain 1985                        | Chapter and argument confirmed; page range not confirmed online                                                                                                                                                                            | Flagged in §8                                                |

**Platform claims.**

| Claim                                                                   | Found                                                                                                                                                                                        | Change                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Safari deletes script-writable storage after 7 days without interaction | Confirmed (WebKit, Safari 13.1, 2020; applies to all iOS browsers). Home-screen apps have their own counter, but a 2022 WebKit bug report (237350) describes logouts in an installed app too | #241 must verify on a device, not assume the exemption  |
| Chrome speech recognition sends audio to a server                       | Confirmed as the default. Chrome has shipped opt-in on-device recognition (`processLocally`, desktop, needs a language pack, still marked experimental)                                      | Plan P-2 updated: possible future mitigation on desktop |

## 10. How objective is this review?

This file is the public record of the research behind spec rows L21–L32, C10, C11 and S8. It stays in `docs/research/` permanently; plans move to the archive, research records don't. Read its conclusions with these limits in mind.

**How it was made.**

- Written by an AI assistant (Claude) for the owner, from its own knowledge of the literature, then checked online in the same session (§9). It is not a systematic review: there was no search protocol, no inclusion criteria, no second reviewer and no risk-of-bias scoring.
- Sources were chosen to answer "what works for adult second-language learning?", with meta-analyses preferred. Selection bias is possible: the frame (Nation's four strands) was picked first, and the evidence found fits it.
- Strength ratings in §3 ("High", "Moderate", …) are judgement calls based on whether a claim rests on several meta-analyses, one meta-analysis or single studies. They are not GRADE ratings or pooled effect sizes.

**What the verification found.** Of 34 sources, all exist with correct details apart from one wrong title (fixed) and one unconfirmed page range (flagged). Four claims went further than their sources, and were corrected: a set-size study that found no set-size effect, a 9-person app study used to make a claim about speaking, an effect size quoted from the wrong comparison, and "94 studies" that were 94 tests. That is about one overclaim per eight sources in the first draft, and it is the reason every row cites a checkable source.

**Known biases in the evidence itself.**

- Most SLA intervention research uses classroom learners, university students and short follow-ups. Acquira's persona is a solo adult in 10-minute sessions; effects may be smaller.
- Meta-analyses mix very different studies, and published studies over-represent positive results (publication bias). Treat effect sizes as upper bounds.
- The scheduler evidence (FSRS) comes from its own authors and a commercial app (§9). Return-behaviour evidence (implementation intentions) comes from health and general psychology, not language learning.
- No source here was funded by this project. Funding statements for the app study (Loewen et al. 2019) weren't visible on the abstract page.

**How to check or challenge it.** Every source in §8 has enough detail to find it; the bibliographic check used the Crossref API (`api.crossref.org/works?query.bibliographic=…`). To dispute a claim, open an issue citing the source and the passage, and update §9 in the same PR. A claim used to justify a feature must trace to a Tier 1 row in `docs/learning-science-references.md`.
