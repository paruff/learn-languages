import { describe, it, expect } from 'vitest';
import { resolvePair, DEFAULT_PAIR } from './pairResolve';

const pairs = [
  { sourceLang: 'de-DE', targetLang: 'en-GB' },
  { sourceLang: 'en-GB', targetLang: 'pt-PT' },
  { sourceLang: 'es-ES', targetLang: 'pt-PT' },
];

describe('resolvePair (spec U1)', () => {
  it('uses the saved preference when it is an available pair', () => {
    expect(resolvePair({ sourceLang: 'es-ES', targetLang: 'pt-PT' }, pairs)).toEqual({
      sourceLang: 'es-ES',
      targetLang: 'pt-PT',
    });
  });

  it('falls back to en-GB→pt-PT, not the first pair in load order', () => {
    expect(resolvePair(null, pairs)).toEqual(DEFAULT_PAIR);
  });

  it('ignores a saved preference that is no longer available', () => {
    expect(resolvePair({ sourceLang: 'fr-FR', targetLang: 'pt-PT' }, pairs)).toEqual(DEFAULT_PAIR);
  });

  it('falls back to the first available pair when the default is missing', () => {
    expect(resolvePair(null, [pairs[0]])).toEqual(pairs[0]);
  });

  it('returns the default when no pairs exist', () => {
    expect(resolvePair(null, [])).toEqual(DEFAULT_PAIR);
  });
});
