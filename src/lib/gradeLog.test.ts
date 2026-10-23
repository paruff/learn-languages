import { describe, it, expect, beforeEach } from 'vitest';
import {
  appendGrade,
  loadGradeLog,
  computeRetention,
  computeReturn,
  summariseLog,
  MAX_LOG_ENTRIES,
  type GradeEntry,
} from './gradeLog';

const e = (item: string, q: number, d: string): GradeEntry => ({ item, dir: 'forward', q, d });

describe('gradeLog storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('appends and reloads entries per pair', () => {
    appendGrade('en-GB', 'pt-PT', e('a', 3, '2026-10-01'));
    appendGrade('en-GB', 'pt-PT', e('b', 1, '2026-10-02'));
    expect(loadGradeLog('en-GB', 'pt-PT')).toHaveLength(2);
    expect(loadGradeLog('en-GB', 'es-ES')).toEqual([]);
  });

  it('keeps only the most recent entries', () => {
    const full = Array.from({ length: MAX_LOG_ENTRIES }, (_, i) => e(`i${i}`, 3, '2026-10-01'));
    window.localStorage.setItem('grade-log:en-GB:pt-PT', JSON.stringify(full));
    appendGrade('en-GB', 'pt-PT', e('newest', 3, '2026-10-02'));
    const log = loadGradeLog('en-GB', 'pt-PT');
    expect(log).toHaveLength(MAX_LOG_ENTRIES);
    expect(log[0].item).toBe('i1');
    expect(log[log.length - 1].item).toBe('newest');
  });

  it('survives corrupt or malformed stored data (spec S7)', () => {
    window.localStorage.setItem('grade-log:en-GB:pt-PT', '{oops');
    expect(loadGradeLog('en-GB', 'pt-PT')).toEqual([]);
    window.localStorage.setItem(
      'grade-log:en-GB:pt-PT',
      JSON.stringify([{ nope: 1 }, e('a', 3, '2026-10-01')])
    );
    expect(loadGradeLog('en-GB', 'pt-PT')).toHaveLength(1);
  });
});

describe('computeRetention (spec M2)', () => {
  it("counts only reviews made at least 7 days after the card's previous review", () => {
    const log = [
      e('a', 3, '2026-10-01'),
      e('a', 1, '2026-10-03'), // gap 2 days: not a delayed review
      e('a', 4, '2026-10-12'), // gap 9 days: delayed, recalled
      e('b', 3, '2026-10-01'),
      e('b', 2, '2026-10-09'), // gap 8 days: delayed, not recalled
    ];
    expect(computeRetention(log)).toEqual({ opportunities: 2, recalled: 1, rate: 0.5 });
  });

  it('keeps the two directions of a card separate', () => {
    const log: GradeEntry[] = [
      { item: 'a', dir: 'forward', q: 3, d: '2026-10-01' },
      { item: 'a', dir: 'reverse', q: 3, d: '2026-10-09' },
    ];
    expect(computeRetention(log).opportunities).toBe(0);
  });

  it('has no rate until there is a delayed review', () => {
    expect(computeRetention([e('a', 3, '2026-10-01')])).toEqual({
      opportunities: 0,
      recalled: 0,
      rate: null,
    });
  });
});

describe('summariseLog', () => {
  it('reports days active, review count, date range and grade mix', () => {
    const s = summariseLog([
      e('a', 1, '2026-10-01'),
      e('b', 2, '2026-10-01'),
      e('c', 3, '2026-10-04'),
      e('d', 4, '2026-10-04'),
    ]);
    expect(s).toEqual({
      reviews: 4,
      daysActive: 2,
      firstDay: '2026-10-01',
      lastDay: '2026-10-04',
      gradeMix: { again: 1, hard: 1, good: 1, easy: 1 },
    });
  });

  it('is empty-safe', () => {
    expect(summariseLog([])).toMatchObject({
      reviews: 0,
      daysActive: 0,
      firstDay: null,
      lastDay: null,
    });
  });
});

describe('rememberedItems', () => {
  it('includes items recalled Good/Easy at least 7 days after their previous review', async () => {
    const { rememberedItems } = await import('./gradeLog');
    const e = (item: string, q: number, d: string) => ({ item, dir: 'forward' as const, q, d });
    const log = [
      e('a', 3, '2026-01-01'),
      e('a', 3, '2026-01-09'),
      e('b', 3, '2026-01-01'),
      e('b', 3, '2026-01-03'),
      e('c', 3, '2026-01-01'),
      e('c', 1, '2026-01-10'),
    ];
    expect([...rememberedItems(log)]).toEqual(['a']);
  });
});

describe('computeReturn (spec S6)', () => {
  const at = (d: string): GradeEntry => ({ item: 'a', dir: 'forward', q: 3, d });
  it('is null/false for an empty log', () => {
    expect(computeReturn([])).toEqual({ day2: false, week2: false });
  });
  it('flags a review the next day and one in days 7-13', () => {
    const log = [at('2026-10-01'), at('2026-10-02'), at('2026-10-09')];
    expect(computeReturn(log)).toEqual({ day2: true, week2: true });
  });
  it('does not count same-day or day-14+ reviews', () => {
    expect(computeReturn([at('2026-10-01'), at('2026-10-15')])).toEqual({
      day2: false,
      week2: false,
    });
  });
});
