# Swastha Setu ("स्वास्थ्य सेतु") — Voice-First Rural Health Triage, All-Hospital & Emergency Blood Bank Locator

> **Health guidance in your language, for everyone.**  
> Swastha Setu is a high-performance, voice-first public health triage platform, Open Government Healthcare & Emergency Blood Bank Locator designed to connect citizens directly to verified government healthcare facilities (AIIMS, District Civil Hospitals, Medical Colleges, Trauma Centers, PHCs/CHCs), live private hospitals via OpenStreetMap, and emergency blood banks across India.

---

## 🌟 Key Features & Architecture Overview

### 1. 🎙️ Sarvam AI Full Neural Multilingual Voice Pipeline (`lib/voice-assistant-engine.ts`, `lib/sarvam-config.ts`, `app/api/voice/`)
- **Sarvam Bulbul TTS (`bulbul:v3`) & Saaras STT (`saaras:v3`) Integration**:
  - Full-pipeline neural voice assistant handling both microphone audio transcription and voice speech output through Sarvam AI endpoints.
  - Dedicated native voice personas across all **9 Indian regional languages**:
    - **Telugu (`te-IN`)**: `pavithra`
    - **Hindi (`hi-IN`)**: `meera`
    - **Tamil (`ta-IN`)**: `iniya`
    - **Kannada (`kn-IN`)**: `sapna`
    - **Bengali (`bn-IN`)**: `tanishaa`
    - **Marathi (`mr-IN`)**: `aarohi`
    - **Gujarati (`gu-IN`)**: `dhwani`
    - **Odia (`od-IN`)**: `roopa`
    - **Indian English (`en-IN`)**: `arvind`
- **Real-Time Synchronized Subtitle Highlighting**:
  - Word-by-word active word tracking dynamically synchronized with Sarvam AI audio playback.
- **Intelligent Context-Aware Symptom Talk-Back**:
  - Dynamically classifies user symptoms into Emergency (Chest pain, Breathlessness, Trauma, Stroke, Snake bite), Maternity (Pregnancy, Labor), Gastrointestinal (Stomach pain, Vomiting, Diarrhea), and Infection (Fever, Chills, Cough), speaking tailored clinical guidance in the chosen native language.
- **Dual Voice & Typed Text Input**:
  - Editable transcription text box allowing users to speak, review, edit, or type symptoms with instant "Ask AI Voice Agent" playback.

---

### 2. 🛡️ Acoustic Echo Isolation & Anti-Feedback Protection (`app/(app)/components/VoiceInput.tsx`)
- **Automatic Microphone Disconnect During Voice Playback**:
  - The moment the Sarvam AI voice agent starts speaking, all active microphone recording tracks and `SpeechRecognition` listeners are immediately aborted and muted.
- **Strict Audio Discard Filter**:
  - Discards any audio picked up from device speakers while the AI is talking to completely eliminate echo loops.
- **Room Reverberation Cooldown Buffer**:
  - Enforces a 600ms buffer after AI speech ends before reopening the microphone, preventing speaker reverberation from being recorded.
- **One-Tap User Interruption**:
  - Tapping the microphone button while the agent is speaking immediately stops AI voice playback and opens the mic cleanly for user input.

---

### 3. ⚡ Instant Geolocation & Regional Language Auto-Selection (`lib/geo-language-detector.ts`, `app/api/geo/route.ts`)
- **Sub-Second Multi-Channel Detection**:
  - **Instant Cache (<1ms)**: Reads saved location coordinates from session storage.
  - **Browser Locale (<1ms)**: Inspects `navigator.languages` for native Indian locale hints.
  - **Fast Server-Side IP Geolocation (`/api/geo`)**: Resolves state/region with a 1200ms timeout guard.
  - **Parallel GPS Pinpointing**: Runs `navigator.geolocation` for pinpoint coordinates.
