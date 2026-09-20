export interface VocabularyPairItem {
  id: string;
  term: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PairedVocabularyItem {
  nodeId: string;
  seq: string;
  source: VocabularyPairItem;
  target: VocabularyPairItem;
}

export interface RealisationLike {
  nodeId: string;
  lang: string;
  vocabulary: VocabularyPairItem[];
}

function seqFromId(id: string, lang: string, nodeId: string): string {
  return id.replace(`${lang}-${nodeId}-`, '');
}

/**
 * Pure pairing logic: joins two languages' realisations on nodeId, then on
 * vocabulary item sequence (the part of the id after `{lang}-{nodeId}-`).
 * Nodes or items missing a pairing are skipped, not thrown (spec §12.2).
 *
 * Kept free of `astro:content` imports so it's unit-testable outside Astro's
 * Vite context — see pairLoader.ts for the content-layer wrapper.
 */
export function pairRealisations(
  realisations: RealisationLike[],
  sourceLang: string,
  targetLang: string
): PairedVocabularyItem[] {
  const sourceRealisations = realisations.filter((r) => r.lang === sourceLang);
  const targetByNode = new Map(
    realisations.filter((r) => r.lang === targetLang).map((r) => [r.nodeId, r])
  );

  const paired: PairedVocabularyItem[] = [];
  for (const source of sourceRealisations) {
    const target = targetByNode.get(source.nodeId);
    if (!target) continue;

    const targetBySeq = new Map(
      target.vocabulary.map((item) => [seqFromId(item.id, targetLang, source.nodeId), item])
    );

    for (const sourceItem of source.vocabulary) {
      const seq = seqFromId(sourceItem.id, sourceLang, source.nodeId);
      const targetItem = targetBySeq.get(seq);
      if (!targetItem) continue;

      paired.push({ nodeId: source.nodeId, seq, source: sourceItem, target: targetItem });
    }
  }

  return paired;
}
