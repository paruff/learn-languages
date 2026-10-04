import { describe, it, expect, beforeEach } from 'vitest';
import { loadPairPreference, savePairPreference } from './pairPreference';

describe('pairPreference', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when nothing is stored yet', () => {
    expect(loadPairPreference()).toBeNull();
  });

  it('persists and reloads the chosen pair', () => {
    savePairPreference({ sourceLang: 'en-GB', targetLang: 'pt-PT' });
    expect(loadPairPreference()).toEqual({ sourceLang: 'en-GB', targetLang: 'pt-PT' });
  });
});

describe('pair preference resilience (spec S7)', () => {
  it('returns null instead of throwing when the stored value is corrupt', () => {
    window.localStorage.setItem('pairPreference', '{oops');
    expect(loadPairPreference()).toBeNull();
  });
});
