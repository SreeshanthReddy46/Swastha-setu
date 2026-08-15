'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, MapPin, Phone, Volume2, ArrowRight, HelpCircle } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Title */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Step-by-Step Guidance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          How Voice Triage & Facility Locator Works
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          From speaking your symptoms in your language to receiving a clear urgency check and getting directions to your nearest government health centre.
        </p>
      </div>

      {/* Step 1: Voice & Tap Intake */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] font-bold text-xs px-3 py-1 rounded-md">
            STEP 1
          </div>
          <h2 className="text-2xl font-bold text-[#2C2418]">Voice Intake or Visual Tap Fallback</h2>
          <p className="text-[#6B6355] text-sm leading-relaxed">
            Press the mic button on the <strong>Check-Up</strong> screen and speak naturally in Telugu, Hindi, or English. Describe how long you have felt unwell, where it hurts, and any associated symptoms.
          </p>
          <div className="bg-[#FAF6EE] border-l-4 border-[#0F6E56] p-4 rounded-r-xl space-y-1">
            <h4 className="text-xs font-bold text-[#0F6E56] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> What if I can&apos;t speak clearly or it&apos;s too noisy?
            </h4>
            <p className="text-xs text-[#2C2418] leading-relaxed">
              Simply switch to the <strong>Visual Body Map</strong> tab. Tap the affected body region (Head, Chest, Abdomen, Joints) and select common symptom chips with one tap.
            </p>
          </div>
        </div>

        {/* Visual Mockup 1 */}
        <div className="lg:col-span-5 bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-6 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#D85A30] text-white flex items-center justify-center mx-auto shadow-md animate-mic-pulse">
            <Mic className="w-8 h-8" />
          </div>
          <p className="text-xs font-bold text-[#2C2418]">&quot;నాకు జ్వరం మరియు తలనొప్పి ఉంది...&quot;</p>
          <div className="flex justify-center gap-2 text-[10px] text-[#6B6355]">
            <span className="bg-white border border-[#E5DCC8] px-2 py-1 rounded">Fever</span>
            <span className="bg-white border border-[#E5DCC8] px-2 py-1 rounded">Headache</span>
            <span className="bg-white border border-[#E5DCC8] px-2 py-1 rounded">Body Pain</span>
          </div>
        </div>
      </div>

      {/* Step 2: Urgency Triage Report */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1 bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-6 space-y-3">
          <div className="bg-[#A32D2D] text-white text-xs font-bold px-3 py-1 rounded-md inline-block">
            HIGH URGENCY
          </div>
          <h3 className="font-bold text-sm text-[#2C2418]">Seek Medical Care Today</h3>
          <p className="text-xs text-[#6B6355]">
            Symptoms indicate potential infection or high fever requiring evaluation by a Medical Officer.
          </p>
          <div className="bg-white p-3 rounded-lg border border-[#E5DCC8] text-xs font-semibold text-[#0F6E56] flex items-center gap-2">
            <Volume2 className="w-4 h-4 shrink-0" />
            <span>Audio explanation in Telugu available</span>
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#D85A30]/10 text-[#D85A30] font-bold text-xs px-3 py-1 rounded-md">
            STEP 2
          </div>
          <h2 className="text-2xl font-bold text-[#2C2418]">Plain-Language Urgency Assessment</h2>
          <p className="text-[#6B6355] text-sm leading-relaxed">
            The platform processes your symptoms and generates a clear, color-coded urgency report:
          </p>
          <ul className="space-y-2 text-xs font-medium text-[#2C2418]">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#A32D2D]" />
              <strong>Emergency / High:</strong> Go immediately to 24/7 CHC or District Hospital. Call 108.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#BA7517]" />
              <strong>Moderate:</strong> Visit your local Primary Health Centre (PHC) within 24 hours.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0F6E56]" />
              <strong>Routine:</strong> Self-care home monitoring or routine Sub-Centre visit.
            </li>
          </ul>
        </div>
      </div>

      {/* Step 3: PHC Locator & Directions */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#BA7517]/10 text-[#BA7517] font-bold text-xs px-3 py-1 rounded-md">
            STEP 3 & 4
          </div>
          <h2 className="text-2xl font-bold text-[#2C2418]">Hospital & PHC Locator & Live Directions</h2>
          <p className="text-[#6B6355] text-sm leading-relaxed">
            Based on your location within a 100km radius, Swastha Setu displays verified nearby public and multi-specialty hospitals, active medical officers, ICU bed counts, and emergency ambulance readiness.
          </p>
          <p className="text-[#6B6355] text-sm leading-relaxed">
            One tap launches Google Maps directions or places a direct phone call to the facility.
          </p>
        </div>

        <div className="lg:col-span-5 bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2C2418]">Chittoor District Hospital</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">24/7 Active</span>
          </div>
          <p className="text-xs text-[#6B6355]">0.8 km away · 12 Doctors on Duty · 25 ICU Beds</p>
          <div className="flex gap-2 pt-2">
            <Link href="/locator" className="flex-1 bg-[#0F6E56] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer">
              <MapPin className="w-3.5 h-3.5" /> Directions
            </Link>
            <a href="tel:+918572232100" className="flex-1 bg-white border border-[#E5DCC8] text-[#2C2418] text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer">
              <Phone className="w-3.5 h-3.5" /> Call Hospital
            </a>
          </div>
        </div>
      </div>

      {/* Direct CTA */}
      <div className="text-center pt-6">
        <Link
          href="/check-up"
          className="inline-flex items-center gap-2 bg-[#D85A30] hover:bg-[#C24C24] text-white font-bold text-base px-8 py-4 rounded-xl shadow-md transition-all"
        >
          <span>Start Voice Check-Up Flow</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
