// Renders each pt-PT vocabulary term to public/audio/pt-PT/<id>.m4a with the
// macOS "Joana" (European Portuguese) voice. macOS only; existing files are skipped.
// Run: npm run generate:audio   (add --force to re-render everything)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const root = join(import.meta.dirname, '..');
const srcDir = join(root, 'src/content/realisations/pt-PT');
const outDir = join(root, 'public/audio/pt-PT');
const force = process.argv.includes('--force');
const VOICE = 'Joana';
mkdirSync(outDir, { recursive: true });

let made = 0;
for (const file of readdirSync(srcDir).filter((f) => f.endsWith('.yaml'))) {
  const { vocabulary } = parse(readFileSync(join(srcDir, file), 'utf-8')) as {
    vocabulary: { id: string; term: string }[];
  };
  for (const { id, term } of vocabulary) {
    const out = join(outDir, `${id}.m4a`);
    if (existsSync(out) && !force) continue;
    const aiff = `${out}.aiff`;
    execFileSync('say', ['-v', VOICE, '-r', '150', '-o', aiff, '--', term]);
    execFileSync('afconvert', [aiff, out, '-f', 'm4af', '-d', 'aac', '-b', '32000']);
    rmSync(aiff);
    made += 1;
  }
}
console.log(`Generated ${made} audio file(s) in public/audio/pt-PT`);
