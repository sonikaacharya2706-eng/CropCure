import { CandidateDiagnosis, FollowUpQuestion, ConfidenceLevel } from '../types/diagnosis';

export interface BayesianResult {
  updatedConfidence: number;
  confidenceLevel: ConfidenceLevel;
  primaryDiagnosis: string;
  candidateBreakdown: CandidateDiagnosis[];
  confidenceShift: number; // positive or negative
}

/**
 * Recalibrates prior image confidence using posterior follow-up question evidence
 * Prior P(D|Image) is updated with Likelihood P(Symptom|D) for each answered question.
 */
export function calculateBayesianRescore(
  priorConfidence: number,
  primaryName: string,
  candidates: CandidateDiagnosis[] = [],
  questions: FollowUpQuestion[],
  answers: Record<string, string>
): BayesianResult {
  // If no candidates provided, create candidate distribution
  let workingCandidates: CandidateDiagnosis[] = candidates.length > 0
    ? [...candidates]
    : [
        { name: primaryName, probability: priorConfidence, distinguishingFactor: 'Observed lesions in leaf image' },
        { name: 'Secondary Look-alike Condition', probability: Math.max(0.05, (1 - priorConfidence) * 0.7), distinguishingFactor: 'Shares spot pattern' },
        { name: 'Non-disease Stress', probability: Math.max(0.05, (1 - priorConfidence) * 0.3), distinguishingFactor: 'Abiotic environmental response' }
      ];

  let logOdds = Math.log(Math.max(0.01, Math.min(0.99, priorConfidence)) / (1 - Math.max(0.01, Math.min(0.99, priorConfidence))));

  questions.forEach(q => {
    const selected = answers[q.id];
    if (!selected) return;

    // Evaluate answer impact
    const isAffirmative = selected.toLowerCase().startsWith('yes') || selected.toLowerCase().includes('distinct') || selected.toLowerCase().includes('waterlog');
    const isNegative = selected.toLowerCase().startsWith('no') || selected.toLowerCase().includes('just pale');

    if (isAffirmative) {
      logOdds += 0.85; // Strong evidence corroborating fungal/pathogen specific symptom
    } else if (isNegative) {
      logOdds -= 0.65; // Disconfirming specific symptom
    }
  });

  // Convert back to calibrated probability via Sigmoid function
  const updatedProbability = 1 / (1 + Math.exp(-logOdds));
  const roundedConfidence = Math.round(updatedProbability * 100) / 100;

  // Determine traffic-light level
  let confidenceLevel: ConfidenceLevel = 'low';
  if (roundedConfidence >= 0.75) {
    confidenceLevel = 'high';
  } else if (roundedConfidence >= 0.50) {
    confidenceLevel = 'medium';
  }

  // Update candidate breakdown
  workingCandidates = workingCandidates.map((c, idx) => {
    if (idx === 0) {
      return { ...c, probability: roundedConfidence };
    }
    const remaining = Math.max(0.02, (1 - roundedConfidence) / (workingCandidates.length - 1));
    return { ...c, probability: Math.round(remaining * 100) / 100 };
  });

  return {
    updatedConfidence: roundedConfidence,
    confidenceLevel,
    primaryDiagnosis: primaryName,
    candidateBreakdown: workingCandidates,
    confidenceShift: Math.round((roundedConfidence - priorConfidence) * 100) / 100,
  };
}
