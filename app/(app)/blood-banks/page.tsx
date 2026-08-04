'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Droplet, 
  MapPin, 
  Phone, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Navigation,
  RefreshCw,
  LocateFixed,
  ShieldAlert,
  HeartPulse,
  Activity,
  Users,
  UserCheck
} from 'lucide-react';
import { searchBloodBanks, BloodBank } from '@/lib/blood-bank-service';
import { useLanguage } from '@/lib/language-context';

// Dynamically import Leaflet map
const FacilityMap = dynamic(() => import('../components/FacilityMap.client'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-[#FAF6EE] border border-[#E5DCC8] rounded-2xl flex items-center justify-center text-xs font-bold text-[#6B6355]">Loading Interactive Blood Bank Map...</div>
});

export default function BloodBankPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [selectedBloodBank, setSelectedBloodBank] = useState<BloodBank | null>(null);

  // Location States
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchBloodBanks = (coords?: { lat: number; lng: number } | null) => {
    const activeLat = coords ? coords.lat : (userCoords ? userCoords.lat : undefined);
    const activeLng = coords ? coords.lng : (userCoords ? userCoords.lng : undefined);
    const list = searchBloodBanks(query, selectedBloodGroup, activeLat, activeLng);
    setBloodBanks(list);
    if (list.length > 0) {
      setSelectedBloodBank(list[0]);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, [query, selectedBloodGroup, userCoords]);

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
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setIsLocating(false);
        fetchBloodBanks(coords);
      },
      (err) => {
        setIsLocating(false);
        setLocationError("Location permission denied or unavailable. Showing nearby district blood banks.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Convert BloodBank[] to HealthFacility[] shape for Leaflet map compatibility
  const mapFacilities = bloodBanks.map((bb) => ({
    id: bb.id,
    name: bb.name,
    type: bb.type,
    district: bb.district,
    state: bb.state,
    address: bb.address,
    latitude: bb.latitude,
    longitude: bb.longitude,
    phone: bb.phone,
    emergency_24x7: bb.emergency_24x7,
    doctors_on_duty: bb.staff_count,
    beds_available: 50,
    ambulance_available: true,
    operating_hours: bb.operating_hours,
    distance_km: bb.distance_km
  }));

  const getStockBadgeColor = (count: number) => {
    if (count >= 15) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (count > 0) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5DCC8] pb-4">
        <div>
          <span className="text-xs font-extrabold text-[#A32D2D] uppercase tracking-wider block mb-1">
            Indian Red Cross & Model Blood Bank Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C2418] flex items-center gap-2">
            <Droplet className="w-8 h-8 text-[#A32D2D] fill-[#A32D2D]" />
            Emergency Blood Bank Finder
          </h1>
          <p className="text-xs text-[#6B6355]">
            Check live blood group availability, component stock (Platelets & Plasma), staff count, and get direct 24/7 issue contact numbers.
          </p>
        </div>

        <button
          onClick={handleDetectLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 bg-[#A32D2D] hover:bg-rose-800 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
        >
          {isLocating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4 text-rose-200" />
          )}
          <span>{isLocating ? "Acquiring GPS Signal..." : "📍 Detect My Location for Blood Banks"}</span>
        </button>
      </div>

      {/* Live GPS Status Banner */}
      {userCoords && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-bold text-rose-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
            <span>
              GPS Location Active ({userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E) — Showing Blood Banks Sorted by Direct Proximity
            </span>
          </div>
          <button
            onClick={() => setUserCoords(null)}
            className="text-[11px] font-semibold text-[#A32D2D] hover:underline"
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

      {/* Blood Group Filter Pills */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-[#6B6355] uppercase tracking-wider">Filter by Required Blood Group / Component:</span>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {[
            { id: 'all', label: '🩸 All Blood Groups' },
            { id: 'O_POS', label: 'O+ Positive' },
            { id: 'O_NEG', label: 'O- Universal' },
            { id: 'A_POS', label: 'A+ Positive' },
            { id: 'A_NEG', label: 'A- Negative' },
            { id: 'B_POS', label: 'B+ Positive' },
            { id: 'B_NEG', label: 'B- Negative' },
            { id: 'AB_POS', label: 'AB+ Positive' },
            { id: 'AB_NEG', label: 'AB- Negative' },
            { id: 'PLATELETS', label: '⚡ Platelets (SDP/RDP)' },
            { id: 'FFP', label: '💧 FFP (Plasma)' },
          ].map((bg) => (
            <button
              key={bg.id}
              onClick={() => setSelectedBloodGroup(bg.id)}
              className={`px-3.5 py-2 rounded-xl border shrink-0 transition-all cursor-pointer ${
                selectedBloodGroup === bg.id
                  ? 'bg-[#A32D2D] text-white border-[#A32D2D] shadow-xs'
                  : 'bg-white text-[#2C2418] border-[#E5DCC8] hover:border-[#A32D2D]'
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#E5DCC8] rounded-2xl p-4 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#6B6355] absolute left-3 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by blood bank name, medical officer in charge, district, or town..."
            className="w-full bg-[#FAF6EE] border border-[#E5DCC8] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#2C2418] font-medium focus:outline-none focus:border-[#A32D2D]"
          />
        </div>
      </div>

      {/* Main Grid: Blood Bank Cards + Interactive 3D Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Blood Bank Cards */}
        <div className="lg:col-span-6 space-y-4 max-h-[680px] overflow-y-auto pr-1">
          <div className="text-xs font-bold text-[#6B6355] px-1 flex items-center justify-between">
            <span>Showing {bloodBanks.length} Active Blood Banks</span>
            <span>{userCoords ? "Sorted by GPS Proximity" : "Sorted by Proximity"}</span>
          </div>

          {bloodBanks.length === 0 ? (
            <div className="bg-white border border-[#E5DCC8] rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#2C2418]">No blood banks match your selected criteria.</p>
              <p className="text-xs text-[#6B6355]">Try selecting "All Blood Groups" or clearing search keywords.</p>
            </div>
          ) : (
            bloodBanks.map((bb) => {
              const isSelected = selectedBloodBank?.id === bb.id;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bb.name + ' ' + bb.address)}`;

              return (
                <div
                  key={bb.id}
                  onClick={() => setSelectedBloodBank(bb)}
                  className={`bg-white border rounded-2xl p-5 space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#A32D2D] shadow-md bg-rose-50/40'
                      : 'border-[#E5DCC8] hover:border-[#A32D2D]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-[#A32D2D] px-2 py-0.5 rounded">
                          {bb.type}
                        </span>
                        <span className="text-xs font-bold text-[#6B6355]">{bb.district}, {bb.state}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#2C2418] leading-tight">{bb.name}</h3>
                    </div>

                    <span className="text-xs font-extrabold text-[#A32D2D] bg-rose-100 px-2.5 py-1 rounded-lg shrink-0">
                      📍 {bb.distance_km} km away
                    </span>
                  </div>

                  <p className="text-xs text-[#6B6355]">{bb.address}</p>

                  {/* Staff & Medical Officer Badge Bar */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#2C2418]">
                    <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      {bb.staff_count} Staff & Technicians On Duty
                    </span>
                    {bb.medical_officer_in_charge && (
                      <span className="bg-[#FAF6EE] text-[#2C2418] border border-[#E5DCC8] px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#0F6E56]" />
                        {bb.medical_officer_in_charge}
                      </span>
                    )}
                  </div>

                  {/* Stock Availability Matrix Grid with Color Badges */}
                  <div className="bg-[#FAF6EE] border border-[#E5DCC8] p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#2C2418] uppercase tracking-wider">Live Blood Group Availability (Units):</span>
                      <span className="text-[10px] text-[#6B6355]">🟢 In Stock (15+) · 🟡 Reserve (1-14)</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center text-[10px] font-extrabold">
                      {[
                        { label: 'O+', val: bb.blood_availability.O_POS },
                        { label: 'O-', val: bb.blood_availability.O_NEG },
                        { label: 'A+', val: bb.blood_availability.A_POS },
                        { label: 'A-', val: bb.blood_availability.A_NEG },
                        { label: 'B+', val: bb.blood_availability.B_POS },
                        { label: 'B-', val: bb.blood_availability.B_NEG },
                        { label: 'AB+', val: bb.blood_availability.AB_POS },
                        { label: 'AB-', val: bb.blood_availability.AB_NEG },
                        { label: 'PLT', val: bb.blood_availability.PLATELETS },
                        { label: 'FFP', val: bb.blood_availability.FFP },
                      ].map((item, idx) => (
                        <div key={idx} className={`p-1 rounded border ${getStockBadgeColor(item.val)}`}>
                          <span className="block text-[9px]">{item.label}</span>
                          <span className="text-[11px]">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5DCC8]/60">
                    <a
                      href={`tel:${bb.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-[#A32D2D] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#A32D2D]" /> Call Blood Bank ({bb.phone})
                    </a>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-[#0F6E56] hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Google Maps Directions →
                    </a>
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
                <MapPin className="w-4 h-4 text-[#A32D2D]" />
                {userCoords ? "GPS Synced Blood Bank Map" : "3D OpenStreetMap Blood Bank Locator"}
              </span>
              {selectedBloodBank && (
                <span className="text-[11px] font-bold text-[#A32D2D] truncate max-w-[200px]">
                  Selected: {selectedBloodBank.name}
                </span>
              )}
            </div>

            <div className="h-[500px]">
              <FacilityMap
                facilities={mapFacilities}
                selectedFacilityId={selectedBloodBank?.id}
                userCoords={userCoords}
                onSelectFacility={(f) => {
                  const found = bloodBanks.find((bb) => bb.id === f.id);
                  if (found) setSelectedBloodBank(found);
                }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
