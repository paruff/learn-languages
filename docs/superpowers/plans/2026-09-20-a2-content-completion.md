# A2 Content — EN→PT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the A2 CEFR inventory — 20 nodes, 40 realisations (20 pt-PT + 20 en-GB)

**Architecture:** Abstract CEFR nodes (language-agnostic) → paired realisations (per language) with vocabulary items, grammar points, and cultural notes. All content validated by Zod schemas at build time.

**Tech Stack:** Astro 5.x, YAML, Zod, TypeScript

**Spec:** `docs/superpowers/specs/2026-09-20-a2-content-design.md`

---

## Global Constraints

- `nodeId` format: `{LEVEL}-{SKILL}-{SEQ}` (regex: `/^(A1|A2|B1|B2|C1|C2)-[A-Z]+-\d{3}$/`)
- Realisation `id` format: `{lang}-{nodeId}` (e.g., `pt-A2-JOB-001`)
- Vocabulary `id` format: `{lang}-{nodeId}-V{SEQ}` (e.g., `pt-A2-JOB-001-V01`)
- Grammar point `id` format: `{lang}-{nodeId}-G{SEQ}` (e.g., `pt-A2-JOB-001-G01`)
- Paired realisations must share vocabulary item sequences
- YAML apostrophes in strings must use double-quoted strings
- Validate after each phase: `npm run validate:content && npm run typecheck && npm run lint`
- Commit with conventional commits: `content(cefr): add A2-X-001 node` or `content(vocab): add A2-X-001 realisations`

---

## Phase 0: Baseline Pair — A2-JOB-001

Establish the A2 baseline with one node and paired realisations.

### Task 0.1: Create A2-JOB-001 CEFR node

**Files:**
- Create: `src/content/cefr-nodes/a2-job-001.yaml`

- [ ] **Step 1: Create node YAML**

```yaml
nodeId: A2-JOB-001
cefrLevel: A2
skill: spoken_production
canDo: Can describe my job and working hours
pragmaticFocus: Describe personal work situation
notionalFocus: Employment, occupations, time
relatedNodes:
  - A2-JOB-002
  - A2-JOB-003
prerequisiteNodes:
  - A1-FOOD-001
```

- [ ] **Step 2: Validate**

Run: `npm run validate:content`
Expected: Validation passes

- [ ] **Step 3: Commit**

```bash
git add src/content/cefr-nodes/a2-job-001.yaml
git commit -m "content(cefr): add A2-JOB-001 node"
```

### Task 0.2: Create A2-JOB-001 pt-PT realisation

**Files:**
- Create: `src/content/realisations/pt-PT/a2-job-001.yaml`

- [ ] **Step 1: Create pt-PT realisation**

```yaml
id: pt-A2-JOB-001
nodeId: A2-JOB-001
lang: pt-PT
title: "Descrever o meu emprego"
overview: >
  Aprenderes descrevem o seu emprego, local de trabalho e horários
  usando o presente do indicativo e conectores básicos.
vocabulary:
  - id: pt-A2-JOB-001-V01
    term: emprego
    translation: job
    partOfSpeech: noun
    gender: masculine
    example: Tenho um emprego no centro da cidade.
    exampleTranslation: I have a job in the city centre.
  - id: pt-A2-JOB-001-V02
    term: escritório
    translation: office
    partOfSpeech: noun
    gender: masculine
    example: Trabalho num escritório grande.
    exampleTranslation: I work in a large office.
  - id: pt-A2-JOB-001-V03
    term: horário
    translation: schedule / working hours
    partOfSpeech: noun
    gender: masculine
    example: O meu horário é das nove às cinco.
    exampleTranslation: My working hours are from nine to five.
  - id: pt-A2-JOB-001-V04
    term: ganhar
    translation: to earn
    partOfSpeech: verb
    gender: n/a
    example: Ganho bem no meu emprego.
    exampleTranslation: I earn well in my job.
  - id: pt-A2-JOB-001-V05
    term: colega
    translation: colleague
    partOfSpeech: noun
    gender: common
    example: Os meus colegas são muito simpáticos.
    exampleTranslation: My colleagues are very friendly.
  - id: pt-A2-JOB-001-V06
    term: satisfeito
    translation: satisfied
    partOfSpeech: adjective
    gender: masculine
    example: Estou satisfeito com o meu emprego.
    exampleTranslation: I am satisfied with my job.
grammarPoints:
  - id: pt-A2-JOB-001-G01
    term: connectors (e, mas, porque)
    explanation: Used to link ideas about work
    examples:
      - Trabalho num escritório e gosto do meu emprego.
      - Não trabalho aos fins de semana porque preciso de descansar.
culturalNotes:
  - >
    Portuguese work culture values punctuality and personal relationships.
    Colleagues often address each other by first name after initial formal greetings.
```

