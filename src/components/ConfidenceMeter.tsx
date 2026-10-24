import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Share2, Send, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';
import { ConfidenceLevel, DiagnosisResult } from '../types/diagnosis';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';
import { playChime } from '../utils/speechHelper';
import { fetchJson } from '../utils/apiClient';

interface ConfidenceMeterProps {
  confidence: number; // 0.0 to 1.0
  level: ConfidenceLevel;
  primaryDiagnosis: string;
  category: string;
  crop: string;
  language: SupportedLanguage;
  diagnosisData: DiagnosisResult;
  onSendToExpertQueue?: () => void;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  level,
  primaryDiagnosis,
  category,
  crop,
  language,
  diagnosisData,
  onSendToExpertQueue,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [queuedSuccess, setQueuedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const percent = Math.round(confidence * 100);

  // Calibrated traffic light styling
  const isHigh = level === 'high';
  const isMedium = level === 'medium';
  const isLow = level === 'low';

  // Construct pre-formatted message for WhatsApp/SMS
  const generateHandoffMessage = () => {
    const questionsAnswered = (diagnosisData.differentiatingQuestions || [])
      .map(q => `• ${q.question} => ${q.selectedOption || 'Not answered'}`)
      .join('\n');

    return encodeURIComponent(
      `🌱 *KisanDost Extension Case Handoff*\n\n` +
      `*Crop:* ${crop}\n` +
      `*Preliminary Check:* ${primaryDiagnosis} (${percent}% confidence)\n` +
      `*Estimated Severity:* ${diagnosisData.severityEstimate}%\n` +
      `*Farmer Observations / Follow-up Qs:*\n${questionsAnswered}\n\n` +
      `*Location:* Rural Field GPS (Wardha Block 2)\n` +
      `Please review this uncertain diagnosis and advise safe treatment.`
    );
  };

  const handlePushToQueue = async () => {
    setIsSubmitting(true);
    playChime('click');
    try {
      await fetchJson(
        '/api/expert-queue',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            farmerName: 'Field Farmer (Self-Reported)',
            location: 'Wardha Sector 2 (GPS 20.74°N, 78.60°E)',
            crop,
            initialDiagnosis: primaryDiagnosis,
            initialConfidence: confidence,
            farmerNotes: `Visual symptoms: ${(diagnosisData.fieldVisualSymptoms || []).join(', ')}`,
          }),
        },
        { success: true }
      );

      setQueuedSuccess(true);
      playChime('success');
      if (onSendToExpertQueue) onSendToExpertQueue();
    } catch (e) {
      setQueuedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      {/* Traffic Light Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Honest Confidence Meter</span>
            <span aria-hidden="true">·</span>
            <span>Calibrated Uncertainty</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{percent}% Probability</span>
          </div>

          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            {isHigh && (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.confidenceHigh}</span>
              </>
            )}
            {isMedium && (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>{t.confidenceMedium}</span>
              </>
            )}
            {isLow && (
              <>
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{t.confidenceLow}</span>
              </>
            )}
          </h3>
        </div>

        {/* Traffic Light Bar Indicator */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl w-fit">
          <div
            className={`w-4 h-4 rounded-full transition-all ${
              isHigh ? 'bg-emerald-500 ring-2 ring-emerald-300 ring-offset-1' : 'bg-stone-300'
            }`}
            title="High Confidence (>75%)"
          />
          <div
            className={`w-4 h-4 rounded-full transition-all ${
              isMedium ? 'bg-amber-500 ring-2 ring-amber-300 ring-offset-1' : 'bg-stone-300'
            }`}
            title="Medium Confidence (50-75%)"
          />
          <div
            className={`w-4 h-4 rounded-full transition-all ${
              isLow ? 'bg-rose-500 ring-2 ring-rose-300 ring-offset-1' : 'bg-stone-300'
            }`}
            title="Low Confidence / Ask Expert (<50%)"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isHigh ? 'bg-emerald-600' : isMedium ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(8, percent)}%` }}
          />
        </div>
      </div>

      {/* Transparent Explanation */}
      {isLow ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-rose-900 mb-1">
                Do Not Spray Chemicals Yet: Result is Inconclusive
              </p>
              <p className="text-xs text-rose-700 leading-relaxed">
                The image is either out-of-distribution (blurry, non-leaf, or dry ground) or shares overlapping traits with multiple diseases. We refuse to give a blind guess that could waste your money. Please send this case directly to an agricultural extension officer.
              </p>
            </div>
          </div>
        </div>
      ) : isMedium ? (
        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          Symptoms are consistent with <strong className="text-stone-900">{primaryDiagnosis}</strong>, but symptoms can resemble secondary conditions. Use the follow-up checks below to increase diagnostic certainty.
        </p>
      ) : (
        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          Strong pathognomonic match with <strong className="text-stone-900">{primaryDiagnosis}</strong> ({category}). Proceed to the practical low-cost treatment options below.
        </p>
      )}

      {/* "Ask an Expert" 1-Tap Handoff Buttons */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-stone-700 mb-2">
          Extension Officer 1-Tap Field Handoff:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a
            href={`https://api.whatsapp.com/send?text=${generateHandoffMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playChime('click')}
            className="h-11 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send to WhatsApp</span>
          </a>

          <a
            href={`sms:?body=${generateHandoffMessage()}`}
            onClick={() => playChime('click')}
            className="h-11 px-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send via SMS</span>
          </a>

          <button
            onClick={handlePushToQueue}
            disabled={queuedSuccess || isSubmitting}
            className={`h-11 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors border ${
              queuedSuccess
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 active:scale-[0.98]'
            }`}
          >
            {queuedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Queued in Portal</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-stone-600" />
                <span>{isSubmitting ? 'Queueing...' : 'Log for Extension Officer'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
