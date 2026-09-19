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