- [ ] **Step 2: Validate**

Run: `npm run validate:content`
Expected: Validation passes

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/pt-PT/a2-job-001.yaml
git commit -m "content(vocab): add A2-JOB-001 pt-PT realisation"
```

### Task 0.3: Create A2-JOB-001 en-GB realisation

**Files:**
- Create: `src/content/realisations/en-GB/a2-job-001.yaml`

- [ ] **Step 1: Create en-GB realisation**

```yaml
id: en-A2-JOB-001
nodeId: A2-JOB-001
lang: en-GB
title: "Describing my job"
overview: >
  Learners describe their job, workplace, and working hours using
  present tense and basic connectors.
vocabulary:
  - id: en-A2-JOB-001-V01
    term: job
    translation: emprego
    partOfSpeech: noun
    gender: n/a
    example: I have a job in the city centre.
    exampleTranslation: Tenho um emprego no centro da cidade.
  - id: en-A2-JOB-001-V02
    term: office
    translation: escritório
    partOfSpeech: noun
    gender: n/a
    example: I work in a large office.
    exampleTranslation: Trabalho num escritório grande.
  - id: en-A2-JOB-001-V03
    term: working hours
    translation: horário
    partOfSpeech: noun
    gender: n/a
    example: My working hours are from nine to five.
    exampleTranslation: O meu horário é das nove às cinco.
  - id: en-A2-JOB-001-V04
    term: to earn
    translation: ganhar
    partOfSpeech: verb
    gender: n/a
    example: I earn well in my job.
    exampleTranslation: Ganho bem no meu emprego.
  - id: en-A2-JOB-001-V05
    term: colleague
    translation: colega
    partOfSpeech: noun
    gender: n/a
    example: My colleagues are very friendly.
    exampleTranslation: Os meus colegas são muito simpáticos.
  - id: en-A2-JOB-001-V06
    term: satisfied
    translation: satisfeito
    partOfSpeech: adjective
    gender: n/a
    example: I am satisfied with my job.
    exampleTranslation: Estou satisfeito com o meu emprego.
grammarPoints:
  - id: en-A2-JOB-001-G01
    term: connectors (and, but, because)
    explanation: Used to link ideas about work
    examples:
      - I work in an office and I like my job.
      - I don't work at the weekend because I need to rest.
culturalNotes:
  - >
    Portuguese work culture values punctuality and personal relationships.
    Colleagues often address each other by first name after initial formal greetings.
```

- [ ] **Step 2: Validate**

Run: `npm run validate:content`
Expected: Validation passes

- [ ] **Step 3: Commit**

```bash
git add src/content/realisations/en-GB/a2-job-001.yaml
git commit -m "content(vocab): add A2-JOB-001 en-GB realisation"
```

---

## Phase 1: Professions & Studies — A2-JOB-002/003, A2-STUDY-001

### Task 1.1: Create A2-JOB-002 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/a2-job-002.yaml`
- Create: `src/content/realisations/pt-PT/a2-job-002.yaml`
- Create: `src/content/realisations/en-GB/a2-job-002.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: A2-JOB-002
cefrLevel: A2
skill: spoken_production
canDo: Can talk about daily work routines
pragmaticFocus: Describe work routines
notionalFocus: Daily activities, workplace
relatedNodes:
  - A2-JOB-001
  - A2-JOB-003
prerequisiteNodes:
  - A2-JOB-001
```

