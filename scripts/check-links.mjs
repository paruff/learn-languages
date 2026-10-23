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
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    if (!url.startsWith(BASE)) continue;
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
