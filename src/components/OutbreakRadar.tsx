import React, { useState } from 'react';
import { Radio, AlertTriangle, ShieldCheck, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { OutbreakAlert } from '../types/diagnosis';
import { INITIAL_OUTBREAK_ALERTS } from '../data/sampleFieldData';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';
import { playChime } from '../utils/speechHelper';

interface OutbreakRadarProps {
  currentCrop: string;
  language: SupportedLanguage;
}

export const OutbreakRadar: React.FC<OutbreakRadarProps> = ({ currentCrop, language }) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;
  const [alerts, setAlerts] = useState<OutbreakAlert[]>(INITIAL_OUTBREAK_ALERTS);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastNotes, setBroadcastNotes] = useState('');

  const handleBroadcastAlert = () => {
    playChime('success');
    const newAlert: OutbreakAlert = {
      id: `alert-${Date.now()}`,
      crop: currentCrop || 'Tomato',
      disease: 'Blight Outbreak (Farmer Reported)',
      distanceKm: 0.8,
      villageName: 'Local Village Block (Nearby)',
      reportedAgo: 'Just now',
      severityLevel: 'High Alert',
      confirmedByExpert: false,
    };
    setAlerts([newAlert, ...alerts]);
    setBroadcastSuccess(true);
    setShowBroadcastModal(false);
    setTimeout(() => setBroadcastSuccess(false), 5000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>Community Defense</span>
            <span aria-hidden="true">·</span>
            <span>Early Warning System</span>
            <span aria-hidden="true">·</span>
            <span>Radius: 15 km</span>
          </div>
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600" />
            <span>{t.outbreakRadarTitle}</span>
          </h3>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Outbreak Alert</span>
        </button>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Plant pathogens and pests travel with the wind and monsoon rain. Track confirmed infections in neighboring villages within 15 km so you can take preventative organic measures before spores land on your field.
      </p>

      {broadcastSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your outbreak warning has been broadcasted to neighboring farmers within 15km!</span>
        </div>
      )}

      {/* Outbreak Radar List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all ${
              alert.severityLevel === 'High Alert'
                ? 'bg-rose-50/50 border-rose-200'
                : alert.severityLevel === 'Moderate'
                ? 'bg-amber-50/50 border-amber-200'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.severityLevel === 'High Alert'
                      ? 'bg-rose-100 text-rose-700'
                      : alert.severityLevel === 'Moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-stone-900">{alert.disease}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        alert.severityLevel === 'High Alert'
                          ? 'bg-rose-600 text-white'
                          : alert.severityLevel === 'Moderate'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-600 text-white'
                      }`}
                    >
                      {alert.severityLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">Crop: {alert.crop}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      {alert.villageName} ({alert.distanceKm} km away)
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-stone-500 block text-[11px]">{alert.reportedAgo}</span>
                {alert.confirmedByExpert ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Extension Confirmed
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-500 mt-0.5 block">Farmer Report</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <h4 className="text-base font-bold text-stone-900">Broadcast Early Outbreak Warning</h4>
            <p className="text-xs text-stone-600">
              Notice a fast-spreading disease in your crop? Warning your neighbors lets them apply preventative neem spray before infection hits their plots.
            </p>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Affected Crop:</label>
              <input
                type="text"
                defaultValue={currentCrop}
                className="w-full h-10 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Observed Symptoms:</label>
              <textarea
                value={broadcastNotes}
                onChange={(e) => setBroadcastNotes(e.target.value)}
                placeholder="E.g., sudden wilting or black spot patches spreading after 2 days of rain..."
                className="w-full h-20 p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="flex-1 h-11 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcastAlert}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Send Alert Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
