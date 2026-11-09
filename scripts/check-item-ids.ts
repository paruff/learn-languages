// Spec C12: released item IDs are immutable. Compares against BASE_REF (default: the latest
// release tag, else origin/main). Exceptions: src/content/shipped-id-exceptions.txt.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { checkItemIds } from '../src/lib/itemIds.ts';

const ROOT = join(import.meta.dirname, '..');
const DIR = 'src/content/realisations';

const git = (...args: string[]): string =>
  execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });

function baseRef(): string {
  if (process.env.BASE_REF) return process.env.BASE_REF;
  try {
    return git('describe', '--tags', '--abbrev=0').trim();
  } catch {
    return 'origin/main';
  }
}

function termsOf(yamlText: string): Record<string, string> {
  const data = parse(yamlText) as { vocabulary?: { id?: string; term?: string }[] } | null;
  return Object.fromEntries(
    (data?.vocabulary ?? []).flatMap((v) => (v.id && v.term ? [[v.id, v.term]] : []))
  );
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.yaml') ? [full] : [];
  });
}

const ref = baseRef();
const base: Record<string, string> = {};
for (const path of git('ls-tree', '-r', '--name-only', ref, DIR).split('\n').filter(Boolean)) {
  if (path.endsWith('.yaml')) Object.assign(base, termsOf(git('show', `${ref}:${path}`)));
}
const current: Record<string, string> = {};
for (const file of walk(join(ROOT, DIR))) {
  Object.assign(current, termsOf(readFileSync(file, 'utf-8')));
}
const exceptions = new Set(
  readFileSync(join(ROOT, 'src/content/shipped-id-exceptions.txt'), 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
);

const errors = checkItemIds(base, current, exceptions);
if (errors.length) {
  console.error(`Item ID check failed against ${ref} (spec C12):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Item IDs stable against ${ref}: ${Object.keys(base).length} released IDs checked.`);
