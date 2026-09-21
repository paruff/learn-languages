import { describe, it, expect, beforeEach } from 'vitest';
import { saveReflection, loadReflection } from './reflection';

describe('reflection', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing is stored yet', () => {
    expect(loadReflection('en-GB', 'pt-PT', '2026-09-21')).toBeNull();
  });

  it('persists and reloads a reflection response for the same day', () => {
    saveReflection('en-GB', 'pt-PT', 'had-to-think', '2026-09-21');
    expect(loadReflection('en-GB', 'pt-PT', '2026-09-21')).toBe('had-to-think');
  });

  it('scopes reflection separately per day', () => {
    saveReflection('en-GB', 'pt-PT', 'easy', '2026-09-21');
    expect(loadReflection('en-GB', 'pt-PT', '2026-09-22')).toBeNull();
  });

  it('scopes reflection separately per language pair', () => {
    saveReflection('en-GB', 'pt-PT', 'guessed', '2026-09-21');
    expect(loadReflection('pt-PT', 'en-GB', '2026-09-21')).toBeNull();
  });
});
