import { describe, it, expect } from 'vitest';
import { getString, format } from './strings';

describe('getString', () => {
  it('returns the string for a language that has a translation', () => {
    expect(getString('pt-PT', 'navLessons')).toBe('Lições');
  });

  it('falls back to en-GB when the source language has no translation for that key', () => {
    // xx-YY is not a real source language in the dictionary at all.
    expect(getString('xx-YY', 'navLessons')).toBe(getString('en-GB', 'navLessons'));
  });

  it('resolves a per-language reviewProgress template distinct from the en-GB one (regression: was hardcoded "X of Y" in review.astro)', () => {
    expect(getString('es-ES', 'reviewProgress')).toBe('{current} de {total}');
    expect(getString('en-GB', 'reviewProgress')).toBe('{current} of {total}');
  });

  it('resolves every supported language for every key (no accidental gaps)', () => {
    const languages = ['en-GB', 'es-ES', 'pt-PT', 'de-DE', 'fr-FR'] as const;
    const keys = [
      'navLessons',
      'navPractice',
      'navProgress',
      'footer',
      'reviewTitle',
      'reviewRevealButton',
      'reviewGradeAgain',
      'reviewProgress',
      'progressTitle',
      'lessonsTitle',
    ] as const;
    for (const lang of languages) {
      for (const key of keys) {
        expect(getString(lang, key).length).toBeGreaterThan(0);
      }
    }
  });
});

describe('format', () => {
  it('substitutes named placeholders', () => {
    expect(format('Hello {name}, you have {count} items', { name: 'Ana', count: 3 })).toBe(
      'Hello Ana, you have 3 items'
    );
  });

  it('leaves unmatched placeholders untouched rather than throwing', () => {
    expect(format('Hello {name}', {})).toBe('Hello {name}');
  });
});
