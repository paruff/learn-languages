import { describe, it, expect } from 'vitest';
import { GLOSS_LANG, glossSide, pairRealisations, type RealisationLike } from './pairing';

const enGreet: RealisationLike = {
  nodeId: 'A1-GREET-001',
  lang: 'en-GB',
  vocabulary: [
    {
      id: 'en-GB-A1-GREET-001-001',
      concept: 'hello',
      term: 'Hello',
      translation: 'Olá',
      example: 'Hello!',
      exampleTranslation: 'Olá!',
    },
    {
      id: 'en-GB-A1-GREET-001-002',
      concept: 'good-morning',
      term: 'Good morning',
      translation: 'Bom dia',
      example: 'Good morning!',
      exampleTranslation: 'Bom dia!',
    },
  ],
};

const ptGreet: RealisationLike = {
  nodeId: 'A1-GREET-001',
  lang: 'pt-PT',
  vocabulary: [
    {
      id: 'pt-PT-A1-GREET-001-001',
      concept: 'hello',
      term: 'Olá',
      translation: 'Hello',
      example: 'Olá!',
      exampleTranslation: 'Hello!',
    },
    {
      id: 'pt-PT-A1-GREET-001-002',
      concept: 'good-morning',
      term: 'Bom dia',
      translation: 'Good morning',
      example: 'Bom dia!',
      exampleTranslation: 'Good morning!',
    },
  ],
};

const enNumbers: RealisationLike = {
  nodeId: 'A1-NUMB-001',
  lang: 'en-GB',
  vocabulary: [
    {
      id: 'en-GB-A1-NUMB-001-001',
      concept: 'one',
      term: 'One',
      translation: 'Um',
      example: 'One.',
      exampleTranslation: 'Um.',
    },
  ],
};

describe('pairRealisations', () => {
  it('pairs items by concept, not position', () => {
    const ptReordered: RealisationLike = {
      ...ptGreet,
      vocabulary: [ptGreet.vocabulary[1], ptGreet.vocabulary[0]],
    };

    const paired = pairRealisations([enGreet, ptReordered], 'en-GB', 'pt-PT');

    expect(paired).toHaveLength(2);
    expect(paired[0].source.term).toBe('Good morning');
    expect(paired[0].target.term).toBe('Bom dia');
    expect(paired[1].source.term).toBe('Hello');
    expect(paired[1].target.term).toBe('Olá');
  });

  it('returns correctly paired vocabulary for matching concepts', () => {
    const paired = pairRealisations([enGreet, ptGreet], 'en-GB', 'pt-PT');

    expect(paired).toHaveLength(2);
    expect(paired[0]).toEqual({
      nodeId: 'A1-GREET-001',
      concept: 'hello',
      source: enGreet.vocabulary[0],
      target: ptGreet.vocabulary[0],
    });
    expect(paired[1].source.term).toBe('Good morning');
    expect(paired[1].target.term).toBe('Bom dia');
  });

  it('source = GLOSS_LANG pairs unmatched target items against their own gloss', () => {
    const ptOnly: RealisationLike = {
      nodeId: 'A1-FOOD-001',
      lang: 'pt-PT',
      vocabulary: [
        {
          id: 'pt-PT-A1-FOOD-001-001',
          concept: 'bread',
          term: 'pão',
          translation: 'bread',
          example: 'Como pão.',
          exampleTranslation: 'I eat bread.',
        },
      ],
    };

    const paired = pairRealisations([enGreet, ptOnly], GLOSS_LANG, 'pt-PT');
    expect(paired).toEqual([
      {
        nodeId: 'A1-FOOD-001',
        concept: 'bread',
        source: glossSide(ptOnly.vocabulary[0]),
        target: ptOnly.vocabulary[0],
      },
    ]);
  });

  it('non-gloss source skips unmatched target items', () => {
    const deOnly: RealisationLike = {
      nodeId: 'A1-FOOD-001',
      lang: 'de-DE',
      vocabulary: [
        {
          id: 'de-DE-A1-FOOD-001-001',
          concept: 'bread',
          term: 'Brot',
          translation: 'bread',
          example: 'Ich esse Brot.',
          exampleTranslation: 'I eat bread.',
        },
      ],
    };

    const paired = pairRealisations([ptGreet, deOnly], 'pt-PT', 'de-DE');
    expect(paired).toEqual([]);
  });

  it('skips nodes present in source but missing from target, instead of throwing', () => {
    const paired = pairRealisations([enGreet, ptGreet, enNumbers], 'en-GB', 'pt-PT');

    // enNumbers has no pt-PT counterpart in the fixture — its item must not appear.
    expect(paired.some((p) => p.nodeId === 'A1-NUMB-001')).toBe(false);
    expect(paired).toHaveLength(2);
  });

  it('returns an empty array when there is no overlap at all', () => {
    const paired = pairRealisations([enNumbers], 'en-GB', 'pt-PT');
    expect(paired).toEqual([]);
  });

  it('item ids are unique across the paired result', () => {
    const paired = pairRealisations([enGreet, ptGreet], 'en-GB', 'pt-PT');
    const ids = paired.flatMap((p) => [p.source.id, p.target.id]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not pair different concepts at the same position', () => {
    const deBody: RealisationLike = {
      nodeId: 'A1-BODY-001',
      lang: 'de-DE',
      vocabulary: [
        {
          id: 'de-DE-A1-BODY-001-004',
          concept: 'belly',
          term: 'Bauch',
          translation: 'belly',
          example: 'Mein Bauch tut weh.',
          exampleTranslation: 'My belly hurts.',
        },
      ],
    };
    const ptBody: RealisationLike = {
      nodeId: 'A1-BODY-001',
      lang: 'pt-PT',
      vocabulary: [
        {
          id: 'pt-PT-A1-BODY-001-004',
          concept: 'eye',
          term: 'olho',
          translation: 'eye',
          example: 'O meu olho.',
          exampleTranslation: 'My eye.',
        },
      ],
    };

    expect(pairRealisations([deBody, ptBody], 'de-DE', 'pt-PT')).toEqual([]);
  });

  it('glossSide swaps term/translation and example/exampleTranslation', () => {
    const target = ptGreet.vocabulary[0];
    expect(glossSide(target)).toEqual({
      id: `${target.id}:gloss`,
      concept: target.concept,
      term: target.translation,
      translation: target.term,
      example: target.exampleTranslation,
      exampleTranslation: target.example,
    });
  });

  it('carries imageUrl and imageAlt through pairing when present', () => {
    const ptGreetWithImage: RealisationLike = {
      ...ptGreet,
      vocabulary: [
        { ...ptGreet.vocabulary[0], imageUrl: 'ola.webp', imageAlt: 'Two people waving hello' },
        ptGreet.vocabulary[1],
      ],
    };

    const paired = pairRealisations([enGreet, ptGreetWithImage], 'en-GB', 'pt-PT');

    expect(paired[0].target.imageUrl).toBe('ola.webp');
    expect(paired[0].target.imageAlt).toBe('Two people waving hello');
    // Items without an image stay undefined, not defaulted to something odd.
    expect(paired[1].target.imageUrl).toBeUndefined();
  });
});