- **Automatic State-to-Language Mapping**:
  - **Telangana & Andhra Pradesh** $\rightarrow$ `te` (Telugu)
  - **Maharashtra** $\rightarrow$ `mr` (Marathi)
  - **Tamil Nadu & Puducherry** $\rightarrow$ `ta` (Tamil)
  - **Karnataka** $\rightarrow$ `kn` (Kannada)
  - **West Bengal & Tripura** $\rightarrow$ `bn` (Bengali)
  - **Gujarat** $\rightarrow$ `gu` (Gujarati)
  - **Odisha** $\rightarrow$ `or` (Odia)
  - **Delhi NCR, UP, MP, Bihar, Rajasthan, Haryana, Punjab, Himachal Pradesh, etc.** $\rightarrow$ `hi` (Hindi)
  - **Other / Global** $\rightarrow$ `en` (English)
- **Automatic Location Notification Toast**:
  - Displays `📍 Location: Hyderabad, Telangana — Language set to తెలుగు (Telugu)`.

---

### 4. 🏥 Location-Grounded Hospitals, Facilities & Emergency Blood Banks (`app/(app)/locator/page.tsx`, `app/(app)/blood-banks/page.tsx`)
- **Automatic Proximity Sorting on Page Load**:
  - On page load, user coordinates are automatically retrieved and facilities are dynamically fetched and sorted **from closest to furthest**.
- **Live Hybrid Government PHCs & OpenStreetMap (OSM) Locator**:
  - Over 500 pre-seeded, verified Indian Government District Civil Hospitals, AIIMS, CHCs, and PHCs merged with live OpenStreetMap clinics.
  - Spatial deduplication ($\le 100\text{m}$) to merge OSM nodes with verified government doctor and ICU bed counts.