- [ ] **Step 2: Create pt-PT realisation**

```yaml
id: pt-A2-JOB-002
nodeId: A2-JOB-002
lang: pt-PT
title: "Falar das rotinas de trabalho"
overview: >
  Aprenderes descrevem as suas rotinas diárias de trabalho,
  incluindo tarefas e interações com colegas.
vocabulary:
  - id: pt-A2-JOB-002-V01
    term: rotina
    translation: routine
    partOfSpeech: noun
    gender: feminine
    example: A minha rotina de trabalho é muito ocupada.
    exampleTranslation: My work routine is very busy.
  - id: pt-A2-JOB-002-V02
    term: tarefa
    translation: task
    partOfSpeech: noun
    gender: feminine
    example: Tenho muitas tarefas para fazer hoje.
    exampleTranslation: I have many tasks to do today.
  - id: pt-A2-JOB-002-V03
    term: reunião
    translation: meeting
    partOfSpeech: noun
    gender: feminine
    example: Tenho uma reunião às dez da manhã.
    exampleTranslation: I have a meeting at ten in the morning.
  - id: pt-A2-JOB-002-V04
    term: sempre
    translation: always
    partOfSpeech: adverb
    gender: n/a
    example: Sempre chego a tempo ao trabalho.
    exampleTranslation: I always arrive at work on time.
  - id: pt-A2-JOB-002-V05
    term: às vezes
    translation: sometimes
    partOfSpeech: adverb
    gender: n/a
    example: Às vezes almoço no restaurante da esquina.
    exampleTranslation: Sometimes I have lunch at the corner restaurant.
  - id: pt-A2-JOB-002-V06
    term: terminar
    translation: to finish
    partOfSpeech: verb
    gender: n/a
    example: Normalmente termino o trabalho às seis.
    exampleTranslation: I usually finish work at six.
grammarPoints:
  - id: pt-A2-JOB-002-G01
    term: adverbs of frequency (sempre, às vezes, normalmente)
    explanation: Used to describe how often work activities happen
    examples:
      - Sempre chego a tempo ao trabalho.
      - Às vezes almoço no restaurante da esquina.
culturalNotes:
  - >
    Portuguese lunch breaks are typically one hour. Many workers eat at
    local tascas or bring home-cooked food. The午间 pause is important for socialising.
```

- [ ] **Step 3: Create en-GB realisation** (matched vocabulary sequence)

```yaml
id: en-A2-JOB-002
nodeId: A2-JOB-002
lang: en-GB
title: "Talking about work routines"
overview: >
  Learners describe their daily work routines, including tasks
  and interactions with colleagues.
vocabulary:
  - id: en-A2-JOB-002-V01
    term: routine
    translation: rotina
    partOfSpeech: noun
    gender: n/a
    example: My work routine is very busy.
    exampleTranslation: A minha rotina de trabalho é muito ocupada.
  - id: en-A2-JOB-002-V02
    term: task
    translation: tarefa
    partOfSpeech: noun
    gender: n/a
    example: I have many tasks to do today.
    exampleTranslation: Tenho muitas tarefas para fazer hoje.
  - id: en-A2-JOB-002-V03
    term: meeting
    translation: reunião
    partOfSpeech: noun
    gender: n/a
    example: I have a meeting at ten in the morning.
    exampleTranslation: Tenho uma reunião às dez da manhã.
  - id: en-A2-JOB-002-V04
    term: always
    translation: sempre
    partOfSpeech: adverb
    gender: n/a
    example: I always arrive at work on time.
    exampleTranslation: Sempre chego a tempo ao trabalho.
  - id: en-A2-JOB-002-V05
    term: sometimes
    translation: às vezes
    partOfSpeech: adverb
    gender: n/a
    example: Sometimes I have lunch at the corner restaurant.
    exampleTranslation: Às vezes almoço no restaurante da esquina.
  - id: en-A2-JOB-002-V06
    term: to finish
    translation: terminar
    partOfSpeech: verb
    gender: n/a
    example: I usually finish work at six.
    exampleTranslation: Normalmente termino o trabalho às seis.
grammarPoints:
  - id: en-A2-JOB-002-G01
    term: adverbs of frequency (always, sometimes, usually)
    explanation: Used to describe how often work activities happen
    examples:
      - I always arrive at work on time.
      - Sometimes I have lunch at the corner restaurant.
culturalNotes:
  - >
    Portuguese lunch breaks are typically one hour. Many workers eat at
    local tascas or bring home-cooked food. The午间 pause is important for socialising.
```

