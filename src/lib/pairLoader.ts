import { getCollection } from 'astro:content';
import { pairRealisations, type PairedVocabularyItem, type RealisationLike } from './pairing';

export type { PairedVocabularyItem, RealisationLike, VocabularyPairItem } from './pairing';
export { pairRealisations } from './pairing';

export interface LanguagePair {
  sourceLang: string;
  targetLang: string;
}

/** Astro content-layer wrapper: given a source/target language pair, returns joined vocabulary. */
export async function loadPair(
  sourceLang: string,
  targetLang: string
): Promise<PairedVocabularyItem[]> {
  const realisations = await getCollection('realisations');
  const plain: RealisationLike[] = realisations.map((r) => ({
    nodeId: r.data.nodeId,
    lang: r.data.lang,
    vocabulary: r.data.vocabulary,
  }));
  return pairRealisations(plain, sourceLang, targetLang);
}

/**
 * Every source/target language pair that has at least one paired vocabulary
 * item — derived from actual content, not hardcoded (#8). Drives routing
 * (getStaticPaths) and the language pair selector.
 */
export async function getAvailablePairs(): Promise<LanguagePair[]> {
  const realisations = await getCollection('realisations');
  const plain: RealisationLike[] = realisations.map((r) => ({
    nodeId: r.data.nodeId,
    lang: r.data.lang,
    vocabulary: r.data.vocabulary,
  }));
  const langs = [...new Set(plain.map((r) => r.lang))];

  const pairs: LanguagePair[] = [];
  for (const sourceLang of langs) {
    for (const targetLang of langs) {
      if (sourceLang === targetLang) continue;
      if (pairRealisations(plain, sourceLang, targetLang).length > 0) {
        pairs.push({ sourceLang, targetLang });
      }
    }
  }
  return pairs;
}
