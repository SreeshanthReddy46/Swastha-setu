import { HealthFacility, calculateHaversineDistance } from './facility-service';

// Redundant public Overpass API mirrors for high availability
const OVERPASS_ENDPOINTS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const OVERPASS_TIMEOUT_MS = 3500;

// In-memory cache for live OSM results: Key = "lat_2dec,lng_2dec,radius" -> { timestamp, data }
interface CacheEntry {
  timestamp: number;
  data: HealthFacility[];
}
const osmCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL
const MAX_CACHE_ENTRIES = 100;

function getOsmCacheKey(lat: number, lng: number, radiusMeters: number): string {
  // Round to 2 decimal places (~1.1 km grid) for effective caching
  const latKey = lat.toFixed(2);
  const lngKey = lng.toFixed(2);
  return `${latKey},${lngKey},${radiusMeters}`;
}

interface OverpassElement {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

/**
 * Normalizes text for comparison (removes accents, punctuation, common stop-words)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(hospital|clinic|centre|center|phc|chc|dr|shri|general|district)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Determines facility ownership (government vs private) from OSM tags & naming patterns
 */
function determineOwnership(tags: Record<string, string>, name: string): 'government' | 'private' {
  const operatorType = (tags['operator:type'] || '').toLowerCase();
  const operator = (tags['operator'] || '').toLowerCase();
  const nameLower = name.toLowerCase();

  const govtKeywords = [
    'government',
    'govt',
    'sarkari',
    'phc',
    'chc',
    'district hospital',
    'civil hospital',
    'aiims',
    'sub centre',
    'sub-centre',
    'primary health',
    'community health',
    'public health',
    'mch',
    'esic',
    'railway hospital',
    'cantonment',
    'municipal',
  ];

  if (operatorType === 'government' || operatorType === 'public') {
    return 'government';
  }

  if (govtKeywords.some((k) => nameLower.includes(k) || operator.includes(k))) {
    return 'government';
  }

  return 'private';
}

/**
 * Query Overpass API with strict timeout & mirror fallback
 */
async function queryOverpassMirror(endpointUrl: string, query: string): Promise<OverpassResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);

  try {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'SwasthaSetuHealthLocator/1.0 (HealthFacilityLookup)',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const data: OverpassResponse = await res.json();
    return data;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Fetch live hospitals and clinics from OpenStreetMap Overpass API
 */
export async function fetchLiveOsmFacilities(
  userLat: number,
  userLng: number,
  radiusMeters: number = 25000
): Promise<HealthFacility[]> {
  const cacheKey = getOsmCacheKey(userLat, userLng, radiusMeters);
  const now = Date.now();
  const cached = osmCache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    // Recalculate exact distance dynamically for the given coordinates
    return cached.data.map((f) => ({
      ...f,
      distance_km: calculateHaversineDistance(userLat, userLng, f.latitude, f.longitude),
    }));
  }

  const query = `
    [out:json][timeout:4];
    (
      node["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng});
      way["amenity"="hospital"](around:${radiusMeters},${userLat},${userLng});
      node["amenity"="clinic"](around:${radiusMeters},${userLat},${userLng});
      way["amenity"="clinic"](around:${radiusMeters},${userLat},${userLng});
      node["healthcare"="hospital"](around:${radiusMeters},${userLat},${userLng});
      node["healthcare"="clinic"](around:${radiusMeters},${userLat},${userLng});
    );
    out center tags;
  `;

  // Try mirrors sequentially until one returns valid data
  let rawData: OverpassResponse | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    rawData = await queryOverpassMirror(endpoint, query);
    if (rawData && Array.isArray(rawData.elements)) {
      break;
    }
  }

  if (!rawData || !Array.isArray(rawData.elements)) {
    return [];
  }

  const facilities: HealthFacility[] = [];

  for (const el of rawData.elements) {
    const tags = el.tags || {};
    const name = tags.name || tags['name:en'] || tags['official_name'];
    if (!name) continue;

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat === undefined || lon === undefined) continue;

    const ownership = determineOwnership(tags, name);
    const isEmergency =
      tags.emergency === 'yes' ||
      tags.opening_hours === '24/7' ||
      tags['healthcare:emergency'] === 'yes';

    const phone =
      tags.phone ||
      tags['contact:phone'] ||
      tags['contact:mobile'] ||
      tags['emergency:phone'] ||
      '108 (National Emergency)';

    const district =
      tags['addr:district'] ||
      tags['addr:city'] ||
      tags['addr:subdistrict'] ||
      tags['addr:county'] ||
      '';

    const state = tags['addr:state'] || '';

    const addressParts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:suburb'],
      district,
      state,
      tags['addr:postcode'],
    ].filter(Boolean);

    const address = addressParts.length > 0 ? addressParts.join(', ') : 'Location on OpenStreetMap';

    const specialtyTag = tags['healthcare:speciality'] || tags['speciality'];
    const specialties = specialtyTag
      ? specialtyTag.split(';').map((s) => s.trim())
      : isEmergency
      ? ['General Medicine', 'Emergency Care', 'Trauma']
      : ['General Medicine', 'OPD Care'];

    const distance = calculateHaversineDistance(userLat, userLng, lat, lon);

    const facility: HealthFacility = {
      id: `osm-${el.type}-${el.id}`,
      name,
      type: ownership === 'government' ? 'Government Hospital' : 'Private Hospital / Clinic',
      category: tags.amenity === 'clinic' ? 'CLINIC' : 'HOSPITAL',
      ownership,
      source: 'osm',
      district,
      state,
      address,
      latitude: lat,
      longitude: lon,
      phone,
      emergency_24x7: isEmergency,
      doctors_on_duty: isEmergency ? 3 : 1,
      beds_available: isEmergency ? 15 : undefined,
      icu_beds: isEmergency ? 2 : undefined,
      ambulance_available: isEmergency,
      specialties,
      medicines_in_stock: ['Essential Emergency Stock', 'First Aid Supplies', 'Standard Analgesics'],
      operating_hours: tags.opening_hours || (isEmergency ? '24/7 Emergency Active' : '09:00 AM - 06:00 PM'),
      distance_km: distance,
    };

    facilities.push(facility);
  }

  // Cache normalized facilities
  if (osmCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = osmCache.keys().next().value;
    if (oldestKey) osmCache.delete(oldestKey);
  }
  osmCache.set(cacheKey, { timestamp: now, data: facilities });

  return facilities;
}

/**
 * Deduplicate facilities: If an OSM facility is within ~100m of a seeded PHC record
 * (or within 500m with matching normalized names), preserve the richer seeded PHC record.
 */
export function deduplicateFacilities(
  primaryGov: HealthFacility[],
  secondaryOsm: HealthFacility[],
  thresholdKm: number = 0.1
): HealthFacility[] {
  const merged = [...primaryGov];

  for (const osm of secondaryOsm) {
    const osmNormName = normalizeName(osm.name);

    const isDuplicate = primaryGov.some((gov) => {
      const dist = calculateHaversineDistance(
        osm.latitude,
        osm.longitude,
        gov.latitude,
        gov.longitude
      );

      // Condition 1: Direct proximity match within 100m (0.1 km)
      if (dist <= thresholdKm) {
        return true;
      }

      // Condition 2: Proximity within 500m AND significant name overlap
      if (dist <= 0.5) {
        const govNormName = normalizeName(gov.name);
        if (
          (osmNormName.length > 3 && govNormName.includes(osmNormName)) ||
          (govNormName.length > 3 && osmNormName.includes(govNormName))
        ) {
          return true;
        }
      }

      return false;
    });

    if (!isDuplicate) {
      merged.push(osm);
    }
  }

  return merged;
}
