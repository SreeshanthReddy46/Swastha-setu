'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, PhoneCall, AlertTriangle } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageProvider, useLanguage, Language, languageNames } from '@/lib/language-context';
import { PageTransition } from '@/components/PageTransition';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';

function AppHeader() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Top Emergency Helpline Warning Bar */}
      <div className="bg-[#A32D2D] text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>For life-threatening emergencies, call 108 immediately.</span>
        <a href="tel:108" className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded text-[11px] font-extrabold transition-colors flex items-center gap-1">
          <PhoneCall className="w-3 h-3" /> Call 108
        </a>
      </div>

      {/* Minimal App Chrome Header */}
      <header className="bg-[#FAF6EE] border-b border-[#E5DCC8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Back Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F6E56] hover:text-[#0C443A] bg-white border border-[#E5DCC8] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('exitCheckup')}</span>
            </Link>

            <Link href="/">
              <BrandLogo size="sm" showSubtitle={false} />
            </Link>
          </div>

          {/* Right 9 Indian Languages Switcher */}
          <div className="flex items-center gap-2 bg-white border border-[#E5DCC8] rounded-xl px-2.5 py-1.5 text-xs shadow-2xs min-w-[155px]">
            <Globe className="w-4 h-4 text-[#0F6E56] shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent font-bold text-[#2C2418] focus:outline-none cursor-pointer w-full text-xs"
            >
              {Object.entries(languageNames).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.native} ({info.english})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#2C2418] relative">
        <AppHeader />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PageTransition>{children}</PageTransition>
        </main>
        <EmergencySOSModal />
      </div>
    </LanguageProvider>
  );
}
