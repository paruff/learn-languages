export interface RealisationRef {
  file: string;
  nodeId: string;
}

export interface IntegrityCheckResult {
  valid: boolean;
  missingReferences: RealisationRef[];
}

/**
 * Pure check for spec invariant I1: every realisation MUST reference an
 * existing nodeId in the cefr-nodes collection. Kept free of fs/yaml so it's
 * unit-testable with fixtures — see scripts/validate-content-integrity.ts
 * for the file-reading CLI wrapper that runs this in CI.
 */
export function checkRealisationReferences(
  cefrNodeIds: ReadonlySet<string>,
  realisations: RealisationRef[]
): IntegrityCheckResult {
  const missingReferences = realisations.filter((r) => !cefrNodeIds.has(r.nodeId));
  return { valid: missingReferences.length === 0, missingReferences };
}

export interface VocabularyRef {
  file: string;
  nodeId: string;
  lang: string;
  vocabularyCount: number;
}

export interface VocabularyParityWarning {
  nodeId: string;
  counts: { lang: string; file: string; count: number }[];
}

/**
 * Informational check (not a hard gate — see scripts/validate-content-integrity.ts):
 * flags a nodeId whose realisations disagree on vocabulary-item count. This
 * is exactly the class of bug the en-DE/de-DE mismatch was (#117-119) — one
 * side of an intended pairing authored richer content than the other,
 * silently dropped by pairRealisations()'s "skip missing, don't throw"
 * design with no error anywhere. Not a hard failure because legitimate
 * per-language content-depth variance already exists across this repo
 * (e.g. an A1 node with 3 en-GB items and 3 es-ES items is fine; the signal
 * here is a MISMATCH within one nodeId, not any particular count).
 */
export function checkVocabularyParity(realisations: VocabularyRef[]): VocabularyParityWarning[] {
  const byNode = new Map<string, VocabularyRef[]>();
  for (const r of realisations) {
    const bucket = byNode.get(r.nodeId) ?? [];
    bucket.push(r);
    byNode.set(r.nodeId, bucket);
  }

  const warnings: VocabularyParityWarning[] = [];
  for (const [nodeId, refs] of byNode) {
    const counts = new Set(refs.map((r) => r.vocabularyCount));
    if (counts.size > 1) {
      warnings.push({
        nodeId,
        counts: refs.map((r) => ({ lang: r.lang, file: r.file, count: r.vocabularyCount })),
      });
    }
  }
  return warnings;
}
