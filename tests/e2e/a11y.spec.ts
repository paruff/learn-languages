import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/learn-languages/',
  '/learn-languages/en-GB/pt-PT/lessons/',
  '/learn-languages/en-GB/pt-PT/lessons/A1-GREET-001/',
  '/learn-languages/en-GB/pt-PT/review/',
  '/learn-languages/en-GB/pt-PT/progress/',
];

test.describe('accessibility', () => {
  for (const path of PAGES) {
    test(`${path} has no axe-core violations (WCAG 2.1 AA)`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
