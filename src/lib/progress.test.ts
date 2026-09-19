import { describe, it, expect } from 'vitest';
import { computeCefrProgress, type TrackedItem } from './progress';

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
