import { describe, it, expect, beforeEach } from 'vitest';
import {
  CHECKPOINT_MIN_DAYS,
  CHECKPOINT_SIZE,
  checkpointNodes,
  pickUnseen,
  markStudiedAt,
  loadStudiedAt,
  saveCheckpoint,
  loadCheckpoint,
} from './checkpoint';

const item = (nodeId: string, n: number) => ({ nodeId, id: `${nodeId}-${n}` });

describe('checkpoint', () => {
  beforeEach(() => window.localStorage.clear());

  it('offers only lessons studied at least 7 days ago and not yet checked', () => {
    const studiedAt = { a: '2026-10-16', b: '2026-10-17', c: '2026-10-01' };
    expect(CHECKPOINT_MIN_DAYS).toBe(7);
    expect(checkpointNodes(studiedAt, '2026-10-23', new Set(['c']))).toEqual(['a']);
  });

  it('picks only never-graded items from the node, capped', () => {
    const items = Array.from({ length: 9 }, (_, n) => item('a', n)).concat(item('b', 0));
    const seen = new Set(['a-0', 'a-1']);
    const picked = pickUnseen(items, 'a', (i) => seen.has(i.id));
    expect(picked).toHaveLength(CHECKPOINT_SIZE);
    expect(picked.every((i) => i.nodeId === 'a' && !seen.has(i.id))).toBe(true);
  });

  it('records the first study date only', () => {
    markStudiedAt('en-GB', 'pt-PT', 'a', '2026-10-01');
    markStudiedAt('en-GB', 'pt-PT', 'a', '2026-10-20');
    expect(loadStudiedAt('en-GB', 'pt-PT')).toEqual({ a: '2026-10-01' });
  });

  it('round-trips a checkpoint result', () => {
    const r = { date: '2026-10-23', correct: 3, total: 5, canDo: true };
    saveCheckpoint('en-GB', 'pt-PT', 'a', r);
    expect(loadCheckpoint('en-GB', 'pt-PT', 'a')).toEqual(r);
    expect(loadCheckpoint('en-GB', 'pt-PT', 'zzz')).toBeNull();
  });
});
