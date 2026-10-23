/**
 * Web Speech API wrapper. Sets utterance.lang explicitly so the browser
 * picks the correct regional voice — spec §9.3 / discovery-brief AC-5:
 * pt-PT terms must use a pt-PT voice, never pt-BR.
 */
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

function speak(term: string, lang: string): void {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = lang;
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.lang === lang);
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}
