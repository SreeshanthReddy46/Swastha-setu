# Swastha Setu ("स्वास्थ्य सेतु")
### Voice-First Multilingual Rural Health Triage, Verified Hospital & Emergency Blood Bank Locator

> **"Health guidance in your language, for everyone."**  
> Swastha Setu is a voice-first, multilingual public health navigation and triage platform tailored for India. It empowers citizens—regardless of literacy levels or linguistic backgrounds—to articulate symptoms naturally in their native language, receive instant clinical urgency assessments, and discover verified government hospitals, community health centers, and emergency blood banks in real time.

---

## 🧭 Vision & Mission

In rural and semi-urban India, navigating the healthcare system presents severe challenges: language barriers, digital literacy hurdles, unfamiliar medical jargon, and difficulty discovering emergency facilities with appropriate resources (such as ICU beds, maternity care, or specific blood components).

**Swastha Setu ("Health Bridge")** bridges this gap by transforming healthcare discovery into a natural, conversational experience:
1. **Zero Linguistic Barriers**: Citizens interact naturally through voice in 9 major Indian languages.
2. **Immediate Health Triage**: Immediate, structured symptom assessment that classifies urgency and provides step-by-step guidance before visiting a clinic.
3. **Verified Infrastructure Access**: Direct navigation to verified public healthcare institutions (AIIMS, District Civil Hospitals, Community Health Centers, Primary Health Centers), live community health facilities, and emergency blood banks.
4. **Resilient in Low-Connectivity**: Built with an offline-first, low-bandwidth architecture so that essential guidance is accessible even in remote areas with 2G/3G networks.

---

## 🌟 Comprehensive Feature Overview

### 1. 🎙️ Multilingual Neural Voice Assistant
- **Voice-In, Voice-Out Interaction**: Users can simply tap and describe their health concerns naturally. The system transcribes spoken regional dialects and responds with natural-sounding native voice guidance.
- **9 Indian Regional Languages**: Comprehensive support across major linguistic zones:
  - **Telugu** (`తెలుగు`)
  - **Hindi** (`हिन्दी`)
  - **Tamil** (`தமிழ்`)
  - **Kannada** (`ಕನ್ನಡ`)
  - **Bengali** (`বাংলা`)
  - **Marathi** (`मराठी`)
  - **Gujarati** (`ગુજરાતી`)
  - **Odia** (`ଓଡ଼ିଆ`)
  - **Indian English**
- **Dynamic Symptom Talk-Back**: Listens to symptoms, intelligently parses clinical concerns, and converses with tailored, empathetic guidance in the selected language.
- **Synchronized Subtitle Highlighting**: Real-time visual tracking highlights words synchronously as the voice agent speaks, aiding users with varying literacy levels.
- **Dual Voice & Text Flexibility**: Full support for speaking, reviewing, editing, or typing symptoms at any stage.

---

### 2. 🛡️ Acoustic Echo Isolation & Audio Protection
- **Intelligent Microphone Control**: Prevents feedback loops by automatically muting and pausing audio capture the moment the voice assistant begins speaking.
- **Acoustic Reverberation Buffer**: Incorporates a cooldown period after speech playback to prevent ambient room echo or speaker sound from triggering false inputs.
- **One-Tap Interruption**: Users can interrupt the assistant at any point with a single tap, instantly stopping audio playback and reopening the microphone for seamless two-way dialogue.

---

### 3. ⚡ Instant Geolocation & Intelligent Language Detection
- **Multi-Channel Region Resolution**: Resolves user location rapidly through a combination of browser locale analysis, server-side geographic lookup, and high-precision GPS pinpointing.
- **Automatic State-to-Language Mapping**: Intelligently pre-selects the primary regional language based on the user's location upon arrival (e.g., Telangana/Andhra Pradesh to Telugu, Maharashtra to Marathi, Tamil Nadu to Tamil, etc.).
- **Fluid Language Switching**: Users can manually switch their language at any time from the persistent navigation bar without losing their assessment progress.

---

### 4. 🏥 Grounded Healthcare Facilities & Hospital Locator
- **Verified Public & Private Healthcare Network**: Connects users to hundreds of verified government institutions—including AIIMS, State Medical Colleges, District Civil Hospitals, Community Health Centers (CHCs), and Primary Health Centers (PHCs)—alongside live community-mapped private clinics.
- **Automatic Proximity Sorting**: Automatically calculates distance using high-precision geospatial coordinates and presents facilities ordered from closest to furthest.
- **Resource & Facility Filtering**:
  - Filter by facility ownership (Government Public Hospitals vs. Private Facilities).
  - Filter by 24/7 Emergency & Intensive Care Units (ICU).
  - Search by facility name, district, or medical specialty.
- **One-Touch Emergency Action**: Direct access to hospital emergency phone lines and integrated map navigation.

---

### 5. 🩸 Emergency Blood Bank Matrix
- **Blood Group & Component Availability**: Dedicated portal to search and locate blood banks with specific blood groups (including universal donors $O^-$ and rare types) as well as specialized blood components such as Platelets (SDP/RDP) and Fresh Frozen Plasma (FFP).
- **Proximity-Grounded Matrix**: Computes distance relative to the user's current location with instant 1-tap calling for emergency reserves.

---

### 6. 📋 Intelligent Multilingual Clinical Health Triage
- **Clinical Urgency Assessment**: Categorizes health conditions into clear urgency tiers:
  - **Emergency / Critical**: Immediate life-saving intervention needed (e.g., severe chest pain, acute respiratory distress, severe trauma, stroke symptoms, venomous bites).
  - **High Urgency**: Prompt medical attention required within hours.
  - **Moderate Urgency**: Requires evaluation by a general physician or specialist within 24–48 hours.
  - **Low Urgency / Routine**: Self-care guidance, preventive measures, or routine PHC consultation.
