export interface VocabularyPairItem {
  id: string;
  concept: string;
  term: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PairedVocabularyItem {
  nodeId: string;
  concept: string;
  source: VocabularyPairItem;
  target: VocabularyPairItem;
}

export interface RealisationLike {
  nodeId: string;
  lang: string;
  vocabulary: VocabularyPairItem[];
}

export const GLOSS_LANG = 'en-GB';

export function glossSide(target: VocabularyPairItem): VocabularyPairItem {
  return {
    id: `${target.id}:gloss`,
    concept: target.concept,
    term: target.translation,
    translation: target.term,
    example: target.exampleTranslation,
    exampleTranslation: target.example,
  };
}

/**
 * Pure pairing logic: joins two languages' realisations on nodeId + concept.
 * If source is the gloss language (en-GB), target items without a source-side
 * concept match still become cards using their own English gloss.
 *
 * Kept free of `astro:content` imports so it's unit-testable outside Astro's
 * Vite context — see pairLoader.ts for the content-layer wrapper.
 */
export function pairRealisations(
  realisations: RealisationLike[],
  sourceLang: string,
  targetLang: string
): PairedVocabularyItem[] {
  const sourceByNode = new Map(
    realisations.filter((r) => r.lang === sourceLang).map((r) => [r.nodeId, r])
  );
  const targetRealisations = realisations.filter((r) => r.lang === targetLang);

  const paired: PairedVocabularyItem[] = [];
  for (const target of targetRealisations) {
    const source = sourceByNode.get(target.nodeId);
    const sourceByConcept = new Map((source?.vocabulary ?? []).map((item) => [item.concept, item]));

    for (const targetItem of target.vocabulary) {
      const sourceItem = sourceByConcept.get(targetItem.concept);
      if (sourceItem) {
        paired.push({
          nodeId: target.nodeId,
          concept: targetItem.concept,
          source: sourceItem,
          target: targetItem,
        });
        continue;
      }
      if (sourceLang === GLOSS_LANG) {
        paired.push({
          nodeId: target.nodeId,
          concept: targetItem.concept,
          source: glossSide(targetItem),
          target: targetItem,
        });
      }
    }
  }

  return paired;
}
