import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import {
  checkRealisationReferences,
  checkVocabularyParity,
  checkConcepts,
  checkPairAlignment,
  checkImageCredits,
  type ConceptRef,
  type RealisationRef,
  type VocabularyRef,
} from '../src/lib/contentIntegrity.ts';
import { checkConceptImages, type ConceptImage } from '../src/lib/conceptImages.ts';

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

function loadConceptRefs(dir: string): ConceptRef[] {
  return findYamlFiles(dir).map((file) => {
    const data = parse(readFileSync(file, 'utf-8')) as {
      nodeId?: string;
      lang?: string;
      vocabulary?: {
        id?: string;
        concept?: string;
        term?: string;
        translation?: string;
      }[];
    };
    return {
      file,
      nodeId: data?.nodeId ?? '',
      lang: data?.lang ?? '',
      items: (data?.vocabulary ?? []).map((item) => ({
        id: item.id ?? '',
        concept: item.concept ?? '',
        term: item.term ?? '',
        translation: item.translation ?? '',
      })),
    };
  });
}

function loadImageRefs(dir: string): string[] {
  const files: string[] = [];
  for (const file of findYamlFiles(dir)) {
    const data = parse(readFileSync(file, 'utf-8')) as {
      vocabulary?: { imageUrl?: string }[];
    };
    for (const item of data?.vocabulary ?? []) {
      if (item.imageUrl) files.push(item.imageUrl);
    }
  }
  return files;
}

function loadCreditedImages(path: string): string[] {
  return [...readFileSync(path, 'utf-8').matchAll(/^\|\s*`([^`]+\.webp)`/gm)].map(
    (match) => match[1]
  );
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

const conceptRefs = existsOrEmpty(realisationsDir) ? loadConceptRefs(realisationsDir) : [];
const conceptErrors = checkConcepts(conceptRefs);
const alignmentErrors = checkPairAlignment(conceptRefs);
if (conceptErrors.length > 0 || alignmentErrors.length > 0) {
  console.error('\nContent integrity check FAILED (concept pairing):');
  for (const line of conceptErrors) console.error(`  ${line}`);
  for (const line of alignmentErrors) console.error(`  ${line}`);
  globalThis.process.exit(1);
}

// Every image referenced from content must exist and carry a credit row.
// Orphan files are allowed: the legacy `imageUrl` items were sourced before the
// concept-image index existed and are credited directly in CREDITS.md.
const conceptImages = parse(
  readFileSync(join(import.meta.dirname, '../src/content/concept-images/index.yaml'), 'utf-8')
) as ConceptImage[];
const imageDir = join(import.meta.dirname, '../public/vocab-images');
const imageFiles = readdirSync(imageDir);
const allImageErrors = checkConceptImages(conceptImages, imageFiles);
const missingImageErrors = allImageErrors.filter((error) => !error.startsWith('orphan file:'));
const creditErrors = checkImageCredits(
  existsOrEmpty(realisationsDir) ? loadImageRefs(realisationsDir) : [],
  loadCreditedImages(join(imageDir, 'CREDITS.md'))
);
if (missingImageErrors.length > 0 || creditErrors.length > 0) {
  console.error('\nContent integrity check FAILED (vocabulary images):');
  for (const line of missingImageErrors) console.error(`  ${line}`);
  for (const line of creditErrors) console.error(`  ${line}`);
  globalThis.process.exit(1);
}
const orphanCount = allImageErrors.length - missingImageErrors.length;
console.log(
  `Vocabulary image check passed: ${conceptImages.length} indexed concept(s), ${orphanCount} legacy file(s) credited in CREDITS.md.`
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
