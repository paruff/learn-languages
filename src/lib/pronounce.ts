/**
 * Web Speech API wrapper. Sets utterance.lang explicitly so the browser
 * picks the correct regional voice — spec §9.3 / discovery-brief AC-5:
 * pt-PT terms must use a pt-PT voice, never pt-BR.
 */
import { loadNetworkVoicePreference } from './storage';

// Languages with pre-rendered audio under public/audio/<lang>/<id>.m4a (npm run generate:audio).
const RECORDED_LANGS = new Set(['pt-PT']);

/** Site-relative path of the recorded audio for a vocabulary item, or null if that language has none. */
export function recordedAudioPath(lang: string, itemId: string): string | null {
  return RECORDED_LANGS.has(lang) ? `audio/${lang}/${itemId}.m4a` : null;
}

/**
 * Plays recorded audio when `audioSrc` is given (a fixed European Portuguese
 * voice, regardless of the device), falling back to browser speech if the
 * file is missing or cannot play.
 */
export function pronounce(term: string, lang: string, audioSrc?: string | null): void {
  if (!audioSrc) return speak(term, lang);
  let fellBack = false;
  const fallback = (): void => {
    if (fellBack) return;
    fellBack = true;
    speak(term, lang);
  };
  const audio = new Audio(audioSrc);
  audio.addEventListener('error', fallback, { once: true });
  audio.play().catch(fallback);
}

const normTag = (t: string): string => t.replace('_', '-').toLowerCase();

/**
 * Exact regional match only. Android Chrome reports tags as `pt_PT`; a
 * same-language voice of another region (pt-BR) is never substituted.
 */
type Voice = { lang: string; localService?: boolean };

/**
 * Prefers an on-device voice. A network voice (`localService === false`) sends the
 * word to the browser vendor, so it is used only when the learner opted in (spec Q10).
 */
export function pickVoice<T extends Voice>(
  voices: T[],
  lang: string,
  allowNetwork = false
): T | null {
  const exact = voices.filter((v) => normTag(v.lang) === normTag(lang));
  return exact.find((v) => v.localService !== false) ?? (allowNetwork ? (exact[0] ?? null) : null);
}

function speak(term: string, lang: string): void {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;

  const say = (): void => {
    const allowNetwork = loadNetworkVoicePreference();
    const voice = pickVoice(synth.getVoices(), lang, allowNetwork);
    // No on-device voice and no opt-in: the browser's own pick could be a network voice, so stay silent (Q10).
    if (!voice && !allowNetwork) return;
    const utterance = new SpeechSynthesisUtterance(term);
    utterance.lang = lang; // opted in but no exact voice: the browser's own pick for this tag
    utterance.rate = 0.9;
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  };

  // Chrome loads voices asynchronously: the first call can see an empty list.
  if (synth.getVoices().length) return say();
  let done = false;
  const once = (): void => {
    if (done) return;
    done = true;
    synth.removeEventListener('voiceschanged', once);
    say();
  };
  synth.addEventListener('voiceschanged', once);
  setTimeout(once, 500);
}
