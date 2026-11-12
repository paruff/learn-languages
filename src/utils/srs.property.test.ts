import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  MAX_INTERVAL_DAYS,
  TARGET_RETENTION,
  createInitialState,
  intervalFor,
  isDue,
  migrateSm2State,
  nextMemory,
  parseStoredState,
  retrievability,
  schedule,
  type SRSState,
} from './srs';

/*
 * Properties of the FSRS scheduler (spec L22), written before the scheduler.
 * They state what must hold for every card, grade and date, not what one
 * hand-picked example returns. Example and reference-implementation checks
 * are in srs.test.ts.
 */

fc.configureGlobal({ numRuns: 300 });

const S_MIN = 0.001;
const S_MAX = 36500;
const DAY_MS = 86_400_000;

const grade = fc.constantFrom(1, 2, 3, 4);
const stability = fc.double({ min: S_MIN, max: S_MAX, noNaN: true });
const difficulty = fc.double({ min: 1, max: 10, noNaN: true });
const memory = fc.record({ stability, difficulty });
const elapsed = fc.integer({ min: 0, max: 5000 });
const instant = fc
  .integer({ min: Date.UTC(2020, 0, 1), max: Date.UTC(2040, 0, 1) })
  .map((ms) => new Date(ms));

/** A card that has been reviewed at least once, last seen 0-2000 days before `now`. */
const reviewedAt = (now: Date): fc.Arbitrary<SRSState> =>
  fc
    .record({
      stability,
      difficulty,
      interval: fc.integer({ min: 1, max: MAX_INTERVAL_DAYS }),
      repetitions: fc.integer({ min: 0, max: 60 }),
      lapses: fc.integer({ min: 0, max: 60 }),
      agoMs: fc.integer({ min: 0, max: 2000 * DAY_MS }),
    })
    .map(({ agoMs, ...s }) => {
      const last = new Date(now.getTime() - agoMs);
      return {
        ...s,
        lastReviewed: last.toISOString(),
        dueDate: new Date(last.getTime() + s.interval * DAY_MS).toISOString(),
      };
    });

const cardAndNow = instant.chain((now) =>
  fc.tuple(fc.oneof(reviewedAt(now), fc.constant(createInitialState(now))), fc.constant(now))
);

const sm2State = fc.record(
  {
    interval: fc.integer({ min: 1, max: 3650 }),
    easeFactor: fc.integer({ min: 130, max: 400 }).map((n) => n / 100),
    repetitions: fc.integer({ min: 0, max: 40 }),
    dueDate: instant.map((d) => d.toISOString()),
    lastReviewed: instant.map((d) => d.toISOString()),
  },
  { requiredKeys: ['interval', 'easeFactor', 'repetitions', 'dueDate'] }
);

const localMidnight = (d: Date): number => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c.getTime();
};
const localDaysBetween = (from: Date, to: Date): number =>
  Math.round((localMidnight(to) - localMidnight(from)) / DAY_MS);

function deepFreeze<T extends object>(o: T): T {
  return Object.freeze(o);
}

function expectValid(s: SRSState): void {
  expect(Number.isFinite(s.stability)).toBe(true);
  expect(s.stability).toBeGreaterThanOrEqual(S_MIN);
  expect(s.stability).toBeLessThanOrEqual(S_MAX);
  expect(s.difficulty).toBeGreaterThanOrEqual(1);
  expect(s.difficulty).toBeLessThanOrEqual(10);
  expect(Number.isInteger(s.interval)).toBe(true);
  expect(s.interval).toBeGreaterThanOrEqual(1);
  expect(s.interval).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
  expect(Number.isInteger(s.repetitions)).toBe(true);
  expect(s.repetitions).toBeGreaterThanOrEqual(0);
  expect(Number.isInteger(s.lapses)).toBe(true);
  expect(Number.isNaN(Date.parse(s.dueDate))).toBe(false);
}

