import { describe, it, expect } from 'vitest';
import { languageName } from './languageNames';

describe('languageName', () => {
  it('resolves a BCP-47 code to its base language name', () => {
    expect(languageName('pt-PT')).toBe('Portuguese');
  });

  it('resolves British English', () => {
    expect(languageName('en-GB')).toBe('English');
  });

  it('resolves a language not yet used by any content (readiness for "any language")', () => {
    expect(languageName('es-ES')).toBe('Spanish');
    expect(languageName('de-DE')).toBe('German');
    expect(languageName('ja-JP')).toBe('Japanese');
  });

  it('falls back to the full original code when Intl cannot resolve the subtag', () => {
    // Intl.DisplayNames doesn't throw for unrecognized subtags — it echoes
    // the subtag back verbatim, so the fallback has to detect that case.
    expect(languageName('xx-YY')).toBe('xx-YY');
  });
});
