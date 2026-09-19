const KEY = 'pairPreference';

export interface PairPreference {
  sourceLang: string;
  targetLang: string;
}

/** Last language pair the learner chose in the selector (#8), for defaulting nav/CTAs. */
export function loadPairPreference(): PairPreference | null {
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw) as PairPreference;
}

export function savePairPreference(pref: PairPreference): void {
  window.localStorage.setItem(KEY, JSON.stringify(pref));
}