describe('forgetting curve', () => {
  it('is 1 at day 0 and exactly 0.9 after `stability` days', () => {
    fc.assert(
      fc.property(stability, (s) => {
        expect(retrievability(0, s)).toBe(1);
        expect(retrievability(s, s)).toBeCloseTo(0.9, 6);
      })
    );
  });

  it('stays in (0, 1] and never rises as days pass', () => {
    fc.assert(
      fc.property(stability, elapsed, elapsed, (s, a, b) => {
        const [t1, t2] = a <= b ? [a, b] : [b, a];
        const r1 = retrievability(t1, s);
        const r2 = retrievability(t2, s);
        expect(r1).toBeGreaterThan(0);
        expect(r1).toBeLessThanOrEqual(1);
        expect(r2).toBeLessThanOrEqual(r1);
      })
    );
  });

  it('a more stable memory is at least as retrievable on the same day', () => {
    fc.assert(
      fc.property(stability, stability, elapsed, (a, b, t) => {
        const [lo, hi] = a <= b ? [a, b] : [b, a];
        expect(retrievability(t, hi)).toBeGreaterThanOrEqual(retrievability(t, lo));
      })
    );
  });
});

describe('intervalFor', () => {
  it('is a whole number of days between 1 and the maximum', () => {
    fc.assert(
      fc.property(stability, fc.double({ min: 0.7, max: 0.97, noNaN: true }), (s, r) => {
        const days = intervalFor(s, r);
        expect(Number.isInteger(days)).toBe(true);
        expect(days).toBeGreaterThanOrEqual(1);
        expect(days).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
      })
    );
  });

  it('never shrinks when stability grows, and never grows when the target rises', () => {
    fc.assert(
      fc.property(
        stability,
        stability,
        fc.double({ min: 0.7, max: 0.97, noNaN: true }),
        fc.double({ min: 0.7, max: 0.97, noNaN: true }),
        (a, b, r1, r2) => {
          const [lo, hi] = a <= b ? [a, b] : [b, a];
          const [easier, stricter] = r1 <= r2 ? [r1, r2] : [r2, r1];
          expect(intervalFor(hi, easier)).toBeGreaterThanOrEqual(intervalFor(lo, easier));
          expect(intervalFor(lo, stricter)).toBeLessThanOrEqual(intervalFor(lo, easier));
        }
      )
    );
  });

  it('lands on the target retention, within the half day lost to rounding', () => {
    fc.assert(
      fc.property(fc.double({ min: 2, max: 30000, noNaN: true }), (s) => {
        const days = intervalFor(s);
        expect(retrievability(days + 0.5, s)).toBeLessThanOrEqual(TARGET_RETENTION + 1e-6);
        expect(retrievability(days - 0.5, s)).toBeGreaterThanOrEqual(TARGET_RETENTION - 1e-6);
      })
    );
  });
});

describe('nextMemory (the FSRS memory model)', () => {
  it('keeps stability and difficulty in bounds for every input', () => {
    fc.assert(
      fc.property(fc.option(memory, { nil: null }), elapsed, grade, (m, t, g) => {
        const next = nextMemory(m, t, g);
        expect(next.stability).toBeGreaterThanOrEqual(S_MIN);
        expect(next.stability).toBeLessThanOrEqual(S_MAX);
        expect(next.difficulty).toBeGreaterThanOrEqual(1);
        expect(next.difficulty).toBeLessThanOrEqual(10);
      })
    );
  });

  it('a better grade never gives less stability or more difficulty', () => {
    fc.assert(
      fc.property(fc.option(memory, { nil: null }), elapsed, (m, t) => {
        const [again, hard, good, easy] = [1, 2, 3, 4].map((g) => nextMemory(m, t, g));
        expect(again.stability).toBeLessThanOrEqual(hard.stability);
        expect(hard.stability).toBeLessThanOrEqual(good.stability);
        expect(good.stability).toBeLessThanOrEqual(easy.stability);
        expect(again.difficulty).toBeGreaterThanOrEqual(hard.difficulty);
        expect(hard.difficulty).toBeGreaterThanOrEqual(good.difficulty);
        expect(good.difficulty).toBeGreaterThanOrEqual(easy.difficulty);
      })
    );
  });

  it('a recalled card never loses stability; a forgotten card never gains it', () => {
    fc.assert(
      fc.property(memory, elapsed, (m, t) => {
        for (const g of [2, 3, 4]) {
          expect(nextMemory(m, t, g).stability).toBeGreaterThanOrEqual(m.stability - 1e-8);
        }
        expect(nextMemory(m, t, 1).stability).toBeLessThanOrEqual(m.stability + 1e-8);
      })
    );
  });

  it('credits overdue reviews: recalling after a longer gap never earns less stability', () => {
    fc.assert(
      fc.property(
        memory,
        fc.integer({ min: 1, max: 5000 }),
        fc.integer({ min: 1, max: 5000 }),
        fc.constantFrom(2, 3, 4),
        (m, a, b, g) => {
          const [sooner, later] = a <= b ? [a, b] : [b, a];
          expect(nextMemory(m, later, g).stability).toBeGreaterThanOrEqual(
            nextMemory(m, sooner, g).stability
          );
        }
      )
    );
  });

  it('a harder card earns no more stability from the same recall', () => {
    fc.assert(
      fc.property(stability, difficulty, difficulty, elapsed, grade, (s, d1, d2, t, g) => {
        const [easyCard, hardCard] = d1 <= d2 ? [d1, d2] : [d2, d1];
        expect(
          nextMemory({ stability: s, difficulty: hardCard }, t, g).stability
        ).toBeLessThanOrEqual(
          nextMemory({ stability: s, difficulty: easyCard }, t, g).stability + 1e-8
        );
      })
    );
  });
});

