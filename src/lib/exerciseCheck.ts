function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '');
}

/**
 * Compares a learner's typed answer against one or more accepted answers,
 * ignoring case, surrounding whitespace, and trailing punctuation — the
 * kinds of difference that shouldn't fail a generation-practice exercise
 * (spec §1.1 desirable difficulties).
 */
export function checkAnswer(input: string, answer: string | string[]): boolean {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return false;

  const accepted = Array.isArray(answer) ? answer : [answer];
  return accepted.some((candidate) => normalize(candidate) === normalizedInput);
}
