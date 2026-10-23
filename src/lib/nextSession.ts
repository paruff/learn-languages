import { readJson, writeItem } from './storage';

export interface Intention {
  text: string;
  savedOn: string;
  /** Whether the learner downloaded the calendar file (feeds the self-sent report). */
  calendar: boolean;
}

const key = (sourceLang: string, targetLang: string): string =>
  `next-session:${sourceLang}:${targetLang}`;

/**
 * Implementation intention (spec L21, Gollwitzer & Sheeran 2006): the learner's own
 * "when and where" for the next session. Local only, optional, never a nag.
 */
export function saveIntention(
  sourceLang: string,
  targetLang: string,
  text: string,
  savedOn: string
): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  writeItem(
    key(sourceLang, targetLang),
    JSON.stringify({ text: trimmed, savedOn, calendar: false } satisfies Intention)
  );
}

export function loadIntention(sourceLang: string, targetLang: string): Intention | null {
  const v = readJson<Partial<Intention>>(key(sourceLang, targetLang));
  return v && typeof v.text === 'string' && v.text && typeof v.savedOn === 'string'
    ? { text: v.text, savedOn: v.savedOn, calendar: v.calendar === true }
    : null;
}

export function markCalendarUsed(sourceLang: string, targetLang: string): void {
  const v = loadIntention(sourceLang, targetLang);
  if (v) writeItem(key(sourceLang, targetLang), JSON.stringify({ ...v, calendar: true }));
}

const escapeIcs = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\r?\n/g, '\\n');

const stamp = (d: Date, hh: number, mm: number): string => {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(hh)}${p(mm)}00`;
};

/**
 * One 10-minute event tomorrow at `time` (HH:MM, device-local "floating" time), built
 * on-device so nothing is sent anywhere.
 */
export function buildIcs(text: string, time: string, now: Date = new Date()): string {
  const [hh, mm] = time.split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hh, mm);
  const end = new Date(start.getTime() + 10 * 60_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Acquira//Next session//EN',
    'BEGIN:VEVENT',
    `UID:acquira-${stamp(start, hh, mm)}@acquira`,
    `DTSTAMP:${now.toISOString().replace(/[-:]|\.\d{3}/g, '')}`,
    `DTSTART:${stamp(start, start.getHours(), start.getMinutes())}`,
    `DTEND:${stamp(end, end.getHours(), end.getMinutes())}`,
    'SUMMARY:Acquira: 10 minutes',
    `DESCRIPTION:${escapeIcs(text)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
