import { describe, it, expect } from 'vitest';
import { pairRealisations, type RealisationLike } from './pairing';

const enGreet: RealisationLike = {
  nodeId: 'A1-GREET-001',
  lang: 'en-GB',
  vocabulary: [
    {
      id: 'en-GB-A1-GREET-001-001',
      term: 'Hello',
      translation: 'Olá',
      example: 'Hello!',
      exampleTranslation: 'Olá!',
    },
    {
      id: 'en-GB-A1-GREET-001-002',
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
      term: 'Olá',
      translation: 'Hello',
      example: 'Olá!',
      exampleTranslation: 'Hello!',
    },
    {
      id: 'pt-PT-A1-GREET-001-002',
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
      term: 'One',
      translation: 'Um',
      example: 'One.',
      exampleTranslation: 'Um.',
    },
  ],
};

describe('pairRealisations', () => {
  it('returns correctly paired vocabulary for matching nodeIds', () => {
    const paired = pairRealisations([enGreet, ptGreet], 'en-GB', 'pt-PT');

    expect(paired).toHaveLength(2);
    expect(paired[0]).toEqual({
      nodeId: 'A1-GREET-001',
      seq: '001',
      source: enGreet.vocabulary[0],
      target: ptGreet.vocabulary[0],
    });
    expect(paired[1].source.term).toBe('Good morning');
    expect(paired[1].target.term).toBe('Bom dia');
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