describe('schedule', () => {
  it('is pure: same inputs give the same output and the input is not changed', () => {
    fc.assert(
      fc.property(cardAndNow, grade, ([state, now], g) => {
        const before = JSON.stringify(state);
        const nowMs = now.getTime();
        const a = schedule(deepFreeze({ ...state }), g, now);
        const b = schedule(deepFreeze({ ...state }), g, now);
        expect(a).toEqual(b);
        expect(JSON.stringify(state)).toBe(before);
        expect(now.getTime()).toBe(nowMs);
      })
    );
  });

  it('always returns a valid state', () => {
    fc.assert(
      fc.property(cardAndNow, grade, ([state, now], g) => {
        expectValid(schedule(state, g, now));
      })
    );
  });

  it('is due at local midnight, `interval` days after the grade day, and not before', () => {
    fc.assert(
      fc.property(cardAndNow, grade, ([state, now], g) => {
        const next = schedule(state, g, now);
        const due = new Date(next.dueDate);
        expect(due.getHours()).toBe(0);
        expect(due.getMinutes()).toBe(0);
        expect(localDaysBetween(now, due)).toBe(next.interval);
        expect(next.lastReviewed).toBe(now.toISOString());
        expect(isDue(next, now)).toBe(false);
        expect(isDue(next, due)).toBe(true);
      })
    );
  });

  it('a better grade never schedules the card sooner', () => {
    fc.assert(
      fc.property(cardAndNow, ([state, now]) => {
        const days = [1, 2, 3, 4].map((g) => schedule(state, g, now).interval);
        expect(days[0]).toBeLessThanOrEqual(days[1]);
        expect(days[1]).toBeLessThanOrEqual(days[2]);
        expect(days[2]).toBeLessThanOrEqual(days[3]);
      })
    );
  });

  it('counts passes in a row and lapses', () => {
    fc.assert(
      fc.property(cardAndNow, grade, ([state, now], g) => {
        const next = schedule(state, g, now);
        const wasReviewed = state.stability > 0;
        if (g === 1) {
          expect(next.repetitions).toBe(0);
          expect(next.lapses).toBe(state.lapses + (wasReviewed ? 1 : 0));
        } else {
          expect(next.repetitions).toBe(state.repetitions + 1);
          expect(next.lapses).toBe(state.lapses);
        }
      })
    );
  });

  it('treats any value that is not Hard, Good or Easy as Again', () => {
    fc.assert(
      fc.property(
        cardAndNow,
        fc.oneof(fc.integer(), fc.double()).filter((n) => ![2, 3, 4].includes(n)),
        ([state, now], bad) => {
          expect(schedule(state, bad, now)).toEqual(schedule(state, 1, now));
        }
      )
    );
  });

  it('never drops a field it does not own (spec S11)', () => {
    fc.assert(
      fc.property(cardAndNow, grade, fc.double({ noNaN: true }), ([state, now], g, ease) => {
        const legacy = { ...state, easeFactor: ease, somethingNewer: 'kept' };
        const next = schedule(legacy, g, now) as SRSState & Record<string, unknown>;
        expect(next.easeFactor).toBe(ease);
        expect(next.somethingNewer).toBe('kept');
      })
    );
  });

  it('stays valid over any review history, reviewed early, on time or late', () => {
    fc.assert(
      fc.property(
        instant,
        fc.array(fc.tuple(grade, fc.integer({ min: 0, max: 400 })), {
          minLength: 1,
          maxLength: 40,
        }),
        (start, history) => {
          let now = start;
          let state = createInitialState(now);
          let reviews = 0;
          for (const [g, gapDays] of history) {
            now = new Date(now.getTime() + gapDays * DAY_MS);
            state = schedule(state, g, now);
            reviews += 1;
            expectValid(state);
            expect(state.repetitions).toBeLessThanOrEqual(reviews);
            expect(state.lapses).toBeLessThan(reviews);
          }
        }
      )
    );
  });
});

