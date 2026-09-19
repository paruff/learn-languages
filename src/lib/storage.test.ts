import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState } from './storage';
import { createInitialState } from '../utils/srs';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns a fresh initial state when nothing is stored yet', () => {
    const state = loadState('en-GB', 'pt-PT', 'forward', 'pt-PT-A1-GREET-001-001');
    expect(state.repetitions).toBe(0);
    expect(state.interval).toBe(0);
  });

  it('persists and reloads state for the same key', () => {
    const saved = { ...createInitialState(), interval: 6, repetitions: 2, easeFactor: 2.6 };
    saveState('en-GB', 'pt-PT', 'forward', 'pt-PT-A1-GREET-001-001', saved);

    const loaded = loadState('en-GB', 'pt-PT', 'forward', 'pt-PT-A1-GREET-001-001');
    expect(loaded).toEqual(saved);
  });

  it('scopes state separately per language pair + direction (spec I4)', () => {
    const forward = { ...createInitialState(), interval: 10 };
    const reverse = { ...createInitialState(), interval: 1 };

    saveState('en-GB', 'pt-PT', 'forward', 'item-1', forward);
    saveState('en-GB', 'pt-PT', 'reverse', 'item-1', reverse);

    expect(loadState('en-GB', 'pt-PT', 'forward', 'item-1').interval).toBe(10);
    expect(loadState('en-GB', 'pt-PT', 'reverse', 'item-1').interval).toBe(1);
  });
});
