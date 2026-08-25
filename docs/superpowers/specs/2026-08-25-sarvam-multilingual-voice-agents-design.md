# Sarvam Multilingual Voice Agents Architecture & Design

## 1. Overview
Swastha Setu is a voice-first public healthcare triage and emergency hospital locator built for citizens across India. To ensure accessible, crystal-clear, and natural communication in rural and semi-urban communities, all voice interactions across the application are powered by **Sarvam AI**'s state-of-the-art Indian language models (**Bulbul TTS** for neural speech synthesis and **Saaras STT** for speech recognition).

This design specification details the full-pipeline integration supporting all **9 Indian languages** present in the project (`en`, `hi`, `te`, `ta`, `kn`, `bn`, `mr`, `gu`, `or`).

---

## 2. Supported Languages & Native Sarvam Voice Matrix

Each language is mapped to its exact BCP-47 tag and optimal native Sarvam speaker persona:

| Code | Native Name | English Name | BCP-47 Code | Sarvam TTS Speaker Persona | Voice Characteristics |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `te` | తెలుగు | Telugu | `te-IN` | `pavithra` / `chitra` | Warm, clear native Andhra & Telangana diction |
| `hi` | हिंदी | Hindi | `hi-IN` | `meera` / `shubh` | Natural North Indian Hindi conversational tone |
| `ta` | தமிழ் | Tamil | `ta-IN` | `iniya` / `priya` | Clear Tamil Nadu regional articulation |
| `kn` | ಕನ್ನಡ | Kannada | `kn-IN` | `sapna` / `gagan` | Gentle, reassuring Karnataka native cadence |
| `bn` | বাংলা | Bengali | `bn-IN` | `tanishaa` / `amartya` | Expressive West Bengal regional rhythm |
| `mr` | मराठी | Marathi | `mr-IN` | `aarohi` / `manohar` | Crisp, natural Maharashtra Marathi pronunciation |
| `gu` | ગુજરાતી | Gujarati | `gu-IN` | `dhwani` / `niranjan` | Fluent, friendly Gujarati voice |
| `or` | ଓଡ଼ିଆ | Odia | `od-IN` | `roopa` / `shubh` | Authentic Odia phonetics and cadence |
| `en` | English | Indian English | `en-IN` | `arvind` / `shubh` | Clear Indian English healthcare professional tone |

---

## 3. End-to-End Architectural Pipeline

### 3.1 Next.js Backend API Routes

#### A. Text-to-Speech Route: `/api/voice/tts`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "text": "నమస్కారం! మీ ఆరోగ్య సమస్యలను చెప్పండి.",
    "language": "te",
    "speaker": "pavithra",
    "pace": 0.95
  }
  ```
- **Execution Flow**:
  1. Validates input text and maps application language code (`te`, `hi`, etc.) to Sarvam BCP-47 code (`te-IN`, `hi-IN`, `od-IN`, etc.).
  2. Resolves preferred Sarvam speaker for that language.
  3. Checks backend in-memory cache for synthesized audio buffer (avoids duplicate API calls for static greetings, SOS alerts, and frequent phrases).
  4. If uncached, sends a secure server-side request to `https://api.sarvam.ai/text-to-speech` with header `api-subscription-key: process.env.SARVAM_API_KEY`.
  5. If `SARVAM_API_KEY` is missing or API fails, returns status indicating client should invoke browser speech synthesis fallback.
  6. Returns JSON: `{ "audioBase64": "...", "format": "audio/wav", "speaker": "pavithra", "language": "te" }`.

#### B. Speech-to-Text Route: `/api/voice/stt`
- **Method**: `POST`
- **Payload**: `FormData` containing:
  - `file`: Audio recording blob (`audio/webm`, `audio/wav`, or `audio/mp4`).
  - `language`: Target language code (e.g., `te`, `hi`).
  - `prompt`: Optional medical context prompt for enhanced accuracy.
- **Execution Flow**:
  1. Extracts audio file and translates language code to Sarvam format (`te-IN`, etc.).
  2. Constructs multipart request to Sarvam Saaras STT API `https://api.sarvam.ai/speech-to-text`.
  3. Uses `model: "saaras:v3"` with `mode: "transcribe"`.
  4. Returns transcribed text in the user's native script: `{ "transcript": "నాకు 3 రోజులుగా తీవ్రమైన జ్వరం ఉంది", "language_code": "te-IN" }`.

---

### 3.2 Client-Side Voice Engine (`lib/voice-assistant-engine.ts`)

- **Audio Playback Engine**:
  - `speakTextInLanguage(text, lang, onStart, onEnd, onError, onWordBoundary)`:
    - Initiates playback via Sarvam TTS `/api/voice/tts`.
    - Automatically controls HTML5 `Audio` element with Web Audio API.
    - Accurately synchronizes word highlights across all 9 scripts (Telugu, Devanagari, Tamil, Kannada, Bengali, Gujarati, Odia, Latin).
    - If network fails or API key is absent, smoothly falls back to browser's `SpeechSynthesis` without crashing.
- **Audio Recording Engine**:
  - `recordUserVoice(lang, onInterimResult, onFinalTranscript, onError)`:
    - Records high-quality audio using `MediaRecorder` API.
    - Concurrently uses Web Speech API for real-time live interim preview text on supporting browsers.
    - When recording completes, transmits audio blob to `/api/voice/stt` to obtain Sarvam Saaras AI transcription.
- **Stop & Clean Mechanism**:
  - `stopVoiceSpeech()`: Instantly mutes both HTML5 audio and browser speech synthesis.

---

## 4. Application Touchpoints & Voice Experience

1. **Voice-First Triage (`app/(app)/components/VoiceInput.tsx`)**:
   - Immediate native voice greeting whenever the user switches language or opens the page.
   - Animated audio visualizer during mic recording.
   - Real-time conversational talk-back acknowledging symptoms in the native language using Sarvam voice.
   - Quick one-tap native voice preset buttons for rural users.
2. **Clinical Triage Results (`app/(app)/result/[id]/page.tsx`)**:
   - "Listen in Clear Audio (TTS)" button speaks clinical reasoning, urgency category, and closest hospital contact details in the user's native language using Sarvam voice.
   - Synchronized word-by-word highlight subtitle banner while audio is playing.
3. **Emergency SOS (`components/EmergencySOSModal.tsx`)**:
   - Multilingual voice guidelines for 108 ambulance dispatch in the selected native language.
4. **Global Language Switcher**:
   - Selecting a new language updates all UI text and voice agents, with immediate voice greeting feedback.

---

## 5. Error Handling & Offline Resilience

- If `SARVAM_API_KEY` is not provided in environment variables:
  - System logs a warning and automatically falls back to browser `speechSynthesis` and Web Speech API.
- If audio playback is blocked by browser autoplay policy:
  - System captures user click interaction to unlock audio context.
- If user denies microphone permissions:
  - UI offers one-tap native spoken preset prompts.

---

## 6. Verification Plan

1. **API Routes Verification**:
   - Test `/api/voice/tts` and `/api/voice/stt` responses for all 9 languages.
2. **Interactive UI Verification**:
   - Verify speech synthesis across all 9 languages on Voice Triage and Triage Results pages.
   - Verify 108 Emergency SOS audio in native languages.
   - Verify graceful fallback when key is not present.
3. **Build & Lint Verification**:
   - Run `npm run build` and TypeScript check to verify zero compilation errors.
