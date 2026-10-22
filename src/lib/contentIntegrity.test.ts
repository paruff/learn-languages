import { describe, it, expect } from 'vitest';
import {
  checkRealisationReferences,
  checkVocabularyParity,
  checkConcepts,
  checkPairAlignment,
  checkImageCredits,
  glossOf,
  normaliseGloss,
} from './contentIntegrity';

describe('checkRealisationReferences', () => {
  it('passes when every realisation references an existing cefr-node', () => {
    const cefrNodeIds = new Set(['A1-GREET-001', 'A1-INTRO-001']);
    const realisations = [
      { file: 'realisations/en-GB/a1-greet-001.yaml', nodeId: 'A1-GREET-001' },
      { file: 'realisations/pt-PT/a1-greet-001.yaml', nodeId: 'A1-GREET-001' },
      { file: 'realisations/en-GB/a1-intro-001.yaml', nodeId: 'A1-INTRO-001' },
    ];

    const result = checkRealisationReferences(cefrNodeIds, realisations);

    expect(result.valid).toBe(true);
    expect(result.missingReferences).toEqual([]);
  });

  it('flags a realisation referencing a nodeId with no cefr-node (spec invariant I1)', () => {
    const cefrNodeIds = new Set(['A1-GREET-001']);
    const realisations = [
      { file: 'realisations/en-GB/a1-greet-001.yaml', nodeId: 'A1-GREET-001' },
      { file: 'realisations/en-GB/a1-typo-999.yaml', nodeId: 'A1-TYPO-999' },
    ];

    const result = checkRealisationReferences(cefrNodeIds, realisations);

    expect(result.valid).toBe(false);
    expect(result.missingReferences).toEqual([
      { file: 'realisations/en-GB/a1-typo-999.yaml', nodeId: 'A1-TYPO-999' },
    ]);
  });

  it('passes trivially with no realisations at all', () => {
    const result = checkRealisationReferences(new Set(['A1-GREET-001']), []);
    expect(result.valid).toBe(true);
  });

  it('reports every offending file, not just the first', () => {
    const cefrNodeIds = new Set<string>();
    const realisations = [
      { file: 'a.yaml', nodeId: 'X-1' },
      { file: 'b.yaml', nodeId: 'X-2' },
    ];

    const result = checkRealisationReferences(cefrNodeIds, realisations);

    expect(result.missingReferences).toHaveLength(2);
  });
});

describe('checkVocabularyParity', () => {
  it('flags a nodeId whose realisations have different vocabulary counts', () => {
    const refs = [
      {
        file: 'en-GB/a1-greet-001.yaml',
        nodeId: 'A1-GREET-001',
        lang: 'en-GB',
        vocabularyCount: 2,
      },
      {
        file: 'de-DE/a1-greet-001.yaml',
        nodeId: 'A1-GREET-001',
        lang: 'de-DE',
        vocabularyCount: 6,
      },
    ];

    const warnings = checkVocabularyParity(refs);

    expect(warnings).toEqual([
      {
        nodeId: 'A1-GREET-001',
        counts: [
          { lang: 'en-GB', file: 'en-GB/a1-greet-001.yaml', count: 2 },
          { lang: 'de-DE', file: 'de-DE/a1-greet-001.yaml', count: 6 },
        ],
      },
    ]);
  });

  it('does not flag a nodeId whose realisations all agree on vocabulary count', () => {
    const refs = [
      { file: 'en-GB/a1-numb-001.yaml', nodeId: 'A1-NUMB-001', lang: 'en-GB', vocabularyCount: 3 },
      { file: 'es-ES/a1-numb-001.yaml', nodeId: 'A1-NUMB-001', lang: 'es-ES', vocabularyCount: 3 },
    ];

    expect(checkVocabularyParity(refs)).toEqual([]);
  });

  it('does not flag a nodeId with only one realisation (nothing to compare against yet)', () => {
    const refs = [
      { file: 'en-GB/a1-food-001.yaml', nodeId: 'A1-FOOD-001', lang: 'en-GB', vocabularyCount: 5 },
    ];

    expect(checkVocabularyParity(refs)).toEqual([]);
  });

  it('returns an empty list for no realisations at all', () => {
    expect(checkVocabularyParity([])).toEqual([]);
  });
});

