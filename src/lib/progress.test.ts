import { describe, it, expect } from 'vitest';
import {
  computeCefrProgress,
  computeOverallMastery,
  computeNodeProgress,
  type TrackedItem,
} from './progress';

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

  it('recommends an unmastered prerequisite first (L12)', () => {
    const its: TrackedItem[] = [
      { itemId: 'x', nodeId: 'A1-B', cefrLevel: 'A1', canDo: 'B', repetitions: 0 },
      { itemId: 'y', nodeId: 'A1-A', cefrLevel: 'A1', canDo: 'A', repetitions: 0 },
    ];
    const pre = { 'A1-B': ['A1-A', 'A1-GONE'] };
    expect(computeCefrProgress(its, pre).nextRecommended?.nodeId).toBe('A1-A');
    its[1].repetitions = 2;
    expect(computeCefrProgress(its, pre).nextRecommended?.nodeId).toBe('A1-B');
    expect(computeCefrProgress(its, { 'A1-B': ['A1-B'] }).nextRecommended?.nodeId).toBe('A1-B');
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

describe('computeNodeProgress', () => {
  it('aggregates mastery per lesson (nodeId), independent of cefrLevel grouping', () => {
    const progress = computeNodeProgress(items);
    expect(progress.get('A1-GREET-001')).toEqual({
      nodeId: 'A1-GREET-001',
      totalItems: 2,
      masteredItems: 1,
      percent: 50,
    });
    expect(progress.get('A2-FOOD-001')).toEqual({
      nodeId: 'A2-FOOD-001',
      totalItems: 1,
      masteredItems: 1,
      percent: 100,
    });
  });

  it('returns an empty map for no items', () => {
    expect(computeNodeProgress([]).size).toBe(0);
  });

  it('agrees with computeCefrProgress on what counts as mastered (same threshold)', () => {
    const { levels } = computeCefrProgress(items);
    const nodeProgress = computeNodeProgress(items);
    const a1Total = [...nodeProgress.values()]
      .filter((p) => items.find((i) => i.nodeId === p.nodeId)?.cefrLevel === 'A1')
      .reduce((sum, p) => sum + p.masteredItems, 0);
    expect(a1Total).toBe(levels.find((l) => l.cefrLevel === 'A1')?.masteredItems);
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

describe('computeCanDoChecklist', () => {
  const item = (itemId: string, nodeId: string, cefrLevel: string, repetitions: number) => ({
    itemId,
    nodeId,
    cefrLevel,
    canDo: `Can do ${nodeId}`,
    repetitions,
  });
  it('lists Can-Dos per level in id order with studied/practised/remembered flags', async () => {
    const { computeCanDoChecklist } = await import('./progress');
    const items = [
      item('x1', 'A1-B-002', 'A1', 0),
      item('x2', 'A1-A-001', 'A1', 1),
      item('x3', 'A2-A-001', 'A2', 0),
    ];
    const levels = computeCanDoChecklist(items, new Set(['A1-A-001']), new Set(['x2']));
    expect(levels.map((l) => l.cefrLevel)).toEqual(['A1', 'A2']);
    expect(levels[0].canDos).toEqual([
      {
        nodeId: 'A1-A-001',
        canDo: 'Can do A1-A-001',
        studied: true,
        practised: true,
        remembered: true,
      },
      {
        nodeId: 'A1-B-002',
        canDo: 'Can do A1-B-002',
        studied: false,
        practised: false,
        remembered: false,
      },
    ]);
    expect(levels[0].current).toBe(true);
    expect(levels[1].current).toBe(false);
  });
});
