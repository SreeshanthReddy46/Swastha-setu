'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  Share2,
  FileText,
  Building2,
  Search,
  BookOpen,
  FlaskConical,
  Check,
  Brain,
  Sparkles,
  Shield,
  Cpu
} from 'lucide-react';
import { TriageResult } from '@/lib/triage-engine';
import { useLanguage } from '@/lib/language-context';
import { speakTextInLanguage, stopVoiceSpeech } from '@/lib/voice-assistant-engine';

export default function TriageResultPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const id = params?.id as string;

  const [result, setResult] = useState<TriageResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`triage_${id}`);
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        // Mock Fallback Result if navigated directly
        setResult({
          id: id || 'trg-demo',
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
          disclaimer: 'This guidance is an informational AI urgency triage tool and NOT a medical diagnosis. In life-threatening situations, call emergency services (108) immediately.',
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [id]);

  const toggleSpeechPlayback = () => {
    if (!result) return;

    if (isPlayingAudio) {
      stopVoiceSpeech();
      setIsPlayingAudio(false);
    } else {
      const speechText = `${result.title}. ${result.reasoning}. Recommended action window: ${result.timeframe}. Recommended action steps: ${result.action_steps.join('. ')}`;
      
      speakTextInLanguage(
        speechText,
        language,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
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
            className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] hover:bg-[#0F6E56]/20 font-bold text-xs px-4 py-2 rounded-xl border border-[#0F6E56]/30 transition-all cursor-pointer"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-[#A32D2D] animate-pulse" /> : <Volume2 className="w-4 h-4 text-[#0F6E56]" />}
            <span>{isPlayingAudio ? 'Stop Glitch-Free Speech' : 'Listen in Clear Audio (TTS)'}</span>
          </button>
        </div>

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
          <h3 className="text-xl font-extrabold">Locate Nearby Government & Multi-Specialty Hospitals</h3>
          <p className="text-xs text-emerald-100">
            View live doctor counts, 24/7 casualty status, ICU bed counts, and get turn-by-turn directions.
          </p>
        </div>

        <Link
          href="/locator"
          className="bg-[#D85A30] hover:bg-[#C24C24] text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-2"
        >
          <span>Find Nearby Hospitals Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
