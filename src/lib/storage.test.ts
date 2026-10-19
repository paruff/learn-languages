import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadState,
  saveState,
  loadDirectionPreference,
  saveDirectionPreference,
  loadRecallModePreference,
  saveRecallModePreference,
  readJson,
  exportProgress,
  importProgress,
} from './storage';
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

  it('defaults direction preference to forward when nothing is stored', () => {
    expect(loadDirectionPreference('en-GB', 'pt-PT')).toBe('forward');
  });

  it('persists and reloads the chosen review direction', () => {
    saveDirectionPreference('en-GB', 'pt-PT', 'reverse');
    expect(loadDirectionPreference('en-GB', 'pt-PT')).toBe('reverse');
  });

  it('defaults recall mode to reveal when nothing is stored', () => {
    expect(loadRecallModePreference('en-GB', 'pt-PT')).toBe('reveal');
  });

  it('persists and reloads the chosen recall mode', () => {
    saveRecallModePreference('en-GB', 'pt-PT', 'type');
    expect(loadRecallModePreference('en-GB', 'pt-PT')).toBe('type');

    saveRecallModePreference('en-GB', 'pt-PT', 'picture');
    expect(loadRecallModePreference('en-GB', 'pt-PT')).toBe('picture');
  });
});

describe('storage resilience (spec S7)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('falls back to a fresh state when the stored value is corrupt JSON', () => {
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:x', '{not json');
    expect(loadState('en-GB', 'pt-PT', 'forward', 'x').repetitions).toBe(0);
  });

  it('falls back to a fresh state when the stored value has the wrong shape', () => {
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:x', '{"interval":"soon"}');
    expect(loadState('en-GB', 'pt-PT', 'forward', 'x')).toEqual(
      expect.objectContaining({ repetitions: 0, interval: 0 })
    );
  });

  it('falls back to defaults when storage access throws (site data blocked)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(loadState('en-GB', 'pt-PT', 'forward', 'x').repetitions).toBe(0);
    expect(loadDirectionPreference('en-GB', 'pt-PT')).toBe('forward');
  });

  it('does not throw when a write fails (quota exceeded)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(() => saveState('en-GB', 'pt-PT', 'forward', 'x', createInitialState())).not.toThrow();
  });

  it('readJson returns null for corrupt values instead of throwing', () => {
    window.localStorage.setItem('k', '[oops');
    expect(readJson('k')).toBeNull();
  });
});

describe('progress export/import (spec S5)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('exports only Acquira keys, not other apps on the same origin', () => {
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:x', '{"interval":1}');
    window.localStorage.setItem('pairPreference', '{"sourceLang":"en-GB","targetLang":"pt-PT"}');
    window.localStorage.setItem('some-other-app', 'secret');
    const exported = exportProgress();
    expect(Object.keys(exported.data).sort()).toEqual([
      'pairPreference',
      'srs:en-GB:pt-PT:forward:x',
    ]);
    expect(exported.app).toBe('acquira');
  });

  it('round-trips through import', () => {
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:x', '{"interval":6}');
    const json = JSON.stringify(exportProgress());
    window.localStorage.clear();
    expect(importProgress(json)).toEqual({ ok: true, count: 1 });
    expect(window.localStorage.getItem('srs:en-GB:pt-PT:forward:x')).toBe('{"interval":6}');
  });

  it('rejects files that are not an Acquira export', () => {
    expect(importProgress('not json').ok).toBe(false);
    expect(importProgress('{"app":"other","data":{}}').ok).toBe(false);
    expect(importProgress('{"app":"acquira","data":{"srs:x":5}}').ok).toBe(false);
  });

  it('skips unknown keys in an otherwise valid file', () => {
    const file = JSON.stringify({
      app: 'acquira',
      version: 1,
      data: { 'srs:en-GB:pt-PT:forward:x': '{}', evil: 'x' },
    });
    expect(importProgress(file)).toEqual({ ok: true, count: 1 });
    expect(window.localStorage.getItem('evil')).toBeNull();
  });
});
