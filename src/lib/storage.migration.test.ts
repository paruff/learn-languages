import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import {
  SCHEMA_VERSION,
  exportProgress,
  importProgress,
  loadState,
  migrateStorage,
  type ReviewDirection,
} from './storage';
import { applyGrade } from './grade';
import { loadGradeLog } from './gradeLog';
import { isDue, parseStoredState, type SRSState } from '../utils/srs';

/*
 * The SM-2 → FSRS storage migration (spec L22, S11), stated as properties over
 * arbitrary localStorage contents: whatever a learner has stored, migrating it
 * loses no review, no card and no key.
 */

const iso = fc
  .integer({ min: Date.UTC(2025, 0, 1), max: Date.UTC(2028, 0, 1) })
  .map((ms) => new Date(ms).toISOString());

const sm2Card = fc.record(
  {
    interval: fc.integer({ min: 1, max: 400 }),
    easeFactor: fc.integer({ min: 130, max: 350 }).map((n) => n / 100),
    repetitions: fc.integer({ min: 0, max: 12 }),
    dueDate: iso,
    lastReviewed: iso,
  },
  { requiredKeys: ['interval', 'easeFactor', 'repetitions', 'dueDate'] }
);

const itemId = fc.stringMatching(/^[a-z]{2}-[A-Z]{2}-[a-z]{3,8}-\d{3}$/);
const direction = fc.constantFrom<ReviewDirection>('forward', 'reverse');
const cardKey = fc.tuple(direction, itemId).map(([d, id]) => `srs:en-GB:pt-PT:${d}:${id}`);

const gradeEntry = fc.record(
  {
    item: itemId,
    dir: direction,
    q: fc.constantFrom(1, 2, 3, 4),
    d: iso.map((s) => s.slice(0, 10)),
    sg: fc.constantFrom(1, 3),
    tr: fc.boolean(),
  },
  { requiredKeys: ['item', 'dir', 'q', 'd'] }
);

/** What a version-1 (SM-2) learner can have in localStorage, plus things that are not ours. */
const v1Storage = fc
  .record({
    cards: fc.dictionary(
      cardKey,
      sm2Card.map((c) => JSON.stringify(c)),
      { maxKeys: 25 }
    ),
    corruptCards: fc.dictionary(
      cardKey,
      fc.constantFrom('{oops', '', 'null', '[]', '{"interval":1}'),
      {
        maxKeys: 3,
      }
    ),
    log: fc.array(gradeEntry, { maxLength: 40 }),
    stamped: fc.boolean(),
    foreign: fc.dictionary(
      fc.stringMatching(/^other-app:[a-z]{1,8}$/),
      fc.string({ maxLength: 20 }),
      { maxKeys: 3 }
    ),
  })
  .map(({ cards, corruptCards, log, stamped, foreign }): Record<string, string> => ({
    ...foreign,
    ...corruptCards,
    ...cards,
    'grade-log:en-GB:pt-PT': JSON.stringify(log),
    'srs-direction:en-GB:pt-PT': 'reverse',
    'studied:en-GB:pt-PT': '["A1-GREET-001"]',
    ...(stamped ? { 'schema-version': '1' } : {}),
  }));

function fill(data: Record<string, string>): void {
  window.localStorage.clear();
  for (const [k, v] of Object.entries(data)) window.localStorage.setItem(k, v);
}

function snapshot(): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)!;
    out[k] = window.localStorage.getItem(k)!;
  }
  return out;
}

const withoutDue = (s: SRSState): SRSState => ({ ...s, dueDate: '' });
const isCardKey = (k: string): boolean => k.startsWith('srs:');
const parseKey = (k: string): [string, string, ReviewDirection, string] => {
  const [, s, t, d, ...id] = k.split(':');
  return [s, t, d as ReviewDirection, id.join(':')];
};
const tryParse = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

