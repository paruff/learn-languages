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

export interface ConceptRef {
  file: string;
  nodeId: string;
  lang: string;
  items: { id: string; concept: string | undefined; term: string; translation: string }[];
}

interface GlossItem {
  term: string;
  translation: string;
}

const KEBAB_CONCEPT_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

export function glossOf(lang: string, item: GlossItem): string {
  return lang === GLOSS_LANG ? item.term : item.translation;
}

export function normaliseGloss(gloss: string): string[] {
  const withoutDiacritics = gloss
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '');
  const parts = withoutDiacritics.split(/[/,;]/g);

  const normalised = parts
    .map((part) =>
      part
        .trim()
        .replace(/(\.\.\.|…)$/g, '')
        .replace(/^to\s+/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((part) => part.length > 0);

  return [...new Set(normalised)];
}

export function checkConcepts(refs: ConceptRef[]): string[] {
  const errors: string[] = [];

  for (const ref of refs) {
    const seen = new Map<string, string>();
    for (const item of ref.items) {
      if (!item.concept) {
        errors.push(`${ref.file}: missing concept for item ${item.id}`);
        continue;
      }
      if (!KEBAB_CONCEPT_RE.test(item.concept)) {
        errors.push(`${ref.file}: item ${item.id} has non-kebab concept "${item.concept}"`);
      }
      const firstId = seen.get(item.concept);
      if (firstId) {
        errors.push(
          `${ref.file}: duplicate concept "${item.concept}" in ${ref.nodeId} (${firstId}, ${item.id})`
        );
      } else {
        seen.set(item.concept, item.id);
      }
    }
  }

  return errors;
}

function intersects(a: readonly string[], b: readonly string[]): boolean {
  const setB = new Set(b);
  return a.some((entry) => setB.has(entry));
}

export function checkPairAlignment(refs: ConceptRef[]): string[] {
  const byNodeAndConcept = new Map<
    string,
    {
      file: string;
      nodeId: string;
      lang: string;
      concept: string;
      gloss: string;
      glosses: string[];
    }[]
  >();

  for (const ref of refs) {
    for (const item of ref.items) {
      if (!item.concept) continue;
      const gloss = glossOf(ref.lang, item);
      const key = `${ref.nodeId}::${item.concept}`;
      const bucket = byNodeAndConcept.get(key) ?? [];
      bucket.push({
        file: ref.file,
        nodeId: ref.nodeId,
        lang: ref.lang,
        concept: item.concept,
        gloss,
        glosses: normaliseGloss(gloss),
      });
      byNodeAndConcept.set(key, bucket);
    }
  }

  const errors: string[] = [];
  for (const entries of byNodeAndConcept.values()) {
    for (let i = 0; i < entries.length; i += 1) {
      for (let j = i + 1; j < entries.length; j += 1) {
        const left = entries[i];
        const right = entries[j];
        if (left.lang === right.lang) continue;
        if (intersects(left.glosses, right.glosses)) continue;
        errors.push(
          `${left.nodeId}: concept "${left.concept}" gloss mismatch ${left.lang}="${left.gloss}" vs ${right.lang}="${right.gloss}" (${left.file}, ${right.file})`
        );
      }
    }
  }

  return errors;
}
import { GLOSS_LANG } from './pairing.ts';

/**
 * Every image referenced from content must have a row in
 * `public/vocab-images/CREDITS.md`: the site is published under CC-BY-4.0, so
 * an uncredited image is a licensing liability, not just a missing reference.
 */
export function checkImageCredits(
  referenced: Iterable<string>,
  credited: Iterable<string>
): string[] {
  const creditedSet = new Set(credited);
  return [...new Set(referenced)]
    .filter((file) => !creditedSet.has(file))
    .sort()
    .map((file) => `missing credit row: ${file}`);
}
