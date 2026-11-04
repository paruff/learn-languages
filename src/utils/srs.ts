// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo 2: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2

export interface SRSState {
  interval: number; // days until next review
  easeFactor: number; // easiness factor (default 2.5)
  repetitions: number; // successful reviews in a row
  dueDate: string; // ISO date string
  lastReviewed?: string; // ISO date string
}

export interface SRSInput {
  state: SRSState;
  quality: number; // 0-5: 0=complete blackout, 5=perfect recall
}

/**
 * Calculate next review interval using SM-2 algorithm
 * @param state Current SRS state
 * @param quality Recall quality (0-5)
 * @returns Updated SRS state
 */
export function calculateNextReview({ state, quality }: SRSInput): SRSState {
  let { interval, easeFactor, repetitions } = state;

  // Quality < 3 means failed recall - reset
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor based on quality; a failed recall leaves it alone (SM-2).
  // EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
  if (quality >= 3) {
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  }

  // Clamp ease factor to minimum 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Due from the start of the local day, so a card graded at 9pm is there at 8am.
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);
  dueDate.setHours(0, 0, 0, 0);

  return {
    interval,
    easeFactor: Math.round(easeFactor * 100) / 100,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReviewed: new Date().toISOString(),
  };
}

/**
 * Create initial SRS state for a new card
 */
export function createInitialState(): SRSState {
  return {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    dueDate: new Date().toISOString(),
  };
}

/**
 * Check if a card is due for review
 */
export function isDue(state: SRSState): boolean {
  return new Date(state.dueDate) <= new Date();
}
