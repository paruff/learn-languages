/**
 * UI-chrome string dictionary keyed by *source* language (issue #121) — the
 * learner's known/comfortable language, not the target language they're
 * studying. Falls back to en-GB for any source language or key missing a
 * translation, so a partial dictionary never breaks the page.
 *
 * Deliberately a plain object + lookup function, not an i18n framework —
 * this app has a few dozen chrome strings total, all resolved at request
 * time (Astro templates) or read directly in client `<script>` blocks
 * (which can import this module the same way they already import
 * `lib/storage`, `lib/srs`, etc.).
 */

export type StringKey =
  | 'navLessons'
  | 'navPractice'
  | 'navProgress'
  | 'footer'
  | 'skillListening'
  | 'skillReading'
  | 'skillSpokenInteraction'
  | 'skillSpokenProduction'
  | 'skillWriting'
  | 'lessonsTitle'
  | 'lessonsStartHere'
  | 'lessonsGoToReview'
  | 'lessonsPracticeWords'
  | 'lessonsPracticeExercises'
  | 'lessonCountSingular'
  | 'lessonCountPlural'
  | 'reviewTitle'
  | 'reviewIntro'
  | 'reviewModeReveal'
  | 'reviewModeType'
  | 'reviewHintRevealLabel'
  | 'reviewHintRevealText'
  | 'reviewHintTypeLabel'
  | 'reviewHintTypeText'
  | 'reviewEmpty'
  | 'reviewRevealButton'
  | 'reviewTypeInputLabel'
  | 'reviewCheckButton'
  | 'reviewPronounceLabel'
  | 'reviewCorrect'
  | 'reviewIncorrect'
  | 'reviewGradeAgain'
  | 'reviewGradeHard'
  | 'reviewGradeGood'
  | 'reviewGradeEasy'
  | 'reviewReflectionQuestion'
  | 'reviewReflectionEasy'
  | 'reviewReflectionThink'
  | 'reviewReflectionGuessed'
  | 'reviewReflectionSkip'
  | 'reviewReflectionLabelEasy'
  | 'reviewReflectionLabelThink'
  | 'reviewReflectionLabelGuessed'
  | 'reviewReflectionThanks'
  | 'reviewSessionComplete'
  | 'reviewMasteryUp'
  | 'reviewMasteryDown'
  | 'reviewMasteryUnchanged'
  | 'progressTitle'
  | 'progressMastered'
  | 'progressNoContent'
  | 'progressAllMastered'
  | 'progressNextUp'
  | 'progressCalibration'
  | 'itemSingular'
  | 'itemPlural'
  | 'cardSingular'
  | 'cardPlural';

type Dictionary = Record<StringKey, string>;

const EN_GB: Dictionary = {
  navLessons: 'Lessons',
  navPractice: 'Practice',
  navProgress: 'Progress',
  footer: 'Built with Astro · Deployed via GitOps · CC-BY-4.0',
  skillListening: 'listening',
  skillReading: 'reading',
  skillSpokenInteraction: 'spoken interaction',
  skillSpokenProduction: 'spoken production',
  skillWriting: 'writing',
  lessonsTitle: 'Lessons',
  lessonsStartHere: 'New here? Start with your first lesson',
  lessonsGoToReview: 'Go straight to review →',
  lessonsPracticeWords: 'Practice these words →',
  lessonsPracticeExercises: 'Practice exercises →',
  lessonCountSingular: 'lesson',
  lessonCountPlural: 'lessons',
  reviewTitle: 'Review',
  reviewIntro:
    'Cards are due on a schedule based on how well you know them (spaced repetition) — reveal or type the answer, then grade yourself honestly so the schedule stays accurate.',
  reviewModeReveal: 'Mode: Reveal',
  reviewModeType: 'Mode: Type answer',
  reviewHintRevealLabel: 'Reveal',
  reviewHintRevealText: 'shows the answer with a tap — faster, good for early practice.',
  reviewHintTypeLabel: 'Type answer',
  reviewHintTypeText:
    'makes you produce it from memory first — slower, but strengthens recall better (the "generation effect").',
  reviewEmpty: 'No cards due right now — come back later.',
  reviewRevealButton: 'Reveal',
  reviewTypeInputLabel: 'Type the answer',
  reviewCheckButton: 'Check',
  reviewPronounceLabel: 'Pronounce',
  reviewCorrect: 'Correct!',
  reviewIncorrect: 'Not quite — see the answer below.',
  reviewGradeAgain: 'Again',
  reviewGradeHard: 'Hard',
  reviewGradeGood: 'Good',
  reviewGradeEasy: 'Easy',
  reviewReflectionQuestion: 'How did that session feel?',
  reviewReflectionEasy: 'It was easy',
  reviewReflectionThink: 'I had to think',
  reviewReflectionGuessed: 'I mostly guessed',
  reviewReflectionSkip: 'Skip',
  reviewReflectionLabelEasy: 'was easy',
  reviewReflectionLabelThink: 'took some thought',
  reviewReflectionLabelGuessed: 'was mostly guessing',
  reviewReflectionThanks: "Noted — you said today's session {label}.",
  reviewSessionComplete:
    'Session complete — {reviewed} {cardWord} reviewed. {correct}/{total} correct first try. Mastery {delta} ({after}% overall).',
  reviewMasteryUp: 'up {n}%',
  reviewMasteryDown: 'down {n}%',
  reviewMasteryUnchanged: 'unchanged',
  progressTitle: 'Progress',
  progressMastered: 'mastered',
  progressNoContent: 'No content available for this pair yet.',
  progressAllMastered: 'All available content mastered — nice work.',
  progressNextUp: 'Next up: {canDo} ({level})',
  progressCalibration:
    'Calibration check: {n} {itemWord} you rated confidently needed a re-grade of Again/Hard within the last week.',
  itemSingular: 'item',
  itemPlural: 'items',
  cardSingular: 'card',
  cardPlural: 'cards',
};

