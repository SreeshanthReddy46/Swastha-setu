'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Building2, Heart, Share2, Download, ArrowRight } from 'lucide-react';
import { AshaToolkit } from '@/components/AshaToolkit';
import { useLanguage } from '@/lib/language-context';

export default function GetInvolvedPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Community & Organizational Deployment</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Partnering with ASHA Workers, NGOs & Health Depts
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Swastha Setu is built to support last-mile frontline workers. Discover how health workers and organizations can integrate and promote voice triage in your district.
        </p>
      </div>

      {/* Interactive ASHA Toolkit Component */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-[#2C2418]">Interactive Frontline Assistant</h2>
        <AshaToolkit />
      </div>

      {/* 3 Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#0F6E56]/10 text-[#0F6E56] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C2418]">For ASHA Workers</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            Use Swastha Setu during home visits to quickly verify symptom urgency, read triage advice aloud to elderly patients in Telugu or Hindi, and locate nearest active PHC doctors.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-[#0F6E56] pt-2">
            <li>✓ Audio guidance for low-literacy families</li>
            <li>✓ Quick body-map tap fallback</li>
            <li>✓ Instant PHC contact numbers</li>
          </ul>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#D85A30]/10 text-[#D85A30] flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C2418]">For Health NGOs</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            Deploy Swastha Setu in community health camps, rural medical outreach programs, and village WhatsApp groups as a free public health triage tool.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-[#D85A30] pt-2">
            <li>✓ Printable poster & QR code toolkits</li>
            <li>✓ Zero licensing or subscription fees</li>
            <li>✓ Open data integration</li>
          </ul>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#BA7517]/10 text-[#BA7517] flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#2C2418]">For District Health Depts</h3>
          <p className="text-sm text-[#6B6355] leading-relaxed">
            Connect your district's official PHC/CHC inventory, doctor shift data, and emergency helpline numbers directly into the Swastha Setu open index.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-[#BA7517] pt-2">
            <li>✓ Custom district data seeding</li>
            <li>✓ Verified facility listings</li>
            <li>✓ Real-time redirection metrics</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
