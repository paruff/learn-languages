import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SESSION_SIZE } from '../../src/lib/reviewSession';

const REVIEW_URL = '/learn-languages/en-GB/it-IT/review/';
const GREET_LESSON_URL = '/learn-languages/en-GB/it-IT/lessons/A1-GREET-001/';
const IT_DIR = 'src/content/realisations/it-IT';
const EN_DIR = 'src/content/realisations/en-GB';

type ItalianoLevel = 'a1-' | 'a2-' | 'b1-';

function itVocabIds(levelPrefix: ItalianoLevel): string[] {
  const levelToken = levelPrefix.toUpperCase().replace(/-$/, '');
  return readdirSync(IT_DIR)
    .filter((file) => file.startsWith(levelPrefix) && file.endsWith('.yaml'))
    .flatMap((file) => {
      const text = readFileSync(join(IT_DIR, file), 'utf8');
      return [...text.matchAll(/id:\s*['"]?(it-IT-[A-Za-z0-9-]+)['"]?/g)]
        .map((match) => match[1])
        .filter((id) => id.includes(levelToken) && !/-G\d+$/.test(id));
    });
}

function enTerms(levelPrefix: 'a2-' | 'b1-'): Set<string> {
  const terms = new Set<string>();
  for (const file of readdirSync(EN_DIR)) {
    if (!file.startsWith(levelPrefix) || !file.endsWith('.yaml')) continue;
    const text = readFileSync(join(EN_DIR, file), 'utf8');
    for (const match of text.matchAll(/^\s+term:\s*(.+)\s*$/gm)) {
      terms.add(match[1].replace(/^['"]/, '').replace(/['"]$/, ''));
    }
  }
  return terms;
}

test.describe('it-IT A1 review session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('loads the EN→IT A1 review flow and persists SRS state', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const back = page.locator('#review-back');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const easy = grades.locator('button[data-quality="4"]');

    await expect(progress).toBeVisible();
    await expect(front).not.toBeEmpty();
    await expect(back).toBeHidden();

    await reveal.click();
    await expect(back).toBeVisible();
    await easy.click();

    const savedKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.startsWith('srs:en-GB:it-IT:forward:'))
    );
    expect(savedKeys.length).toBeGreaterThan(0);
  });

  test('lesson pages render an Italian A1 greeting set', async ({ page }) => {
    await page.goto(GREET_LESSON_URL);
    await expect(page.locator('.lesson__title')).toBeVisible();
    await expect(page.locator('.vocab-item__term').first()).toContainText(/hello/i);
    await expect(page.locator('.vocab-item__term').first()).toContainText(/ciao/i);
  });
});

test.describe('it-IT A2 review session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REVIEW_URL);
    const a1Ids = itVocabIds('a1-');
    expect(a1Ids.length).toBeGreaterThan(0);

    // Schedule every A1 card a year out so the SESSION_SIZE=15 slice is drawn
    // from A2 cards only — the same pattern used for the other language pairs.
    await page.evaluate((ids) => {
      window.localStorage.clear();
      const dueNextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      for (const id of ids) {
        window.localStorage.setItem(
          `srs:en-GB:it-IT:forward:${id}`,
          JSON.stringify({ interval: 30, easeFactor: 2.5, repetitions: 3, dueDate: dueNextYear })
        );
      }
    }, a1Ids);

    await page.reload();
  });

  test('a full A2 session grades out and every card is A2', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const summary = page.locator('#review-summary');
    const easy = grades.locator('button[data-quality="4"]');

    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBe(SESSION_SIZE);

    const a2Terms = enTerms('a2-');
    const fronts: string[] = [];
    for (let i = 0; i < totalCount; i++) {
      fronts.push((await front.textContent()) ?? '');
      await reveal.click();
      await easy.click();
    }

    for (const text of fronts) {
      expect([...a2Terms].some((term) => text.includes(term))).toBe(true);
    }

    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${totalCount}/${totalCount} correct first try`);
  });
});

test.describe('it-IT B1 review session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REVIEW_URL);
    const olderIds = [...itVocabIds('a1-'), ...itVocabIds('a2-')];
    expect(olderIds.length).toBeGreaterThan(0);
    await page.evaluate((ids) => {
      window.localStorage.clear();
      const dueNextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      for (const id of ids) {
        window.localStorage.setItem(
          `srs:en-GB:it-IT:forward:${id}`,
          JSON.stringify({ interval: 30, easeFactor: 2.5, repetitions: 3, dueDate: dueNextYear })
        );
      }
    }, olderIds);
    await page.reload();
  });

  test('a full B1 session grades out and every card is B1', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const summary = page.locator('#review-summary');
    const easy = grades.locator('button[data-quality="4"]');

    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBe(SESSION_SIZE);

    const b1Terms = enTerms('b1-');
    const fronts: string[] = [];
    for (let i = 0; i < totalCount; i++) {
      fronts.push((await front.textContent()) ?? '');
      await reveal.click();
      await easy.click();
    }

    for (const text of fronts) {
      expect([...b1Terms].some((term) => text.includes(term))).toBe(true);
    }

    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${totalCount}/${totalCount} correct first try`);
  });
});