const ES_ES: Dictionary = {
  navLessons: 'Lecciones',
  navPractice: 'Practicar',
  navProgress: 'Progreso',
  footer: 'Creado con Astro · Desplegado vía GitOps · CC-BY-4.0',
  skillListening: 'comprensión auditiva',
  skillReading: 'comprensión lectora',
  skillSpokenInteraction: 'interacción oral',
  skillSpokenProduction: 'producción oral',
  skillWriting: 'escritura',
  lessonsTitle: 'Lecciones',
  lessonsStartHere: '¿Primera vez aquí? Empieza con tu primera lección',
  lessonsGoToReview: 'Ir directamente a practicar →',
  lessonsPracticeWords: 'Practicar estas palabras →',
  lessonsPracticeExercises: 'Practicar ejercicios →',
  lessonCountSingular: 'lección',
  lessonCountPlural: 'lecciones',
  reviewTitle: 'Practicar',
  reviewIntro:
    'Las tarjetas vencen según un calendario basado en lo bien que las conoces (repetición espaciada) — revela o escribe la respuesta y luego califícate con honestidad para que el calendario siga siendo preciso.',
  reviewModeReveal: 'Modo: Revelar',
  reviewModeType: 'Modo: Escribir respuesta',
  reviewHintRevealLabel: 'Revelar',
  reviewHintRevealText:
    'muestra la respuesta con un toque — más rápido, ideal para practicar al principio.',
  reviewHintTypeLabel: 'Escribir respuesta',
  reviewHintTypeText:
    'te hace producirla de memoria primero — más lento, pero refuerza mejor el recuerdo (el "efecto de generación").',
  reviewEmpty: 'No hay tarjetas pendientes ahora — vuelve más tarde.',
  reviewRevealButton: 'Revelar',
  reviewTypeInputLabel: 'Escribe la respuesta',
  reviewCheckButton: 'Comprobar',
  reviewPronounceLabel: 'Pronunciar',
  reviewCorrect: '¡Correcto!',
  reviewIncorrect: 'No exactamente — mira la respuesta abajo.',
  reviewGradeAgain: 'Otra vez',
  reviewGradeHard: 'Difícil',
  reviewGradeGood: 'Bien',
  reviewGradeEasy: 'Fácil',
  reviewReflectionQuestion: '¿Cómo te sentiste en esta sesión?',
  reviewReflectionEasy: 'Fue fácil',
  reviewReflectionThink: 'Tuve que pensar',
  reviewReflectionGuessed: 'Mayormente adiviné',
  reviewReflectionSkip: 'Omitir',
  reviewReflectionLabelEasy: 'fue fácil',
  reviewReflectionLabelThink: 'requirió algo de pensar',
  reviewReflectionLabelGuessed: 'fue mayormente adivinar',
  reviewReflectionThanks: 'Anotado — dijiste que la sesión de hoy {label}.',
  reviewSessionComplete:
    'Sesión completada — {reviewed} {cardWord} revisada(s). {correct}/{total} correctas al primer intento. Dominio {delta} ({after}% en total).',
  reviewMasteryUp: 'subió {n}%',
  reviewMasteryDown: 'bajó {n}%',
  reviewMasteryUnchanged: 'sin cambios',
  progressTitle: 'Progreso',
  progressMastered: 'dominadas',
  progressNoContent: 'Todavía no hay contenido disponible para este par.',
  progressAllMastered: 'Todo el contenido disponible está dominado — ¡buen trabajo!',
  progressNextUp: 'Siguiente: {canDo} ({level})',
  progressCalibration:
    'Aviso de calibración: {n} {itemWord} que calificaste con confianza necesitaron una recalificación de Otra vez/Difícil en la última semana.',
  itemSingular: 'elemento',
  itemPlural: 'elementos',
  cardSingular: 'tarjeta',
  cardPlural: 'tarjetas',
};

