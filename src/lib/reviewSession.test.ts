import { describe, it, expect } from 'vitest';
import { interleaveByNode } from './reviewSession';

interface Item {
  id: string;
  nodeId: string;
}

describe('interleaveByNode', () => {
  it('round-robins across nodes instead of preserving blocked source order', () => {
    const items: Item[] = [
      { id: 'a1', nodeId: 'A' },
      { id: 'a2', nodeId: 'A' },
      { id: 'a3', nodeId: 'A' },
      { id: 'b1', nodeId: 'B' },
      { id: 'b2', nodeId: 'B' },
    ];

    const result = interleaveByNode(items);

    expect(result.map((i) => i.nodeId)).toEqual(['A', 'B', 'A', 'B', 'A']);
  });

  it('preserves every item — no drops, no duplicates', () => {
    const items: Item[] = [
      { id: 'a1', nodeId: 'A' },
      { id: 'b1', nodeId: 'B' },
      { id: 'c1', nodeId: 'C' },
      { id: 'a2', nodeId: 'A' },
    ];

    const result = interleaveByNode(items);

    expect(result).toHaveLength(4);
    expect(new Set(result.map((i) => i.id))).toEqual(new Set(['a1', 'b1', 'c1', 'a2']));
  });

  it('never places two same-node items adjacently when another node is available', () => {
    const items: Item[] = [
      { id: 'a1', nodeId: 'A' },
      { id: 'a2', nodeId: 'A' },
      { id: 'b1', nodeId: 'B' },
      { id: 'c1', nodeId: 'C' },
    ];

    const result = interleaveByNode(items);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].nodeId).not.toBe(result[i + 1].nodeId);
    }
  });

  it('returns an empty array for no items', () => {
    expect(interleaveByNode([])).toEqual([]);
  });

  it('returns items unchanged when everything shares one node', () => {
    const items: Item[] = [
      { id: 'a1', nodeId: 'A' },
      { id: 'a2', nodeId: 'A' },
    ];
    expect(interleaveByNode(items)).toEqual(items);
  });
});

import {
  selectDue,
  DAILY_NEW_CAP,
  SESSION_SIZE,
  NEW_ITEM_COST,
  RELEARN_CRITERION,
  nextRemaining,
} from './reviewSession';

describe('selectDue (J2: practise only what you have studied)', () => {
  const mk = (n: number, nodeId: string) =>
    Array.from({ length: n }, (_, i) => ({ id: `${nodeId}-${i}`, nodeId }));
  const base = { isNew: () => true, isDue: () => true, introducedToday: 0, cap: DAILY_NEW_CAP };

  it('returns nothing when no lesson has been studied', () => {
    expect(selectDue([...mk(5, 'A'), ...mk(5, 'B')], { ...base, studied: new Set() })).toEqual([]);
  });

  it('only draws from studied lessons', () => {
    const out = selectDue([...mk(3, 'A'), ...mk(3, 'B')], { ...base, studied: new Set(['A']) });
    expect(out).toHaveLength(3);
    expect(out.every((i) => i.nodeId === 'A')).toBe(true);
  });

  it('caps never-seen words per day, counting those already introduced today', () => {
    const items = mk(30, 'A');
    const studied = new Set(['A']);
    // 10 allowed today, but each new word costs NEW_ITEM_COST of SESSION_SIZE (L23).
    expect(selectDue(items, { ...base, studied })).toHaveLength(
      Math.floor(SESSION_SIZE / NEW_ITEM_COST)
    );
    expect(selectDue(items, { ...base, studied, introducedToday: 7 })).toHaveLength(3);
    expect(selectDue(items, { ...base, studied, introducedToday: 10 })).toHaveLength(0);
  });

  it('does not cap words that have been seen before', () => {
    const items = mk(12, 'A');
    const out = selectDue(items, { ...base, studied: new Set(['A']), isNew: () => false });
    expect(out).toHaveLength(12);
  });

  it('a lesson scope practises just that lesson, uncapped', () => {
    const items = [...mk(12, 'A'), ...mk(3, 'B')];
    const out = selectDue(items, {
      ...base,
      studied: new Set(['B']),
      scope: 'A',
      isNew: () => false,
    });
    expect(out).toHaveLength(12);
    expect(out.every((i) => i.nodeId === 'A')).toBe(true);
  });
});

describe('successive relearning (L23)', () => {
  it('stays outstanding on a miss and clears on a correct recall', () => {
    expect(nextRemaining(RELEARN_CRITERION, false)).toBe(RELEARN_CRITERION);
    expect(nextRemaining(RELEARN_CRITERION, true)).toBe(0);
    expect(nextRemaining(0, true)).toBe(0);
  });

  it('introduces fewer new words so relearning fits in SESSION_SIZE', () => {
    const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, nodeId: 'A' }));
    const out = selectDue(items, {
      studied: new Set(['A']),
      isNew: () => true,
      isDue: () => true,
      introducedToday: 0,
      cap: 30,
    });
    expect(out).toHaveLength(Math.floor(SESSION_SIZE / NEW_ITEM_COST));
  });

  it('fills the remaining slots with reviews of seen words', () => {
    const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, nodeId: 'A', fresh: i < 4 }));
    const out = selectDue(items, {
      studied: new Set(['A']),
      isNew: (i) => i.fresh,
      isDue: () => true,
      introducedToday: 0,
      cap: 10,
    });
    expect(out.filter((i) => i.fresh)).toHaveLength(4);
    expect(out).toHaveLength(SESSION_SIZE - 4 * (NEW_ITEM_COST - 1));
  });
});
