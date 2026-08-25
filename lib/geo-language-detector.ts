import { Language } from './language-context';

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  language: Language;
  source: 'gps' | 'ip' | 'browser' | 'default';
}

const INDIAN_STATE_CENTROIDS: { state: string; city: string; lat: number; lng: number; lang: Language }[] = [
  // Telangana & Andhra Pradesh
  { state: 'Telangana', city: 'Hyderabad', lat: 17.3850, lng: 78.4867, lang: 'te' },
  { state: 'Andhra Pradesh', city: 'Vijayawada', lat: 16.5062, lng: 80.6480, lang: 'te' },
  { state: 'Andhra Pradesh', city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, lang: 'te' },
  { state: 'Andhra Pradesh', city: 'Tirupati', lat: 13.6288, lng: 79.4192, lang: 'te' },
  { state: 'Andhra Pradesh', city: 'Chittoor', lat: 13.2172, lng: 79.1003, lang: 'te' },
  
  // Maharashtra
  { state: 'Maharashtra', city: 'Mumbai', lat: 19.0760, lng: 72.8777, lang: 'mr' },
  { state: 'Maharashtra', city: 'Pune', lat: 18.5204, lng: 73.8567, lang: 'mr' },
  { state: 'Maharashtra', city: 'Nagpur', lat: 21.1458, lng: 79.0882, lang: 'mr' },

  // Tamil Nadu
  { state: 'Tamil Nadu', city: 'Chennai', lat: 13.0827, lng: 80.2707, lang: 'ta' },
  { state: 'Tamil Nadu', city: 'Coimbatore', lat: 11.0168, lng: 76.9558, lang: 'ta' },
  { state: 'Tamil Nadu', city: 'Madurai', lat: 9.9252, lng: 78.1198, lang: 'ta' },

  // Karnataka
  { state: 'Karnataka', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, lang: 'kn' },
  { state: 'Karnataka', city: 'Mysuru', lat: 12.2958, lng: 76.6394, lang: 'kn' },
  { state: 'Karnataka', city: 'Mangaluru', lat: 12.9141, lng: 74.8560, lang: 'kn' },

  // West Bengal
  { state: 'West Bengal', city: 'Kolkata', lat: 22.5726, lng: 88.3639, lang: 'bn' },
  { state: 'West Bengal', city: 'Siliguri', lat: 26.7271, lng: 88.3953, lang: 'bn' },

  // Gujarat
  { state: 'Gujarat', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, lang: 'gu' },
  { state: 'Gujarat', city: 'Surat', lat: 21.1702, lng: 72.8311, lang: 'gu' },

  // Odisha
  { state: 'Odisha', city: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, lang: 'or' },
  { state: 'Odisha', city: 'Cuttack', lat: 20.4625, lng: 85.8830, lang: 'or' },

  // Hindi Belt (Delhi NCR, UP, MP, Bihar, Rajasthan, etc.)
  { state: 'Delhi', city: 'New Delhi', lat: 28.6139, lng: 77.2090, lang: 'hi' },
  { state: 'Uttar Pradesh', city: 'Lucknow', lat: 26.8467, lng: 80.9462, lang: 'hi' },
  { state: 'Uttar Pradesh', city: 'Varanasi', lat: 25.3176, lng: 82.9739, lang: 'hi' },
  { state: 'Madhya Pradesh', city: 'Bhopal', lat: 23.2599, lng: 77.4126, lang: 'hi' },
  { state: 'Bihar', city: 'Patna', lat: 25.5941, lng: 85.1376, lang: 'hi' },
  { state: 'Rajasthan', city: 'Jaipur', lat: 26.9124, lng: 75.7873, lang: 'hi' }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearestRegionFromCoords(lat: number, lng: number): { state: string; city: string; lang: Language } {
  let closest = INDIAN_STATE_CENTROIDS[0];
  let minDistance = calculateDistance(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < INDIAN_STATE_CENTROIDS.length; i++) {
    const d = calculateDistance(lat, lng, INDIAN_STATE_CENTROIDS[i].lat, INDIAN_STATE_CENTROIDS[i].lng);
    if (d < minDistance) {
      minDistance = d;
      closest = INDIAN_STATE_CENTROIDS[i];
    }
  }

  return {
    state: closest.state,
    city: closest.city,
    lang: closest.lang
  };
}

export function getLanguageFromBrowserLocale(): Language | null {
  if (typeof window === 'undefined') return null;

  const locales = navigator.languages || [navigator.language];
  for (const locale of locales) {
    const l = (locale || '').toLowerCase();
    if (l.startsWith('te')) return 'te';
    if (l.startsWith('hi')) return 'hi';
    if (l.startsWith('ta')) return 'ta';
    if (l.startsWith('kn')) return 'kn';
    if (l.startsWith('bn')) return 'bn';
    if (l.startsWith('mr')) return 'mr';
    if (l.startsWith('gu')) return 'gu';
    if (l.startsWith('or')) return 'or';
  }
  return null;
}

/**
 * Detects user location and native language in fraction of a second.
 */
export async function detectLocationAndLanguageInstantly(): Promise<UserLocationResult> {
  // 1. Check Session Cache (<1ms)
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem('swastha_user_coords');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.lat && parsed.lng) {
          const region = getNearestRegionFromCoords(parsed.lat, parsed.lng);
          return {
            latitude: parsed.lat,
            longitude: parsed.lng,
            city: parsed.city || region.city,
            state: parsed.state || region.state,
            country: 'India',
            language: parsed.language || region.lang,
            source: 'gps'
          };
        }
      }
    } catch {
      // Ignore
    }
  }

  // 2. Fast Browser Locale Check (<1ms)
  const browserLang = getLanguageFromBrowserLocale();

  // 3. Fast Parallel Fetch of IP Geolocation & GPS
  return new Promise<UserLocationResult>((resolve) => {
    let resolved = false;

    // Fast Timeout Guard (Resolve within 600ms max)
    const fallbackTimeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const defaultLocation: UserLocationResult = {
          latitude: 17.3850,
          longitude: 78.4867,
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          language: browserLang || 'te',
          source: 'default'
        };
        resolve(defaultLocation);
      }
    }, 600);

    // IP Geolocation
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (!resolved && data && data.success) {
          resolved = true;
          clearTimeout(fallbackTimeout);
          const lang = (data.language as Language) || browserLang || 'te';
          const result: UserLocationResult = {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            state: data.region,
            country: data.country || 'India',
            language: lang,
            source: 'ip'
          };
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('swastha_user_coords', JSON.stringify({
              lat: result.latitude,
              lng: result.longitude,
              city: result.city,
              state: result.state,
              language: result.language
            }));
            window.dispatchEvent(new CustomEvent('swastha-location-resolved', { detail: result }));
          }
          resolve(result);
        }
      })
      .catch(() => {
        // Handled by timeout guard
      });

    // High-Accuracy GPS in Background
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const region = getNearestRegionFromCoords(lat, lng);
          const gpsResult: UserLocationResult = {
            latitude: lat,
            longitude: lng,
            city: region.city,
            state: region.state,
            country: 'India',
            language: region.lang,
            source: 'gps'
          };
          sessionStorage.setItem('swastha_user_coords', JSON.stringify({
            lat,
            lng,
            city: region.city,
            state: region.state,
            language: region.lang
          }));
          window.dispatchEvent(new CustomEvent('swastha-location-resolved', { detail: gpsResult }));
          if (!resolved) {
            resolved = true;
            clearTimeout(fallbackTimeout);
            resolve(gpsResult);
          }
        },
        () => {
          // GPS denied / timeout
        },
        { enableHighAccuracy: true, timeout: 2500 }
      );
    }
  });
}
