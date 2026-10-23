import { readJson, writeItem } from './storage';

/*
 * Spec J1: the A1 teaching order. Explicit (not ID-sorted: that put "Body parts"
 * first) and respects every A1 `prerequisiteNodes`. Nodes not listed sort after, by ID.
 */
export const A1_ORDER = [
  'A1-GREET-001',
  'A1-INTRO-001',
  'A1-INTRO-002',
  'A1-GREET-002',
  'A1-THANK-001',
  'A1-SORRY-001',
  'A1-REQUEST-001',
  'A1-CLARIFY-001',
  'A1-NUMB-001',
  'A1-TIME-001',
  'A1-FORM-001',
  'A1-FAMILY-001',
  'A1-FOOD-001',
  'A1-SHOP-001',
  'A1-OFFER-001',
  'A1-WANT-001',
  'A1-CAPAB-001',
  'A1-FEEL-001',
  'A1-BODY-001',
  'A1-ROUTINE-001',
  'A1-LOC-001',
  'A1-HOBBY-001',
  'A1-OPIN-001',
  'A1-WRITE-001',
];

export function orderLessons<T extends { nodeId: string }>(lessons: T[]): T[] {
  const rank = (id: string) => {
    const i = A1_ORDER.indexOf(id);
    return i === -1 ? A1_ORDER.length : i;
  };
  return [...lessons].sort(
    (a, b) => rank(a.nodeId) - rank(b.nodeId) || a.nodeId.localeCompare(b.nodeId)
  );
}

/** Index of the first lesson not yet studied, or -1 when all are. */
export function nextIndex(orderedIds: string[], studied: ReadonlySet<string>): number {
  return orderedIds.findIndex((id) => !studied.has(id));
}

/**
 * L12: soft prerequisites. Next lesson = first unstudied in order, redirected to its
 * first unstudied prerequisite (transitively). A recommendation only; nothing is locked.
 */
export function recommendNext(
  lessons: { nodeId: string; prerequisiteNodes?: string[] }[],
  studied: ReadonlySet<string>
): number {
  const byId = new Map(lessons.map((l, i) => [l.nodeId, i]));
  let i = nextIndex(
    lessons.map((l) => l.nodeId),
    studied
  );
  const seen = new Set<number>();
  while (i !== -1 && !seen.has(i)) {
    seen.add(i);
    const pre = (lessons[i].prerequisiteNodes ?? []).find((p) => byId.has(p) && !studied.has(p));
    if (pre === undefined) break;
    i = byId.get(pre)!;
  }
  return i;
}

const studiedKey = (sourceLang: string, targetLang: string) =>
  `studied:${sourceLang}:${targetLang}`;

export function loadStudied(sourceLang: string, targetLang: string): Set<string> {
  const raw = readJson<unknown>(studiedKey(sourceLang, targetLang));
  return new Set(Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []);
}

export function markStudied(sourceLang: string, targetLang: string, nodeId: string): void {
  const set = loadStudied(sourceLang, targetLang);
  if (set.has(nodeId)) return;
  writeItem(studiedKey(sourceLang, targetLang), JSON.stringify([...set, nodeId]));
}
