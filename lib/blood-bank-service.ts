import bloodBankSeedData from '@/data/blood-bank-seed.json';
import { calculateHaversineDistance } from './facility-service';

export interface BloodAvailability {
  O_POS: number;
  O_NEG: number;
  A_POS: number;
  A_NEG: number;
  B_POS: number;
  B_NEG: number;
  AB_POS: number;
  AB_NEG: number;
  PLATELETS: number;
  FFP: number;
}

export interface BloodBank {
  id: string;
  name: string;
  type: string;
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_24x7: boolean;
  staff_count: number;
  medical_officer_in_charge: string;
  blood_availability: BloodAvailability;
  operating_hours: string;
  distance_km: number;
}

interface IndexedBloodBank extends BloodBank {
  _searchIndex: string;
}

const allBloodBanks: BloodBank[] = bloodBankSeedData as BloodBank[];

// Pre-index by ID and build search strings
const bloodBankMap = new Map<string, BloodBank>();
const indexedBloodBanks: IndexedBloodBank[] = allBloodBanks.map((bb) => {
  bloodBankMap.set(bb.id, bb);
  const searchIndex = [
    bb.name,
    bb.district,
    bb.state,
    bb.type,
    bb.medical_officer_in_charge || '',
  ].join(' ').toLowerCase();

  return {
    ...bb,
    _searchIndex: searchIndex,
  };
});

// Cache for search results under heavy traffic
const bloodBankQueryCache = new Map<string, BloodBank[]>();
const MAX_BB_CACHE_SIZE = 150;

function getBBCacheKey(query: string, bloodGroupFilter: string, userLat?: number, userLng?: number): string {
  const latKey = userLat !== undefined ? Math.round(userLat * 100) : 'none';
  const lngKey = userLng !== undefined ? Math.round(userLng * 100) : 'none';
  return `${query.trim().toLowerCase()}|${bloodGroupFilter}|${latKey}|${lngKey}`;
}

export function getAllBloodBanks(): BloodBank[] {
  return allBloodBanks;
}

export function getBloodBankById(id: string): BloodBank | undefined {
  return bloodBankMap.get(id);
}

export function searchBloodBanks(
  query: string = '',
  bloodGroupFilter: string = 'all',
  userLat?: number,
  userLng?: number
): BloodBank[] {
  const cacheKey = getBBCacheKey(query, bloodGroupFilter, userLat, userLng);
  const cached = bloodBankQueryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let list: BloodBank[] = indexedBloodBanks;

  // Filter by Blood Group Stock
  if (bloodGroupFilter !== 'all') {
    const key = bloodGroupFilter.toUpperCase() as keyof BloodAvailability;
    list = list.filter((bb) => (bb.blood_availability[key] || 0) > 0);
  }

  // Filter by query string
  const q = query.trim().toLowerCase();
  if (q !== '') {
    list = list.filter((bb) => (bb as IndexedBloodBank)._searchIndex.includes(q));
  }

  // Recalculate dynamic GPS Haversine distance if coordinates supplied
  if (userLat !== undefined && userLng !== undefined) {
    list = list.map((bb) => {
      const dist = calculateHaversineDistance(userLat, userLng, bb.latitude, bb.longitude);
      return {
        ...bb,
        distance_km: dist,
      };
    });

    list.sort((a, b) => a.distance_km - b.distance_km);
  }

  // Cache result
  if (bloodBankQueryCache.size >= MAX_BB_CACHE_SIZE) {
    const firstKey = bloodBankQueryCache.keys().next().value;
    if (firstKey) bloodBankQueryCache.delete(firstKey);
  }
  bloodBankQueryCache.set(cacheKey, list);

  return list;
}
