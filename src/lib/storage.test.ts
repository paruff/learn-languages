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
  requestPersistence,
  shouldShowPersistHint,
  dismissPersistHint,
  loadStudied,
  markStudied,
} from './storage';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

describe('persistent storage (spec S8)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  function stubStorage(persist: () => Promise<boolean>) {
    const spy = vi.fn(persist);
    vi.stubGlobal('navigator', { storage: { persist: spy } });
    return spy;
  }

  it('requests persistence once, however many cards are graded', async () => {
    const persist = stubStorage(async () => true);
    await requestPersistence();
    await requestPersistence();
    expect(persist).toHaveBeenCalledTimes(1);
    expect(shouldShowPersistHint()).toBe(false);
  });

  it('shows the hint when the browser refuses, until dismissed', async () => {
    stubStorage(async () => false);
    expect(shouldShowPersistHint()).toBe(false); // not asked yet
    await requestPersistence();
    expect(shouldShowPersistHint()).toBe(true);
    dismissPersistHint();
    expect(shouldShowPersistHint()).toBe(false);
  });

  it('treats a missing or throwing API as refused, without throwing', async () => {
    vi.stubGlobal('navigator', {});
    await expect(requestPersistence()).resolves.toBe(false);
    expect(shouldShowPersistHint()).toBe(true);

    window.localStorage.clear();
    stubStorage(async () => {
      throw new Error('nope');
    });
    await expect(requestPersistence()).resolves.toBe(false);
  });

  it('markStudied persists per pair and ignores corrupt data', () => {
    markStudied('en-GB', 'pt-PT', 'A1-GREET-001');
    markStudied('en-GB', 'pt-PT', 'A1-GREET-001');
    expect([...loadStudied('en-GB', 'pt-PT')]).toEqual(['A1-GREET-001']);
    expect(loadStudied('en-GB', 'es-ES').size).toBe(0);
    window.localStorage.setItem('studied:en-GB:pt-PT', '{oops');
    expect(loadStudied('en-GB', 'pt-PT').size).toBe(0);
  });

  it('keeps the newer card state when a backup is older than what is on the device', () => {
    const key = 'srs:en-GB:pt-PT:forward:x';
    const state = (lastReviewed: string, interval: number): string =>
      JSON.stringify({ interval, easeFactor: 2.5, repetitions: 2, dueDate: 'd', lastReviewed });
    window.localStorage.setItem(key, state('2026-11-01T10:00:00.000Z', 6));
    const old = JSON.stringify({
      app: 'acquira',
      version: 1,
      data: { [key]: state('2026-10-01T10:00:00.000Z', 1) },
    });
    expect(importProgress(old)).toEqual({ ok: true, count: 1 });
    expect(JSON.parse(window.localStorage.getItem(key)!).interval).toBe(6);

    const newer = JSON.stringify({
      app: 'acquira',
      version: 1,
      data: { [key]: state('2026-11-05T10:00:00.000Z', 15) },
    });
    importProgress(newer);
    expect(JSON.parse(window.localStorage.getItem(key)!).interval).toBe(15);
  });

  it('merges the grade log instead of replacing it', () => {
    const key = 'grade-log:en-GB:pt-PT';
    const a = { item: 'a', dir: 'forward', q: 3, d: '2026-11-01' };
    const b = { item: 'b', dir: 'forward', q: 1, d: '2026-11-02' };
    window.localStorage.setItem(key, JSON.stringify([a]));
    importProgress(
      JSON.stringify({ app: 'acquira', version: 1, data: { [key]: JSON.stringify([b]) } })
    );
    expect(JSON.parse(window.localStorage.getItem(key)!)).toEqual([a, b]);
  });

  it('backs up every storage key the app writes', () => {
    // A key family written in src/ but missing from the export allowlist is silently
    // dropped from backups (it happened to next-session:).
    const files: string[] = [];
    const walk = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) walk(path);
        else if (/\.(ts|astro)$/.test(name) && !name.endsWith('.test.ts')) files.push(path);
      }
    };
    walk(join(import.meta.dirname, '..'));
    const families = new Set<string>();
    for (const f of files) {
      for (const m of readFileSync(f, 'utf8').matchAll(/`([a-z][a-z-]*):\$\{/g)) {
        families.add(m[1]);
      }
    }
    expect(families.size).toBeGreaterThan(8);
    for (const family of families) {
      window.localStorage.setItem(`${family}:x`, '1');
      expect(Object.keys(exportProgress().data), family).toContain(`${family}:x`);
      window.localStorage.clear();
    }
  });
});