describe('migrateSm2State (SM-2 → FSRS, spec L22/S11)', () => {
  it('keeps every SM-2 field exactly as it was', () => {
    fc.assert(
      fc.property(sm2State, (old) => {
        expect(migrateSm2State(old)).toMatchObject(old);
      })
    );
  });

  it('does not move the due date: a card is due after migration iff it was due before', () => {
    fc.assert(
      fc.property(sm2State, instant, (old, now) => {
        const migrated = migrateSm2State(old);
        expect(migrated.dueDate).toBe(old.dueDate);
        expect(isDue(migrated, now)).toBe(new Date(old.dueDate) <= now);
      })
    );
  });

  it('produces a valid reviewed FSRS card whose stability is the SM-2 interval', () => {
    fc.assert(
      fc.property(sm2State, (old) => {
        const migrated = migrateSm2State(old);
        expectValid(migrated);
        // SM-2 intervals are read as "due at 90% recall", which is what stability means.
        expect(migrated.stability).toBeCloseTo(old.interval, 6);
        expect(migrated.lapses).toBe(0);
      })
    );
  });

  it('a lower SM-2 ease never becomes a lower FSRS difficulty', () => {
    fc.assert(
      fc.property(sm2State, sm2State, (a, b) => {
        const [low, high] = a.easeFactor <= b.easeFactor ? [a, b] : [b, a];
        const interval = a.interval;
        expect(migrateSm2State({ ...low, interval }).difficulty).toBeGreaterThanOrEqual(
          migrateSm2State({ ...high, interval }).difficulty
        );
      })
    );
  });

  it('can be scheduled straight away, and a pass still pushes the card out', () => {
    fc.assert(
      fc.property(sm2State, fc.constantFrom(2, 3, 4), (old, g) => {
        const migrated = migrateSm2State(old);
        const now = new Date(old.dueDate);
        const next = schedule(migrated, g, now);
        expectValid(next);
        expect(next.stability).toBeGreaterThanOrEqual(migrated.stability - 1e-8);
        expect(next.repetitions).toBe(old.repetitions + 1);
      })
    );
  });
});

describe('parseStoredState (migrate on read)', () => {
  it('is idempotent: reading a migrated state changes nothing', () => {
    fc.assert(
      fc.property(sm2State, (old) => {
        const once = parseStoredState(JSON.parse(JSON.stringify(old)));
        expect(once).not.toBeNull();
        const twice = parseStoredState(JSON.parse(JSON.stringify(once)));
        expect(twice).toEqual(once);
      })
    );
  });

  it('round-trips any state the scheduler writes', () => {
    fc.assert(
      fc.property(cardAndNow, grade, ([state, now], g) => {
        const written = schedule(state, g, now);
        expect(parseStoredState(JSON.parse(JSON.stringify(written)))).toEqual(written);
      })
    );
  });

  it('never throws on junk, and anything it accepts can be scheduled', () => {
    fc.assert(
      fc.property(fc.anything(), instant, grade, (junk, now, g) => {
        const parsed = parseStoredState(junk);
        if (parsed !== null) {
          const next = schedule(parsed, g, now);
          expect(Number.isFinite(next.stability)).toBe(true);
          expect(next.interval).toBeGreaterThanOrEqual(1);
        }
      })
    );
  });
});
