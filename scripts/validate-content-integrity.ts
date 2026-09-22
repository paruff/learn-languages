import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import {
  checkRealisationReferences,
  checkVocabularyParity,
  type RealisationRef,
  type VocabularyRef,
} from '../src/lib/contentIntegrity.ts';

function findYamlFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return findYamlFiles(full);
    return full.endsWith('.yaml') || full.endsWith('.yml') ? [full] : [];
  });
}

function loadNodeIds(dir: string): Set<string> {
  const ids = new Set<string>();
  for (const file of findYamlFiles(dir)) {
    const data = parse(readFileSync(file, 'utf-8')) as { nodeId?: string };
    if (data?.nodeId) ids.add(data.nodeId);
  }
  return ids;
}

function loadRealisationRefs(dir: string): RealisationRef[] {
  return findYamlFiles(dir).map((file) => {
    const data = parse(readFileSync(file, 'utf-8')) as { nodeId?: string };
    return { file, nodeId: data?.nodeId ?? '' };
  });
}

function loadVocabularyRefs(dir: string): VocabularyRef[] {
  return findYamlFiles(dir).map((file) => {
    const data = parse(readFileSync(file, 'utf-8')) as {
      nodeId?: string;
      lang?: string;
      vocabulary?: unknown[];
    };
    return {
      file,
      nodeId: data?.nodeId ?? '',
      lang: data?.lang ?? '',
      vocabularyCount: data?.vocabulary?.length ?? 0,
    };
  });
}

function existsOrEmpty(dir: string): boolean {
  try {
    return statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

const cefrNodesDir = join(import.meta.dirname, '../src/content/cefr-nodes');
const realisationsDir = join(import.meta.dirname, '../src/content/realisations');

const cefrNodeIds = loadNodeIds(cefrNodesDir);
const realisations = existsOrEmpty(realisationsDir) ? loadRealisationRefs(realisationsDir) : [];

const result = checkRealisationReferences(cefrNodeIds, realisations);

if (!result.valid) {
  console.error(
    'Content integrity check FAILED (spec invariant I1): realisation references a nodeId with no matching cefr-node.'
  );
  for (const ref of result.missingReferences) {
    console.error(`  ${ref.file} -> nodeId "${ref.nodeId}" not found in cefr-nodes`);
  }
  globalThis.process.exit(1);
}

console.log(
  `Content integrity check passed: ${realisations.length} realisation(s) all reference valid cefr-nodes (${cefrNodeIds.size} node(s)).`
);

// Informational only (does not fail the build) -- see checkVocabularyParity's
// doc comment for why this is a warning, not a gate.
const vocabularyRefs = existsOrEmpty(realisationsDir) ? loadVocabularyRefs(realisationsDir) : [];
const parityWarnings = checkVocabularyParity(vocabularyRefs);
if (parityWarnings.length > 0) {
  console.warn(
    `\nVocabulary-count parity warning: ${parityWarnings.length} node(s) have realisations with mismatched vocabulary counts (informational, not a build failure):`
  );
  for (const warning of parityWarnings) {
    const summary = warning.counts.map((c) => `${c.lang}=${c.count}`).join(', ');
    console.warn(`  ${warning.nodeId}: ${summary}`);
  }
}
