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
  | 'credits'
  | 'footer'
  | 'feedbackLink'
  | 'selectorSpeak'
  | 'selectorLearn'
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
  | 'reviewModePicture'
  | 'reviewProgress'
  | 'reviewHintRevealLabel'
  | 'reviewHintRevealText'
  | 'reviewHintTypeLabel'
  | 'reviewHintTypeText'
  | 'reviewEmpty'
  | 'reviewNoStudied'
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
  | 'reviewGradeHint'
  | 'reviewCorrectionHeading'
  | 'reviewIntentionHeading'
  | 'reviewContinueButton'
  | 'lessonsNextLesson'
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
  | 'backupTitle'
  | 'backupHint'
  | 'backupExport'
  | 'backupImport'
  | 'backupImported'
  | 'backupImportFailed'
  | 'notFoundTitle'
  | 'notFoundBody'
  | 'notFoundHome'
  | 'itemSingular'
  | 'itemPlural'
  | 'cardSingular'
  | 'cardPlural';

type Dictionary = Record<StringKey, string>;

const EN_GB: Dictionary = {
  navLessons: 'Lessons',
  navPractice: 'Practice',
  navProgress: 'Progress',
  credits: 'Credits',
  footer: 'Free to use and share · CC-BY-4.0',
  feedbackLink: 'Send feedback',
  selectorSpeak: 'I speak',
  selectorLearn: "I'm learning",
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
    'Cards are due on a schedule based on how well you know them — reveal or type the answer, then grade yourself honestly so the schedule stays accurate.',
  reviewModeReveal: 'Tap to reveal',
  reviewModeType: 'Type the answer',
  reviewModePicture: 'Picture prompt',
  reviewProgress: '{current} of {total}',
  reviewHintRevealLabel: 'Reveal',
  reviewHintRevealText: 'shows the answer with a tap — faster, good for early practice.',
  reviewHintTypeLabel: 'Type answer',
  reviewHintTypeText:
    'makes you produce it from memory first — slower, but it strengthens recall better.',
  reviewNoStudied:
    'Practice starts with a lesson — open your first lesson, then come back to practise its words.',
  reviewEmpty: 'No cards due right now — come back later.',
  reviewRevealButton: 'Reveal',
  reviewTypeInputLabel: 'Type the answer',
  reviewCheckButton: 'Check',
  reviewPronounceLabel: 'Listen',
  reviewCorrect: 'Correct!',
  reviewIncorrect: 'Not quite — see the answer below.',
  reviewGradeAgain: 'Again',
  reviewGradeHard: 'Hard',
  reviewGradeGood: 'Good',
  reviewGradeEasy: 'Easy',
  reviewGradeHint:
    'Again: see it again soon · Hard: sooner than usual · Good: on schedule · Easy: much later.',
  lessonsNextLesson: 'Next lesson →',
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
  progressMastered: 'learned',
  progressNoContent: 'No content available for this pair yet.',
  progressAllMastered: 'You have learned everything available — nice work.',
  progressNextUp: 'Next up: {canDo} ({level})',
  backupTitle: 'Back up your progress',
  backupHint:
    'Your progress lives only in this browser. Save a backup file before clearing browser data or switching devices.',
  backupExport: 'Download backup',
  backupImport: 'Restore from backup',
  backupImported: 'Restored {n} saved items.',
  backupImportFailed: "That file isn't an Acquira backup — nothing was changed.",
  notFoundTitle: 'Page not found',
  notFoundBody: "That page doesn't exist — the link may be out of date.",
  notFoundHome: 'Back to Acquira',
  progressCalibration:
    'Calibration check: {n} {itemWord} you rated confidently needed a re-grade of Again/Hard within the last week.',
  itemSingular: 'item',
  itemPlural: 'items',
  cardSingular: 'card',
  cardPlural: 'cards',
  reviewCorrectionHeading: 'Have another look — you will see this card again shortly.',
  reviewIntentionHeading: "Today's goal — you are practising how to:",
  reviewContinueButton: 'Continue',
};

