import { describe, it, expect } from 'vitest';
import { localDay } from './localDay';

describe('localDay', () => {
  it('uses the local calendar date, not the UTC one', () => {
    // Local 23:30 on 4 Nov: its UTC date is the 5th for any zone east of UTC-0:30
    // and the 4th west of it, so only a local-date build is stable here.
    expect(localDay(new Date(2026, 10, 4, 23, 30))).toBe('2026-11-04');
    expect(localDay(new Date(2026, 10, 4, 0, 5))).toBe('2026-11-04');
  });

  it('zero-pads month and day', () => {
    expect(localDay(new Date(2026, 0, 2, 12))).toBe('2026-01-02');
  });
});
