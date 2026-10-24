import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { ExpertCase } from '../types/diagnosis';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';
import { playChime } from '../utils/speechHelper';
import { fetchJson } from '../utils/apiClient';

interface ExpertReviewDashboardProps {
  language: SupportedLanguage;
}

const DEFAULT_CASES: ExpertCase[] = [
  {
    id: 'case-101',
    timestamp: Date.now() - 3600000 * 4,
    farmerName: 'Ramesh Patel',
    location: 'Wardha, Field 2B (20.74° N, 78.60° E)',
    crop: 'Tomato',
    initialDiagnosis: 'Possible Early Blight or Septoria Leaf Spot',
    initialConfidence: 0.58,
    farmerNotes: 'Concentric ring spots starting on lower leaves after rain. Underside has small dark dots.',
    status: 'pending',
  },
  {
    id: 'case-102',
    timestamp: Date.now() - 3600000 * 12,
    farmerName: 'Fatima Mwangi',
    location: 'Nakuru Sector 4 (0.30° S, 36.08° E)',
    crop: 'Maize',
    initialDiagnosis: 'Suspected Fall Armyworm damage',
    initialConfidence: 0.65,
    farmerNotes: 'Chewed whorl leaves with window-pane feeding patches.',
    status: 'reviewed',
    expertCorrection: {
      reviewedBy: 'Dr. John Ochieng (Extension Agrologist)',
      confirmedDiagnosis: 'Fall Armyworm (Spodoptera frugiperda) Stage 2',
      severityScore: 35,
      notes: 'Apply botanical neem extract directly into whorl or Bt. Avoid broad pyrethroids.',
      reviewedAt: Date.now() - 3600000 * 6,
    },
  },
];

export const ExpertReviewDashboard: React.FC<ExpertReviewDashboardProps> = ({ language }) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [cases, setCases] = useState<ExpertCase[]>(DEFAULT_CASES);
  const [selectedCase, setSelectedCase] = useState<ExpertCase | null>(DEFAULT_CASES[0]);
  const [correctionDiagnosis, setCorrectionDiagnosis] = useState('');
  const [correctionSeverity, setCorrectionSeverity] = useState(25);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJson<{ cases: ExpertCase[] }>(
        '/api/expert-queue',
        undefined,
        { cases: DEFAULT_CASES }
      );
      if (data && data.cases) {
        setCases(data.cases);
        if (data.cases.length > 0 && !selectedCase) {
          setSelectedCase(data.cases[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch expert queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSelectCase = (c: ExpertCase) => {
    setSelectedCase(c);
    setCorrectionDiagnosis(c.expertCorrection?.confirmedDiagnosis || c.initialDiagnosis);
    setCorrectionSeverity(c.expertCorrection?.severityScore || 25);
    setCorrectionNotes(c.expertCorrection?.notes || '');
  };

  const handleSaveCorrection = async () => {
    if (!selectedCase) return;
    setIsSubmitting(true);
    playChime('click');

    const localUpdatedCase: ExpertCase = {
      ...selectedCase,
      status: 'reviewed',
      expertCorrection: {
        reviewedBy: 'Dr. John Ochieng (Senior Field Agronomist)',
        confirmedDiagnosis: correctionDiagnosis,
        severityScore: correctionSeverity,
        notes: correctionNotes,
        reviewedAt: Date.now(),
      },
    };

    try {
      const data = await fetchJson<{ success: boolean; case: ExpertCase }>(
        `/api/expert-queue/${selectedCase.id}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewedBy: 'Dr. John Ochieng (Senior Field Agronomist)',
            confirmedDiagnosis: correctionDiagnosis,
            severityScore: correctionSeverity,
            notes: correctionNotes,
          }),
        },
        { success: true, case: localUpdatedCase }
      );

      playChime('success');
      const updated = data?.case || localUpdatedCase;
      setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updated : c)));
      setSelectedCase(updated);
    } catch (err) {
      console.error(err);
      setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? localUpdatedCase : c)));
      setSelectedCase(localUpdatedCase);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Active Learning Loop</span>
            <span aria-hidden="true">·</span>
            <span>Human-in-the-Loop Feedback</span>
            <span aria-hidden="true">·</span>
            <span>Model Retraining Pipeline</span>
          </div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>{t.expertPortalTitle}</span>
          </h3>
        </div>

        <button
          onClick={fetchCases}
          className="h-9 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        When the AI is uncertain (&lt;50% confidence), the case is flagged for human review. Extension workers and plant pathologists inspect farmer field photos, verify symptoms, and correct the diagnostic label. These expert-corrected labels automatically become fresh training pairs to continuously improve the on-device TFLite model.
      </p>

      {/* Two Column Layout: Cases List + Detail/Correction Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cases List */}
        <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Incoming Review Queue ({cases.length} Cases)
          </span>

          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectCase(c)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedCase?.id === c.id
                  ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400'
                  : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-stone-900">{c.farmerName}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'reviewed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {c.status === 'reviewed' ? 'Corrected & Stored' : 'Pending Review'}
                </span>
              </div>

              <div className="text-xs text-stone-600 line-clamp-1 mb-1">
                <strong className="text-stone-800">{c.crop}:</strong> {c.initialDiagnosis}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>{c.location}</span>
                <span className="font-mono">Initial Conf: {Math.round(c.initialConfidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Case Workspace */}
        <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
          {selectedCase ? (
            <>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{selectedCase.farmerName}</h4>
                  <span className="text-xs text-stone-500">{selectedCase.location}</span>
                </div>
                <span className="text-xs text-stone-600 font-medium">
                  Crop: <strong className="text-stone-900">{selectedCase.crop}</strong>
                </span>
              </div>

              {/* Farmer Observation */}
              <div className="bg-white p-3 rounded-lg border border-stone-200 text-xs">
                <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">
                  Farmer Field Symptoms:
                </span>
                <p className="text-stone-800 italic">&quot;{selectedCase.farmerNotes}&quot;</p>
              </div>

              {/* Preliminary AI Flag */}
              <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Initial Model Output: <strong>{selectedCase.initialDiagnosis}</strong> ({Math.round(selectedCase.initialConfidence * 100)}% confidence)
                </span>
              </div>

              {/* Extension Correction Form */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-stone-900 block">
                  Agronomist Pathological Verification:
                </span>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Confirmed Diagnosis / Verified Pathogen:
                  </label>
                  <input
                    type="text"
                    value={correctionDiagnosis}
                    onChange={(e) => setCorrectionDiagnosis(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-900 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Verified Severity Estimate ({correctionSeverity}%):
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={correctionSeverity}
                    onChange={(e) => setCorrectionSeverity(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Field Advice & Corrective Treatment Notes for Farmer:
                  </label>
                  <textarea
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    rows={3}
                    placeholder="Provide specific advice for local conditions..."
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Feeds Active Learning Retraining</span>
                  </div>

                  <button
                    onClick={handleSaveCorrection}
                    disabled={isSubmitting}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 active:scale-[0.98] transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Commit Verified Correction'}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-stone-500">
              Select a case from the queue to review and correct.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
