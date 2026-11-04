/**
 * The learner's calendar day as YYYY-MM-DD, in device-local time. `toISOString()`
 * is UTC, which splits one evening of study across two "days" for anyone far from it.
 */
export function localDay(now: Date = new Date()): string {
  const p = (n: number): string => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}
