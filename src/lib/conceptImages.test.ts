import { describe, it, expect } from 'vitest';
import { resolveConceptImage, type ConceptImageEntry } from './conceptImages';

describe('resolveConceptImage', () => {
  const images: ConceptImageEntry[] = [
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
