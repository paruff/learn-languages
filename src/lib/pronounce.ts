/**
 * Web Speech API wrapper. Sets utterance.lang explicitly so the browser
 * picks the correct regional voice — spec §9.3 / discovery-brief AC-5:
 * pt-PT terms must use a pt-PT voice, never pt-BR.
 */
export function pronounce(term: string, lang: string): void {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(term);
  utterance.lang = lang;
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.lang === lang);
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}
