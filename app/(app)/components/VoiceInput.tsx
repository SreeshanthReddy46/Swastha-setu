'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare, RotateCcw, Activity, Send, Edit3, ShieldAlert } from 'lucide-react';
import { useLanguage, languageNames, Language } from '@/lib/language-context';
import { 
  bcp47LanguageCodes, 
  speakTextInLanguage, 
  stopVoiceSpeech, 
  getVoiceAgentGreeting, 
  getVoiceAgentSymptomAck,
  initVoiceEngine,
  transcribeAudioWithSarvam,
  isVoiceSpeechPlaying
} from '@/lib/voice-assistant-engine';
import { getSarvamVoiceConfig } from '@/lib/sarvam-config';

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
  abort: () => void;
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
  const [isTranscribingSarvam, setIsTranscribingSarvam] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Conversational Talk-Back States
  const [customAgentSpeech, setCustomAgentSpeech] = useState<string | null>(null);
  const agentSpeechText = customAgentSpeech || getVoiceAgentGreeting(language);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  
  // Acoustic Isolation Ref to prevent AI agent's own speaker voice from being picked up by mic
  const isAgentSpeakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const onCompleteRef = useRef(onTranscriptComplete);

  useEffect(() => {
    onCompleteRef.current = onTranscriptComplete;
  }, [onTranscriptComplete]);

  // Pre-load voices on component mount
  useEffect(() => {
    initVoiceEngine();
  }, []);

  // When language changes, reset custom talkback and play the native greeting
  useEffect(() => {
    setCustomAgentSpeech(null);
    setTranscript('');
    stopVoiceSpeech();
    isAgentSpeakingRef.current = false;
    setAgentSpeaking(false);
  }, [language]);

  // Helper to make the Sarvam voice agent talk back with word synchronization
  const triggerAgentTalkBack = useCallback((textToSpeak: string) => {
    // 1. Immediately abort any active mic or speech listener to prevent recording the AI's voice
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
    isAgentSpeakingRef.current = true;
    setAgentSpeaking(true);

    setCustomAgentSpeech(textToSpeak);
    setHighlightedWordIndex(-1);

    speakTextInLanguage(
      textToSpeak,
      language,
      () => {
        isAgentSpeakingRef.current = true;
        setAgentSpeaking(true);
      },
      () => {
        setAgentSpeaking(false);
        setHighlightedWordIndex(-1);
        // Safety cooldown buffer to prevent speaker echo reverberation
        setTimeout(() => {
          isAgentSpeakingRef.current = false;
        }, 600);
      },
      () => {
        setAgentSpeaking(false);
        setHighlightedWordIndex(-1);
        isAgentSpeakingRef.current = false;
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
        recognitionRef.current.abort();
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
        // CRITICAL ACOUSTIC ISOLATION:
        // If the AI agent is speaking or TTS audio is playing, completely discard all events!
        if (isAgentSpeakingRef.current || isVoiceSpeechPlaying()) {
          return;
        }

        let fullSpeechText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullSpeechText += event.results[i][0].transcript;
        }
        if (fullSpeechText.trim()) {
          setTranscript(fullSpeechText);
          if (onCompleteRef.current) {
            onCompleteRef.current(fullSpeechText);
          }
        }
      };

      recog.onerror = (err: unknown) => {
        console.warn("Speech recognition event:", err);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      stopVoiceSpeech();
      isAgentSpeakingRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, [language]);

  const startMicrophoneSession = async () => {
    // Stop any ongoing voice agent speech immediately
    stopVoiceSpeech();
    isAgentSpeakingRef.current = false;
    setAgentSpeaking(false);
    setTranscript('');
    audioChunksRef.current = [];

    // Start Web Speech API (interim preview)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // Ignore duplicate start
      }
    }

    // Start MediaRecorder for Sarvam Saaras STT
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start(250);
      } catch (micErr) {
        console.warn("MediaRecorder mic access warning:", micErr);
      }
    }

    setIsListening(true);
  };

  const stopMicrophoneSession = async () => {
    setIsListening(false);

    // Abort Web Speech API immediately to prevent post-stop trailing events
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    // Stop MediaRecorder and forward to Sarvam Saaras STT
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      setIsTranscribingSarvam(true);
      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const neuralTranscript = await transcribeAudioWithSarvam(audioBlob, language);
          
          if (neuralTranscript && neuralTranscript.trim().length > 0) {
            setTranscript(neuralTranscript);
            if (onCompleteRef.current) {
              onCompleteRef.current(neuralTranscript);
            }
            setIsTranscribingSarvam(false);
            const ack = getVoiceAgentSymptomAck(neuralTranscript, [], language);
            triggerAgentTalkBack(ack);
            return;
          }
        }

        setIsTranscribingSarvam(false);
        // Fallback: If Web Speech captured text, acknowledge it
        if (transcript.trim().length > 0) {
          const ack = getVoiceAgentSymptomAck(transcript, [], language);
          triggerAgentTalkBack(ack);
        }
      };

      try {
        mediaRecorder.stop();
      } catch {
        setIsTranscribingSarvam(false);
      }
    } else {
      if (transcript.trim().length > 0) {
        const ack = getVoiceAgentSymptomAck(transcript, [], language);
        triggerAgentTalkBack(ack);
      }
    }
  };

  const toggleListening = () => {
    // If agent is speaking and user taps mic, interrupt agent speech and start mic for user
    if (agentSpeaking || isVoiceSpeechPlaying()) {
      stopVoiceSpeech();
      isAgentSpeakingRef.current = false;
      setAgentSpeaking(false);
      startMicrophoneSession();
      return;
    }

    if (isListening) {
      stopMicrophoneSession();
    } else {
      startMicrophoneSession();
    }
  };

  const handleSimulate = (text: string) => {
    // Ensure mic is stopped
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
    setTranscript(text);
    onTranscriptComplete(text);
    const ack = getVoiceAgentSymptomAck(text, [], language);
    triggerAgentTalkBack(ack);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTranscript(val);
    onTranscriptComplete(val);
  };

  const handleTriggerCustomTalkBack = () => {
    if (transcript.trim().length > 0) {
      const ack = getVoiceAgentSymptomAck(transcript, [], language);
      triggerAgentTalkBack(ack);
    } else {
      triggerAgentTalkBack(getVoiceAgentGreeting(language));
    }
  };

  const currentLangInfo = languageNames[language] || languageNames['en'];
  const sarvamConfig = getSarvamVoiceConfig(language);
  const activePresets = LANGUAGE_PRESETS[language] || LANGUAGE_PRESETS['en'];
  const spokenWords = agentSpeechText ? agentSpeechText.split(/\s+/).filter(Boolean) : [];

  return (
    <div className="bg-white border border-[#E5DCC8] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-sm">
      
      {/* Visual Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0F6E56]" />
          <span>Sarvam AI Neural Voice Agent ({currentLangInfo.native} · {sarvamConfig.defaultSpeaker})</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418]">
          {agentSpeaking 
            ? 'Sarvam Voice Agent Speaking...' 
            : isListening 
            ? t('listening') 
            : isTranscribingSarvam 
            ? 'Transcribing Neural Audio...' 
            : t('startVoiceCheckup')}
        </h3>
        <p className="text-xs text-[#6B6355] mt-1">
          Active Sarvam Voice: <strong className="text-[#0F6E56] font-bold">{currentLangInfo.native} ({sarvamConfig.defaultSpeaker})</strong> · Code: <code className="bg-[#FAF6EE] px-1.5 py-0.5 rounded border border-[#E5DCC8]">{sarvamConfig.sarvamCode}</code>
        </p>
      </div>

      {/* Main Mic Pulsating Button */}
      <div className="py-2">
        <button
          onClick={toggleListening}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-lg transition-transform active:scale-95 cursor-pointer ${
            agentSpeaking
              ? 'bg-amber-600 text-white ring-8 ring-amber-200'
              : isListening
              ? 'bg-[#A32D2D] text-white animate-mic-pulse ring-8 ring-rose-200'
              : isTranscribingSarvam
              ? 'bg-amber-600 text-white animate-spin'
              : 'bg-[#D85A30] hover:bg-[#C24C24] text-white shadow-md'
          }`}
          aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {agentSpeaking ? (
            <Volume2 className="w-12 h-12 animate-pulse" />
          ) : isListening ? (
            <MicOff className="w-12 h-12" />
          ) : isTranscribingSarvam ? (
            <Activity className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12 animate-pulse" />
          )}
        </button>
        <span className="text-xs font-bold text-[#6B6355] block mt-3">
          {agentSpeaking
            ? "AI Speaking (Microphone Muted to Prevent Echo) — Tap to Interrupt & Speak"
            : isListening
            ? "Tap to Finish Speaking & Receive Sarvam AI Assessment"
            : isTranscribingSarvam
            ? "Processing Sarvam Saaras AI Transcription..."
            : "Tap Microphone & Speak Symptoms Naturally in Your Native Language"}
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
          ? 'bg-amber-50 border-amber-300 shadow-sm ring-2 ring-amber-200' 
          : 'bg-[#FAF6EE] border-[#E5DCC8]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6E56] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            {agentSpeaking ? `Sarvam AI (${sarvamConfig.defaultSpeaker}) Speaking in ${currentLangInfo.native}...` : `Sarvam Voice Agent Response (${currentLangInfo.native}):`}
          </span>

          <div className="flex items-center gap-2">
            {agentSpeaking ? (
              <button
                onClick={() => {
                  stopVoiceSpeech();
                  isAgentSpeakingRef.current = false;
                  setAgentSpeaking(false);
                  setHighlightedWordIndex(-1);
                }}
                className="text-[11px] font-bold text-[#A32D2D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <VolumeX className="w-3 h-3" /> Stop Voice
              </button>
            ) : (
              <button
                onClick={handleTriggerCustomTalkBack}
                className="text-[11px] font-bold text-[#0F6E56] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3 h-3" /> Listen Sarvam Voice
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

      {/* Editable Spoken / Typed Symptoms Input Box */}
      <div className="bg-white border border-[#E5DCC8] rounded-2xl p-4 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-[#6B6355] flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-[#0F6E56]" />
            Your Spoken or Typed Symptoms ({currentLangInfo.native}):
          </span>
          {transcript && (
            <button
              onClick={handleTriggerCustomTalkBack}
              className="text-[11px] font-extrabold text-[#0F6E56] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3" /> Ask AI Agent to Respond
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={transcript}
          onChange={handleTextChange}
          placeholder={
            language === 'te'
              ? "మాట్లాడటానికి మైక్ నొక్కండి లేదా మీ లక్షణాలను ఇక్కడ టైప్ చేయండి (ఉదా. నాకు 3 రోజులుగా తీవ్రమైన కడుపు నొప్పి ఉంది)..."
              : language === 'hi'
              ? "बोलने के लिए माइक दबाएं या अपने लक्षण यहां टाइप करें (उदा. मुझे 3 दिनों से तेज बुखार और सिरदर्द है)..."
              : "Press mic to speak, or type your symptoms here in your language..."
          }
          className="w-full bg-[#FAF6EE]/50 border border-[#E5DCC8] focus:border-[#0F6E56] focus:bg-white rounded-xl p-3 text-sm text-[#2C2418] font-medium leading-relaxed resize-none focus:outline-none transition-colors"
        />
        {transcript && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleTriggerCustomTalkBack}
              className="inline-flex items-center gap-1.5 bg-[#0F6E56] hover:bg-[#0C443A] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen AI Voice Response ({currentLangInfo.native})</span>
            </button>
          </div>
        )}
      </div>

      {/* Native Language Quick Presets */}
      <div className="border-t border-[#E5DCC8] pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-[#0F6E56]" />
            One-Tap Spoken Symptom Presets ({currentLangInfo.native}):
          </span>
          <span className="text-[10px] font-semibold text-[#0F6E56]">Sarvam AI Talks Back Instantly</span>
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
