import { Language } from './language-context';

export type SarvamLanguageCode =
  | 'te-IN'
  | 'hi-IN'
  | 'ta-IN'
  | 'kn-IN'
  | 'bn-IN'
  | 'mr-IN'
  | 'gu-IN'
  | 'od-IN'
  | 'en-IN';

export interface SarvamLanguageVoiceConfig {
  sarvamCode: SarvamLanguageCode;
  bcp47: string;
  defaultSpeaker: string;
  alternateSpeakers: string[];
  gender: 'female' | 'male';
  model: 'bulbul:v3' | 'bulbul:v2';
  pace: number;
  sampleRate: number;
  speechPreprocessing: boolean;
  label: string;
  nativeLabel: string;
}

export const SARVAM_VOICE_MATRIX: Record<Language, SarvamLanguageVoiceConfig> = {
  te: {
    sarvamCode: 'te-IN',
    bcp47: 'te-IN',
    defaultSpeaker: 'pavithra',
    alternateSpeakers: ['chitra', 'mohan', 'shubh'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Telugu',
    nativeLabel: 'తెలుగు'
  },
  hi: {
    sarvamCode: 'hi-IN',
    bcp47: 'hi-IN',
    defaultSpeaker: 'meera',
    alternateSpeakers: ['shubh', 'ritu', 'aditya'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Hindi',
    nativeLabel: 'हिंदी'
  },
  ta: {
    sarvamCode: 'ta-IN',
    bcp47: 'ta-IN',
    defaultSpeaker: 'iniya',
    alternateSpeakers: ['priya', 'valluvar', 'shubh'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Tamil',
    nativeLabel: 'தமிழ்'
  },
  kn: {
    sarvamCode: 'kn-IN',
    bcp47: 'kn-IN',
    defaultSpeaker: 'sapna',
    alternateSpeakers: ['gagan', 'shubh', 'roopa'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ'
  },
  bn: {
    sarvamCode: 'bn-IN',
    bcp47: 'bn-IN',
    defaultSpeaker: 'tanishaa',
    alternateSpeakers: ['amartya', 'shubh', 'ananya'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Bengali',
    nativeLabel: 'বাংলা'
  },
  mr: {
    sarvamCode: 'mr-IN',
    bcp47: 'mr-IN',
    defaultSpeaker: 'aarohi',
    alternateSpeakers: ['manohar', 'shubh', 'meera'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Marathi',
    nativeLabel: 'मराठी'
  },
  gu: {
    sarvamCode: 'gu-IN',
    bcp47: 'gu-IN',
    defaultSpeaker: 'dhwani',
    alternateSpeakers: ['niranjan', 'shubh', 'ritu'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Gujarati',
    nativeLabel: 'ગુજરાતી'
  },
  or: {
    sarvamCode: 'od-IN', // Sarvam uses od-IN for Odia
    bcp47: 'or-IN',
    defaultSpeaker: 'roopa',
    alternateSpeakers: ['shubh', 'meera', 'aditya'],
    gender: 'female',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Odia',
    nativeLabel: 'ଓଡ଼ିଆ'
  },
  en: {
    sarvamCode: 'en-IN',
    bcp47: 'en-IN',
    defaultSpeaker: 'arvind',
    alternateSpeakers: ['shubh', 'meera', 'aditya'],
    gender: 'male',
    model: 'bulbul:v3',
    pace: 0.95,
    sampleRate: 22050,
    speechPreprocessing: true,
    label: 'Indian English',
    nativeLabel: 'English (IN)'
  }
};

export function getSarvamVoiceConfig(lang: Language): SarvamLanguageVoiceConfig {
  return SARVAM_VOICE_MATRIX[lang] || SARVAM_VOICE_MATRIX.en;
}

export function getSarvamSpeaker(lang: Language): string {
  return getSarvamVoiceConfig(lang).defaultSpeaker;
}

export function getSarvamLanguageCode(lang: Language): SarvamLanguageCode {
  return getSarvamVoiceConfig(lang).sarvamCode;
}
