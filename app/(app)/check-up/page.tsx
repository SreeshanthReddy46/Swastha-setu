'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion as m } from 'framer-motion';
import { Mic, Touchpad, Activity, ArrowRight, Trash2, MapPin } from 'lucide-react';
import { VoiceInput } from '../components/VoiceInput';
import { BodyMapFallback } from '../components/BodyMapFallback';
import { useLanguage } from '@/lib/language-context';

export default function CheckUpPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'voice' | 'bodymap'>('voice');
  const [transcriptionText, setTranscriptionText] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          // Default fallback location (e.g. Chittoor / Tirupati region)
          setUserCoords({ lat: 13.2172, lng: 79.1003 });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  const handleToggleChip = useCallback((sym: string) => {
    setSelectedChips((prev) => 
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  }, []);

  const handleClearAll = useCallback(() => {
    setTranscriptionText('');
    setSelectedChips([]);
  }, []);

  const handleTranscriptComplete = useCallback((text: string) => {
    setTranscriptionText(text);
  }, []);

  const handleAnalyze = async () => {
    if (!transcriptionText && selectedChips.length === 0) {
      alert("Please speak your symptoms or select at least one symptom from the body selector.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedChips,
          transcription: transcriptionText,
          userLat: userCoords?.lat,
          userLng: userCoords?.lng,
          language
        })
      });

      const data = await res.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`triage_${data.id}`, JSON.stringify(data));
      }
      router.push(`/result/${data.id}`);
    } catch {
      alert("Error generating triage report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3 py-1 rounded-full text-xs font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Symptom Triage Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418]">
          Tell Us What You Are Feeling
        </h1>
        <p className="text-sm text-[#6B6355] max-w-xl mx-auto">
          Speak in your mother tongue or tap symptoms on the visual body selector. No login required.
        </p>

        {userCoords && (
          <div className="inline-flex items-center gap-1.5 bg-[#FAF6EE] text-[#0F6E56] border border-[#E5DCC8] px-3 py-0.5 rounded-full text-[11px] font-semibold">
            <MapPin className="w-3 h-3 text-[#D85A30]" />
            <span>Live GPS Active (100km Hospital Proximity Enabled)</span>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-white border border-[#E5DCC8] p-1.5 rounded-2xl shadow-xs max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-[#0F6E56] text-white shadow-xs'
              : 'text-[#2C2418] hover:bg-[#FAF6EE]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice Intake</span>
        </button>

        <button
          onClick={() => setActiveTab('bodymap')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bodymap'
              ? 'bg-[#0F6E56] text-white shadow-xs'
              : 'text-[#2C2418] hover:bg-[#FAF6EE]'
          }`}
        >
          <Touchpad className="w-4 h-4" />
          <span>Visual Body Selector</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'voice' ? (
        <VoiceInput onTranscriptComplete={handleTranscriptComplete} />
      ) : (
        <BodyMapFallback
          selectedSymptoms={selectedChips}
          onToggleSymptom={handleToggleChip}
        />
      )}

      {/* Summary Box */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5DCC8] pb-3">
          <h4 className="font-bold text-sm text-[#2C2418]">Recorded Symptoms Summary</h4>
          {(transcriptionText || selectedChips.length > 0) && (
            <button
              onClick={handleClearAll}
              className="text-xs text-[#A32D2D] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {transcriptionText && (
          <div className="text-xs bg-[#FAF6EE] p-3 rounded-xl border border-[#E5DCC8]">
            <span className="font-bold text-[#0F6E56] block mb-1">Spoken Input:</span>
            <p className="text-[#2C2418] font-medium">{transcriptionText}</p>
          </div>
        )}

        {selectedChips.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-[#6B6355]">Selected Taps:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedChips.map((s) => (
                <span
                  key={s}
                  className="bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/30 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {!transcriptionText && selectedChips.length === 0 && (
          <p className="text-xs text-[#6B6355] italic">No symptoms recorded yet. Speak above or tap symptoms on the visual selector.</p>
        )}
      </div>

      {/* Main Submit Action with Animated Tap Effect */}
      <div className="text-center pt-2">
        <m.button
          whileHover={{ scale: transcriptionText || selectedChips.length > 0 ? 1.04 : 1 }}
          whileTap={{ scale: transcriptionText || selectedChips.length > 0 ? 0.95 : 1 }}
          onClick={handleAnalyze}
          disabled={isSubmitting || (!transcriptionText && selectedChips.length === 0)}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 font-extrabold text-base px-10 py-4 rounded-2xl shadow-lg transition-all ${
            isSubmitting || (!transcriptionText && selectedChips.length === 0)
              ? 'bg-[#E5DCC8] text-[#6B6355] cursor-not-allowed'
              : 'bg-[#D85A30] hover:bg-[#C24C24] text-white cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <span>Evaluating Symptoms & Finding Nearest Hospitals...</span>
          ) : (
            <>
              <span>{t('analyzeSymptoms')}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </m.button>
      </div>

    </div>
  );
}