const ES_ES: Dictionary = {
  navLessons: 'Lecciones',
  navPractice: 'Practicar',
  navProgress: 'Progreso',
  credits: 'Créditos',
  footer: 'Gratis para usar y compartir · CC-BY-4.0',
  feedbackLink: 'Enviar comentarios',
  selectorSpeak: 'Hablo',
  selectorLearn: 'Estoy aprendiendo',
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
  reviewModePicture: 'Modo: Indicación con imagen',
  reviewProgress: '{current} de {total}',
  reviewHintRevealLabel: 'Revelar',
  reviewHintRevealText:
    'muestra la respuesta con un toque — más rápido, ideal para practicar al principio.',
  reviewHintTypeLabel: 'Escribir respuesta',
  reviewHintTypeText:
    'te hace producirla de memoria primero — más lento, pero refuerza mejor el recuerdo (el "efecto de generación").',
  reviewNoStudied:
    'La práctica empieza con una lección: abre tu primera lección y vuelve para practicar sus palabras.',
  reviewEmpty: 'No hay tarjetas pendientes ahora — vuelve más tarde.',
  reviewRevealButton: 'Revelar',
  reviewTypeInputLabel: 'Escribe la respuesta',
  reviewCheckButton: 'Comprobar',
  reviewPronounceLabel: 'Escuchar',
  reviewCorrect: '¡Correcto!',
  reviewIncorrect: 'No exactamente — mira la respuesta abajo.',
  reviewGradeAgain: 'Otra vez',
  reviewGradeHard: 'Difícil',
  reviewGradeGood: 'Bien',
  reviewGradeEasy: 'Fácil',
  reviewGradeHint:
    'Otra vez: volverá pronto · Difícil: antes de lo normal · Bien: según lo previsto · Fácil: mucho más tarde.',
  lessonsNextLesson: 'Siguiente lección →',
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
  progressMastered: 'aprendidas',
  progressNoContent: 'Todavía no hay contenido disponible para este par.',
  progressAllMastered: 'Has aprendido todo lo disponible — ¡buen trabajo!',
  progressNextUp: 'Siguiente: {canDo} ({level})',
  backupTitle: 'Guarda una copia de tu progreso',
  backupHint:
    'Tu progreso solo se guarda en este navegador. Descarga una copia antes de borrar los datos del navegador o cambiar de dispositivo.',
  backupExport: 'Descargar copia',
  backupImport: 'Restaurar copia',
  backupImported: 'Se restauraron {n} elementos guardados.',
  backupImportFailed: 'Ese archivo no es una copia de Acquira; no se ha cambiado nada.',
  notFoundTitle: 'Página no encontrada',
  notFoundBody: 'Esa página no existe; es posible que el enlace esté desactualizado.',
  notFoundHome: 'Volver a Acquira',
  progressCalibration:
    'Aviso de calibración: {n} {itemWord} que calificaste con confianza necesitaron una recalificación de Otra vez/Difícil en la última semana.',
  itemSingular: 'elemento',
  itemPlural: 'elementos',
  cardSingular: 'tarjeta',
  cardPlural: 'tarjetas',
  reviewCorrectionHeading: 'Échale otro vistazo: volverás a ver esta tarjeta enseguida.',
  reviewIntentionHeading: 'Objetivo de hoy: practicas cómo:',
  reviewContinueButton: 'Continuar',
};

