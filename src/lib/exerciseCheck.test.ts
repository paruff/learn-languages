import { describe, it, expect } from 'vitest';
import { checkAnswer } from './exerciseCheck';

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
});
