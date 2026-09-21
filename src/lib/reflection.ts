export type ReflectionResponse = 'easy' | 'had-to-think' | 'guessed';

function reflectionKey(sourceLang: string, targetLang: string, date: string): string {
  return `reflection:${sourceLang}:${targetLang}:${date}`;
}

/**
 * Post-session reflection (issue #89, Make It Stick's reflection effect) —
 * an optional, skippable self-check, never graded or sent anywhere. Scoped
 * per day so a learner who returns later the same day sees their earlier
 * response instead of being asked again.
 */
export function saveReflection(
  sourceLang: string,
  targetLang: string,
  response: ReflectionResponse,
  date: string
): void {
  window.localStorage.setItem(reflectionKey(sourceLang, targetLang, date), response);
}

export function loadReflection(
  sourceLang: string,
  targetLang: string,
  date: string
): ReflectionResponse | null {
  const raw = window.localStorage.getItem(reflectionKey(sourceLang, targetLang, date));
  return raw === 'easy' || raw === 'had-to-think' || raw === 'guessed' ? raw : null;
}
