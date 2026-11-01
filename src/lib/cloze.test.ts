import { describe, it, expect } from 'vitest';
import { makeCloze, shouldCloze, CLOZE_BLANK } from './cloze';

describe('makeCloze', () => {
  it('blanks the term found verbatim in the sentence', () => {
    expect(makeCloze('Bom dia, como está?', 'Bom dia')).toBe(`${CLOZE_BLANK}, como está?`);
  });

  it('matches case-insensitively but only whole words', () => {
    expect(makeCloze('Obrigado pela ajuda.', 'obrigado')).toBe(`${CLOZE_BLANK} pela ajuda.`);
    expect(makeCloze('Ele é um gato.', 'ga')).toBeNull();
  });

  it('skips inflected forms: term not present verbatim', () => {
    expect(makeCloze('Eles falam português.', 'falar')).toBeNull();
  });

  it('skips empty terms', () => {
    expect(makeCloze('Olá!', '')).toBeNull();
  });

  it('handles regex metacharacters in the term', () => {
    expect(makeCloze('Quanto custa (isto)?', '(isto)')).toBe(`Quanto custa ${CLOZE_BLANK}?`);
  });
});

describe('shouldCloze', () => {
  it('is false until the second successful review', () => {
    expect(shouldCloze(0)).toBe(false);
    expect(shouldCloze(1)).toBe(false);
  });

  it('alternates with plain recall once mature', () => {
    expect(shouldCloze(2)).toBe(true);
    expect(shouldCloze(3)).toBe(false);
    expect(shouldCloze(4)).toBe(true);
  });
});
