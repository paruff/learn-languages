import { describe, it, expect } from 'vitest';
import { checkRealisationReferences } from './contentIntegrity';

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