const PT_PT: Dictionary = {
  navLessons: 'Lições',
  navPractice: 'Praticar',
  navProgress: 'Progresso',
  credits: 'Créditos',
  footer: 'Gratuito para usar e partilhar · CC-BY-4.0',
  feedbackLink: 'Enviar feedback',
  selectorSpeak: 'Eu falo',
  selectorLearn: 'Estou a aprender',
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
  reviewModePicture: 'Modo: Prompt com imagem',
  reviewProgress: '{current} de {total}',
  reviewHintRevealLabel: 'Revelar',
  reviewHintRevealText: 'mostra a resposta com um toque — mais rápido, bom para a prática inicial.',
  reviewHintTypeLabel: 'Escrever resposta',
  reviewHintTypeText:
    'faz com que a produza de memória primeiro — mais lento, mas reforça melhor a memorização (o "efeito de geração").',
  reviewNoStudied:
    'A prática começa numa lição — abra a sua primeira lição e volte para praticar as suas palavras.',
  reviewEmpty: 'Não há cartões pendentes agora — volte mais tarde.',
  reviewRevealButton: 'Revelar',
  reviewTypeInputLabel: 'Escreva a resposta',
  reviewCheckButton: 'Verificar',
  reviewPronounceLabel: 'Ouvir',
  reviewCorrect: 'Correto!',
  reviewIncorrect: 'Não é bem isso — veja a resposta abaixo.',
  reviewGradeAgain: 'Outra vez',
  reviewGradeHard: 'Difícil',
  reviewGradeGood: 'Bem',
  reviewGradeEasy: 'Fácil',
  reviewGradeHint:
    'Outra vez: volta em breve · Difícil: mais cedo que o normal · Bem: como previsto · Fácil: bastante mais tarde.',
  lessonsNextLesson: 'Lição seguinte →',
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
  progressMastered: 'aprendidas',
  progressNoContent: 'Ainda não há conteúdo disponível para este par.',
  progressAllMastered: 'Aprendeu tudo o que está disponível — bom trabalho.',
  progressNextUp: 'A seguir: {canDo} ({level})',
  backupTitle: 'Faça uma cópia do seu progresso',
  backupHint:
    'O seu progresso fica guardado apenas neste navegador. Transfira uma cópia antes de limpar os dados do navegador ou mudar de dispositivo.',
  backupExport: 'Transferir cópia',
  backupImport: 'Restaurar cópia',
  backupImported: 'Foram restaurados {n} itens guardados.',
  backupImportFailed: 'Esse ficheiro não é uma cópia do Acquira — nada foi alterado.',
  notFoundTitle: 'Página não encontrada',
  notFoundBody: 'Essa página não existe — a ligação pode estar desatualizada.',
  notFoundHome: 'Voltar ao Acquira',
  progressCalibration:
    'Aviso de calibração: {n} {itemWord} que classificou com confiança precisaram de uma reclassificação de Outra vez/Difícil na última semana.',
  itemSingular: 'item',
  itemPlural: 'itens',
  cardSingular: 'cartão',
  cardPlural: 'cartões',
  reviewCorrectionHeading: 'Veja outra vez — vai voltar a ver este cartão em breve.',
  reviewIntentionHeading: 'Objetivo de hoje: está a praticar como:',
  reviewContinueButton: 'Continuar',
};

const DE_DE: Dictionary = {
  navLessons: 'Lektionen',
  navPractice: 'Üben',
  navProgress: 'Fortschritt',
  credits: 'Quellen',
  footer: 'Frei nutzbar und teilbar · CC-BY-4.0',
  feedbackLink: 'Feedback senden',
  selectorSpeak: 'Ich spreche',
  selectorLearn: 'Ich lerne',
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
  reviewModePicture: 'Modus: Bildaufforderung',
  reviewProgress: '{current} von {total}',
  reviewHintRevealLabel: 'Aufdecken',
  reviewHintRevealText: 'zeigt die Antwort mit einem Tipp — schneller, gut zum frühen Üben.',
  reviewHintTypeLabel: 'Antwort eintippen',
  reviewHintTypeText:
    'lässt Sie die Antwort zuerst aus dem Gedächtnis erzeugen — langsamer, stärkt aber das Erinnern besser (der "Generierungseffekt").',
  reviewNoStudied:
    'Das Üben beginnt mit einer Lektion — öffnen Sie Ihre erste Lektion und kommen Sie zurück, um die Wörter zu üben.',
  reviewEmpty: 'Momentan sind keine Karten fällig — schauen Sie später wieder vorbei.',
  reviewRevealButton: 'Aufdecken',
  reviewTypeInputLabel: 'Antwort eingeben',
  reviewCheckButton: 'Prüfen',
  reviewPronounceLabel: 'Anhören',
  reviewCorrect: 'Richtig!',
  reviewIncorrect: 'Nicht ganz — sehen Sie die Antwort unten.',
  reviewGradeAgain: 'Nochmal',
  reviewGradeHard: 'Schwer',
  reviewGradeGood: 'Gut',
  reviewGradeEasy: 'Leicht',
  reviewGradeHint:
    'Nochmal: bald wieder · Schwer: früher als sonst · Gut: wie geplant · Leicht: viel später.',
  lessonsNextLesson: 'Nächste Lektion →',
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
  progressMastered: 'gelernt',
  progressNoContent: 'Für dieses Sprachenpaar sind noch keine Inhalte verfügbar.',
  progressAllMastered: 'Du hast alles Verfügbare gelernt — gute Arbeit.',
  progressNextUp: 'Als Nächstes: {canDo} ({level})',
  backupTitle: 'Fortschritt sichern',
  backupHint:
    'Dein Fortschritt wird nur in diesem Browser gespeichert. Lade eine Sicherung herunter, bevor du Browserdaten löschst oder das Gerät wechselst.',
  backupExport: 'Sicherung herunterladen',
  backupImport: 'Sicherung wiederherstellen',
  backupImported: '{n} gespeicherte Einträge wiederhergestellt.',
  backupImportFailed: 'Diese Datei ist keine Acquira-Sicherung – es wurde nichts geändert.',
  notFoundTitle: 'Seite nicht gefunden',
  notFoundBody: 'Diese Seite existiert nicht – der Link ist möglicherweise veraltet.',
  notFoundHome: 'Zurück zu Acquira',
  progressCalibration:
    'Kalibrierungshinweis: {n} {itemWord}, die Sie selbstbewusst bewertet haben, mussten in der letzten Woche mit Nochmal/Schwer neu bewertet werden.',
  itemSingular: 'Element',
  itemPlural: 'Elemente',
  cardSingular: 'Karte',
  cardPlural: 'Karten',
  reviewCorrectionHeading: 'Schau noch einmal hin – du siehst diese Karte gleich wieder.',
  reviewIntentionHeading: 'Ziel für heute – du übst, wie du:',
  reviewContinueButton: 'Weiter',
};

