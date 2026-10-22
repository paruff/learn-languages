import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import {
  findConceptGaps,
  findMissingNodes,
  findRegressions,
  summariseCoverage,
  type CoverageBaseline,
  type CoverageSummary,
} from '../src/lib/coverage.ts';

interface VocabularyItem {
  concept?: string;
}

interface RealisationFile {
  nodeId?: string;
  vocabulary?: VocabularyItem[];
}

const REALISATIONS_DIR = join(import.meta.dirname, '../src/content/realisations');
const BASELINE_PATH = join(import.meta.dirname, '../docs/coverage-baseline.json');

function findYamlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return findYamlFiles(full);
    return full.endsWith('.yaml') || full.endsWith('.yml') ? [full] : [];
  });
}

function loadConcepts(lang: string): Map<string, string[]> {
  const byNode = new Map<string, string[]>();
  for (const file of findYamlFiles(join(REALISATIONS_DIR, lang))) {
    const data = parse(readFileSync(file, 'utf-8')) as RealisationFile;
    if (!data.nodeId) continue;
    const concepts = (data.vocabulary ?? [])
      .map((item) => item.concept ?? '')
      .filter((concept) => concept.length > 0);
    byNode.set(data.nodeId, [...(byNode.get(data.nodeId) ?? []), ...concepts]);
  }
  return byNode;
}

const enGb = loadConcepts('en-GB');

// en-GB is the canonical inventory: every realisation pairs through its English
// gloss, and the pt-PT source occasionally uses an alternative key for the same
// item (`media` vs `the-media`), which a union would double-count as a gap.
const expectedConcepts = enGb;
const expectedNodes = new Set(enGb.keys());

const targetLanguages = readdirSync(REALISATIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((lang) => lang !== 'en-GB' && lang !== 'pt-PT')
  .sort();

const current: Record<string, CoverageSummary> = {};
for (const lang of targetLanguages) {
  const actual = loadConcepts(lang);
  const gaps = findConceptGaps(expectedConcepts, actual);
  const missingNodes = findMissingNodes(expectedNodes, actual.keys());
  current[lang] = summariseCoverage(gaps, missingNodes);
}

const update = process.argv.includes('--update');
if (update) {
  const baseline: CoverageBaseline = { languages: current };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`Wrote ${BASELINE_PATH}`);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf-8')) as CoverageBaseline;
for (const [lang, summary] of Object.entries(current)) {
  const accepted = baseline.languages[lang];
  console.log(
    `${lang}: ${summary.missingConcepts} missing concept(s), ${summary.missingNodes} missing node(s)` +
      (accepted
        ? ` (accepted: ${accepted.missingConcepts}, ${accepted.missingNodes})`
        : ' (no accepted baseline)')
  );
}

const regressions = findRegressions(current, baseline);
if (regressions.length > 0) {
  console.error('\nCoverage regressions:');
  for (const regression of regressions) console.error(`  - ${regression}`);
  console.error('\nIf the gap is intentional, update docs/coverage-baseline.json in this PR.');
  globalThis.process.exit(1);
}

console.log('\nCoverage gate passed: no new gaps.');
