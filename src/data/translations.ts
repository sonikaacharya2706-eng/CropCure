export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voiceLang: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', voiceLang: 'en-IN', region: 'All India & Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceLang: 'hi-IN', region: 'North & Central India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', voiceLang: 'kn-IN', region: 'Karnataka' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', voiceLang: 'ta-IN', region: 'Tamil Nadu & Puducherry' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', voiceLang: 'te-IN', region: 'Andhra Pradesh & Telangana' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', voiceLang: 'ml-IN', region: 'Kerala' },
];

export interface TranslationDictionary {
  appTitle: string;
  tagline: string;
  navDoctor: string;
  navPacket: string;
  navWalk: string;
  navRadar: string;
  navExpert: string;
  villageOffline: string;
  onlineSync: string;
  takePhoto: string;
  rowVideo: string;
  upload: string;
  chooseSample: string;
  diagnosing: string;
  askBeforeGuess: string;
  askBeforeGuessSubtitle: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  askExpertBtn: string;
  costLossTitle: string;
  treatmentPlanner: string;
  packetScannerTitle: string;
  walkScanTitle: string;
  outbreakRadarTitle: string;
  expertPortalTitle: string;
  offlineModeActive: string;
  offlineModeDesc: string;
  speakVoice: string;
  stopVoice: string;
  cheapOrganicFirst: string;
  chemicalGenericTitle: string;
  safetyIconsTitle: string;
  daysWait: string;
  treatNow: string;
  removeOnly: string;
  notWorthSpraying: string;
  filterAll: string;
  filterHealthy: string;
  catalogTitle: string;
  catalogSubtitle: string;
  pruneLeaves: string;
  bottleCapDose: string;
  wearClothMask: string;
  waitDaysHarvest: string;
  retakePhoto: string;
  useThisPhoto: string;
  phoneCamera: string;
  osCamera: string;
  simulatedField: string;
  hardwareSensor: string;
  fieldObservations: string;
  candidateConditions: string;
}

