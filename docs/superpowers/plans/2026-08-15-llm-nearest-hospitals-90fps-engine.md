# LLM Nearest Hospital Grounding, Nationwide Hospital Dataset & 90 FPS Cross-Device Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ground the LLM and Voice AI Triage engine with live GPS nearest hospital recommendations from an expanded nationwide Google Maps–grade hospital dataset, and optimize the application for 90 FPS buttery smooth rendering across all devices with 0 linter/compiler errors.

**Architecture:** User geolocation from `/check-up` is fed into `lib/triage-engine.ts`, which queries `lib/facility-service.ts` using Haversine formulas and severity filters across `data/phc-seed.json`. Grounded hospital details (name, distance, ICU beds, emergency contact, map link) are synthesized into both the AI narrative, multilingual TTS audio, and interactive result cards on `/result/[id]`. The rendering pipeline in `app/globals.css` and components is tuned with GPU compositing layers, subpixel antialiasing, Retina map tiles, and responsive scaling.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Leaflet.js, Web Speech API.

## Global Constraints
- Target 90Hz and 120Hz refresh rates with zero jank (`transform: translate3d(0, 0, 0)`, `contain: layout paint`).
- Zero pixelation on high-DPI displays with vector SVGs and Retina Leaflet tiles.
- Clean ESLint & TypeScript compilation with 0 errors and 0 warnings.
- Responsive layout support from 320px mobile screens up to 4K monitors.

---

### Task 1: Expand Nationwide Hospital Dataset (`data/phc-seed.json`)

**Files:**
- Modify: `data/phc-seed.json`

**Interfaces:**
- Produces: Comprehensive `HealthFacility[]` containing verified hospitals across North, South, East, West, and Central India.

- [ ] **Step 1: Expand `data/phc-seed.json` with multi-tier hospitals across Indian states**
Add major Apex Institutes (AIIMS Delhi, AIIMS Patna, AIIMS Bibinagar, PGIMER Chandigarh, NIMHANS Bengaluru, SVIMS Tirupati), Government Medical Colleges (KGMU Lucknow, MMC Chennai, Osmania Hyderabad, SCB Cuttack, Victoria Bengaluru, SMS Jaipur), District Civil Hospitals across AP, Telangana, UP, Bihar, Maharashtra, Tamil Nadu, Karnataka, and 24x7 Trauma Centers with verified coordinates, emergency phone numbers, ICU beds, and specialties.

- [ ] **Step 2: Validate JSON syntax and structure**
Ensure all entries conform to `HealthFacility` structure without missing keys or invalid numbers.

- [ ] **Step 3: Commit dataset expansion**
```bash
git add data/phc-seed.json
git commit -m "feat(data): expand nationwide hospital dataset with multi-tier verified facilities"
```

---

### Task 2: Enhance Spatial Proximity & Severity-Aware Filtering in `lib/facility-service.ts`

**Files:**
- Modify: `lib/facility-service.ts`

**Interfaces:**
- Consumes: `data/phc-seed.json`, `calculateHaversineDistance`
- Produces: `getNearestFacilities(userLat?: number, userLng?: number, severity?: string, limit?: number)` and `getHospitalById(id: string)`.

- [ ] **Step 1: Add 100km radius search and fine-to-distant sorting logic**
Implement `getNearestFacilities` in `lib/facility-service.ts` that:
1. Calculates real-time distance using Haversine formula from `(userLat, userLng)`.
2. Filters facilities within a **100 km radius** (with adaptive fallback to closest regional apex hubs if in sparse rural zones).
3. Sorts strictly from nearest/finest to furthest (ascending `distance_km`: e.g. 0.8 km, 3.2 km, 18 km up to 100 km), with high emergency capability (ICU beds, 24x7 emergency, doctors on duty) prioritized for critical triage.
4. Returns matching facilities with exact computed distance badges.

- [ ] **Step 2: Optimize search indexing and query cache**
Update search index creation to include all specialties and district metadata.

- [ ] **Step 3: Commit facility service updates**
```bash
git add lib/facility-service.ts
git commit -m "feat(service): enhance proximity calculation and severity-aware facility matching"
```

---

### Task 3: Ground AI Triage Engine & LLM Reasoning in `lib/triage-engine.ts`

**Files:**
- Modify: `lib/triage-engine.ts`

**Interfaces:**
- Consumes: `lib/facility-service.ts` (`getNearestFacilities`)
- Produces: `TriageResult` containing `nearest_facilities?: GroundedFacility[]` and grounded AI reasoning.

- [ ] **Step 1: Define `GroundedFacility` type and update `TriageResult`**
Export `GroundedFacility` interface with `id, name, type, distance_km, icu_beds, doctors_on_duty, phone, emergency_24x7, address, latitude, longitude`.

