import { test, expect } from './fixtures';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const CONCEPTS = (
  parse(readFileSync('src/content/concept-images/index.yaml', 'utf8')) as { concept: string }[]
).map((image) => image.concept);

for (const pair of ['en-GB/pt-PT', 'en-GB/fr-FR', 'en-GB/it-IT']) {
  test(`credits page lists every indexed image (${pair}, issue #211)`, async ({ page }) => {
    await page.goto(`/learn-languages/${pair}/credits/`);
    const listed = await page.locator('.credits-table tbody tr td:first-child').allTextContents();
    expect(listed.sort()).toEqual([...CONCEPTS].sort());
  });
}
