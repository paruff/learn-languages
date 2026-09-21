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