describe('migrateStorage (SM-2 → FSRS, spec L22/S11)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('keeps every key, changes nothing but SM-2 cards, and only adds fields to those', () => {
    fc.assert(
      fc.property(v1Storage, (before) => {
        fill(before);
        const result = migrateStorage();
        const after = snapshot();

        expect(Object.keys(after).sort()).toEqual(
          [...new Set([...Object.keys(before), 'schema-version'])].sort()
        );
        expect(after['schema-version']).toBe(String(SCHEMA_VERSION));

        let cards = 0;
        for (const [key, raw] of Object.entries(before)) {
          if (key === 'schema-version') continue;
          const old = tryParse(raw);
          if (!isCardKey(key) || parseStoredState(old) === null) {
            // Not ours, not a card, or unreadable: byte-for-byte untouched.
            expect(after[key], key).toBe(raw);
            continue;
          }
          cards += 1;
          const migrated = JSON.parse(after[key]) as Record<string, unknown>;
          expect(migrated, key).toMatchObject(old as object);
          expect(migrated.stability).toBeGreaterThan(0);
          expect(migrated.difficulty).toBeGreaterThanOrEqual(1);
        }
        expect(result).toEqual({ migrated: cards, failed: 0 });
      })
    );
  });

  it('loses no review: the grade log is byte-identical and every entry still loads', () => {
    fc.assert(
      fc.property(v1Storage, (before) => {
        fill(before);
        const entries = loadGradeLog('en-GB', 'pt-PT');
        migrateStorage();
        expect(window.localStorage.getItem('grade-log:en-GB:pt-PT')).toBe(
          before['grade-log:en-GB:pt-PT']
        );
        expect(loadGradeLog('en-GB', 'pt-PT')).toEqual(entries);
      })
    );
  });

  it('gives each card the state it already had on read, with the same due date', () => {
    fc.assert(
      fc.property(v1Storage, iso, (before, nowIso) => {
        fill(before);
        const now = new Date(nowIso);
        const cards = Object.keys(before).filter(isCardKey);
        const onRead = cards.map((k) => loadState(...parseKey(k)));
        migrateStorage();
        cards.forEach((k, i) => {
          const state = loadState(...parseKey(k));
          // Unreadable cards fall back to a fresh state stamped "now"; compare the rest.
          expect(withoutDue(state)).toEqual(withoutDue(onRead[i]));
          const old = parseStoredState(tryParse(before[k]));
          if (old !== null) {
            expect(state.dueDate).toBe(old.dueDate);
            expect(isDue(state, now)).toBe(isDue(old, now));
          }
        });
      })
    );
  });

  it('is idempotent', () => {
    fc.assert(
      fc.property(v1Storage, (before) => {
        fill(before);
        migrateStorage();
        const once = snapshot();
        expect(migrateStorage()).toEqual({ migrated: 0, failed: 0 });
        expect(snapshot()).toEqual(once);
      })
    );
  });

  it('never touches storage written by a newer app version', () => {
    fc.assert(
      fc.property(v1Storage, (before) => {
        fill({ ...before, 'schema-version': String(SCHEMA_VERSION + 1) });
        const untouched = snapshot();
        expect(migrateStorage()).toEqual({ migrated: 0, failed: 0 });
        expect(snapshot()).toEqual(untouched);
      })
    );
  });

  it('loses nothing when storage is full: old values stay and still load as FSRS', () => {
    fc.assert(
      fc.property(v1Storage, (before) => {
        fill(before);
        const cards = Object.keys(before).filter(isCardKey);
        const onRead = cards.map((k) => loadState(...parseKey(k)));
        const spy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
          throw new DOMException('full', 'QuotaExceededError');
        });
        const result = migrateStorage();
        spy.mockRestore();
        expect(result.migrated).toBe(0);
        expect(snapshot()).toEqual(before);
        cards.forEach((k, i) => {
          expect(withoutDue(loadState(...parseKey(k)))).toEqual(withoutDue(onRead[i]));
        });
      })
    );
  });

  it('survives storage that cannot be read at all', () => {
    vi.spyOn(window.localStorage, 'key').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:x', '{}');
    expect(() => migrateStorage()).not.toThrow();
  });
});

