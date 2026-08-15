'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion as m } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

const AshaToolkit = dynamic(
  () => import('@/components/AshaToolkit').then((mod) => mod.AshaToolkit),
  { ssr: false, loading: () => <div className="glow-card p-8 bg-white min-h-[260px] flex items-center justify-center text-xs font-bold text-[#6B6355]">Loading ASHA Frontline Calculator...</div> }
);
import { 
  Mic, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Activity, 
  Lock, 
  CheckCircle2, 
  Building2,
  ChevronRight,
  AlertTriangle,
  Users,
  Heart,
  Mail,
  Phone,
  ChevronDown,
  WifiOff,
  ChevronLeft
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>("trust-0");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    role: 'ASHA Worker / Health Worker',
    message: ''
  });

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

  const districtShowcase = [
    { district: "Chittoor District", state: "Andhra Pradesh", phcs: 342, chcs: 48, activeDoctors: 120, ambulance: "24/7 Active", imageBg: "from-[#0F6E56]/15 to-emerald-100/40" },
    { district: "Annamayya Cluster", state: "Andhra Pradesh", phcs: 215, chcs: 32, activeDoctors: 85, ambulance: "24/7 Active", imageBg: "from-[#D85A30]/15 to-orange-100/40" },
    { district: "Medak Region", state: "Telangana", phcs: 289, chcs: 36, activeDoctors: 98, ambulance: "24/7 Active", imageBg: "from-[#BA7517]/15 to-amber-100/40" },
    { district: "Siddipet Cluster", state: "Telangana", phcs: 198, chcs: 24, activeDoctors: 76, ambulance: "Ready", imageBg: "from-[#0C443A]/15 to-teal-100/40" },
    { district: "Rae Bareli", state: "Uttar Pradesh", phcs: 412, chcs: 54, activeDoctors: 145, ambulance: "24/7 Active", imageBg: "from-[#0F6E56]/15 to-emerald-100/40" },
    { district: "Muzaffarpur", state: "Bihar", phcs: 197, chcs: 26, activeDoctors: 64, ambulance: "Ready", imageBg: "from-[#D85A30]/15 to-orange-100/40" },
  ];

  const scrollHorizontal = (direction: 'left' | 'right') => {
    if (horizontalScrollRef.current) {
      const { scrollLeft, clientWidth } = horizontalScrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      horizontalScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="space-y-28 pb-24 pt-24 overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section id="hero" className="relative pt-4 pb-16 px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <m.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <m.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-[#0F6E56]" />
              <span>Voice-First Rural Health Triage & Locator</span>
            </m.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C2418] tracking-tight leading-tight">
              {t('tagline')}
            </h1>

            <p className="text-lg sm:text-xl text-[#6B6355] max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {t('heroSubhead')} Speak in Telugu, Hindi, or English to understand symptom urgency and locate your nearest active Primary Health Centre.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <m.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/check-up"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#D85A30] to-[#C24C24] text-white font-extrabold text-lg px-9 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Mic className="w-6 h-6 animate-pulse" />
                  <span>{t('getStarted')}</span>
                </Link>
              </m.div>

              <m.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF6EE] text-[#2C2418] border border-[#E5DCC8] font-bold text-base px-6 py-4 rounded-2xl transition-colors shadow-xs"
              >
                <span>{t('seeHowItWorks')}</span>
                <ArrowRight className="w-4 h-4 text-[#6B6355]" />
              </m.a>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#6B6355] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F6E56]" /> No Login Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F6E56]" /> 100% Free Always
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F6E56]" /> Telugu, Hindi, English
              </span>
            </div>
          </m.div>

          {/* Hero Right Visual Motif */}
          <m.div 
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md glow-card-terracotta p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5DCC8] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F6E56]/10 flex items-center justify-center text-[#0F6E56]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#2C2418]">Voice Triage Assist</h3>
                    <p className="text-xs text-[#6B6355]">Telugu / Hindi / English</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#0F6E56]/10 text-[#0F6E56] text-xs font-bold px-2.5 py-1 rounded-full">
                  <Volume2 className="w-3.5 h-3.5" /> Audio Ready
                </span>
              </div>

              <div className="text-center py-6 bg-[#FAF6EE] rounded-2xl border border-[#E5DCC8]/60 relative overflow-hidden">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D85A30] text-white shadow-lg animate-mic-pulse mb-3">
                  <Mic className="w-10 h-10" />
                </div>
                <p className="text-sm font-bold text-[#2C2418]">&quot;నాకు కడుపులో తీవ్రమైన నొప్పిగా ఉంది...&quot;</p>
                <p className="text-xs text-[#6B6355] mt-1">(&quot;I have severe stomach pain...&quot;)</p>
              </div>

              <div className="bg-[#FAF6EE] border-l-4 border-[#BA7517] p-3.5 rounded-r-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-[#BA7517]">
                  <span>MODERATE URGENCY</span>
                  <span>Visit PHC Today</span>
                </div>
                <p className="text-xs text-[#2C2418] font-medium leading-snug">
                  Consult medical officer at nearest Primary Health Centre within 6 hours.
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-12">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            <span>About The Problem & Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418] tracking-tight">
            Bridging the Last-Mile Healthcare Knowledge Gap
          </h2>
          <p className="text-base text-[#6B6355] leading-relaxed">
            Under Ayushman Bharat and the National Health Mission, thousands of PHCs exist. But rural citizens lack plain-language guidance to evaluate symptom urgency and check active facility resources.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { stat: "68%", title: "Care Delayed Due to Uncertainty", desc: "Patients delay seeking care due to confusion over whether symptoms are minor or serious.", color: "text-[#D85A30]" },
            { stat: "40%+", title: "Bypass Nearest PHC Facility", desc: "Patients travel long distances unaware that their local PHC has doctors and medicines on duty.", color: "text-[#0F6E56]" },
            { stat: "3x", title: "Language & Literacy Barrier", desc: "Low-literacy and non-English speaking elderly individuals require voice-first assistance.", color: "text-[#BA7517]" },
          ].map((card, idx) => (
            <m.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glow-card p-8 space-y-3"
            >
              <div className={`text-4xl font-extrabold ${card.color}`}>{card.stat}</div>
              <h3 className="text-lg font-bold text-[#2C2418]">{card.title}</h3>
              <p className="text-xs text-[#6B6355] leading-relaxed">{card.desc}</p>
            </m.div>
          ))}
        </div>

        {/* Scope Boundaries */}
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 space-y-3"
        >
          <div className="flex items-center gap-3 text-rose-700 font-bold text-lg">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Scope Boundaries: What Swastha Setu Is NOT</span>
          </div>
          <ul className="space-y-1.5 text-xs text-rose-900 font-medium list-disc list-inside">
            <li><strong>NOT a Medical Diagnosis Tool:</strong> It categorizes symptom urgency to guide timely facility visits.</li>
            <li><strong>NOT a Doctor Replacement:</strong> It connects patients to human healthcare professionals at PHCs.</li>
            <li><strong>NOT for Tele-Prescriptions:</strong> No clinical prescriptions or drug dispensations are issued.</li>
          </ul>
        </m.div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <m.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 sm:p-12 space-y-12"
        >
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#0F6E56] uppercase tracking-widest block mb-1">
              Simple 4-Step Walkthrough
            </span>
            <h2 className="text-3xl font-extrabold text-[#2C2418]">How Swastha Setu Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Speak or Tap Symptoms", desc: "Press the mic and speak in Telugu, Hindi, or English. Or tap symptoms on our visual body selector.", bg: "bg-[#0F6E56]/10 text-[#0F6E56]" },
              { num: "2", title: "Plain-Language Check", desc: "Get an instant, color-coded urgency assessment explaining how quickly you need medical care.", bg: "bg-[#D85A30]/10 text-[#D85A30]" },
              { num: "3", title: "Locate Nearest PHC", desc: "View verified nearby government health centres, active doctor counts, and available medicine stocks.", bg: "bg-[#BA7517]/10 text-[#BA7517]" },
              { num: "4", title: "Directions & Direct Call", desc: "Get turn-by-turn directions or call the medical officer directly before leaving your home.", bg: "bg-[#0C443A]/10 text-[#0C443A]" },
            ].map((step, idx) => (
              <m.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="space-y-3 p-4 rounded-2xl border border-[#E5DCC8]/40 bg-[#FAF6EE]/50 hover:bg-white transition-colors"
              >
                <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center font-bold text-lg`}>
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-[#2C2418]">{step.title}</h3>
                <p className="text-xs text-[#6B6355] leading-relaxed">{step.desc}</p>
              </m.div>
            ))}
          </div>
        </m.div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-12">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            <span>Capabilities Grid</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418] tracking-tight">
            Key Features Built for Rural Access
          </h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Mic className="w-6 h-6 text-[#D85A30]" />, title: "Multi-Language Voice Intake", desc: "Speak naturally in Telugu, Hindi, or English with speech recognition tailored for regional phrasing." },
            { icon: <Activity className="w-6 h-6 text-[#A32D2D]" />, title: "Plain-Language Urgency Triage", desc: "Instantly categorizes symptom urgency into Emergency, High, Moderate, or Routine with recommended action steps." },
            { icon: <MapPin className="w-6 h-6 text-[#0F6E56]" />, title: "Government PHC Locator", desc: "Search indexed Primary Health Centres with active doctor counts, ambulance status, and directions." },
            { icon: <Volume2 className="w-6 h-6 text-[#BA7517]" />, title: "Audio TTS Results Reader", desc: "Zero literacy barrier: hear triage advice and action steps read aloud in your native language." },
            { icon: <WifiOff className="w-6 h-6 text-[#0C443A]" />, title: "Low-Bandwidth Optimization", desc: "Lightweight client footprint under 200KB. Operates smoothly on basic 2G/3G networks." },
            { icon: <Lock className="w-6 h-6 text-[#0F6E56]" />, title: "Private & Frictionless", desc: "No phone number, OTP, login, or name required. Your symptom check remains anonymous." },
          ].map((feat, idx) => (
            <m.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glow-card p-6 space-y-3"
            >
              {feat.icon}
              <h3 className="text-lg font-bold text-[#2C2418]">{feat.title}</h3>
              <p className="text-xs text-[#6B6355] leading-relaxed">{feat.desc}</p>
            </m.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: IMPACT & HORIZONTAL CAROUSEL SHOWCASE */}
      <section id="impact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-8">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
              <span>Horizontal Scroll Facility Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418] tracking-tight">
              1,404 PHCs Indexed Across 4 States
            </h2>
            <p className="text-xs text-[#6B6355]">
              Scroll horizontally to explore district clusters, doctor availability, and facility readiness.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollHorizontal('left')}
              className="p-3 bg-white border border-[#E5DCC8] rounded-xl hover:bg-[#FAF6EE] text-[#2C2418] shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 text-[#0F6E56]" />
            </button>
            <button
              onClick={() => scrollHorizontal('right')}
              className="p-3 bg-white border border-[#E5DCC8] rounded-xl hover:bg-[#FAF6EE] text-[#2C2418] shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 text-[#0F6E56]" />
            </button>
          </div>
        </m.div>

        {/* Smooth Horizontal Carousel Container - Native GPU Acceleration */}
        <div 
          ref={horizontalScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 no-scrollbar scroll-smooth"
        >
          {districtShowcase.map((item, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[290px] sm:w-[340px] glow-card p-6 space-y-4 cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${item.imageBg} rounded-2xl p-4 space-y-2 border border-[#E5DCC8]/40`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#0F6E56] bg-white/80 px-2.5 py-0.5 rounded-full">{item.state}</span>
                  <span className="text-[#D85A30]">{item.ambulance}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#2C2418] pt-1">{item.district}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#E5DCC8] pt-3">
                <div>
                  <span className="text-[#6B6355] block">PHCs Indexed:</span>
                  <span className="font-extrabold text-[#0F6E56] text-base">{item.phcs}</span>
                </div>
                <div>
                  <span className="text-[#6B6355] block">CHCs:</span>
                  <span className="font-extrabold text-[#D85A30] text-base">{item.chcs}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#2C2418] bg-[#FAF6EE] p-3 rounded-xl">
                <span>Doctors On Duty:</span>
                <span className="text-[#0F6E56] font-extrabold">{item.activeDoctors} Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-8">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            <span>Trust & Safety FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418] tracking-tight">
            Frequently Asked Questions
          </h2>
        </m.div>

        <div className="space-y-3">
          {[...trustFaqs, ...usageFaqs].map((faq, i) => {
            const id = `trust-${i}`;
            const isOpen = openFaq === id;
            return (
              <m.div 
                key={id} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glow-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : id)}
                  className="w-full p-5 text-left font-bold text-[#2C2418] flex items-center justify-between hover:bg-[#FAF6EE]/60 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#6B6355] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#6B6355] leading-relaxed border-t border-[#E5DCC8]/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </m.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: GET INVOLVED & ASHA TOOLKIT */}
      <section id="get-involved" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-12">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            <span>Deployment Toolkits & Innovation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C2418] tracking-tight">
            For ASHA Workers, NGOs & Health Depts
          </h2>
        </m.div>

        {/* Asha Toolkit Assistant */}
        <AshaToolkit />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Users className="w-8 h-8 text-[#0F6E56]" />, title: "For ASHA Workers", desc: "Conduct quick urgency triage during household visits and read guidance aloud to elderly patients." },
            { icon: <Heart className="w-8 h-8 text-[#D85A30]" />, title: "For Health NGOs", desc: "Deploy in village medical outreach programs and Gram Panchayat health committees." },
            { icon: <Building2 className="w-8 h-8 text-[#BA7517]" />, title: "For Health Depts", desc: "Connect official PHC inventory and doctor shift data directly to the Swastha Setu open index." },
          ].map((item, idx) => (
            <m.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="glow-card p-8 space-y-3"
            >
              {item.icon}
              <h3 className="text-lg font-bold text-[#2C2418]">{item.title}</h3>
              <p className="text-xs text-[#6B6355] leading-relaxed">{item.desc}</p>
            </m.div>
          ))}
        </div>
      </section>

      {/* SECTION 8: CONTACT */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glow-card p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
              <span>Get In Touch</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#2C2418]">Contact Team</h2>
            <p className="text-xs text-[#6B6355] leading-relaxed">
              Questions about field deployment, open health data integration, or academic research collaboration?
            </p>
            <div className="space-y-3 text-xs text-[#6B6355]">
              <p className="flex items-center gap-2 font-bold text-[#2C2418]">
                <Mail className="w-4 h-4 text-[#0F6E56]" /> contact@swasthasetu.org
              </p>
              <p className="flex items-center gap-2 font-bold text-[#2C2418]">
                <Phone className="w-4 h-4 text-[#D85A30]" /> +91 800 555 7388
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {contactSubmitted ? (
              <div className="bg-[#FAF6EE] p-8 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-[#2C2418]">Thank You!</h4>
                <p className="text-xs text-[#6B6355]">Your message has been submitted to the Swastha Setu team.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-xs text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-xs text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="How can we help or collaborate? *"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-4 py-3 text-xs text-[#2C2418] focus:outline-none focus:border-[#0F6E56]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#D85A30] hover:bg-[#C24C24] text-white font-bold text-xs py-3.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-98"
                >
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </m.div>
      </section>

      {/* FINAL CTA BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0F6E56] rounded-3xl p-10 sm:p-14 text-center text-white space-y-6 shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Check Your Symptoms in Your Language?
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm">
            No registration, no download, and no fees. Get instant triage guidance and locate your nearest healthcare centre now.
          </p>
          <div className="pt-2">
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link
                href="/check-up"
                className="inline-flex items-center gap-3 bg-[#D85A30] hover:bg-[#C24C24] text-white font-extrabold text-base px-9 py-4 rounded-2xl shadow-lg transition-all"
              >
                <Mic className="w-5 h-5" />
                <span>Start Voice Check-Up Now →</span>
              </Link>
            </m.div>
          </div>
        </m.div>
      </section>

    </div>
  );
}
