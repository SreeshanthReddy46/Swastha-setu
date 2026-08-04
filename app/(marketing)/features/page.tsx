'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, ShieldCheck, MapPin, Activity, WifiOff, Lock, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FeaturesPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Mic className="w-6 h-6 text-[#D85A30]" />,
      title: "Multi-Language Voice Intake",
      description: "Speak naturally in Telugu, Hindi, or English. Built using Web Speech recognition designed for regional accents and rural conversational phrases."
    },
    {
      icon: <Activity className="w-6 h-6 text-[#A32D2D]" />,
      title: "Plain-Language Urgency Triage",
      description: "Instantly categorizes symptom urgency into Emergency, High, Moderate, or Routine with clear next steps in mother tongue."
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#0F6E56]" />,
      title: "Government PHC Locator",
      description: "Search indexed Primary Health Centres (PHCs) and Community Health Centres (CHCs) with active doctor counts, ambulance status, and directions."
    },
    {
      icon: <Volume2 className="w-6 h-6 text-[#BA7517]" />,
      title: "Audio TTS Results Reader",
      description: "Zero literacy barrier: hear triage advice and action steps read aloud in your native language via browser text-to-speech."
    },
    {
      icon: <WifiOff className="w-6 h-6 text-[#0C443A]" />,
      title: "Low-Bandwidth Optimization",
      description: "Lightweight client footprint under 200KB. Operates seamlessly on basic 2G/3G rural mobile networks and low-cost Android smartphones."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#0F6E56]" />,
      title: "Private & Frictionless",
      description: "No phone number, OTP, login, or name required. Your symptom check remains anonymous and ephemeral."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Platform Capabilities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Built for Accessibility, Reliability & Speed
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Every feature in Swastha Setu is designed around the lived reality of last-mile rural users in India.
        </p>
      </div>

      {/* Feature Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div key={idx} className="bg-white border border-[#E5DCC8] rounded-2xl p-8 space-y-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border border-[#E5DCC8] flex items-center justify-center">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-[#2C2418]">{f.title}</h3>
            <p className="text-sm text-[#6B6355] leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Callout Band */}
      <div className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-2xl font-bold text-[#2C2418]">Experience the Platform First-Hand</h3>
        <p className="text-sm text-[#6B6355] max-w-xl mx-auto">
          Test the voice triage interface, tap fallback selector, or search nearby health facilities now.
        </p>
        <div className="pt-2">
          <Link
            href="/check-up"
            className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#C24C24] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md transition-all"
          >
            <span>Launch Check-Up App →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
