import { readJson, writeItem } from './storage';

/** Spec L20: a checkpoint is offered no sooner than this many days after study. */
export const CHECKPOINT_MIN_DAYS = 7;
export const CHECKPOINT_SIZE = 5;

export interface CheckpointResult {
  date: string;
  correct: number;
  total: number;
  /** The learner's self-rating against the node's CEFR Can-Do. */
  canDo: boolean;
}

const DAY_MS = 86_400_000;
const studiedAtKey = (s: string, t: string) => `studied-at:${s}:${t}`;
const resultKey = (s: string, t: string, nodeId: string) => `checkpoint:${s}:${t}:${nodeId}`;

/** nodeId → first-study date (YYYY-MM-DD). Lessons studied before L20 shipped have no date. */
export function loadStudiedAt(s: string, t: string): Record<string, string> {
  const raw = readJson<unknown>(studiedAtKey(s, t));
  return raw && typeof raw === 'object' && !Array.isArray(raw)
    ? (raw as Record<string, string>)
    : {};
}

export function markStudiedAt(s: string, t: string, nodeId: string, date: string): void {
  const all = loadStudiedAt(s, t);
  if (all[nodeId]) return;
  writeItem(studiedAtKey(s, t), JSON.stringify({ ...all, [nodeId]: date }));
}

/** Lessons studied ≥ CHECKPOINT_MIN_DAYS ago whose checkpoint hasn't been taken. */
export function checkpointNodes(
  studiedAt: Record<string, string>,
  today: string,
  done: Set<string>
): string[] {
  return Object.entries(studiedAt)
    .filter(
      ([id, d]) =>
        !done.has(id) && (Date.parse(today) - Date.parse(d)) / DAY_MS >= CHECKPOINT_MIN_DAYS
    )
    .map(([id]) => id);
}

/** Items from the node the learner has never graded in review (so it's a true transfer check). */
export function pickUnseen<T extends { nodeId: string }>(
  items: T[],
  nodeId: string,
  hasBeenSeen: (item: T) => boolean
): T[] {
  return items.filter((i) => i.nodeId === nodeId && !hasBeenSeen(i)).slice(0, CHECKPOINT_SIZE);
}

export function saveCheckpoint(s: string, t: string, nodeId: string, r: CheckpointResult): void {
  writeItem(resultKey(s, t, nodeId), JSON.stringify(r));
}

export function loadCheckpoint(s: string, t: string, nodeId: string): CheckpointResult | null {
  return readJson<CheckpointResult>(resultKey(s, t, nodeId));
}
