export interface ConceptImageOverride {
  file: string;
  alt: string;
  source: string;
  license: string;
}

export interface ConceptImage {
  concept: string;
  file: string;
  alt: string;
  source: string;
  license: string;
  culturallySpecific?: boolean;
  overrides?: Partial<Record<string, ConceptImageOverride>>;
}

export type ConceptImageEntry = ConceptImage;

export interface ResolvedImage {
  file: string;
  alt: string;
  source?: string;
  license?: string;
  concept?: string;
}

export function imageFileName(concept: string, lang?: string): string {
  return lang ? `${concept}.${lang}.webp` : `${concept}.webp`;
}

function toMap(
  images: ReadonlyMap<string, ConceptImage> | ReadonlyArray<ConceptImage> | undefined
): Map<string, ConceptImage> {
  if (!images) return new Map<string, ConceptImage>();
  if (images instanceof Map) return new Map(images);
  if (Array.isArray(images)) {
    return new Map(images.map((entry: ConceptImage) => [entry.concept, entry]));
  }
  return new Map<string, ConceptImage>();
}

export function resolveConceptImage(
  concept: string,
  targetLang: string,
  images: ReadonlyMap<string, ConceptImage> | ReadonlyArray<ConceptImage> | undefined
): ResolvedImage | undefined {
  const entry = toMap(images).get(concept);
  if (!entry) return undefined;

  const override = entry.overrides?.[targetLang];
  if (!override) {
    return {
      concept: entry.concept,
      file: entry.file,
      alt: entry.alt,
      source: entry.source,
      license: entry.license,
    };
  }

  return {
    concept: entry.concept,
    file: override.file ?? entry.file,
    alt: override.alt ?? entry.alt,
    source: override.source ?? entry.source,
    license: override.license ?? entry.license,
  };
}

export function attachImages<T extends { concept: string }>(
  paired: T[],
  targetLang: string,
  images: ReadonlyMap<string, ConceptImage> | ReadonlyArray<ConceptImage>
): Array<T & { image?: ResolvedImage }> {
  return paired.map((item) => {
    const image = resolveConceptImage(item.concept, targetLang, images);
    return image ? { ...item, image } : { ...item };
  });
}

export function checkConceptImages(images: ConceptImage[], files: string[]): string[] {
  const available = new Set(files.filter((file) => file.endsWith('.webp')));
  const errors: string[] = [];

  for (const image of images) {
    if (!available.has(image.file)) {
      errors.push(`missing base file: ${image.file}`);
    }

    if (image.overrides) {
      for (const override of Object.values(image.overrides)) {
        if (override && !available.has(override.file)) {
          errors.push(`missing override file: ${override.file}`);
        }
      }
    }
  }

  const expected = new Set(
    images.flatMap((image) => [
      image.file,
      ...Object.values(image.overrides ?? {})
        .filter(Boolean)
        .map((override) => override!.file),
    ])
  );

  for (const file of files.filter((f) => f.endsWith('.webp'))) {
    if (!expected.has(file)) {
      errors.push(`orphan file: ${file}`);
    }
  }

  return errors;
}
