import { getCollection } from 'astro:content';
import { pairRealisations, type PairedVocabularyItem, type RealisationLike } from './pairing';

export type { PairedVocabularyItem, RealisationLike, VocabularyPairItem } from './pairing';
export { pairRealisations } from './pairing';

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
