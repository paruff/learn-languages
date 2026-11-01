import { test as base, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';

// Spec J2 makes a fresh learner's practice queue empty until they open a
// lesson. Tests that exercise the review loop itself (not that gate) start from
// "every lesson studied, no daily new-word cap" so they keep their 15-card sessions.
const NODE_IDS = readdirSync('src/content/cefr-nodes').map(
  (f) => readFileSync(`src/content/cefr-nodes/${f}`, 'utf8').match(/^nodeId: (\S+)/m)![1]
);
const PAIRS = ['en-GB:pt-PT', 'en-GB:fr-FR', 'en-GB:it-IT'];

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(
      ({ ids, pairs }) => {
        try {
          for (const pair of pairs) {
            window.localStorage.setItem(`studied:${pair}`, JSON.stringify(ids));
            window.localStorage.setItem(`new-cap:${pair}`, '9999');
          }
        } catch {
          // storage blocked — the corrupt-storage test covers this path
        }
      },
      { ids: NODE_IDS, pairs: PAIRS }
    );
    await use(page);
  },
});
export { expect };
