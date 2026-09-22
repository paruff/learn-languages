export interface GlossSplit {
  before: string;
  match: string;
  after: string;
}

/**
 * Locates a vocabulary term inside its own example sentence so the lesson
 * page can wrap just that occurrence with a gloss tooltip (#36) instead of
 * requiring the learner to scroll to the full-sentence translation below.
 *
 * Case-insensitive: a term is often written capitalized (sentence-initial in
 * the vocabulary list) but appears lowercase mid-sentence in its own example
 * — e.g. es-ES `¿Cómo se llama usted?` inside `Perdone, ¿cómo se llama
 * usted?`. The returned `match` keeps the example's own casing, not the
 * term's, so the rendered text isn't silently re-capitalized.
 */
export function splitAtTerm(text: string, term: string): GlossSplit | null {
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return null;

  return {
    before: text.slice(0, index),
    match: text.slice(index, index + term.length),
    after: text.slice(index + term.length),
  };
}
