interface ScorableExercise {
  type: string;
  questions?: unknown[];
}

/**
 * Total answerable questions across a lesson's exercises. A passage exercise
 * (issue #125) carries 2-4 sub-questions and must count as that many toward
 * "X/Y correct", not 1 — otherwise a learner who gets 3/4 passage questions
 * right would see a misleadingly perfect denominator.
 */
export function countScorableQuestions(exercises: ScorableExercise[]): number {
  return exercises.reduce((sum, ex) => sum + (ex.questions?.length ?? 1), 0);
}
