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

export function getAllBloodBanks(): BloodBank[] {
  return bloodBankSeedData as BloodBank[];
}

export function searchBloodBanks(
  query: string = '',
  bloodGroupFilter: string = 'all',
  userLat?: number,
  userLng?: number
): BloodBank[] {
  let list = getAllBloodBanks();

  // Recalculate dynamic GPS Haversine distance if coordinates supplied
  if (userLat !== undefined && userLng !== undefined) {
    list = list.map((bb) => {
      const dist = calculateHaversineDistance(userLat, userLng, bb.latitude, bb.longitude);
      return {
        ...bb,
        distance_km: dist
      };
    });

    list.sort((a, b) => a.distance_km - b.distance_km);
  }

  // Filter by Blood Group Stock
  if (bloodGroupFilter !== 'all') {
    list = list.filter((bb) => {
      const key = bloodGroupFilter.toUpperCase() as keyof BloodAvailability;
      return (bb.blood_availability[key] || 0) > 0;
    });
  }

  // Filter by query string
  if (query.trim() !== '') {
    const q = query.toLowerCase();
    list = list.filter(
      (bb) =>
        bb.name.toLowerCase().includes(q) ||
        bb.district.toLowerCase().includes(q) ||
        bb.state.toLowerCase().includes(q) ||
        bb.type.toLowerCase().includes(q) ||
        (bb.medical_officer_in_charge && bb.medical_officer_in_charge.toLowerCase().includes(q))
    );
  }

  return list;
}
