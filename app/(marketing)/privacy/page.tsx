'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Plain-Language Policy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Privacy Policy & Data Handling
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          We believe health guidance should be private, transparent, and free of identity tracking. Here is exactly what happens when you use Swastha Setu.
        </p>
      </div>

      {/* Comparison Grid: What We DO vs What We DO NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* What We DO NOT Collect */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-rose-800 font-bold text-xl">
            <XCircle className="w-6 h-6 shrink-0" />
            <h2>What We DO NOT Do</h2>
          </div>
          <ul className="space-y-4 text-sm text-rose-900 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold text-lg">•</span>
              <span><strong>No Account Needed:</strong> We never ask for your name, phone number, email address, or OTP.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold text-lg">•</span>
              <span><strong>No Voice Storage:</strong> Audio recordings are processed ephemerally in memory to extract text symptoms and are deleted immediately after synthesis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold text-lg">•</span>
              <span><strong>No Ad Tracking or Data Selling:</strong> We do not use advertising trackers, third-party cookies, or sell health data to insurance companies or advertisers.</span>
            </li>
          </ul>
        </div>

        {/* What We DO Process */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 text-emerald-800 font-bold text-xl">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <h2>What We DO Process</h2>
          </div>
          <ul className="space-y-4 text-sm text-emerald-900 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold text-lg">•</span>
              <span><strong>Ephemeral Symptom Analysis:</strong> The text symptoms you speak or select are evaluated strictly to calculate urgency and recommended action steps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold text-lg">•</span>
              <span><strong>Coarse Location for PHC Search:</strong> If you allow location access, your latitude and longitude are used purely to calculate distance to nearby PHCs and are never saved to a user profile.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold text-lg">•</span>
              <span><strong>Aggregated Anonymized Research Metrics:</strong> Non-identifiable stats (e.g. "45 checks performed in Chittoor district") may be compiled to improve public health facility indexing.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Medical Disclaimer Note */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-4">
        <h3 className="text-xl font-bold text-[#2C2418]">Medical & Legal Compliance Statement</h3>
        <p className="text-sm text-[#6B6355] leading-relaxed">
          Swastha Setu is designed as an educational public health project. It operates under standard health literacy guidelines and does not establish a doctor-patient relationship. In cases of acute life-threatening medical emergencies, emergency medical services (108) must be contacted immediately.
        </p>
      </div>

    </div>
  );
}
