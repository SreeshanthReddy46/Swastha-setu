import { NextResponse } from 'next/server';
import { searchFacilities, getFacilityById } from '@/lib/facility-service';
import { fetchLiveOsmFacilities, deduplicateFacilities } from '@/lib/osm-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('q') || undefined;
  const emergencyOnly = searchParams.get('emergency') === 'true';
  const ownershipFilter = searchParams.get('ownership'); // 'government' | 'private' | undefined
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  const headers = {
    'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
  };

  if (id) {
    const facility = getFacilityById(id);
    if (!facility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404, headers });
    }
    return NextResponse.json(facility, { headers });
  }

  const userLat = latStr ? parseFloat(latStr) : undefined;
  const userLon = lngStr ? parseFloat(lngStr) : undefined;

  // 1. Fetch seeded government PHCs/hospitals
  let govFacilities = searchFacilities(query, emergencyOnly, userLat, userLon);

  let finalFacilities = govFacilities;

  // 2. Fetch live OpenStreetMap hospitals and clinics if GPS coordinates are provided
  if (userLat !== undefined && userLon !== undefined && !isNaN(userLat) && !isNaN(userLon)) {
    try {
      let osmFacilities = await fetchLiveOsmFacilities(userLat, userLon, 25000);

      // Filter OSM facilities by emergency if requested
      if (emergencyOnly) {
        osmFacilities = osmFacilities.filter((f) => f.emergency_24x7);
      }

      // Filter OSM facilities by text query if requested
      if (query) {
        const q = query.trim().toLowerCase();
        osmFacilities = osmFacilities.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.type.toLowerCase().includes(q) ||
            f.district.toLowerCase().includes(q) ||
            (f.specialties && f.specialties.some((s) => s.toLowerCase().includes(q)))
        );
      }

      // Deduplicate OSM facilities against seeded government PHCs (~100m)
      finalFacilities = deduplicateFacilities(govFacilities, osmFacilities);

      // Sort all facilities ascending by distance
      finalFacilities.sort((a, b) => a.distance_km - b.distance_km);
    } catch {
      // Safe fallback to seeded government facilities on any unexpected error
      finalFacilities = govFacilities;
    }
  }

  // 3. Apply ownership filter if requested
  if (ownershipFilter === 'government') {
    finalFacilities = finalFacilities.filter((f) => f.ownership === 'government');
  } else if (ownershipFilter === 'private') {
    finalFacilities = finalFacilities.filter((f) => f.ownership === 'private');
  }

  return NextResponse.json(
    {
      facilities: finalFacilities,
      userCoords: userLat && userLon && !isNaN(userLat) && !isNaN(userLon) ? { lat: userLat, lng: userLon } : null,
      totalCount: finalFacilities.length,
    },
    { headers }
  );
}
