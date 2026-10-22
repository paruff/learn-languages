import { readJson, writeItem } from './storage';

/** One graded review. `q` is the UI grade (1=Again, 2=Hard, 3=Good, 4=Easy); `d` is YYYY-MM-DD. */
export interface GradeEntry {
  item: string;
  dir: 'forward' | 'reverse';
  q: number;
  d: string;
}

// ponytail: rolling window, oldest entries drop. Fine for weeks of testing; a long-term learner would need per-item summaries instead.
export const MAX_LOG_ENTRIES = 2000;
const CONFIDENT = 3;
const DELAY_DAYS = 7;

const key = (sourceLang: string, targetLang: string): string =>
  `grade-log:${sourceLang}:${targetLang}`;

function isEntry(v: unknown): v is GradeEntry {
  const x = v as Partial<GradeEntry> | null;
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof x.item === 'string' &&
    (x.dir === 'forward' || x.dir === 'reverse') &&
    typeof x.q === 'number' &&
    typeof x.d === 'string'
  );
}

export function loadGradeLog(sourceLang: string, targetLang: string): GradeEntry[] {
  const raw = readJson<unknown>(key(sourceLang, targetLang));
  return Array.isArray(raw) ? raw.filter(isEntry) : [];
}

export function appendGrade(sourceLang: string, targetLang: string, entry: GradeEntry): void {
  const log = [...loadGradeLog(sourceLang, targetLang), entry].slice(-MAX_LOG_ENTRIES);
  writeItem(key(sourceLang, targetLang), JSON.stringify(log));
}

const dayNumber = (d: string): number => Math.floor(Date.parse(d) / 86_400_000);

export interface Retention {
  opportunities: number;
  recalled: number;
  rate: number | null;
}

/**
 * Delayed recall (spec M2): of reviews made at least 7 days after that card's
 * previous review, the share graded Good/Easy. Directions are separate cards.
 */
export function computeRetention(log: GradeEntry[]): Retention {
  const last = new Map<string, string>();
  let opportunities = 0;
  let recalled = 0;
  for (const e of log) {
    const k = `${e.dir}:${e.item}`;
    const prev = last.get(k);
    if (prev !== undefined && dayNumber(e.d) - dayNumber(prev) >= DELAY_DAYS) {
      opportunities += 1;
      if (e.q >= CONFIDENT) recalled += 1;
    }
    last.set(k, e.d);
  }
  return { opportunities, recalled, rate: opportunities ? recalled / opportunities : null };
}

/** Item ids recalled Good/Easy at least once, 7+ days after their previous review (spec J3). */
export function rememberedItems(log: GradeEntry[]): Set<string> {
  const last = new Map<string, string>();
  const remembered = new Set<string>();
  for (const e of log) {
    const k = `${e.dir}:${e.item}`;
    const prev = last.get(k);
    if (prev !== undefined && dayNumber(e.d) - dayNumber(prev) >= DELAY_DAYS && e.q >= CONFIDENT)
      remembered.add(e.item);
    last.set(k, e.d);
  }
  return remembered;
}

export interface LogSummary {
  reviews: number;
  daysActive: number;
  firstDay: string | null;
  lastDay: string | null;
  gradeMix: { again: number; hard: number; good: number; easy: number };
}

export function summariseLog(log: GradeEntry[]): LogSummary {
  const days = [...new Set(log.map((e) => e.d))].sort();
  const count = (q: number): number => log.filter((e) => e.q === q).length;
  return {
    reviews: log.length,
    daysActive: days.length,
    firstDay: days[0] ?? null,
    lastDay: days[days.length - 1] ?? null,
    gradeMix: { again: count(1), hard: count(2), good: count(3), easy: count(4) },
  };
}
