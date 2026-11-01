// Caps a review session to a bus-ride-sized chunk (JTBD-1, discovery-brief.md)
// instead of dumping the full due backlog on the learner at once.
export const SESSION_SIZE = 15;

/**
 * Round-robins items across nodeId groups instead of leaving them in blocked
 * source-content order — Make It Stick's interleaving effect (issue #44):
 * mixing topics within a session beats blocked practice on one topic at a
 * time, even though it feels harder. Apply before slicing to SESSION_SIZE so
 * the cap doesn't just take a run of one node's due cards.
 */
export function interleaveByNode<T extends { nodeId: string }>(items: T[]): T[] {
  const byNode = new Map<string, T[]>();
  for (const item of items) {
    const group = byNode.get(item.nodeId) ?? [];
    group.push(item);
    byNode.set(item.nodeId, group);
  }

  const groups = Array.from(byNode.values());
  const result: T[] = [];
  for (let round = 0; result.length < items.length; round++) {
    for (const group of groups) {
      if (round < group.length) {
        result.push(group[round]);
      }
    }
  }
  return result;
}

/** Correct recalls a new word needs in its first session (spec L23; Rawson & Dunlosky 2011). */
export const RELEARN_CRITERION = 1;

/** Slots a never-seen word takes in a session: its introduction plus one relearning pass. */
export const NEW_ITEM_COST = 2;

/** Criterion still outstanding after a grade. */
export function nextRemaining(remaining: number, correct: boolean): number {
  return correct ? Math.max(0, remaining - 1) : remaining;
}

/** Max never-seen words introduced per day (spec J2). */
export const DAILY_NEW_CAP = 10;

export interface SelectOptions<T> {
  /** nodeIds of lessons the learner has opened. */
  studied: Set<string>;
  /** Practise just this lesson's words (ignores `studied` and the new-word cap). */
  scope?: string;
  isNew: (item: T) => boolean;
  isDue: (item: T) => boolean;
  introducedToday: number;
  cap: number;
}

/**
 * Spec J2: a session draws only from studied lessons (or the one lesson in
 * `scope`), and introduces at most `cap` never-seen words per day. Interleaves
 * across the remaining lessons and trims to SESSION_SIZE.
 */
export function selectDue<T extends { nodeId: string }>(items: T[], o: SelectOptions<T>): T[] {
  const pool = items.filter((i) => (o.scope ? i.nodeId === o.scope : o.studied.has(i.nodeId)));
  let slots = o.scope ? Infinity : Math.max(0, o.cap - o.introducedToday);
  const due = pool.filter((i) => {
    if (!o.isDue(i)) return false;
    if (!o.isNew(i)) return true;
    return slots-- > 0;
  });
  // New words are charged NEW_ITEM_COST so relearning retries still fit in SESSION_SIZE.
  let budget = SESSION_SIZE;
  const out: T[] = [];
  for (const i of interleaveByNode(due)) {
    const cost = o.isNew(i) ? NEW_ITEM_COST : 1;
    if (cost > budget) continue;
    budget -= cost;
    out.push(i);
  }
  return out;
}