- [ ] **Step 2: Update `evaluateSymptoms` to accept `userLat` and `userLng`**
1. Call `getNearestFacilities(userLat, userLng, urgency, 3)` within `evaluateSymptoms`.
2. Synthesize personalized clinical AI reasoning that explicitly references the nearest hospital name, distance, ICU capacity, and direct emergency number.
3. Attach `nearest_facilities` array to the returned `TriageResult`.

- [ ] **Step 3: Commit triage engine grounding**
```bash
git add lib/triage-engine.ts
git commit -m "feat(triage): ground AI triage engine and reasoning with nearest hospital proximity"
```

---

### Task 4: UI Integration for Check-Up & Result Screen (`app/(app)/check-up/page.tsx` & `app/(app)/result/[id]/page.tsx`)

**Files:**
- Modify: `app/(app)/check-up/page.tsx`
- Modify: `app/(app)/result/[id]/page.tsx`

**Interfaces:**
- Consumes: `TriageResult.nearest_facilities`, `useLanguage`, `speakTextInLanguage`

- [ ] **Step 1: Update `/check-up` to capture GPS coordinates and pass to triage**
Ensure browser geolocation is captured and passed directly to `evaluateSymptoms(symptoms, text, userLat, userLng)`.

- [ ] **Step 2: Update `/result/[id]` with Nearest Grounded Hospitals Section**
1. Display a prominent **"📍 Nearest Verified Emergency & Care Facilities"** card section.
2. Render top 3 nearest hospitals with live distance badges, ICU counts, doctors on duty, 1-click Google Maps directions button, and 1-tap direct call button.
3. Update TTS Voice Assistant to speak the personalized nearest hospital recommendation.

- [ ] **Step 3: Commit UI enhancements**
```bash
git add app/(app)/check-up/page.tsx app/(app)/result/[id]/page.tsx
git commit -m "feat(ui): display nearest hospital action cards and grounded voice synthesis"
```

---

### Task 5: 90 FPS Performance, High-DPI Crisp Graphics & Cross-Device Optimization

**Files:**
- Modify: `app/globals.css`
- Modify: `app/(app)/components/FacilityMap.client.tsx`
- Modify: `components/PageTransition.tsx`

- [ ] **Step 1: Add GPU compositing and 90Hz CSS optimizations in `app/globals.css`**
Add hardware acceleration rules (`transform: translate3d(0, 0, 0)`, `contain: layout style paint`, `subpixel-antialiased`, `-webkit-overflow-scrolling: touch`, `min-h-dvh` support).

- [ ] **Step 2: Configure Retina high-DPI Leaflet map tiles**
In `FacilityMap.client.tsx`, configure `detectRetina: true` and crisp OpenStreetMap / CartoDB tiles to prevent pixelation on Retina/AMOLED screens.

- [ ] **Step 3: Tune Framer Motion spring physics for 90 FPS responsiveness**
Calibrate animations in `PageTransition.tsx` and modal components to eliminate layout thrashing.

- [ ] **Step 4: Commit performance optimizations**
```bash
git add app/globals.css app/(app)/components/FacilityMap.client.tsx components/PageTransition.tsx
git commit -m "perf: enable 90 FPS GPU acceleration, Retina map tiles, and cross-device scaling"
```

---

### Task 6: Zero-Error Code Quality & ESLint / TypeScript Fixes

**Files:**
- Modify: `app/(marketing)/page.tsx`, `app/(marketing)/about/page.tsx`, `app/(marketing)/contact/page.tsx`, `app/(marketing)/features/page.tsx`, `app/(marketing)/how-it-works/page.tsx`, `app/(marketing)/faq/page.tsx`
- Modify: `components/AshaToolkit.tsx`
- Modify: `components/EmergencySOSModal.tsx`
- Modify: `lib/language-context.tsx`
- Modify: `lib/voice-assistant-engine.ts`
- Modify: `app/api/triage/route.ts`

- [ ] **Step 1: Fix unescaped HTML entities in marketing pages**
Replace unescaped `"` with `&quot;` across marketing pages.

- [ ] **Step 2: Fix React 19 purity rule in `AshaToolkit.tsx`**
Avoid calling `Date.now()` during render; use a stable `useId` or state-initialized referral ID. Clean up unused icons and replace `any` types.

- [ ] **Step 3: Fix `useEffect` synchronous setState in `lib/language-context.tsx`**
Initialize language state from `localStorage` safely without causing cascading render warnings.

- [ ] **Step 4: Clean up unused variables and replace `any` types in `voice-assistant-engine.ts` and `EmergencySOSModal.tsx`**

- [ ] **Step 5: Run `npm run lint` and verify 0 errors, 0 warnings**
Run `npm run lint` and confirm exit code 0.

- [ ] **Step 6: Run `npm run build` and verify successful production compilation**
Run `npm run build` and confirm all routes compile cleanly.

- [ ] **Step 7: Commit zero-error cleanups**
```bash
git add .
git commit -m "fix(quality): resolve all ESLint, React 19 purity, and TypeScript issues"
```
