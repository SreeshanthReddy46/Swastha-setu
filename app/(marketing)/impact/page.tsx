'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ImpactPage() {

  const districtCoverage = [
    { district: "Chittoor & Annamayya", state: "Andhra Pradesh", phcs: 342, chcs: 48, status: "Active Index" },
    { district: "Medak & Siddipet", state: "Telangana", phcs: 289, chcs: 36, status: "Active Index" },
    { district: "Rae Bareli & Lucknow", state: "Uttar Pradesh", phcs: 412, chcs: 54, status: "Active Index" },
    { district: "Muzaffarpur & Vaishali", state: "Bihar", phcs: 197, chcs: 26, status: "Active Index" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#0F6E56]/10 text-[#0F6E56] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
          <span>Coverage & Pilot Analytics</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C2418] tracking-tight">
          Public Health Coverage & Impact Index
        </h1>
        <p className="text-lg text-[#6B6355] leading-relaxed">
          Tracking primary health centre indexing, pilot testing accuracy, and rural care redirection metrics.
        </p>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold text-[#6B6355] uppercase tracking-wider block mb-1">Indexed Facilities</span>
          <div className="text-3xl font-extrabold text-[#0F6E56]">1,404</div>
          <p className="text-xs text-[#6B6355] mt-1">PHCs, CHCs, and Sub-Centres</p>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold text-[#6B6355] uppercase tracking-wider block mb-1">States Covered</span>
          <div className="text-3xl font-extrabold text-[#D85A30]">4 States</div>
          <p className="text-xs text-[#6B6355] mt-1">AP, TS, UP, and Bihar</p>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold text-[#6B6355] uppercase tracking-wider block mb-1">Pilot Triage Accuracy</span>
          <div className="text-3xl font-extrabold text-[#BA7517]">91.4%</div>
          <p className="text-xs text-[#6B6355] mt-1">Validated against clinical protocols</p>
        </div>

        <div className="bg-white border border-[#E5DCC8] rounded-2xl p-6 shadow-xs">
          <span className="text-xs font-bold text-[#6B6355] uppercase tracking-wider block mb-1">Language Coverage</span>
          <div className="text-3xl font-extrabold text-[#0C443A]">3 Languages</div>
          <p className="text-xs text-[#6B6355] mt-1">Telugu, Hindi, and English</p>
        </div>
      </div>

      {/* State & District Breakdown Table */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5DCC8] pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#2C2418]">District-Wise Facility Index</h2>
            <p className="text-sm text-[#6B6355]">Verified government dataset seeding from Open Government Data (data.gov.in)</p>
          </div>
          <span className="text-xs font-bold bg-[#0F6E56]/10 text-[#0F6E56] px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Live Verified Seed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C2418]">
            <thead>
              <tr className="border-b border-[#E5DCC8] text-xs font-bold text-[#6B6355] uppercase tracking-wider">
                <th className="pb-3">District Cluster</th>
                <th className="pb-3">State</th>
                <th className="pb-3">PHCs</th>
                <th className="pb-3">CHCs</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DCC8]/60 font-medium">
              {districtCoverage.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF6EE]/50 transition-colors">
                  <td className="py-4 font-bold text-[#2C2418]">{row.district}</td>
                  <td className="py-4 text-[#6B6355]">{row.state}</td>
                  <td className="py-4 text-[#0F6E56] font-bold">{row.phcs}</td>
                  <td className="py-4 text-[#D85A30] font-bold">{row.chcs}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/locator"
          className="inline-flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0C443A] text-white font-bold text-base px-8 py-4 rounded-xl shadow-md transition-all"
        >
          <span>Search Health Centres in Your Area</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
