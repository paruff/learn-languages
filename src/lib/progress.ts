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
