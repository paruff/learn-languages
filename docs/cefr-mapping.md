# CEFR Mapping — A1 Inventory

Tracks the CEFR A1 Can-Do statement inventory against `cefr-nodes` and `realisations` content, per `specification-design.md` §5.3 (CEFR Mapping Process) and issue #5.

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
| A1-FOOD-001 | reading | Can identify common food and drink items | 🟡 Node only |

Coverage: 5/6 nodes fully realised (83%), 1/6 node-only.

## Referencial Camões's real function category structure (Componente Pragmática, Part II)

The document organizes communicative functions into 7 categories, each with subcategories, present at every CEFR level including A1 (realisations get simpler, not the categories themselves). This is the actual authoritative structure — not inferred or invented:

| Category | Subcategories (A1-relevant) | Repo coverage |
|---|---|---|
| **A. Interagir socialmente** | 1. Estabelecer contactos sociais (saudar, despedir-se); 2. Cortesia (agradecer, pedir desculpa); 3. Apresentações | ✅ A1-GREET-001 (1.2/1.3), A1-GREET-002 (1.4), A1-INTRO-001 (3.1/3.2) |
| **B. Trocar informações** | 1. Solicitar informação (identificação, localização, tempo, quantidade...); 2. Transmitir informação; 3. Confirmar/corrigir | 🟡 partial — A1-INTRO-002 covers identification only; localização/tempo/quantidade untouched |
| **C. Influir sobre o interlocutor** | 1. Pedir e ordenar; 2. Oferecer/convidar/sugerir; 3. Aconselhar/advertir; 4. Prometer | ⬜ no node |
| **D. Exprimir posicionamentos e atitudes** | 1. Opinião; 2. Apreciação; 3. Concordância/discordância; 4. Conhecimento; 5. Certeza/possibilidade; 6. Capacidade; 7. Obrigação/permissão | ⬜ no node |
| **E. Expressar desejos e emoções** | 1. Desejos e intenções; 2. Emoções (19 named states, e.g. alegria, tristeza, surpresa) | ⬜ no node |
| **F. Organizar o discurso** | Iniciar/mudar de tema, exemplificar, comparar, concluir... (15 subcats, mostly B1+) | ⬜ out of scope at A1 |
| **G. Regular a comunicação** | 1. Gerir a interação (pedir a palavra, interromper); 2. Garantir a intercompreensão (pedir para repetir/clarificar) | ⬜ no node — arguably useful even at A1 for classroom/app survival phrases |

**Numbers** (A1-NUMB-001) sit in the **Componente Linguística** (Part IV), not Pragmática — grammar inventory, category "7. Quantificadores > 7.3 Numerais." Confirmed present at A1 in the source, not yet cross-checked against the document's actual A1 numeral list beyond what's already in the repo.

## Genuine gaps (verified against the real category list above, not guessed)

- [ ] Category C (influencing the interlocutor: requests, offers, advice) — zero nodes, and JTBD-1/JTBD-3 (discovery-brief) plausibly need this before greetings-only content feels useful in real conversation.
- [ ] Category D subcategory 1 (expressing opinion) and 6 (capacity — "can/can't do X") — high-value, commonly-needed A1 content.
- [ ] Category E (desires/emotions) — the *notion* inventory already lists 19 named emotion categories at general level; no realisation exists.
- [ ] **Noções Específicas** (Part III) topic domains beyond what's covered: 1.2 Casa e meio-ambiente, 1.3 Vida diária, 1.4 Tempos livres, 2.1–2.5 (travel, health, shopping, food, services) — all untouched. `A1-FOOD-001` (node-only) maps to 2.4 Alimentação.
- [ ] All 5 CEFR skills should eventually have A1 nodes; current 6 nodes are only `spoken_interaction`/`reading` — no `listening`, `spoken_production`, or `writing` nodes yet.

Extending this beyond category/subcategory names into full vocabulary lists requires the online searchable interface (see Source note above) — flagging that boundary explicitly rather than inventing realistic-sounding Portuguese content to fill the gap, per AGENTS.md §10 (`content` PRs need pedagogical review) and spec NG7 (no unreviewed AI-generated content).

## Process for adding a node

1. Identify the Can-Do statement in Referencial Camões.
2. Add a row to the table above as "Not started".
3. Create the `cefr-nodes/` YAML file (see #3) — row becomes "🟡 Node only".
4. Author paired `en-GB`/`pt-PT` realisations (see #4, #7) — row becomes "✅ Realised".
