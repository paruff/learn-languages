import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  FSRS6Algorithm,
  FSRS6_DEFAULT_WEIGHTS,
  FSRS6_MODEL_BOUNDS,
  forgettingCurve,
} from 'ts-fsrs/models/fsrs-6';
import {
  FSRS_WEIGHTS,
  MAX_INTERVAL_DAYS,
  SCHEDULER_ID,
  TARGET_RETENTION,
  createInitialState,
  gradeToQuality,
  intervalFor,
  isDue,
  migrateSm2State,
  nextMemory,
  parseStoredState,
  retrievability,
  schedule,
  type MemoryState,
  type SRSState,
} from './srs';

const DAY_MS = 86_400_000;
const at = (iso: string): Date => new Date(iso);
const addDays = (d: Date, n: number): Date => new Date(d.getTime() + n * DAY_MS);

describe('FSRS scheduler (spec L22)', () => {
  it('has its own scheduler id, so its metrics start a new series (L33)', () => {
    expect(SCHEDULER_ID).toBe('fsrs6');
  });

  it('a new card is due now and has no memory yet', () => {
    const now = at('2026-11-12T10:00:00');
    const state = createInitialState(now);
    expect(state).toEqual({
      interval: 0,
      repetitions: 0,
      lapses: 0,
      stability: 0,
      difficulty: 0,
      dueDate: now.toISOString(),
    });
    expect(isDue(state, now)).toBe(true);
    expect(isDue(createInitialState())).toBe(true);
  });

  it('first review: the grade picks the first interval (1, 1, 2, 8 days)', () => {
    const now = at('2026-11-12T21:00:00');
    const days = [1, 2, 3, 4].map((g) => schedule(createInitialState(now), g, now).interval);
    expect(days).toEqual([1, 1, 2, 8]);
  });

  it('a card graded at 9pm with a 1-day interval is due from local midnight', () => {
    const now = at('2026-11-12T21:00:00');
    const next = schedule(createInitialState(now), 1, now);
    expect(new Date(next.dueDate)).toEqual(at('2026-11-13T00:00:00'));
    expect(next.lastReviewed).toBe(now.toISOString());
    expect(isDue(next, at('2026-11-12T23:59:00'))).toBe(false);
    expect(isDue(next, at('2026-11-13T07:00:00'))).toBe(true);
  });

  it('Good on every due date: 2, 11, 46, 163 days (mastery, 21 days, on the third pass)', () => {
    let now = at('2026-01-01T09:00:00');
    let state = createInitialState(now);
    const days: number[] = [];
    for (let i = 0; i < 4; i++) {
      state = schedule(state, 3, now);
      days.push(state.interval);
      now = addDays(now, state.interval);
    }
    expect(days).toEqual([2, 11, 46, 163]);
    expect(state.repetitions).toBe(4);
    expect(state.lapses).toBe(0);
  });

  it('a lapse shortens the interval, raises difficulty, resets repetitions and is counted', () => {
    let now = at('2026-01-01T09:00:00');
    let state = createInitialState(now);
    for (let i = 0; i < 3; i++) {
      state = schedule(state, 3, now);
      now = addDays(now, state.interval);
    }
    const lapsed = schedule(state, 1, now);
    expect(lapsed.interval).toBeLessThan(state.interval);
    expect(lapsed.stability).toBeLessThan(state.stability);
    expect(lapsed.difficulty).toBeGreaterThan(state.difficulty);
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.lapses).toBe(1);
    // Unlike SM-2, the card does not restart from scratch: what was learned still counts.
    expect(lapsed.stability).toBeGreaterThan(schedule(createInitialState(now), 1, now).stability);
  });

  it('a second fail on the same day lowers stability again but keeps the card valid', () => {
    const now = at('2026-11-12T10:00:00');
    const first = schedule(createInitialState(now), 1, now);
    const second = schedule(first, 1, at('2026-11-12T10:05:00'));
    expect(second.stability).toBeLessThan(first.stability);
    expect(second.interval).toBe(1);
    expect(second.lapses).toBe(1);
  });

  it('a same-day pass never shrinks stability', () => {
    const now = at('2026-11-12T10:00:00');
    const first = schedule(createInitialState(now), 3, now);
    for (const g of [2, 3, 4]) {
      expect(schedule(first, g, at('2026-11-12T18:00:00')).stability).toBeGreaterThanOrEqual(
        first.stability
      );
    }
  });

  it('counts elapsed time in local calendar days, and never below zero', () => {
    const base: SRSState = {
      interval: 10,
      repetitions: 2,
      lapses: 0,
      stability: 10,
      difficulty: 5,
      dueDate: at('2026-11-11T00:00:00').toISOString(),
      lastReviewed: at('2026-11-01T23:30:00').toISOString(),
    };
    // 23:30 on the 1st to 00:30 on the 11th is 10 calendar days, though only 9 days 1 hour.
    const onTime = schedule(base, 3, at('2026-11-11T00:30:00'));
    expect(onTime.stability).toBe(nextMemory(base, 10, 3).stability);
    // A device clock set back before the last review counts as the same day.
    const clockBack = schedule(base, 3, at('2026-10-20T12:00:00'));
    expect(clockBack.stability).toBe(nextMemory(base, 0, 3).stability);
  });

  it('a card saved without a review time is taken as reviewed `interval` days before it was due', () => {
    const noStamp: SRSState = {
      interval: 6,
      repetitions: 2,
      lapses: 0,
      stability: 6,
      difficulty: 5,
      dueDate: at('2026-11-10T00:00:00').toISOString(),
    };
    const twoDaysLate = at('2026-11-12T09:00:00');
    expect(schedule(noStamp, 3, twoDaysLate).stability).toBe(nextMemory(noStamp, 8, 3).stability);
    const badStamp = { ...noStamp, lastReviewed: 'not a date' };
    expect(schedule(badStamp, 3, twoDaysLate).stability).toBe(nextMemory(noStamp, 8, 3).stability);
  });

  it('caps the interval at the maximum', () => {
    expect(intervalFor(36500, 0.7)).toBe(MAX_INTERVAL_DAYS);
    expect(intervalFor(0.001)).toBe(1);
  });

  it('gradeToQuality keeps the pass/fail scale the review session uses (Hard is a pass)', () => {
    expect([1, 2, 3, 4].map(gradeToQuality)).toEqual([1, 3, 4, 5]);
    expect(gradeToQuality(99)).toBe(1);
  });
});

