import React, { useState } from 'react';
import { Sprout, FlaskConical, AlertTriangle, Volume2, VolumeX, ShieldAlert, Check, Calendar, Users, Waves, Scissors, Droplets } from 'lucide-react';
import { TreatmentInfo } from '../types/diagnosis';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';
import { speakText, stopSpeaking, playChime } from '../utils/speechHelper';

interface TreatmentPlannerProps {
  treatment: TreatmentInfo;
  diseaseName: string;
  cropName: string;
  language: SupportedLanguage;
}

export const TreatmentPlanner: React.FC<TreatmentPlannerProps> = ({
  treatment,
  diseaseName,
  cropName,
  language,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioPlayback = async () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    playChime('click');
    setIsPlayingAudio(true);

    const speechScript = `Treatment advice for ${diseaseName} on ${cropName}. First, cheap natural methods: ${treatment.culturalOrganic.join('. ')}. If spraying chemical, use generic ${treatment.chemicalGeneric.activeIngredient}. Dosage: ${treatment.chemicalGeneric.localDosage}. ${treatment.chemicalGeneric.timing}. Important safety: ${treatment.safetyWarnings.join('. ')}.`;

    await speakText(
      speechScript,
      language,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-6">
      {/* Header with Voice Guidance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Practical Field Advisory</span>
            <span aria-hidden="true">·</span>
            <span>Cheap Options First</span>
            <span aria-hidden="true">·</span>
            <span>Local Dosing</span>
          </div>
          <h3 className="text-base font-semibold text-stone-900">
            {t.treatmentPlanner}
          </h3>
        </div>

        <button
          onClick={handleAudioPlayback}
          className={`h-10 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
            isPlayingAudio
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.stopVoice}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t.speakVoice}</span>
            </>
          )}
        </button>
      </div>

      {/* Pictorial Comic Strip for Non-Readers */}
      <div>
        <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          {language === 'hi' ? 'चित्रित मार्गदर्शिका (खेत में झटपट समझने के लिए)' :
           language === 'kn' ? 'ಚಿತ್ರಗಳ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ (ಸುಲಭ ಹೊಲದ ಬಳಕೆ)' :
           language === 'ta' ? 'பட வழிகாட்டி (விரைவான வயல் பயன்பாடு)' :
           language === 'te' ? 'చిత్ర మార్గదర్శిని (పొలంలో సులభంగా అర్థం చేసుకోడానికి)' :
           language === 'ml' ? 'ചിത്ര സഹിതമുള്ള വഴികാട്ടി (വേഗത്തിലുള്ള ഉപയോഗത്തിന്)' :
           'Pictorial Step-by-Step Guide (Comic Strip for Quick Field Use)'}
        </p>
        {(() => {
          const stepLabels = {
            en: {
              s1Title: 'Prune Leaves', s1Desc: 'Clip off heavily infected bottom leaves',
              s2Title: '1 Bottle Cap', s2Desc: 'Fill standard water bottle cap (approx 10ml)',
              s3Title: 'Mix in 2L Water', s3Desc: 'Stir gently into clean bucket or sprayer',
              s4Title: 'Morning Spray', s4Desc: 'Target underside of leaves before sun gets hot'
            },
            hi: {
              s1Title: 'पत्तियां छांटें', s1Desc: 'संक्रमित निचली पत्तियों को काटकर नष्ट करें',
              s2Title: '1 बोतल का ढक्कन', s2Desc: 'साधारण पानी की बोतल का ढक्कन (लगभग 10ml)',
              s3Title: '2L पानी में घोलें', s3Desc: 'साफ बाल्टी या स्प्रेयर में अच्छी तरह मिलाएं',
              s4Title: 'सुबह छिड़काव करें', s4Desc: 'धूप तेज होने से पहले पत्ती के नीचे स्प्रे करें'
            },
            kn: {
              s1Title: 'ಎಲೆ ಕತ್ತರಿಸಿ', s1Desc: 'ರೋಗಗ್ರಸ್ತ ತಳಭಾಗದ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ ನಾಶಮಾಡಿ',
              s2Title: '1 ಬಾಟಲ್ ಮುಚ್ಚಳ', s2Desc: 'ಸಾಮಾನ್ಯ ಬಾಟಲ್ ಮುಚ್ಚಳದ ಅಳತೆ (ಸುಮಾರು 10ml)',
              s3Title: '2L ನೀರಿಗೆ ಹಾಕಿ', s3Desc: 'ಸ್ವಚ್ಛ ಬಕೆಟ್ ಅಥವಾ ಸ್ಪ್ರೇಯರ್‌ನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಕಲಸಿ',
              s4Title: 'ಮುಂಜಾನೆ ಸಿಂಪಡಿಸಿ', s4Desc: 'ಬಿಸಿಲು ಬರುವ ಮುನ್ನ ಎಲೆಯ ಕೆಳಭಾಗಕ್ಕೆ ಸ್ಪ್ರೇ ಮಾಡಿ'
            },
            ta: {
              s1Title: 'இலைகளை நீக்குக', s1Desc: 'நோய்வாய்ப்பட்ட கீழ் இலைகளை நறுக்கி அழிக்கவும்',
              s2Title: '1 பாட்டில் மூடி', s2Desc: 'சாதாரண பாட்டில் மூடி அளவு (சுமார் 10 மிலி)',
              s3Title: '2L நீரில் கலக்குக', s3Desc: 'சுத்தமான வாளி அல்லது தெளிப்பானில் கலக்கவும்',
              s4Title: 'காலை தெளிக்கவும்', s4Desc: 'வெயில் ஏறுவதற்கு முன் இலைகளின் அடியில் தெளிக்கவும்'
            },
            te: {
              s1Title: 'ఆకులు కత్తిరించండి', s1Desc: 'తెగులు సోకిన కింది ఆకులను కత్తిరించి నాశనం చేయండి',
              s2Title: '1 బాటిల్ మూత', s2Desc: 'సాధారణ బాటిల్ మూత మోతాదు (సుమారు 10ml)',
              s3Title: '2L నీటిలో కలపండి', s3Desc: 'శుభ్రమైన బకెట్ లేదా స్ప్రేయర్‌లో బాగా కలపండి',
              s4Title: 'ఉదయాన్నే స్ప్రే చేయండి', s4Desc: 'ఎండ ఎక్కకముందే ఆకుల అడుగు భాగాన పిచికారీ చేయండి'
            },
            ml: {
              s1Title: 'ഇല മുറിക്കുക', s1Desc: 'രോഗം ബാധിച്ച താഴ്ഭാഗത്തെ ഇലകൾ വെട്ടിമാറ്റുക',
              s2Title: '1 അടപ്പ് അളവ്', s2Desc: 'സാധാരണ കുപ്പിയുടെ അടപ്പ് (ഏകദേശം 10 മില്ലി)',
              s3Title: '2L വെള്ളത്തിൽ ചേർക്കുക', s3Desc: 'വൃത്തിയുള്ള ബക്കറ്റിലോ സ്പ്രേയറിലോ കലർത്തുക',
              s4Title: 'രാവിലെ തളിക്കുക', s4Desc: 'വെയിൽ മൂക്കുന്നതിനുമുമ്പ് ഇലയുടെ അടിയിൽ തളിക്കുക'
            }
          }[language] || {
            s1Title: 'Prune Leaves', s1Desc: 'Clip off heavily infected bottom leaves',
            s2Title: '1 Bottle Cap', s2Desc: 'Fill standard water bottle cap (approx 10ml)',
            s3Title: 'Mix in 2L Water', s3Desc: 'Stir gently into clean bucket or sprayer',
            s4Title: 'Morning Spray', s4Desc: 'Target underside of leaves before sun gets hot'
          };

          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mb-2">
                  1
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center mb-2 text-emerald-600">
                  <Scissors className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-900 block mb-1">{stepLabels.s1Title}</span>
                <span className="text-[11px] text-stone-600 leading-tight">{stepLabels.s1Desc}</span>
              </div>

              {/* Step 2: Bottle Cap Dosing */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mb-2">
                  2
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center mb-2 text-sky-600">
                  <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="7" y="10" width="18" height="14" rx="3" fill="#e0f2fe" stroke="#0284c7" />
                    <line x1="11" y1="10" x2="11" y2="24" stroke="#0284c7" />
                    <line x1="16" y1="10" x2="16" y2="24" stroke="#0284c7" />
                    <line x1="21" y1="10" x2="21" y2="24" stroke="#0284c7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-stone-900 block mb-1">{stepLabels.s2Title}</span>
                <span className="text-[11px] text-stone-600 leading-tight">{stepLabels.s2Desc}</span>
              </div>

              {/* Step 3 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mb-2">
                  3
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center mb-2 text-blue-600">
                  <Droplets className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-900 block mb-1">{stepLabels.s3Title}</span>
                <span className="text-[11px] text-stone-600 leading-tight">{stepLabels.s3Desc}</span>
              </div>

              {/* Step 4 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center mb-2">
                  4
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-stone-200 flex items-center justify-center mb-2 text-amber-600">
                  <Waves className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-stone-900 block mb-1">{stepLabels.s4Title}</span>
                <span className="text-[11px] text-stone-600 leading-tight">{stepLabels.s4Desc}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* 1. Low Cost / Organic Options First */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>{t.cheapOrganicFirst}</span>
        </h4>
        <ul className="space-y-2">
          {treatment.culturalOrganic.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800">
              <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-900 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                ✓
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Generic Chemical Name & Bottle Cap Dosage */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FlaskConical className="w-4 h-4 text-stone-700" />
          <span>{t.chemicalGenericTitle}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Generic Active Chemical (Ask Agrovendor for this name):
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-900 block mt-0.5">
              {treatment.chemicalGeneric.activeIngredient}
            </span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">
              Cost: {treatment.chemicalGeneric.estimatedCostPerAcre}
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Intuitive Local Unit Dosing:
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-900 block mt-0.5">
              {treatment.chemicalGeneric.localDosage}
            </span>
            <span className="text-[11px] text-stone-600 block mt-0.5">
              {treatment.chemicalGeneric.timing}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Safety Warnings & Withholding Period */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>{t.safetyIconsTitle}</span>
        </h4>

        {/* Visual Safety Icons Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-center flex flex-col items-center">
            <span className="text-lg mb-1" role="img" aria-label="Gloves">🧤</span>
            <span className="text-[10px] font-semibold text-stone-800">Wear Gloves / Cloth</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-center flex flex-col items-center">
            <Calendar className="w-5 h-5 text-amber-700 mb-1" />
            <span className="text-[10px] font-semibold text-stone-800">Wait 7-14 Days Pre-Harvest</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200 text-center flex flex-col items-center">
            <Users className="w-5 h-5 text-rose-700 mb-1" />
            <span className="text-[10px] font-semibold text-stone-800">Keep Kids & Goats Away</span>
          </div>
        </div>

        <ul className="space-y-1.5">
          {treatment.safetyWarnings.map((warn, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-amber-950">
              <span className="text-amber-600 font-bold mt-0.5">•</span>
              <span className="leading-relaxed">{warn}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