describe('concept integrity checks', () => {
  it('checkConcepts reports an item with no concept', () => {
    const errors = checkConcepts([
      {
        file: 'realisations/pt-PT/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'pt-PT',
        items: [
          {
            id: 'pt-PT-A1-BODY-001-004',
            concept: undefined,
            term: 'olho',
            translation: 'eye',
          },
        ],
      },
    ]);

    expect(errors.some((line) => line.includes('realisations/pt-PT/a1-body-001.yaml'))).toBe(true);
    expect(errors.some((line) => line.includes('pt-PT-A1-BODY-001-004'))).toBe(true);
  });

  it('checkConcepts rejects a non-kebab concept', () => {
    const errors = checkConcepts([
      {
        file: 'x.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'pt-PT',
        items: [{ id: 'x', concept: 'Eye', term: 'olho', translation: 'eye' }],
      },
    ]);

    expect(errors.some((line) => line.includes('Eye'))).toBe(true);
  });

  it('checkConcepts reports duplicate concepts in one realisation', () => {
    const errors = checkConcepts([
      {
        file: 'realisations/pt-PT/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'pt-PT',
        items: [
          { id: 'x-001', concept: 'eye', term: 'olho', translation: 'eye' },
          { id: 'x-002', concept: 'eye', term: 'vista', translation: 'eye' },
        ],
      },
    ]);

    expect(errors.some((line) => line.includes('eye'))).toBe(true);
    expect(errors.some((line) => line.includes('realisations/pt-PT/a1-body-001.yaml'))).toBe(true);
  });

  it('checkPairAlignment flags same-concept items whose glosses differ', () => {
    const errors = checkPairAlignment([
      {
        file: 'realisations/pt-PT/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'pt-PT',
        items: [{ id: 'pt', concept: 'eye', term: 'olho', translation: 'eye' }],
      },
      {
        file: 'realisations/de-DE/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'de-DE',
        items: [{ id: 'de', concept: 'eye', term: 'Bauch', translation: 'belly' }],
      },
    ]);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('A1-BODY-001');
    expect(errors[0]).toContain('eye');
    expect(errors[0]).toContain('pt-PT');
    expect(errors[0]).toContain('de-DE');
  });

  it('checkPairAlignment accepts overlapping alternatives', () => {
    const errors = checkPairAlignment([
      {
        file: 'realisations/en-GB/a1-shop-001.yaml',
        nodeId: 'A1-SHOP-001',
        lang: 'en-GB',
        items: [{ id: 'en', concept: 'till', term: 'till', translation: 'caixa' }],
      },
      {
        file: 'realisations/de-DE/a1-shop-001.yaml',
        nodeId: 'A1-SHOP-001',
        lang: 'de-DE',
        items: [{ id: 'de', concept: 'till', term: 'Kasse', translation: 'till / cash register' }],
      },
    ]);

    expect(errors).toEqual([]);
  });

  it('checkPairAlignment uses term as the gloss for en-GB', () => {
    const errors = checkPairAlignment([
      {
        file: 'realisations/en-GB/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'en-GB',
        items: [{ id: 'en', concept: 'eye', term: 'eye', translation: 'olho' }],
      },
      {
        file: 'realisations/pt-PT/a1-body-001.yaml',
        nodeId: 'A1-BODY-001',
        lang: 'pt-PT',
        items: [{ id: 'pt', concept: 'eye', term: 'olho', translation: 'eye' }],
      },
    ]);

    expect(errors).toEqual([]);
  });

  it('normaliseGloss strips punctuation and infinitive marker', () => {
    expect(normaliseGloss('To pay (for)...')).toEqual(['pay']);
  });

  it('glossOf uses term for en-GB and translation for other languages', () => {
    expect(glossOf('en-GB', { term: 'eye', translation: 'olho' })).toBe('eye');
    expect(glossOf('pt-PT', { term: 'olho', translation: 'eye' })).toBe('eye');
  });
});

describe('checkImageCredits', () => {
  it('passes when every referenced image has a credit row', () => {
    expect(checkImageCredits(['agua.webp', 'pao.webp'], ['agua.webp', 'pao.webp'])).toEqual([]);
  });

  it('flags referenced images with no credit row, once each and sorted', () => {
    expect(checkImageCredits(['casa.webp', 'agua.webp', 'casa.webp'], ['agua.webp'])).toEqual([
      'missing credit row: casa.webp',
    ]);
  });

  it('ignores credit rows that are not referenced', () => {
    expect(checkImageCredits([], ['agua.webp'])).toEqual([]);
  });
});
