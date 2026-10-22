import { describe, it, expect } from 'vitest';
import { buildSessionReport } from './sessionReport';

const log = [
  { item: 'pt-PT-greetings-001', dir: 'forward' as const, q: 3, d: '2026-10-01' },
  { item: 'pt-PT-greetings-001', dir: 'forward' as const, q: 4, d: '2026-10-09' },
];

describe('buildSessionReport (spec M1)', () => {
  const report = buildSessionReport({
    sourceLang: 'en-GB',
    targetLang: 'pt-PT',
    log,
    levels: [{ cefrLevel: 'A1', masteredItems: 1, totalItems: 20 }],
    comment: 'Loved it',
    generatedOn: '2026-10-22',
  });

  it('contains only allow-listed fields and no item ids', () => {
    const json = JSON.parse(report.slice(report.indexOf('{')));
    expect(Object.keys(json).sort()).toEqual(
      [
        'app',
        'comment',
        'daysActive',
        'firstDay',
        'generatedOn',
        'gradeMix',
        'lastDay',
        'levels',
        'pair',
        'retention',
        'reviews',
      ].sort()
    );
    expect(report).not.toContain('greetings-001');
  });

  it('is readable text above the data and carries the learner comment', () => {
    expect(report).toMatch(/^Acquira session report/);
    expect(report).toContain('Loved it');
    expect(report).toContain('en-GB → pt-PT');
  });
});
