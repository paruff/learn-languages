import { describe, it, expect, beforeEach } from 'vitest';
import { recordGradeForCalibration, loadBreakDates, countRecentBreaks } from './calibration';

describe('recordGradeForCalibration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('does not report a break on the first-ever grade for an item', () => {
    const broke = recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 4, '2026-09-21');
    expect(broke).toBe(false);
  });

  it('reports a break when a confident grade (Good/Easy) is followed by a struggling one (Again/Hard)', () => {
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 4, '2026-09-14');
    const broke = recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 1, '2026-09-21');
    expect(broke).toBe(true);
  });

  it('does not report a break when a struggling grade is followed by another struggling grade', () => {
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 2, '2026-09-14');
    const broke = recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 1, '2026-09-21');
    expect(broke).toBe(false);
  });

  it('does not report a break when a confident grade is followed by another confident grade', () => {
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 3, '2026-09-14');
    const broke = recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 4, '2026-09-21');
    expect(broke).toBe(false);
  });

  it('appends broken dates to the break log, readable via loadBreakDates', () => {
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 4, '2026-09-14');
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 1, '2026-09-21');
    expect(loadBreakDates('en-GB', 'pt-PT')).toEqual(['2026-09-21']);
  });

  it('does not log a date when the grade did not break', () => {
    recordGradeForCalibration('en-GB', 'pt-PT', 'forward', 'item-1', 4, '2026-09-21');
    expect(loadBreakDates('en-GB', 'pt-PT')).toEqual([]);
  });
});

describe('countRecentBreaks', () => {
  it('counts dates within the trailing window', () => {
    const now = new Date('2026-09-21T12:00:00Z');
    const dates = ['2026-09-20', '2026-09-15', '2026-09-01'];
    expect(countRecentBreaks(dates, now, 7)).toBe(2);
  });

  it('returns 0 for no break dates', () => {
    expect(countRecentBreaks([], new Date('2026-09-21'), 7)).toBe(0);
  });

  it('includes a date exactly on the cutoff boundary, excludes older', () => {
    const now = new Date('2026-09-21T00:00:00Z');
    expect(countRecentBreaks(['2026-09-14'], now, 7)).toBe(1);
    expect(countRecentBreaks(['2026-09-13'], now, 7)).toBe(0);
  });
});
