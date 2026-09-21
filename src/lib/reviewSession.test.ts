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
