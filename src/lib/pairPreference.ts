import { readJson, writeItem } from './storage';

const KEY = 'pairPreference';

export interface PairPreference {
  sourceLang: string;
  targetLang: string;
}

/** Last language pair the learner chose in the selector (#8), for defaulting nav/CTAs. */
export function loadPairPreference(): PairPreference | null {
  const pref = readJson<PairPreference>(KEY);
  return pref && typeof pref.sourceLang === 'string' && typeof pref.targetLang === 'string'
    ? pref
    : null;
}

export function savePairPreference(pref: PairPreference): void {
  writeItem(KEY, JSON.stringify(pref));
}
