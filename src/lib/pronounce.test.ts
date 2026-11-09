import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { recordedAudioPath, pickVoice, pronounce } from './pronounce';

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

describe('pickVoice network voices (Q10)', () => {
  const local = { lang: 'pt-PT', localService: true };
  const net = { lang: 'pt-PT', localService: false };
  it('prefers an on-device voice over a network one', () => {
    expect(pickVoice([net, local], 'pt-PT')).toBe(local);
  });
  it('ignores a network-only voice unless the learner opted in', () => {
    expect(pickVoice([net], 'pt-PT')).toBeNull();
    expect(pickVoice([net], 'pt-PT', true)).toBe(net);
  });
  it('treats a voice that does not say localService as on-device', () => {
    expect(pickVoice([{ lang: 'pt-PT' }], 'pt-PT')).toEqual({ lang: 'pt-PT' });
  });
});

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

// jsdom has no Web Speech API and can't play audio, so both are faked here.
class FakeUtterance {
  lang = '';
  rate = 1;
  voice: { lang: string } | null = null;
  constructor(public text: string) {}
}

function fakeSynth(voices: { lang: string }[]) {
  const listeners: Array<() => void> = [];
  return {
    voices,
    spoken: [] as FakeUtterance[],
    getVoices() {
      return this.voices;
    },
    speak(u: FakeUtterance) {
      this.spoken.push(u);
    },
    addEventListener: (_: string, fn: () => void) => listeners.push(fn),
    removeEventListener: vi.fn(),
    fireVoicesChanged: () => listeners.forEach((fn) => fn()),
  };
}

describe('pronounce (Q3)', () => {
  let synth: ReturnType<typeof fakeSynth>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
    synth = fakeSynth([{ lang: 'pt-BR' }, { lang: 'pt_PT' }]);
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    window.localStorage.clear();
    delete (window as { speechSynthesis?: unknown }).speechSynthesis;
  });

  it('speaks with the exact regional voice, the target tag and a slower rate', () => {
    pronounce('obrigado', 'pt-PT');
    expect(synth.spoken).toHaveLength(1);
    const [u] = synth.spoken;
    expect(u.text).toBe('obrigado');
    expect(u.lang).toBe('pt-PT');
    expect(u.rate).toBe(0.9);
    expect(u.voice).toEqual({ lang: 'pt_PT' });
  });

  it('opted in, without an exact voice, still speaks with the lang tag and no substituted voice', () => {
    window.localStorage.setItem('tts-network', '1');
    synth.voices = [{ lang: 'pt-BR' }];
    pronounce('obrigado', 'pt-PT');
    expect(synth.spoken[0].lang).toBe('pt-PT');
    expect(synth.spoken[0].voice).toBeNull();
  });

  it('waits for voices to load, and speaks once even if the timeout also fires', () => {
    synth.voices = [];
    pronounce('olá', 'pt-PT');
    expect(synth.spoken).toHaveLength(0);
    synth.voices = [{ lang: 'pt-PT' }];
    synth.fireVoicesChanged();
    vi.advanceTimersByTime(500);
    expect(synth.spoken).toHaveLength(1);
    expect(synth.removeEventListener).toHaveBeenCalledWith('voiceschanged', expect.any(Function));
  });

  it('speaks after 500 ms if the voices never announce themselves (opted in)', () => {
    window.localStorage.setItem('tts-network', '1');
    synth.voices = [];
    pronounce('olá', 'pt-PT');
    vi.advanceTimersByTime(500);
    expect(synth.spoken).toHaveLength(1);
  });

  it('does nothing when the browser has no speech synthesis', () => {
    delete (window as { speechSynthesis?: unknown }).speechSynthesis;
    expect(() => pronounce('olá', 'pt-PT')).not.toThrow();
  });

  it('plays recorded audio when given, without speaking', async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal(
      'Audio',
      class {
        addEventListener = vi.fn();
        play = play;
        constructor(public src: string) {}
      }
    );
    pronounce('olá', 'pt-PT', 'audio/pt-PT/x.m4a');
    await Promise.resolve();
    expect(play).toHaveBeenCalledOnce();
    expect(synth.spoken).toHaveLength(0);
  });

  it('falls back to speech once when the recording errors and play() rejects', async () => {
    let onError: () => void = () => {};
    vi.stubGlobal(
      'Audio',
      class {
        addEventListener = (_: string, fn: () => void) => (onError = fn);
        play = () => Promise.reject(new Error('404'));
      }
    );
    pronounce('olá', 'pt-PT', 'audio/pt-PT/missing.m4a');
    onError();
    await Promise.resolve();
    await Promise.resolve();
    expect(synth.spoken).toHaveLength(1);
    expect(synth.spoken[0].lang).toBe('pt-PT');
  });

  it('Q10: stays silent when only a network voice exists and the learner has not opted in', () => {
    synth.voices = [{ lang: 'pt-PT', localService: false } as { lang: string }];
    pronounce('obrigado', 'pt-PT');
    expect(synth.spoken).toHaveLength(0);
  });

  it('Q10: uses the network voice after the learner opts in', () => {
    synth.voices = [{ lang: 'pt-PT', localService: false } as { lang: string }];
    window.localStorage.setItem('tts-network', '1');
    pronounce('obrigado', 'pt-PT');
    expect(synth.spoken).toHaveLength(1);
    window.localStorage.clear();
  });
});
