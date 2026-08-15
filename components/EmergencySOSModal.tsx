'use client';

import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { PhoneCall, X, ShieldAlert, Volume2, VolumeX, Copy, Check } from 'lucide-react';

export function EmergencySOSModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { timeout: 5000 }
      );
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyCoords = () => {
    if (userCoords) {
      const text = `My Location for Ambulance 108: Latitude ${userCoords.lat.toFixed(4)}, Longitude ${userCoords.lng.toFixed(4)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleEmergencyAudio = () => {
    if (typeof window === 'undefined') return;
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance("Emergency Mode Active. If experiencing severe chest pain, breathing difficulty, or heavy bleeding, call 108 immediately.");
      utterance.lang = "en-IN";
      utterance.onend = () => setAudioPlaying(false);
      setAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Emergency SOS Trigger Button */}
      <m.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      >
        <m.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#A32D2D] to-rose-700 hover:from-rose-700 hover:to-[#A32D2D] text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border-2 border-white/40 cursor-pointer animate-mic-pulse"
        >
          <div className="w-3 h-3 rounded-full bg-white animate-ping" />
          <PhoneCall className="w-4 h-4" />
          <span>108 Emergency SOS</span>
        </m.button>
      </m.div>

      {/* High-Impact Emergency SOS Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <m.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white border-2 border-rose-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-rose-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-extrabold shadow-md">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-rose-900 leading-tight">
                      Emergency SOS Dispatch
                    </h3>
                    <p className="text-xs text-rose-700 font-bold">
                      National Ambulance & Health Helplines
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (audioPlaying) window.speechSynthesis.cancel();
                  }}
                  className="p-2 text-rose-900 hover:bg-rose-100 rounded-xl cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Live Location Reader for 108 Operator */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">
                  📍 Read Your Exact Location to 108 Operator:
                </span>
                <p className="text-xs font-bold text-rose-950 font-mono">
                  {userCoords
                    ? `Latitude ${userCoords.lat.toFixed(4)}° N, Longitude ${userCoords.lng.toFixed(4)}° E`
                    : "Fetching GPS Coordinates... (Or tell 108 your nearest landmark/Gram Panchayat)"}
                </p>
                {userCoords && (
                  <button
                    onClick={handleCopyCoords}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline pt-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Location Copied!" : "Copy GPS Text"}</span>
                  </button>
                )}
              </div>

              {/* Direct Helpline Buttons */}
              <div className="space-y-3">
                <a
                  href="tel:108"
                  className="w-full bg-[#A32D2D] hover:bg-rose-800 text-white font-extrabold text-base py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
                >
                  <PhoneCall className="w-6 h-6" />
                  <span>Call 108 National Ambulance (Free)</span>
                </a>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:102"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>102 Maternity</span>
                  </a>

                  <a
                    href="tel:104"
                    className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>104 Health Info</span>
                  </a>
                </div>
              </div>

              {/* Audio Voice Alert Simulation */}
              <div className="border-t border-rose-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-rose-800 font-semibold">Voice Emergency Assistant:</span>
                <button
                  onClick={toggleEmergencyAudio}
                  className="bg-rose-100 text-rose-900 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-200"
                >
                  {audioPlaying ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4 text-rose-700" />}
                  <span>{audioPlaying ? "Stop Voice" : "Play Voice Guidelines"}</span>
                </button>
              </div>

            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
