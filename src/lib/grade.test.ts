import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyGrade } from './grade';
import { loadState, importProgress, exportProgress } from './storage';
import { loadGradeLog, computeRetention, type GradeEntry } from './gradeLog';

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
    expect(entry).toMatchObject({ q: 3, s: 'sm2', sg: 1, ov: true });
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
    expect(window.localStorage.getItem('schema-version')).toBe('1');
    expect(exportProgress().data['schema-version']).toBe('1');
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
  it('counts only entries of the requested scheduler; entries without an id are sm2', () => {
    const log = [
      e('a', 3, '2026-10-01'),
      e('a', 3, '2026-10-10'),
      e('b', 3, '2026-10-01', 'fsrs'),
      e('b', 1, '2026-10-10', 'fsrs'),
    ];
    expect(computeRetention(log).opportunities).toBe(1);
    expect(computeRetention(log, 'fsrs').opportunities).toBe(1);
    expect(computeRetention(log, 'fsrs').recalled).toBe(0);
  });
});
