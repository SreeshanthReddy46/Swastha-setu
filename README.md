# Swastha Setu ("स्वास्थ्य सेतु") — Voice-First Rural Health Triage, All-Hospital & Emergency Blood Bank Locator

> **Health guidance in your language, for everyone.**  
> Swastha Setu is a high-performance, voice-first public health triage platform, Open Government Healthcare & Emergency Blood Bank Locator designed to connect citizens directly to verified government healthcare facilities (AIIMS, District Civil Hospitals, Medical Colleges, Trauma Centers, PHCs/CHCs), live private hospitals via OpenStreetMap, and emergency blood banks across India.

---

## 🌟 Key Features & Capabilities

### 1. 🏥 Live Hybrid Hospital & Facility Locator (`lib/osm-service.ts`, `app/api/facilities/route.ts`)
- **Live OpenStreetMap (OSM) Overpass Integration**: Dynamically queries nearby hospitals, nursing homes, and clinics for any coordinate and radius without requiring billed API keys.
- **High-Availability Multi-Mirror Fallback**: Automatically queries prioritized public Overpass mirrors (`lz4.overpass-api.de`, `overpass-api.de`, `maps.mail.ru`, `overpass.kumi.systems`).
- **Resilient 3.5s Timeout Gate**: Non-blocking `AbortController` timeout ensures external API slowdowns never break the application, falling back seamlessly to seeded government PHC data.
- **In-Memory 15-Minute Grid Caching**: Coordinates are cached by $\approx 1.1\text{km}$ grid tiles to prevent rate-limiting and deliver sub-millisecond responses on repeated queries.
- **Spatial Deduplication Engine ($\le 100\text{m}$)**: Automatically detects when an OpenStreetMap node matches an existing seeded government PHC within 100 meters (or 500m with name similarity), preserving the verified government database record with rich bed and doctor metadata.
- **Ownership Classification & Filtering**:
  - `🏛️ Government (PHC / CHC / District / AIIMS)`: Tagged from official government datasets and verified public institutions.
  - `🏥 Private Hospitals & Clinics (OSM)`: Tagged from live OpenStreetMap records.
  - Interactive UI filters allow filtering by **All Facilities**, **Government Only**, or **Private Only**.
- **Interactive 3D Leaflet Map (`FacilityMap.client.tsx`)**:
  - 3D Tilt View vs 2D Flat View toggle.
  - Color-coded marker badges (Emerald for Government, Indigo for Private).
  - Live GPS glowing user radius circle (10km radius).
  - Rich popups with distance, 24/7 emergency status, address, and direct dialing.

---

### 2. 🩸 Emergency Blood Bank Locator (`app/(app)/blood-banks/page.tsx`, `lib/blood-bank-service.ts`)
- **GPS-Powered Nearest Blood Bank Detection**: Calculates exact Haversine distance from the user's location.
- **Blood Group & Component Stock Matrix**:
  - Filter by blood group: `O+`, `O- Universal`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`.
  - Filter by specialized blood components: `Platelets (SDP / RDP)` and `FFP (Fresh Frozen Plasma)`.
- **Live Availability Metrics**: Displays verified units available in stock, storage temperature status, active technicians on duty, and Medical Officer In Charge.
- **Instant Calling**: Direct one-tap click-to-call for emergency blood dispatch.

---

### 3. 🔊 Voice-First Multilingual Triage Engine (`lib/voice-assistant-engine.ts`, `lib/triage-engine.ts`)
- **9 Major Indian Regional Languages Supported**:
  - English (`en`), Hindi (`hi`), Telugu (`te`), Tamil (`ta`), Kannada (`kn`), Bengali (`bn`), Marathi (`mr`), Gujarati (`gu`), Odia (`or`).
- **Speech Recognition & Synthesis**: Web Speech API integration with normalized speech pacing (`0.92`), text sanitization (cleans markdown, normalizes numbers like `108` to spoken words, expands units), and fallback text-to-speech.
- **Spoken Location Detection (`lib/location-service.ts`)**: Automatically extracts spoken district/city names from audio transcriptions when GPS coordinates are unavailable.
- **Clinical Urgency Assessment**:
  - `EMERGENCY`: Immediate 108 ambulance dispatch and level-1 trauma / ICU hospital recommendation.
  - `HIGH`: Same-day hospital / district civil hospital consultation.
  - `MODERATE`: 24-hour primary health centre consultation.
  - `ROUTINE`: Home care guidance, hydration, and local PHC OPD visit.
- **Live Medical Research Intelligence Engine**: Cross-references symptoms against authoritative WHO, ICMR, and MoHFW disease outbreak protocols for emerging vector-borne pathogens, gastroenteritis, and acute febrile illnesses, displaying recommended lab tests (e.g. Dengue NS1, Troponin, CBC Platelet counts) and clinical precautions.

---

### 4. 👩‍⚕️ ASHA & Frontline Health Worker Toolkit (`components/AshaToolkit.tsx`)
- **Oral Rehydration Salts (ORS) Preparation Protocols**: Step-by-step ratio and hygiene instructions for rural dehydration management.
- **Maternal & Child Health Checklist**: Danger signs during pregnancy, delivery preparedness, and emergency 102 transport.
- **National Immunization Schedule Reference**: Essential vaccine timelines for infants and mothers.
- **Offline Triage Cards**: Quick visual reference sheets for community health workers.

---

### 5. 🚨 Emergency 108 SOS Dispatch Modal (`components/EmergencySOSModal.tsx`)
- Floating emergency trigger on all pages.
- 1-tap direct dialing for **108 (National Ambulance)**, **102 (Maternity Transport)**, and **104 (Medical Advice Helpline)**.
- Real-time GPS coordinate readout (`Latitude: 13.2172° N, Longitude: 79.1003° E`) formatted for clear vocal communication to emergency dispatch operators.

---

## 🎨 Design System — "Warm Trust"

| Role | Color Name | Hex Code | Purpose |
|---|---|---|---|
| Primary | Deep Teal | `#0F6E56` | Headers, active navigation highlights, verified government badges |
| Warm Accent | Terracotta | `#D85A30` | Primary CTA buttons, emergency highlights, distance pills |
| Alert | Urgent Red | `#A32D2D` | High/Emergency triage warnings & 108 emergency bar |
| Background | Warm Cream | `#FAF6EE` | Soft, accessible warm background |
| Surface | Pure White | `#FFFFFF` | Cards, modals, and interactive map containers |
| Secondary Tag | Indigo Slate | `#4338CA` | Live OpenStreetMap private hospital badges |
| Text Primary | Charcoal | `#2C2418` | High-contrast readable typography |
| Text Secondary | Warm Gray | `#6B6355` | Subtitles, labels, and secondary details |

