// Fails if any internal href/src in the built site points at a file that
// doesn't exist in dist/ — catches dead links before they reach production.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = '/learn-languages/';
const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const broken = new Set();
const pages = new Set();
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (!url.startsWith(BASE)) continue;
    if (!/\.\w+$/.test(url)) pages.add(url);
    const path = join(DIST, url.slice(BASE.length));
    if (
      !existsSync(path) ||
      (statSync(path).isDirectory() && !existsSync(join(path, 'index.html')))
    )
      broken.add(`${file} -> ${url}`);
  }
}
if (broken.size) {
  console.error(`${broken.size} broken internal link(s):\n${[...broken].slice(0, 50).join('\n')}`);
  process.exit(1);
}
console.log('check-links: all internal links resolve');

// --live <origin>: also request every distinct internal page URL from the
// deployed site, so a deploy that lost pages (or a base-path mistake) fails.
const live = process.argv[process.argv.indexOf('--live') + 1];
if (process.argv.includes('--live') && live) {
  const urls = [...pages];
  const dead = [];
  let next = 0;
  // GitHub Pages answers a burst of requests with 429, so keep concurrency
  // low and retry throttling/5xx with backoff. A real 404 fails immediately.
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const head = async (url) => {
    let res = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      res = await fetch(live + url, { method: 'HEAD' }).catch(() => null);
      if (res && res.status !== 429 && res.status < 500) return res;
      const retryAfter = Number(res?.headers.get('retry-after'));
      await sleep(
        Math.min(
          Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt,
          30_000
        )
      );
    }
    return res;
  };
  await Promise.all(
    Array.from({ length: 5 }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        const res = await head(url);
        if (!res?.ok) dead.push(`${url} -> ${res?.status ?? 'network error'}`);
      }
    })
  );
  if (dead.length) {
    console.error(`${dead.length} dead URL(s) on ${live}:\n${dead.slice(0, 50).join('\n')}`);
    process.exit(1);
  }
  console.log(`check-links: ${urls.length} live URLs return 200`);
}
