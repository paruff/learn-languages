import { SCHEDULER_ID, schedule } from '../utils/srs';
import { loadState, saveState, type ReviewDirection } from './storage';
import { appendGrade } from './gradeLog';

export interface ApplyGradeInput {
  sourceLang: string;
  targetLang: string;
  direction: ReviewDirection;
  itemId: string;
  /** UI grade 1-4 (Again/Hard/Good/Easy). */
  uiGrade: number;
  day: string;
  /** False for a passing same-session repeat (spec L23b): logged, but the card is not rescheduled. */
  countsTowardSchedule: boolean;
  suggestedGrade?: number;
  typedCorrect?: boolean;
  /** When the grade was given; defaults to the current time. */
  now?: Date;
}

/**
 * Logs one grade and reschedules the card. Card state is re-read from storage here, not
 * held by the page, so two open tabs never overwrite each other with stale state (spec S10).
 * `saved` is false when any write failed; the page must then show the S9 notice.
 */
export function applyGrade(input: ApplyGradeInput): { saved: boolean } {
  const { sourceLang, targetLang, direction, itemId, uiGrade } = input;
  const entry = {
    item: itemId,
    dir: direction,
    q: uiGrade,
    d: input.day,
    s: SCHEDULER_ID,
    ...(input.suggestedGrade !== undefined
      ? { sg: input.suggestedGrade, ov: input.suggestedGrade !== uiGrade }
      : {}),
    ...(input.typedCorrect !== undefined ? { tr: input.typedCorrect } : {}),
  };
  let saved = appendGrade(sourceLang, targetLang, entry);
  if (input.countsTowardSchedule) {
    const state = loadState(sourceLang, targetLang, direction, itemId);
    const next = schedule(state, uiGrade, input.now ?? new Date());
    saved = saveState(sourceLang, targetLang, direction, itemId, next) && saved;
  }
  return { saved };
}