const PT_PT: Dictionary = {
  navLessons: 'Lições',
  navPractice: 'Praticar',
  navProgress: 'Progresso',
  footer: 'Construído com Astro · Implementado via GitOps · CC-BY-4.0',
  skillListening: 'compreensão oral',
  skillReading: 'compreensão escrita',
  skillSpokenInteraction: 'interação oral',
  skillSpokenProduction: 'produção oral',
  skillWriting: 'escrita',
  lessonsTitle: 'Lições',
  lessonsStartHere: 'Primeira vez aqui? Comece com a sua primeira lição',
  lessonsGoToReview: 'Ir diretamente para a prática →',
  lessonsPracticeWords: 'Praticar estas palavras →',
  lessonsPracticeExercises: 'Praticar exercícios →',
  lessonCountSingular: 'lição',
  lessonCountPlural: 'lições',
  reviewTitle: 'Praticar',
  reviewIntro:
    'Os cartões vencem de acordo com um calendário baseado no quão bem os conhece (repetição espaçada) — revele ou escreva a resposta e depois avalie-se com honestidade para que o calendário se mantenha preciso.',
  reviewModeReveal: 'Modo: Revelar',
  reviewModeType: 'Modo: Escrever resposta',
  reviewHintRevealLabel: 'Revelar',
  reviewHintRevealText: 'mostra a resposta com um toque — mais rápido, bom para a prática inicial.',
  reviewHintTypeLabel: 'Escrever resposta',
  reviewHintTypeText:
    'faz com que a produza de memória primeiro — mais lento, mas reforça melhor a memorização (o "efeito de geração").',
  reviewEmpty: 'Não há cartões pendentes agora — volte mais tarde.',
  reviewRevealButton: 'Revelar',
  reviewTypeInputLabel: 'Escreva a resposta',
  reviewCheckButton: 'Verificar',
  reviewPronounceLabel: 'Pronunciar',
  reviewCorrect: 'Correto!',
  reviewIncorrect: 'Não é bem isso — veja a resposta abaixo.',
  reviewGradeAgain: 'Outra vez',
  reviewGradeHard: 'Difícil',
  reviewGradeGood: 'Bem',
  reviewGradeEasy: 'Fácil',
  reviewReflectionQuestion: 'Como correu esta sessão?',
  reviewReflectionEasy: 'Foi fácil',
  reviewReflectionThink: 'Tive de pensar',
  reviewReflectionGuessed: 'Foi principalmente adivinhar',
  reviewReflectionSkip: 'Saltar',
  reviewReflectionLabelEasy: 'foi fácil',
  reviewReflectionLabelThink: 'exigiu alguma reflexão',
  reviewReflectionLabelGuessed: 'foi principalmente adivinhar',
  reviewReflectionThanks: 'Registado — disse que a sessão de hoje {label}.',
  reviewSessionComplete:
    'Sessão concluída — {reviewed} {cardWord} revisado(s). {correct}/{total} corretos à primeira tentativa. Domínio {delta} ({after}% no total).',
  reviewMasteryUp: 'subiu {n}%',
  reviewMasteryDown: 'desceu {n}%',
  reviewMasteryUnchanged: 'sem alterações',
  progressTitle: 'Progresso',
  progressMastered: 'dominados',
  progressNoContent: 'Ainda não há conteúdo disponível para este par.',
  progressAllMastered: 'Todo o conteúdo disponível está dominado — bom trabalho.',
  progressNextUp: 'A seguir: {canDo} ({level})',
  progressCalibration:
    'Aviso de calibração: {n} {itemWord} que classificou com confiança precisaram de uma reclassificação de Outra vez/Difícil na última semana.',
  itemSingular: 'item',
  itemPlural: 'itens',
  cardSingular: 'cartão',
  cardPlural: 'cartões',
};

