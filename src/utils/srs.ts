/*
 * FSRS-6 spaced-repetition scheduler (spec L22), replacing SM-2.
 *
 * FSRS models each card's memory with two numbers: `stability` (days until the
 * chance of recall falls to 90%) and `difficulty` (1-10). The next review is
 * placed where predicted recall meets TARGET_RETENTION.
 *
 * Formulas and default weights follow the FSRS-6 model as published in
 * ts-fsrs 6.0.0 (MIT, `models/fsrs-6`); srs.test.ts checks this file against
 * that package. Algorithm description:
 * https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm#fsrs-6
 *
 * Everything here is pure: the clock is always passed in.
 */

/** Written to each grade-log entry so metrics are kept per scheduler (spec L33). */
export const SCHEDULER_ID = 'fsrs6';
/** Scheduler id of grade-log entries written before FSRS (they carry no id). */
export const LEGACY_SCHEDULER_ID = 'sm2';

/** Chance of recall the scheduler aims for when a card comes due. */
export const TARGET_RETENTION = 0.9;
export const MAX_INTERVAL_DAYS = 36500;

/** FSRS-6 default weights (ts-fsrs 6.0.0 `FSRS6_DEFAULT_WEIGHTS`). Not fitted to our learners. */
export const FSRS_WEIGHTS: readonly number[] = Object.freeze([
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835,
  0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542,
]);

const S_MIN = 0.001;
const S_MAX = 36500;
const D_MIN = 1;
const D_MAX = 10;
const DAY_MS = 86_400_000;

const W = FSRS_WEIGHTS;
const DECAY = -W[20];
const round8 = (n: number): number => Math.round(n * 1e8) / 1e8;
const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);
// Chosen so that retrievability(stability, stability) is 0.9.
const FACTOR = round8(Math.exp(Math.log(0.9) / DECAY) - 1);

export interface MemoryState {
  /** Days until recall probability falls to 90%. */
  stability: number;
  /** 1 (easy) to 10 (hard). */
  difficulty: number;
}

/** The card state SM-2 wrote (schema version 1). Still read, never written. */
export interface Sm2State {
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: string;
  lastReviewed?: string;
}

export interface SRSState extends MemoryState {
  /** Days from the last review to the due date. Drives mastery (spec L9). */
  interval: number;
  /** Passes in a row; Again resets it. */
  repetitions: number;
  /** Times a reviewed card was graded Again. */
  lapses: number;
  /** ISO instant. */
  dueDate: string;
  /** ISO instant. */
  lastReviewed?: string;
  /** SM-2 ease, kept on migrated cards (spec S11: old fields are never deleted). Not used. */
  easeFactor?: number;
}

/**
 * UI grades 1-4 (Again/Hard/Good/Easy) on the 0-5 pass/fail scale the review
 * session uses: 3 or more is a pass, so Hard is a pass. FSRS itself takes the
 * UI grade unchanged.
 */
export function gradeToQuality(uiGrade: number): number {
  return { 1: 1, 2: 3, 3: 4, 4: 5 }[uiGrade] ?? 1;
}

/** Predicted chance of recall `elapsedDays` after a review that left `stability`. */
export function retrievability(elapsedDays: number, stability: number): number {
  return round8(Math.pow(1 + (FACTOR * elapsedDays) / stability, DECAY));
}

/** Whole days until predicted recall falls to `retention`. */
export function intervalFor(stability: number, retention: number = TARGET_RETENTION): number {
  const days = Math.round((stability / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1));
  return clamp(days, 1, MAX_INTERVAL_DAYS);
}

function initialDifficulty(grade: number): number {
  return round8(W[4] - Math.exp((grade - 1) * W[5]) + 1);
}

function nextDifficulty(d: number, grade: number): number {
  const delta = -W[6] * (grade - 3);
  const damped = d + round8((delta * (10 - d)) / 9);
  // Mean reversion towards the difficulty of a card first graded Easy.
  return clamp(round8(W[7] * initialDifficulty(4) + (1 - W[7]) * damped), D_MIN, D_MAX);
}

function stabilityAfterRecall(m: MemoryState, r: number, grade: number): number {
  const hardPenalty = grade === 2 ? W[15] : 1;
  const easyBonus = grade === 4 ? W[16] : 1;
  const growth =
    Math.exp(W[8]) *
    (11 - m.difficulty) *
    Math.pow(m.stability, -W[9]) *
    (Math.exp((1 - r) * W[10]) - 1) *
    hardPenalty *
    easyBonus;
  return round8(clamp(m.stability * (1 + growth), S_MIN, S_MAX));
}

function stabilityAfterLapse(m: MemoryState, r: number): number {
  const afterFail = round8(
    clamp(
      W[11] *
        Math.pow(m.difficulty, -W[12]) *
        (Math.pow(m.stability + 1, W[13]) - 1) *
        Math.exp((1 - r) * W[14]),
      S_MIN,
      S_MAX
    )
  );
  // A lapse can never raise stability.
  return clamp(round8(m.stability / Math.exp(W[17] * W[18])), S_MIN, afterFail);
}

/** A second review on the same day: no forgetting has been observed yet. */
function stabilitySameDay(s: number, grade: number): number {
  const change = Math.pow(s, -W[19]) * Math.exp(W[17] * (grade - 3 + W[18]));
  return round8(clamp(s * (grade >= 2 ? Math.max(change, 1) : change), S_MIN, S_MAX));
}

