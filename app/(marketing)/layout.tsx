'use client';

import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LanguageProvider } from '@/lib/language-context';
import { PageTransition } from '@/components/PageTransition';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#2C2418] relative">
        <Header />
        <main className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <EmergencySOSModal />
      </div>
    </LanguageProvider>
  );
}