- [ ] **Step 4: Validate**

Run: `npm run validate:content && npm run typecheck && npm run lint`
Expected: All pass

- [ ] **Step 5: Commit**

```bash
git add src/content/cefr-nodes/a2-job-002.yaml src/content/realisations/pt-PT/a2-job-002.yaml src/content/realisations/en-GB/a2-job-002.yaml
git commit -m "content(vocab): add A2-JOB-002 node + realisations"
```

### Task 1.2: Create A2-JOB-003 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/a2-job-003.yaml`
- Create: `src/content/realisations/pt-PT/a2-job-003.yaml`
- Create: `src/content/realisations/en-GB/a2-job-003.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: A2-JOB-003
cefrLevel: A2
skill: reading
canDo: Can understand simple job advertisements
pragmaticFocus: Read and comprehend job ads
notionalFocus: Employment, requirements, qualifications
relatedNodes:
  - A2-JOB-001
  - A2-JOB-002
prerequisiteNodes:
  - A2-JOB-001
```

- [ ] **Step 2: Create pt-PT realisation**

```yaml
id: pt-A2-JOB-003
nodeId: A2-JOB-003
lang: pt-PT
title: "Compreender anúncios de emprego"
overview: >
  Aprenderes leem e compreendem anúncios simples de emprego,
  identificando requisitos e condições de trabalho.
vocabulary:
  - id: pt-A2-JOB-003-V01
    term: anúncio
    translation: advertisement
    partOfSpeech: noun
    gender: masculine
    example: Vi um anúncio de emprego no jornal.
    exampleTranslation: I saw a job advertisement in the newspaper.
  - id: pt-A2-JOB-003-V02
    term: candidatura
    translation: application
    partOfSpeech: noun
    gender: feminine
    example: A minha candidatura foi aceite.
    exampleTranslation: My application was accepted.
  - id: pt-A2-JOB-003-V03
    term: experiência
    translation: experience
    partOfSpeech: noun
    gender: feminine
    example: Precisam de experiência na área.
    exampleTranslation: They require experience in the field.
  - id: pt-A2-JOB-003-V04
    term: salário
    translation: salary
    partOfSpeech: noun
    gender: masculine
    example: O salário é indicado no anúncio.
    exampleTranslation: The salary is listed in the advertisement.
  - id: pt-A2-JOB-003-V05
    term: enviar
    translation: to send
    partOfSpeech: verb
    gender: n/a
    example: Preciso de enviar o currículo.
    exampleTranslation: I need to send my CV.
  - id: pt-A2-JOB-003-V06
    term: entrevista
    translation: interview
    partOfSpeech: noun
    gender: feminine
    example: Tenho uma entrevista amanhã.
    exampleTranslation: I have an interview tomorrow.
grammarPoints:
  - id: pt-A2-JOB-003-G01
    term: reading comprehension strategies
    explanation: Scanning for key information in job ads
    examples:
      - O anúncio pede experiência de dois anos.
      - O salário é entre 1000 e 1500 euros.
culturalNotes:
  - >
    Portuguese job applications often require a CV (curriculum vitae) and
    a cover letter (carta de apresentação). Formal language is expected in written applications.
```

- [ ] **Step 3: Create en-GB realisation**

