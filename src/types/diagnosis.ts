export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type CropCategory =
  | 'Fungal Disease'
  | 'Bacterial Disease'
  | 'Viral Disease'
  | 'Insect/Pest Damage'
  | 'Nutrient Deficiency'
  | 'Water / Environmental Stress'
  | 'Healthy'
  | 'Non-Crop / Unclear';

export interface FollowUpQuestion {
  id: string;
  question: string;
  icon: 'underside' | 'halo' | 'spreading' | 'soil' | 'stem' | 'pest';
  options: string[];
  selectedOption?: string;
  weights?: Record<string, number>;
  weightDescription?: string;
}

export interface CandidateDiagnosis {
  name: string;
  probability: number;
  distinguishingFactor: string;
}

export interface TreatmentInfo {
  culturalOrganic: string[];
  chemicalGeneric: {
    activeIngredient: string;
    localDosage: string;
    estimatedCostPerAcre: string;
    timing: string;
  };
  safetyWarnings: string[];
}

export interface EconomicAdvice {
  expectedLossWithoutTreatment: number; // e.g. 35%
  breakEvenThreshold: number; // e.g. 12%
  recommendation: 'treat_now' | 'remove_plants_only' | 'not_worth_spraying';
  explanation: string;
}

export interface DiagnosisResult {
  id?: string;
  crop: string;
  primaryDiagnosis: string;
  category: CropCategory;
  confidence: number; // 0.0 to 1.0
  confidenceLevel: ConfidenceLevel;
  severityEstimate: number; // 0 to 100%
  fieldVisualSymptoms: string[];
  candidateDiagnoses?: CandidateDiagnosis[];
  differentiatingQuestions: FollowUpQuestion[];
  treatmentOptions: TreatmentInfo;
  economicAdvice: EconomicAdvice;
  localLanguageSummary?: string;
  offlineMode?: boolean;
}

export interface PesticideScanResult {
  brandName: string;
  activeIngredient: string;
  formulation: string;
  matchStatus: 'Approved & Safe for Crop' | 'Caution - Off-Label for this Crop' | 'DANGER - Banned or High Hazard' | 'Unreadable Label';
  safetyColor: 'red' | 'yellow' | 'blue' | 'green';
  toxicityClass: string;
  isBannedOrRestricted: boolean;
  safeForCrop: boolean;
  dosageLocalUnits: string;
  dosageMetric: string;
  preHarvestIntervalDays: number;
  mandatorySafetyPrecautions: string[];
  verdictMessage: string;
}

export interface OutbreakAlert {
  id: string;
  crop: string;
  disease: string;
  distanceKm: number;
  villageName: string;
  reportedAgo: string;
  severityLevel: 'High Alert' | 'Moderate' | 'Watch';
  confirmedByExpert: boolean;
}

export interface ExpertCase {
  id: string;
  timestamp: number;
  farmerName: string;
  location: string;
  crop: string;
  imagePreview?: string;
  initialDiagnosis: string;
  initialConfidence: number;
  farmerNotes: string;
  status: 'pending' | 'reviewed';
  expertCorrection?: {
    reviewedBy: string;
    confirmedDiagnosis: string;
    severityScore: number;
    notes: string;
    reviewedAt: number;
  };
}
