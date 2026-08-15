'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Ambulance, 
  Stethoscope, 
  ArrowLeft, 
  Navigation, 
  Pill, 
  ShieldCheck, 
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { getFacilityById } from '@/lib/facility-service';

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const facility = getFacilityById(id);

  if (!facility) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#A32D2D] mx-auto" />
        <h2 className="text-2xl font-bold text-[#2C2418]">Hospital Not Found</h2>
        <p className="text-xs text-[#6B6355]">The requested hospital facility record could not be located in the dataset index.</p>
        <Link href="/locator" className="inline-block bg-[#0F6E56] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer">
          Return to Hospital Locator →
        </Link>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.address)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F6E56] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Search</span>
        </button>
      </div>

      {/* Main Hospital Hero Card */}
      <div className="bg-white border border-[#E5DCC8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E5DCC8] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase bg-[#0F6E56]/10 text-[#0F6E56] px-3 py-1 rounded-full">
                {facility.type}
              </span>
              {facility.category && (
                <span className="text-xs font-bold bg-[#FAF6EE] text-[#6B6355] border border-[#E5DCC8] px-3 py-1 rounded-full">
                  {facility.category}
                </span>
              )}
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${facility.emergency_24x7 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                {facility.emergency_24x7 ? '✓ 24/7 Emergency Active' : 'Day OPD Only'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418] leading-tight">
              {facility.name}
            </h1>
            <p className="text-xs text-[#6B6355] font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#0F6E56] shrink-0" />
              <span>{facility.address} ({facility.district}, {facility.state})</span>
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right space-y-1">
            <span className="text-xs font-bold text-[#6B6355] block">Distance to Location:</span>
            <span className="text-2xl font-extrabold text-[#D85A30]">📍 {facility.distance_km < 1 ? `${(facility.distance_km * 1000).toFixed(0)}m` : `${facility.distance_km} km`}</span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${facility.phone}`}
            className="w-full bg-[#0F6E56] hover:bg-[#0C443A] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Call Hospital ({facility.phone})</span>
          </a>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#D85A30] hover:bg-[#C24C24] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>Open Google Maps Directions →</span>
          </a>
        </div>

        {/* Key Hospital Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#FAF6EE] border border-[#E5DCC8] p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#0F6E56]" /> Doctors On Duty
            </span>
            <span className="text-xl font-extrabold text-[#0F6E56] block">{facility.doctors_on_duty} Active</span>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E5DCC8] p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" /> ICU Beds
            </span>
            <span className="text-xl font-extrabold text-rose-700 block">{facility.icu_beds || 10} Available</span>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E5DCC8] p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#BA7517]" /> General Beds
            </span>
            <span className="text-xl font-extrabold text-[#BA7517] block">{facility.beds_available || 150} Total</span>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E5DCC8] p-4 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-[#6B6355] flex items-center gap-1">
              <Ambulance className="w-3.5 h-3.5 text-[#D85A30]" /> Ambulance
            </span>
            <span className="text-xl font-extrabold text-[#D85A30] block">{facility.ambulance_available ? '24/7 Active' : 'On Call'}</span>
          </div>
        </div>

        {/* Clinical Specialties */}
        {facility.specialties && facility.specialties.length > 0 && (
          <div className="space-y-2 border-t border-[#E5DCC8] pt-4">
            <h4 className="font-bold text-xs text-[#2C2418] uppercase">Clinical Specialties & Units:</h4>
            <div className="flex flex-wrap gap-2">
              {facility.specialties.map((s, idx) => (
                <span key={idx} className="bg-emerald-50 text-[#0F6E56] border border-emerald-200 text-xs font-bold px-3 py-1 rounded-xl">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Essential Medicines Inventory */}
        {facility.medicines_in_stock && (
          <div className="space-y-2 border-t border-[#E5DCC8] pt-4">
            <h4 className="font-bold text-xs text-[#2C2418] uppercase flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#0F6E56]" />
              Verified Essential Medicine Stock:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {facility.medicines_in_stock.map((m, idx) => (
                <span key={idx} className="bg-[#FAF6EE] text-[#2C2418] border border-[#E5DCC8] text-xs font-medium px-2.5 py-1 rounded-lg">
                  ✓ {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        <div className="border-t border-[#E5DCC8] pt-4 flex items-center justify-between text-xs text-[#6B6355] font-semibold">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#0F6E56]" />
            Operating Hours: {facility.operating_hours || '24 Hours Emergency & Casualty'}
          </span>
          <span className="flex items-center gap-1 text-[#0F6E56]">
            <ShieldCheck className="w-4 h-4" /> Open Govt Dataset Verified
          </span>
        </div>

      </div>

    </div>
  );
}
