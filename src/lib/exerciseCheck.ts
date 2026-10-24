function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritical marks (pt-PT accents)
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '');
}

/**
 * Compares a learner's typed answer against one or more accepted answers,
 * ignoring case, accents, surrounding whitespace, and trailing punctuation —
 * the kinds of difference that shouldn't fail a generation-practice exercise
 * (spec §1.1 desirable difficulties).
 */
export function checkAnswer(input: string, answer: string | string[]): boolean {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return false;

  const accepted = Array.isArray(answer) ? answer : [answer];
  return accepted.some((candidate) => normalize(candidate) === normalizedInput);
}

// Like normalize() but keeps accents, so an accent-only miss is detectable.
function normalizeStrict(value: string): string {
  return value
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '');
}

export type SuggestedGrade = 'again' | 'hard' | 'good';

/**
 * Suggests a self-grade for a typed attempt (L26): exact (modulo case,
 * whitespace, trailing punctuation) → good; right letters but wrong/missing
 * accents → hard; anything else → again. The learner can still override it.
 */
export function suggestGrade(input: string, answer: string): SuggestedGrade {
  if (!checkAnswer(input, answer)) return 'again';
  return normalizeStrict(input) === normalizeStrict(answer) ? 'good' : 'hard';
}

export interface DiffPart {
  char: string;
  wrong: boolean;
}

/**
 * Splits the correct answer into characters, flagging those the learner's
 * attempt missed or got wrong (longest-common-subsequence alignment, so a
 * single missing letter doesn't flag everything after it). Case-insensitive.
 */
export function diffAnswer(input: string, answer: string): DiffPart[] {
  const a = [...answer.normalize('NFC').trim()];
  const b = [...normalizeStrict(input)];
  const key = (c: string) => c.toLowerCase();
  // lcs[i][j] = LCS length of a[i..] and b[j..]
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] =
        key(a[i]) === key(b[j]) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length) {
    if (j < b.length && key(a[i]) === key(b[j])) {
      parts.push({ char: a[i++], wrong: false });
      j++;
    } else if (j < b.length && lcs[i][j + 1] > lcs[i + 1][j]) {
      j++; // extra typed char, nothing to flag in the answer
    } else {
      parts.push({ char: a[i++], wrong: true });
    }
  }
  return parts;
}
