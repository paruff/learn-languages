import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyGrade } from './grade';
import { loadState, importProgress, exportProgress } from './storage';
import {
  loadGradeLog,
  computeRetention,
  computeRetentionByScheduler,
  type GradeEntry,
} from './gradeLog';

const grade = (ui: number, extra = {}) =>
  applyGrade({
    sourceLang: 'en-GB',
    targetLang: 'pt-PT',
    direction: 'forward',
    itemId: 'x',
    uiGrade: ui,
    day: '2026-11-01',
    countsTowardSchedule: true,
    ...extra,
  });

describe('applyGrade', () => {
  beforeEach(() => window.localStorage.clear());

  it('S10: re-reads card state, so a grade made in another tab is not overwritten', () => {
    grade(3); // tab A: repetitions 1
    // tab B "opened earlier" holds no copy; it reads storage at grade time
    grade(3);
    expect(loadState('en-GB', 'pt-PT', 'forward', 'x').repetitions).toBe(2);
  });

  it('S9: reports failure when storage refuses the write', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(grade(3).saved).toBe(false);
    vi.restoreAllMocks();
    expect(grade(3).saved).toBe(true);
  });

  it('does not touch the card when the grade does not count toward the schedule', () => {
    grade(3, { countsTowardSchedule: false });
    expect(loadState('en-GB', 'pt-PT', 'forward', 'x').repetitions).toBe(0);
    expect(loadGradeLog('en-GB', 'pt-PT')).toHaveLength(1);
  });

  it('L33: logs scheduler id, suggested grade and override', () => {
    grade(3, { suggestedGrade: 1 });
    const [entry] = loadGradeLog('en-GB', 'pt-PT');
    expect(entry).toMatchObject({ q: 3, s: 'fsrs6', sg: 1, ov: true });
  });

  it('S11: refuses to write over state from a newer schema, and rejects newer backups', () => {
    window.localStorage.setItem('schema-version', '99');
    expect(grade(3).saved).toBe(false);
    expect(window.localStorage.getItem('srs:en-GB:pt-PT:forward:x')).toBeNull();
    const file = JSON.stringify({ app: 'acquira', version: 99, exportedAt: '', data: {} });
    expect(importProgress(file)).toEqual({ ok: false, error: 'newer-version' });
  });

  it('S11: stamps the schema version and exports it', () => {
    grade(3);
    expect(window.localStorage.getItem('schema-version')).toBe('2');
    expect(exportProgress().data['schema-version']).toBe('2');
    expect(exportProgress().version).toBe(2);
  });

  it('L22: schedules with FSRS at the given time and keeps the card valid', () => {
    const now = new Date('2026-11-12T21:00:00');
    grade(3, { now });
    const state = loadState('en-GB', 'pt-PT', 'forward', 'x');
    expect(state).toMatchObject({ interval: 2, repetitions: 1, lapses: 0, stability: 2.3065 });
    expect(new Date(state.dueDate)).toEqual(new Date('2026-11-14T00:00:00'));
    expect(state.lastReviewed).toBe(now.toISOString());
  });
});

describe('computeRetention per scheduler (L33)', () => {
  const e = (item: string, q: number, d: string, s?: string): GradeEntry => ({
    item,
    dir: 'forward',
    q,
    d,
    ...(s ? { s } : {}),
  });
  it('counts a delayed review under the scheduler that chose the gap; no id means sm2', () => {
    const log = [
      e('a', 3, '2026-10-01'),
      e('a', 3, '2026-10-10'),
      e('b', 3, '2026-10-01', 'fsrs6'),
      e('b', 1, '2026-10-10', 'fsrs6'),
    ];
    expect(computeRetention(log, 'sm2')).toEqual({ opportunities: 1, recalled: 1, rate: 1 });
    expect(computeRetention(log, 'fsrs6')).toEqual({ opportunities: 1, recalled: 0, rate: 0 });
    expect(computeRetention(log)).toEqual({ opportunities: 2, recalled: 1, rate: 0.5 });
    expect(computeRetentionByScheduler(log)).toEqual({
      sm2: { opportunities: 1, recalled: 1, rate: 1 },
      fsrs6: { opportunities: 1, recalled: 0, rate: 0 },
    });
  });

  it('M2 across the migration: no delayed review drops out of the metric', () => {
    // SM-2 set a 9-day gap; the review that tests it is the first one logged by FSRS.
    const log = [
      e('a', 3, '2026-10-01'),
      e('a', 3, '2026-10-10', 'fsrs6'),
      e('a', 1, '2026-10-25', 'fsrs6'),
    ];
    expect(computeRetentionByScheduler(log)).toEqual({
      sm2: { opportunities: 1, recalled: 1, rate: 1 },
      fsrs6: { opportunities: 1, recalled: 0, rate: 0 },
    });
    const total = computeRetention(log);
    expect(total.opportunities).toBe(2);
    expect(computeRetentionByScheduler([])).toEqual({});
  });
});
