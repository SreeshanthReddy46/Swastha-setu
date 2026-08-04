'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useLanguage, Language, languageNames } from '@/lib/language-context';
import { BrandLogo } from '@/components/BrandLogo';
import { Globe, ArrowRight, Menu, X, Droplet } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('navHome'), id: 'hero' },
    { label: t('navAbout'), id: 'about' },
    { label: t('navHowItWorks'), id: 'how-it-works' },
    { label: t('navFeatures'), id: 'features' },
    { label: t('navImpact'), id: 'impact' },
    { label: t('navFAQ'), id: 'faq' },
    { label: t('navGetInvolved'), id: 'get-involved' },
    { label: t('navContact'), id: 'contact' },
  ];

  // High-performance requestAnimationFrame scroll spy listener
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 20);

          if (pathname === '/') {
            const sections = navItems.map((item) => document.getElementById(item.id));
            const scrollPosition = scrollY + 130;

            for (let i = sections.length - 1; i >= 0; i--) {
              const section = sections[i];
              if (section && section.offsetTop <= scrollPosition) {
                setActiveSection(navItems[i].id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-2 sm:px-4 pt-2.5 pointer-events-none">
      <m.div
        animate={{
          scale: isScrolled ? 0.98 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`mx-auto transition-all duration-300 pointer-events-auto gpu-accelerated ${
          isScrolled
            ? 'max-w-6xl bg-[#FAF6EE]/94 backdrop-blur-xl border border-[#E5DCC8] shadow-lg rounded-2xl py-2 px-3 sm:px-4'
            : 'max-w-7xl bg-[#FAF6EE]/96 border-b border-[#E5DCC8]/70 py-3 px-4 sm:px-5 rounded-b-2xl'
        }`}
      >
        <div className="flex items-center justify-between flex-nowrap gap-2 sm:gap-4 w-full">
          
          {/* Unique Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center shrink-0"
          >
            <BrandLogo size="md" />
          </a>

          {/* Desktop Animated Navigation Items — Guaranteed Single Line Row */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#FAF6EE] border border-[#E5DCC8]/80 p-1 rounded-xl shadow-inner flex-nowrap shrink-0">
            {navItems.map((item) => {
              const isActive = pathname === '/' && activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative text-[11px] xl:text-xs font-bold px-2 xl:px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#0F6E56]'
                      : 'text-[#6B6355] hover:text-[#2C2418] hover:bg-[#E5DCC8]/40'
                  }`}
                >
                  {isActive && (
                    <m.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E5DCC8] -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}

            <Link
              href="/blood-banks"
              className="text-[11px] xl:text-xs font-extrabold text-[#A32D2D] hover:bg-rose-50 px-2 xl:px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <Droplet className="w-3 h-3 xl:w-3.5 xl:h-3.5 fill-[#A32D2D]" />
              <span>Blood Banks</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0 flex-nowrap">
            {/* 9 Indian Languages Selector */}
            <div className="flex items-center bg-white border border-[#E5DCC8] rounded-xl px-2 xl:px-2.5 py-1.5 shadow-2xs shrink-0">
              <Globe className="w-3.5 h-3.5 text-[#0F6E56] mr-1 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[11px] xl:text-xs font-bold text-[#2C2418] focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                {Object.entries(languageNames).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.native} ({info.english})
                  </option>
                ))}
              </select>
            </div>

            {/* Glowing Terracotta CTA */}
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
              <Link
                href="/check-up"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D85A30] to-[#C24C24] text-white text-[11px] xl:text-xs font-extrabold px-3.5 xl:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
              </Link>
            </m.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Link
              href="/blood-banks"
              className="bg-rose-100 text-[#A32D2D] border border-rose-300 text-[11px] font-bold px-2 py-1.5 rounded-xl flex items-center gap-1"
            >
              <Droplet className="w-3 h-3 fill-[#A32D2D]" />
              <span>Blood Banks</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#2C2418] hover:bg-[#E5DCC8]/40 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#E5DCC8] pt-3 mt-2.5 pb-3 space-y-2"
            >
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#E5DCC8] mb-2.5">
                <span className="text-xs font-bold text-[#6B6355]">Select Language</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-[#FAF6EE] text-xs font-bold text-[#2C2418] rounded px-2 py-1"
                >
                  {Object.entries(languageNames).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.native} ({info.english})
                    </option>
                  ))}
                </select>
              </div>

              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="block text-xs font-bold text-[#2C2418] hover:text-[#0F6E56] py-1.5 px-2.5 rounded-lg hover:bg-white"
                >
                  {item.label}
                </a>
              ))}

              <Link
                href="/blood-banks"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-extrabold text-[#A32D2D] bg-rose-50 py-2 px-2.5 rounded-lg flex items-center gap-1.5"
              >
                <Droplet className="w-3.5 h-3.5 fill-[#A32D2D]" />
                <span>Find Emergency Blood Banks</span>
              </Link>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </header>
  );
}
