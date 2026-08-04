import { NextResponse } from 'next/server';
import { evaluateSymptoms } from '@/lib/triage-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symptoms = [], transcription = '' } = body;

    if (!Array.isArray(symptoms) && !transcription) {
      return NextResponse.json(
        { error: 'Invalid input. Provide symptoms array or transcription text.' },
        { status: 400 }
      );
    }

    const triageResult = evaluateSymptoms(symptoms, transcription);
    return NextResponse.json(triageResult);
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to process triage analysis' }, { status: 500 });
  }
}
