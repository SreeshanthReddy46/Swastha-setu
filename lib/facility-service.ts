import phcSeedData from '@/data/phc-seed.json';

export interface HealthFacility {
  id: string;
  name: string;
  type: string;
  category?: string;
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

const allFacilities: HealthFacility[] = phcSeedData as HealthFacility[];

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
 * Get nearest hospitals to user location within a 100km radius, sorted from closest to furthest.
 * If severity is EMERGENCY or HIGH, prioritizes critical care capability (ICU beds, 24/7 emergency).
 */
export function getNearestFacilities(
  userLat?: number,
  userLng?: number,
  severity: string = 'ROUTINE',
  limit: number = 3,
  maxRadiusKm: number = 100
): HealthFacility[] {
  let list: HealthFacility[] = allFacilities;

  if (userLat !== undefined && userLng !== undefined) {
    list = list.map((f) => ({
      ...f,
      distance_km: calculateHaversineDistance(userLat, userLng, f.latitude, f.longitude),
    }));
  }

  // Filter within radius (100 km)
  let inRadius = list.filter((f) => f.distance_km <= maxRadiusKm);
  
  // If no facility is strictly within 100km, fallback to all sorted by distance
  if (inRadius.length === 0) {
    inRadius = list;
  }

  // If EMERGENCY or HIGH, prioritize facilities with 24x7 emergency and ICU beds
  if (severity === 'EMERGENCY' || severity === 'HIGH') {
    inRadius.sort((a, b) => {
      // Prioritize 24x7 emergency first
      if (a.emergency_24x7 && !b.emergency_24x7) return -1;
      if (!a.emergency_24x7 && b.emergency_24x7) return 1;

      // Then sort strictly by distance ascending (closest first)
      return a.distance_km - b.distance_km;
    });
  } else {
    // Routine or Moderate: sort strictly by distance ascending
    inRadius.sort((a, b) => a.distance_km - b.distance_km);
  }

  return inRadius.slice(0, limit);
}

export function searchFacilities(
  query: string = '',
  emergencyOnly: boolean = false,
  userLat?: number,
  userLng?: number,
  maxRadiusKm: number = 100
): HealthFacility[] {
  const cacheKey = getCacheKey(query, emergencyOnly, userLat, userLng, maxRadiusKm);
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
  if (userLat !== undefined && userLng !== undefined) {
    list = list.map((f) => {
      const dist = calculateHaversineDistance(userLat, userLng, f.latitude, f.longitude);
      return {
        ...f,
        distance_km: dist,
      };
    });

    // Filter within 100km radius if query is empty, or keep relevant search results
    if (q === '') {
      const withinRadius = list.filter((f) => f.distance_km <= maxRadiusKm);
      if (withinRadius.length > 0) {
        list = withinRadius;
      }
    }

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