describe('migration is triggered by the app, not by hand', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  const old = (interval: number, lastReviewed: string): string =>
    JSON.stringify({
      interval,
      easeFactor: 2.5,
      repetitions: 3,
      dueDate: '2026-11-20T00:00:00.000Z',
      lastReviewed,
    });

  it('the first grade after the upgrade migrates every card and stamps the new version', () => {
    window.localStorage.setItem('schema-version', '1');
    window.localStorage.setItem('srs:en-GB:pt-PT:forward:a', old(15, '2026-11-05T10:00:00.000Z'));
    window.localStorage.setItem('srs:en-GB:pt-PT:reverse:b', old(38, '2026-11-01T10:00:00.000Z'));
    const log = JSON.stringify([{ item: 'a', dir: 'forward', q: 3, d: '2026-11-05' }]);
    window.localStorage.setItem('grade-log:en-GB:pt-PT', log);

    applyGrade({
      sourceLang: 'en-GB',
      targetLang: 'pt-PT',
      direction: 'forward',
      itemId: 'c',
      uiGrade: 3,
      day: '2026-11-12',
      countsTowardSchedule: true,
    });

    expect(window.localStorage.getItem('schema-version')).toBe('2');
    const b = JSON.parse(window.localStorage.getItem('srs:en-GB:pt-PT:reverse:b')!);
    expect(b).toMatchObject({ interval: 38, easeFactor: 2.5, repetitions: 3, stability: 38 });
    // The old review is still there, and still counted under SM-2; the new one is FSRS.
    expect(loadGradeLog('en-GB', 'pt-PT').map((e) => e.s ?? 'sm2')).toEqual(['sm2', 'fsrs6']);
  });

  it('restoring a version-1 backup migrates it and never lowers the stored version (RK7a)', () => {
    const backup = JSON.stringify({
      app: 'acquira',
      version: 1,
      exportedAt: '',
      data: {
        'schema-version': '1',
        'srs:en-GB:pt-PT:forward:a': old(15, '2026-11-05T10:00:00.000Z'),
      },
    });
    window.localStorage.setItem('schema-version', '2');
    expect(importProgress(backup).ok).toBe(true);
    expect(window.localStorage.getItem('schema-version')).toBe('2');
    expect(JSON.parse(window.localStorage.getItem('srs:en-GB:pt-PT:forward:a')!)).toMatchObject({
      interval: 15,
      easeFactor: 2.5,
      stability: 15,
    });
    expect(exportProgress().version).toBe(2);
  });

  it('an older backup does not roll back a card reviewed since, whatever scheduler wrote it', () => {
    const key = 'srs:en-GB:pt-PT:forward:a';
    window.localStorage.setItem(key, old(15, '2026-10-01T10:00:00.000Z'));
    migrateStorage();
    applyGrade({
      sourceLang: 'en-GB',
      targetLang: 'pt-PT',
      direction: 'forward',
      itemId: 'a',
      uiGrade: 3,
      day: '2026-11-12',
      countsTowardSchedule: true,
    });
    const current = window.localStorage.getItem(key);
    importProgress(
      JSON.stringify({
        app: 'acquira',
        version: 1,
        data: { [key]: old(6, '2026-09-01T10:00:00.000Z') },
      })
    );
    expect(window.localStorage.getItem(key)).toBe(current);
  });

  it('refuses to restore a backup over storage from a newer app version', () => {
    window.localStorage.setItem('schema-version', '99');
    const backup = JSON.stringify({ app: 'acquira', version: 1, data: { 'tts-network': '1' } });
    expect(importProgress(backup)).toEqual({ ok: false, error: 'newer-version' });
    expect(window.localStorage.getItem('tts-network')).toBeNull();
  });
});
