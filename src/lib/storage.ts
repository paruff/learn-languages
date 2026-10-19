import { createInitialState, type SRSState } from '../utils/srs';

export type ReviewDirection = 'forward' | 'reverse';

/*
 * Every localStorage access in the app routes through these helpers (spec S7).
 * Storage can throw (site data blocked → SecurityError, quota full →
 * QuotaExceededError) and stored values can be corrupt; neither may take the
 * review page down — a learner who hits this on session 1 just leaves (R3).
 */
export function readItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns false when the write could not be persisted (progress lives for this page only). */
export function writeItem(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readJson<T>(key: string): T | null {
  const raw = readItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isSRSState(value: unknown): value is SRSState {
  const v = value as Partial<SRSState> | null;
  return (
    typeof v === 'object' &&
    v !== null &&
    Number.isFinite(v.interval) &&
    Number.isFinite(v.easeFactor) &&
    Number.isFinite(v.repetitions) &&
    typeof v.dueDate === 'string'
  );
}

function storageKey(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection,
  itemId: string
): string {
  return `srs:${sourceLang}:${targetLang}:${direction}:${itemId}`;
}

/** Loads SRS state for one card, scoped by language pair + direction (spec §4.3 I4). */
export function loadState(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection,
  itemId: string
): SRSState {
  const stored = readJson<unknown>(storageKey(sourceLang, targetLang, direction, itemId));
  return isSRSState(stored) ? stored : createInitialState();
}

export function saveState(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection,
  itemId: string,
  state: SRSState
): void {
  writeItem(storageKey(sourceLang, targetLang, direction, itemId), JSON.stringify(state));
}

function directionKey(sourceLang: string, targetLang: string): string {
  return `srs-direction:${sourceLang}:${targetLang}`;
}

/** Learner's preferred review direction per pair (#10), defaulting to forward. */
export function loadDirectionPreference(sourceLang: string, targetLang: string): ReviewDirection {
  const raw = readItem(directionKey(sourceLang, targetLang));
  return raw === 'reverse' ? 'reverse' : 'forward';
}

export function saveDirectionPreference(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection
): void {
  writeItem(directionKey(sourceLang, targetLang), direction);
}

export type RecallMode = 'reveal' | 'type' | 'picture';

function recallModeKey(sourceLang: string, targetLang: string): string {
  return `recall-mode:${sourceLang}:${targetLang}`;
}

/**
 * Reveal (current default), type-the-answer-first (issue #45), or picture-
 * prompt mode (issue #145) — opt-in per language pair, defaulting to reveal
 * so existing behavior is unchanged for anyone who doesn't switch.
 */
export function loadRecallModePreference(sourceLang: string, targetLang: string): RecallMode {
  const raw = readItem(recallModeKey(sourceLang, targetLang));
  return raw === 'type' || raw === 'picture' ? raw : 'reveal';
}

export function saveRecallModePreference(
  sourceLang: string,
  targetLang: string,
  mode: RecallMode
): void {
  writeItem(recallModeKey(sourceLang, targetLang), mode);
}

// Prefixes this app owns — localStorage is per-origin, and paruff.github.io is
// shared with every other project page on it, so export/import must never
// touch keys outside this list.
const OWNED_KEY_PREFIXES = [
  'srs:',
  'srs-direction:',
  'recall-mode:',
  'calibration-last-grade:',
  'calibration-breaks:',
  'reflection:',
];
const OWNED_EXACT_KEYS = ['pairPreference'];

function isOwnedKey(key: string): boolean {
  return OWNED_EXACT_KEYS.includes(key) || OWNED_KEY_PREFIXES.some((p) => key.startsWith(p));
}

export interface ProgressExport {
  app: 'acquira';
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

/** Snapshot of all learner state, for a backup file (spec S5, JTBD-4). */
export function exportProgress(): ProgressExport {
  const data: Record<string, string> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && isOwnedKey(key)) data[key] = window.localStorage.getItem(key) ?? '';
    }
  } catch {
    // Storage unavailable — export whatever was read so far (likely nothing).
  }
  return { app: 'acquira', version: 1, exportedAt: new Date().toISOString(), data };
}

export type ImportResult = { ok: true; count: number } | { ok: false; error: string };

/** Restores a backup file. Untrusted input: validated, and only owned keys are written. */
export function importProgress(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'not-json' };
  }
  const file = parsed as Partial<ProgressExport> | null;
  if (typeof file !== 'object' || file === null || file.app !== 'acquira') {
    return { ok: false, error: 'not-acquira' };
  }
  const data = file.data;
  if (typeof data !== 'object' || data === null) return { ok: false, error: 'no-data' };
  const entries = Object.entries(data);
  if (entries.some(([, v]) => typeof v !== 'string')) return { ok: false, error: 'bad-value' };

  let count = 0;
  for (const [key, value] of entries) {
    if (isOwnedKey(key) && writeItem(key, value as string)) count++;
  }
  return { ok: true, count };
}
