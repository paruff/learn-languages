import { describe, it, expect } from 'vitest';
import { recordedAudioPath, pickVoice } from './pronounce';

describe('recordedAudioPath', () => {
  it('maps a pt-PT item to its recorded file', () => {
    expect(recordedAudioPath('pt-PT', 'pt-PT-A1-BODY-001-001')).toBe(
      'audio/pt-PT/pt-PT-A1-BODY-001-001.m4a'
    );
  });
  it('returns null for languages without recordings (browser speech is used)', () => {
    expect(recordedAudioPath('fr-FR', 'x')).toBeNull();
  });
});

const v = (lang: string) => ({ lang });

describe('pickVoice', () => {
  it('matches Android Chrome underscore tags (pt_PT)', () => {
    const pt = v('pt_PT');
    expect(pickVoice([v('pt_BR'), pt], 'pt-PT')).toBe(pt);
  });
  it('matches case-insensitively', () => {
    const pt = v('pt-pt');
    expect(pickVoice([pt], 'pt-PT')).toBe(pt);
  });
  it('never substitutes another region (pt-BR for pt-PT)', () => {
    expect(pickVoice([v('pt-BR'), v('en-GB')], 'pt-PT')).toBeNull();
  });
  it('returns null for no voices', () => {
    expect(pickVoice([], 'pt-PT')).toBeNull();
  });
});
