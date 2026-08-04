'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'bn' | 'mr' | 'gu' | 'or';

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिंदी', english: 'Hindi' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  mr: { native: 'मराठी', english: 'Marathi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  or: { native: 'ଓଡ଼ିଆ', english: 'Odia' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: "Swastha Setu",
    tagline: "Know what to do next, in your own language",
    heroSubhead: "Free voice-first health guidance. No login needed.",
    getStarted: "Get started →",
    seeHowItWorks: "See how it works",
    navHome: "Home",
    navAbout: "About",
    navHowItWorks: "How it works",
    navFeatures: "Features",
    navImpact: "Impact",
    navFAQ: "FAQ",
    navGetInvolved: "Get involved",
    navPrivacy: "Privacy",
    navContact: "Contact",
    badgePrivate: "Private by default",
    badgeLanguages: "9 Indian Languages Supported",
    badgeNoLogin: "No login required",
    badgeFree: "Always 100% free",
    emergencyDisclaimer: "Not a substitute for emergency medical care. Call 108 immediately for severe life-threatening emergencies.",
    exitCheckup: "← Back to Home",
    startVoiceCheckup: "Tap Mic to Speak",
    listening: "Listening to your symptoms...",
    stopListening: "Stop Listening",
    quickSymptomFallback: "Or tap your symptoms below",
    analyzeSymptoms: "Analyze My Symptoms →",
    nearestPHC: "Find Nearest Government Health Centre",
    callFacility: "Call Hospital",
    getDirections: "Get Directions",
  },
  hi: {
    appName: "स्वास्थ्य सेतु",
    tagline: "जानिए आगे क्या करना है, अपनी भाषा में",
    heroSubhead: "मुफ्त आवाज़-आधारित स्वास्थ्य सहायता। लॉगिन की आवश्यकता नहीं।",
    getStarted: "शुरू करें →",
    seeHowItWorks: "देखें यह कैसे काम करता है",
    navHome: "मुख्य पृष्ठ",
    navAbout: "हमारे बारे में",
    navHowItWorks: "यह कैसे काम करता है",
    navFeatures: "विशेषताएं",
    navImpact: "प्रभाव",
    navFAQ: "सवाल-जवाब",
    navGetInvolved: "शामिल हों",
    navPrivacy: "गोपनीयता",
    navContact: "संपर्क करें",
    badgePrivate: "डेटा निजी रहता है",
    badgeLanguages: "9 भारतीय भाषाएं समर्थित",
    badgeNoLogin: "लॉगिन की आवश्यकता नहीं",
    badgeFree: "हमेशा 100% मुफ्त",
    emergencyDisclaimer: "आपातकालीन चिकित्सा का विकल्प नहीं है। गंभीर आपात स्थिति के लिए तुरंत 108 डायल करें।",
    exitCheckup: "← वापस मुख्य पृष्ठ",
    startVoiceCheckup: "बोलने के लिए माइक दबाएं",
    listening: "आपके लक्षण सुन रहे हैं...",
    stopListening: "सुनना बंद करें",
    quickSymptomFallback: "या नीचे अपने लक्षण चुनें",
    analyzeSymptoms: "लक्षणों की जांच करें →",
    nearestPHC: "निकटतम अस्पताल खोजें",
    callFacility: "अस्पताल को कॉल करें",
    getDirections: "दिशा-निर्देश प्राप्त करें",
  },
  te: {
    appName: "స్వాస్థ్య సేతు",
    tagline: "మీ స్వంత భాషలో మీ తదుపరి వైద్య చర్య తెలుసుకోండి",
    heroSubhead: "ఉచిత వాయిస్-ఆధారిత ఆరోగ్య మార్గదర్శకత్వం. లాగిన్ అవసరం లేదు.",
    getStarted: "ప్రారంభించండి →",
    seeHowItWorks: "ఇది ఎలా పనిచేస్తుందో చూడండి",
    navHome: "హోమ్",
    navAbout: "మా గురించి",
    navHowItWorks: "ఇది ఎలా పనిచేస్తుంది",
    navFeatures: "ఫీచర్లు",
    navImpact: "ప్రభావం",
    navFAQ: "తరచుగా అడిగే ప్రశ్నలు",
    navGetInvolved: "పాలుపంచుకోండి",
    navPrivacy: "గోప్యత",
    navContact: "సంప్రదించండి",
    badgePrivate: "గోప్యత హామీ",
    badgeLanguages: "9 భారతీయ భాషలకు మద్దతు",
    badgeNoLogin: "లాగిన్ అవసరం లేదు",
    badgeFree: "ఎల్లప్పుడూ 100% ఉచితం",
    emergencyDisclaimer: "అత్యవసర వైద్య చికిత్సకు ప్రత్యామ్నాయం కాదు. ఆపదలో వెంటనే 108 కు కాల్ చేయండి.",
    exitCheckup: "← హోమ్‌కి తిరిగి వెళ్ళు",
    startVoiceCheckup: "మాట్లాడటానికి మైక్ నొక్కండి",
    listening: "మీ లక్షణాలను వింటున్నాము...",
    stopListening: "వినడం ఆపు",
    quickSymptomFallback: "లేదా కింద లక్షణాలను ఎంచుకోండి",
    analyzeSymptoms: "లక్షణాలను విశ్లేషించండి →",
    nearestPHC: "సమీప ఆసుపత్రిని కనుగొనండి",
    callFacility: "ఆసుపత్రికి కాల్ చేయండి",
    getDirections: "దిశలను పొందండి",
  },
  ta: {
    appName: "சுவாஸ்த்ய சேது",
    tagline: "உங்கள் சொந்த மொழியில் உங்கள் அடுத்த மருத்துவ நடவடிக்கையை அறிந்துகொள்ளுங்கள்",
    heroSubhead: "இலவச குரல் சார்ந்த சுகாதார வழிகாட்டுதல். உள்நுழைவு தேவையில்லை.",
    getStarted: "தொடங்கவும் →",
    seeHowItWorks: "இது எவ்வாறு செயல்படுகிறது என்று பாருங்கள்",
    navHome: "முகப்பு",
    navAbout: "எங்களைப் பற்றி",
    navHowItWorks: "செயல்படும் முறை",
    navFeatures: "அம்சங்கள்",
    navImpact: "தாக்கம்",
    navFAQ: "கேள்வி-பதில்",
    navGetInvolved: "பங்கேற்கவும்",
    navPrivacy: "தனியுரிமை",
    navContact: "தொடர்புகொள்ள",
    badgePrivate: "தனியுரிமை பாதுகாப்பானது",
    badgeLanguages: "9 இந்திய மொழிகள் ஆதரிக்கப்படுகின்றன",
    badgeNoLogin: "உள்நுழைவு தேவையில்லை",
    badgeFree: "எப்போதும் 100% இலவசம்",
    emergencyDisclaimer: "அவசர மருத்துவ சிகிச்சைக்கு மாற்றாகாது. அவசரநிலைக்கு 108 ஐ அழைக்கவும்.",
    exitCheckup: "← முகப்புக்குத் திரும்பு",
    startVoiceCheckup: "பேச மைக் அழுத்தவும்",
    listening: "உங்கள் அறிகுறிகளைக் கேட்கிறது...",
    stopListening: "கேட்பதை நிறுத்து",
    quickSymptomFallback: "அல்லது கீழே அறிகுறிகளைத் தேர்ந்தெடுக்கவும்",
    analyzeSymptoms: "அறிகுறிகளை ஆராயுங்கள் →",
    nearestPHC: "அருகிலுள்ள மருத்துவமனையைக் கண்டறியவும்",
    callFacility: "மருத்துவமனைக்கு அழைக்கவும்",
    getDirections: "வழிமுறைகளைப் பெறுக",
  },
  kn: {
    appName: "ಸ್ವಾಸ್ಥ್ಯ ಸೇತು",
    tagline: "ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ವೈದ್ಯಕೀಯ ಹಂತವನ್ನು ತಿಳಿಯಿರಿ",
    heroSubhead: "ಉಚಿತ ಧ್ವನಿ ಆಧಾರಿತ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ. ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ.",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ →",
    seeHowItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ನೋಡಿ",
    navHome: "ಮುಖ್ಯ ಪುಟ",
    navAbout: "ನಮ್ಮ ಬಗ್ಗೆ",
    navHowItWorks: "ಕಾರ್ಯವಿಧಾನ",
    navFeatures: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    navImpact: "ಪ್ರಭಾವ",
    navFAQ: "ಪ್ರಶ್ನೋತ್ತರ",
    navGetInvolved: "ಭಾಗವಹಿಸಿ",
    navPrivacy: "ಗೌಪ್ಯತೆ",
    navContact: "ಸಂಪರ್ಕಿಸಿ",
    badgePrivate: "ಗೌಪ್ಯತೆ ಖಾತರಿ",
    badgeLanguages: "9 ಭಾರತೀಯ ಭಾಷೆಗಳ ಬೆಂಬಲ",
    badgeNoLogin: "ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ",
    badgeFree: "ಯಾವಾಗಲೂ 100% ಉಚಿತ",
    emergencyDisclaimer: "ತುರ್ತು ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ.",
    exitCheckup: "← ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    startVoiceCheckup: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ",
    listening: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    stopListening: "ಆಲಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
    quickSymptomFallback: "ಅಥವಾ ಕೆಳಗೆ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    analyzeSymptoms: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ →",
    nearestPHC: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಯನ್ನು ಹುಡುಕಿ",
    callFacility: "ಆಸ್ಪತ್ರೆಗೆ ಕರೆ ಮಾಡಿ",
    getDirections: "ದಿಕ್ಕುಗಳನ್ನು ಪಡೆಯಿರಿ",
  },
  bn: {
    appName: "স্বাস্থ্য সেতু",
    tagline: "আপনার নিজস্ব ভাষায় আপনার পরবর্তী স্বাস্থ্যগত পদক্ষেপ জানুন",
    heroSubhead: "বিনামূল্যে ভয়েস-ভিত্তিক স্বাস্থ্য নির্দেশিকা। কোনও লগইন প্রয়োজন নেই।",
    getStarted: "শুরু করুন →",
    seeHowItWorks: "এটি কীভাবে কাজ করে দেখুন",
    navHome: "হোম",
    navAbout: "আমাদের সম্পর্কে",
    navHowItWorks: "কাজের ধারা",
    navFeatures: "বৈশিষ্ট্যসমূহ",
    navImpact: "প্রভাব",
    navFAQ: "প্রশ্নোত্তর",
    navGetInvolved: "যুক্ত হন",
    navPrivacy: "গোপনীয়তা",
    navContact: "যোগাযোগ",
    badgePrivate: "গোপনীয়তা সুরক্ষিত",
    badgeLanguages: "৯টি ভারতীয় ভাষা সমর্থিত",
    badgeNoLogin: "লগইন প্রয়োজন নেই",
    badgeFree: "সর্বদা ১০০% বিনামূল্যে",
    emergencyDisclaimer: "জরুরি চিকিৎসার বিকল্প নয়। জরুরি পরিস্থিতিতে অবিলম্বে ১০৮ ডায়াল করুন।",
    exitCheckup: "← হোমে ফিরে যান",
    startVoiceCheckup: "কথা বলতে মাইক চাপুন",
    listening: "আপনার উপসর্গ শোনা হচ্ছে...",
    stopListening: "শোনা বন্ধ করুন",
    quickSymptomFallback: "অথবা নিচে উপসর্গ নির্বাচন করুন",
    analyzeSymptoms: "উপসর্গ বিশ্লেষণ করুন →",
    nearestPHC: "নিকটস্থ হাসপাতাল খুঁজুন",
    callFacility: "হাসপাতালে কল করুন",
    getDirections: "দিকনির্দেশ পান",
  },
  mr: {
    appName: "स्वास्थ्य सेतु",
    tagline: "आपल्या स्वतःच्या भाषेत पुढील वैद्यकीय पायरी जाणून घ्या",
    heroSubhead: "मोफत व्हॉईस-आधारित आरोग्य मार्गदर्शन. लॉगिनची गरज नाही.",
    getStarted: "शुरू करा →",
    seeHowItWorks: "हे कसे कार्य करते ते पहा",
    navHome: "मुख्य पृष्ठ",
    navAbout: "आमच्याबद्दल",
    navHowItWorks: "कार्यपद्धती",
    navFeatures: "वैशिष्ट्ये",
    navImpact: "प्रभाव",
    navFAQ: "प्रश्नोत्तरे",
    navGetInvolved: "सहभागी व्हा",
    navPrivacy: "गोपनीयता",
    navContact: "संपर्क करा",
    badgePrivate: "गोपनीयता सुरक्षित",
    badgeLanguages: "९ भारतीय भाषा समर्थित",
    badgeNoLogin: "लॉगिनची गरज नाही",
    badgeFree: "नेहमी १००% मोफत",
    emergencyDisclaimer: "तातडीच्या वैद्यकीय उपचारांचा पर्याय नाही. गंभीर प्रसंगी त्वरित १०८ वर कॉल करा.",
    exitCheckup: "← मुख्य पृष्ठावर जा",
    startVoiceCheckup: "बोलण्यासाठी माइक दाबा",
    listening: "तुमची लक्षणे ऐकत आहोत...",
    stopListening: "ऐकणे थांबवा",
    quickSymptomFallback: "किंवा खालील लक्षणे निवडा",
    analyzeSymptoms: "लक्षणांचे विश्लेषण करा →",
    nearestPHC: "जवळचे रुग्णालय शोधा",
    callFacility: "रुग्णाला कॉल करा",
    getDirections: "दिशा-निर्देश मिळवा",
  },
  gu: {
    appName: "સ્વાસ્થ્ય સેતુ",
    tagline: "તમારી પોતાની ભાષામાં તમારું પછીનું તબીબી પગલું જાણો",
    heroSubhead: "મફત વૉઇસ-આધારિત આરોગ્ય માર્ગદર્શન. લૉગિન જરૂરી નથી.",
    getStarted: "શરૂ કરો →",
    seeHowItWorks: "આ કેવી રીતે કામ કરે છે તે જુઓ",
    navHome: "હોમ",
    navAbout: "અમારા વિશે",
    navHowItWorks: "કાર્યપદ્ધતિ",
    navFeatures: "વિશેષતાઓ",
    navImpact: "અસર",
    navFAQ: "પ્રશ્નોત્તરી",
    navGetInvolved: "જોડાવો",
    navPrivacy: "ગોપનીયતા",
    navContact: "સંપર્ક કરો",
    badgePrivate: "ગોપનીયતા સુરક્ષિત",
    badgeLanguages: "9 ભારતીય ભાષાઓ સમર્થિત",
    badgeNoLogin: "લૉગિન જરૂરી નથી",
    badgeFree: "હંમેશા 100% મફત",
    emergencyDisclaimer: "ઇમરજન્સી મેડિકલ સારવારનો વિકલ્પ નથી. ગંભીર પરિસ્થિતિમાં 108 પર કોલ કરો.",
    exitCheckup: "← પાછા હોમ પર જાઓ",
    startVoiceCheckup: "બોલવા માટે માઇક દબાવો",
    listening: "તમારા લક્ષણો સાંભળી રહ્યા છીએ...",
    stopListening: "સાંભળવાનું બંધ કરો",
    quickSymptomFallback: "અથવા નીચે લક્ષણો પસંદ કરો",
    analyzeSymptoms: "લક્ષણોનું પૃથક્કરણ કરો →",
    nearestPHC: "નજીકની હોસ્પિટલ શોધો",
    callFacility: "હોસ્પિટલને કોલ કરો",
    getDirections: "દિશા-નિર્દેશો મેળવો",
  },
  or: {
    appName: "ସ୍ୱାସ୍ଥ୍ୟ ସେତୁ",
    tagline: "ଆପଣଙ୍କ ନିଜ ଭାଷାରେ ନିଜର ପରବର୍ତ୍ତୀ ସ୍ୱାସ୍ଥ୍ୟ ପଦକ୍ଷେପ ଜାଣନ୍ତୁ",
    heroSubhead: "ମାଗଣା ଭଏସ୍-ଆଧାରିତ ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ। ଲଗଇନ୍ ଆବଶ୍ୟକ ନାହିଁ।",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ →",
    seeHowItWorks: "ଏହା କିପରି କାମ କରେ ଦେଖନ୍ତୁ",
    navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
    navAbout: "ଆମ ବିଷୟରେ",
    navHowItWorks: "କାର୍ଯ୍ୟପ୍ରଣାଳୀ",
    navFeatures: "ବିଶେଷତା",
    navImpact: "ପ୍ରଭାବ",
    navFAQ: "ପ୍ରଶ୍ନୋତ୍ତର",
    navGetInvolved: "ସାମିଲ ହୁଅନ୍ତୁ",
    navPrivacy: "ଗୋପନୀୟତା",
    navContact: "ଯୋଗାଯୋଗ",
    badgePrivate: "ଗୋପନୀୟତା ସୁରକ୍ଷିତ",
    badgeLanguages: "୯ଟି ଭାରତୀୟ ଭାଷା ସମର୍ଥିତ",
    badgeNoLogin: "ଲଗଇନ୍ ଆବଶ୍ୟକ ନାହିଁ",
    badgeFree: "ସଦାସର୍ବଦା ୧୦୦% ମାଗଣା",
    emergencyDisclaimer: "ଆପାତକାଳୀନ ଚିକିତ୍ସାର ବିକଳ୍ପ ନୁହେଁ। ଜରୁରୀ ପରିସ୍ଥିତିରେ ୧୦୮ ଡାଏଲ୍ କରନ୍ତୁ।",
    exitCheckup: "← ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ",
    startVoiceCheckup: "କହିବା ପାଇଁ ମାଇକ୍ ଦବାନ୍ତୁ",
    listening: "ଆପଣଙ୍କ ଲକ୍ଷଣ ଶୁଣାଯାଉଛି...",
    stopListening: "ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ",
    quickSymptomFallback: "କିମ୍ବା ତଳେ ଲକ୍ଷଣ ଚୟନ କରନ୍ତୁ",
    analyzeSymptoms: "ଲକ୍ଷଣର ବିଶ୍ଲେଷଣ କରନ୍ତୁ →",
    nearestPHC: "ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ",
    callFacility: "ଡାକ୍ତରଖାନାକୁ କଲ୍ କରନ୍ତୁ",
    getDirections: "ଦିଗନିର୍ଦ୍ଦେଶ ପାଆନ୍ତୁ",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore saved language preference from localStorage on initial client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('swastha_setu_lang') as Language;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('swastha_setu_lang', lang);
    }
    const langInfo = languageNames[lang];
    setToastMessage(`🌐 Switched Language to ${langInfo.native} (${langInfo.english})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}

      {/* Floating Animated Language Switch Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <m.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F6E56] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-2xl border-2 border-emerald-300/40 flex items-center gap-2.5 pointer-events-none"
          >
            <Globe className="w-4 h-4 text-emerald-300 animate-spin" />
            <span>{toastMessage}</span>
          </m.div>
        )}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
