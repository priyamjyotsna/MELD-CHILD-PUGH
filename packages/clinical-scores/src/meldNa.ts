import type { MeldNaInput, MeldResult, ComponentContribution } from './types';
import {
  MELD_INTERPRETATIONS,
  MELD_NA_REFERENCES,
  CITATION_INFO,
  NORMAL_RANGES,
} from './constants';
import { calculateMeld, getBilirubinStatus, getCreatinineStatus, getInrStatus } from './meld';

function getSodiumStatus(v: number): ComponentContribution['status'] {
  if (v >= 135 && v <= 145) return 'normal';
  if (v >= 130) return 'mildly_elevated';
  if (v >= 125) return 'elevated';
  return 'critical';
}

export function calculateMeldNa(input: MeldNaInput): MeldResult {
  const { bilirubin: rawBili, creatinine: rawCr, inr: rawInr, onDialysis, sodium: rawSodium } =
    input;

  // Clamp MELD base values
  const bilirubin = Math.max(rawBili, 1.0);
  let creatinine = Math.max(rawCr, 1.0);
  creatinine = Math.min(creatinine, 4.0);
  if (onDialysis) creatinine = 4.0;
  const inr = Math.max(rawInr, 1.0);

  // Clamp sodium: 125–137
  const sodium = Math.min(137, Math.max(125, rawSodium));

  // Calculate base MELD first
  const baseMeldResult = calculateMeld({ bilirubin: rawBili, creatinine: rawCr, inr: rawInr, onDialysis });
  const meldI = baseMeldResult.rawScore;

  // MELD-Na formula: MELD(i) + 1.32×(137 - Na) - (0.033 × MELD(i) × (137 - Na))
  const sodiumDiff = 137 - sodium;
  const rawScore = meldI + 1.32 * sodiumDiff - 0.033 * meldI * sodiumDiff;

  const score = Math.min(40, Math.max(6, Math.round(rawScore)));

  // Contribution calculation: sodium term relative to total adjustment
  const crTerm = Math.abs(0.957 * Math.log(creatinine));
  const biliTerm = Math.abs(0.378 * Math.log(bilirubin));
  const inrTerm = Math.abs(1.12 * Math.log(inr));
  const sodiumTerm = Math.abs(1.32 * sodiumDiff - 0.033 * meldI * sodiumDiff);
  const totalTerms = crTerm + biliTerm + inrTerm + sodiumTerm || 1;

  const components: ComponentContribution[] = [
    {
      name: 'Serum Bilirubin',
      inputValue: rawBili,
      clampedValue: bilirubin,
      unit: NORMAL_RANGES.bilirubin.unit,
      normalRange: NORMAL_RANGES.bilirubin.label,
      status: getBilirubinStatus(rawBili),
      contribution: biliTerm / totalTerms,
      clampNote: rawBili < 1.0 ? `Adjusted from ${rawBili} to 1.0` : undefined,
    },
    {
      name: 'Serum Creatinine',
      inputValue: rawCr,
      clampedValue: creatinine,
      unit: NORMAL_RANGES.creatinine.unit,
      normalRange: NORMAL_RANGES.creatinine.label,
      status: getCreatinineStatus(rawCr),
      contribution: crTerm / totalTerms,
      clampNote: onDialysis
        ? 'Set to 4.0 (dialysis)'
        : rawCr < 1.0
          ? `Adjusted from ${rawCr} to 1.0`
          : rawCr > 4.0
            ? `Adjusted from ${rawCr} to 4.0`
            : undefined,
    },
    {
      name: 'INR',
      inputValue: rawInr,
      clampedValue: inr,
      unit: NORMAL_RANGES.inr.unit,
      normalRange: NORMAL_RANGES.inr.label,
      status: getInrStatus(rawInr),
      contribution: inrTerm / totalTerms,
      clampNote: rawInr < 1.0 ? `Adjusted from ${rawInr} to 1.0` : undefined,
    },
    {
      name: 'Serum Sodium',
      inputValue: rawSodium,
      clampedValue: sodium,
      unit: NORMAL_RANGES.sodium.unit,
      normalRange: NORMAL_RANGES.sodium.label,
      status: getSodiumStatus(rawSodium),
      contribution: sodiumTerm / totalTerms,
      clampNote:
        rawSodium < 125
          ? `Adjusted from ${rawSodium} to 125`
          : rawSodium > 137
            ? `Adjusted from ${rawSodium} to 137 (no sodium penalty above 137)`
            : undefined,
    },
  ];

  const interpretation = MELD_INTERPRETATIONS.find(
    (i) => score >= i.min && score <= i.max,
  )!;

  const topComponent = [...components].sort((a, b) => b.contribution - a.contribution)[0];
  const transplantNote =
    score >= 35
      ? 'Very high urgency — urgent transplant evaluation required.'
      : score >= 30
        ? 'High urgency — transplant evaluation strongly recommended.'
        : score >= 20
          ? 'Transplant listing consideration recommended.'
          : score >= 15
            ? 'Transplant evaluation typically initiated at this score.'
            : 'Below standard transplant evaluation threshold.';

  return {
    score,
    rawScore,
    components,
    clinicalContext: {
      severityLabel: interpretation.severityLabel,
      severityColor: interpretation.severityColor,
      threeMonthMortality: interpretation.threeMonthMortality,
      transplantImplication: interpretation.transplantImplication,
      clinicalNote:
        `A MELD-Na score of ${score} indicates ${interpretation.severityLabel.toLowerCase()} liver disease ` +
        `with an estimated 3-month mortality of approximately ${interpretation.threeMonthMortality}. ` +
        `${topComponent.name} is the primary contributor to this score. ` +
        transplantNote,
    },
    references: MELD_NA_REFERENCES,
    formula: 'MELD-Na',
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO,
  };
}
