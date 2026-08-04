'use client';

import { Language } from './language-context';

export const bcp47LanguageCodes: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  or: 'or-IN'
};

/**
 * Clean text for smooth, glitch-free TTS playback by removing markdown,
 * normalizing punctuation, and adding natural speech pauses.
 */
export function sanitizeTextForSpeech(text: string): string {
  return text
    .replace(/[*#_`~[\]()]/g, '') // Strip markdown formatting
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/(\d+)\s*km/gi, '$1 kilometers') // Expand distance units for natural voice
    .replace(/108/g, 'one zero eight')
    .replace(/102/g, 'one zero two')
    .trim();
}

/**
 * High-accuracy multi-language TTS Voice Assistant playback engine.
 * Selects optimal native Indian regional voices from browser synthesis engine,
 * applies comfortable speech pacing (rate: 0.9), and prevents glitches.
 */
export function speakTextInLanguage(
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis is not supported on this browser.');
    return false;
  }

  // Cancel any ongoing speech to prevent overlapping glitches
  window.speechSynthesis.cancel();

  const cleanText = sanitizeTextForSpeech(text);
  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetBcp47 = bcp47LanguageCodes[lang] || 'en-IN';
  utterance.lang = targetBcp47;

  // Steady, clear speech rate for rural elder accessibility
  utterance.rate = 0.92;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Find best matching native voice from available browser voices
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const matchedVoice = voices.find(
      (v) =>
        v.lang === targetBcp47 ||
        v.lang.replace('_', '-').toLowerCase() === targetBcp47.toLowerCase() ||
        v.lang.startsWith(lang)
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (onError) onError(e);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopVoiceSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