```yaml
id: en-A2-JOB-003
nodeId: A2-JOB-003
lang: en-GB
title: "Understanding job advertisements"
overview: >
  Learners read and understand simple job advertisements,
  identifying requirements and working conditions.
vocabulary:
  - id: en-A2-JOB-003-V01
    term: advertisement
    translation: anúncio
    partOfSpeech: noun
    gender: n/a
    example: I saw a job advertisement in the newspaper.
    exampleTranslation: Vi um anúncio de emprego no jornal.
  - id: en-A2-JOB-003-V02
    term: application
    translation: candidatura
    partOfSpeech: noun
    gender: n/a
    example: My application was accepted.
    exampleTranslation: A minha candidatura foi aceite.
  - id: en-A2-JOB-003-V03
    term: experience
    translation: experiência
    partOfSpeech: noun
    gender: n/a
    example: They require experience in the field.
    exampleTranslation: Precisam de experiência na área.
  - id: en-A2-JOB-003-V04
    term: salary
    translation: salário
    partOfSpeech: noun
    gender: n/a
    example: The salary is listed in the advertisement.
    exampleTranslation: O salário é indicado no anúncio.
  - id: en-A2-JOB-003-V05
    term: to send
    translation: enviar
    partOfSpeech: verb
    gender: n/a
    example: I need to send my CV.
    exampleTranslation: Preciso de enviar o currículo.
  - id: en-A2-JOB-003-V06
    term: interview
    translation: entrevista
    partOfSpeech: noun
    gender: n/a
    example: I have an interview tomorrow.
    exampleTranslation: Tenho uma entrevista amanhã.
grammarPoints:
  - id: en-A2-JOB-003-G01
    term: reading comprehension strategies
    explanation: Scanning for key information in job ads
    examples:
      - The advertisement asks for two years of experience.
      - The salary is between 1000 and 1500 euros.
culturalNotes:
  - >
    Portuguese job applications often require a CV (curriculum vitae) and
    a cover letter (carta de apresentação). Formal language is expected in written applications.
```

- [ ] **Step 4: Validate**

Run: `npm run validate:content && npm run typecheck && npm run lint`
Expected: All pass

- [ ] **Step 5: Commit**

```bash
git add src/content/cefr-nodes/a2-job-003.yaml src/content/realisations/pt-PT/a2-job-003.yaml src/content/realisations/en-GB/a2-job-003.yaml
git commit -m "content(vocab): add A2-JOB-003 node + realisations"
```

### Task 1.3: Create A2-STUDY-001 node + realisations

**Files:**
- Create: `src/content/cefr-nodes/a2-study-001.yaml`
- Create: `src/content/realisations/pt-PT/a2-study-001.yaml`
- Create: `src/content/realisations/en-GB/a2-study-001.yaml`

- [ ] **Step 1: Create node**

```yaml
nodeId: A2-STUDY-001
cefrLevel: A2
skill: spoken_production
canDo: Can describe my studies and qualifications
pragmaticFocus: Describe educational background
notionalFocus: Education, qualifications, institutions
relatedNodes:
  - A2-STUDY-002
  - A2-STUDY-003
prerequisiteNodes:
  - A2-JOB-001
```

- [ ] **Step 2: Create pt-PT realisation**

```yaml
id: pt-A2-STUDY-001
nodeId: A2-STUDY-001
lang: pt-PT
title: "Descrever os meus estudos"
overview: >
  Aprenderes descrevem a sua formação académica e qualificações,
  usando o presente do indicativo e conectores.
vocabulary:
  - id: pt-A2-STUDY-001-V01
    term: universidade
    translation: university
    partOfSpeech: noun
    gender: feminine
    example: Estudo na Universidade de Lisboa.
    exampleTranslation: I study at the University of Lisbon.
  - id: pt-A2-STUDY-001-V02
    term: curso
    translation: course / degree
    partOfSpeech: noun
    gender: masculine
    example: O meu curso dura três anos.
    exampleTranslation: My course lasts three years.
  - id: pt-A2-STUDY-001-V03
    term: diploma
    translation: diploma / degree
    partOfSpeech: noun
    gender: masculine
    example: Tenho um diploma em engenharia.
    exampleTranslation: I have a degree in engineering.
  - id: pt-A2-STUDY-001-V04
    term: estudar
    translation: to study
    partOfSpeech: verb
    gender: n/a
    example: Estudo português todos os dias.
    exampleTranslation: I study Portuguese every day.
  - id: pt-A2-STUDY-001-V05
    term: exame
    translation: exam
    partOfSpeech: noun
    gender: masculine
    example: Tenho um exame na semana seguinte.
    exampleTranslation: I have an exam next week.
  - id: pt-A2-STUDY-001-V06
    term: aprovar
    translation: to pass (an exam)
    partOfSpeech: verb
    gender: n/a
    example: Espero aprovar no exame de matemática.
    exampleTranslation: I hope to pass the maths exam.
grammarPoints:
  - id: pt-A2-STUDY-001-G01
    term: connectors for listing (e, mas, também)
    explanation: Used to connect educational experiences
    examples:
      - Estudo na universidade e trabalho ao fim de semana.
      - Tenho um diploma, mas quero fazer um mestrado.
culturalNotes:
  - >
    Portuguese higher education follows the Bologna Process. Students typically
    complete a licenciatura (3 years) before a mestrado (2 years).
```