const DE_DE: Dictionary = {
  navLessons: 'Lektionen',
  navPractice: 'Üben',
  navProgress: 'Fortschritt',
  footer: 'Erstellt mit Astro · Bereitgestellt via GitOps · CC-BY-4.0',
  skillListening: 'Hören',
  skillReading: 'Lesen',
  skillSpokenInteraction: 'mündliche Interaktion',
  skillSpokenProduction: 'mündliche Produktion',
  skillWriting: 'Schreiben',
  lessonsTitle: 'Lektionen',
  lessonsStartHere: 'Neu hier? Beginnen Sie mit Ihrer ersten Lektion',
  lessonsGoToReview: 'Direkt zum Üben →',
  lessonsPracticeWords: 'Diese Wörter üben →',
  lessonsPracticeExercises: 'Übungen machen →',
  lessonCountSingular: 'Lektion',
  lessonCountPlural: 'Lektionen',
  reviewTitle: 'Üben',
  reviewIntro:
    'Karten werden nach einem Zeitplan fällig, der davon abhängt, wie gut Sie sie kennen (verteiltes Wiederholen) — decken Sie die Antwort auf oder tippen Sie sie ein, und bewerten Sie sich dann ehrlich, damit der Zeitplan genau bleibt.',
  reviewModeReveal: 'Modus: Aufdecken',
  reviewModeType: 'Modus: Antwort eintippen',
  reviewHintRevealLabel: 'Aufdecken',
  reviewHintRevealText: 'zeigt die Antwort mit einem Tipp — schneller, gut zum frühen Üben.',
  reviewHintTypeLabel: 'Antwort eintippen',
  reviewHintTypeText:
    'lässt Sie die Antwort zuerst aus dem Gedächtnis erzeugen — langsamer, stärkt aber das Erinnern besser (der "Generierungseffekt").',
  reviewEmpty: 'Momentan sind keine Karten fällig — schauen Sie später wieder vorbei.',
  reviewRevealButton: 'Aufdecken',
  reviewTypeInputLabel: 'Antwort eingeben',
  reviewCheckButton: 'Prüfen',
  reviewPronounceLabel: 'Aussprechen',
  reviewCorrect: 'Richtig!',
  reviewIncorrect: 'Nicht ganz — sehen Sie die Antwort unten.',
  reviewGradeAgain: 'Nochmal',
  reviewGradeHard: 'Schwer',
  reviewGradeGood: 'Gut',
  reviewGradeEasy: 'Leicht',
  reviewReflectionQuestion: 'Wie fühlte sich diese Sitzung an?',
  reviewReflectionEasy: 'Es war leicht',
  reviewReflectionThink: 'Ich musste nachdenken',
  reviewReflectionGuessed: 'Ich habe meistens geraten',
  reviewReflectionSkip: 'Überspringen',
  reviewReflectionLabelEasy: 'leicht war',
  reviewReflectionLabelThink: 'etwas Nachdenken erforderte',
  reviewReflectionLabelGuessed: 'meistens geraten war',
  reviewReflectionThanks: 'Notiert — Sie sagten, die heutige Sitzung {label}.',
  reviewSessionComplete:
    'Sitzung abgeschlossen — {reviewed} {cardWord} wiederholt. {correct}/{total} beim ersten Versuch richtig. Beherrschung {delta} ({after}% insgesamt).',
  reviewMasteryUp: 'um {n}% gestiegen',
  reviewMasteryDown: 'um {n}% gesunken',
  reviewMasteryUnchanged: 'unverändert',
  progressTitle: 'Fortschritt',
  progressMastered: 'beherrscht',
  progressNoContent: 'Für dieses Sprachenpaar sind noch keine Inhalte verfügbar.',
  progressAllMastered: 'Aller verfügbarer Inhalt beherrscht — gute Arbeit.',
  progressNextUp: 'Als Nächstes: {canDo} ({level})',
  progressCalibration:
    'Kalibrierungshinweis: {n} {itemWord}, die Sie selbstbewusst bewertet haben, mussten in der letzten Woche mit Nochmal/Schwer neu bewertet werden.',
  itemSingular: 'Element',
  itemPlural: 'Elemente',
  cardSingular: 'Karte',
  cardPlural: 'Karten',
};

