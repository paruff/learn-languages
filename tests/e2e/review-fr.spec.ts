import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SESSION_SIZE } from '../../src/lib/reviewSession';

const REVIEW_URL = '/learn-languages/en-GB/fr-FR/review/';
const GREET_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/A1-GREET-001/';
const FOOD_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/A1-FOOD-001/';
const JOB_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/A2-JOB-001/';
const B1_OPINION_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/B1-OPINION-001/';
const B2_ARGUE_LESSON_URL = '/learn-languages/en-GB/fr-FR/lessons/B2-ARGUE-001/';
const FR_DIR = 'src/content/realisations/fr-FR';
const EN_DIR = 'src/content/realisations/en-GB';

/** fr-FR vocab ids for a level (grammar blocks are empty in fr files, so every id is a vocab id). */
function frVocabIds(levelPrefix: 'a1-' | 'a2-' | 'b1-' | 'b2-'): string[] {
  return readdirSync(FR_DIR)
    .filter((f) => f.startsWith(levelPrefix) && f.endsWith('.yaml'))
    .flatMap((f) =>
      [...readFileSync(join(FR_DIR, f), 'utf8').matchAll(/^\s+- id: (fr-FR-\S+)\s*$/gm)].map(
        (m) => m[1]
      )
    );
}

/** en-GB A2 terms — the expected vocabulary surface of any A2 session card front. */
function enA2Terms(): Set<string> {
  const terms = new Set<string>();
  for (const f of readdirSync(EN_DIR)) {
    if (!f.startsWith('a2-') || !f.endsWith('.yaml')) continue;
    const text = readFileSync(join(EN_DIR, f), 'utf8');
    for (const m of text.matchAll(/^\s+term:\s*(.+)\s*$/gm)) {
      terms.add(m[1].replace(/^['"]/, '').replace(/['"]$/, ''));
    }
  }
  return terms;
}

/** en-GB B1 terms — the expected vocabulary surface of any B1 session card front. */
function enB1Terms(): Set<string> {
  const terms = new Set<string>();
  for (const f of readdirSync(EN_DIR)) {
    if (!f.startsWith('b1-') || !f.endsWith('.yaml')) continue;
    const text = readFileSync(join(EN_DIR, f), 'utf8');
    for (const m of text.matchAll(/^\s+term:\s*(.+)\s*$/gm)) {
      terms.add(m[1].replace(/^['"]/, '').replace(/['"]$/, ''));
    }
  }
  return terms;
}

/** en-GB B2 terms — the expected vocabulary surface of any B2 session card front. */
function enB2Terms(): Set<string> {
  const terms = new Set<string>();
  for (const f of readdirSync(EN_DIR)) {
    if (!f.startsWith('b2-') || !f.endsWith('.yaml')) continue;
    const text = readFileSync(join(EN_DIR, f), 'utf8');
    for (const m of text.matchAll(/^\s+term:\s*(.+)\s*$/gm)) {
      terms.add(m[1].replace(/^['"]/, '').replace(/['"]$/, ''));
    }
  }
  return terms;
}

test.describe('fr-FR A1 review session', () => {
  test.beforeEach(async ({ page }) => {
    // SRS state is localStorage-only — clear it so prior runs don't leak.
    await page.goto(REVIEW_URL);
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('reveal/grade persists SRS state under the fr-FR pair key', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const back = page.locator('#review-back');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const easy = grades.locator('button[data-quality="4"]');

    // Session size parsed dynamically — never hardcode content counts.
    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBeGreaterThan(0);

    await expect(progress).toHaveText(`1 of ${totalCount}`);
    await expect(front).not.toBeEmpty();
    await expect(back).toBeHidden();

    await reveal.click();
    await expect(back).toBeVisible();
    await expect(easy).toBeVisible();
    await easy.click();

    await expect(progress).toHaveText(`2 of ${totalCount}`);

    const savedKeys = await page.evaluate(() =>
      Object.keys(window.localStorage).filter((key) => key.startsWith('srs:en-GB:fr-FR:forward:'))
    );
    expect(savedKeys).toHaveLength(1);
  });

  test('a full session grades out and shows the summary', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const summary = page.locator('#review-summary');
    const easy = grades.locator('button[data-quality="4"]');

    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBeGreaterThan(0);

    for (let i = 0; i < totalCount; i++) {
      await reveal.click();
      await easy.click();
    }

    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${totalCount}/${totalCount} correct first try`);
  });

  test('greeting lesson pairs English prompts with aligned French answers', async ({ page }) => {
    await page.goto(GREET_LESSON_URL);
    const terms = page.locator('.vocab-item__term');
    // en-GB seq 002 is "Good morning" — must pair with "Bonjour",
    // NOT the skeleton's old "Bonsoir" (Good evening) — the seq-alignment
    // bug this epic fixes.
    await expect(terms.nth(1)).toContainText('Good morning');
    await expect(terms.nth(1)).toContainText('Bonjour');
    await expect(terms.nth(1)).not.toContainText('Bonsoir');
    await expect(terms.nth(2)).toContainText('Good evening');
    await expect(terms.nth(2)).toContainText('Bonsoir');
  });

  test('A1 food lesson exists for en-GB→fr-FR with French vocabulary', async ({ page }) => {
    await page.goto(FOOD_LESSON_URL);
    await expect(page.locator('.lesson__title')).toBeVisible();
    await expect(page.locator('.vocab-item__term').first()).toContainText('water');
    await expect(page.locator('.vocab-item__term').first()).toContainText('eau');
  });
});

test.describe('fr-FR A2 review session', () => {
  test.beforeEach(async ({ page }) => {
    // Schedule every A1 card a year out so the SESSION_SIZE=15 slice is drawn
    // from A2 cards only — with a cleared store, interleaveByNode's round-robin
    // would open on the first 15 A1 nodes (a1-* sorts before a2-*).
    await page.goto(REVIEW_URL);
    const a1Ids = frVocabIds('a1-');
    expect(a1Ids.length).toBeGreaterThan(0);
    await page.evaluate((ids) => {
      window.localStorage.clear();
      const dueNextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      for (const id of ids) {
        window.localStorage.setItem(
          `srs:en-GB:fr-FR:forward:${id}`,
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

    const a2Terms = enA2Terms();
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

  test('A2 job lesson pairs English prompts with aligned French answers', async ({ page }) => {
    await page.goto(JOB_LESSON_URL);
    const terms = page.locator('.vocab-item__term');
    // en-GB seq 001 = "job", seq 002 = "office" — pinned French equivalents
    // the content of Task 3 must deliver at those seqs.
    await expect(terms.nth(0)).toContainText('job');
    await expect(terms.nth(0)).toContainText('emploi');
    await expect(terms.nth(1)).toContainText('office');
    await expect(terms.nth(1)).toContainText('bureau');
  });
});

test.describe('fr-FR B1 review session', () => {
  test.beforeEach(async ({ page }) => {
    // Schedule every A1 and A2 card a year out so the SESSION_SIZE=15 slice
    // is drawn from B1 cards only — with a cleared store, interleaveByNode's
    // round-robin would open on A1/A2 cards (a1-* and a2-* sort before b1-*).
    await page.goto(REVIEW_URL);
    const olderIds = [...frVocabIds('a1-'), ...frVocabIds('a2-')];
    expect(olderIds.length).toBeGreaterThan(0);
    await page.evaluate((ids) => {
      window.localStorage.clear();
      const dueNextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      for (const id of ids) {
        window.localStorage.setItem(
          `srs:en-GB:fr-FR:forward:${id}`,
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

    const b1Terms = enB1Terms();
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

  test('B1 opinion lesson pairs English prompts with aligned French answers', async ({ page }) => {
    await page.goto(B1_OPINION_LESSON_URL);
    const terms = page.locator('.vocab-item__term');
    // en-GB seq 001 = "in my opinion", seq 002 = "I think that" — pinned French
    // equivalents the content of Task 3 must deliver at those seqs.
    await expect(terms.nth(0)).toContainText('in my opinion');
    await expect(terms.nth(0)).toContainText('À mon avis');
    await expect(terms.nth(1)).toContainText('I think that');
    await expect(terms.nth(1)).toContainText('Je pense que');
  });
});

test.describe('fr-FR B2 review session', () => {
  test.beforeEach(async ({ page }) => {
    // Schedule every A1, A2, and B1 card a year out so the SESSION_SIZE=15 slice
    // is drawn from B2 cards only — with a cleared store, interleaveByNode's
    // round-robin would open on A1/A2/B1 cards (a1-*, a2-*, b1-* sort before b2-*).
    await page.goto(REVIEW_URL);
    const olderIds = [...frVocabIds('a1-'), ...frVocabIds('a2-'), ...frVocabIds('b1-')];
    expect(olderIds.length).toBeGreaterThan(0);
    await page.evaluate((ids) => {
      window.localStorage.clear();
      const dueNextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      for (const id of ids) {
        window.localStorage.setItem(
          `srs:en-GB:fr-FR:forward:${id}`,
          JSON.stringify({ interval: 30, easeFactor: 2.5, repetitions: 3, dueDate: dueNextYear })
        );
      }
    }, olderIds);
    await page.reload();
  });

  test('a full B2 session grades out and every card is B2', async ({ page }) => {
    const progress = page.locator('#review-progress');
    const front = page.locator('#review-front');
    const reveal = page.locator('#review-reveal');
    const grades = page.locator('#review-grades');
    const summary = page.locator('#review-summary');
    const easy = grades.locator('button[data-quality="4"]');

    const progressText = await progress.textContent();
    const totalCount = Number(progressText?.match(/of (\d+)$/)?.[1]);
    expect(totalCount).toBe(SESSION_SIZE);

    const b2Terms = enB2Terms();
    const fronts: string[] = [];
    for (let i = 0; i < totalCount; i++) {
      fronts.push((await front.textContent()) ?? '');
      await reveal.click();
      await easy.click();
    }

    for (const text of fronts) {
      expect([...b2Terms].some((term) => text.includes(term))).toBe(true);
    }

    await expect(summary).toBeVisible();
    await expect(summary).toContainText(`${totalCount}/${totalCount} correct first try`);
  });

  test('B2 argue lesson pairs English prompts with aligned French answers', async ({ page }) => {
    await page.goto(B2_ARGUE_LESSON_URL);
    const terms = page.locator('.vocab-item__term');
    // en-GB seq 001 = "to construct a chain of reasoning", seq 002 = "to develop the argument"
    // pinned French equivalents the content must deliver at those seqs.
    await expect(terms.nth(0)).toContainText('to construct a chain of reasoning');
    await expect(terms.nth(0)).toContainText('construire une chaîne de raisonnement');
    await expect(terms.nth(1)).toContainText('to develop the argument');
    await expect(terms.nth(1)).toContainText("développer l'argument");
  });
});
