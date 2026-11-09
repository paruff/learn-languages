import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

interface VocabularyItem {
  concept?: string;
  term?: string;
}

interface RealisationFile {
  nodeId?: string;
  lang?: string;
  vocabulary?: VocabularyItem[];
}

function findYamlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return findYamlFiles(full);
    return full.endsWith('.yaml') || full.endsWith('.yml') ? [full] : [];
  });
}

function loadLangConcepts(baseDir: string, lang: string): Map<string, string[]> {
  const dir = join(baseDir, lang);
  const byNode = new Map<string, string[]>();
  for (const file of findYamlFiles(dir)) {
    const data = parse(readFileSync(file, 'utf-8')) as RealisationFile;
    if (!data.nodeId) continue;
    const concepts = (data.vocabulary ?? [])
      .map((item) => item.concept ?? '')
      .filter((concept) => concept.length > 0);
    byNode.set(data.nodeId, concepts);
  }
  return byNode;
}

function loadEnglishGlosses(baseDir: string): Map<string, Map<string, string>> {
  const en = loadLangRealisation(baseDir, 'en-GB');
  const result = new Map<string, Map<string, string>>();
  for (const [nodeId, file] of en) {
    const glosses = new Map<string, string>();
    for (const item of file.vocabulary ?? []) {
      if (!item.concept || !item.term) continue;
      glosses.set(item.concept, item.term);
    }
    result.set(nodeId, glosses);
  }
  return result;
}

function loadLangRealisation(baseDir: string, lang: string): Map<string, RealisationFile> {
  const dir = join(baseDir, lang);
  const byNode = new Map<string, RealisationFile>();
  for (const file of findYamlFiles(dir)) {
    const data = parse(readFileSync(file, 'utf-8')) as RealisationFile;
    if (!data.nodeId) continue;
    byNode.set(data.nodeId, data);
  }
  return byNode;
}

const targetLang = process.argv[2];
if (!targetLang) {
  console.error('Usage: npm run report:coverage -- <lang>');
  globalThis.process.exit(1);
}

const levelsFilter = new Set(process.argv.slice(3).map((value) => value.toUpperCase()));
const realisationsDir = join(import.meta.dirname, '../src/content/realisations');

const enConcepts = loadLangConcepts(realisationsDir, 'en-GB');
const ptConcepts = loadLangConcepts(realisationsDir, 'pt-PT');
const targetConcepts = loadLangConcepts(realisationsDir, targetLang);
const enGlosses = loadEnglishGlosses(realisationsDir);

const inLevel = (nodeId: string): boolean =>
  levelsFilter.size === 0 ? true : levelsFilter.has(nodeId.slice(0, 2));
const expectedNodeIds = [...new Set([...enConcepts.keys(), ...ptConcepts.keys()])]
  .filter(inLevel)
  .sort();
// A node the target has no realisation for is a gap too; without this a missing node never shows up.
const missingNodeIds = expectedNodeIds.filter((nodeId) => !targetConcepts.has(nodeId));
const nodeIds = expectedNodeIds.filter((nodeId) => targetConcepts.has(nodeId));

let totalMissing = 0;
for (const nodeId of nodeIds) {
  const expected = new Set([...(enConcepts.get(nodeId) ?? []), ...(ptConcepts.get(nodeId) ?? [])]);
  const current = new Set(targetConcepts.get(nodeId) ?? []);
  const missing = [...expected].filter((concept) => !current.has(concept)).sort();
  totalMissing += missing.length;
  if (missing.length === 0) continue;

  console.log(`\n${nodeId} (${missing.length} missing)`);
  const nodeGlosses = enGlosses.get(nodeId);
  for (const concept of missing) {
    const gloss = nodeGlosses?.get(concept);
    console.log(`  - ${concept}${gloss ? ` (${gloss})` : ''}`);
  }
}

for (const nodeId of missingNodeIds) console.log(`\n${nodeId}: NO ${targetLang} realisation`);

if (totalMissing === 0 && missingNodeIds.length === 0) {
  console.log(`All clear: ${targetLang} has 0 missing concepts across ${nodeIds.length} node(s).`);
} else {
  console.log(
    `\n${targetLang}: ${totalMissing} missing concept(s), ${missingNodeIds.length} missing node(s) (of ${expectedNodeIds.length} expected).`
  );
  globalThis.process.exitCode = 1; // a gap fails the check, so it can be an exit criterion
}
