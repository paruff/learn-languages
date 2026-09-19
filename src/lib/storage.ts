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

function directionKey(sourceLang: string, targetLang: string): string {
  return `srs-direction:${sourceLang}:${targetLang}`;
}

/** Learner's preferred review direction per pair (#10), defaulting to forward. */
export function loadDirectionPreference(sourceLang: string, targetLang: string): ReviewDirection {
  const raw = window.localStorage.getItem(directionKey(sourceLang, targetLang));
  return raw === 'reverse' ? 'reverse' : 'forward';
}

export function saveDirectionPreference(
  sourceLang: string,
  targetLang: string,
  direction: ReviewDirection
): void {
  window.localStorage.setItem(directionKey(sourceLang, targetLang), direction);
}
