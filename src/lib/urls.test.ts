import { describe, it, expect } from 'vitest';
import { withBase } from './urls';

describe('withBase', () => {
  it('joins a base with no trailing slash to a path with a leading slash', () => {
    import.meta.env.BASE_URL = '/learn-languages';
    expect(withBase('/en-GB/pt-PT/review/')).toBe('/learn-languages/en-GB/pt-PT/review/');
  });

  it('does not produce a double slash when base already has a trailing slash', () => {
    import.meta.env.BASE_URL = '/learn-languages/';
    expect(withBase('/en-GB/pt-PT/review/')).toBe('/learn-languages/en-GB/pt-PT/review/');
  });

  it('handles the site root', () => {
    import.meta.env.BASE_URL = '/learn-languages';
    expect(withBase('/')).toBe('/learn-languages/');
  });
});