const FR_FR: Dictionary = {
  navLessons: 'Leçons',
  navPractice: "S'exercer",
  navProgress: 'Progrès',
  footer: 'Construit avec Astro · Déployé via GitOps · CC-BY-4.0',
  skillListening: 'compréhension orale',
  skillReading: 'compréhension écrite',
  skillSpokenInteraction: 'interaction orale',
  skillSpokenProduction: 'production orale',
  skillWriting: 'écriture',
  lessonsTitle: 'Leçons',
  lessonsStartHere: 'Nouveau ici ? Commencez par votre première leçon',
  lessonsGoToReview: "Passer directement à l'exercice →",
  lessonsPracticeWords: 'Pratiquer ces mots →',
  lessonsPracticeExercises: 'Faire les exercices →',
  lessonCountSingular: 'leçon',
  lessonCountPlural: 'leçons',
  reviewTitle: "S'exercer",
  reviewIntro:
    'Les cartes arrivent à échéance selon un calendrier basé sur votre niveau de connaissance (répétition espacée) — révélez ou tapez la réponse, puis évaluez-vous honnêtement pour que le calendrier reste exact.',
  reviewModeReveal: 'Mode : Révéler',
  reviewModeType: 'Mode : Taper la réponse',
  reviewHintRevealLabel: 'Révéler',
  reviewHintRevealText:
    "affiche la réponse d'un simple geste — plus rapide, idéal pour les débuts.",
  reviewHintTypeLabel: 'Taper la réponse',
  reviewHintTypeText:
    "vous fait d'abord la produire de mémoire — plus lent, mais renforce mieux la mémorisation (l'« effet de génération »).",
  reviewEmpty: "Aucune carte à revoir pour l'instant — revenez plus tard.",
  reviewRevealButton: 'Révéler',
  reviewTypeInputLabel: 'Tapez la réponse',
  reviewCheckButton: 'Vérifier',
  reviewPronounceLabel: 'Prononcer',
  reviewCorrect: 'Correct !',
  reviewIncorrect: 'Pas tout à fait — voyez la réponse ci-dessous.',
  reviewGradeAgain: 'Encore',
  reviewGradeHard: 'Difficile',
  reviewGradeGood: 'Bien',
  reviewGradeEasy: 'Facile',
  reviewReflectionQuestion: "Comment s'est passée cette session ?",
  reviewReflectionEasy: "C'était facile",
  reviewReflectionThink: "J'ai dû réfléchir",
  reviewReflectionGuessed: "J'ai surtout deviné",
  reviewReflectionSkip: 'Passer',
  reviewReflectionLabelEasy: 'était facile',
  reviewReflectionLabelThink: 'a demandé un peu de réflexion',
  reviewReflectionLabelGuessed: 'était surtout deviné',
  reviewReflectionThanks: "Noté — vous avez dit que la session d'aujourd'hui {label}.",
  reviewSessionComplete:
    'Session terminée — {reviewed} {cardWord} revue(s). {correct}/{total} correctes du premier coup. Maîtrise {delta} ({after} % au total).',
  reviewMasteryUp: 'en hausse de {n} %',
  reviewMasteryDown: 'en baisse de {n} %',
  reviewMasteryUnchanged: 'inchangée',
  progressTitle: 'Progrès',
  progressMastered: 'maîtrisées',
  progressNoContent: "Aucun contenu disponible pour cette paire pour l'instant.",
  progressAllMastered: 'Tout le contenu disponible est maîtrisé — bon travail.',
  progressNextUp: 'À suivre : {canDo} ({level})',
  progressCalibration:
    'Vérification de calibrage : {n} {itemWord} que vous avez évalué(s) avec confiance ont nécessité une réévaluation Encore/Difficile au cours de la dernière semaine.',
  itemSingular: 'élément',
  itemPlural: 'éléments',
  cardSingular: 'carte',
  cardPlural: 'cartes',
};

const DICTIONARIES: Record<string, Dictionary> = {
  'en-GB': EN_GB,
  'es-ES': ES_ES,
  'pt-PT': PT_PT,
  'de-DE': DE_DE,
  'fr-FR': FR_FR,
};

/** Resolves a UI string for the learner's source language, falling back to en-GB. */
export function getString(sourceLang: string, key: StringKey): string {
  return DICTIONARIES[sourceLang]?.[key] ?? EN_GB[key];
}

/** Simple `{placeholder}` substitution — unmatched placeholders are left as-is. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}