- **Emergency Blood Banks Matrix (`app/(app)/blood-banks/page.tsx`)**:
  - Filter by blood group (`O- Universal`, `O+`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`) and specialized components (`Platelets SDP/RDP`, `Fresh Frozen Plasma FFP`).
  - Distance calculation from user location and 1-tap direct calling.

---

### 5. 📋 Native Multilingual Recommended Clinical Action Steps (`lib/triage-engine.ts`, `app/(app)/result/[id]/page.tsx`)
- **Complete Clinical Translation Across All 9 Languages**:
  - Urgency level, clinical reasoning, timeframe, recommended hospital type, recommended specialty, and **Recommended Clinical Action Steps** are dynamically generated and displayed in the user's native language:
    - **Telugu (`te`)**: `"1. వైద్య సహాయం ఆలస్యం చేయవద్దు. వెంటనే 108 కు కాల్ చేయండి. 2. సమీపంలోని 24/7 జిల్లా సివిల్ ఆసుపత్రి అత్యవసర విభాగానికి వెళ్లండి..."`
    - **Hindi (`hi`)**: `"1. इलाज में बिल्कुल देरी न करें। तुरंत 108 एम्बुलेंस सेवा को कॉल करें। 2. निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं..."`
    - **Tamil (`ta`)**, **Kannada (`kn`)**, **Bengali (`bn`)**, **Marathi (`mr`)**, **Gujarati (`gu`)**, **Odia (`or`)**, **Indian English (`en`)**.
- **Full Voice Audio Synthesis of Action Steps**:
  - The Sarvam AI voice agent reads the full clinical guidance—including diagnosis, clinical reasoning, recommended action steps, and nearest hospital name, distance, and phone number in authentic native speech.
- **Dynamic Real-Time Language Switching**:
  - Switching the language dropdown on the triage results page instantly re-synthesizes and translates the report in real-time.

---

### 6. 🌐 Zero-Shift Navbar Stability & Universal Indic Font Stack (`app/globals.css`, `app/(marketing)/components/Header.tsx`, `app/(app)/layout.tsx`)
- **Cross-Platform Universal Indic Typography Stack**:
  ```css
  font-family: 'Plus Jakarta Sans', 'Inter', 'Noto Sans', 'Noto Sans Telugu', 
               'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Kannada', 
               'Noto Sans Bengali', 'Noto Sans Gujarati', 'Noto Sans Oriya', 
               'Nirmala UI', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ```
  - Standardizes line heights, visual weights, and crisp glyph rendering across all 9 scripts.
- **Zero-Shift Navbar Geometry**:
  - Pinned fixed-width language selector (`min-w-[155px]`) and fixed flex alignment ensuring no layout jumps or line-wrapping when toggling languages.

---

### 7. 🚀 Low-Latency, Offline-First & High-Responsiveness Architecture
- **Instant Client-Side Triage Fallback (<10ms)**:
  - Check-up assessment requests feature a 2.5s network timeout guard. If on 2G or offline, the triage engine executes **locally in browser memory with zero network delay**.
- **PWA Service Worker Caching (`public/sw.js`, `public/manifest.json`)**:
  - Offline asset caching for static bundles, stylesheets, fonts, and core triage routes for instant repeat loads in rural low-bandwidth regions.
- **Lightweight Low-Latency Voice Fallback**:
  - 2.6s timeout guard on Sarvam TTS API requests, falling back seamlessly to client-side browser speech synthesis if cellular network latency spikes.

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
Returns verified government PHCs/hospitals merged with live OpenStreetMap healthcare facilities sorted by distance.

**Parameters:**
- `lat` (float, optional): User latitude.
- `lng` (float, optional): User longitude.
- `q` (string, optional): Search keyword (hospital name, district, specialty).
- `emergency` (boolean, optional): Filter for 24/7 emergency & ICU facilities only.
- `ownership` (string, optional): `'government'` or `'private'`.
- `id` (string, optional): Retrieve a single facility by ID.

---

### 2. Geolocation & Language API (`GET /api/geo`)
Returns client IP geolocation data with Indian regional native language recommendation.

---

### 3. Voice TTS API (`POST /api/voice/tts`)
Proxies requests to Sarvam AI Bulbul neural TTS (`bulbul:v3`) with 24-hour LRU in-memory caching and fallback.

**Request Body:**
```json
{
  "text": "మీరు చెప్పిన ఛాతీ నొప్పి అత్యవసర లక్షణం...",
  "language": "te",
  "speaker": "pavithra",
  "pace": 0.95
}
```

---

### 4. Voice STT API (`POST /api/voice/stt`)
Proxies multipart audio recordings to Sarvam AI Saaras STT (`saaras:v3`) for neural speech-to-text transcription.

---

### 5. Triage API (`POST /api/triage`)
Evaluates symptom vectors, clinical risk level, action steps, and nearest facility grounded recommendations in the selected native language.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router + Turbopack) + TypeScript + React 19
- **Styling**: Tailwind CSS v4 + Custom "Warm Trust" design system
- **Animations**: Framer Motion (GPU hardware-accelerated viewport transitions and active indicators)
- **Mapping**: Leaflet.js + OpenStreetMap with custom 3D isometric markers
- **Voice AI Pipeline**: Sarvam AI Neural Models (`bulbul:v3` TTS & `saaras:v3` STT) across 9 Indian Languages with fallback to Web Speech API
- **PWA & Offline**: Progressive Web App Manifest + Service Worker caching
- **Geospatial Processing**: High-precision Haversine formula distance calculations

---

## 🚀 Getting Started & Local Setup

### Option A: 🐳 Run with Docker (Recommended for Any Laptop / OS)

```bash
# 1. Clone the repository
git clone https://github.com/SreeshanthReddy46/Swastha-setu.git
cd Swastha-setu

# 2. Build and start with Docker Compose
docker compose up --build
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Local Node.js Setup

#### Prerequisites
- Node.js 18.x or higher
- npm, pnpm, or yarn

#### 1. Environment Configuration
Create a `.env.local` file in the root directory (optional for Sarvam neural voice keys):
```env
SARVAM_API_KEY=your_sarvam_api_key_here
```
*(Note: If `SARVAM_API_KEY` is not provided, the application automatically uses browser-native speech synthesis and speech recognition as a seamless zero-config fallback).*

#### 2. Installation & Startup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

#### 3. Building for Production Locally
```bash
# Run TypeScript type verification
npx tsc --noEmit

# Compile production bundle
npm run build
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