describe('agrees with the reference implementation (ts-fsrs 6.0.0, FSRS-6)', () => {
  const reference = new FSRS6Algorithm([...FSRS6_DEFAULT_WEIGHTS], true, FSRS6_MODEL_BOUNDS);

  it('uses the published default weights', () => {
    expect([...FSRS_WEIGHTS]).toEqual([...FSRS6_DEFAULT_WEIGHTS]);
  });

  it('same memory state after any review history', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.constantFrom(1, 2, 3, 4), fc.integer({ min: 0, max: 800 })), {
          minLength: 1,
          maxLength: 60,
        }),
        (history) => {
          let ours: MemoryState | null = null;
          let theirs: MemoryState | null = null;
          for (const [g, gap] of history) {
            const t: number = ours === null ? 0 : gap;
            ours = nextMemory(ours, t, g);
            theirs = reference.next_state(theirs, t, g);
            expect(ours.stability).toBeCloseTo(theirs.stability, 6);
            expect(ours.difficulty).toBeCloseTo(theirs.difficulty, 6);
          }
        }
      ),
      { numRuns: 500 }
    );
  });

  it('same forgetting curve and the same interval for a target retention', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.001, max: 36500, noNaN: true }),
        fc.integer({ min: 0, max: 5000 }),
        fc.double({ min: 0.7, max: 0.97, noNaN: true }),
        (s, t, r) => {
          expect(retrievability(t, s)).toBeCloseTo(forgettingCurve(0.1542, t, s), 8);
          expect(intervalFor(s, r)).toBe(
            Math.min(reference.next_interval(s, r), MAX_INTERVAL_DAYS)
          );
        }
      ),
      { numRuns: 500 }
    );
  });
});

describe('SM-2 → FSRS migration (spec L22, S11)', () => {
  const sm2 = {
    interval: 15,
    easeFactor: 2.5,
    repetitions: 3,
    dueDate: '2026-11-20T00:00:00.000Z',
    lastReviewed: '2026-11-05T18:00:00.000Z',
  };

  it('adds the FSRS memory state and keeps every SM-2 field', () => {
    const migrated = migrateSm2State(sm2);
    expect(migrated).toMatchObject(sm2);
    expect(migrated.stability).toBe(15);
    expect(migrated.lapses).toBe(0);
    expect(migrated.difficulty).toBeGreaterThan(1);
    expect(migrated.difficulty).toBeLessThan(10);
  });

  it('maps ease to difficulty: the SM-2 floor (1.3) is harder than the default (2.5)', () => {
    const hard = migrateSm2State({ ...sm2, easeFactor: 1.3 }).difficulty;
    const normal = migrateSm2State(sm2).difficulty;
    const easy = migrateSm2State({ ...sm2, easeFactor: 3.2 }).difficulty;
    expect(hard).toBeGreaterThan(normal);
    expect(normal).toBeGreaterThan(easy);
  });

  it('a migrated card graded Good on its due date moves further out than SM-2 had it', () => {
    const next = schedule(migrateSm2State(sm2), 3, at(sm2.dueDate));
    expect(next.interval).toBeGreaterThan(sm2.interval);
    expect(next.repetitions).toBe(4);
    expect(next.easeFactor).toBe(2.5);
  });

  it('an SM-2 card that was never reviewed (interval 0) stays a new card', () => {
    const fresh = { interval: 0, easeFactor: 2.5, repetitions: 0, dueDate: sm2.dueDate };
    const migrated = migrateSm2State(fresh);
    expect(migrated).toMatchObject({ ...fresh, stability: 0, difficulty: 0, lapses: 0 });
    expect(schedule(migrated, 3, at(sm2.dueDate)).interval).toBe(2);
  });

  it('parseStoredState migrates SM-2 on read, passes FSRS through, and rejects the rest', () => {
    expect(parseStoredState(sm2)).toEqual(migrateSm2State(sm2));
    const fsrs = migrateSm2State(sm2);
    expect(parseStoredState(fsrs)).toEqual(fsrs);
    expect(parseStoredState(createInitialState(at(sm2.dueDate)))).toEqual(
      createInitialState(at(sm2.dueDate))
    );
    expect(parseStoredState({ ...fsrs, lapses: undefined })).toEqual(fsrs);
    expect(parseStoredState({ ...fsrs, stability: 1e9, difficulty: 99 })).toMatchObject({
      stability: 36500,
      difficulty: 10,
    });
    for (const junk of [
      null,
      'text',
      42,
      [],
      {},
      { interval: 1, repetitions: 1, dueDate: 5, easeFactor: 2.5 },
      { interval: 'x', repetitions: 1, dueDate: 'd', easeFactor: 2.5 },
      { interval: 1, repetitions: null, dueDate: 'd', easeFactor: 2.5 },
      { interval: 1, repetitions: 1, dueDate: 'd' },
      { interval: 1, repetitions: 1, dueDate: 'd', stability: -1, difficulty: 5 },
      { interval: 1, repetitions: 1, dueDate: 'd', stability: 5, difficulty: 0 },
    ]) {
      expect(parseStoredState(junk), JSON.stringify(junk)).toBeNull();
    }
  });
});

