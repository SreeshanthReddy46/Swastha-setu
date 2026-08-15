# Technical Design: Personalized Prescription & Care Instructions Page & Clean Navbar Fix

**Date:** 2026-08-12  
**Status:** Approved / Ready for Implementation  
**Author:** Antigravity  

---

## 1. Overview & Goals

This specification covers two critical improvements:
1. **Clean, Non-Overlapping Navbar:** Solve the layout defect where lengthy multilingual nav links wrap, expand vertically, and cover page content across all viewport sizes. Streamline the navigation to a clean, focused hierarchy and add reliable top-padding to the marketing layout.
2. **Personalized Prescription & Care Instructions Page (`/instructions`):** A unique, clean, and accessible healthcare instruction portal that converts user-entered prescription data, symptoms, and doctor notes into structured, visual, time-of-day medication schedules, dietary rules, drug safety alerts, multilingual audio instructions, and printable patient care cards.

---

## 2. Issue Analysis & Navbar Redesign

### Current Defect
- The current navbar contains 8+ marketing anchor links (`Home`, `About`, `How it works`, `Features`, `Impact`, `FAQ`, `Get involved`, `Contact`) plus `Blood Banks`, the `Language selector`, and `Get Started CTA`.
- In Indian languages (Telugu, Hindi, Kannada, Odia, Bengali, Tamil, etc.), text strings are lengthy (e.g., *"తరచుగా అడిగే ప్రశ్నలు"*, *"పాలుపంచుకోండి"*), causing the nav container to wrap into multiple rows.
- Because the header is `fixed`, this expanded height obscures hero headings, CTA buttons, and top content on marketing pages.

### Solution
1. **Streamlined Navigation Items:** Consolidate navigation links into high-value primary routes:
   - `Home` (`/`)
   - `Voice Check-up` (`/check-up`)
   - `Prescription Guide` (`/instructions`) ✨
   - `Hospital Locator` (`/locator`)
   - `Blood Banks` (`/blood-banks`)
   - `About` (`/about`)
2. **Responsive Architecture:**
   - Desktop (`xl:`): Single clean flex row with `whitespace-nowrap`, compact paddings, and smooth glassmorphic pill background.
   - Tablet / Mobile (`<xl:`): Clean mobile hamburger drawer with quick language selector, blood bank badge, and all links accessible without cluttering the main bar.
3. **Layout Spacing Fix:**
   - Add consistent top spacing (`pt-20 sm:pt-24`) to `<main>` in `app/(marketing)/layout.tsx` so page content is never covered by the fixed header.
   - Adjust `app/(marketing)/page.tsx` and sub-pages to remove conflicting duplicate padding.

---

## 3. Prescription & Care Instructions Architecture (`/instructions`)

### 3.1 User Experience & Input Methods
The page provides 3 frictionless input pathways:
1. **🎙️ Voice Prescription Intake:** Record spoken prescriptions or doctor advice in any of the 9 supported languages (Telugu, Hindi, English, Tamil, Kannada, Marathi, Bengali, Gujarati, Odia).
2. **📝 Quick Prescription Builder / Text Decoder:** Enter or paste medicine names, dosage numbers, frequency (e.g., `1-0-1`, `1-0-0`, `0-0-1`), meal timing (`Before Food` / `After Food`), and duration (e.g., `5 days`).
3. **⚡ 1-Click Clinical Presets & Triage Sync:**
   - Instant 1-click loading of standard clinical regimens (e.g., *Fever & Acute Infection*, *Gastroenteritis & ORS*, *Hypertension Maintenance*, *Type 2 Diabetes*, *Asthma & Bronchitis*, *Pain & Inflammation*).
   - Seamless 1-click bridge from `/result/[id]` (Triage Assessment) to auto-populate symptoms and generate tailored care instructions.

### 3.2 Clinical Instruction Intelligence Engine (`lib/prescription-engine.ts`)
A robust parser and rule engine that evaluates entered medicines and symptoms to generate:
- **🕒 Visual Time-of-Day Schedule Matrix:**
  - 🌅 **Morning (6:00 AM – 9:00 AM):** Before Breakfast / After Breakfast doses.
  - ☀️ **Afternoon (1:00 PM – 2:00 PM):** Lunch doses.
  - 🌙 **Night (8:00 PM – 10:00 PM):** After Dinner / Bedtime doses.
  - Distinct pill shape icons, color tags, and dosage strength badges.
- **🥗 Contextual Dietary Do's and Don'ts:**
  - Tailored to specific drugs (e.g., do not take iron/calcium supplements with milk or tea; take NSAIDs/painkillers strictly after food with a full glass of water; increase oral hydration to 3L for fever/antibiotics).
- **⚠️ Drug Interactions & Safety Guidelines:**
  - Clear alerts on common expected side effects (e.g., yellow urine from B-complex, slight drowsiness) vs. abnormal reactions.
- **🛑 Emergency Stop-Medicine Red Flags:**
  - Specific symptoms requiring immediate discontinuation and emergency care (e.g., skin rashes, wheezing, swelling of face/lips, severe dizziness).
- **🗣️ Multilingual Audio Guidance (TTS):**
  - Synthesizes the full dosage plan into clear spoken audio in the patient's language.
- **✅ Daily Dose Tracker Checklist:**
  - Interactive checkboxes allowing the patient or ASHA worker to mark doses taken for the day, saved in `localStorage`.
- **🖨️ Printable & Shareable Patient Slip:**
  - Print-friendly, high-contrast prescription care slip formatted for patients and ASHA health workers.

---

## 4. Component Structure

- `app/(app)/instructions/page.tsx`: The main interactive Prescription & Care Instructions experience.
- `lib/prescription-engine.ts`: Core data structures, clinical presets, prescription parser, dietary rules, and safety cross-referencing.
- `app/(marketing)/components/Header.tsx`: Cleaned and modernized non-overlapping navbar.
- `app/(marketing)/layout.tsx`: Fixed top padding offset.
- `app/(app)/result/[id]/page.tsx`: Direct CTA button linking to `/instructions` with prefilled triage context.
- `lib/language-context.tsx`: Multilingual translation keys for all instruction components.

---

## 5. Verification Plan

1. **Visual & Responsive Verification:**
   - Test navbar across Telugu, Hindi, English, and other languages to ensure zero wrapping or content covering.
   - Verify mobile menu and desktop navbar on viewports from 360px to 1920px.
2. **Functional Prescription Engine Tests:**
   - Test custom prescription entry (voice + text + preset).
   - Verify time-of-day grouping, meal timing badges, and dietary rules.
   - Verify interactive daily dose checkboxes and state persistence.
   - Verify speech synthesis (TTS) in multiple languages.
   - Verify print view styling.
3. **Build & Lint Verification:**
   - Run `npm run build` or Next.js build validation to ensure zero type errors or broken links.
