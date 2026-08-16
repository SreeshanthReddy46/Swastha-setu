# OpenStreetMap Overpass Hospital Locator Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the hospital locator feature to dynamically fetch live nearby private and public hospitals from OpenStreetMap (Overpass API), merge and deduplicate them with seeded government PHC data, tag ownership (government vs. private), and provide resilient timeout fallbacks.

**Architecture:** Create a dedicated OSM Overpass client service (`lib/osm-service.ts`) with abort timeout control, multi-endpoint mirror redundancy, and grid caching. Update the Next.js API route (`app/api/facilities/route.ts`) to merge seeded PHC data with live Overpass query results. Update the facility locator frontend (`app/(app)/locator/page.tsx`) to fetch merged results and allow filtering by Government vs. Private healthcare facilities.

**Tech Stack:** Next.js 15 (App Router), TypeScript, OpenStreetMap Overpass QL API, Leaflet, Tailwind CSS.

## Global Constraints
- Preserve existing API endpoint contract (`/api/facilities` query parameters & response shape).
- Strict 3.5-second timeout on Overpass queries with non-blocking fallback to seeded PHC data.
- Deduplication threshold: 100 meters (0.1 km) Haversine distance, prioritizing verified government PHC records.
- Zero breaking changes to existing `HealthFacility` interface properties.

---

### Task 1: Create OSM Overpass Service & Deduplication Engine

**Files:**
- Create: `lib/osm-service.ts`
- Modify: `lib/facility-service.ts`

**Interfaces:**
- Produces: `fetchLiveOsmFacilities(lat: number, lng: number, radiusMeters?: number): Promise<HealthFacility[]>`
- Produces: `deduplicateFacilities(primaryGov: HealthFacility[], secondaryOsm: HealthFacility[], thresholdKm?: number): HealthFacility[]`

- [ ] **Step 1: Update HealthFacility interface in `lib/facility-service.ts` if needed for ownership tagging**
Ensure `ownership?: 'government' | 'private'` and `source?: 'seeded_phc' | 'osm'` are cleanly supported.

- [ ] **Step 2: Implement `lib/osm-service.ts`**
Implement Overpass QL query generation, resilient fetch with `AbortController` (3.5s timeout), response normalization into `HealthFacility` objects, in-memory grid caching, and Haversine deduplication (100m).

---

### Task 2: Update `/api/facilities` Route Handler

**Files:**
- Modify: `app/api/facilities/route.ts`

**Interfaces:**
- Consumes: `searchFacilities`, `getFacilityById` from `lib/facility-service.ts`
- Consumes: `fetchLiveOsmFacilities`, `deduplicateFacilities` from `lib/osm-service.ts`

- [ ] **Step 1: Integrate OSM fetching into `GET` handler in `app/api/facilities/route.ts`**
Handle `lat`, `lng`, `q`, and `emergency` params. If `lat` and `lng` are provided, asynchronously fetch live OSM facilities with graceful timeout, merge with seeded PHCs, deduplicate, filter, and sort by distance.

---

### Task 3: Enhance Locator UI with Live Fetching & Government/Private Badges

**Files:**
- Modify: `app/(app)/locator/page.tsx`
- Modify: `app/(app)/components/FacilityMap.client.tsx`

- [ ] **Step 1: Update `LocatorPage` to fetch from `/api/facilities` when coordinates are active**
Add live loading states, ownership filter options ("All", "Government PHCs/Hospitals", "Private Hospitals & Clinics"), and display distinct badges (`🏛️ Government` vs `🏥 Private`) on hospital cards.

- [ ] **Step 2: Update map popup & marker badges in `FacilityMap.client.tsx`**
Reflect whether a facility is Government or Private in the Leaflet marker badges and popups.

---

### Task 4: Verification and Live Testing

- [ ] **Step 1: Test API route with GPS coordinates (e.g., Delhi, Bangalore, Chittoor)**
Verify that both government PHCs and live OSM hospitals are returned in the response with proper `ownership`/`type` tags and deduplication.

- [ ] **Step 2: Test Overpass offline/timeout resilience**
Verify that if Overpass fails or times out, the endpoint instantly and cleanly falls back to seeded PHC data without crashing or throwing 500 errors.
