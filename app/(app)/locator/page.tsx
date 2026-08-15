'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Phone, 
  Search, 
  Filter, 
  AlertCircle, 
  ArrowRight,
  Ambulance,
  Stethoscope,
  RefreshCw,
  LocateFixed,
  HeartPulse
} from 'lucide-react';
import { searchFacilities, HealthFacility } from '@/lib/facility-service';

// Dynamically import Leaflet map to avoid SSR window errors
const FacilityMap = dynamic(() => import('../components/FacilityMap.client'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl flex items-center justify-center text-xs font-bold text-[#6B6355]">Loading Interactive Map...</div>
});

export default function LocatorPage() {
  const [query, setQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  
  // Location States
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const facilities = useMemo(() => {
    const activeLat = userCoords ? userCoords.lat : undefined;
    const activeLng = userCoords ? userCoords.lng : undefined;
    let list = searchFacilities(query, emergencyOnly, activeLat, activeLng, 100);
    
    if (selectedCategory !== 'all') {
      list = list.filter((f) => 
        f.type.toLowerCase().includes(selectedCategory.toLowerCase()) || 
        (f.category && f.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (f.specialties && f.specialties.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())))
      );
    }
    return list;
  }, [query, emergencyOnly, selectedCategory, userCoords]);

  const activeSelected = selectedFacility || facilities[0] || null;

  const handleSelectFacility = useCallback((f: HealthFacility) => {
    setSelectedFacility(f);
  }, []);

  // Request Browser Geolocation
  const handleDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError("Location permission denied or unavailable. You can use preset regions below.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Quick Preset Locations for instant 1-click evaluation
  const setPresetCoords = (lat: number, lng: number) => {
    setUserCoords({ lat, lng });
    setLocationError(null);
    setQuery('');
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5DCC8] pb-4">
        <div>
          <span className="text-xs font-extrabold text-[#0F6E56] uppercase tracking-wider block mb-1">
            Verified Open Healthcare Dataset Index (100 km Radius)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418]">
            Nearby Hospitals & Medical Facilities
          </h1>
          <p className="text-xs text-[#6B6355]">
            District Civil Hospitals, Super Speciality Centers, Medical Colleges, Maternity Hospitals & PHCs
          </p>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 bg-[#0F6E56] hover:bg-[#0C443A] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
        >
          {isLocating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4 text-emerald-300" />
          )}
          <span>{isLocating ? "Acquiring GPS Signal..." : "📍 Detect My Location (GPS)"}</span>
        </button>
      </div>

      {/* Live GPS Status Banner */}
      {userCoords && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>
              GPS Location Active ({userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E) — Showing All Hospitals Within 100km Radius (Closest to Furthest)
            </span>
          </div>
          <button
            onClick={() => setUserCoords(null)}
            className="text-[11px] font-semibold text-[#A32D2D] hover:underline cursor-pointer"
          >
            Reset GPS
          </button>
        </div>
      )}

      {locationError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-3 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Preset Location Test Buttons */}
      <div className="bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-[#6B6355] mr-1">One-Tap Test Regions:</span>
        <button
          onClick={() => setPresetCoords(13.2172, 79.1003)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 Chittoor / Tirupati (AP)
        </button>
        <button
          onClick={() => setPresetCoords(18.1012, 78.8520)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 Siddipet / AIIMS Bibinagar (TS)
        </button>
        <button
          onClick={() => setPresetCoords(26.2285, 81.2425)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 AIIMS Rae Bareli (UP)
        </button>
        <button
          onClick={() => setPresetCoords(26.1209, 85.3647)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 SKMCH Muzaffarpur (BR)
        </button>
        <button
          onClick={() => setPresetCoords(28.5672, 77.2100)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 AIIMS / Safdarjung (Delhi)
        </button>
        <button
          onClick={() => setPresetCoords(12.9629, 77.5750)}
          className="bg-white border border-[#E5DCC8] hover:border-[#0F6E56] text-[#2C2418] font-semibold px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer"
        >
          📍 Bengaluru (NIMHANS / Victoria)
        </button>
      </div>

      {/* Category Selection Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {[
          { id: 'all', label: '🏥 All Hospitals' },
          { id: 'district', label: '🏛️ District Civil Hospitals' },
          { id: 'super', label: '⚡ Super Speciality & Medical Colleges' },
          { id: 'maternity', label: '👶 Maternity & Child Hospitals' },
          { id: 'trauma', label: '🚑 Level-1 Trauma Centers' },
          { id: 'phc', label: '🩺 PHC / CHCs' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0F6E56] text-white border-[#0F6E56] shadow-xs'
                : 'bg-white text-[#2C2418] border-[#E5DCC8] hover:border-[#0F6E56]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Emergency Filter Bar */}
      <div className="bg-white border border-[#E5DCC8] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#6B6355] absolute left-3 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by hospital name, specialty (e.g. Cardiology, Trauma, ICU, Maternity)..."
            className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#2C2418] font-medium focus:outline-none focus:border-[#0F6E56]"
          />
        </div>

        <button
          onClick={() => setEmergencyOnly(!emergencyOnly)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            emergencyOnly
              ? 'bg-[#A32D2D] text-white shadow-xs'
              : 'bg-[#FAF6EE] border border-[#E5DCC8] text-[#2C2418] hover:border-[#A32D2D]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>24/7 Emergency & ICU Only</span>
        </button>
      </div>

      {/* Main Grid: Hospital Cards + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Hospital Cards List */}
        <div className="lg:col-span-6 space-y-4 max-h-[680px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-[#6B6355] px-1 flex items-center justify-between">
            <span>Showing {facilities.length} Hospitals (Within 100 km Radius)</span>
            <span>{userCoords ? "Closest to Furthest" : "Sorted by Proximity"}</span>
          </div>

          {facilities.length === 0 ? (
            <div className="bg-white border border-[#E5DCC8] rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#2C2418]">No hospitals match your search criteria within this range.</p>
              <p className="text-xs text-[#6B6355]">Try clearing search keywords or selecting &quot;All Hospitals&quot;.</p>
            </div>
          ) : (
            facilities.map((f) => {
              const isSelected = activeSelected?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFacility(f)}
                  className={`bg-white border rounded-2xl p-5 space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#0F6E56] shadow-md bg-[#FAF6EE]/50'
                      : 'border-[#E5DCC8] hover:border-[#0F6E56]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase bg-[#0F6E56]/10 text-[#0F6E56] px-2 py-0.5 rounded">
                          {f.type}
                        </span>
                        {f.category && (
                          <span className="text-[10px] font-bold bg-[#FAF6EE] text-[#6B6355] border border-[#E5DCC8] px-2 py-0.5 rounded">
                            {f.category}
                          </span>
                        )}
                        <span className="text-xs font-bold text-[#6B6355]">{f.district}, {f.state}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#2C2418] leading-tight">{f.name}</h3>
                    </div>

                    <span className="text-xs font-extrabold text-[#D85A30] bg-[#D85A30]/10 px-2.5 py-1 rounded-lg shrink-0">
                      📍 {f.distance_km < 1 ? `${(f.distance_km * 1000).toFixed(0)}m` : `${f.distance_km} km`}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6355]">{f.address}</p>

                  {/* Specialties Pills */}
                  {f.specialties && f.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px] font-semibold text-[#0F6E56]">
                      {f.specialties.map((s, idx) => (
                        <span key={idx} className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold pt-1 border-t border-[#E5DCC8]/60">
                    <span className={`px-2 py-0.5 rounded ${f.emergency_24x7 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-gray-100 text-gray-700'}`}>
                      {f.emergency_24x7 ? '✓ 24/7 Emergency Active' : 'Day OPD'}
                    </span>
                    {f.icu_beds !== undefined && f.icu_beds > 0 && (
                      <span className="bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-rose-600" />
                        {f.icu_beds} ICU Beds
                      </span>
                    )}
                    <span className="bg-[#FAF6EE] text-[#2C2418] border border-[#E5DCC8] px-2 py-0.5 rounded flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-[#0F6E56]" />
                      {f.doctors_on_duty} Doctors On Duty
                    </span>
                    {f.ambulance_available && (
                      <span className="bg-[#FAF6EE] text-[#2C2418] border border-[#E5DCC8] px-2 py-0.5 rounded flex items-center gap-1">
                        <Ambulance className="w-3 h-3 text-[#D85A30]" />
                        Ambulance Ready
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={`tel:${f.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-[#2C2418] hover:text-[#0F6E56] flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0F6E56]" /> Call Hospital ({f.phone})
                    </a>

                    <Link
                      href={`/facility/${f.id}`}
                      className="text-xs font-bold text-[#D85A30] hover:underline flex items-center gap-1"
                    >
                      <span>Full Hospital Profile & Directions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Interactive 3D Map */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="bg-white border border-[#E5DCC8] rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-[#2C2418] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0F6E56]" />
                {userCoords ? "GPS Synced 100km Hospital Map" : "3D OpenStreetMap Hospital Locator"}
              </span>
              {activeSelected && (
                <span className="text-[11px] font-bold text-[#0F6E56] truncate max-w-[200px]">
                  Selected: {activeSelected.name}
                </span>
              )}
            </div>

            <div className="h-[500px]">
              <FacilityMap
                facilities={facilities}
                selectedFacilityId={activeSelected?.id}
                userCoords={userCoords}
                onSelectFacility={handleSelectFacility}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
