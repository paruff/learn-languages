/**
 * Spec C12: an item ID is immutable once released. Compares the IDs (and their terms) at a
 * base ref with the current content; `exceptions` are IDs a human acknowledged as retired or
 * as a pure typo fix, listed in `src/content/shipped-id-exceptions.txt`.
 */
export function checkItemIds(
  base: Record<string, string>,
  current: Record<string, string>,
  exceptions: Set<string>
): string[] {
  const errors: string[] = [];
  for (const [id, term] of Object.entries(base)) {
    if (exceptions.has(id)) continue;
    if (!(id in current)) {
      errors.push(
        `${id} ("${term}") was released and is now missing; IDs are never removed or reused`
      );
    } else if (current[id] !== term) {
      errors.push(
        `${id} was released as "${term}" and now says "${current[id]}"; give the new word a new ID`
      );
    }
  }
  return errors;
}
