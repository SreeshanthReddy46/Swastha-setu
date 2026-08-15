'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
export function Footer() {

  return (
    <footer className="bg-[#0C443A] text-white pt-16 pb-12 border-t border-[#0F6E56]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#0F6E56]/50">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" lightMode={true} />
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              Health guidance in your language, for everyone. Voice-first triage and government PHC locator for last-mile healthcare access.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300/80 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Account Needed · Privacy by Default</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/90 font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">Impact & Coverage</Link>
              </li>
              <li>
                <Link href="/check-up" className="inline-flex items-center gap-1 text-[#D85A30] font-bold hover:underline">
                  Start Voice Check-Up →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/90 font-medium">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ & Safety</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Organizations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
              For Organizations
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/90 font-medium">
              <li>
                <Link href="/get-involved" className="hover:text-white transition-colors">ASHA Workers & NGOs</Link>
              </li>
              <li>
                <Link href="/get-involved#deploy" className="hover:text-white transition-colors">Health Departments</Link>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                  <span>Data Source (data.gov.in)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Medical Disclaimer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70 font-normal">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            © 2026 Swastha Setu. <strong className="text-white font-medium">Medical Disclaimer:</strong> Swastha Setu provides plain-language health urgency triage and facility locating guidance. It is NOT a substitute for professional medical diagnosis, advice, or emergency treatment. For life-threatening emergencies, dial 108 immediately.
          </p>
          <div className="flex items-center gap-2 text-[#E5DCC8] bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Built as an Academic & Public Health Project</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
