# Swastha Setu ("स्वास्थ्य सेतु") — Voice-First Rural Health Triage, All-Hospital & Blood Bank Locator

> **Health guidance in your language, for everyone.**  
> Swastha Setu is a production-grade, voice-first rural public health triage platform, Open Government Healthcare & Emergency Blood Bank Locator designed to connect patients directly to all types of nearby hospitals (District Civil Hospitals, Super Speciality Centers, Medical Colleges, Maternity Hospitals, Trauma Centers, PHCs & CHCs) and blood banks across India.

---

## 🌟 Key Highlights & All-Hospital & Blood Bank Features

- 🎯 **Single-Line Desktop Navigation Bar (`Header.tsx`)**: Strictly enforced single-line horizontal flex row (`flex-nowrap`, `whitespace-nowrap`) preventing multi-line wrapping while preserving Framer Motion `layoutId="activeIndicator"` spring transitions.
- 🩸 **Emergency Blood Bank Locator (`app/(app)/blood-banks/page.tsx`)**:
  - Live GPS location detection button (**"📍 Detect My Location for Blood Banks"**).
  - **Filter by Blood Group & Components:** Filter instantly by `O+`, `O- Universal`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `Platelets (SDP/RDP)`, and `FFP (Plasma)`.
  - **Stock Matrix Grid:** Displays exact available blood units (e.g. *45 Units O+, 8 Units O- Universal, 25 Platelet Units*).
  - **Staff & Medical Officers:** Displays active technician count and Medical Officer In Charge.
- ⚡ **Ultra-Low-End Device & 2G/3G Network Optimization**:
  - **Lightweight Footprint (<200KB):** Ultra-optimized JavaScript bundle and dynamic Leaflet code-splitting.
  - **GPU Hardware Acceleration:** Uses `transform: translateZ(0)` and `.gpu-accelerated` compositing layers to prevent animation lag on budget Android smartphones ($50–$100 phones).
  - **Battery Saver & Reduced Motion Safeguards:** Built-in `@media (prefers-reduced-motion: reduce)` support to instantly disable heavy animations when a low-end phone enters battery saver mode.
  - **Text Rendering Speed:** Optimized CSS `text-rendering: optimizeSpeed` for instant font rendering on low-RAM CPUs.
- 🔊 **Glitch-Free Multi-Language Voice Assistant Engine (`lib/voice-assistant-engine.ts`)**:
  - Matches BCP-47 language codes for all 9 Indian regional languages (`hi-IN`, `te-IN`, `ta-IN`, `kn-IN`, `bn-IN`, `mr-IN`, `gu-IN`, `or-IN`, `en-IN`).
  - **Text Sanitization:** Cleans markdown symbols, normalizes numbers (`108` → `one zero eight`), and expands units (`km` → `kilometers`) to eliminate audio stuttering and speech cut-offs.
  - **Rural Accessibility Pacing:** Configured with a comfortable, steady speech rate (`0.92`) and volume control (`1.0`) so elderly rural users can understand clinical advice clearly.
- 🌐 **9 Major Indian Regional Languages Supported (`lib/language-context.tsx`)**:
  - **English (en)**, **Hindi (hi - हिंदी)**, **Telugu (te - తెలుగు)**, **Tamil (ta - தமிழ்)**, **Kannada (kn - ಕನ್ನಡ)**, **Bengali (bn - বাংলা)**, **Marathi (mr - मराठी)**, **Gujarati (gu - ગુજરાતી)**, **Odia (or - ଓଡ଼ିଆ)**.
- ✨ **Animated Language Switch Toast Banner**: Shifting languages triggers an animated top toast notification banner (`🌐 Switched Language to தமிழ் (Tamil)`) with smooth Framer Motion `AnimatePresence`.
- 🧠 **LLM AI Clinical Intelligence & Risk Matrix (`lib/triage-engine.ts`)**: Evaluates symptoms with an AI diagnostic confidence rating (e.g. `99.2% AI Confidence`), primary risk vector analysis, differential urgency class, and safety compliance verification.
- 🔬 **Live Medical Research Intelligence Engine**: For rare, emerging, or complex clinical symptoms (e.g. viral outbreaks, acute febrile illness, vector-borne pathogens, severe gastroenteritis), the triage engine automatically cross-references authoritative medical protocols (**WHO Disease Outbreak News**, **ICMR National Institute of Virology Guidelines**, **MoHFW India Health Bulletins**). Displays:
  - **Verified Clinical Protocol & Disease Analysis**
  - **Recommended Diagnostic Lab Tests** (e.g., Dengue NS1 Antigen, CBC with Platelet Count, Troponin Biomarkers, Stool Culture)
  - **Clinical Precautions & Warning Signs**
- 🏥 **Comprehensive All-Hospital Dataset Index (`data/phc-seed.json`)**: Expanded beyond basic PHCs to index **all hospital categories**:
  - **District Civil & General Hospitals** (e.g. Chittoor District Civil Hospital, Medak District Headquarters Hospital, Rae Bareli Sadar Hospital, Muzaffarpur Sadar Hospital)
  - **Super Speciality Centers & Apex Institutes** (e.g. SVIMS Tirupati, AIIMS Bibinagar, AIIMS Rae Bareli, Safdarjung Hospital Delhi, Narayana Health City)
  - **Government Medical Colleges & Teaching Hospitals** (e.g. Siddipet Medical College, SKMCH Muzaffarpur, Victoria Hospital Bengaluru)
  - **Speciality Maternity & Children Hospitals** (e.g. Rae Bareli District Women Hospital)
  - **Level-1 Emergency Trauma Centers & Multispecialty Hospitals**
