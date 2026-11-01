import { readdirSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { parse } from 'yaml';
import {
  attachImages,
  checkConceptImages,
  resolveConceptImage,
  type ConceptImage,
} from './conceptImages';

describe('resolveConceptImage', () => {
  const images: ConceptImage[] = [
    {
      concept: 'bread',
      file: 'bread.webp',
      alt: 'A loaf of bread',
      source: 'https://example.com/bread',
      license: 'CC BY 4.0',
    },
    {
      concept: 'pharmacy',
      file: 'pharmacy.webp',
      alt: 'A pharmacy interior',
      source: 'https://example.com/pharmacy',
      license: 'CC BY 4.0',
      overrides: {
        'pt-PT': {
          file: 'pharmacy.pt-PT.webp',
          alt: 'A pharmacy in Portugal',
          source: 'https://example.com/pharmacy-pt',
          license: 'CC BY 4.0',
        },
      },
    },
  ];

  it('returns the base image when no language override exists', () => {
    expect(resolveConceptImage('bread', 'de-DE', images)).toEqual({
      concept: 'bread',
      file: 'bread.webp',
      alt: 'A loaf of bread',
      source: 'https://example.com/bread',
      license: 'CC BY 4.0',
    });
  });

  it('prefers the target-language override when present', () => {
    expect(resolveConceptImage('pharmacy', 'pt-PT', images)).toEqual({
      concept: 'pharmacy',
      file: 'pharmacy.pt-PT.webp',
      alt: 'A pharmacy in Portugal',
      source: 'https://example.com/pharmacy-pt',
      license: 'CC BY 4.0',
    });
  });

  it('falls back to the base image for a different target language', () => {
    expect(resolveConceptImage('pharmacy', 'de-DE', images)).toEqual({
      concept: 'pharmacy',
      file: 'pharmacy.webp',
      alt: 'A pharmacy interior',
      source: 'https://example.com/pharmacy',
      license: 'CC BY 4.0',
    });
  });

  it('returns undefined when the concept is not represented', () => {
    expect(resolveConceptImage('missing', 'pt-PT', images)).toBeUndefined();
  });
});

describe('attachImages', () => {
  const images: ConceptImage[] = [
    {
      concept: 'bread',
      file: 'bread.webp',
      alt: 'Bread alt',
      source: 'https://example.com/bread',
      license: 'CC BY 4.0',
    },
    {
      concept: 'pharmacy',
      file: 'pharmacy.webp',
      alt: 'Pharmacy alt',
      source: 'https://example.com/pharmacy',
      license: 'CC BY 4.0',
      overrides: {
        'pt-PT': {
          file: 'pharmacy.pt-PT.webp',
          alt: 'Pharmacy in Portugal',
          source: 'https://example.com/pharmacy-pt',
          license: 'CC BY 4.0',
        },
      },
    },
  ];

  it('attaches the resolved image payload to each concept item', () => {
    expect(
      attachImages(
        [
          { concept: 'bread', term: 'pão' },
          { concept: 'pharmacy', term: 'farmácia' },
          { concept: 'missing', term: 'não existe' },
        ],
        'pt-PT',
        images
      )
    ).toEqual([
      {
        concept: 'bread',
        term: 'pão',
        image: {
          concept: 'bread',
          file: 'bread.webp',
          alt: 'Bread alt',
          source: 'https://example.com/bread',
          license: 'CC BY 4.0',
        },
      },
      {
        concept: 'pharmacy',
        term: 'farmácia',
        image: {
          concept: 'pharmacy',
          file: 'pharmacy.pt-PT.webp',
          alt: 'Pharmacy in Portugal',
          source: 'https://example.com/pharmacy-pt',
          license: 'CC BY 4.0',
        },
      },
      { concept: 'missing', term: 'não existe' },
    ]);
  });
});

describe('checkConceptImages', () => {
  it('reports missing base, override, and orphan files', () => {
    const images: ConceptImage[] = [
      {
        concept: 'bread',
        file: 'bread.webp',
        alt: 'Bread alt',
        source: 'https://example.com/bread',
        license: 'CC BY 4.0',
      },
      {
        concept: 'pharmacy',
        file: 'pharmacy.webp',
        alt: 'Pharmacy alt',
        source: 'https://example.com/pharmacy',
        license: 'CC BY 4.0',
        overrides: {
          'pt-PT': {
            file: 'pharmacy.pt-PT.webp',
            alt: 'Pharmacy in Portugal',
            source: 'https://example.com/pharmacy-pt',
            license: 'CC BY 4.0',
          },
          'es-ES': {
            file: 'pharmacy.es-ES.webp',
            alt: 'Pharmacy in Spain',
            source: 'https://example.com/pharmacy-es',
            license: 'CC BY 4.0',
          },
        },
      },
    ];

    expect(
      checkConceptImages(images, ['pharmacy.webp', 'orphan.webp', 'pharmacy.pt-PT.webp'])
    ).toEqual([
      'missing base file: bread.webp',
      'missing override file: pharmacy.es-ES.webp',
      'orphan file: orphan.webp',
    ]);
  });

  it('has unique concept ids (the credits collection is keyed by concept)', () => {
    const images = parse(
      readFileSync('./src/content/concept-images/index.yaml', 'utf-8')
    ) as ConceptImage[];
    const concepts = images.map((image) => image.concept);
    expect(new Set(concepts).size).toBe(concepts.length);
  });

  it('covers every A2/B1 concrete-noun concept with a concept-image entry', () => {
    const source = readFileSync('./src/content/concept-images/index.yaml', 'utf-8');
    const images = parse(source) as ConceptImage[];
    const ledgerConcepts = new Set(images.map((image) => image.concept));
    const ledgerFiles = new Set(
      images.flatMap((image) => [
        image.file,
        ...Object.values(image.overrides ?? {}).map((override) => override.file),
      ])
    );

    const requiredConcepts = new Set<string>();
    const requiredFiles = new Set<string>();

    for (const file of readdirSync('./src/content/realisations/pt-PT')) {
      if (!file.endsWith('.yaml')) continue;
      const realisation = parse(
        readFileSync(`./src/content/realisations/pt-PT/${file}`, 'utf-8')
      ) as {
        nodeId?: string;
        vocabulary?: { concept?: string; imageUrl?: string }[];
      };
      if (
        !realisation.nodeId ||
        (!realisation.nodeId.startsWith('A2-') && !realisation.nodeId.startsWith('B1-'))
      )
        continue;
      for (const item of realisation.vocabulary ?? []) {
        if (!item.concept || !item.imageUrl) continue;
        requiredConcepts.add(item.concept);
        requiredFiles.add(item.imageUrl);
      }
    }

    expect([...requiredConcepts].filter((concept) => !ledgerConcepts.has(concept))).toEqual([]);
    expect([...requiredFiles].filter((file) => !ledgerFiles.has(file))).toEqual([]);
  });
});