- [ ] **Step 3: Create en-GB realisation**

```yaml
id: en-A2-STUDY-001
nodeId: A2-STUDY-001
lang: en-GB
title: "Describing my studies"
overview: >
  Learners describe their educational background and qualifications
  using present tense and connectors.
vocabulary:
  - id: en-A2-STUDY-001-V01
    term: university
    translation: universidade
    partOfSpeech: noun
    gender: n/a
    example: I study at the University of Lisbon.
    exampleTranslation: Estudo na Universidade de Lisboa.
  - id: en-A2-STUDY-001-V02
    term: course
    translation: curso
    partOfSpeech: noun
    gender: n/a
    example: My course lasts three years.
    exampleTranslation: O meu curso dura três anos.
  - id: en-A2-STUDY-001-V03
    term: degree
    translation: diploma
    partOfSpeech: noun
    gender: n/a
    example: I have a degree in engineering.
    exampleTranslation: Tenho um diploma em engenharia.
  - id: en-A2-STUDY-001-V04
    term: to study
    translation: estudar
    partOfSpeech: verb
    gender: n/a
    example: I study Portuguese every day.
    exampleTranslation: Estudo português todos os dias.
  - id: en-A2-STUDY-001-V05
    term: exam
    translation: exame
    partOfSpeech: noun
    gender: n/a
    example: I have an exam next week.
    exampleTranslation: Tenho um exame na semana seguinte.
  - id: en-A2-STUDY-001-V06
    term: to pass
    translation: aprovar
    partOfSpeech: verb
    gender: n/a
    example: I hope to pass the maths exam.
    exampleTranslation: Espero aprovar no exame de matemática.
grammarPoints:
  - id: en-A2-STUDY-001-G01
    term: connectors for listing (and, but, also)
    explanation: Used to connect educational experiences
    examples:
      - I study at university and work at the weekend.
      - I have a degree, but I want to do a master's.
culturalNotes:
  - >
    Portuguese higher education follows the Bologna Process. Students typically
    complete a licenciatura (3 years) before a mestrado (2 years).
```

- [ ] **Step 4: Validate**

Run: `npm run validate:content && npm run typecheck && npm run lint`
Expected: All pass

- [ ] **Step 5: Commit**

```bash
git add src/content/cefr-nodes/a2-study-001.yaml src/content/realisations/pt-PT/a2-study-001.yaml src/content/realisations/en-GB/a2-study-001.yaml
git commit -m "content(vocab): add A2-STUDY-001 node + realisations"
```

---

## Phase 2: Studies & Past/Present — A2-STUDY-002/003, A2-PAST-001

### Task 2.1: Create A2-STUDY-002 node + realisations
### Task 2.2: Create A2-STUDY-003 node + realisations
### Task 2.3: Create A2-PAST-001 node + realisations (pretérito perfeito introduction)

**Pattern:** Follow same structure as Phase 1 tasks. Each task creates node + pt-PT + en-GB realisations with 6 vocabulary items, grammar points, and cultural notes.

**Key vocabulary for Phase 2:**
- A2-STUDY-002: escola, professor, materia, qualidade, secundário, licenciatura
- A2-STUDY-003: artigo, research, universidade, publicação, académico, revista
- A2-PAST-001: ontem, semana passada, ano passado, visitar, comer, viajar

