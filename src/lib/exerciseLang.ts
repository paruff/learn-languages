// Exercise ids are prefixed with the language they are written in
// (e.g. "pt-PT-a1-food-001-mc-001"); that is the target language they teach.
export function exerciseLang(id: string): string | undefined {
  return id.match(/^([a-z]{2}-[A-Z]{2})-/)?.[1];
}

export function exercisesForTarget<T extends { id: string; lessonId: string }>(
  exercises: T[],
  targetLang: string
): T[] {
  return exercises.filter((e) => exerciseLang(e.id) === targetLang);
}
