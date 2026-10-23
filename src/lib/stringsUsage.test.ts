import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getString, type StringKey } from './strings';

// tsc doesn't type-check .astro templates, so a string key dropped from
// strings.ts (as in the #228 merge) renders an empty button and only axe notices.
function astroFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? astroFiles(join(dir, e.name))
      : e.name.endsWith('.astro')
        ? [join(dir, e.name)]
        : []
  );
}

const keys = new Set(
  astroFiles('src').flatMap((f) =>
    [...readFileSync(f, 'utf8').matchAll(/getString\(\s*\w+\s*,\s*'(\w+)'\s*\)/g)].map((m) => m[1])
  )
);

describe('getString keys used in .astro templates', () => {
  it('finds keys to check', () => expect(keys.size).toBeGreaterThan(20));
  for (const lang of ['en-GB', 'es-ES', 'pt-PT', 'de-DE', 'fr-FR']) {
    it(`all resolve to non-empty text in ${lang}`, () => {
      const missing = [...keys].filter((k) => !getString(lang, k as StringKey));
      expect(missing).toEqual([]);
    });
  }
});