- **Comprehensive Multilingual Guidance**: Generates localized, culturally contextualized clinical reasoning, recommended timeframe, appropriate hospital tier (PHC vs. District Hospital vs. Tertiary Trauma Center), and numbered step-by-step action plans.
- **Full Voice Narration of Medical Reports**: The voice assistant reads out the entire triage assessment—including the primary finding, recommended steps, nearest facility details, and contact numbers—in the user's native language.

---

### 7. 🚀 Low-Latency & Offline-First Resilience
- **Instant Client-Side Assessment Fallback**: If network connectivity drops or experiences high latency, the triage assessment continues uninterrupted locally in the browser.
- **Progressive Web App (PWA) Offline Caching**: Core resources, navigation structures, and triage logic are cached locally, allowing the application to launch and function in remote rural areas with poor connectivity.
- **Dual Voice Architecture**: Features seamless fallback to native on-device speech synthesis and recognition if cloud speech services become unreachable.

---

## 🎨 Inclusive Design System — "Warm Trust"

Swastha Setu is designed with the **"Warm Trust"** visual philosophy—prioritizing visual comfort, emotional calm, and clarity during medical distress:

- **Deep Forest Teal**: Symbolizes government-grade trust, clinical safety, and verified public infrastructure.
- **Warm Terracotta**: Highlights primary calls to action, urgent navigation paths, and distance metrics.
- **Urgent Crimson**: Reserved strictly for high-urgency emergency warnings and national 108 emergency bar alerts.
- **Warm Cream & Pure White**: Soft, accessible card surfaces that minimize eye strain in varied lighting conditions.
- **Universal Indic Typography Stack**: High-legibility font rendering across all 9 Indic scripts, ensuring consistent baseline alignment, readable font weights, and layout stability across desktop and mobile screens.

---

## 🗺️ Supported Indian Regional Languages

| Language | Script | Native Name | Primary Coverage Regions |
|---|---|---|---|
| **Telugu** | తెలుగు | తెలుగు | Telangana, Andhra Pradesh |
| **Hindi** | Devanagari | हिन्दी | Delhi NCR, Uttar Pradesh, Bihar, MP, Rajasthan, Haryana, etc. |
| **Tamil** | தமிழ் | தமிழ் | Tamil Nadu, Puducherry |
| **Kannada** | ಕನ್ನಡ | ಕನ್ನಡ | Karnataka |
| **Bengali** | বাংলা | বাংলা | West Bengal, Tripura |
| **Marathi** | Devanagari | मराठी | Maharashtra, Goa |
| **Gujarati** | ગુજરાતી | ગુજરાતી | Gujarat |
| **Odia** | ଓଡ଼ିଆ | ଓଡ଼ିଆ | Odisha |
| **Indian English** | Latin | English | Pan-India & Global |

---

## 🔄 User Journey: How It Works

```
1. Open Swastha Setu
   │
   ▼
2. Automatic Location & Language Detection (User's Native Language Auto-Selected)
   │
   ▼
3. Express Health Concern (Speak naturally into microphone or type)
   │
   ▼
4. Real-Time Neural Triage Processing (Urgency Evaluation & Risk Classification)
   │
   ▼
5. Multilingual Guidance & Voice Narration (Action Steps read aloud in regional dialect)
   │
   ▼
6. Discover Nearest Healthcare Facility & Blood Banks (1-Tap Call & Map Navigation)
```

---

## 💻 Conceptual Architecture

- **Frontend Interface**: High-performance, responsive Single-Page Application optimized for mobile-first rural usage.
- **Speech Processing Layer**: Neural Text-to-Speech (TTS) and Speech-to-Text (STT) models fine-tuned on Indic regional accents and vocabularies.
- **Clinical Triage Engine**: Rule-based and semantic symptom evaluation engine adhering to standard emergency health triage guidelines.
- **Geospatial & Facility Service**: Spatial indexing and deduplication engine that integrates public government hospital databases and real-time open geospatial mappings.
- **Resilience Layer**: Service worker cache management and client-side computational fallbacks for offline-ready operation.

---

## 🚀 Getting Started

### Method 1: Containerized Deployment (Recommended)

Run the entire application stack in an isolated containerized environment:

```bash
# Clone the repository
git clone https://github.com/SreeshanthReddy46/Swastha-setu.git
cd Swastha-setu

# Start with Docker Compose
docker compose up --build
```
Access the application at `http://localhost:3000`.

---

### Method 2: Local Development Setup

#### Prerequisites
- Node.js (v18.x or higher)
- npm, yarn, or pnpm package manager

#### Setup & Execution
```bash
# Install dependencies
npm install

# Launch the development server
npm run dev
```
Open `http://localhost:3000` in your web browser.

#### Optional Speech Configuration
To use neural cloud speech models, you can configure your API credentials in your local environment file (`.env.local`). If credentials are not provided, the platform automatically utilizes browser-native speech synthesis and speech recognition as a seamless fallback.

#### Building for Production
```bash
# Build the production application
npm run build

# Start the production server
npm run start
```

---

## ⚠️ Public Health Safety & Scope Boundaries

Swastha Setu is designed solely as a public health navigation, symptom triage, and facility discovery tool:
- **Not a Medical Diagnostic Device**: It assesses symptom urgency to guide timely facility visits. It does not replace definitive medical diagnostics, lab testing, or clinical consultations.
- **Not a Doctor Replacement**: Its primary purpose is to direct patients to certified healthcare professionals and verified hospitals.
- **Emergency Situations**: In life-threatening emergencies, citizens should immediately dial **108** (Emergency Ambulance) or **112** (National Emergency Number).

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
