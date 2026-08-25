import { NextRequest, NextResponse } from 'next/server';
import { Language } from '@/lib/language-context';
import { getSarvamVoiceConfig, SARVAM_VOICE_MATRIX } from '@/lib/sarvam-config';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob | null;
    const languageStr = formData.get('language') as string | null;
    const prompt = formData.get('prompt') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Audio file is required for transcription.' },
        { status: 400 }
      );
    }

    const lang: Language = (languageStr && languageStr in SARVAM_VOICE_MATRIX)
      ? (languageStr as Language)
      : 'en';
    const config = getSarvamVoiceConfig(lang);

    const apiKey = process.env.SARVAM_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'SARVAM_API_KEY not configured. Falling back to browser SpeechRecognition.',
        language: lang
      });
    }

    // Prepare multipart form data for Sarvam Saaras STT API
    const sarvamFormData = new FormData();
    // Convert Blob into a File format expected by Sarvam
    const audioFile = new File([file], 'recording.wav', { type: file.type || 'audio/wav' });
    sarvamFormData.append('file', audioFile);
    sarvamFormData.append('language_code', config.sarvamCode);
    sarvamFormData.append('model', 'saaras:v3');
    sarvamFormData.append('mode', 'transcribe');
    if (prompt) {
      sarvamFormData.append('prompt', prompt);
    }

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey
      },
      body: sarvamFormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Sarvam STT API error status ${response.status}:`, errorText);
      return NextResponse.json({
        success: false,
        fallback: true,
        error: `Sarvam STT API error: ${response.statusText}`,
        details: errorText,
        language: lang
      });
    }

    const data = await response.json();
    const transcript = data.transcript || '';

    return NextResponse.json({
      success: true,
      transcript,
      language_code: data.language_code || config.sarvamCode,
      language: lang
    });
  } catch (error) {
    console.error('Error in /api/voice/stt route:', error);
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error instanceof Error ? error.message : 'Internal speech recognition error'
      },
      { status: 500 }
    );
  }
}
