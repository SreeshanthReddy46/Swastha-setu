'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare, RotateCcw } from 'lucide-react';
import { useLanguage, languageNames, Language } from '@/lib/language-context';
import { 
  bcp47LanguageCodes, 
  speakTextInLanguage, 
  stopVoiceSpeech, 
  getVoiceAgentGreeting, 
  getVoiceAgentSymptomAck,
  initVoiceEngine
} from '@/lib/voice-assistant-engine';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResultItem[];
  length: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((err: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface VoiceInputProps {
  onTranscriptComplete: (text: string) => void;
}

const LANGUAGE_PRESETS: Record<Language, { label: string; text: string; isEmergency?: boolean }[]> = {
  te: [
    { label: "కడుపు నొప్పి & వాంతులు", text: "నాకు కడుపులో తీవ్రమైన నొప్పి మరియు వాంతులు అవుతున్నాయి" },
    { label: "ఛాతీ నొప్పి (108 అత్యవసరం)", text: "నాకు ఛాతీలో తీవ్రమైన నొప్పి మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది", isEmergency: true },
    { label: "తీవ్రమైన జ్వరం & తలనొప్పి", text: "నాకు 3 రోజులుగా తీవ్రమైన జ్వరం మరియు తలనొప్పి ఉంది" }
  ],
  hi: [
    { label: "पेट दर्द और उल्टी", text: "मुझे पेट में तेज दर्द और उल्टी हो रही है" },
    { label: "छाती में दर्द (108 आपातकालीन)", text: "मुझे छाती में तेज दर्द और सांस लेने में तकलीफ है", isEmergency: true },
    { label: "तेज बुखार और सिरदर्द", text: "मुझे पिछले 3 दिनों से तेज बुखार और सिरदर्द है" }
  ],
  ta: [
    { label: "வயிற்று வலி & வாந்தி", text: "எனக்கு கடுமையான வயிற்று வலி மற்றும் வாந்தி உள்ளது" },
    { label: "நெஞ்சு வலி (108 அவசரம்)", text: "எனக்கு நெஞ்சு வலி மற்றும் மூச்சுத் திணறல் உள்ளது", isEmergency: true },
    { label: "காய்ச்சல் & தலைவலி", text: "எனக்கு 3 நாட்களாக கடுமையான காய்ச்சல் மற்றும் தலைவலி உள்ளது" }
  ],
  kn: [
    { label: "ಹೊಟ್ಟೆ ನೋವು & ವಾಂತಿ", text: "ನನಗೆ ಹೊಟ್ಟೆಯಲ್ಲಿ ತೀವ್ರ ನೋವು ಮತ್ತು ವಾಂತಿ ಇದೆ" },
    { label: "ಎದೆ ನೋವು (108 ತುರ್ತು)", text: "ನನಗೆ ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆ", isEmergency: true },
    { label: "ತೀವ್ರ ಜ್ವರ & ತಲೆನೋವು", text: "ನನಗೆ 3 ದಿನಗಳಿಂದ ತೀವ್ರ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ" }
  ],
  bn: [
    { label: "পেটে তীব্র ব্যথা ও বমি", text: "আমার পেটে তীব্র ব্যথা এবং বমি হচ্ছে" },
    { label: "বুকে ব্যথা (১০৮ জরুরি)", text: "আমার বুকে তীব্র ব্যথা এবং শ্বাসকষ্ট হচ্ছে", isEmergency: true },
    { label: "তীব্র জ্বর ও মাথাব্যথা", text: "আমার ৩ দিন ধরে তীব্র জ্বর ও মাথাব্যথা রয়েছে" }
  ],
  mr: [
    { label: "पोटदुखी व उलट्या", text: "माझ्या पोटात तीव्र वेदना आणि उलट्या होत आहेत" },
    { label: "छातीत दुखणे (१०८ तातडी)", text: "माझ्या छातीत तीव्र वेदना आणि श्वास घेण्यास त्रास होत आहे", isEmergency: true },
    { label: "तीव्र ताप व डोकेदुखी", text: "मला ३ दिवसांपासून तीव्र ताप आणि डोकेदुखी आहे" }
  ],
  gu: [
    { label: "પેટમાં દુખાવો અને ઉલટી", text: "મને પેટમાં તીવ્ર દુખાવો અને ઉલટી થઈ રહી છે" },
    { label: "છાતીમાં દુખાવો (૧૦૮ તાત્કાલિક)", text: "મને છાતીમાં તીવ્ર દુખાવો અને શ્વાસ લેવામાં તકલીફ છે", isEmergency: true },
    { label: "ખૂબ તાવ અને માથાનો દુખાવો", text: "મને ૩ દિવસથી ખૂબ તાવ અને માથાનો દુખાવો છે" }
  ],
  or: [
    { label: "ପେଟ ଯନ୍ତ୍ରଣା ଓ ବାନ୍ତି", text: "ମୋର ପେଟରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ଏବଂ ବାନ୍ତି ହେଉଛି" },
    { label: "ଛାତି ଯନ୍ତ୍ରଣା (୧୦୮ ଜରୁରୀ)", text: "ମୋର ଛାତିରେ ଯନ୍ତ୍ରଣା ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି", isEmergency: true },
    { label: "ପ୍ରବଳ ଜ୍ୱର ଓ ମୁଣ୍ଡବିନ୍ଧା", text: "ମୋର ୩ ଦିନ ହେବ ପ୍ରବଳ ଜ୍ୱର ଏବଂ ମୁଣ୍ଡବିନ୍ଧା ଅଛି" }
  ],
  en: [
    { label: "Stomach Pain & Vomiting", text: "I have severe stomach pain and vomiting since yesterday" },
    { label: "Chest Pain & Dyspnea (108)", text: "I have crushing chest pain and shortness of breath", isEmergency: true },
    { label: "High Fever & Headache", text: "I have high fever with chills and severe headache for 3 days" }
  ]
};

export function VoiceInput({ onTranscriptComplete }: VoiceInputProps) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Conversational Talk-Back States
  const [customAgentSpeech, setCustomAgentSpeech] = useState<string | null>(null);
  const agentSpeechText = customAgentSpeech || getVoiceAgentGreeting(language);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const onCompleteRef = useRef(onTranscriptComplete);

  useEffect(() => {
    onCompleteRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  // Pre-load voices on component mount
  useEffect(() => {
    initVoiceEngine();
  }, []);

  // Helper to make the voice agent talk back with word synchronization
  const triggerAgentTalkBack = useCallback((textToSpeak: string) => {
    setCustomAgentSpeech(textToSpeak);
    setHighlightedWordIndex(-1);

    speakTextInLanguage(
      textToSpeak,
      language,
      () => setAgentSpeaking(true),
      () => {
        setAgentSpeaking(false);
        setHighlightedWordIndex(-1);
      },
      () => {
        setAgentSpeaking(false);
        setHighlightedWordIndex(-1);
      },
      (wordIndex) => {
        setHighlightedWordIndex(wordIndex);
      }
    );
  }, [language]);

  // Re-instantiate recognition when language changes to ensure correct BCP-47 model
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop error
      }
      recognitionRef.current = null;
    }

    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => ISpeechRecognition;
      webkitSpeechRecognition?: new () => ISpeechRecognition;
    };
    const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recog = new SpeechRecognitionClass();
      recog.continuous = true;
      recog.interimResults = true;
      const targetBcp47 = bcp47LanguageCodes[language] || 'en-IN';
      recog.lang = targetBcp47;

      recog.onresult = (event: SpeechRecognitionEvent) => {
        let fullSpeechText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullSpeechText += event.results[i][0].transcript;
        }
        setTranscript(fullSpeechText);
        if (onCompleteRef.current) {
          onCompleteRef.current(fullSpeechText);
        }
      };

      recog.onerror = (err: unknown) => {
        console.warn("Speech recognition notice:", err);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      stopVoiceSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, [language]);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return;

    if (isListening) {
      try {
        recog.stop();
      } catch {
        // Ignore
      }
      setIsListening(false);
      
      // When user stops speaking, voice agent acknowledges symptoms
      if (transcript.trim().length > 0) {
        const ack = getVoiceAgentSymptomAck(transcript, [], language);
        triggerAgentTalkBack(ack);
      }
    } else {
      stopVoiceSpeech();
      setAgentSpeaking(false);
      setTranscript('');
      try {
        recog.start();
        setIsListening(true);
      } catch {
        setIsListening(true);
      }
    }
  };

  const handleSimulate = (text: string) => {
    setTranscript(text);
    onTranscriptComplete(text);
    const ack = getVoiceAgentSymptomAck(text, [], language);
    triggerAgentTalkBack(ack);
  };

  const currentLangInfo = languageNames[language] || languageNames['en'];
  const activePresets = LANGUAGE_PRESETS[language] || LANGUAGE_PRESETS['en'];
  const spokenWords = agentSpeechText ? agentSpeechText.split(/\s+/).filter(Boolean) : [];

  return (
    <div className="bg-white border border-[#E5DCC8] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
      
      {/* Visual Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0F6E56]" />
          <span>Interactive AI Voice Agent ({currentLangInfo.native})</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418]">
          {isListening ? t('listening') : t('startVoiceCheckup')}
        </h3>
        <p className="text-xs text-[#6B6355] mt-1">
          Active Speech Model: <strong className="text-[#0F6E56] font-bold">{currentLangInfo.native} ({currentLangInfo.english})</strong> · BCP-47: <code className="bg-[#FAF6EE] px-1.5 py-0.5 rounded border border-[#E5DCC8]">{bcp47LanguageCodes[language]}</code>
        </p>
      </div>

      {/* Main Mic Pulsating Button */}
      <div className="py-2">
        <button
          onClick={toggleListening}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-lg transition-transform active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-[#A32D2D] text-white animate-mic-pulse ring-8 ring-rose-200'
              : 'bg-[#D85A30] hover:bg-[#C24C24] text-white shadow-md'
          }`}
          aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? (
            <MicOff className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12 animate-pulse" />
          )}
        </button>
        <span className="text-xs font-bold text-[#6B6355] block mt-3">
          {isListening ? "Tap to Finish Speaking & Receive Voice Assessment" : "Tap Microphone & Speak Symptoms Naturally"}
        </span>
      </div>

      {/* Audio Waveform Animation Indicator */}
      {isListening && (
        <div className="flex items-center justify-center gap-1.5 h-6">
          <div className="w-1.5 bg-[#D85A30] rounded-full animate-bounce h-4" />
          <div className="w-1.5 bg-[#D85A30] rounded-full animate-bounce h-6 delay-75" />
          <div className="w-1.5 bg-[#D85A30] rounded-full animate-bounce h-3 delay-150" />
          <div className="w-1.5 bg-[#D85A30] rounded-full animate-bounce h-5 delay-100" />
          <div className="w-1.5 bg-[#D85A30] rounded-full animate-bounce h-2" />
        </div>
      )}

      {/* Real-time Conversational Talk-Back Subtitle Box */}
      <div className={`p-4 rounded-2xl border text-left transition-all ${
        agentSpeaking 
          ? 'bg-amber-50 border-amber-300 shadow-sm' 
          : 'bg-[#FAF6EE] border-[#E5DCC8]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6E56] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            {agentSpeaking ? `AI Voice Assistant Speaking in ${currentLangInfo.native}...` : `AI Voice Assistant Response (${currentLangInfo.native}):`}
          </span>

          <div className="flex items-center gap-2">
            {agentSpeaking ? (
              <button
                onClick={() => {
                  stopVoiceSpeech();
                  setAgentSpeaking(false);
                  setHighlightedWordIndex(-1);
                }}
                className="text-[11px] font-bold text-[#A32D2D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <VolumeX className="w-3 h-3" /> Stop Voice
              </button>
            ) : (
              <button
                onClick={() => triggerAgentTalkBack(agentSpeechText || getVoiceAgentGreeting(language))}
                className="text-[11px] font-bold text-[#0F6E56] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" /> Replay Voice
              </button>
            )}
          </div>
        </div>

        {/* Word-by-Word Real-Time Synchronized Highlighting Box */}
        <div className="text-sm font-medium leading-relaxed min-h-[48px] flex flex-wrap gap-x-1.5 gap-y-1 items-center">
          {spokenWords.length > 0 ? (
            spokenWords.map((word, idx) => {
              const isCurrent = highlightedWordIndex === idx;
              return (
                <span
                  key={idx}
                  className={`transition-all duration-150 rounded px-1 ${
                    isCurrent
                      ? 'bg-[#0F6E56] text-white font-extrabold shadow-sm scale-105'
                      : agentSpeaking && highlightedWordIndex > idx
                      ? 'text-[#0F6E56] font-semibold'
                      : 'text-[#2C2418]'
                  }`}
                >
                  {word}
                </span>
              );
            })
          ) : (
            <span className="text-[#6B6355] italic text-xs">
              {getVoiceAgentGreeting(language)}
            </span>
          )}
        </div>
      </div>

      {/* Real-time User Speech Transcription Box */}
      <div className="bg-white border border-[#E5DCC8] rounded-2xl p-4 min-h-[75px] text-left">
        <span className="text-[10px] font-bold uppercase text-[#6B6355] block mb-1">
          Your Spoken Input ({currentLangInfo.native}):
        </span>
        <p className="text-sm font-bold text-[#2C2418] leading-relaxed">
          {transcript || (
            <span className="text-[#6B6355] font-normal italic">
              {language === 'te' 
                ? '&quot;మాట్లాడటానికి మైక్ నొక్కండి e.g., నాకు 3 రోజులుగా తీవ్రమైన కడుపు నొప్పి మరియు వాంతులు అవుతున్నాయి...&quot;'
                : language === 'hi'
                ? '&quot;बोलने के लिए माइक दबाएं जैसे: मुझे 3 दिनों से तेज बुखार और खांसी है...&quot;'
                : '&quot;Press microphone to speak your symptoms in your language...&quot;'}
            </span>
          )}
        </p>
      </div>

      {/* Native Language Quick Presets */}
      <div className="border-t border-[#E5DCC8] pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-[#0F6E56]" />
            One-Tap Spoken Symptom Presets ({currentLangInfo.native}):
          </span>
          <span className="text-[10px] font-semibold text-[#0F6E56]">Voice Agent Talks Back Instantly</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold">
          {activePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulate(preset.text)}
              className={`px-3 py-2 rounded-xl border shadow-2xs transition-all cursor-pointer ${
                preset.isEmergency
                  ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 font-extrabold'
                  : 'bg-white border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
