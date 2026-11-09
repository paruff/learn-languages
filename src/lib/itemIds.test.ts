import { describe, it, expect } from 'vitest';
import { checkItemIds } from './itemIds';

describe('checkItemIds (spec C12)', () => {
  const base = { 'pt-1': 'olá', 'pt-2': 'adeus' };

  it('passes when shipped IDs keep their term and new IDs are added', () => {
    expect(checkItemIds(base, { ...base, 'pt-3': 'obrigado' }, new Set())).toEqual([]);
  });

  it('fails when a shipped ID now holds a different term (history would attach to another word)', () => {
    const errors = checkItemIds(base, { 'pt-1': 'oi', 'pt-2': 'adeus' }, new Set());
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('pt-1');
    expect(errors[0]).toContain('olá');
  });

  it('fails when a shipped ID disappears (history would be orphaned)', () => {
    const errors = checkItemIds(base, { 'pt-1': 'olá' }, new Set());
    expect(errors[0]).toContain('pt-2');
  });

  it('accepts an ID listed as an acknowledged exception', () => {
    expect(checkItemIds(base, { 'pt-1': 'olá' }, new Set(['pt-2']))).toEqual([]);
    expect(checkItemIds(base, { 'pt-1': 'oi', 'pt-2': 'adeus' }, new Set(['pt-1']))).toEqual([]);
  });
});