export const UI_STRINGS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: 'CropCure',
    tagline: 'Field Plant Doctor for Small Farmers',
    navDoctor: 'Leaf Doctor',
    navPacket: 'Packet Scanner',
    navWalk: 'Field Walk',
    navRadar: 'Village Radar',
    navExpert: 'Extension Portal',
    villageOffline: 'Village Offline',
    onlineSync: 'Online Sync',
    takePhoto: 'Take Photo',
    rowVideo: 'Row Video',
    upload: 'Upload',
    chooseSample: 'Or Select Field Test Case',
    diagnosing: 'Inspecting leaf in field context...',
    askBeforeGuess: 'Step 2: Guided Follow-Up Questions',
    askBeforeGuessSubtitle: 'Answer 2 quick eye checks to separate look-alike diseases and re-score with Bayesian weighting:',
    confidenceHigh: 'Confident Diagnosis',
    confidenceMedium: 'Probable (Clarified with Questions)',
    confidenceLow: 'Uncertain - Expert Consultation Recommended',
    askExpertBtn: '1-Tap WhatsApp Handoff to Extension Worker',
    costLossTitle: 'Is It Worth Treating? Cost vs. Loss Calculator',
    treatmentPlanner: 'Local Practical Treatment Plan',
    packetScannerTitle: 'Pesticide Sachet & Label Scanner',
    walkScanTitle: 'Walk-Through Field Row Scanner',
    outbreakRadarTitle: 'Nearby Village Outbreak Radar',
    expertPortalTitle: 'Extension Worker Learning Portal',
    offlineModeActive: 'Offline Village Mode Active (Zero Internet Required)',
    offlineModeDesc: 'Cases stored on device. Synchronizes automatically when signal returns.',
    speakVoice: 'Listen in Local Voice',
    stopVoice: 'Stop Audio',
    cheapOrganicFirst: 'Low-Cost Organic Options First (Neem, Ash, Pruning)',
    chemicalGenericTitle: 'Generic Chemical & Bottle-Cap Dosing',
    safetyIconsTitle: 'Mandatory Safety & Harvest Waiting Period',
    daysWait: 'Days before harvest',
    treatNow: 'Treat Promptly (Highly Profitable)',
    removeOnly: 'Remove Sick Plants Only (Do Not Buy Chemicals)',
    notWorthSpraying: 'Not Worth Spraying (Cost Exceeds Damage)',
    filterAll: 'All',
    filterHealthy: 'Healthy / Clear',
    catalogTitle: 'Crop Infection & Symptom Catalog',
    catalogSubtitle: 'Authentic field photography of smallholder crops across blights, wilts, viruses, insect pests, and nutrient chlorosis.',
    pruneLeaves: 'Prune Infected Leaves',
    bottleCapDose: 'Bottle-Cap Dosing',
    wearClothMask: 'Wear Mask & Gloves',
    waitDaysHarvest: 'Wait Before Harvest',
    retakePhoto: 'Retake Photo',
    useThisPhoto: 'Use This Photo',
    phoneCamera: 'Phone Camera',
    osCamera: 'OS Camera',
    simulatedField: 'Simulated Field',
    hardwareSensor: 'Hardware Sensor',
    fieldObservations: 'Key Field Symptoms Observed',
    candidateConditions: 'Differential Diagnosis Candidates',
  },

  hi: {
    appTitle: 'CropCure',
    tagline: 'छोटे किसानों के लिए फसल डॉक्टर',
    navDoctor: 'पत्ती डॉक्टर',
    navPacket: 'दवा पैकेट स्कैनर',
    navWalk: 'कतार चाल स्कैन',
    navRadar: 'ग्रामीण बीमारी रडार',
    navExpert: 'कृषि विशेषज्ञ पोर्टल',
    villageOffline: 'ऑफलाइन गांव मोड',
    onlineSync: 'ऑनलाइन सिंक',
    takePhoto: 'फोटो खींचें',
    rowVideo: 'कतार वीडियो',
    upload: 'अपलोड करें',
    chooseSample: 'या खेत का नमूना चुनें',
    diagnosing: 'पत्ती के लक्षणों की जांच जारी है...',
    askBeforeGuess: 'चरण 2: आंख से देखकर पुष्टि के सवाल',
    askBeforeGuessSubtitle: 'सटीक पहचान के लिए 2 आसान सवालों के जवाब दें और बायेसियन स्कोर देखें:',
    confidenceHigh: 'स्पष्ट और सटीक पहचान',
    confidenceMedium: 'संभावित रोग (सवालों से पक्का किया गया)',
    confidenceLow: 'संदिग्ध - विशेषज्ञ की सलाह जरूरी है',
    askExpertBtn: 'कृषि अधिकारी को व्हाट्सएप पर भेजें (1-टैप)',
    costLossTitle: 'क्या दवा डालना फायदेमंद है? नफा-नुकसान कैलकुलेटर',
    treatmentPlanner: 'सस्ता और सुरक्षित स्थानीय इलाज',
    packetScannerTitle: 'दवा के पैकेट की जांच (लेबल स्कैनर)',
    walkScanTitle: 'खेत में चलकर कतार का स्कैन',
    outbreakRadarTitle: 'आस-पास के गांवों में बीमारी का अलर्ट',
    expertPortalTitle: 'कृषि विशेषज्ञ समीक्षा पोर्टल',
    offlineModeActive: 'ऑफलाइन गांव मोड चालू (इंटरनेट की जरूरत नहीं)',
    offlineModeDesc: 'फोन में सुरक्षित। नेटवर्क आने पर अपने आप सिंक होगा।',
    speakVoice: 'आवाज़ में सुनें',
    stopVoice: 'आवाज़ बंद करें',
    cheapOrganicFirst: 'पहले सस्ते देसी उपाय (नीम अर्क, राख, छंटाई)',
    chemicalGenericTitle: 'दवा का सादा नाम और ढक्कन से नाप',
    safetyIconsTitle: 'सुरक्षा नियम और तुड़ाई से पहले के दिन',
    daysWait: 'तुड़ाई से पहले इतने दिन रुकें',
    treatNow: 'तुरंत छिड़काव करें (फायदेमंद)',
    removeOnly: 'केवल रोगी पौधे उखाड़कर नष्ट करें',
    notWorthSpraying: 'छिड़काव न करें (खर्चा नुकसान से ज्यादा है)',
    filterAll: 'सभी फसलें',
    filterHealthy: 'स्वस्थ / सामान्य',
    catalogTitle: 'फसल रोग एवं लक्षण सूची',
    catalogSubtitle: 'झुलसा, उकठा, विषाणु, कीट और पोषक तत्वों की कमी की वास्तविक खेत फोटोग्राफी।',
    pruneLeaves: 'रोगग्रस्त पत्तियां छांटें',
    bottleCapDose: 'बोतल के ढक्कन से नाप',
    wearClothMask: 'मास्क और दस्ताने पहनें',
    waitDaysHarvest: 'तुड़ाई से पहले प्रतीक्षा करें',
    retakePhoto: 'दोबारा फोटो लें',
    useThisPhoto: 'यह फोटो इस्तेमाल करें',
    phoneCamera: 'फोन कैमरा',
    osCamera: 'कैमरा ऐप',
    simulatedField: 'सिम्युलेटेड खेत',
    hardwareSensor: 'कैमरा सेंसर',
    fieldObservations: 'खेत में दिखे मुख्य लक्षण',
    candidateConditions: 'संभावित रोगों की सूची',
  },

  kn: {
    appTitle: 'CropCure',
    tagline: 'ಸಣ್ಣ ರೈತರಿಗೆ ಬೆಳೆ ವೈದ್ಯ',
    navDoctor: 'ಎಲೆ ವೈದ್ಯ',
    navPacket: 'ಔಷಧಿ ಪ್ಯಾಕೆಟ್ ಸ್ಕ್ಯಾನರ್',
    navWalk: 'ಸಾಲು ನಡಿಗೆ ಸ್ಕ್ಯಾನ್',
    navRadar: 'ಗ್ರಾಮ ರೋಗ ಎಚ್ಚರಿಕೆ',
    navExpert: 'ಕೃಷಿ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    villageOffline: 'ಗ್ರಾಮೀಣ ಆಫ್‌ಲೈನ್',
    onlineSync: 'ಆನ್‌ಲೈನ್ ಸಿಂಕ್',
    takePhoto: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    rowVideo: 'ಸಾಲು ವಿಡಿಯೋ',
    upload: 'ಅಪ್ಲೋಡ್ ಮಾಡಿ',
    chooseSample: 'ಅಥವಾ ಬೆಳೆ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ',
    diagnosing: 'ಎಲೆಯ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    askBeforeGuess: 'ಹಂತ 2: ಕಣ್ಣಾರೆ ನೋಡಿ ದೃಢೀಕರಿಸುವ ಪ್ರಶ್ನೆಗಳು',
    askBeforeGuessSubtitle: 'ನಿಖರ ರೋಗ ಗುರುತಿಸುವಿಕೆಗೆ 2 ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ:',
    confidenceHigh: 'ನಿಖರವಾದ ರೋಗ ನಿರ್ಧಾರ',
    confidenceMedium: 'ಸಂಭಾವ್ಯ ರೋಗ (ಪ್ರಶ್ನೆಗಳಿಂದ ದೃಢಪಟ್ಟಿದೆ)',
    confidenceLow: 'ಅನಿಶ್ಚಿತ - ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸಲಹೆ ಅಗತ್ಯ',
    askExpertBtn: 'ಕೃಷಿ ಅಧಿಕಾರಿಗೆ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕಳುಹಿಸಿ (1-ಟ್ಯಾಪ್)',
    costLossTitle: 'ಔಷಧಿ ಸಿಂಪಡಣೆ ಲಾಭದಾಯಕವೇ? ವೆಚ್ಚ-ನಷ್ಟ ಲೆಕ್ಕಾಚಾರ',
    treatmentPlanner: 'ಕಡಿಮೆ ವೆಚ್ಚದ ಪ್ರಾಯೋಗಿಕ ಪರಿಹಾರ ಯೋಜನೆ',
    packetScannerTitle: 'ಕೀಟನಾಶಕ ಪ್ಯಾಕೆಟ್ ಮತ್ತು ಲೇಬಲ್ ಸ್ಕ್ಯಾನರ್',
    walkScanTitle: 'ಹೊಲದ ಸಾಲು ನಡಿಗೆ ಸ್ಕ್ಯಾನರ್',
    outbreakRadarTitle: 'ಹತ್ತಿರದ ಹಳ್ಳಿಗಳಲ್ಲಿ ರೋಗದ ಎಚ್ಚರಿಕೆ',
    expertPortalTitle: 'ಕೃಷಿ ವಿಸ್ತರಣಾಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    offlineModeActive: 'ಆಫ್‌ಲೈನ್ ಗ್ರಾಮ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (ಇಂಟರ್ನೆಟ್ ಬೇಡ)',
    offlineModeDesc: 'ಫೋನ್‌ನಲ್ಲೇ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ. ಸಿಗ್ನಲ್ ಬಂದಾಗ ತಾನಾಗಿಯೇ ಸಿಂಕ್ ಆಗುತ್ತದೆ.',
    speakVoice: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
    stopVoice: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
    cheapOrganicFirst: 'ಮೊದಲು ಕಡಿಮೆ ವೆಚ್ಚದ ಸಾವಯವ ವಿಧಾನಗಳು (ಬೇವಿನ ಕಷಾಯ, ಬೂದಿ, ಕಟಾವು)',
    chemicalGenericTitle: 'ಸಾಮಾನ್ಯ ಔಷಧಿ ಹೆಸರು ಮತ್ತು ಬಾಟಲ್ ಮುಚ್ಚಳದ ಅಳತೆ',
    safetyIconsTitle: 'ಸುರಕ್ಷತಾ ನಿಯಮಗಳು ಮತ್ತು ಕೊಯ್ಲಿನ ಕಾಯುವಿಕೆ ದಿನಗಳು',
    daysWait: 'ಕೊಯ್ಲಿಗೆ ಮುನ್ನ ಕಾಯಬೇಕಾದ ದಿನಗಳು',
    treatNow: 'ಕೂಡಲೇ ಸಿಂಪಡಿಸಿ (ಹೆಚ್ಚು ಲಾಭದಾಯಕ)',
    removeOnly: 'ರೋಗಗ್ರಸ್ತ ಗಿಡಗಳನ್ನು ಮಾತ್ರ ಕೀಳಿ ನಾಶಮಾಡಿ',
    notWorthSpraying: 'ಸಿಂಪಡಣೆ ಬೇಡ (ವೆಚ್ಚವು ನಷ್ಟಕ್ಕಿಂತ ಹೆಚ್ಚು)',
    filterAll: 'ಎಲ್ಲ ಬೆಳೆಗಳು',
    filterHealthy: 'ಆರೋಗ್ಯಕರ / ಸ್ಪಷ್ಟ',
    catalogTitle: 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಲಕ್ಷಣಗಳ ಪಟ್ಟಿ',
    catalogSubtitle: 'ಶಿಲೀಂಧ್ರ ರೋಗಗಳು, ಸೊರಗು ರೋಗ, ವೈರಸ್, ಕೀಟಗಳು ಮತ್ತು ಪೋಷಕಾಂಶ ಕೊರತೆಯ ನೈಜ ಹೊಲದ ಫೋಟೋಗಳು.',
    pruneLeaves: 'ರೋಗಗ್ರಸ್ತ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ',
    bottleCapDose: 'ಬಾಟಲ್ ಮುಚ್ಚಳದಿಂದ ಅಳತೆ',
    wearClothMask: 'ಮಾಸ್ಕ್ ಮತ್ತು ಕೈಗವಸು ಧರಿಸಿ',
    waitDaysHarvest: 'ಕೊಯ್ಲಿಗೆ ಮುನ್ನ ಕಾಯಿರಿ',
    retakePhoto: 'ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    useThisPhoto: 'ಈ ಫೋಟೋ ಬಳಸಿ',
    phoneCamera: 'ಫೋನ್ ಕ್ಯಾಮೆರಾ',
    osCamera: 'ಕ್ಯಾಮೆರಾ ಆಪ್',
    simulatedField: 'ಮಾದರಿ ಹೊಲ',
    hardwareSensor: 'ಕ್ಯಾಮೆರಾ ಸೆನ್ಸರ್',
    fieldObservations: 'ಹೊಲದಲ್ಲಿ ಕಂಡ ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು',
    candidateConditions: 'ಸಂಭಾವ್ಯ ರೋಗಗಳ ಪಟ್ಟಿ',
  },

  ta: {
    appTitle: 'CropCure',
    tagline: 'சிறு விவசாயிகளுக்கான பயிர் மருத்துவர்',
    navDoctor: 'இலை மருத்துவர்',
    navPacket: 'மருந்து பாக்கெட் ஸ்கேனர்',
    navWalk: 'வரிசை நடை ஸ்கேன்',
    navRadar: 'கிராம நோய் ரேடார்',
    navExpert: 'வேளாண் அலுவலர் போர்டல்',
    villageOffline: 'கிராம ஆஃப்லைன்',
    onlineSync: 'ஆன்லைன் ஒத்திசைவு',
    takePhoto: 'புகைப்படம் எடு',
    rowVideo: 'வரிசை வீடியோ',
    upload: 'பதிவேற்றம்',
    chooseSample: 'அல்லது மாதிரி பயிரை தேர்வு செய்க',
    diagnosing: 'இலை அறிகுறிகள் ஆராயப்படுகின்றன...',
    askBeforeGuess: 'படி 2: கண் பரிசோதனை வழிகாட்டுதல் கேள்விகள்',
    askBeforeGuessSubtitle: 'ஒரே மாதிரியான நோய்களை துல்லியமாக பிரிக்க 2 எளிய கேள்விகளுக்கு பதிலளிக்கவும்:',
    confidenceHigh: 'துல்லியமான நோய் கண்டறிதல்',
    confidenceMedium: 'சாத்தியமான நோய் (கேள்விகள் மூலம் உறுதிப்படுத்தப்பட்டது)',
    confidenceLow: 'உறுதியற்றது - வேளாண் ஆலோசகரை அணுகவும்',
    askExpertBtn: 'வேளாண் அலுவலருக்கு வாட்ஸ்அப்பில் அனுப்பவும் (1-தட்டல்)',
    costLossTitle: 'மருந்து அடிப்பது லாபகரமானதா? செலவு-இழப்பு கணக்கீடு',
    treatmentPlanner: 'குறைந்த செலவு நடைமுறை சிகிச்சை திட்டம்',
    packetScannerTitle: 'பூச்சிக்கொல்லி பாக்கெட் & லேபிள் ஸ்கேனர்',
    walkScanTitle: 'வயல் வரிசை நடை ஸ்கேனர்',
    outbreakRadarTitle: 'அருகிலுள்ள கிராமங்களில் நோய் எச்சரிக்கை',
    expertPortalTitle: 'வேளாண் விரிவாக்க அலுவலர் போர்டல்',
    offlineModeActive: 'ஆஃப்லைன் கிராம முறை இயங்குகிறது (இணையம் தேவையில்லை)',
    offlineModeDesc: 'போனில் சேமிக்கப்பட்டது. சிக்னல் வரும்போது தானாக ஒத்திசைக்கப்படும்.',
    speakVoice: 'குரலில் கேட்கவும்',
    stopVoice: 'ஒலியை நிறுத்தவும்',
    cheapOrganicFirst: 'முதலில் மலிவான இயற்கை முறைகள் (வேப்பங்கொட்டை சாறு, சாம்பல், கவாத்து)',
    chemicalGenericTitle: 'பொதுவான மருந்துப் பெயர் மற்றும் மூடி அளவு',
    safetyIconsTitle: 'பாதுகாப்பு விதிகள் மற்றும் அறுவடைக்கு முந்தைய காத்திருப்பு நாட்கள்',
    daysWait: 'அறுவடைக்கு முன் காத்திருக்க வேண்டிய நாட்கள்',
    treatNow: 'உடனடியாக சிகிச்சை அளிக்கவும் (அதிக லாபம்)',
    removeOnly: 'பாதிக்கப்பட்ட செடிகளை மட்டும் அகற்றி அழிக்கவும்',
    notWorthSpraying: 'மருந்து தெளிக்க வேண்டாம் (செலவு இழப்பை விட அதிகம்)',
    filterAll: 'அனைத்து பயிர்கள்',
    filterHealthy: 'ஆரோக்கியமானவை',
    catalogTitle: 'பயிர் நோய்கள் மற்றும் அறிகுறிகள் அட்டவணை',
    catalogSubtitle: 'பூஞ்சை நோய்கள், வாடல், வைரஸ், பூச்சிகள் மற்றும் ஊட்டச்சத்து குறைபாடுகளின் உண்மையான களப் புகைப்படங்கள்.',
    pruneLeaves: 'பாதிக்கப்பட்ட இலைகளை கவாத்து செய்க',
    bottleCapDose: 'பாட்டில் மூடி அளவு',
    wearClothMask: 'முகமூடி & கையுறை அணியவும்',
    waitDaysHarvest: 'அறுவடைக்கு முன் காத்திருங்கள்',
    retakePhoto: 'மீண்டும் படம் எடுக்கவும்',
    useThisPhoto: 'இப்படத்தை பயன்படுத்துக',
    phoneCamera: 'போன் கேமரா',
    osCamera: 'கேமரா ஆப்',
    simulatedField: 'மாதிரி வயல்',
    hardwareSensor: 'கேமரா சென்சார்',
    fieldObservations: 'கண்டறியப்பட்ட முக்கிய அறிகுறிகள்',
    candidateConditions: 'சாத்தியமான நோய்களின் பட்டியல்',
  },

  te: {
    appTitle: 'CropCure',
    tagline: 'చిన్న రైతులకు పంట డాక్టర్',
    navDoctor: 'ఆకు డాక్టర్',
    navPacket: 'పురుగుమందు ప్యాకెట్ స్కానర్',
    navWalk: 'పొలం వరుస తనిఖీ',
    navRadar: 'గ్రామ తెగులు హెచ్చరిక',
    navExpert: 'వ్యవసాయ నిపుణుల పోర్టల్',
    villageOffline: 'గ్రామీణ ఆఫ్‌లైన్',
    onlineSync: 'ఆన్‌లైన్ సింక్',
    takePhoto: 'ఫోటో తీయండి',
    rowVideo: 'వరుస వీడియో',
    upload: 'అప్‌లోడ్ చేయండి',
    chooseSample: 'లేదా పొలం నమూనాను ఎంచుకోండి',
    diagnosing: 'ఆకు లక్షణాలను పరిశీలిస్తోంది...',
    askBeforeGuess: 'దశ 2: నిశిత పరిశీలన ప్రశ్నలు',
    askBeforeGuessSubtitle: 'ఖచ్చితమైన నిర్ధారణ కోసం 2 సులభమైన ప్రశ్నలకు సమాధానమివ్వండి:',
    confidenceHigh: 'ఖచ్చితమైన రోగ నిర్ధారణ',
    confidenceMedium: 'సంభావ్య రోగం (ప్రశ్నల ద్వారా స్పష్టత)',
    confidenceLow: 'అనుమానాస్పదంగా ఉంది - వ్యవసాయ అధికారిని సంప్రదించండి',
    askExpertBtn: 'వాట్సాప్‌లో అధికారికి పంపండి (ఒక్క ట్యాప్)',
    costLossTitle: 'మందు కొట్టడం లాభదాయకమా? ఖర్చు-నష్టం కాలిక్యులేటర్',
    treatmentPlanner: 'తక్కువ ఖర్చుతో కూడిన నివారణ చర్యలు',
    packetScannerTitle: 'పురుగుమందు ప్యాకెట్ & లేబుల్ స్కానర్',
    walkScanTitle: 'పొలం వరుస నడక స్కానర్',
    outbreakRadarTitle: 'సమీప గ్రామాల తెగులు హెచ్చరికలు',
    expertPortalTitle: 'వ్యవసాయ నిపుణుల సమీక్ష పోర్టల్',
    offlineModeActive: 'ఆఫ్‌లైన్ గ్రామీణ మోడ్ ఆన్‌లో ఉంది (ఇంటర్నెట్ అవసరం లేదు)',
    offlineModeDesc: 'ఫోన్‌లోనే భద్రం. సిగ్నల్ రాగానే స్వయంచాలకంగా అప్‌లోడ్ అవుతుంది.',
    speakVoice: 'వాయిస్‌లో వినండి',
    stopVoice: 'వాయిస్ ఆపండి',
    cheapOrganicFirst: 'మొదట చౌకైన సహజ పద్ధతులు (వేప కషాయం, బూడిద, కత్తిరింపు)',
    chemicalGenericTitle: 'సాధారణ మందు పేరు మరియు బాటిల్ మూత మోతాదు',
    safetyIconsTitle: 'భద్రతా సూచనలు మరియు కోత నిరీక్షణ సమయం',
    daysWait: 'కోతకు ముందు వేచి ఉండాల్సిన రోజులు',
    treatNow: 'వెంటనే మందు వేయండి (లాభదాయకం)',
    removeOnly: 'రోగానికి గురైన మొక్కలను మాత్రమే తొలగించండి',
    notWorthSpraying: 'మందు కొట్టవద్దు (ఖర్చు నష్టం కన్నా ఎక్కువ)',
    filterAll: 'అన్ని పంటలు',
    filterHealthy: 'ఆరోగ్యకరమైనవి',
    catalogTitle: 'పంట తెగుళ్ళు మరియు లక్షణాల జాబితా',
    catalogSubtitle: 'తెగుళ్లు, ఎండు తెగులు, వైరస్, కీటకాలు మరియు పోషక లోపాల వాస్తవ క్షేత్ర ఛాయాచిత్రాలు.',
    pruneLeaves: 'రోగం సోకిన ఆకులను కత్తిరించండి',
    bottleCapDose: 'బాటిల్ మూత మోతాదు',
    wearClothMask: 'మాస్క్ & చేతి తొడుగులు ధరించండి',
    waitDaysHarvest: 'కోతకు ముందు నిరీక్షించండి',
    retakePhoto: 'మళ్ళీ ఫోటో తీయండి',
    useThisPhoto: 'ఈ ఫోటోను వాడండి',
    phoneCamera: 'ఫోన్ కెమెరా',
    osCamera: 'కెమెరా యాప్',
    simulatedField: 'నమూనా పొలం',
    hardwareSensor: 'కెమెరా సెన్సార్',
    fieldObservations: 'గుర్తించిన ముఖ్య లక్షణాలు',
    candidateConditions: 'సంభావ్య తెగుళ్ల జాబితా',
  },

  ml: {
    appTitle: 'CropCure',
    tagline: 'ചെറുകിട കർഷകർക്കുള്ള വിള ഡോക്ടർ',
    navDoctor: 'ഇല ഡോക്ടർ',
    navPacket: 'കീടനാശിനി പാക്കറ്റ് സ്കാനർ',
    navWalk: 'വിളവരി പരിശോധന',
    navRadar: 'ഗ്രാമ രോഗ മുന്നറിയിപ്പ്',
    navExpert: 'കൃഷി ഓഫീസർ പോർട്ടൽ',
    villageOffline: 'ഗ്രാമ ഓഫ്‌ലൈൻ',
    onlineSync: 'ഓൺലൈൻ സമന്വയം',
    takePhoto: 'ഫോട്ടോ എടുക്കുക',
    rowVideo: 'വരി വീഡിയോ',
    upload: 'അപ്‌ലോഡ്',
    chooseSample: 'അല്ലെങ്കിൽ സാമ്പിൾ തിരഞ്ഞെടുക്കുക',
    diagnosing: 'ഇലയുടെ ലക്ഷണങ്ങൾ പരിശോധിക്കുന്നു...',
    askBeforeGuess: 'ഘട്ടം 2: നേരിട്ട് കണ്ടുറപ്പിക്കാനുള്ള ചോദ്യങ്ങൾ',
    askBeforeGuessSubtitle: 'രോഗം കൃത്യമായി വേർതിരിച്ചറിയാൻ 2 ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക:',
    confidenceHigh: 'കൃത്യമായ രോഗനിർണ്ണയം',
    confidenceMedium: 'സാധ്യതയുള്ള രോഗം (ചോദ്യങ്ങളിലൂടെ ഉറപ്പുവരുത്തിയത്)',
    confidenceLow: 'വ്യക്തമല്ല - കൃഷി ഓഫീസറുടെ ഉപദേശം തേടുക',
    askExpertBtn: 'കൃഷി ഓഫീസർക്ക് വാട്സാപ്പിൽ അയക്കുക (1-ടാപ്പ്)',
    costLossTitle: 'മരുന്ന് തളിക്കുന്നത് ലാഭകരമാണോ? ചെലവ്-നഷ്ട കണക്കുകൂട്ടൽ',
    treatmentPlanner: 'കുറഞ്ഞ ചെലവിലുള്ള പ്രായോഗിക ചികിത്സ',
    packetScannerTitle: 'കീടനാശിനി പാക്കറ്റ് & ലേബൽ സ്കാനർ',
    walkScanTitle: 'വിളവരി നടത്ത സ്കാനർ',
    outbreakRadarTitle: 'അടുത്തുള്ള ഗ്രാമങ്ങളിലെ രോഗ മുന്നറിയിപ്പ്',
    expertPortalTitle: 'കൃഷി അസിസ്റ്റന്റ് പോർട്ടൽ',
    offlineModeActive: 'ഓഫ്‌ലൈൻ ഗ്രാമ മോഡ് സജീവം (ഇന്റർനെറ്റ് ആവശ്യമില്ല)',
    offlineModeDesc: 'ഫോണിൽ സുരക്ഷിതം. നെറ്റ്വർക്ക് ലഭിക്കുമ്പോൾ സ്വയമേവ സമന്വയിപ്പിക്കും.',
    speakVoice: 'ശബ്ദത്തിൽ കേൾക്കുക',
    stopVoice: 'ശബ്ദം നിർത്തുക',
    cheapOrganicFirst: 'ആദ്യം ചെലവ് കുറഞ്ഞ ജൈവ രീതികൾ (വേപ്പെണ്ണ മിശ്രിതം, ചാരം, കൊമ്പുകോതൽ)',
    chemicalGenericTitle: 'ജനറിക് മരുന്നിന്റെ പേരും കുപ്പിയുടെ അടപ്പ് അളവും',
    safetyIconsTitle: 'സുരക്ഷാ നിർദ്ദേശങ്ങളും വിളവെടുപ്പിന് മുമ്പുള്ള കാത്തിരിപ്പും',
    daysWait: 'വിളവെടുപ്പിന് മുമ്പ് കാത്തിരിക്കേണ്ട ദിവസങ്ങൾ',
    treatNow: 'ഉടനടി ചികിത്സിക്കുക (വളരെ ലാഭകരം)',
    removeOnly: 'രോഗബാധിതമായ ചെടികൾ മാത്രം പിഴുതുമാറ്റുക',
    notWorthSpraying: 'മരുന്ന് തളിക്കേണ്ടതില്ല (ചെലവ് നഷ്ടത്തേക്കാൾ കൂടുതലാണ്)',
    filterAll: 'എല്ലാ വിളകളും',
    filterHealthy: 'ആരോഗ്യമുള്ളവ',
    catalogTitle: 'വിള രോഗങ്ങളും ലക്ഷണങ്ങളും',
    catalogSubtitle: 'കുമിൾ രോഗങ്ങൾ, വാട്ടം, വൈറസ്, കീടങ്ങൾ, പോഷകക്കുറവ് എന്നിവയുടെ യഥാർത്ഥ വയൽ ഫോട്ടോഗ്രാഫി.',
    pruneLeaves: 'രോഗം ബാധിച്ച ഇലകൾ മുറിച്ചുമാറ്റുക',
    bottleCapDose: 'കുപ്പിയുടെ അടപ്പ് അളവ്',
    wearClothMask: 'മാസ്കും കയ്യുറകളും ധരിക്കുക',
    waitDaysHarvest: 'വിളവെടുപ്പിന് മുമ്പ് കാത്തിരിക്കുക',
    retakePhoto: 'വീണ്ടും ഫോട്ടോ എടുക്കുക',
    useThisPhoto: 'ഈ ഫോട്ടോ ഉപയോഗിക്കുക',
    phoneCamera: 'ഫോൺ ക്യാമറ',
    osCamera: 'ക്യാമറ ആപ്പ്',
    simulatedField: 'മാതൃകാ പാടം',
    hardwareSensor: 'ക്യാമറ സെൻസർ',
    fieldObservations: 'പ്രധാന ലക്ഷണങ്ങൾ',
    candidateConditions: 'സാധ്യതയുള്ള രോഗങ്ങൾ',
  },
};
