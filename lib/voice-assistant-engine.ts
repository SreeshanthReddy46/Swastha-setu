'use client';

import { Language } from './language-context';
import { getSarvamVoiceConfig, getSarvamSpeaker, SARVAM_VOICE_MATRIX } from './sarvam-config';

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
  te: ['te-in', 'te_in', 'telugu', 'mohan', 'chitra', 'shruti', 'pavithra', 'te'],
  hi: ['hi-in', 'hi_in', 'hindi', 'madhur', 'swara', 'heera', 'kalpana', 'hemant', 'meera', 'hi'],
  ta: ['ta-in', 'ta_in', 'tamil', 'valluvar', 'pallavi', 'iniya', 'priya', 'ta'],
  kn: ['kn-in', 'kn_in', 'kannada', 'gagan', 'sapna', 'kn'],
  bn: ['bn-in', 'bn_in', 'bengali', 'bangla', 'bashkar', 'tanishaa', 'bn'],
  mr: ['mr-in', 'mr_in', 'marathi', 'manohar', 'aarohi', 'mr'],
  gu: ['gu-in', 'gu_in', 'gujarati', 'niranjan', 'dhwani', 'gu'],
  or: ['or-in', 'or_in', 'odia', 'oriya', 'roopa', 'or'],
  en: ['en-in', 'en_in', 'india', 'rishi', 'neerja', 'arvind', 'en-gb', 'en-us', 'en']
};

let cachedBrowserVoices: SpeechSynthesisVoice[] = [];
let activeHtmlAudio: HTMLAudioElement | null = null;
let activeAudioBlobUrl: string | null = null;
let activeWordTimer: NodeJS.Timeout | null = null;
let isVoicePlayingState = false;

export function isVoiceSpeechPlaying(): boolean {
  return isVoicePlayingState;
}

/**
 * Pre-initialize and cache browser voices to prevent initial empty array latency.
 */
export function initVoiceEngine(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedBrowserVoices = window.speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        cachedBrowserVoices = window.speechSynthesis.getVoices();
      };
    }
  }
}

/**
 * Find the optimal native voice matching the user's selected language in browser speech.
 */
export function findBestVoiceForLanguage(lang: Language): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = cachedBrowserVoices.length > 0 ? cachedBrowserVoices : window.speechSynthesis.getVoices();
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
 * Clean text for smooth, natural phonetic TTS playback across Indian scripts.
 */
export function sanitizeTextForSpeech(text: string, lang: Language = 'en'): string {
  let cleaned = text
    .replace(/[*#_`~[\]()]/g, ' ') // Strip markdown syntax
    .replace(/https?:\/\/\S+/g, '') // Strip URLs
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();

  // Language specific phonetic expansions for emergency numbers & distance units
  if (lang === 'te') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 కిలోమీటర్లు')
      .replace(/108/g, 'ఒకటి సున్నా ఎనిమిది')
      .replace(/102/g, 'ఒకటి సున్నా రెండు')
      .replace(/104/g, 'ఒకటి సున్నా నాలుగు');
  } else if (lang === 'hi') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 किलोमीटर')
      .replace(/108/g, 'एक सौ आठ')
      .replace(/102/g, 'एक सौ दो')
      .replace(/104/g, 'एक सौ चार');
  } else if (lang === 'ta') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 கிலோமீட்டர்')
      .replace(/108/g, 'ஒன்று பூஜ்ஜியம் எட்டு')
      .replace(/102/g, 'ஒன்று பூஜ்ஜியம் இரண்டு')
      .replace(/104/g, 'ஒன்று பூஜ்ஜியம் நான்கு');
  } else if (lang === 'kn') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 ಕಿಲೋಮೀಟರ್')
      .replace(/108/g, 'ಒಂದು ಸೊನ್ನೆ ಎಂಟು')
      .replace(/102/g, 'ಒಂದು ಸೊನ್ನೆ ಎರಡು')
      .replace(/104/g, 'ಒಂದು ಸೊನ್ನೆ ನಾಲ್ಕು');
  } else if (lang === 'bn') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 কিলোমিটার')
      .replace(/108/g, 'এক শূন্য আট')
      .replace(/102/g, 'এক শূন্য দুই')
      .replace(/104/g, 'এক শূন্য চার');
  } else if (lang === 'mr') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 किलोमीटर')
      .replace(/108/g, 'एक शून्य आठ')
      .replace(/102/g, 'एक शून्य दोन')
      .replace(/104/g, 'एक शून्य चार');
  } else if (lang === 'gu') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 કિલોમીટર')
      .replace(/108/g, 'એક શૂન્ય આઠ')
      .replace(/102/g, 'એક શૂન્ય બે')
      .replace(/104/g, 'એક શૂન્ય ચાર');
  } else if (lang === 'or') {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 କିଲୋମିଟର')
      .replace(/108/g, 'ଏକ ଶୂନ୍ୟ ଆଠ')
      .replace(/102/g, 'ଏକ ଶୂନ୍ୟ ଦୁଇ')
      .replace(/104/g, 'ଏକ ଶୂନ୍ୟ ଚାରି');
  } else {
    cleaned = cleaned
      .replace(/(\d+)\s*km/gi, '$1 kilometers')
      .replace(/108/g, 'one zero eight')
      .replace(/102/g, 'one zero two')
      .replace(/104/g, 'one zero four');
  }

  return cleaned;
}

