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

const regionalVoiceKeywords: Record<Language, string[]> = {
  te: ['te-in', 'te_in', 'telugu', 'mohan', 'chitra', 'shruti', 'te'],
  hi: ['hi-in', 'hi_in', 'hindi', 'madhur', 'swara', 'heera', 'kalpana', 'hemant', 'hi'],
  ta: ['ta-in', 'ta_in', 'tamil', 'valluvar', 'pallavi', 'iniya', 'ta'],
  kn: ['kn-in', 'kn_in', 'kannada', 'gagan', 'sapna', 'kn'],
  bn: ['bn-in', 'bn_in', 'bengali', 'bangla', 'bashkar', 'tanishaa', 'bn'],
  mr: ['mr-in', 'mr_in', 'marathi', 'manohar', 'aarohi', 'mr'],
  gu: ['gu-in', 'gu_in', 'gujarati', 'niranjan', 'dhwani', 'gu'],
  or: ['or-in', 'or_in', 'odia', 'oriya', 'or'],
  en: ['en-in', 'en_in', 'india', 'rishi', 'neerja', 'en-gb', 'en-us', 'en']
};

let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Pre-initialize and cache browser voices to prevent initial empty array latency.
 */
export function initVoiceEngine(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }
}

/**
 * Find the optimal native voice matching the user's selected language.
 */
export function findBestVoiceForLanguage(lang: Language): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const targetBcp47 = bcp47LanguageCodes[lang] || 'en-IN';
  const targetPrefix = targetBcp47.split('-')[0].toLowerCase();
  const keywords = regionalVoiceKeywords[lang] || [targetPrefix];

  // Pass 1: Exact BCP-47 match
  const exact = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetBcp47.toLowerCase());
  if (exact) return exact;

  // Pass 2: Language name keyword in voice name
  const byName = voices.find(v => {
    const nameLower = v.name.toLowerCase();
    const langLower = v.lang.toLowerCase();
    return keywords.some(kw => nameLower.includes(kw) || langLower.includes(kw));
  });
  if (byName) return byName;

  // Pass 3: Prefix match
  const byPrefix = voices.find(v => v.lang.toLowerCase().startsWith(targetPrefix));
  if (byPrefix) return byPrefix;

  // Pass 4: Any Indian English voice for English / general fallback
  if (lang === 'en') {
    const indianEn = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
    if (indianEn) return indianEn;
  }

  return voices[0] || null;
}

/**
 * Clean text for smooth, natural TTS playback.
 */
export function sanitizeTextForSpeech(text: string, lang: Language = 'en'): string {
  let cleaned = text
    .replace(/[*#_`~[\]()]/g, ' ') // Strip markdown syntax
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();

  // Language specific phonetic expansions
  if (lang === 'te') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 కిలోమీటర్లు')
      .replace(/108/g, 'ఒకటి సున్నా ఎనిమిది')
      .replace(/102/g, 'ఒకటి సున్నా రెండు');
  } else if (lang === 'hi') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 किलोमीटर')
      .replace(/108/g, 'एक सौ आठ')
      .replace(/102/g, 'एक सौ दो');
  } else if (lang === 'ta') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 கிலோமீட்டர்')
      .replace(/108/g, 'ஒன்று பூஜ்ஜியம் எட்டு');
  } else if (lang === 'kn') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 ಕಿಲೋಮೀಟರ್')
      .replace(/108/g, 'ಒಂದು ಸೊನ್ನೆ ಎಂಟು');
  } else {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 kilometers')
      .replace(/108/g, 'one zero eight')
      .replace(/102/g, 'one zero two');
  }

  return cleaned;
}

export type WordBoundaryCallback = (wordIndex: number, currentWord: string, charIndex: number) => void;

/**
 * High-accuracy multi-language TTS Voice Assistant with real-time word synchronization.
 */
