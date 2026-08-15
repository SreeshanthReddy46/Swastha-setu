'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HealthFacility } from '@/lib/facility-service';
import { Box, Compass } from 'lucide-react';

interface FacilityMapProps {
  facilities: HealthFacility[];
  selectedFacilityId?: string;
  userCoords?: { lat: number; lng: number } | null;
  onSelectFacility?: (facility: HealthFacility) => void;
}

export default function FacilityMap({ facilities, selectedFacilityId, userCoords, onSelectFacility }: FacilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectFacility);
  
  useEffect(() => {
    onSelectRef.current = onSelectFacility;
  }, [onSelectFacility]);

  const [is3DMode, setIs3DMode] = useState(true);

  // Initialize Map once and cleanup on unmount
  useEffect(() => {
    if (!mapRef.current) return;

    const initialLat = userCoords ? userCoords.lat : (facilities[0]?.latitude || 13.2172);
    const initialLng = userCoords ? userCoords.lng : (facilities[0]?.longitude || 79.1003);

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([initialLat, initialLng], userCoords ? 12 : 10);
    
    // Enable Retina detection for crystal-clear high-DPI rendering on mobile & 4K screens
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      markersGroup.clearLayers();
      map.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center position when coords or selected facility change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 12, { animate: true });
    } else if (selectedFacilityId) {
      const sel = facilities.find(f => f.id === selectedFacilityId);
      if (sel) {
        map.setView([sel.latitude, sel.longitude], 13, { animate: true });
      }
    }
  }, [userCoords, selectedFacilityId, facilities]);

  // Update Markers efficiently using markers layer group
  useEffect(() => {
    const markersGroup = markersGroupRef.current;
    const map = mapInstanceRef.current;
    if (!markersGroup || !map) return;

    markersGroup.clearLayers();

    // Render GPS Radius Circle if user position available
    if (userCoords) {
      L.circle([userCoords.lat, userCoords.lng], {
        color: '#7C3AED',
        fillColor: '#7C3AED',
        fillOpacity: 0.1,
        radius: 10000 // 10km live circle
      }).addTo(markersGroup);

      const userDivIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div class="leaflet-3d-user-badge">📍 YOU ARE HERE</div>`,
        iconSize: [110, 30],
        iconAnchor: [55, 15]
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userDivIcon }).addTo(markersGroup);
      userMarker.bindPopup(`
        <div style="font-family: system-ui; text-align: center; padding: 4px;">
          <h4 style="margin: 0; font-size: 13px; font-weight: bold; color: #7C3AED;">📍 Your Live GPS Location</h4>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #6B6355;">Coordinates: ${userCoords.lat.toFixed(4)}°, ${userCoords.lng.toFixed(4)}°</p>
        </div>
      `);
    }

    // Render Hospital Markers with 3D Distance Badges
    facilities.forEach((f) => {
      const isSelected = f.id === selectedFacilityId;

      const badgeHtml = `
        <div class="leaflet-3d-marker-badge ${isSelected ? 'selected' : ''}">
          🏥 ${f.type}: ${f.distance_km} km
        </div>
      `;

      const facilityDivIcon = L.divIcon({
        className: 'custom-phc-pin',
        html: badgeHtml,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });

      const marker = L.marker([f.latitude, f.longitude], { icon: facilityDivIcon }).addTo(markersGroup);

      marker.bindPopup(`
        <div style="font-family: system-ui; max-width: 220px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #2C2418;">${f.name}</h4>
          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6B6355;">${f.type} · ${f.district}</p>
          <div style="background: #FAF6EE; padding: 6px; border-radius: 8px; margin-bottom: 6px; border: 1px solid #E5DCC8;">
            <p style="margin: 0; font-size: 12px; color: #D85A30; font-weight: 800;">📍 Distance: ${f.distance_km} km</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #0F6E56; font-weight: bold;">${f.emergency_24x7 ? '✓ 24/7 Emergency Active' : 'Day OPD Service'}</p>
          </div>
          <a href="/facility/${f.id}" style="display: inline-block; font-size: 11px; font-weight: bold; color: #D85A30; text-decoration: none;">Full Profile & Directions →</a>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectRef.current) {
          onSelectRef.current(f);
        }
      });
    });

  }, [facilities, selectedFacilityId, userCoords]);

  return (
    <div className="relative w-full h-full min-h-[440px] map-3d-wrapper">
      
      {/* 3D / 2D Perspective Control Floating Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#E5DCC8] p-1.5 rounded-2xl shadow-lg">
        <button
          onClick={() => setIs3DMode(!is3DMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            is3DMode
              ? 'bg-[#0F6E56] text-white shadow-xs'
              : 'bg-[#FAF6EE] text-[#2C2418] hover:bg-[#E5DCC8]/40'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>{is3DMode ? '🌐 3D Tilt View' : '🗺️ 2D Flat View'}</span>
        </button>
      </div>

      {/* Accuracy Legend Bar */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-[#E5DCC8] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#2C2418] shadow-md flex items-center gap-2">
        <Compass className="w-3.5 h-3.5 text-[#0F6E56]" />
        <span>100km GPS Distance Engine</span>
      </div>

      {/* Map Element Container */}
      <div className={`w-full h-full ${is3DMode ? 'map-3d-container' : 'map-2d-container'}`}>
        <div ref={mapRef} className="w-full h-full min-h-[440px]" />
      </div>
    </div>
  );
}
