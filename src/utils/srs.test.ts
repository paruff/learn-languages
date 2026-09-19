import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  createInitialState,
  isDue,
  daysUntilDue,
  formatInterval,
} from './srs';

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

    it('clamps ease factor to minimum 1.3', () => {
      const state = {
        interval: 10,
        easeFactor: 1.3,
        repetitions: 3,
        dueDate: new Date().toISOString(),
      };
      // Quality 0 should try to reduce EF below 1.3
      const result = calculateNextReview({ state, quality: 0 });
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

  describe('daysUntilDue', () => {
    it('returns negative for overdue cards', () => {
      const state = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        dueDate: new Date(Date.now() - 86400000).toISOString(),
      };
      expect(daysUntilDue(state)).toBeLessThan(0);
    });

    it('returns positive for future due cards', () => {
      const state = {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 1,
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      };
      expect(daysUntilDue(state)).toBeGreaterThan(0);
    });
  });

  describe('formatInterval', () => {
    it('returns "New" for interval 0', () => {
      expect(formatInterval(0)).toBe('New');
    });
    it('returns "1 day" for interval 1', () => {
      expect(formatInterval(1)).toBe('1 day');
    });
    it('returns "X days" for intervals 2-6', () => {
      expect(formatInterval(3)).toBe('3 days');
    });
    it('returns "X weeks" for intervals 7-29', () => {
      expect(formatInterval(14)).toBe('2 weeks');
    });
    it('returns "X months" for intervals 30-364', () => {
      expect(formatInterval(60)).toBe('2 months');
    });
    it('returns "X years" for intervals 365+', () => {
      expect(formatInterval(730)).toBe('2 years');
    });
  });
});
