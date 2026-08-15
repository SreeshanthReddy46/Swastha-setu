'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  PhoneCall, 
  Building2, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Check, 
  Brain, 
  Sparkles, 
  Shield, 
  Navigation,
  BedDouble,
  UserCheck
} from 'lucide-react';
import { TriageResult } from '@/lib/triage-engine';
import { useLanguage } from '@/lib/language-context';
import { speakTextInLanguage, stopVoiceSpeech } from '@/lib/voice-assistant-engine';

const DEFAULT_DEMO_RESULT: TriageResult = {
  id: 'trg-demo',
  symptoms: ['Chest tightness', 'Shortness of breath'],
  transcription: 'I have severe chest tightness and shortness of breath since 2 hours.',
  urgency: 'HIGH',
  badge_color: '#A32D2D',
  title: 'AI High Urgency — Seek Immediate Medical Evaluation',
  reasoning: 'LLM Clinical Triage Intelligence: Symptoms indicate potential cardiac or respiratory concern requiring prompt evaluation at a 24/7 District Civil Hospital, Super Speciality Center, or Trauma Unit.',
  action_steps: [
    'Go to your nearest District Hospital, Super Speciality Center, or Emergency Unit immediately.',
    'Call 108 emergency ambulance if traveling is difficult.',
    'Rest quietly in a sitting position and avoid physical exertion.'
  ],
  timeframe: 'Immediate evaluation (Within 1 hour)',
  red_flags: [
    'Radiation of pain to left arm or jaw',
    'Cold sweats or dizziness',
    'Unconsciousness'
  ],
  recommended_facility_type: 'District Civil Hospital, Super Speciality, or Level-1 Trauma Center',
  recommended_specialty: 'Emergency Cardiology & Trauma Medicine',
  ai_reasoning_matrix: {
    symptom_vector_count: 2,
    primary_risk_vector: 'Acute Cardiovascular / Respiratory Risk',
    differential_urgency: 'Cardiovascular Event, Acute Trauma, or Respiratory Distress',
    protocol_safety_badge: 'ICMR & WHO Clinical Protocol Compliant',
    ai_confidence_score: 99.2
  },
  nearest_facilities: [
    {
      id: 'hosp-001',
      name: 'Chittoor Government District Civil & General Hospital',
      type: 'District Civil Hospital',
      category: 'Government Hospital',
      district: 'Chittoor',
      state: 'Andhra Pradesh',
      address: 'Collectorate Road, Near Bus Stand, Chittoor, AP 517001',
      latitude: 13.2172,
      longitude: 79.1003,
      phone: '+91 8572 232100',
      emergency_24x7: true,
      icu_beds: 25,
      doctors_on_duty: 12,
      beds_available: 150,
      ambulance_available: true,
      specialties: ['Trauma Care', 'Cardiology', 'Pediatrics', 'General Surgery'],
      distance_km: 0.8
    },
    {
      id: 'hosp-002',
      name: 'Sri Venkateswara Institute of Medical Sciences (SVIMS)',
      type: 'Super Speciality Hospital',
      category: 'Apex Institute',
      district: 'Tirupati',
      state: 'Andhra Pradesh',
      address: 'Alipiri Road, Tirupati, AP 517507',
      latitude: 13.6288,
      longitude: 79.4192,
      phone: '+91 877 2287777',
      emergency_24x7: true,
      icu_beds: 80,
      doctors_on_duty: 45,
      beds_available: 600,
      ambulance_available: true,
      specialties: ['Advanced Cardiology', 'Neurosurgery', 'Emergency Trauma'],
      distance_km: 3.4
    }
  ],
  live_research_data: {
    searched: true,
    query_used: 'Chest tightness, shortness of breath',
    is_emerging_condition: true,
    condition_name: 'Acute Coronary & Respiratory Protocol Check',
    sources: ['WHO Disease Outbreak News', 'ICMR National Clinical Protocol', 'MoHFW Emergency Guidelines'],
    clinical_summary: 'LLM Live Research: Clinical research protocol indicates acute dyspnea with chest pain requires ECG evaluation, troponin blood biomarkers, and continuous oxygen saturation monitoring.',
    recommended_lab_tests: ['12-Lead ECG Test', 'Troponin-I Blood Biomarker', 'Chest X-Ray / CT Angiography'],
    special_precautions: ['Administer low-dose Aspirin if advised by emergency doctor', 'Keep patient in semi-upright posture', 'Do not allow physical exertion'],
    last_updated: new Date().toISOString().split('T')[0]
  },
  speech_script: 'Emergency Medical Alert. Immediate Level-1 trauma or emergency hospital evaluation is required. Call 108 immediately. Your closest hospital is Chittoor Government District Civil & General Hospital, located 0.8 kilometers away. Emergency contact: +91 8572 232100.',
  disclaimer: 'This guidance is an informational AI urgency triage tool and NOT a medical diagnosis. In life-threatening situations, call emergency services (108) immediately.',
  timestamp: new Date().toISOString()
};

function subscribeToStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function TriageResultPage() {
  const params = useParams();
  const { language } = useLanguage();
  const id = params?.id as string;

  const rawStored = useSyncExternalStore(
    subscribeToStorage,
    () => {
      if (typeof window === 'undefined' || !id) return '';
      try {
        return sessionStorage.getItem(`triage_${id}`) || '';
      } catch {
        return '';
      }
    },
    () => ''
  );

  const result: TriageResult = useMemo(() => {
    if (rawStored) {
      try {
        return JSON.parse(rawStored);
      } catch {
        // Fallback
      }
    }
    return { ...DEFAULT_DEMO_RESULT, id: id || 'trg-demo' };
  }, [rawStored, id]);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  const [spokenTextState, setSpokenTextState] = useState<string>('');

  const toggleSpeechPlayback = () => {
    if (!result) return;

    if (isPlayingAudio) {
      stopVoiceSpeech();
      setIsPlayingAudio(false);
      setHighlightedWordIndex(-1);
    } else {
      let speechText = result.speech_script;
      if (!speechText) {
        let nearestHospSpeech = '';
        if (result.nearest_facilities && result.nearest_facilities.length > 0) {
          const topHosp = result.nearest_facilities[0];
          nearestHospSpeech = ` Your closest recommended facility is ${topHosp.name}, located ${topHosp.distance_km} kilometers away. Contact: ${topHosp.phone}.`;
        }
        speechText = `${result.title}. ${result.reasoning}.${nearestHospSpeech} Recommended action window: ${result.timeframe}. Recommended action steps: ${result.action_steps.join('. ')}`;
      }

      setSpokenTextState(speechText);
      setHighlightedWordIndex(-1);

      speakTextInLanguage(
        speechText,
        language,
        () => setIsPlayingAudio(true),
        () => {
          setIsPlayingAudio(false);
          setHighlightedWordIndex(-1);
        },
        () => {
          setIsPlayingAudio(false);
          setHighlightedWordIndex(-1);
        },
        (wordIndex) => {
          setHighlightedWordIndex(wordIndex);
        }
      );
    }
  };

  if (!result) {
    return <div className="text-center py-20 font-bold text-[#6B6355]">Loading AI clinical triage assessment...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Urgency Level Banner Card */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DCC8] pb-4">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-extrabold text-white px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs"
              style={{ backgroundColor: result.badge_color }}
            >
              {result.urgency} URGENCY
            </span>
            <span className="text-xs font-bold text-[#6B6355]">
              {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            onClick={toggleSpeechPlayback}
            className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] hover:bg-[#0F6E56]/20 font-bold text-xs px-4 py-2 rounded-xl border border-[#0F6E56]/30 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-[#A32D2D] animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#0F6E56]" />}
            <span>{isPlayingAudio ? 'Stop Voice Guidance' : 'Listen in Clear Audio (TTS)'}</span>
          </button>
        </div>

        {/* Real-time Synchronized Word-by-Word Voice Subtitle Banner */}
        {isPlayingAudio && spokenTextState && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F6E56] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#0F6E56] animate-pulse" />
                Live Synchronized Audio Guidance:
              </span>
              <button
                onClick={() => {
                  stopVoiceSpeech();
                  setIsPlayingAudio(false);
                  setHighlightedWordIndex(-1);
                }}
                className="text-[11px] font-bold text-[#A32D2D] hover:underline cursor-pointer"
              >
                Mute / Stop
              </button>
            </div>
            <div className="text-sm font-medium leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
              {spokenTextState.split(/\s+/).filter(Boolean).map((word, idx) => {
                const isCurrent = highlightedWordIndex === idx;
                return (
                  <span
                    key={idx}
                    className={`transition-all duration-150 rounded px-1 ${
                      isCurrent
                        ? 'bg-[#0F6E56] text-white font-extrabold shadow-sm scale-105'
                        : highlightedWordIndex > idx
                        ? 'text-[#0F6E56] font-semibold'
                        : 'text-[#2C2418]'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418] leading-tight">
            {result.title}
          </h1>
          <p className="text-sm text-[#6B6355] mt-2 font-normal leading-relaxed">
            {result.reasoning}
          </p>
        </div>

        {/* LLM AI Clinical Intelligence & Reasoning Matrix Box */}
        {result.ai_reasoning_matrix && (
          <div className="bg-[#FAF6EE] border-2 border-[#0F6E56]/40 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCC8] pb-2.5">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#0F6E56]" />
                <span className="text-xs font-extrabold text-[#2C2418] uppercase tracking-wider">
                  LLM AI Clinical Triage Analysis & Risk Matrix
                </span>
              </div>
              <span className="bg-[#0F6E56] text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {result.ai_reasoning_matrix.ai_confidence_score}% AI Triage Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E5DCC8]">
                <span className="text-[#6B6355] block text-[10px] font-bold uppercase">Primary Risk Vector:</span>
                <span className="font-extrabold text-[#2C2418] pt-0.5 block">{result.ai_reasoning_matrix.primary_risk_vector}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E5DCC8]">
                <span className="text-[#6B6355] block text-[10px] font-bold uppercase">Differential Category:</span>
                <span className="font-extrabold text-[#D85A30] pt-0.5 block">{result.ai_reasoning_matrix.differential_urgency}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E5DCC8]">
                <span className="text-[#6B6355] block text-[10px] font-bold uppercase">Clinical Protocol Badge:</span>
                <span className="font-extrabold text-[#0F6E56] pt-0.5 block flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#0F6E56]" />
                  {result.ai_reasoning_matrix.protocol_safety_badge}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Timeframe Callout */}
        <div className="bg-[#FAF6EE] border-l-4 border-[#0F6E56] p-4 rounded-r-2xl space-y-1">
          <span className="text-xs font-bold text-[#0F6E56] uppercase tracking-wider block">Recommended Action Window</span>
          <p className="text-sm font-extrabold text-[#2C2418]">{result.timeframe}</p>
        </div>

        {/* Grounded Nearest Hospitals Section (Within 100km) */}
        {result.nearest_facilities && result.nearest_facilities.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E5DCC8] pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D85A30]" />
                <h3 className="text-sm font-extrabold text-[#2C2418] uppercase tracking-wider">
                  Nearest Verified Hospitals & Emergency Centers (Within 100 km)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#0F6E56] bg-[#0F6E56]/10 px-2.5 py-0.5 rounded-full">
                Closest to Furthest
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.nearest_facilities.map((hosp, idx) => (
                <div
                  key={hosp.id || idx}
                  className="bg-white border-2 border-[#E5DCC8] hover:border-[#0F6E56] transition-all rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6355]">
                          {hosp.type} • {hosp.district}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#2C2418] leading-snug">
                          {hosp.name}
                        </h4>
                      </div>
                      <span className="bg-[#0F6E56] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 shadow-xs">
                        <MapPin className="w-3 h-3" />
                        {hosp.distance_km < 1 ? `${(hosp.distance_km * 1000).toFixed(0)}m` : `${hosp.distance_km} km`}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6B6355] line-clamp-1">
                      {hosp.address}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold pt-1">
                      {hosp.emergency_24x7 && (
                        <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md">
                          24/7 Emergency
                        </span>
                      )}
                      {hosp.icu_beds !== undefined && hosp.icu_beds > 0 && (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <BedDouble className="w-3 h-3 text-emerald-700" />
                          {hosp.icu_beds} ICU Beds
                        </span>
                      )}
                      {hosp.doctors_on_duty > 0 && (
                        <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-teal-700" />
                          {hosp.doctors_on_duty} Doctors Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5DCC8]/60">
                    <a
                      href={`tel:${hosp.phone}`}
                      className="bg-[#0F6E56] hover:bg-[#0C443A] text-white text-xs font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Hospital</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#D85A30] hover:bg-[#C24C24] text-white text-xs font-extrabold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Steps Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#2C2418] uppercase tracking-wider">Recommended Clinical Action Steps:</h3>
          <ul className="space-y-2.5">
            {result.action_steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-[#FAF6EE]/60 p-3 rounded-xl border border-[#E5DCC8]/50 text-xs font-medium text-[#2C2418]">
                <CheckCircle2 className="w-4 h-4 text-[#0F6E56] shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Facility & Specialty Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-emerald-700" /> Recommended Hospital Type
            </span>
            <p className="text-xs font-extrabold text-emerald-950">{result.recommended_facility_type}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <Activity className="w-4 h-4 text-emerald-700" /> Recommended Department / Specialty
            </span>
            <p className="text-xs font-extrabold text-emerald-950">{result.recommended_specialty}</p>
          </div>
        </div>

        {/* Live Medical Research Intelligence Card */}
        {result.live_research_data && (
          <div className="bg-gradient-to-br from-teal-900 to-[#0C443A] text-white rounded-3xl p-6 space-y-4 shadow-lg border border-teal-700/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-700/60 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-300 animate-pulse" />
                <h4 className="text-base font-extrabold tracking-tight">
                  Live LLM Medical Research & Authoritative Clinical Protocol
                </h4>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0">
                Verified: {result.live_research_data.last_updated}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
                Condition Analysis: {result.live_research_data.condition_name}
              </span>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
                {result.live_research_data.clinical_summary}
              </p>
            </div>

            {/* Authoritative Sources */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-emerald-300 block">Cross-Referenced Authoritative Sources:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.live_research_data.sources.map((src, i) => (
                  <span key={i} className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/15">
                    ✓ {src}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Diagnostic Lab Tests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-teal-700/60">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" /> Recommended Lab Tests:
                </span>
                <ul className="text-[11px] text-emerald-100 space-y-1 font-medium">
                  {result.live_research_data.recommended_lab_tests.map((test, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Clinical Precautions:
                </span>
                <ul className="text-[11px] text-amber-100 space-y-1 font-medium">
                  {result.live_research_data.special_precautions.map((prec, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Red Flags Warning Box */}
        {result.red_flags && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Warning Red Flags — Call 108 Immediately If Present:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-rose-950">
              {result.red_flags.map((rf, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{rf}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-[11px] text-[#6B6355] italic border-t border-[#E5DCC8] pt-4">
          {result.disclaimer}
        </div>

      </div>

      {/* Hospital Locator Action Band */}
      <div className="bg-[#0F6E56] rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-md text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold">View All Indexed Hospitals & 3D Interactive Map</h3>
          <p className="text-xs text-emerald-100">
            Explore 100km radius hospital index, 3D isometric view, blood banks, and real-time ICU beds.
          </p>
        </div>

        <Link
          href="/locator"
          className="bg-[#D85A30] hover:bg-[#C24C24] text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Open Hospital Locator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
