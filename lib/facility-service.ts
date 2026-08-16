import phcSeedData from '@/data/phc-seed.json';
import { detectLocationFromText } from './location-service';

export interface HealthFacility {
  id: string;
  name: string;
  type: string;
  category?: string;
  ownership?: 'government' | 'private';
  source?: 'seeded_phc' | 'osm';
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_24x7: boolean;
  icu_beds?: number;
  doctors_on_duty: number;
  beds_available?: number;
  ambulance_available: boolean;
  specialties?: string[];
  medicines_in_stock?: string[];
  operating_hours?: string;
  distance_km: number;
}

// Pre-computed searchable facility structure for ultra-fast matching
interface IndexedFacility extends HealthFacility {
  _searchIndex: string;
}

const rawFacilities = phcSeedData as HealthFacility[];
const allFacilities: HealthFacility[] = rawFacilities.map((f) => ({
  ...f,
  ownership: f.ownership || 'government',
  source: f.source || 'seeded_phc',
}));

// Pre-index by ID for O(1) lookup
const facilityMap = new Map<string, HealthFacility>();
const indexedFacilities: IndexedFacility[] = allFacilities.map((f) => {
  facilityMap.set(f.id, f);
  const searchIndex = [
    f.name,
    f.district,
    f.state,
    f.type,
    f.category || '',
    f.ownership || 'government',
    ...(f.specialties || []),
  ].join(' ').toLowerCase();

  return {
    ...f,
    _searchIndex: searchIndex,
  };
});

// In-memory query cache for high-concurrency heavy loads (max 200 cached queries)
const queryCache = new Map<string, HealthFacility[]>();
const MAX_CACHE_SIZE = 200;

function getCacheKey(query: string, emergencyOnly: boolean, userLat?: number, userLng?: number, maxRadius?: number): string {
  const latKey = userLat !== undefined ? Math.round(userLat * 100) : 'none';
  const lngKey = userLng !== undefined ? Math.round(userLng * 100) : 'none';
  return `${query.trim().toLowerCase()}|${emergencyOnly}|${latKey}|${lngKey}|${maxRadius || 100}`;
}

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

export function getAllFacilities(): HealthFacility[] {
  return allFacilities;
}

export function getFacilityById(id: string): HealthFacility | undefined {
  return facilityMap.get(id);
}

/**
 * Get nearest hospitals strictly sorted by closest proximity to user location.
 * If user coordinates are not provided, checks if city/location was mentioned in context text.
 */
export function getNearestFacilities(
  userLat?: number,
  userLng?: number,
  severity: string = 'ROUTINE',
  limit: number = 3,
  maxRadiusKm: number = 100,
  contextText?: string
): HealthFacility[] {
  let effectiveLat = userLat;
  let effectiveLng = userLng;

  // If no GPS coordinates provided, attempt to detect spoken/written location from user symptoms/transcription
  if ((effectiveLat === undefined || effectiveLng === undefined) && contextText) {
    const detected = detectLocationFromText(contextText);
    if (detected) {
      effectiveLat = detected.latitude;
      effectiveLng = detected.longitude;
    }
  }

  let list: HealthFacility[] = allFacilities;

  if (effectiveLat !== undefined && effectiveLng !== undefined) {
    list = list.map((f) => ({
      ...f,
      distance_km: calculateHaversineDistance(effectiveLat!, effectiveLng!, f.latitude, f.longitude),
    }));

    // Sort strictly by distance first
    list.sort((a, b) => a.distance_km - b.distance_km);

    // If emergency/high, check the closest cluster (within 35km or within 1.5x of the closest distance)
    // to prioritize 24x7 emergency & ICU care locally without sending patients to a faraway state
    if (severity === 'EMERGENCY' || severity === 'HIGH') {
      const closestDist = list[0]?.distance_km ?? 0;
      const localClusterRadius = Math.max(25, closestDist * 1.5);
      
      const localCluster = list.filter((f) => f.distance_km <= localClusterRadius);
      const distantCluster = list.filter((f) => f.distance_km > localClusterRadius);

      localCluster.sort((a, b) => {
        // In local cluster, prefer 24/7 emergency care first
        if (a.emergency_24x7 && !b.emergency_24x7) return -1;
        if (!a.emergency_24x7 && b.emergency_24x7) return 1;
        // Then by distance
        return a.distance_km - b.distance_km;
      });

      list = [...localCluster, ...distantCluster];
    }
  }

  return list.slice(0, limit);
}

export function searchFacilities(
  query: string = '',
  emergencyOnly: boolean = false,
  userLat?: number,
  userLng?: number,
  maxRadiusKm: number = 100
): HealthFacility[] {
  let effectiveLat = userLat;
  let effectiveLng = userLng;

  if ((effectiveLat === undefined || effectiveLng === undefined) && query) {
    const detected = detectLocationFromText(query);
    if (detected) {
      effectiveLat = detected.latitude;
      effectiveLng = detected.longitude;
    }
  }

  const cacheKey = getCacheKey(query, emergencyOnly, effectiveLat, effectiveLng, maxRadiusKm);
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let list: HealthFacility[] = indexedFacilities;

  if (emergencyOnly) {
    list = list.filter((f) => f.emergency_24x7);
  }

  const q = query.trim().toLowerCase();
  if (q !== '') {
    list = list.filter((f) => (f as IndexedFacility)._searchIndex.includes(q));
  }

  // If user coordinates provided, calculate dynamic Haversine distance
  if (effectiveLat !== undefined && effectiveLng !== undefined) {
    list = list.map((f) => {
      const dist = calculateHaversineDistance(effectiveLat!, effectiveLng!, f.latitude, f.longitude);
      return {
        ...f,
        distance_km: dist,
      };
    });

    // Sort ascending by distance (closest hospital first)
    list.sort((a, b) => a.distance_km - b.distance_km);
  }

  // Store in cache (LRU-like eviction)
  if (queryCache.size >= MAX_CACHE_SIZE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  queryCache.set(cacheKey, list);

  return list;
}