export type WordBoundaryCallback = (wordIndex: number, currentWord: string, charIndex: number) => void;

/**
 * Fallback browser SpeechSynthesis TTS helper.
 */
function speakWithBrowserSpeechSynthesis(
  cleanText: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void,
  onWordBoundary?: WordBoundaryCallback
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis not supported in this browser.');
    return false;
  }

  window.speechSynthesis.cancel();

  const words = cleanText.split(/\s+/).filter(Boolean);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetBcp47 = bcp47LanguageCodes[lang] || 'en-IN';
  utterance.lang = targetBcp47;
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
      if (fallbackTimer) {
        clearInterval(fallbackTimer);
        fallbackTimer = null;
      }
      const charIndex = event.charIndex || 0;
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

/**
 * High-accuracy multi-language TTS Voice Assistant using Sarvam AI Bulbul neural voices
 * with synchronized word highlighting and seamless browser fallback.
 */
export function speakTextInLanguage(
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void,
  onWordBoundary?: WordBoundaryCallback,
  customSpeaker?: string
): boolean {
  if (typeof window === 'undefined') return false;

  stopVoiceSpeech();

  const cleanText = sanitizeTextForSpeech(text, lang);
  if (!cleanText) return false;

  const words = cleanText.split(/\s+/).filter(Boolean);
  const sarvamConfig = getSarvamVoiceConfig(lang);
  const speaker = customSpeaker || sarvamConfig.defaultSpeaker;

  // Asynchronously request Sarvam AI TTS via Next.js backend proxy
  (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2600);

      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          text: cleanText,
          language: lang,
          speaker: speaker,
          pace: sarvamConfig.pace
        })
      });
      clearTimeout(timeout);

      const data = await response.json();

      if (data.success && data.audioBase64) {
        // Convert Base64 into audio blob URL
        const binaryString = atob(data.audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: data.format || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        activeAudioBlobUrl = url;

        const audio = new Audio(url);
        activeHtmlAudio = audio;

        audio.onplay = () => {
          isVoicePlayingState = true;
          if (onStart) onStart();

          if (onWordBoundary && words.length > 0) {
            onWordBoundary(0, words[0], 0);

            // Dynamic word tracker based on expected speech duration
            const estimatedDurationSec = Math.max(1, words.length * 0.36);
            const intervalMs = Math.max(160, Math.floor((estimatedDurationSec * 1000) / words.length));
            let currentIndex = 0;

            activeWordTimer = setInterval(() => {
              currentIndex++;
              if (currentIndex < words.length) {
                onWordBoundary(currentIndex, words[currentIndex], currentIndex);
              } else if (activeWordTimer) {
                clearInterval(activeWordTimer);
                activeWordTimer = null;
              }
            }, intervalMs);
          }
        };

        audio.onended = () => {
          isVoicePlayingState = false;
          if (activeWordTimer) {
            clearInterval(activeWordTimer);
            activeWordTimer = null;
          }
          if (onWordBoundary && words.length > 0) {
            onWordBoundary(words.length - 1, words[words.length - 1], cleanText.length);
          }
          if (activeAudioBlobUrl) {
            URL.revokeObjectURL(activeAudioBlobUrl);
            activeAudioBlobUrl = null;
          }
          activeHtmlAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          isVoicePlayingState = false;
          console.warn('Sarvam Audio playback error, falling back to browser speech synthesis:', e);
          if (activeWordTimer) {
            clearInterval(activeWordTimer);
            activeWordTimer = null;
          }
          speakWithBrowserSpeechSynthesis(cleanText, lang, onStart, onEnd, onError, onWordBoundary);
        };

        await audio.play();
        return;
      }

      // If backend signaled fallback (e.g. no SARVAM_API_KEY) or failed
      speakWithBrowserSpeechSynthesis(cleanText, lang, onStart, onEnd, onError, onWordBoundary);
    } catch (err) {
      isVoicePlayingState = false;
      console.warn('Failed to call Sarvam TTS endpoint, using browser speech fallback:', err);
      speakWithBrowserSpeechSynthesis(cleanText, lang, onStart, onEnd, onError, onWordBoundary);
    }
  })();

  return true;
}

