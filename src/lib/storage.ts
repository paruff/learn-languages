import { createInitialState, type SRSState } from '../utils/srs';

export type ReviewDirection = 'forward' | 'reverse';

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
  const raw = window.localStorage.getItem(storageKey(sourceLang, targetLang, direction, itemId));
  if (!raw) return createInitialState();
  return JSON.parse(raw) as SRSState;
}

export function saveState(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection,
  itemId: string,
  state: SRSState
): void {
  window.localStorage.setItem(
    storageKey(sourceLang, targetLang, direction, itemId),
    JSON.stringify(state)
  );
}
