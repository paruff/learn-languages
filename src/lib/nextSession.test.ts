import { describe, it, expect, beforeEach } from 'vitest';
import { saveIntention, loadIntention, markCalendarUsed, buildIcs } from './nextSession';

describe('next-session intention', () => {
  beforeEach(() => window.localStorage.clear());

  it('is null until saved', () => {
    expect(loadIntention('en-GB', 'pt-PT')).toBeNull();
  });

  it('persists the trimmed text and ignores blank input', () => {
    saveIntention('en-GB', 'pt-PT', '  On the 08:10 bus ', '2026-10-23');
    expect(loadIntention('en-GB', 'pt-PT')).toEqual({
      text: 'On the 08:10 bus',
      savedOn: '2026-10-23',
      calendar: false,
    });
    saveIntention('en-GB', 'fr-FR', '   ', '2026-10-23');
    expect(loadIntention('en-GB', 'fr-FR')).toBeNull();
  });

  it('records calendar use, and survives corrupt storage', () => {
    saveIntention('en-GB', 'pt-PT', 'Lunch', '2026-10-23');
    markCalendarUsed('en-GB', 'pt-PT');
    expect(loadIntention('en-GB', 'pt-PT')?.calendar).toBe(true);
    window.localStorage.setItem('next-session:en-GB:pt-PT', '{nope');
    expect(loadIntention('en-GB', 'pt-PT')).toBeNull();
  });
});

describe('buildIcs', () => {
  it('makes a 10 minute event tomorrow at the chosen time, with escaped text', () => {
    const ics = buildIcs('Bus, 08:10; read\nfast', '08:10', new Date('2026-10-23T12:00:00Z'));
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART:20261024T081000');
    expect(ics).toContain('DTEND:20261024T082000');
    expect(ics).toContain('DESCRIPTION:Bus\\, 08:10\\; read\\nfast');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
});

describe('robustness', () => {
  it('falls back to 08:00 on a malformed time and keeps the calendar flag on re-save', () => {
    expect(buildIcs('x', 'abc', new Date('2026-10-23T12:00:00Z'))).toContain(
      'DTSTART:20261024T080000'
    );
    window.localStorage.clear();
    saveIntention('en-GB', 'pt-PT', 'a', '2026-10-23');
    markCalendarUsed('en-GB', 'pt-PT');
    saveIntention('en-GB', 'pt-PT', 'b', '2026-10-23');
    expect(loadIntention('en-GB', 'pt-PT')?.calendar).toBe(true);
  });
});