const FR_FR: Dictionary = {
  navLessons: 'Leçons',
  navPractice: "S'exercer",
  navProgress: 'Progrès',
  credits: 'Crédits',
  footer: "Libre d'utilisation et de partage · CC-BY-4.0",
  feedbackLink: 'Envoyer un avis',
  selectorSpeak: 'Je parle',
  selectorLearn: "J'apprends",
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
  reviewModePicture: 'Mode : Image indicatrice',
  reviewProgress: '{current} sur {total}',
  reviewHintRevealLabel: 'Révéler',
  reviewHintRevealText:
    "affiche la réponse d'un simple geste — plus rapide, idéal pour les débuts.",
  reviewHintTypeLabel: 'Taper la réponse',
  reviewHintTypeText:
    "vous fait d'abord la produire de mémoire — plus lent, mais renforce mieux la mémorisation (l'« effet de génération »).",
  reviewNoStudied:
    'La pratique commence par une leçon — ouvrez votre première leçon, puis revenez pratiquer ses mots.',
  reviewEmpty: "Aucune carte à revoir pour l'instant — revenez plus tard.",
  reviewRevealButton: 'Révéler',
  reviewTypeInputLabel: 'Tapez la réponse',
  reviewCheckButton: 'Vérifier',
  reviewPronounceLabel: 'Écouter',
  reviewCorrect: 'Correct !',
  reviewIncorrect: 'Pas tout à fait — voyez la réponse ci-dessous.',
  reviewGradeAgain: 'Encore',
  reviewGradeHard: 'Difficile',
  reviewGradeGood: 'Bien',
  reviewGradeEasy: 'Facile',
  reviewGradeHint:
    "Encore : reviendra bientôt · Difficile : plus tôt que d'habitude · Bien : comme prévu · Facile : bien plus tard.",
  lessonsNextLesson: 'Leçon suivante →',
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
  progressMastered: 'apprises',
  progressNoContent: "Aucun contenu disponible pour cette paire pour l'instant.",
  progressAllMastered: 'Vous avez tout appris — bon travail.',
  progressNextUp: 'À suivre : {canDo} ({level})',
  backupTitle: 'Sauvegardez votre progression',
  backupHint:
    'Votre progression est enregistrée uniquement dans ce navigateur. Téléchargez une sauvegarde avant d’effacer les données du navigateur ou de changer d’appareil.',
  backupExport: 'Télécharger la sauvegarde',
  backupImport: 'Restaurer une sauvegarde',
  backupImported: '{n} éléments enregistrés restaurés.',
  backupImportFailed: 'Ce fichier n’est pas une sauvegarde Acquira : rien n’a été modifié.',
  notFoundTitle: 'Page introuvable',
  notFoundBody: 'Cette page n’existe pas : le lien est peut-être obsolète.',
  notFoundHome: 'Retour à Acquira',
  progressCalibration:
    'Vérification de calibrage : {n} {itemWord} que vous avez évalué(s) avec confiance ont nécessité une réévaluation Encore/Difficile au cours de la dernière semaine.',
  itemSingular: 'élément',
  itemPlural: 'éléments',
  cardSingular: 'carte',
  cardPlural: 'cartes',
  reviewCorrectionHeading: 'Regarde encore — tu reverras cette carte bientôt.',
  reviewIntentionHeading: "Objectif du jour : tu t'entraînes à :",
  reviewContinueButton: 'Continuer',
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
