'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, RefreshCw } from 'lucide-react';
import { useLanguage, languageNames } from '@/lib/language-context';
import { bcp47LanguageCodes } from '@/lib/voice-assistant-engine';

interface VoiceInputProps {
  onTranscriptComplete: (text: string) => void;
}

export function VoiceInput({ onTranscriptComplete }: VoiceInputProps) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [browserSupported, setBrowserSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        setRecognition(recog);
      } else {
        setBrowserSupported(false);
      }
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      const targetBcp47 = bcp47LanguageCodes[language] || 'en-IN';
      recognition.lang = targetBcp47;

      recognition.onresult = (event: any) => {
        let fullSpeechText = '';
        for (let i = 0; i < event.results.length; i++) {
          fullSpeechText += event.results[i][0].transcript;
        }
        setTranscript(fullSpeechText);
        onTranscriptComplete(fullSpeechText);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition notice:", err);
        // Do not immediately close listening state on non-fatal warnings
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition, language, onTranscriptComplete]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        // Recognition already started catch safeguard
        setIsListening(true);
      }
    }
  };

  const handleSimulate = (text: string) => {
    setTranscript(text);
    onTranscriptComplete(text);
  };

  const currentLangInfo = languageNames[language] || languageNames['en'];

  return (
    <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 text-center space-y-6 shadow-sm">
      
      {/* Visual Header */}
      <div>
        <span className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider block mb-1">
          Multi-Language Voice Intake Engine
        </span>
        <h3 className="text-2xl font-bold text-[#2C2418]">
          {isListening ? t('listening') : t('startVoiceCheckup')}
        </h3>
        <p className="text-xs text-[#6B6355] mt-1">
          Active Speech Language: <strong className="text-[#0F6E56]">{currentLangInfo.native} ({currentLangInfo.english})</strong>
        </p>
      </div>

      {/* Main Mic Pulsating Button */}
      <div className="py-4">
        <button
          onClick={toggleListening}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-lg transition-transform active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-[#A32D2D] text-white animate-mic-pulse'
              : 'bg-[#D85A30] hover:bg-[#C24C24] text-white'
          }`}
          aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? (
            <MicOff className="w-12 h-12" />
          ) : (
            <Mic className="w-12 h-12 animate-pulse" />
          )}
        </button>
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

      {/* Real-time Transcription Box */}
      <div className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-4 min-h-[90px] text-left">
        <span className="text-[10px] font-bold uppercase text-[#6B6355] block mb-1">
          Live Speech Transcription ({currentLangInfo.native}):
        </span>
        <p className="text-sm font-bold text-[#2C2418] leading-relaxed">
          {transcript || (
            <span className="text-[#6B6355] font-normal italic">
              {language === 'te' 
                ? '"మాట్లాడటానికి మైక్ నొక్కండి e.g., నాకు 3 రోజులుగా తీవ్రమైన కడుపు నొప్పి మరియు వాంతులు అవుతున్నాయి..."'
                : language === 'hi'
                ? '"बोलने के लिए माइक दबाएं जैसे: मुझे 3 दिनों से तेज बुखार और खांसी है..."'
                : '"Press mic and speak symptoms in your native language..."'}
            </span>
          )}
        </p>
      </div>

      {/* Speech Simulation Quick Presets for Demo */}
      <div className="border-t border-[#E5DCC8] pt-4 space-y-2">
        <span className="text-xs font-bold text-[#6B6355] block">
          One-Tap Speech Test Prompts:
        </span>
        <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold">
          <button
            onClick={() => handleSimulate("నాకు కడుపులో తీవ్రమైన నొప్పి మరియు వాంతులు అవుతున్నాయి")}
            className="bg-white border border-[#E5DCC8] hover:border-[#D85A30] text-[#2C2418] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            తెలుగు: కడుపు నొప్పి (Stomach Pain)
          </button>
          <button
            onClick={() => handleSimulate("నాకు ఛాతీలో తీవ్రమైన నొప్పి మరియు శ్వాస తీసుకోవడంలో ఇబ్బందిగా ఉంది")}
            className="bg-white border border-[#E5DCC8] hover:border-[#A32D2D] text-[#A32D2D] px-3 py-1.5 rounded-lg shadow-xs transition-colors font-bold"
          >
            తెలుగు: ఛాతీ నొప్పి (Chest Pain 108)
          </button>
          <button
            onClick={() => handleSimulate("मुझे पिछले 2 दिनों से तेज बुखार और सांस लेने में तकलीफ है")}
            className="bg-white border border-[#E5DCC8] hover:border-[#D85A30] text-[#2C2418] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            हिंदी: तेज बुखार (High Fever)
          </button>
          <button
            onClick={() => handleSimulate("I have chest pain and dizziness when walking")}
            className="bg-white border border-[#E5DCC8] hover:border-[#D85A30] text-[#2C2418] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            English: Chest Pain & Dizziness
          </button>
        </div>
      </div>
    </div>
  );
}
