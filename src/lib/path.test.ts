import { describe, it, expect, beforeEach } from 'vitest';
import { A1_ORDER, orderLessons, nextIndex, recommendNext } from './path';

describe('learning path (J1)', () => {
  beforeEach(() => window.localStorage.clear());

  it('orders A1 by teaching order, unknowns last', () => {
    const out = orderLessons([
      { nodeId: 'A1-BODY-001' },
      { nodeId: 'A1-ZZZ-001' },
      { nodeId: 'A1-GREET-001' },
    ]);
    expect(out.map((l) => l.nodeId)).toEqual(['A1-GREET-001', 'A1-BODY-001', 'A1-ZZZ-001']);
  });

  it('has no duplicate ids', () => {
    expect(new Set(A1_ORDER).size).toBe(A1_ORDER.length);
  });

  it('nextIndex is the first unstudied lesson, -1 when done', () => {
    expect(nextIndex(['a', 'b', 'c'], new Set())).toBe(0);
    expect(nextIndex(['a', 'b', 'c'], new Set(['a']))).toBe(1);
    expect(nextIndex(['a', 'b'], new Set(['a', 'b']))).toBe(-1);
  });

  it('recommendNext surfaces the first unstudied prerequisite, never locks', () => {
    const l = [
      { nodeId: 'c', prerequisiteNodes: ['a'] },
      { nodeId: 'a', prerequisiteNodes: [] },
      { nodeId: 'b', prerequisiteNodes: ['c'] },
    ];
    expect(recommendNext(l, new Set())).toBe(1); // c wants a
    expect(recommendNext(l, new Set(['a']))).toBe(0);
    expect(recommendNext(l, new Set(['a', 'c']))).toBe(2);
    expect(recommendNext(l, new Set(['a', 'b', 'c']))).toBe(-1);
    expect(recommendNext([{ nodeId: 'x', prerequisiteNodes: ['x', 'gone'] }], new Set())).toBe(0);
  });
});
