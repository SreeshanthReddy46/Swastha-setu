import { NextResponse } from 'next/server';
import { evaluateSymptoms } from '@/lib/triage-engine';
import { Language } from '@/lib/language-context';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms = [], transcription = '', userLat, userLng, language = 'en' } = body;

    if (!Array.isArray(symptoms) && !transcription) {
      return NextResponse.json(
        { error: 'Invalid input. Provide symptoms array or transcription text.' },
        { status: 400 }
      );
    }

    const triageResult = evaluateSymptoms(
      symptoms, 
      transcription, 
      userLat, 
      userLng, 
      language as Language
    );
    
    return NextResponse.json(triageResult, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process triage analysis' }, { status: 500 });
  }
}
