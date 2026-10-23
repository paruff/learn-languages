import { describe, it, expect } from 'vitest';
import { recordedAudioPath } from './pronounce';

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
