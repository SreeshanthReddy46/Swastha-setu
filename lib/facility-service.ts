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
  return phcSeedData as HealthFacility[];
}

export function getFacilityById(id: string): HealthFacility | undefined {
  const facilities = getAllFacilities();
  return facilities.find((f) => f.id === id);
}

export function searchFacilities(
  query: string = '',
  emergencyOnly: boolean = false,
  userLat?: number,
  userLng?: number
): HealthFacility[] {
  let list = getAllFacilities();

  // If user coordinates provided, calculate dynamic Haversine distance
  if (userLat !== undefined && userLng !== undefined) {
    list = list.map((f) => {
      const dist = calculateHaversineDistance(userLat, userLng, f.latitude, f.longitude);
      return {
        ...f,
        distance_km: dist
      };
    });

    // Sort ascending by distance (closest hospital first)
    list.sort((a, b) => a.distance_km - b.distance_km);
  }

  if (emergencyOnly) {
    list = list.filter((f) => f.emergency_24x7);
  }

  if (query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.state.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        (f.specialties && f.specialties.some(s => s.toLowerCase().includes(q)))
    );
  }

  return list;
}
