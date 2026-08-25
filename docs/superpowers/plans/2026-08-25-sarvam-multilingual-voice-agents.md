# Sarvam Multilingual Voice Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Sarvam AI neural text-to-speech (Bulbul) and speech-to-text (Saaras) across all 9 supported Indian languages (`en`, `hi`, `te`, `ta`, `kn`, `bn`, `mr`, `gu`, `or`) in Swastha Setu with seamless browser fallbacks.

**Architecture:** Server-side Next.js route handlers (`/api/voice/tts` and `/api/voice/stt`) securely invoke Sarvam AI endpoints with native speaker mappings (`pavithra`, `meera`, `iniya`, `sapna`, `tanishaa`, `aarohi`, `dhwani`, `roopa`, `arvind`). Client-side voice engine coordinates audio playback with HTML5 Audio, synchronized subtitle highlighting across all scripts, and microphone audio capture with fallback to Web Speech API.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Sarvam AI REST APIs (`bulbul:v3`, `saaras:v3`), Web Audio API, MediaRecorder API, Lucide React.

## Global Constraints
- Support all 9 project languages: English (`en`), Hindi (`hi`), Telugu (`te`), Tamil (`ta`), Kannada (`kn`), Bengali (`bn`), Marathi (`mr`), Gujarati (`gu`), Odia (`or`).
- Preserve zero-downtime offline and missing-API-key fallback.
- Never expose `SARVAM_API_KEY` on client-side; always proxy via Next.js backend API routes.

---

### Task 1: Environment Setup & Sarvam Types / Speaker Mappings

**Files:**
- Create: `.env.local.example`
- Create: `.env.local`
- Create: `lib/sarvam-config.ts`

**Interfaces:**
- Produces: `SARVAM_VOICE_CONFIG`, `SarvamSpeaker`, `SarvamLanguageCode`, `getSarvamSpeakerForLanguage`

- [ ] **Step 1: Create `lib/sarvam-config.ts` with comprehensive type definitions and speaker mapping for all 9 languages**
- [ ] **Step 2: Create `.env.local.example` and `.env.local` containing `SARVAM_API_KEY=`**
- [ ] **Step 3: Verify TypeScript compilation of config**

---

### Task 2: Next.js Backend API Route for Sarvam TTS (`/api/voice/tts`)

**Files:**
- Create: `app/api/voice/tts/route.ts`

**Interfaces:**
- Consumes: `SARVAM_VOICE_CONFIG`, `lib/sarvam-config.ts`
- Produces: `POST /api/voice/tts` returning `{ audioBase64: string, format: string, speaker: string, language: string }`

- [ ] **Step 1: Implement `app/api/voice/tts/route.ts` with input validation, Sarvam Bulbul API call, audio caching, and error handling**
- [ ] **Step 2: Add audio sanitization and language script preprocessing**
- [ ] **Step 3: Test route response structure and fallback behavior**

---

### Task 3: Next.js Backend API Route for Sarvam STT (`/api/voice/stt`)

**Files:**
- Create: `app/api/voice/stt/route.ts`

**Interfaces:**
- Consumes: `lib/sarvam-config.ts`
- Produces: `POST /api/voice/stt` returning `{ transcript: string, language_code: string }`

- [ ] **Step 1: Implement `app/api/voice/stt/route.ts` handling `multipart/form-data` audio blob upload and forwarding to Sarvam Saaras STT API**
- [ ] **Step 2: Implement language detection & transcription error recovery**
- [ ] **Step 3: Test route response handling**

---

### Task 4: Voice Engine Client Refactor (`lib/voice-assistant-engine.ts`)

**Files:**
- Modify: `lib/voice-assistant-engine.ts`

**Interfaces:**
- Consumes: `/api/voice/tts`, `/api/voice/stt`, `lib/sarvam-config.ts`
- Produces: `speakTextInLanguage`, `stopVoiceSpeech`, `recordUserVoiceWithSarvam`, `getVoiceAgentGreeting`, `getVoiceAgentSymptomAck`, `getVoiceEmergencyGuidelines`

- [ ] **Step 1: Update `speakTextInLanguage` to stream/play Sarvam base64 audio via HTML5 Audio with precise word boundary timing**
- [ ] **Step 2: Add microphone recorder utility to stream audio chunks to `/api/voice/stt`**
- [ ] **Step 3: Ensure robust fallback to Web Speech API when offline or when no key is set**
- [ ] **Step 4: Update greetings and conversational symptom acknowledgments across all 9 native Indian languages**

---

### Task 5: Voice Triage Component Integration (`app/(app)/components/VoiceInput.tsx`)

**Files:**
- Modify: `app/(app)/components/VoiceInput.tsx`

**Interfaces:**
- Consumes: `lib/voice-assistant-engine.ts`, `useLanguage`

- [ ] **Step 1: Connect mic button to `recordUserVoiceWithSarvam` for Sarvam STT transcription**
- [ ] **Step 2: Update AI Voice Assistant talk-back to immediately speak native greeting when language changes**
- [ ] **Step 3: Verify real-time synchronized word highlighting with Sarvam audio playback**
- [ ] **Step 4: Ensure all 9 language presets trigger native Sarvam voice talk-back**

---

### Task 6: Triage Results & Emergency SOS Integration

**Files:**
- Modify: `app/(app)/result/[id]/page.tsx`
- Modify: `components/EmergencySOSModal.tsx`

**Interfaces:**
- Consumes: `speakTextInLanguage`, `stopVoiceSpeech`, `useLanguage`

- [ ] **Step 1: Update TTS guidance button on Triage Results page to speak clinical analysis and nearest hospital recommendations using native Sarvam voice**
- [ ] **Step 2: Update Emergency SOS Modal to play 108 emergency guidelines in the active native language using Sarvam voice**
- [ ] **Step 3: Verify mute/stop audio controls across all pages**

---

### Task 7: Verification & Build Validation

**Files:**
- Verify all modified files

- [ ] **Step 1: Run TypeScript typecheck (`npx tsc --noEmit`) to verify 0 errors**
- [ ] **Step 2: Run `npm run build` to verify production build succeeds**
- [ ] **Step 3: Test voice interaction across multiple languages (Telugu, Hindi, Tamil, Kannada, Bengali, etc.)**