export function speakTextInLanguage(
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void,
  onWordBoundary?: WordBoundaryCallback
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis is not supported on this browser.');
    return false;
  }

  // Cancel any active speech to avoid overlapping audio
  window.speechSynthesis.cancel();

  const cleanText = sanitizeTextForSpeech(text, lang);
  if (!cleanText) return false;

  const words = cleanText.split(/\s+/).filter(Boolean);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetBcp47 = bcp47LanguageCodes[lang] || 'en-IN';
  utterance.lang = targetBcp47;

  // Comfortable pacing for clear comprehension
  utterance.rate = 0.92;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const matchedVoice = findBestVoiceForLanguage(lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  let wordPointer = 0;
  let fallbackTimer: NodeJS.Timeout | null = null;

  utterance.onstart = () => {
    if (onStart) onStart();
    if (onWordBoundary && words.length > 0) {
      onWordBoundary(0, words[0], 0);

      // Fallback timer: advances word highlight every ~320ms if browser doesn't trigger boundary events
      const intervalMs = Math.max(220, Math.min(450, Math.floor(350 / utterance.rate)));
      fallbackTimer = setInterval(() => {
        wordPointer++;
        if (wordPointer < words.length) {
          onWordBoundary(wordPointer, words[wordPointer], wordPointer);
        } else if (fallbackTimer) {
          clearInterval(fallbackTimer);
        }
      }, intervalMs);
    }
  };

  utterance.onboundary = (event: SpeechSynthesisEvent) => {
    if (event.name === 'word' && onWordBoundary) {
      // Clear fallback timer if native boundary events are active
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
      
      const charIndex = event.charIndex || 0;
      // Calculate word index based on character offset
      const textBefore = cleanText.substring(0, charIndex);
      const calculatedWordIndex = textBefore.trim().split(/\s+/).filter(Boolean).length;
      const currentWord = words[calculatedWordIndex] || words[wordPointer] || '';
      wordPointer = calculatedWordIndex;

      onWordBoundary(calculatedWordIndex, currentWord, charIndex);
    }
  };

  utterance.onend = () => {
    if (fallbackTimer) clearInterval(fallbackTimer);
    if (onWordBoundary && words.length > 0) {
      onWordBoundary(words.length - 1, words[words.length - 1], cleanText.length);
    }
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    if (fallbackTimer) clearInterval(fallbackTimer);
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

/**
 * Conversational Voice Agent Talk-Back phrases in all 9 supported languages.
 */
export function getVoiceAgentGreeting(lang: Language): string {
  switch (lang) {
    case 'te':
      return 'నమస్కారం! మీ ఆరోగ్య సమస్యలను చెప్పండి. నేను వింటున్నాను.';
    case 'hi':
      return 'नमस्ते! अपनी स्वास्थ्य संबंधी समस्याएं बताएं। मैं आपकी बात सुन रहा हूँ।';
    case 'ta':
      return 'வணக்கம்! உங்கள் உடல்நலப் பிரச்சனைகளைக் கூறுங்கள். நான் கேட்கிறேன்.';
    case 'kn':
      return 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ತಿಳಿಸಿ. ನಾನು ಆಲಿಸುತ್ತಿದ್ದೇನೆ.';
    case 'bn':
      return 'নমস্কার! আপনার স্বাস্থ্য সংক্রান্ত সমস্যাগুলি বলুন। আমি শুনছি।';
    case 'mr':
      return 'नमस्कार! तुमची आरोग्य विषयक लक्षणे सांगा. मी ऐकत आहे.';
    case 'gu':
      return 'નમસ્તે! તમારી સ્વાસ્થ્ય સમસ્યાઓ જણાવો. હું સાંભળી રહ્યો છું.';
    case 'or':
      return 'ନମସ୍କାର! ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା କୁହନ୍ତୁ। ମୁଁ ଶୁଣୁଛି।';
    case 'en':
    default:
      return 'Hello! Please describe what you are feeling. I am listening.';
  }
}

export function getVoiceAgentSymptomAck(transcription: string, symptoms: string[], lang: Language): string {
  const symptomText = transcription || symptoms.join(', ') || 'recorded symptoms';

  switch (lang) {
    case 'te':
      return `మీరు చెప్పిన లక్షణాలు విన్నాను: "${symptomText}". మీ ఆరోగ్య భద్రత కోసం సమీప ఆసుపత్రుల వివరాలను పరిశీలిస్తున్నాము. విశ్లేషణను ప్రారంభించండి.`;
    case 'hi':
      return `मैंने आपके लक्षण सुने: "${symptomText}"। आपकी स्थिति और निकटतम अस्पताल के लिए जांच शुरू करने हेतु बटन दबाएं।`;
    case 'ta':
      return `உங்கள் அறிகுறிகளைப் பதிவு செய்துள்ளேன்: "${symptomText}". அருகிலுள்ள மருத்துவமனைகளை அறிய பகுப்பாய்வைத் தொடங்குங்கள்.`;
    case 'kn':
      return `ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿದ್ದೇನೆ: "${symptomText}". ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ವಿವರಗಳನ್ನು ಪಡೆಯಲು ವಿಶ್ಲೇಷಿಸಿ.`;
    case 'bn':
      return `আপনার উপসর্গ লিপিবদ্ধ করা হয়েছে: "${symptomText}". নিকটস্থ হাসপাতাল খুঁজতে বিশ্লেষণ শুরু করুন।`;
    case 'mr':
      return `मी तुमची लक्षणे नोंदवली आहेत: "${symptomText}". जवळचे रुग्णालय शोधण्यासाठी विश्लेषण सुरू करा.`;
    case 'gu':
      return `મેં તમારા લક્ષણો સાંભળ્યા છે: "${symptomText}". નજીકની હોસ્પિટલો શોધવા માટે વિશ્લેષણ શરૂ કરો.`;
    case 'or':
      return `ମୁଁ ଆପଣଙ୍କ ଲକ୍ଷଣ ଶୁଣିଛି: "${symptomText}". ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଖୋଜିବା ପାଇଁ ବିଶ୍ଳେଷଣ କରନ୍ତୁ।`;
    case 'en':
    default:
      return `I heard your symptoms: "${symptomText}". Click analyze to check clinical urgency and find the nearest verified hospitals.`;
  }
}
