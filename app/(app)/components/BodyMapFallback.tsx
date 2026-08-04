'use client';

import React from 'react';
import { User, Activity, AlertCircle, Check } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface BodyMapFallbackProps {
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
}

export function BodyMapFallback({ selectedSymptoms, onToggleSymptom }: BodyMapFallbackProps) {
  const { t } = useLanguage();

  const bodyRegions = [
    {
      region: "Head & Neck",
      symptoms: ["Headache", "High Fever", "Dizziness", "Sore Throat", "Neck Stiffness"]
    },
    {
      region: "Chest & Respiratory",
      symptoms: ["Chest Pain", "Difficulty Breathing", "Persistent Cough", "Coughing Blood"]
    },
    {
      region: "Stomach & Digestion",
      symptoms: ["Severe Stomach Pain", "Vomiting", "Diarrhea", "Dehydration", "Loss of Appetite"]
    },
    {
      region: "Limbs, Skin & Emergency",
      symptoms: ["Snake Bite", "Fracture / Bone Injury", "Joint Pain", "Skin Rash", "Deep Cut / Bleeding"]
    }
  ];

  return (
    <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 space-y-6 shadow-sm">
      
      {/* Title Header */}
      <div>
        <span className="text-xs font-bold text-[#D85A30] uppercase tracking-wider block mb-1">
          Visual Body Selector
        </span>
        <h3 className="text-2xl font-bold text-[#2C2418]">Tap Symptoms on Body Selector</h3>
        <p className="text-xs text-[#6B6355] mt-1">
          Tap any symptom below to add it to your symptom check list.
        </p>
      </div>

      {/* Body Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bodyRegions.map((cat, idx) => (
          <div key={idx} className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-[#0F6E56] flex items-center gap-2 border-b border-[#E5DCC8] pb-2">
              <Activity className="w-4 h-4 text-[#0F6E56]" />
              <span>{cat.region}</span>
            </h4>

            <div className="flex flex-wrap gap-2">
              {cat.symptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => onToggleSymptom(sym)}
                    className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F6E56] text-white shadow-xs'
                        : 'bg-white border border-[#E5DCC8] text-[#2C2418] hover:border-[#0F6E56]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{sym}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
