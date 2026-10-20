export interface ConceptGap {
  nodeId: string;
  missing: string[];
}

export interface CoverageSummary {
  missingConcepts: number;
  missingNodes: number;
}

export interface CoverageBaseline {
  languages: Record<string, CoverageSummary>;
}

/** Concepts the expected (en-GB/pt-PT) inventory has but the target language does not. */
export function findConceptGaps(
  expected: Map<string, string[]>,
  actual: Map<string, string[]>
): ConceptGap[] {
  const gaps: ConceptGap[] = [];
  for (const [nodeId, concepts] of actual) {
    const expectedSet = new Set(expected.get(nodeId) ?? []);
    const actualSet = new Set(concepts);
    const missing = [...expectedSet].filter((concept) => !actualSet.has(concept)).sort();
    if (missing.length > 0) gaps.push({ nodeId, missing });
  }
  return gaps.sort((a, b) => a.nodeId.localeCompare(b.nodeId));
}

/** Nodes the expected inventory defines but the target language has no realisation for. */
export function findMissingNodes(
  expectedNodes: Iterable<string>,
  actualNodes: Iterable<string>,
  levels?: Set<string>
): string[] {
  const actual = new Set(actualNodes);
  return [...new Set(expectedNodes)]
    .filter((nodeId) => !actual.has(nodeId))
    .filter((nodeId) => !levels || levels.size === 0 || levels.has(nodeId.slice(0, 2)))
    .sort();
}

export function summariseCoverage(gaps: ConceptGap[], missingNodes: string[]): CoverageSummary {
  return {
    missingConcepts: gaps.reduce((total, gap) => total + gap.missing.length, 0),
    missingNodes: missingNodes.length,
  };
}

/**
 * Returns one human-readable message per regression. Coverage may improve or stay
 * at the accepted baseline; it may not grow without the baseline being updated
 * in the same PR.
 */
export function findRegressions(
  current: Record<string, CoverageSummary>,
  baseline: CoverageBaseline
): string[] {
  const regressions: string[] = [];
  for (const [language, summary] of Object.entries(current)) {
    const accepted = baseline.languages[language] ?? { missingConcepts: 0, missingNodes: 0 };
    if (summary.missingConcepts > accepted.missingConcepts) {
      regressions.push(
        `${language}: missing concepts grew from ${accepted.missingConcepts} to ${summary.missingConcepts}`
      );
    }
    if (summary.missingNodes > accepted.missingNodes) {
      regressions.push(
        `${language}: missing nodes grew from ${accepted.missingNodes} to ${summary.missingNodes}`
      );
    }
  }
  return regressions;
}
