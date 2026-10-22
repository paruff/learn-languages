export interface TrackedItem {
  itemId: string;
  nodeId: string;
  cefrLevel: string;
  canDo: string;
  repetitions: number;
}

export interface LevelProgress {
  cefrLevel: string;
  totalItems: number;
  masteredItems: number;
  percent: number;
}

export interface NextRecommended {
  nodeId: string;
  cefrLevel: string;
  canDo: string;
}

// A card graduates past SM-2's learning phase after 2 successful reviews in a row.
const MASTERED_REPETITIONS = 2;

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Aggregates per-item SRS state into per-CEFR-level mastery (#9). Pure and
 * DOM/storage-free so it's unit-testable; the progress page supplies
 * `repetitions` read from localStorage per item.
 */
export function computeCefrProgress(items: TrackedItem[]): {
  levels: LevelProgress[];
  nextRecommended: NextRecommended | null;
} {
  const byLevel = new Map<string, TrackedItem[]>();
  for (const item of items) {
    const bucket = byLevel.get(item.cefrLevel) ?? [];
    bucket.push(item);
    byLevel.set(item.cefrLevel, bucket);
  }

  const levels = LEVEL_ORDER.filter((level) => byLevel.has(level)).map((cefrLevel) => {
    const bucket = byLevel.get(cefrLevel)!;
    const masteredItems = bucket.filter((i) => i.repetitions >= MASTERED_REPETITIONS).length;
    return {
      cefrLevel,
      totalItems: bucket.length,
      masteredItems,
      percent: Math.round((masteredItems / bucket.length) * 100),
    };
  });

  const nextItem = LEVEL_ORDER.flatMap((level) => byLevel.get(level) ?? []).find(
    (item) => item.repetitions < MASTERED_REPETITIONS
  );

  return {
    levels,
    nextRecommended: nextItem
      ? { nodeId: nextItem.nodeId, cefrLevel: nextItem.cefrLevel, canDo: nextItem.canDo }
      : null,
  };
}

export interface NodeProgress {
  nodeId: string;
  totalItems: number;
  masteredItems: number;
  percent: number;
}

/**
 * Aggregates per-item SRS state into per-lesson (nodeId) mastery (#37) — the
 * same MASTERED_REPETITIONS threshold as computeCefrProgress, so a lesson
 * card's "x/y mastered" agrees with the CEFR-level dashboard for the same
 * items, just grouped by nodeId instead of cefrLevel.
 */
export function computeNodeProgress(items: TrackedItem[]): Map<string, NodeProgress> {
  const byNode = new Map<string, TrackedItem[]>();
  for (const item of items) {
    const bucket = byNode.get(item.nodeId) ?? [];
    bucket.push(item);
    byNode.set(item.nodeId, bucket);
  }

  const result = new Map<string, NodeProgress>();
  for (const [nodeId, bucket] of byNode) {
    const masteredItems = bucket.filter((i) => i.repetitions >= MASTERED_REPETITIONS).length;
    result.set(nodeId, {
      nodeId,
      totalItems: bucket.length,
      masteredItems,
      percent: Math.round((masteredItems / bucket.length) * 100),
    });
  }
  return result;
}

/**
 * Aggregate mastery across all levels combined, independent of cefrLevel/canDo
 * (spec §1.1 desirable-difficulties calibration) — lets the review session
 * surface an overall mastery signal without loading the cefr-nodes collection.
 */
export function computeOverallMastery(items: { repetitions: number }[]): {
  masteredItems: number;
  totalItems: number;
  percent: number;
} {
  const masteredItems = items.filter((item) => item.repetitions >= MASTERED_REPETITIONS).length;
  const totalItems = items.length;
  return {
    masteredItems,
    totalItems,
    percent: totalItems === 0 ? 0 : Math.round((masteredItems / totalItems) * 100),
  };
}

export interface CanDoRow {
  nodeId: string;
  canDo: string;
  studied: boolean;
  practised: boolean;
  remembered: boolean;
}

export interface CanDoLevel {
  cefrLevel: string;
  /** The first level with a Can-Do not yet remembered: the learner's current goal (spec J3). */
  current: boolean;
  canDos: CanDoRow[];
}

/**
 * Spec J3: per level, each Can-Do with studied (lesson opened), practised (any
 * word graded) and remembered (any word recalled 7+ days later) flags.
 * ponytail: "any word" per Can-Do, not all; tighten if testers find it too generous.
 */
export function computeCanDoChecklist(
  items: TrackedItem[],
  studied: Set<string>,
  rememberedItemIds: Set<string>
): CanDoLevel[] {
  const levels = LEVEL_ORDER.map((cefrLevel) => {
    const byNode = new Map<string, TrackedItem[]>();
    for (const i of items.filter((x) => x.cefrLevel === cefrLevel)) {
      byNode.set(i.nodeId, [...(byNode.get(i.nodeId) ?? []), i]);
    }
    const canDos = [...byNode.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nodeId, group]) => ({
        nodeId,
        canDo: group[0].canDo,
        studied: studied.has(nodeId),
        practised: group.some((i) => i.repetitions >= 1),
        remembered: group.some((i) => rememberedItemIds.has(i.itemId)),
      }));
    return { cefrLevel, current: false, canDos };
  }).filter((l) => l.canDos.length > 0);
  const current =
    levels.find((l) => l.canDos.some((c) => !c.remembered)) ?? levels[levels.length - 1];
  return levels.map((l) => ({ ...l, current: l === current }));
}
