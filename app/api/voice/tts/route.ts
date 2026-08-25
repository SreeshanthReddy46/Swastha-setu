import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/lib/language-context';
import { getSarvamVoiceConfig, SARVAM_VOICE_MATRIX } from '@/lib/sarvam-config';

// In-memory LRU audio cache for instant playback of repeated greetings/alerts
const audioCache = new Map<string, { audioBase64: string; timestamp: number }>();
const MAX_CACHE_ENTRIES = 150;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanTextForTTS(text: string): string {
  return text
    .replace(/[*#_`~[\]()]/g, ' ') // Strip markdown formatting
    .replace(/https?:\/\/\S+/g, '') // Strip URLs
    .replace(/\s+/g, ' ') // Collapse extra whitespace
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, language, speaker, pace } = body as {
      text?: string;
      language?: Language;
      speaker?: string;
      pace?: number;
    };

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Text prompt is required.' },
        { status: 400 }
      );
    }

    const lang: Language = (language && language in SARVAM_VOICE_MATRIX) ? language : 'en';
    const config = getSarvamVoiceConfig(lang);
    const selectedSpeaker = speaker || config.defaultSpeaker;
    const selectedPace = typeof pace === 'number' && pace >= 0.5 && pace <= 2.0 ? pace : config.pace;
    const cleanText = cleanTextForTTS(text).slice(0, 2000); // Respect character limit

    const cacheKey = `${lang}:${selectedSpeaker}:${selectedPace}:${cleanText}`;

    // Check cache
    const cached = audioCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return NextResponse.json({
        success: true,
        audioBase64: cached.audioBase64,
        format: 'audio/wav',
        language: lang,
        speaker: selectedSpeaker,
        cached: true
      });
    }

    const apiKey = process.env.SARVAM_API_KEY?.trim();

    if (!apiKey) {
      // Graceful fallback signal to client when API key is not configured
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'SARVAM_API_KEY is not configured. Falling back to native browser speech synthesis.',
        language: lang,
        speaker: selectedSpeaker
      });
    }

    // Call Sarvam AI Text-to-Speech API
    const sarvamPayload = {
      inputs: [cleanText],
      target_language_code: config.sarvamCode,
      speaker: selectedSpeaker,
      pace: selectedPace,
      speech_sample_rate: config.sampleRate,
      enable_preprocessing: config.speechPreprocessing,
      model: config.model
    };

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey
      },
      body: JSON.stringify(sarvamPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Sarvam TTS API responded with status ${response.status}:`, errorText);
      return NextResponse.json({
        success: false,
        fallback: true,
        error: `Sarvam API error: ${response.statusText}`,
        details: errorText,
        language: lang
      });
    }

    const data = await response.json();
    const audioBase64 = data.audios && data.audios.length > 0 ? data.audios[0] : null;

    if (!audioBase64) {
      return NextResponse.json({
        success: false,
        fallback: true,
        error: 'No audio returned from Sarvam AI.',
        language: lang
      });
    }

    // Save to cache (evicting oldest if capacity reached)
    if (audioCache.size >= MAX_CACHE_ENTRIES) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, {
      audioBase64,
      timestamp: Date.now()
    });

    return NextResponse.json({
      success: true,
      audioBase64,
      format: 'audio/wav',
      language: lang,
      speaker: selectedSpeaker,
      cached: false
    });
  } catch (error) {
    console.error('Error in /api/voice/tts route:', error);
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error instanceof Error ? error.message : 'Internal voice server error'
      },
      { status: 500 }
    );
  }
}