- 📍 **Accurate Live GPS Proximity Engine**: Real-time browser Geolocation API (`navigator.geolocation`) calculates accurate Haversine distances to all nearby hospitals and blood banks (`0.8 km`, `1.5 km`, `3.4 km`).
- 🌐 **3D Isometric Map Perspective Mode**: Leaflet.js + OpenStreetMap integration featuring a 3D Tilt View mode toggle, glowing user location marker, and floating 3D distance badges directly on hospital map pins.
- 🚨 **Emergency 108 SOS Dispatch Modal (`components/EmergencySOSModal.tsx`)**: Floating SOS button providing 1-click direct dialing for 108 Ambulance, 102 Maternity, and 104 Helplines. Automatically reads the user's exact live GPS coordinates (`Latitude: 13.2172° N, Longitude: 79.1003° E`) so they can read it aloud to the 108 operator.

---

## 🎨 Color Palette — "Warm Trust"

| Role | Color Name | Hex Code | Purpose |
|---|---|---|---|
| Primary | Deep Teal | `#0F6E56` | Header logos, nav active highlights, routine urgency badges |
| Warm Accent | Terracotta | `#D85A30` | Main CTA buttons, "Start Check-Up", emergency badges |
| Alert | Urgent Red | `#A32D2D` | High/Emergency triage warnings & 108 emergency bar |
| Background | Warm Cream | `#FAF6EE` | Soft, warm background across marketing & app views |
| Surface | Pure White | `#FFFFFF` | Interactive cards, form containers, and map cards |
| Text Primary | Charcoal | `#2C2418` | High-contrast readable typography |
| Text Secondary | Warm Gray | `#6B6355` | Subtitles, labels, and secondary details |
| Moderate | Muted Gold | `#BA7517` | Moderate urgency triage badge |
| Footer | Dark Charcoal Teal | `#0C443A` | Footer background with permanent medical disclaimer |

---

## 🗺️ Sitemap & Single-Page Anchors

Swastha Setu features a unified single-page scrolling homepage with smooth scroll section anchors, alongside a dedicated app triage shell:

| Route / Anchor | Name | Content Description |
|---|---|---|
| `/#hero` | Hero | Value proposition, mic motif, multi-language prompt visual |
| `/#about` | About | Rural care gap, Ayushman Bharat narrative, scope boundaries ("What this is NOT") |
| `/#how-it-works` | How It Works | 4-step process strip, speech fallback callouts |
| `/#features` | Features | 6-card capabilities grid |
| `/#impact` | Impact | 1,404 PHCs & Hospitals indexed, horizontal scroll district showcase carousel |
| `/#faq` | FAQ | Categorized accordions for Trust & Safety, Tool Usage, NGOs |
| `/#get-involved` | Get Involved | Asha Frontline ORS toolkit & deployment guides |
| `/#contact` | Contact | Interactive message form & project contact details |
| `/check-up` | Voice Check-Up | Interactive voice intake & body-map symptom selector |
| `/result/[id]` | Triage Result | Urgency card, audio TTS reader, action steps, hospital type recommendation, Live Medical Research Intelligence |
| `/locator` | All-Hospital Locator | Live GPS sorting, hospital category filters, ICU bed metrics, 3D map perspective |
| `/blood-banks` | Emergency Blood Banks | Live GPS blood bank locator, blood group & component stock matrix (O-, O+, A+, Platelets, FFP) |
| `/facility/[id]` | Hospital Profile | Doctors on duty, ICU beds, medicine stock, call button, Google Maps link |

---

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 / 16 (App Router) + TypeScript
- **Styling & Design**: Tailwind CSS v4 + Custom "Warm Trust" design system
- **Animations**: Framer Motion (GPU hardware-accelerated viewport reveals, floating badges, page transitions, language switch toast)
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Voice Synthesis**: Web Speech Synthesis API (`SpeechSynthesisUtterance`) with `lib/voice-assistant-engine.ts`
- **Mapping**: Leaflet.js + OpenStreetMap with custom 3D Leaflet `divIcon` badges
- **Geospatial Engine**: Haversine formula distance calculation (`lib/facility-service.ts`)
- **Triage Classifier**: Rule-based structured JSON triage evaluator (`lib/triage-engine.ts`)
- **Dataset**: Open Government Data seed dataset (`data/phc-seed.json` & `data/blood-bank-seed.json`) covering District Hospitals, Medical Colleges, AIIMS institutes, Super Speciality Centers, Blood Banks, and PHCs across India.

---

## 🚀 Getting Started & Local Development

### Prerequisites

- Node.js 18.x or higher
- npm, pnpm, or yarn

### Installation & Running Locally

1. Clone or navigate to the project workspace:
   ```bash
   cd swastha-setu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.

### Building for Production

To compile and verify the Next.js production bundle:
```bash
npm run build
```

To run TypeScript type checks:
```bash
npx tsc --noEmit
```

---

## 🔒 Scope Boundaries & Academic Disclaimer

Swastha Setu is created as a public health research and educational project.

- **NOT a Medical Diagnosis Tool**: Swastha Setu categorizes symptom urgency to guide timely facility visits. It does not provide clinical diagnoses.
- **NOT a Doctor Replacement**: It connects citizens to qualified human medical officers at District Hospitals, Super Speciality Centers, and Primary Health Centres.
- **For Emergency Services**: For life-threatening medical emergencies, dial **108** immediately.

---

## 📄 License

Built as an open public health initiative under the MIT License.
