# CEFR Mapping — A1/A2 Inventory

Tracks the CEFR A1/A2 Can-Do statement inventory against `cefr-nodes` and `realisations` content, per `specification-design.md` §5.3 (CEFR Mapping Process) and issues #5, #50, #51.

**Source:** [Referencial Camões PLE](https://www.instituto-camoes.pt/images/REFERENCIAL_ebook.pdf) (Direção de Serviços de Língua e Cultura, Camões — Instituto da Cooperação e da Língua, I.P., 1st ed., September 2017, ISBN 978-989-8751-10-2). Freely downloadable — no access blocker, corrected from an earlier version of this doc that assumed otherwise. One real limitation remains: the printed/PDF edition explicitly states it presents only an *illustrative excerpt* of each inventory ("optou-se por apresentar apenas uma parte de cada um dos inventários, a título ilustrativo", p.10) — the complete inventories live behind a searchable web interface at the [Centro Virtual Camões](https://www.instituto-camoes.pt/activity/centro-virtual/referencial-camoes-ple) that isn't fetchable from here. So this doc now reflects the real category *structure* (authoritative) plus everything the PDF excerpt actually shows, not a claim of 100% vocabulary completeness.

## Status legend

| Status | Meaning |
|---|---|
| ✅ Realised | Node exists in `cefr-nodes/`, paired en-GB/pt-PT realisations exist in `realisations/` |
| 🟡 Node only | Node exists in `cefr-nodes/`, no realisations yet |
| ⬜ Not started | Identified but no node file yet |

## A1 nodes in the repo

| nodeId | Skill | Can-Do | Status |
|---|---|---|---|
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

A1 Coverage: 17/17 nodes fully realised (100%).

## A2 nodes in the repo

| nodeId | Skill | Can-Do | Status |
|---|---|---|---|
| A2-JOB-001 | spoken_production | Can describe my job and working hours | ✅ Realised |
| A2-JOB-002 | spoken_production | Can talk about daily work routines | ✅ Realised |
| A2-JOB-003 | reading | Can understand simple job advertisements | ✅ Realised |
| A2-STUDY-001 | spoken_production | Can describe my studies and qualifications | ✅ Realised |
| A2-STUDY-002 | spoken_interaction | Can talk about my educational background | ✅ Realised |
| A2-STUDY-003 | reading | Can understand simple academic texts | ✅ Realised |
| A2-PAST-001 | spoken_production | Can describe past events and experiences | ✅ Realised |
| A2-PAST-002 | spoken_production | Can talk about changes over time | ✅ Realised |
| A2-PAST-003 | listening | Can understand simple narratives about the past | ✅ Realised |
| A2-PAST-004 | writing | Can compare past and present situations | ✅ Realised |
| A2-HABIT-001 | spoken_production | Can describe recent changes in habits | ✅ Realised |
| A2-HABIT-002 | listening | Can talk about recent activities | ✅ Realised |
| A2-HABIT-003 | reading | Can understand simple news items about recent events | ✅ Realised |
| A2-NEWS-001 | reading | Can understand simple news articles | ✅ Realised |
| A2-NEWS-002 | spoken_production | Can describe events reported in the media | ✅ Realised |
| A2-NEWS-003 | spoken_production | Can express basic opinions about news items | ✅ Realised |
| A2-CULT-001 | listening | Can talk about cultural events and traditions | ✅ Realised |
| A2-CULT-002 | spoken_interaction | Can describe simple aspects of different cultures | ✅ Realised |
| A2-CULT-003 | spoken_production | Can express opinions about cultural topics | ✅ Realised |
| A2-HEALTH-001 | spoken_interaction | Can describe symptoms and understand medical advice | ✅ Realised |

A2 Coverage: 20/20 nodes fully realised (100%).

## Skill distribution (A1 + A2 combined)

| Skill | A1 | A2 | Total |
|---|---|---|---|
| listening | 1 | 4 | 5 |
| reading | 4 | 4 | 8 |
| spoken_interaction | 8 | 4 | 12 |
| spoken_production | 4 | 6 | 10 |
| writing | 0 | 2 | 2 |
| **Total** | **17** | **20** | **37** |

## Referencial Camões's real function category structure (Componente Pragmática, Part II)

The document organizes communicative functions into 7 categories, each with subcategories, present at every CEFR level including A1 (realisations get simpler, not the categories themselves). This is the actual authoritative structure — not inferred or invented:

| Category | Subcategories (A1-relevant) | Repo coverage |
|---|---|---|
| **A. Interagir socialmente** | 1. Estabelecer contactos sociais; 2. Cortesia; 3. Apresentações | ✅ A1-GREET-001/002, A1-INTRO-001, A1-THANK-001, A1-SORRY-001, A2-CULT-001/002/003, A2-HEALTH-001 |
| **B. Trocar informações** | 1. Solicitar informação; 2. Transmitir informação; 3. Confirmar/corrigir | ✅ A1-INTRO-002, A1-LOC-001, A1-TIME-001, A2-JOB-001/002/003, A2-STUDY-001/002/003 |
| **C. Influir sobre o interlocutor** | 1. Pedir e ordenar; 2. Oferecer/convidar/sugerir; 3. Aconselhar/advertir; 4. Prometer | ✅ A1-REQUEST-001, A1-OFFER-001 |
| **D. Exprimir posicionamentos e atitudes** | 1. Opinião; 2. Apreciação; 3. Concordância/discordância; 4. Conhecimento; 5. Certeza/possibilidade; 6. Capacidade; 7. Obrigação/permissão | ✅ A1-OPIN-001, A1-CAPAB-001, A2-NEWS-003, A2-CULT-003 |
| **E. Expressar desejos e emoções** | 1. Desejos e intenções; 2. Emoções | ✅ A1-WANT-001, A1-FEEL-001, A2-PAST-001/002/003/004, A2-HABIT-001/002/003 |
| **F. Organizar o discurso** | Iniciar/mudar de tema, exemplificar, comparar, concluir... (15 subcats, mostly B1+) | ⬜ out of scope at A2 |
| **G. Regular a comunicação** | 1. Gerir a interação; 2. Garantir a intercompreensão | ✅ A1-CLARIFY-001 |

## Cross-reference: AIMA "Português Para Todos" module list

For context when planning future nodes, here are the module *titles* from AIMA's (Agência para a Integração, Migrações e Asilo) Portuguese-for-migrants course — titles only, not the course's copyrighted content itself (audio/text/images), which isn't reusable here without a license. Useful as an independent cross-check that our topic priorities line up with what another real-world A1 Portuguese course covers:

**Utilizador Elementar (A1/A2):**
A1M1 Identificação e Caracterização Pessoal · A1M2 Vida Quotidiana · A1M3 Alimentação · A1M4 Festas e Tempos Livres · A1M5 Compras, Serviços e Direções · A1M6 O Corpo Humano e a Saúde · A2M7 Profissões e Trabalho · A2M8 Estudos e Experiência Profissional · A2M9 Passado e Presente · A2M10 Hábitos Recentes · A2M11 Notícias e Outros Textos · A2M12 Cidadania e Diversidade Cultural

**Module coverage:**

| Module | Topic | Repo coverage |
|---|---|---|
| A1M1 | Personal identification | ✅ A1-INTRO-001/002 |
| A1M2 | Daily life | ✅ A1-FOOD-001, A1-TIME-001 |
| A1M3 | Food & drink | ✅ A1-FOOD-001 |
| A1M4 | Leisure & free time | ✅ A1-OFFER-001 |
| A1M5 | Shopping, services & directions | ✅ A1-LOC-001, A1-REQUEST-001 |
| A1M6 | Body & health | ✅ A1-FEEL-001 |
| A2M7 | Professions & work | ✅ A2-JOB-001/002/003 |
| A2M8 | Studies & professional experience | ✅ A2-STUDY-001/002/003 |
| A2M9 | Past & present | ✅ A2-PAST-001/002/003/004 |
| A2M10 | Recent habits | ✅ A2-HABIT-001/002/003 |
| A2M11 | News & texts | ✅ A2-NEWS-001/002/003 |
| A2M12 | Citizenship & cultural diversity | ✅ A2-CULT-001/002/003 |

## Process for adding a node

1. Identify the Can-Do statement in Referencial Camões.
2. Add a row to the table above as "Not started".
3. Create the `cefr-nodes/` YAML file (see #3) — row becomes "🟡 Node only".
4. Author paired `en-GB`/`pt-PT` realisations (see #4, #7) — row becomes "✅ Realised".
