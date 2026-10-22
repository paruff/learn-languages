export interface Pair {
  sourceLang: string;
  targetLang: string;
}

export const DEFAULT_PAIR: Pair = { sourceLang: 'en-GB', targetLang: 'pt-PT' };

const same = (a: Pair, b: Pair): boolean =>
  a.sourceLang === b.sourceLang && a.targetLang === b.targetLang;

/**
 * Which pair the home page and header point at: the learner's saved choice if
 * it still exists, else the product default (en-GB→pt-PT), else whatever is
 * available. Never "first in content-load order" (that sent a tester to German).
 */
export function resolvePair(saved: Pair | null, available: Pair[]): Pair {
  if (saved && available.some((p) => same(p, saved))) return saved;
  if (available.some((p) => same(p, DEFAULT_PAIR)) || available.length === 0) return DEFAULT_PAIR;
  return available[0];
}
