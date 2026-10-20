import { describe, it, expect } from 'vitest';
import {
  findConceptGaps,
  findMissingNodes,
  findRegressions,
  summariseCoverage,
  type CoverageBaseline,
} from './coverage';

describe('findConceptGaps', () => {
  it('reports concepts the target is missing, per node', () => {
    const expected = new Map([
      ['A1-FOOD-001', ['water', 'bread', 'coffee']],
      ['A1-GREET-001', ['hello']],
    ]);
    const actual = new Map([
      ['A1-FOOD-001', ['water', 'coffee']],
      ['A1-GREET-001', ['hello']],
    ]);

    expect(findConceptGaps(expected, actual)).toEqual([
      { nodeId: 'A1-FOOD-001', missing: ['bread'] },
    ]);
  });

  it('sorts missing concepts and skips nodes the target has not authored', () => {
    const expected = new Map([['A1-FOOD-001', ['water', 'bread', 'apple']]]);
    const actual = new Map([['A1-FOOD-001', ['water']]]);

    expect(findConceptGaps(expected, actual)).toEqual([
      { nodeId: 'A1-FOOD-001', missing: ['apple', 'bread'] },
    ]);
    expect(findConceptGaps(expected, new Map())).toEqual([]);
  });
});

describe('findMissingNodes', () => {
  it('reports expected nodes the language has no file for', () => {
    const expected = ['A1-A', 'A1-B', 'A2-C', 'B1-D'];
    const actual = ['A1-A', 'A2-C'];

    expect(findMissingNodes(expected, actual)).toEqual(['A1-B', 'B1-D']);
  });

  it('can restrict the gate to specific levels', () => {
    expect(findMissingNodes(['A1-A', 'A1-B', 'B1-D'], ['A1-A'], new Set(['A1']))).toEqual(['A1-B']);
  });

  it('deduplicates the expected inventory', () => {
    expect(findMissingNodes(['A1-A', 'A1-A'], [])).toEqual(['A1-A']);
  });
});

describe('summariseCoverage', () => {
  it('counts total missing concepts and nodes', () => {
    const summary = summariseCoverage(
      [
        { nodeId: 'A1-A', missing: ['x', 'y'] },
        { nodeId: 'A1-B', missing: ['z'] },
      ],
      ['A2-C']
    );

    expect(summary).toEqual({ missingConcepts: 3, missingNodes: 1 });
  });
});

describe('findRegressions', () => {
  const baseline: CoverageBaseline = {
    languages: {
      'de-DE': { missingConcepts: 573, missingNodes: 0 },
      'it-IT': { missingConcepts: 0, missingNodes: 10 },
    },
  };

  it('accepts the baseline and improvements', () => {
    expect(
      findRegressions(
        {
          'de-DE': { missingConcepts: 500, missingNodes: 0 },
          'it-IT': { missingConcepts: 0, missingNodes: 10 },
        },
        baseline
      )
    ).toEqual([]);
  });

  it('fails when missing concepts grow', () => {
    expect(
      findRegressions({ 'de-DE': { missingConcepts: 574, missingNodes: 0 } }, baseline)
    ).toEqual(['de-DE: missing concepts grew from 573 to 574']);
  });

  it('fails when missing nodes grow', () => {
    expect(
      findRegressions({ 'it-IT': { missingConcepts: 0, missingNodes: 11 } }, baseline)
    ).toEqual(['it-IT: missing nodes grew from 10 to 11']);
  });

  it('treats an unbaselined language with gaps as a regression', () => {
    expect(findRegressions({ 'es-ES': { missingConcepts: 2, missingNodes: 0 } }, baseline)).toEqual(
      ['es-ES: missing concepts grew from 0 to 2']
    );
  });
});
