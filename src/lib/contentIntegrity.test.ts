import { describe, it, expect } from 'vitest';
import { checkRealisationReferences, checkVocabularyParity } from './contentIntegrity';

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
