/** Prefixes a site-relative path with the configured base (astro.config.mjs `base`), regardless of whether BASE_URL has a trailing slash. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rest = path.replace(/^\//, '');
  return `${base}/${rest}`;
}
