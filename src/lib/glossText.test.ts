import { describe, it, expect } from 'vitest';
import { splitAtTerm } from './glossText';

describe('splitAtTerm', () => {
  it('splits text around the first case-insensitive occurrence of the term', () => {
    expect(splitAtTerm('Hola, ¿cómo estás?', 'Hola')).toEqual({
      before: '',
      match: 'Hola',
      after: ', ¿cómo estás?',
    });
  });

  it("preserves the example text's own casing in the returned match, not the term's", () => {
    // Real content case: term is capitalized (sentence-initial in the vocab
    // list) but appears mid-sentence, lowercase, inside its own example.
    const result = splitAtTerm('Perdone, ¿cómo se llama usted?', '¿Cómo se llama usted?');
    expect(result).toEqual({
      before: 'Perdone, ',
      match: '¿cómo se llama usted?',
      after: '',
    });
  });

  it('returns null when the term does not appear in the text at all', () => {
    expect(splitAtTerm('Some unrelated sentence.', 'Hola')).toBeNull();
  });

  it('matches only the first occurrence when the term appears more than once', () => {
    expect(splitAtTerm('sim, sim!', 'sim')).toEqual({ before: '', match: 'sim', after: ', sim!' });
  });
});
