/**
 * Human-readable language name for any BCP-47 code, via the platform's own
 * locale data — zero maintenance as new target languages are added, unlike
 * a hand-maintained lookup table. `Intl.DisplayNames` doesn't throw for a
 * subtag it can't resolve; it echoes the subtag back verbatim, so that case
 * is detected and the full original code is returned instead.
 */
export function languageName(code: string): string {
  const base = code.split('-')[0];
  const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
  const resolved = displayNames.of(base);

  if (!resolved || resolved.toLowerCase() === base.toLowerCase()) {
    return code;
  }
  return resolved;
}
