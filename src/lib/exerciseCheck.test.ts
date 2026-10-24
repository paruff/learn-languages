import { describe, it, expect } from 'vitest';
import { checkAnswer, diffAnswer, suggestGrade } from './exerciseCheck';

describe('checkAnswer', () => {
  it('accepts an exact match', () => {
    expect(checkAnswer('Bom', 'Bom')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(checkAnswer('bom', 'Bom')).toBe(true);
  });

  it('ignores leading/trailing whitespace', () => {
    expect(checkAnswer('  Bom  ', 'Bom')).toBe(true);
  });

  it('ignores trailing punctuation', () => {
    expect(checkAnswer('Boa noite!', 'Boa noite')).toBe(true);
  });

  it('rejects a wrong answer', () => {
    expect(checkAnswer('Boa tarde', 'Boa noite')).toBe(false);
  });

  it('matches against any one of multiple accepted answers', () => {
    expect(checkAnswer('Boa noite', ['Boa tarde', 'Boa noite'])).toBe(true);
  });

  it('rejects an empty input', () => {
    expect(checkAnswer('', 'Bom')).toBe(false);
  });

  it('is accent-insensitive (pt-PT diacritics should not hard-fail a typed answer)', () => {
    expect(checkAnswer('Ola', 'Olá')).toBe(true);
    expect(checkAnswer('nao', 'Não')).toBe(true);
    expect(checkAnswer('Voce', 'Você')).toBe(true);
  });
});

describe('diffAnswer', () => {
  it('marks nothing wrong for an exact match', () => {
    expect(diffAnswer('bom dia', 'Bom dia').every((p) => !p.wrong)).toBe(true);
  });

  it('marks a missing accent on the answer character', () => {
    const wrong = diffAnswer('cafe', 'café').filter((p) => p.wrong);
    expect(wrong).toEqual([{ char: 'é', wrong: true }]);
  });

  it('marks a wrong ending', () => {
    const parts = diffAnswer('obrigada', 'obrigado');
    expect(parts.map((p) => p.char).join('')).toBe('obrigado');
    expect(parts.filter((p) => p.wrong).map((p) => p.char)).toEqual(['o']);
  });

  it('marks a missing letter', () => {
    expect(diffAnswer('bm', 'bom').filter((p) => p.wrong)).toEqual([{ char: 'o', wrong: true }]);
  });

  it('marks everything wrong for an empty attempt', () => {
    expect(diffAnswer('', 'sim').every((p) => p.wrong)).toBe(true);
  });
});

describe('suggestGrade', () => {
  it('suggests good for a correct answer, ignoring case and punctuation', () => {
    expect(suggestGrade(' Boa noite! ', 'boa noite')).toBe('good');
  });

  it('suggests hard for an accent-only miss', () => {
    expect(suggestGrade('cafe', 'café')).toBe('hard');
  });

  it('suggests again for a wrong answer', () => {
    expect(suggestGrade('obrigada', 'obrigado')).toBe('again');
  });

  it('suggests again for an empty answer', () => {
    expect(suggestGrade('', 'sim')).toBe('again');
  });
});
