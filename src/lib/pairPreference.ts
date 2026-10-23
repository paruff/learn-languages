import { readJson, writeItem } from './storage';

const KEY = 'pairPreference';

export interface PairPreference {
  sourceLang: string;
  targetLang: string;
}

/** Last language pair the learner chose in the selector (#8), for defaulting nav/CTAs. */
export function loadPairPreference(
  validPairs: PairPreference[] = readValidPairs()
): PairPreference | null {
  const pref = readJson<PairPreference>(KEY);
  if (!pref || typeof pref.sourceLang !== 'string' || typeof pref.targetLang !== 'string') {
    return null;
  }
  // A stale or corrupt saved pair (e.g. "en-DE") would build links that 404 —
  // only honour it when it is a pair the site actually has.
  const known = validPairs.some(
    (p) => p.sourceLang === pref.sourceLang && p.targetLang === pref.targetLang
  );
  return known ? pref : null;
}

/** Pages that apply the preference embed the real pairs as #valid-pairs JSON. */
function readValidPairs(): PairPreference[] {
  try {
    return JSON.parse(document.getElementById('valid-pairs')?.textContent ?? '[]');
  } catch {
    return [];
  }
}

export function savePairPreference(pref: PairPreference): void {
  writeItem(KEY, JSON.stringify(pref));
}
