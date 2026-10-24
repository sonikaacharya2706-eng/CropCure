import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertOctagon, XCircle, ArrowRight } from 'lucide-react';
import { EconomicAdvice } from '../types/diagnosis';
import { SupportedLanguage, UI_STRINGS } from '../data/translations';

interface CostLossCalculatorProps {
  initialAdvice: EconomicAdvice;
  severityPercent: number;
  cropName: string;
  language: SupportedLanguage;
}

export const CostLossCalculator: React.FC<CostLossCalculatorProps> = ({
  initialAdvice,
  severityPercent,
  cropName,
  language,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  // Interactive farmer farm parameters
  const [farmSizeAcres, setFarmSizeAcres] = useState<number>(1);
  const [harvestValuePerAcre, setHarvestValuePerAcre] = useState<number>(450); // e.g. $450 harvest expected per acre
  const [treatmentCostPerAcre, setTreatmentCostPerAcre] = useState<number>(6); // e.g. $6 for generic spray or neem

  // Dynamic calculations based on severity & inputs
  // Yield loss factor: severity% * 0.9 (empirical agricultural loss scaling)
  const lossPercentage = Math.min(80, Math.round(severityPercent * 0.9));
  const totalHarvestPotential = farmSizeAcres * harvestValuePerAcre;
  const monetaryLossWithoutTreatment = Math.round(totalHarvestPotential * (lossPercentage / 100));
  const totalTreatmentCost = Math.round(farmSizeAcres * treatmentCostPerAcre);
  const netSavingsIfTreated = monetaryLossWithoutTreatment - totalTreatmentCost;

  // Decision rule
  let decision: 'treat_now' | 'remove_plants_only' | 'not_worth_spraying' = 'treat_now';
  if (severityPercent < 8 || monetaryLossWithoutTreatment < totalTreatmentCost * 1.5) {
    decision = 'not_worth_spraying';
  } else if (severityPercent <= 20 && farmSizeAcres <= 1) {
    decision = 'remove_plants_only';
  } else {
    decision = 'treat_now';
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
        <span>Economic Threshold</span>
        <span aria-hidden="true">·</span>
        <span>Cost vs. Yield Loss</span>
        <span aria-hidden="true">·</span>
        <span>Rule-Based Decision</span>
      </div>

      <h3 className="text-base font-semibold text-stone-900 mb-2 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-600" />
        <span>{t.costLossTitle}</span>
      </h3>

      <p className="text-xs text-stone-600 mb-4 leading-relaxed">
        Don&apos;t waste money on sprays if the chemical costs more than the crop damage. Adjust your field values to calculate whether spraying makes financial sense.
      </p>

      {/* Decision Banner */}
      <div
        className={`p-4 rounded-xl border mb-5 flex items-start gap-3 ${
          decision === 'treat_now'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : decision === 'remove_plants_only'
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-stone-100 border-stone-300 text-stone-900'
        }`}
      >
        {decision === 'treat_now' && (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        )}
        {decision === 'remove_plants_only' && (
          <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        )}
        {decision === 'not_worth_spraying' && (
          <XCircle className="w-6 h-6 text-stone-600 shrink-0 mt-0.5" />
        )}

        <div>
          <span className="text-xs uppercase tracking-wider font-semibold block opacity-80">
            Field Verdict:
          </span>
          <h4 className="text-sm sm:text-base font-bold mb-1">
            {decision === 'treat_now' && t.treatNow}
            {decision === 'remove_plants_only' && t.removeOnly}
            {decision === 'not_worth_spraying' && t.notWorthSpraying}
          </h4>
          <p className="text-xs leading-relaxed opacity-90">
            {decision === 'treat_now' &&
              `At ${severityPercent}% severity, unmanaged disease risks losing $${monetaryLossWithoutTreatment} of ${cropName}. Treatment costs only $${totalTreatmentCost}. Treating saves approximately $${netSavingsIfTreated}.`}
            {decision === 'remove_plants_only' &&
              `Infection is mild (${severityPercent}%). Chemical sprays will waste money and kill beneficial predators. Hand-prune and bury the infected leaves manually at $0 cost.`}
            {decision === 'not_worth_spraying' &&
              `Damage is below economic injury threshold. Spraying costs ($${totalTreatmentCost}) exceed realistic crop yield savings ($${monetaryLossWithoutTreatment}). Conserve your cash.`}
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-stone-100">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Plot Size: <span className="font-mono font-bold text-stone-900">{farmSizeAcres} Acre(s)</span>
          </label>
          <input
            type="range"
            min="0.25"
            max="10"
            step="0.25"
            value={farmSizeAcres}
            onChange={(e) => setFarmSizeAcres(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
            <span>0.25 ac</span>
            <span>5 ac</span>
            <span>10 ac</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Expected Harvest: <span className="font-mono font-bold text-stone-900">${harvestValuePerAcre}/ac</span>
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={harvestValuePerAcre}
            onChange={(e) => setHarvestValuePerAcre(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
            <span>$100</span>
            <span>$1,000</span>
            <span>$2,000</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">
            Treatment Cost: <span className="font-mono font-bold text-stone-900">${treatmentCostPerAcre}/ac</span>
          </label>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={treatmentCostPerAcre}
            onChange={(e) => setTreatmentCostPerAcre(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
            <span>$2 (Neem)</span>
            <span>$15</span>
            <span>$30</span>
          </div>
        </div>
      </div>

      {/* Comparison Strip */}
      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-500 font-medium">Estimated Loss</div>
          <div className="text-sm sm:text-base font-bold text-rose-600 font-mono tabular-nums">
            -${monetaryLossWithoutTreatment}
          </div>
        </div>
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-500 font-medium">Treatment Cost</div>
          <div className="text-sm sm:text-base font-bold text-stone-800 font-mono tabular-nums">
            ${totalTreatmentCost}
          </div>
        </div>
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <div className="text-[10px] text-stone-500 font-medium">Net Value Saved</div>
          <div className="text-sm sm:text-base font-bold text-emerald-600 font-mono tabular-nums">
            +${Math.max(0, netSavingsIfTreated)}
          </div>
        </div>
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex flex-col justify-center">
          <div className="text-[10px] text-stone-500 font-medium">ROI Factor</div>
          <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
            {totalTreatmentCost > 0 ? `${(monetaryLossWithoutTreatment / totalTreatmentCost).toFixed(1)}x return` : 'Free'}
          </div>
        </div>
      </div>
    </div>
  );
};