**Key grammar for Phase 2:**
- A2-PAST-001: Pretérito perfeito (visitou, comeu, viajou)

---

## Phase 3: Past/Present (continued) — A2-PAST-002/003/004

### Task 3.1: Create A2-PAST-002 node + realisations (changes over time)
### Task 3.2: Create A2-PAST-003 node + realisations (past narratives)
### Task 3.3: Create A2-PAST-004 node + realisations (past vs present comparison)

**Key vocabulary for Phase 3:**
- A2-PAST-002: antes, agora, mudou, cresceu, construiu, transformou
- A2-PAST-003: história, aconteceu, quando era criança, lembro-me, naquela época
- A2-PAST-004: antigamente, atualmente, comparação, mais fácil, mais difícil, diferente

**Key grammar for Phase 3:**
- A2-PAST-002/003: Pretérito perfeito continued
- A2-PAST-004: Comparisons (mais...que, menos...que)

---

## Phase 4: Recent Habits & News — A2-HABIT-001/002/003, A2-NEWS-001/002/003

### Task 4.1: Create A2-HABIT-001 node + realisations (recent habit changes)
### Task 4.2: Create A2-HABIT-002 node + realisations (recent activities)
### Task 4.3: Create A2-HABIT-003 node + realisations (recent news understanding)
### Task 4.4: Create A2-NEWS-001 node + realisations (news articles)
### Task 4.5: Create A2-NEWS-002 node + realisations (media events)
### Task 4.6: Create A2-NEWS-003 node + realisations (opinions about news)

**Key vocabulary for Phase 4:**
- A2-HABIT-001: recentemente, ultimamente, mudei, comecei a, parei de, agora
- A2-HABIT-002: esta semana, ontem, hoje, ainda, temporada, actividades
- A2-HABIT-003: notícia, imprensa, televisão, jornal, artigo, reportagem
- A2-NEWS-001: jornal, revista, artigo, título, autor, informação
- A2-NEWS-002: aconteceu, reportagem, televisão, rádio, imprensa, evento
- A2-NEWS-003: acho que, na minha opinião, parece-me, importante, concordo, discordo

**Key grammar for Phase 4:**
- A2-HABIT-001/002: Presente do indicativo with recent change markers
- A2-NEWS-003: Opinion expressions (acho que, na minha opinião)

---

## Phase 5: Citizenship & Culture — A2-CULT-001/002/003, A2-HEALTH-001

### Task 5.1: Create A2-CULT-001 node + realisations (cultural events)
### Task 5.2: Create A2-CULT-002 node + realisations (cultural aspects)
### Task 5.3: Create A2-CULT-003 node + realisations (cultural opinions)
### Task 5.4: Create A2-HEALTH-001 node + realisations (health descriptions)

**Key vocabulary for Phase 5:**
- A2-CULT-001: festival, tradição, celebração, música, dança, festa
- A2-CULT-002: cultura, costume, diferentes, país, pueblo, região
- A2-CULT-003: acho que, gosto de, parece-me interessante, importante, valorizar
- A2-HEALTH-001: médico, doença, dor, receita, farmácia, consulta

**Key grammar for Phase 5:**
- A2-CULT-003: Opinion expressions continued
- A2-HEALTH-001: Describing symptoms (tenho dor de..., sinto-me...)

---

## Final Verification

After all phases complete:

- [ ] Run: `npm run validate:content`
  Expected: 74+ realisations (34 A1 + 40 A2) all valid
- [ ] Run: `npm run typecheck`
  Expected: 0 errors
- [ ] Run: `npm run lint`
  Expected: 0 errors, 0 warnings
- [ ] Run: `npm run build`
  Expected: Build succeeds (more pages than before)
- [ ] Run: `npm test`
  Expected: 52+ tests pass
- [ ] Update `docs/cefr-mapping.md` with all A2 nodes
- [ ] Commit: `content(cefr): complete A2 CEFR inventory — 20 nodes, 40 realisations`
- [ ] Push and create PR
