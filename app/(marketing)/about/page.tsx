'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Users, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Our Mission & Context</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Bridging the Last-Mile Healthcare Knowledge Gap
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Swastha Setu (&quot;स्वास्थ्य सेतु&quot;) is designed to empower rural and semi-urban communities with plain-language, voice-first symptom triage and verified government health facility guidance.
        </p>
      </div>

      {/* Section 1: The Problem Narrative */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#2C2418]">The Context: Ayushman Bharat & The Rural Care Gap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#6B6355] text-base leading-relaxed">
          <p>
            Under India&apos;s Ayushman Bharat program and National Health Mission, thousands of Primary Health Centres (PHCs) and Community Health Centres (CHCs) have been upgraded to Health and Wellness Centres. Government doctors, essential medicines, and emergency ambulances exist on the ground.
          </p>
          <p>
            However, a massive information asymmetry persists. Rural citizens—especially elders and low-literacy individuals—lack an easy way to understand whether their fever, stomach pain, or dizziness requires an emergency hospital visit or routine home care, and whether their nearby PHC has doctors on duty.
          </p>
        </div>
      </div>

      {/* Section 2: Why Voice-First & Regional Languages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D85A30]/10 text-[#D85A30] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2418]">Voice-First Interfaces</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            Typing medical terminology in English or regional scripts creates friction. Speaking naturally in mother tongue allows users to convey symptoms comfortably.
          </p>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F6E56]/10 text-[#0F6E56] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2418]">9 Regional Languages Supported</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            Localization across Hindi, Telugu, Tamil, Kannada, Bengali, Marathi, Gujarati, Odia, and English catering to over 1 billion native speakers.
          </p>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#BA7517]/10 text-[#BA7517] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2418]">Zero Barrier Design</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            No mandatory registration, mobile number entry, password, or application download. Works on mobile browser on low 3G/4G connectivity.
          </p>
        </div>
      </div>

      {/* Section 3: Who This Is For */}
      <div className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-[#2C2418]">Who Swastha Setu Is Built For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E5DCC8] space-y-2">
            <h4 className="font-bold text-[#2C2418]">Rural & Tier 3/4 Citizens</h4>
            <p className="text-xs text-[#6B6355]">Living in villages and small towns with limited access to private tertiary hospitals.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5DCC8] space-y-2">
            <h4 className="font-bold text-[#2C2418]">Low-Literacy & Elderly</h4>
            <p className="text-xs text-[#6B6355]">Users who prefer speaking over typing and need audio reading support for results.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5DCC8] space-y-2">
            <h4 className="font-bold text-[#2C2418]">ASHA & Health Workers</h4>
            <p className="text-xs text-[#6B6355]">Community health workers assisting families during home triage visits.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E5DCC8] space-y-2">
            <h4 className="font-bold text-[#2C2418]">Caregivers & Families</h4>
            <p className="text-xs text-[#6B6355]">Family members seeking guidance for sick children or elderly parents.</p>
          </div>
        </div>
      </div>

      {/* Section 4: Academic Honesty & Boundary Framing — What This Is NOT */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-rose-700 font-bold text-xl">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <span>Scope Boundaries: What Swastha Setu Is NOT</span>
        </div>
        <p className="text-sm text-rose-900 leading-relaxed">
          In alignment with public health standards and academic research rigor, we explicitly establish the following boundaries:
        </p>
        <ul className="space-y-2 text-sm text-rose-900/90 font-medium list-disc list-inside">
          <li><strong>NOT a Medical Diagnosis Tool:</strong> Swastha Setu does not diagnose diseases or prescribe medications. It categorizes symptom urgency to guide timely facility visits.</li>
          <li><strong>NOT a Doctor Replacement:</strong> It connects patients to human healthcare professionals at Primary Health Centres and emergency services.</li>
          <li><strong>NOT for Tele-Prescriptions:</strong> No clinical prescriptions or drug dispensations are issued through this platform.</li>
        </ul>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <Link
          href="/check-up"
          className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#C24C24] text-white font-bold text-base px-8 py-4 rounded-xl shadow-md transition-all"
        >
          <span>Try the Voice Triage Agent Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
