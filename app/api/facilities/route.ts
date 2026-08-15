import { NextResponse } from 'next/server';
import { searchFacilities, getFacilityById } from '@/lib/facility-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const query = searchParams.get('q') || undefined;
  const emergencyOnly = searchParams.get('emergency') === 'true';
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

  const facilities = searchFacilities(query, emergencyOnly, userLat, userLon);
  return NextResponse.json(
    { facilities, userCoords: userLat && userLon ? { lat: userLat, lng: userLon } : null },
    { headers }
  );
}
