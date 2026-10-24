export const CLOZE_BLANK = '_____';

/** A letter or digit in any script — what separates a whole-word match from a substring. */
const WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Blanks the first whole-word, case-insensitive occurrence of `term` in
 * `sentence` (spec L24). Returns null when the term isn't present verbatim —
 * inflected forms ("falam" for "falar") are skipped rather than guessed at.
 */
export function makeCloze(sentence: string, term: string): string | null {
  const needle = term.trim().toLowerCase();
  if (!needle) return null;
  const haystack = sentence.toLowerCase();
  // ponytail: toLowerCase can change string length for a few characters (e.g. İ);
  // such sentences just fall through to "no cloze" via the length guard.
  if (haystack.length !== sentence.length) return null;

  for (
    let from = haystack.indexOf(needle);
    from !== -1;
    from = haystack.indexOf(needle, from + 1)
  ) {
    const end = from + needle.length;
    const before = sentence[from - 1];
    const after = sentence[end];
    if (!(before && WORD_CHAR.test(before)) && !(after && WORD_CHAR.test(after))) {
      return sentence.slice(0, from) + CLOZE_BLANK + sentence.slice(end);
    }
  }
  return null;
}

/**
 * Mature items (two or more successful reviews in a row) alternate between
 * plain recall and the cloze, so the sentence adds context without replacing
 * the term-level card. Failing a card resets repetitions, returning it to plain.
 */
export function shouldCloze(repetitions: number): boolean {
  return repetitions >= 2 && repetitions % 2 === 0;
}
