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

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Clamp ease factor to minimum 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

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

/**
 * Get days until due (negative = overdue)
 */
export function daysUntilDue(state: SRSState): number {
  const due = new Date(state.dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get human-readable interval description
 */
export function formatInterval(interval: number): string {
  if (interval === 0) return 'New';
  if (interval === 1) return '1 day';
  if (interval < 7) return `${interval} days`;
  if (interval < 30) return `${Math.round(interval / 7)} weeks`;
  if (interval < 365) return `${Math.round(interval / 30)} months`;
  return `${Math.round(interval / 365)} years`;
}