---

## 📡 API Endpoints Reference

### 1. Facilities API (`GET /api/facilities`)
Returns verified government PHCs/hospitals merged with live OpenStreetMap healthcare facilities.

**Parameters:**
- `lat` (float, optional): User latitude.
- `lng` (float, optional): User longitude.
- `q` (string, optional): Search keyword (hospital name, district, specialty).
- `emergency` (boolean, optional): Filter for 24/7 emergency & ICU facilities only.
- `ownership` (string, optional): `'government'` or `'private'`.
- `id` (string, optional): Retrieve a single facility by ID.

**Example Response:**
```json
{
  "facilities": [
    {
      "id": "phc-001",
      "name": "Chittoor Government District Hospital",
      "type": "District Civil Hospital",
      "ownership": "government",
      "source": "seeded_phc",
      "district": "Chittoor",
      "state": "Andhra Pradesh",
      "address": "Collectorate Road, Greamspet, Chittoor, AP 517001",
      "latitude": 13.2172,
      "longitude": 79.1003,
      "phone": "+91 8572 222 450",
      "emergency_24x7": true,
      "icu_beds": 24,
      "doctors_on_duty": 18,
      "beds_available": 350,
      "ambulance_available": true,
      "specialties": ["Level-1 Trauma", "Cardiology", "General Surgery"],
      "distance_km": 0.8
    },
    {
      "id": "osm-node-10827364",
      "name": "Apollo Clinic & Diagnostic Centre",
      "type": "Private Hospital / Clinic",
      "ownership": "private",
      "source": "osm",
      "district": "Chittoor",
      "state": "Andhra Pradesh",
      "address": "High Road, Chittoor",
      "latitude": 13.2210,
      "longitude": 79.1045,
      "phone": "108 (National Emergency)",
      "emergency_24x7": false,
      "doctors_on_duty": 1,
      "ambulance_available": false,
      "specialties": ["General Medicine", "OPD Care"],
      "distance_km": 1.2
    }
  ],
  "userCoords": { "lat": 13.2172, "lng": 79.1003 },
  "totalCount": 2
}
```

### 2. Blood Banks API (`GET /api/blood-banks`)
Returns emergency blood bank locations with live component inventory.

**Parameters:**
- `lat` (float, optional): User latitude.
- `lng` (float, optional): User longitude.
- `q` (string, optional): Blood bank name or city.
- `bloodGroup` (string, optional): e.g. `'O+'`, `'O-'`, `'A+'`, `'B+'`, `'AB+'`.
- `component` (string, optional): `'platelets'` or `'plasma'`.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 / 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Custom "Warm Trust" design tokens
- **Animations**: Framer Motion (GPU hardware-accelerated viewport transitions and active tabs)
- **Mapping**: Leaflet.js + OpenStreetMap with custom 3D isometric markers
- **External Data**: OpenStreetMap Overpass QL API (with multi-mirror redundancy)
- **Voice APIs**: Web Speech API (`SpeechRecognition`, `SpeechSynthesisUtterance`)
- **Geospatial Processing**: High-precision Haversine formula distance calculations

---

## 🚀 Getting Started & Local Setup

### Option A: 🐳 Run with Docker (Recommended for Any Laptop / OS)

You can run Swastha Setu on any machine (Windows, macOS, Linux) with Docker installed without setting up Node.js or local dependencies:

```bash
# 1. Clone the repository
git clone https://github.com/SreeshanthReddy46/Swastha-setu.git
cd Swastha-setu

# 2. Build and start with Docker Compose
docker compose up --build

# Or using plain Docker:
docker build -t swastha-setu .
docker run -p 3000:3000 swastha-setu
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Local Node.js Setup

#### Prerequisites
- Node.js 18.x or higher
- npm, pnpm, or yarn

#### Installation & Startup
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

#### Building for Production Locally
```bash
# Compile and verify production bundle
npm run build

# Run TypeScript type verification
npx tsc --noEmit
```

---

## 🔒 Scope Boundaries & Disclaimer

Swastha Setu is designed as a public health assistance and triage navigation platform:
- **NOT a Diagnostic Tool**: It assesses symptom urgency to guide timely facility visits. It does not replace medical diagnostics.
- **NOT a Doctor Replacement**: It directs patients to qualified medical professionals at certified facilities.
- **For Medical Emergencies**: Always dial **108** immediately in life-threatening situations.

---

## 📄 License

Open-source under the [MIT License](LICENSE).
