import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getLanguageForRegion(region: string): string {
  const r = (region || '').toLowerCase();
  if (r.includes('telangana') || r.includes('andhra') || r.includes('hyderabad') || r.includes('amaravati') || r.includes('vizag')) {
    return 'te';
  }
  if (r.includes('maharashtra') || r.includes('mumbai') || r.includes('pune') || r.includes('nagpur')) {
    return 'mr';
  }
  if (r.includes('tamil') || r.includes('chennai') || r.includes('puducherry') || r.includes('pondicherry') || r.includes('madurai') || r.includes('coimbatore')) {
    return 'ta';
  }
  if (r.includes('karnataka') || r.includes('bengaluru') || r.includes('bangalore') || r.includes('mysuru') || r.includes('mangalore')) {
    return 'kn';
  }
  if (r.includes('bengal') || r.includes('kolkata') || r.includes('tripura')) {
    return 'bn';
  }
  if (r.includes('gujarat') || r.includes('ahmedabad') || r.includes('surat') || r.includes('vadodara')) {
    return 'gu';
  }
  if (r.includes('odisha') || r.includes('orissa') || r.includes('bhubaneswar') || r.includes('cuttack')) {
    return 'or';
  }
  if (
    r.includes('delhi') ||
    r.includes('uttar pradesh') ||
    r.includes('madhya pradesh') ||
    r.includes('bihar') ||
    r.includes('rajasthan') ||
    r.includes('haryana') ||
    r.includes('punjab') ||
    r.includes('jharkhand') ||
    r.includes('chhattisgarh') ||
    r.includes('himachal') ||
    r.includes('uttarakhand')
  ) {
    return 'hi';
  }
  return 'en';
}

export async function GET(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '';

    // Fast IP Geolocation lookup
    let geoData = {
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      country_code: 'IN',
      latitude: 17.3850,
      longitude: 78.4867,
      language: 'te'
    };

    if (ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1200);

        const res = await fetch(`https://ipapi.co/${ip}/json/`, {
          signal: controller.signal,
          headers: { 'User-Agent': 'SwasthaSetu-HealthLocator/1.0' }
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data && data.region) {
            geoData = {
              city: data.city || 'Hyderabad',
              region: data.region || 'Telangana',
              country: data.country_name || 'India',
              country_code: data.country_code || 'IN',
              latitude: typeof data.latitude === 'number' ? data.latitude : 17.3850,
              longitude: typeof data.longitude === 'number' ? data.longitude : 78.4867,
              language: getLanguageForRegion(data.region || '')
            };
          }
        }
      } catch {
        // Fallback to default
      }
    }

    return NextResponse.json({
      success: true,
      ...geoData
    });
  } catch {
    return NextResponse.json({
      success: true,
      city: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      country_code: 'IN',
      latitude: 17.3850,
      longitude: 78.4867,
      language: 'te'
    });
  }
}