/*
 * Issue #247 asks the exit check to compare review counts, not only coverage.
 * This simulates 2000 cards over a year, graded Good when recalled and Again
 * when not. The simulated learner forgets exactly as the FSRS-6 default model
 * predicts, so it shows what follows IF that model describes the learner. It
 * is not evidence about real learners: only the grade log (M2) can give that.
 *
 * What it shows (numbers in spec.md §2.1): at a 90% target FSRS does NOT need
 * fewer reviews than this app's SM-2; the two are within a few percent. The
 * saving only appears when the target retention is lowered.
 */
describe('review load against SM-2 over a simulated year', () => {
  interface Sm2 {
    interval: number;
    ease: number;
    reps: number;
  }
  // The SM-2 this app shipped (src/utils/srs.ts before #247). Hard/Good/Easy are quality 3/4/5.
  function sm2Next(s: Sm2, grade: number): Sm2 {
    const q = gradeToQuality(grade);
    if (q < 3) return { ...s, interval: 1, reps: 0 };
    const interval = s.reps === 0 ? 1 : s.reps === 1 ? 6 : Math.round(s.interval * s.ease);
    const ease = Math.max(1.3, s.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    return { interval, ease, reps: s.reps + 1 };
  }

  function mulberry32(seed: number): () => number {
    let a = seed;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const CARDS = 2000;
  const DAYS = 365;

  /** Reviews on each due day for a year; recall follows the true (FSRS-6 default) memory. */
  function run(target: number | 'sm2'): { reviews: number; retention: number } {
    const random = mulberry32(247);
    let reviews = 0;
    let recalled = 0;
    for (let card = 0; card < CARDS; card++) {
      let truth: MemoryState | null = null;
      let sm2: Sm2 = { interval: 0, ease: 2.5, reps: 0 };
      let elapsed = 0;
      for (let day = 0; day < DAYS; day += elapsed) {
        const pRecall = truth === null ? 1 : retrievability(elapsed, truth.stability);
        const grade = random() < pRecall ? 3 : 1;
        if (truth !== null) {
          reviews += 1;
          if (grade === 3) recalled += 1;
        }
        truth = nextMemory(truth, elapsed, grade);
        sm2 = sm2Next(sm2, grade);
        elapsed = target === 'sm2' ? sm2.interval : intervalFor(truth.stability, target);
      }
    }
    return { reviews, retention: recalled / reviews };
  }

  it('FSRS lands on its target; its review load is close to SM-2 at 90% and lower at 80%', () => {
    const sm2 = run('sm2');
    const fsrs = run(TARGET_RETENTION);
    const relaxed = run(0.8);
    const line = (name: string, r: { reviews: number; retention: number }): string =>
      `${name} ${(r.reviews / CARDS).toFixed(2)} reviews/card at ${(r.retention * 100).toFixed(1)}% recall`;
    // Printed so the numbers quoted in spec.md §2.1 can be re-derived.
    console.info(
      `[#247] simulated year: ${line('SM-2', sm2)}; ${line('FSRS 90%', fsrs)}; ${line('FSRS 80%', relaxed)}`
    );
    expect(Math.abs(fsrs.retention - TARGET_RETENTION)).toBeLessThan(0.03);
    expect(Math.abs(relaxed.retention - 0.8)).toBeLessThan(0.03);
    expect(Math.abs(fsrs.reviews - sm2.reviews) / sm2.reviews).toBeLessThan(0.15);
    expect(relaxed.reviews).toBeLessThan(fsrs.reviews * 0.8);
  });
});