/**
 * Instantly stops any active voice playback (HTML5 audio or browser speech synthesis).
 */
export function stopVoiceSpeech(): void {
  if (typeof window === 'undefined') return;

  isVoicePlayingState = false;

  if (activeWordTimer) {
    clearInterval(activeWordTimer);
    activeWordTimer = null;
  }

  if (activeHtmlAudio) {
    activeHtmlAudio.pause();
    activeHtmlAudio.currentTime = 0;
    activeHtmlAudio = null;
  }

  if (activeAudioBlobUrl) {
    URL.revokeObjectURL(activeAudioBlobUrl);
    activeAudioBlobUrl = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Conversational Voice Agent Greetings in all 9 supported Indian languages.
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

/**
 * Clinically intelligent, dynamic conversational voice response generated from user voice / text input
 * tailored to all 9 supported Indian languages using Sarvam AI voice personas.
 */
export function getVoiceAgentSymptomAck(transcription: string, symptoms: string[], lang: Language): string {
  const symptomText = transcription || symptoms.join(', ') || 'recorded symptoms';
  const lower = (transcription + ' ' + symptoms.join(' ')).toLowerCase();

  // Clinical Intent Category 1: Emergency & Cardiac / Trauma / Snake bite
  const isEmergency = [
    'chest pain', 'shortness of breath', 'breathing', 'severe bleeding', 'unconscious', 'faint',
    'stroke', 'snake', 'seizure', 'cardiac', 'fits', 'heart', 'trauma', 'choking',
    'ఛాతీ', 'గుండె', 'శ్వాస', 'రక్తం', 'పాము', 'స్పృహ', 'తీవ్రమైన',
    'छाती', 'सांस', 'रक्तस्राव', 'बेहोश', 'सांप', 'दौरा',
    'நெஞ்சு', 'மூச்சு', 'ரத்தம்', 'பாம்பு', 'மயக்கம்',
    'ಎದೆ', 'ಉಸಿರಾಟ', 'ರಕ್ತಸ್ರಾವ', 'ಹಾವು', 'ಮೂರ್ಛೆ',
    'বুক', 'শ্বাস', 'রক্তপাত', 'সাপ', 'অজ্ঞান',
    'छातीत', 'श्वास', 'रक्तस्त्राव', 'साप', 'बेहोश',
    'છાતી', 'શ્વાસ', 'લોહી', 'સાપ', 'બેભાન',
    'ଛାତି', 'ନିଶ୍ୱାସ', 'ରକ୍ତସ୍ରାବ', 'ସାପ'
  ].some(kw => lower.includes(kw));

  if (isEmergency) {
    switch (lang) {
      case 'te':
        return `హెచ్చరిక: మీరు చెప్పిన ఛాతీ నొప్పి మరియు శ్వాస సమస్య అత్యవసర లక్షణాలు. వెంటనే 108 నంబర్‌కు కాల్ చేయండి లేదా తక్షణమే సమీప అత్యవసర ఆసుపత్రి విశ్లేషణను ప్రారంభించండి.`;
      case 'hi':
        return `चेतावनी: आपके द्वारा बताए गए सीने में दर्द और सांस की तकलीफ आपातकालीन लक्षण हैं। तुरंत 108 पर कॉल करें या निकटतम आपातकालीन अस्पताल हेतु जांच शुरू करें।`;
      case 'ta':
        return `எச்சரிக்கை: நெஞ்சு வலி மற்றும் மூச்சுத் திணறல் அவசர அறிகுறிகள். உடனடியாக 108 ஐ அழைக்கவும் அல்லது அவசர மருத்துவமனைக்கு பகுப்பாய்வு தொடங்குங்கள்.`;
      case 'kn':
        return `ಎಚ್ಚರಿಕೆ: ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ ತುರ್ತು ಲಕ್ಷಣಗಳು. ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ತುರ್ತು ಆಸ್ಪತ್ರೆಗಾಗಿ ವಿಶ್ಲೇಷಿಸಿ.`;
      case 'bn':
        return `সতর্কতা: বুকে ব্যথা ও শ্বাসকষ্ট জরুরি লক্ষণ। অবিলম্বে ১০৮ এ কল করুন বা নিকটস্থ হাসপাতালের জন্য বিশ্লেষণ শুরু করুন।`;
      case 'mr':
        return `इशारा: छातीत दुखणे आणि श्वास घेण्यास त्रास ही तातडीची लक्षणे आहेत. त्वरित १०८ वर कॉल करा किंवा रुग्णालय शोधण्यासाठी विश्लेषण सुरू करा.`;
      case 'gu':
        return `ચેતવણી: છાતીમાં દુખાવો અને શ્વાસ લેવામાં તકલીફ કટોકટીના લક્ષણો છે. તરત જ ૧૦૮ પર કૉલ કરો અથવા નજીકની હોસ્પિટલ માટે વિશ્લેષણ શરૂ કરો.`;
      case 'or':
        return `ସତର୍କତା: ଛାତି ଯନ୍ତ୍ରଣା ଏବଂ ନିଶ୍ୱାସ କଷ୍ଟ ଜରୁରୀ ଲକ୍ଷଣ। ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ କିମ୍ବା ଡାକ୍ତରଖାନା ପାଇଁ ବିଶ୍ଳେଷଣ ଆରମ୍ଭ କରନ୍ତୁ।`;
      case 'en':
      default:
        return `Warning: Chest pain and shortness of breath are high-priority emergency symptoms. Call 108 immediately or analyze now for the nearest emergency hospital.`;
    }
  }

  // Clinical Intent Category 2: Maternity & Pregnancy
  const isMaternity = [
    'pregnant', 'pregnancy', 'labor', 'delivery', 'water broke', 'fetus', 'trimester',
    'గర్భిణీ', 'కాన్పు', 'డెలివరీ', 'నొప్పులు',
    'गर्भवती', 'प्रसव', 'डिलीवरी', 'गर्भ',
    'கர்ப்பம்', 'பிரசவம்',
    'ಗರ್ಭಿಣಿ', 'ಹೆರಿಗೆ',
    'গর্ভবতী', 'প্রসব',
    'गरोदर', 'प्रसूती',
    'સગર્ભા', 'પ્રસૂતિ',
    'ଗର୍ଭବତୀ', 'ପ୍ରସବ'
  ].some(kw => lower.includes(kw));

  if (isMaternity) {
    switch (lang) {
      case 'te':
        return `ప్రసూతి మరియు డెలివరీ సంబంధిత లక్షణాలను నమోదు చేశాము. సమీప 24 గంటల ఆసుపత్రి మరియు 102 అంబులెన్స్ వివరాల కోసం విశ్లేషణ ప్రారంభించండి.`;
      case 'hi':
        return `मातृत्व एवं प्रसव संबंधी लक्षण दर्ज किए गए हैं। निकटतम 24x7 प्रसूति केंद्र और 102 एम्बुलेंस सेवा हेतु विश्लेषण शुरू करें।`;
      case 'ta':
        return `கர்ப்பகால மற்றும் பிரசவ அறிகுறிகள் பதிவு செய்யப்பட்டுள்ளன. அருகிலுள்ள 24x7 தாய்-சேய் மருத்துவமனைக்கு பகுப்பாய்வு தொடங்குங்கள்.`;
      case 'kn':
        return `ಹೆರಿಗೆ ಮತ್ತು ಗರ್ಭಧಾರಣೆಯ ಲಕ್ಷಣಗಳು ದಾಖಲಾಗಿವೆ. ಹತ್ತಿರದ 24 ಗಂಟೆಗಳ ಮಾತೃತ್ವ ಆಸ್ಪತ್ರೆಗಾಗಿ ವಿಶ್ಲೇಷಿಸಿ.`;
      case 'bn':
        return `মাতৃত্ব ও প্রসব সংক্রান্ত লক্ষণ লিপিবদ্ধ করা হয়েছে। নিকটস্থ ২৪ ঘণ্টার প্রসূতি হাসপাতালের জন্য বিশ্লেষণ শুরু করুন।`;
      case 'mr':
        return `प्रसूती आणि गरोदरपणाची लक्षणे नोंदवली गेली आहेत. जवळच्या २४ तास प्रसूती केंद्रासाठी विश्लेषण सुरू करा.`;
      case 'gu':
        return `સગર્ભાવસ્થા અને પ્રસૂતિ સંબંધિત લક્ષણો નોંધાયા છે. નજીકના ૨૪ કલાકના પ્રસૂતિ કેન્દ્ર માટે વિશ્લેષણ શરૂ કરો.`;
      case 'or':
        return `ମାତୃତ୍ୱ ଓ ପ୍ରସବ ସମ୍ବନ୍ଧୀୟ ଲକ୍ଷଣ ରେକର୍ଡ ହୋଇଛି। ନିକଟସ୍ଥ ୨୪ ଘଣ୍ଟିଆ ପ୍ରସୂତି କେନ୍ଦ୍ର ପାଇଁ ବିଶ୍ଳେଷଣ କରନ୍ତୁ।`;
      case 'en':
      default:
        return `Maternity and labor symptoms recorded. Click analyze to locate the nearest 24x7 maternal care facility and 102 ambulance.`;
    }
  }

  // Clinical Intent Category 3: Gastrointestinal & Vomiting / Diarrhea / Stomach Pain
  const isGastro = [
    'stomach', 'vomiting', 'vomit', 'diarrhea', 'loose motion', 'abdomen', 'belly', 'cramps',
    'కడుపు', 'వాంతులు', 'విరేచనాలు', 'కడుపునొప్పి',
    'पेट', 'उल्टी', 'दस्त', 'पेट दर्द',
    'வயிறு', 'வாந்தி', 'வயிற்றுப்போக்கு',
    'ಹೊಟ್ಟೆ', 'ವಾಂತಿ', 'ಭೇದಿ',
    'পেট', 'বমি', 'ডায়রিয়া',
    'पोट', 'उलट्या', 'जुलाब',
    'પેટ', 'ઉલટી', 'ઝાડા',
    'ପେଟ', 'ବାନ୍ତି', 'ଝାଡ଼ା'
  ].some(kw => lower.includes(kw));

  if (isGastro) {
    switch (lang) {
      case 'te':
        return `మీరు చెప్పిన కడుపు నొప్పి మరియు వాంతులు విన్నాను: "${symptomText}". ఓఆర్ఎస్ మరియు పరిశుభ్రమైన నీరు తీసుకోండి. సమీప ప్రాథమిక ఆరోగ్య కేంద్రం కోసం విశ్లేషణ చేయండి.`;
      case 'hi':
        return `मैंने आपके पेट दर्द और उल्टी के लक्षण सुने: "${symptomText}"। ओआरएस पिएं और निकटतम प्राथमिक स्वास्थ्य केंद्र हेतु विश्लेषण शुरू करें।`;
      case 'ta':
        return `வயிற்று வலி மற்றும் வாந்தி அறிகுறிகள் பதிவாகியுள்ளன: "${symptomText}". ஓஆர்எஸ் குடிக்கவும், அருகிலுள்ள மருத்துவமனைக்கு பகுப்பாய்வு தொடங்குங்கள்.`;
      case 'kn':
        return `ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ವಾಂತಿ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿದ್ದೇನೆ: "${symptomText}". ಓಆರ್‌ಎಸ್ ಸೇವಿಸಿ ಮತ್ತು ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕಾಗಿ ವಿಶ್ಲೇಷಿಸಿ.`;
      case 'bn':
        return `পেটে ব্যথা ও বমির লক্ষণ লিপিবদ্ধ করা হয়েছে: "${symptomText}". ওআরএস পান করুন এবং নিকটস্থ স্বাস্থ্য কেন্দ্রের জন্য বিশ্লেষণ শুরু করুন।`;
      case 'mr':
        return `पोटदुखी आणि उलट्यांची लक्षणे नोंदवली आहेत: "${symptomText}". ओआरएस प्या आणि जवळच्या प्राथमिक आरोग्य केंद्रासाठी विश्लेषण सुरू करा.`;
      case 'gu':
        return `પેટમાં દુખાવો અને ઉલટીના લક્ષણો સાંભળ્યા છે: "${symptomText}". ઓઆરએસ લો અને નજીકના આરોગ્ય કેન્દ્ર માટે વિશ્લેષણ શરૂ કરો.`;
      case 'or':
        return `ପେଟ ଯନ୍ତ୍ରଣା ଏବଂ ବାନ୍ତି ଲକ୍ଷଣ ଶୁଣିଛି: "${symptomText}". ଓଆରଏସ ପିଅନ୍ତୁ ଏବଂ ନିକଟସ୍ଥ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ପାଇଁ ବିଶ୍ଳେଷଣ କରନ୍ତୁ।`;
      case 'en':
      default:
        return `I heard your stomach pain and vomiting symptoms: "${symptomText}". Stay hydrated with ORS and analyze to find your nearest Primary Health Centre.`;
    }
  }

  // Clinical Intent Category 4: Fever, Cough, Infection & Headaches
  const isFever = [
    'fever', 'temperature', 'chills', 'cough', 'cold', 'throat', 'headache', 'body pain',
    'జ్వరం', 'దగ్గు', 'జలుబు', 'తలనొప్పి', 'ఒళ్లు నొప్పులు',
    'बुखार', 'खांसी', 'जुकाम', 'सिरदर्द', 'गला खराब',
    'காய்ச்சல்', 'இருமல்', 'சளி', 'தலைவலி',
    'ಜ್ವರ', 'ಕೆಮ್ಮು', 'ನೆಗಡಿ', 'ತಲೆನೋವು',
    'জ্বর', 'কাশি', 'সর্দি', 'মাথাব্যথা',
    'ताप', 'खोकला', 'सर्दी', 'डोकेदुखी',
    'તાવ', 'ખાંસી', 'શરદી', 'માથાનો દુખાવો',
    'ଜ୍ୱର', 'କାଶ', 'ଥଣ୍ଡା', 'ମୁଣ୍ଡବିନ୍ଧା'
  ].some(kw => lower.includes(kw));

  if (isFever) {
    switch (lang) {
      case 'te':
        return `మీరు చెప్పిన జ్వరం మరియు దగ్గు లక్షణాలు విన్నాను: "${symptomText}". తగినంత విశ్రాంతి తీసుకోండి మరియు సమీప వైద్యుల వివరాల కోసం విశ్లేషణ ప్రారంభించండి.`;
      case 'hi':
        return `बुखार और संक्रमण के लक्षण दर्ज किए गए हैं: "${symptomText}"। पर्याप्त आराम करें और निकटतम डॉक्टर की सलाह हेतु विश्लेषण शुरू करें।`;
      case 'ta':
        return `காய்ச்சல் மற்றும் சளி அறிகுறிகள் பதிவாகியுள்ளன: "${symptomText}". ஓய்வெடுக்கவும், அருகிலுள்ள மருத்துவ அலுவலரை அறிய பகுப்பாய்வு தொடங்குங்கள்.`;
      case 'kn':
        return `ಜ್ವರ ಮತ್ತು ಸೋಂಕಿನ ಲಕ್ಷಣಗಳು ದಾಖಲಾಗಿವೆ: "${symptomText}". ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಹತ್ತಿರದ ವೈದ್ಯರ ಸಲಹೆಗಾಗಿ ವಿಶ್ಲೇಷಿಸಿ.`;
      case 'bn':
        return `জ্বর ও সংক্রমণের লক্ষণ লিপিবদ্ধ করা হয়েছে: "${symptomText}". বিশ্রাম নিন এবং চিকিৎসকের পরামর্শের জন্য বিশ্লেষণ শুরু করুন।`;
      case 'mr':
        return `ताप आणि संसर्गाची लक्षणे नोंदवली आहेत: "${symptomText}". विश्रांती घ्या आणि जवळच्या डॉक्टरांच्या सल्ल्यासाठी विश्लेषण सुरू करा.`;
      case 'gu':
        return `તાવ અને ચેપના લક્ષણો નોંધાયા છે: "${symptomText}". આરામ કરો અને નજીકના ડૉક્ટરની સલાહ માટે વિશ્લેષણ શરૂ કરો.`;
      case 'or':
        return `ଜ୍ୱର ଏବଂ ସଂକ୍ରମଣ ଲକ୍ଷଣ ରେକର୍ଡ ହୋଇଛି: "${symptomText}". ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ଡାକ୍ତରୀ ପରାମର୍ଶ ପାଇଁ ବିଶ୍ଳେଷଣ କରନ୍ତୁ।`;
      case 'en':
      default:
        return `I recorded your fever and infection symptoms: "${symptomText}". Rest well and click analyze to check clinical urgency and verified medical officers.`;
    }
  }

  // Fallback: General / Tailored Symptom Feedback
  switch (lang) {
    case 'te':
      return `మీరు చెప్పిన లక్షణాలు విన్నాను: "${symptomText}". మీ ఆరోగ్య భద్రత కోసం సమీప ఆసుపత్రుల వివరాలు మరియు వైద్య సలహా కోసం విశ్లేషణను ప్రారంభించండి.`;
    case 'hi':
      return `मैंने आपके लक्षण सुने: "${symptomText}"। आपकी स्थिति और निकटतम अस्पताल के लिए जांच शुरू करने हेतु विश्लेषण बटन दबाएं।`;
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

/**
 * Emergency Guidelines voice text in all 9 supported Indian languages.
 */
export function getVoiceEmergencyGuidelines(lang: Language): string {
  switch (lang) {
    case 'te':
      return 'అత్యవసర మోడ్ ప్రారంభించబడింది. తీవ్రమైన ఛాతీ నొప్పి, శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా అధిక రక్తస్రావం ఉంటే, వెంటనే 108 నంబర్‌కు కాల్ చేయండి.';
    case 'hi':
      return 'आपातकालीन मोड सक्रिय है। यदि आपको सीने में तेज दर्द, सांस लेने में तकलीफ या अत्यधिक रक्तस्राव हो रहा है, तो तुरंत 108 पर कॉल करें।';
    case 'ta':
      return 'அவசர முறை செயல்படுத்தப்பட்டுள்ளது. கடுமையான மார்பு வலி, மூச்சுத் திணறல் அல்லது அதிக ரத்தப்போக்கு இருந்தால், உடனடியாக 108 ஐ அழைக்கவும்.';
    case 'kn':
      return 'ತುರ್ತು ಸ್ಥಿತಿ ಸಕ್ರಿಯವಾಗಿದೆ. ತೀವ್ರ ಎದೆ ನೋವು, ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ.';
    case 'bn':
      return 'জরুরি মোড সক্রিয়। তীব্র বুকে ব্যথা, শ্বাসকষ্ট বা অতিরিক্ত রক্তপাতের ক্ষেত্রে অবিলম্বে ১০৮ নম্বরে কল করুন।';
    case 'mr':
      return 'आणीबाणी मोड सुरू आहे. छातीत तीव्र वेदना, श्वास घेण्यास त्रास किंवा जास्त रक्तस्त्राव होत असल्यास त्वरित १०८ वर कॉल करा.';
    case 'gu':
      return 'ઇમરજન્સી મોડ સક્રિય છે. જો છાતીમાં તીવ્ર દુખાવો, શ્વાસ લેવામાં તકલીફ અથવા વધુ રક્તસ્ત્રાવ હોય, તો તરત જ 108 પર કૉલ કરો.';
    case 'or':
      return 'ଜରୁରୀକାଳୀନ ମୋଡ୍ ସକ୍ରିୟ ଅଛି। ଯଦି ପ୍ରବଳ ଛାତି ଯନ୍ତ୍ରଣା, ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ କିମ୍ବା ରକ୍ତସ୍ରାବ ହୁଏ, ତେବେ ତୁରନ୍ତ ୧୦୮ କୁ କଲ୍ କରନ୍ତୁ।';
    case 'en':
    default:
      return 'Emergency Mode Active. If experiencing severe chest pain, breathing difficulty, or heavy bleeding, call 108 immediately.';
  }
}

/**
 * Send audio blob to Sarvam Saaras STT endpoint for neural Indian language transcription.
 */
export async function transcribeAudioWithSarvam(
  audioBlob: Blob,
  lang: Language,
  prompt?: string
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('language', lang);
    if (prompt) formData.append('prompt', prompt);

    const response = await fetch('/api/voice/stt', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success && typeof data.transcript === 'string') {
      return data.transcript.trim();
    }
    return null;
  } catch (err) {
    console.warn('Error during Sarvam STT transcription:', err);
    return null;
  }
}
