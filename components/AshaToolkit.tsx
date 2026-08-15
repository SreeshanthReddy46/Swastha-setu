'use client';

import React, { useState } from 'react';
import { Stethoscope, FileText, Printer } from 'lucide-react';

export function AshaToolkit() {
  const [ageGroup, setAgeGroup] = useState<'child' | 'adult'>('child');
  const [weightKg, setWeightKg] = useState<number>(12);
  const [dehydration, setDehydration] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [generatedSlip, setGeneratedSlip] = useState(false);
  const [refId, setRefId] = useState('REF-ASH-01');

  // WHO ORS Guidelines: ~75 ml / kg for moderate dehydration over 4 hours
  const calculateOrsMl = () => {
    const factor = dehydration === 'mild' ? 50 : dehydration === 'moderate' ? 75 : 100;
    return Math.round(weightKg * factor);
  };

  const orsMl = calculateOrsMl();
  const sachetsNeeded = Math.ceil(orsMl / 1000); // 1 WHO sachet makes 1 liter (1000ml)

  const handleToggleSlip = () => {
    if (!generatedSlip && refId === 'REF-ASH-01') {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setRefId(`REF-ASH-${randomSuffix}`);
    }
    setGeneratedSlip(!generatedSlip);
  };

  return (
    <div className="glow-card p-6 sm:p-8 space-y-6 bg-white" suppressHydrationWarning>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5DCC8] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F6E56]/10 text-[#0F6E56] flex items-center justify-center font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#2C2418]">
              ASHA Frontline ORS & Referral Calculator
            </h3>
            <p className="text-xs text-[#6B6355]">WHO Guidelines Clinical Dosage Assistant</p>
          </div>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full">
          WHO Standard
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Control 1: Age Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2C2418] uppercase">Patient Category</label>
          <div className="flex bg-[#FAF6EE] p-1 rounded-xl border border-[#E5DCC8]">
            <button
              type="button"
              onClick={() => { setAgeGroup('child'); setWeightKg(12); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                ageGroup === 'child' ? 'bg-[#0F6E56] text-white' : 'text-[#6B6355]'
              }`}
            >
              Child (under 12)
            </button>
            <button
              type="button"
              onClick={() => { setAgeGroup('adult'); setWeightKg(55); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                ageGroup === 'adult' ? 'bg-[#0F6E56] text-white' : 'text-[#6B6355]'
              }`}
            >
              Adult
            </button>
          </div>
        </div>

        {/* Control 2: Weight slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#2C2418]">
            <span>Estimated Weight:</span>
            <span className="text-[#0F6E56]">{weightKg} kg</span>
          </div>
          <input
            type="range"
            min={ageGroup === 'child' ? 3 : 30}
            max={ageGroup === 'child' ? 35 : 100}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full accent-[#0F6E56] cursor-pointer"
          />
        </div>

        {/* Control 3: Dehydration status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2C2418] uppercase">Dehydration Level</label>
          <select
            value={dehydration}
            onChange={(e) => setDehydration(e.target.value as 'mild' | 'moderate' | 'severe')}
            className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl px-3 py-2 text-xs font-bold text-[#2C2418] cursor-pointer"
          >
            <option value="mild">Mild (Increased Thirst)</option>
            <option value="moderate">Moderate (Dry Mouth, Lethargy)</option>
            <option value="severe">Severe (Sunken Eyes, Urgent PHC)</option>
          </select>
        </div>

      </div>

      {/* Calculated Results Card */}
      <div className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6B6355] uppercase">Calculated Initial ORS Fluid Requirement (4 Hours):</span>
          <span className="text-xs font-extrabold text-[#D85A30] bg-[#D85A30]/10 px-2.5 py-0.5 rounded-full">
            {sachetsNeeded} WHO Sachet(s)
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#0F6E56]">{orsMl}</span>
          <span className="text-sm font-bold text-[#6B6355]">ml prepared clean drinking water ORS solution</span>
        </div>

        <p className="text-xs text-[#6B6355] leading-relaxed">
          Dissolve {sachetsNeeded} WHO packet(s) in {sachetsNeeded * 1000} ml of clean boiled drinking water. Administer frequently with small sips over 4 hours.
        </p>
      </div>

      {/* Digital PHC Referral Slip Generator Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleToggleSlip}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D85A30] hover:bg-[#C24C24] text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{generatedSlip ? "Hide Referral Slip" : "Generate Digital PHC Referral Slip"}</span>
        </button>
      </div>

      {/* Generated Digital Referral Slip Card */}
      {generatedSlip && (
        <div
          className="bg-white border-2 border-[#0F6E56] rounded-2xl p-6 space-y-4 shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-center justify-between border-b border-[#E5DCC8] pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase bg-[#0F6E56]/10 text-[#0F6E56] px-2 py-0.5 rounded">
                Official Digital Referral
              </span>
              <h4 className="text-base font-extrabold text-[#2C2418] pt-1">PHC Clinical Referral Form</h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#6B6355]">Ref ID: {refId}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#2C2418]">
            <p><strong>Category:</strong> {ageGroup === 'child' ? 'Child' : 'Adult'}</p>
            <p><strong>Est. Weight:</strong> {weightKg} kg</p>
            <p><strong>Dehydration:</strong> {dehydration.toUpperCase()}</p>
            <p><strong>Initial ORS:</strong> {orsMl} ml ({sachetsNeeded} sachet)</p>
          </div>

          <p className="text-[11px] text-[#6B6355] italic border-t border-[#E5DCC8] pt-2">
            Presented to Medical Officer on Duty at nearest Primary Health Centre. Generated via Swastha Setu ASHA Assistant.
          </p>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-[#0F6E56] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#0C443A] transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save Slip
          </button>
        </div>
      )}

    </div>
  );
}
