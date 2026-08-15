'use client';

import React from 'react';
import { motion as m } from 'framer-motion';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export function BrandLogo({ size = 'md', showSubtitle = true, lightMode = false }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      {/* Unique Friendly Logo Emblem */}
      <m.div
        whileHover={{ scale: 1.06, rotate: 4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-[#0F6E56] via-[#0C443A] to-[#0A3830] flex items-center justify-center text-white shadow-md relative overflow-hidden border border-white/20`}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D85A30]/40 rounded-full blur-xs" />
        
        {/* Custom Friendly SVG Vector: Bridge Arc + Heartbeat + Voice Waves */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-white"
        >
          {/* Bridge Arc */}
          <path
            d="M4 22C4 14.268 10.268 8 18 8C21.78 8 25.21 9.5 27.7 11.9"
            stroke="#6EE7B7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Heartbeat Pulse Line */}
          <path
            d="M4 18H9L12 11L16 23L20 14L23 18H28"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Friendly Voice Dot */}
          <circle cx="26" cy="9" r="2.5" fill="#F97316" />
        </svg>
      </m.div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-extrabold tracking-tight ${lightMode ? 'text-white' : 'text-[#2C2418]'} block leading-none`}>
            Swastha Setu
          </span>
          <span className="w-2 h-2 rounded-full bg-[#D85A30] animate-pulse" />
        </div>
        {showSubtitle && (
          <span className={`text-[10px] font-bold tracking-wide uppercase ${lightMode ? 'text-emerald-200/80' : 'text-[#0F6E56]'} block mt-0.5`}>
            स्वास्थ्य सेतु · Voice Health Bridge
          </span>
        )}
      </div>
    </div>
  );
}
