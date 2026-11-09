import { describe, it, expect } from 'vitest';
import { calculateNextReview, createInitialState, gradeToQuality, isDue } from './srs';

describe('SM-2 Spaced Repetition', () => {
  describe('createInitialState', () => {
    it('returns initial state with default values', () => {
      const state = createInitialState();
      expect(state.interval).toBe(0);
      expect(state.easeFactor).toBe(2.5);
      expect(state.repetitions).toBe(0);
      expect(state.dueDate).toBeDefined();
    });
  });

  describe('calculateNextReview', () => {
    it('returns 1 day interval for first successful review (quality 5)', () => {
      const state = createInitialState();
      const result = calculateNextReview({ state, quality: 5 });
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('returns 6 days interval for second successful review', () => {
      const state = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        dueDate: new Date().toISOString(),
      };
      const result = calculateNextReview({ state, quality: 5 });
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('increases interval by ease factor for subsequent reviews', () => {
      const state = {
        interval: 6,
        easeFactor: 2.5,
        repetitions: 2,
        dueDate: new Date().toISOString(),
      };
      const result = calculateNextReview({ state, quality: 5 });
      expect(result.interval).toBe(15); // 6 * 2.5 = 15
      expect(result.repetitions).toBe(3);
    });

    it('resets interval to 1 on failed recall (quality < 3)', () => {
      const state = {
        interval: 30,
        easeFactor: 2.5,
        repetitions: 5,
        dueDate: new Date().toISOString(),
      };
      const result = calculateNextReview({ state, quality: 2 });
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });

    it('does not increase repetitions on failed recall', () => {
      const state = {
        interval: 10,
        easeFactor: 2.5,
        repetitions: 3,
        dueDate: new Date().toISOString(),
      };
      const result = calculateNextReview({ state, quality: 0 });
      expect(result.repetitions).toBe(0);
    });

    it('adjusts ease factor based on quality', () => {
      const state = createInitialState();
      const result = calculateNextReview({ state, quality: 5 });
      // EF' = EF + (0.1 - (5-5)*(0.08 + (5-5)*0.02)) = 2.5 + 0.1 = 2.6
      expect(result.easeFactor).toBe(2.6);
    });

    it('makes the card due from the start of the local day, not at the hour it was graded', () => {
      const result = calculateNextReview({ state: createInitialState(), quality: 4 });
      const due = new Date(result.dueDate);
      expect([due.getHours(), due.getMinutes(), due.getSeconds()]).toEqual([0, 0, 0]);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(Math.round((due.getTime() - today.getTime()) / 86_400_000)).toBe(1);
    });

    it('leaves the ease factor unchanged on failed recall (SM-2)', () => {
      const state = {
        interval: 10,
        easeFactor: 2.5,
        repetitions: 3,
        dueDate: new Date().toISOString(),
      };
      expect(calculateNextReview({ state, quality: 1 }).easeFactor).toBe(2.5);
    });

    it('clamps ease factor to minimum 1.3', () => {
      const state = {
        interval: 10,
        easeFactor: 1.3,
        repetitions: 3,
        dueDate: new Date().toISOString(),
      };
      // A passing grade of 3 reduces EF; it must stop at the 1.3 floor
      const result = calculateNextReview({ state, quality: 3 });
      expect(result.easeFactor).toBe(1.3);
    });
  });

  describe('isDue', () => {
    it('returns true for past due date', () => {
      const state = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        dueDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
      };
      expect(isDue(state)).toBe(true);
    });

    it('returns false for future due date', () => {
      const state = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      };
      expect(isDue(state)).toBe(false);
    });
  });
});

describe('gradeToQuality', () => {
  it('maps UI grades so Hard lowers ease, Good keeps it and Easy raises it', () => {
    const state = createInitialState();
    expect(gradeToQuality(1)).toBe(1);
    expect(calculateNextReview({ state, quality: gradeToQuality(2) }).easeFactor).toBeLessThan(2.5);
    expect(calculateNextReview({ state, quality: gradeToQuality(3) }).easeFactor).toBe(2.5);
    expect(calculateNextReview({ state, quality: gradeToQuality(4) }).easeFactor).toBeGreaterThan(
      2.5
    );
  });
  it('treats unknown grades as a failed recall', () => {
    expect(gradeToQuality(9)).toBe(1);
  });
});
