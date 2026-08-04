'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShieldCheck, Phone, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function FAQPage() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<string | null>("trust-0");

  const trustFaqs = [
    {
      q: "Is Swastha Setu a medical diagnosis tool?",
      a: "No. Swastha Setu provides plain-language urgency triage guidance to help you understand whether your symptoms require an immediate 24/7 hospital visit, a same-day PHC visit, or routine home care. It does not replace a qualified medical doctor."
    },
    {
      q: "Is my voice recording or health data saved or linked to my phone?",
      a: "No personal health data or identity is tracked or stored. Voice processing occurs ephemerally in your browser. We do not require account logins, phone numbers, or names."
    },
    {
      q: "Is this service really free?",
      a: "Yes, 100% free forever. Swastha Setu is developed as an open public health initiative to improve rural healthcare access."
    }
  ];

  const usageFaqs = [
    {
      q: "What languages are currently supported?",
      a: "Swastha Setu currently supports Telugu, Hindi, and English for both voice intake and text-to-speech result playback."
    },
    {
      q: "Do I need high-speed internet to use this?",
      a: "No. The application is ultra-lightweight (under 200KB) and designed to function smoothly on basic 2G/3G mobile networks."
    },
    {
      q: "What if I cannot speak clearly or it is too noisy?",
      a: "You can switch to the 'Visual Body Map' tab at any time during check-up. Simply tap the affected body part and select symptom chips."
    }
  ];

  const ngoFaqs = [
    {
      q: "How can ASHA workers and local health departments use this tool?",
      a: "ASHA workers and NGOs can use Swastha Setu during household visits to conduct quick urgency triage and guide families to active local PHCs. Visit our Get Involved page for deployment toolkits."
    }
  ];

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Title */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Help & Clarifications</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Clear answers regarding trust, safety, privacy, language support, and field usage.
        </p>
      </div>

      {/* Group 1: Trust & Safety */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-[#0F6E56] border-b border-[#E5DCC8] pb-3">
          <ShieldCheck className="w-6 h-6" />
          <h2>Trust & Safety</h2>
        </div>
        <div className="space-y-3">
          {trustFaqs.map((faq, i) => {
            const id = `trust-${i}`;
            const isOpen = openIndex === id;
            return (
              <div key={id} className="bg-white border border-[#E5DCC8] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggle(id)}
                  className="w-full p-5 text-left font-bold text-[#2C2418] flex items-center justify-between hover:bg-[#FAF6EE]/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6B6355] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#6B6355] leading-relaxed border-t border-[#E5DCC8]/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 2: Using the Tool */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-[#D85A30] border-b border-[#E5DCC8] pb-3">
          <HelpCircle className="w-6 h-6" />
          <h2>Using the Tool</h2>
        </div>
        <div className="space-y-3">
          {usageFaqs.map((faq, i) => {
            const id = `use-${i}`;
            const isOpen = openIndex === id;
            return (
              <div key={id} className="bg-white border border-[#E5DCC8] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggle(id)}
                  className="w-full p-5 text-left font-bold text-[#2C2418] flex items-center justify-between hover:bg-[#FAF6EE]/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6B6355] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#6B6355] leading-relaxed border-t border-[#E5DCC8]/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 3: For Health Workers & NGOs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-bold text-[#BA7517] border-b border-[#E5DCC8] pb-3">
          <Users className="w-6 h-6" />
          <h2>For Health Workers & NGOs</h2>
        </div>
        <div className="space-y-3">
          {ngoFaqs.map((faq, i) => {
            const id = `ngo-${i}`;
            const isOpen = openIndex === id;
            return (
              <div key={id} className="bg-white border border-[#E5DCC8] rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggle(id)}
                  className="w-full p-5 text-left font-bold text-[#2C2418] flex items-center justify-between hover:bg-[#FAF6EE]/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6B6355] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#6B6355] leading-relaxed border-t border-[#E5DCC8]/40 pt-3">
                    {faq.a}
                    <div className="mt-3">
                      <Link href="/get-involved" className="text-[#0F6E56] font-bold text-xs hover:underline flex items-center gap-1">
                        Visit Get Involved Page →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
