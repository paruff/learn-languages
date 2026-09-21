import { describe, it, expect } from 'vitest';
import { computeCefrProgress, computeOverallMastery, type TrackedItem } from './progress';

const items: TrackedItem[] = [
  { itemId: 'a1', nodeId: 'A1-GREET-001', cefrLevel: 'A1', canDo: 'Can greet', repetitions: 2 },
  { itemId: 'a2', nodeId: 'A1-GREET-001', cefrLevel: 'A1', canDo: 'Can greet', repetitions: 0 },
  { itemId: 'b1', nodeId: 'A2-FOOD-001', cefrLevel: 'A2', canDo: 'Can order food', repetitions: 3 },
];

describe('computeCefrProgress', () => {
  it('aggregates mastery percentage per CEFR level', () => {
    const { levels } = computeCefrProgress(items);

    expect(levels).toEqual([
      { cefrLevel: 'A1', totalItems: 2, masteredItems: 1, percent: 50 },
      { cefrLevel: 'A2', totalItems: 1, masteredItems: 1, percent: 100 },
    ]);
  });

  it('recommends the first unmastered node in level order', () => {
    const { nextRecommended } = computeCefrProgress(items);
    expect(nextRecommended).toEqual({
      nodeId: 'A1-GREET-001',
      cefrLevel: 'A1',
      canDo: 'Can greet',
    });
  });

  it('returns no recommendation once everything is mastered', () => {
    const mastered = items.map((i) => ({ ...i, repetitions: 2 }));
    const { nextRecommended } = computeCefrProgress(mastered);
    expect(nextRecommended).toBeNull();
  });

  it('returns an empty level list for no items', () => {
    expect(computeCefrProgress([])).toEqual({ levels: [], nextRecommended: null });
  });
});

describe('computeOverallMastery', () => {
  it('counts items at or above the mastery threshold across all levels', () => {
    expect(
      computeOverallMastery([{ repetitions: 2 }, { repetitions: 0 }, { repetitions: 3 }])
    ).toEqual({
      masteredItems: 2,
      totalItems: 3,
      percent: 67,
    });
  });

  it('returns 0 percent for an empty item list, not NaN', () => {
    expect(computeOverallMastery([])).toEqual({ masteredItems: 0, totalItems: 0, percent: 0 });
  });

  it('returns 100 percent when every item is mastered', () => {
    expect(computeOverallMastery([{ repetitions: 2 }, { repetitions: 5 }])).toEqual({
      masteredItems: 2,
      totalItems: 2,
      percent: 100,
    });
  });
});
