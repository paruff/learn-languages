import { readJson, writeItem } from './storage';

interface LastGrade {
  quality: number;
  date: string;
}

// UI-scale grade (1=Again, 2=Hard, 3=Good, 4=Easy) — quality 3-4 is a
// confident grade, matching issue #46's own "Good/Easy" framing.
const CONFIDENT_THRESHOLD = 3;

function lastGradeKey(
  sourceLang: string,
  targetLang: string,
  direction: string,
  itemId: string
): string {
  return `calibration-last-grade:${sourceLang}:${targetLang}:${direction}:${itemId}`;
}

function breakLogKey(sourceLang: string, targetLang: string): string {
  return `calibration-breaks:${sourceLang}:${targetLang}`;
}

/**
 * Records a UI-scale grade for calibration tracking (issue #46, the
 * fluency-illusion warning) and reports whether it "broke" a prior
 * confident grade — rated Good/Easy last time, needed Again/Hard this
 * time. Appends broken dates to a rolling log the progress page reads.
 */
export function recordGradeForCalibration(
  sourceLang: string,
  targetLang: string,
  direction: string,
  itemId: string,
  quality: number,
  date: string
): boolean {
  const key = lastGradeKey(sourceLang, targetLang, direction, itemId);
  const prev = readJson<LastGrade>(key);
  const broke =
    typeof prev?.quality === 'number' &&
    prev.quality >= CONFIDENT_THRESHOLD &&
    quality < CONFIDENT_THRESHOLD;
  writeItem(key, JSON.stringify({ quality, date } satisfies LastGrade));

  if (broke) {
    const log = loadBreakDates(sourceLang, targetLang);
    log.push(date);
    writeItem(breakLogKey(sourceLang, targetLang), JSON.stringify(log));
  }

  return broke;
}

export function loadBreakDates(sourceLang: string, targetLang: string): string[] {
  const log = readJson<unknown>(breakLogKey(sourceLang, targetLang));
  return Array.isArray(log) ? log.filter((d): d is string => typeof d === 'string') : [];
}

/** Pure — counts break dates within the trailing window (default 7 days). */
export function countRecentBreaks(breakDates: string[], now: Date, windowDays = 7): number {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - windowDays);
  return breakDates.filter((d) => new Date(d) >= cutoff).length;
}