const toGrade = (grade: number): number => (grade === 2 || grade === 3 || grade === 4 ? grade : 1);

/**
 * The FSRS-6 memory update. `memory` is null for a card's first review;
 * `elapsedDays` is whole days since the previous review; `grade` is 1-4.
 */
export function nextMemory(
  memory: MemoryState | null,
  elapsedDays: number,
  grade: number
): MemoryState {
  const g = toGrade(grade);
  if (memory === null) {
    return {
      difficulty: clamp(initialDifficulty(g), D_MIN, D_MAX),
      stability: clamp(W[g - 1], S_MIN, S_MAX),
    };
  }
  const r = retrievability(elapsedDays, memory.stability);
  let stability: number;
  if (elapsedDays === 0) stability = stabilitySameDay(memory.stability, g);
  else if (g === 1) stability = stabilityAfterLapse(memory, r);
  else stability = stabilityAfterRecall(memory, r, g);
  return { difficulty: nextDifficulty(memory.difficulty, g), stability };
}

function startOfLocalDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Whole local calendar days from `from` to `to` (rounded, so a DST hour does not count). */
function localDaysBetween(from: Date, to: Date): number {
  return Math.round((startOfLocalDay(to).getTime() - startOfLocalDay(from).getTime()) / DAY_MS);
}

function elapsedDays(state: SRSState, now: Date): number {
  const stamp = state.lastReviewed === undefined ? NaN : Date.parse(state.lastReviewed);
  // Cards saved without a review time: the review was `interval` days before the due date.
  const last = Number.isNaN(stamp) ? Date.parse(state.dueDate) - state.interval * DAY_MS : stamp;
  return Math.max(0, localDaysBetween(new Date(last), now));
}

/**
 * Next state of a card graded `grade` (UI scale 1-4; anything else counts as
 * Again) at `now`. Pure: the input is not changed, and fields this scheduler
 * does not own are carried over untouched (spec S11).
 *
 * Due from the start of the local day, so a card graded at 9pm with a 1-day
 * interval is there the next morning.
 */
export function schedule<T extends SRSState>(state: T, grade: number, now: Date): T {
  const g = toGrade(grade);
  const reviewed = state.stability > 0;
  const { stability, difficulty } = nextMemory(
    reviewed ? state : null,
    reviewed ? elapsedDays(state, now) : 0,
    g
  );
  const interval = intervalFor(stability);
  const due = startOfLocalDay(now);
  due.setDate(due.getDate() + interval);
  return {
    ...state,
    stability,
    difficulty,
    interval,
    repetitions: g === 1 ? 0 : state.repetitions + 1,
    lapses: state.lapses + (g === 1 && reviewed ? 1 : 0),
    dueDate: due.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

/** State of a card that has never been reviewed: due now, no memory yet. */
export function createInitialState(now: Date = new Date()): SRSState {
  return {
    interval: 0,
    repetitions: 0,
    lapses: 0,
    stability: 0,
    difficulty: 0,
    dueDate: now.toISOString(),
  };
}

export function isDue(state: Pick<SRSState, 'dueDate'>, now: Date = new Date()): boolean {
  return new Date(state.dueDate) <= now;
}

/**
 * Converts an SM-2 card to FSRS without touching any existing field, so the
 * due date, interval, repetitions and ease all survive (spec S11).
 *
 * The SM-2 interval is read as "due at 90% recall", which makes it the
 * stability; difficulty is the value at which FSRS would have grown stability
 * by the card's ease factor. This is the conversion the `fsrs` Rust crate
 * (7.0.0, `memory_state_from_sm2`, FSRS-6 branch) uses, with its
 * `sm2_retention` set to 0.9. SM-2 kept no lapse count, so lapses start at 0.
 */
export function migrateSm2State<T extends Sm2State>(old: T): T & SRSState {
  // Never reviewed (SM-2 wrote interval 0 only for a brand-new card).
  if (old.interval <= 0) return { ...old, stability: 0, difficulty: 0, lapses: 0 };
  const stability = clamp(old.interval, S_MIN, S_MAX);
  const difficulty =
    11 -
    (old.easeFactor - 1) /
      (Math.exp(W[8]) *
        Math.pow(stability, -W[9]) *
        (Math.exp((1 - TARGET_RETENTION) * W[10]) - 1));
  return {
    ...old,
    stability: round8(stability),
    difficulty: round8(clamp(difficulty, D_MIN, D_MAX)),
    lapses: 0,
  };
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Reads a stored card (spec L22: SM-2 states migrate on read). Returns the
 * FSRS state, a migrated SM-2 state, or null when the value is not a card.
 */
export function parseStoredState(value: unknown): SRSState | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  if (!isNum(v.interval) || !isNum(v.repetitions) || typeof v.dueDate !== 'string') return null;
  if (isNum(v.stability) && isNum(v.difficulty)) {
    const fresh = v.stability === 0 && v.difficulty === 0;
    if (!fresh && (v.stability < S_MIN || v.difficulty < D_MIN)) return null;
    return {
      ...(v as unknown as SRSState),
      stability: Math.min(v.stability, S_MAX),
      difficulty: Math.min(v.difficulty, D_MAX),
      lapses: isNum(v.lapses) ? v.lapses : 0,
    };
  }
  if (isNum(v.easeFactor)) return migrateSm2State(v as unknown as Sm2State);
  return null;
}
