import { test as plain, expect as plainExpect } from '@playwright/test';

// Quality net for the failures users actually hit (a link that 404s, a screen
// that leads nowhere, a stale localStorage value). Runs locally and, via
// SMOKE_BASE_URL, against the live site after every deploy.
const BASE = '/learn-languages';
const PAIR = `${BASE}/en-GB/pt-PT`;

// 1. Primary path: home → lesson → practice → finish → next step.
plain(
  'primary journey: every step of the main path is reachable and ends with a next step',
  async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.getByRole('link', { name: 'Continue' }).first().click();
    await plainExpect(page).toHaveURL(/\/lessons\/A1-/);
    await plainExpect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Opening a lesson records it as studied (unlocks practice) from a script.
    await page.waitForFunction(() => window.localStorage.getItem('studied:en-GB:pt-PT'));

    await page.locator('.nav__link', { hasText: 'Practice' }).click();
    await plainExpect(page).toHaveURL(/\/review\/$/);

    await plainExpect(page.locator('#review-progress')).toHaveText(/of \d+$/);
    const total = Number(
      (await page.locator('#review-progress').textContent())?.match(/(\d+)$/)?.[1]
    );
    for (let i = 0; i < total; i++) {
      await page.locator('#review-reveal').click();
      await page.locator('#review-grades button[data-quality="4"]').click();
    }
    const next = page.locator('#review-next');
    await plainExpect(next).toBeVisible();
    await next.getByRole('link', { name: 'Lessons' }).click();
    await plainExpect(page).toHaveURL(/\/lessons\/$/);
  }
);

// 2. Hostile localStorage: stale, corrupt or wrong-shaped values must never
// throw, blank the page, or produce a link to a page that doesn't exist.
const HOSTILE: Record<string, string>[] = [
  { pairPreference: '{oops' },
  { pairPreference: JSON.stringify({ sourceLang: 'en-DE', targetLang: 'pt-PT' }) },
  { pairPreference: JSON.stringify({ sourceLang: 1, targetLang: null }) },
  { pairPreference: 'null' },
  { 'studied:en-GB:pt-PT': 'not json', 'new-cap:en-GB:pt-PT': 'abc' },
  { 'studied:en-GB:pt-PT': '{"a":1}', 'srs:en-GB:pt-PT:forward:x': '{"interval":"x"}' },
  { 'srs-direction:en-GB:pt-PT': 'sideways', 'srs-recall-mode:en-GB:pt-PT': '42' },
];

plain.describe('hostile localStorage', () => {
  for (const [i, seed] of HOSTILE.entries()) {
    plain(`seed #${i} (${Object.keys(seed)[0]}) breaks nothing`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.addInitScript((entries) => {
        for (const [k, v] of Object.entries(entries)) window.localStorage.setItem(k, v);
      }, seed);

      for (const path of [
        '/',
        '/en-GB/pt-PT/lessons/',
        '/en-GB/pt-PT/review/',
        '/en-GB/pt-PT/progress/',
      ]) {
        await page.goto(`${BASE}${path}`);
        await plainExpect(page.getByRole('heading', { level: 1 })).toBeVisible();
      }

      await page.goto(`${BASE}/`);
      const hrefs = await page
        .locator(`a[href^="${BASE}/"]`)
        .evaluateAll((as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).pathname))]);
      for (const href of hrefs) {
        const res = await page.request.get(href);
        plainExpect(res.status(), `${href} should resolve`).toBe(200);
      }
      plainExpect(errors).toEqual([]);
    });
  }
});

// 3. No dead ends: every screen a learner can land on offers a way forward
// (a link or button inside <main>), including the empty states.
const SCREENS: [string, string | null][] = [
  ['home', `${BASE}/`],
  ['lessons list', `${PAIR}/lessons/`],
  ['a lesson', `${PAIR}/lessons/A1-GREET-001/`],
  ['progress', `${PAIR}/progress/`],
  ['credits', `${PAIR}/credits/`],
  ['why this works', `${BASE}/why-this-works/`],
];

plain.describe('no dead ends', () => {
  for (const [name, path] of SCREENS) {
    plain(`${name} offers a next action`, async ({ page }) => {
      await page.goto(path!);
      await plainExpect(page.locator('main a:visible, main button:visible').first()).toBeVisible();
    });
  }

  plain('practice before any lesson points to the first lesson', async ({ page }) => {
    await page.goto(`${PAIR}/review/`);
    await plainExpect(page.locator('#review-first-lesson')).toBeVisible();
  });

  plain('practice with nothing due offers next steps', async ({ page }) => {
    await page.addInitScript(() =>
      window.localStorage.setItem('studied:en-GB:pt-PT', JSON.stringify(['A1-NONE-999']))
    );
    await page.goto(`${PAIR}/review/`);
    await plainExpect(page.locator('#review-empty')).toBeVisible();
    await plainExpect(page.locator('#review-next a').first()).toBeVisible();
  });
});
