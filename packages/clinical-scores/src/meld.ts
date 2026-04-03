import type { MeldInput, MeldResult, ComponentContribution } from './types';
import {
  MELD_INTERPRETATIONS,
  MELD_REFERENCES,
  CITATION_INFO_MELD_FAMILY,
  NORMAL_RANGES,
} from './constants';

function getComponentStatus(
  value: number,
  low: number,
  high: number,
): ComponentContribution['status'] {
  if (value <= high * 1.0) {
    if (value >= low && value <= high) return 'normal';
    if (value < low * 0.5 || value > high * 2) return 'critical';
    return 'mildly_elevated';
  }
  if (value > high * 3) return 'critical';
  if (value > high * 2) return 'elevated';
  return 'mildly_elevated';
}

function getBilirubinStatus(v: number): ComponentContribution['status'] {
  if (v <= 1.2) return 'normal';
  if (v <= 3.0) return 'mildly_elevated';
  if (v <= 10.0) return 'elevated';
  return 'critical';
}

function getCreatinineStatus(v: number): ComponentContribution['status'] {
  if (v <= 1.2) return 'normal';
  if (v <= 2.0) return 'mildly_elevated';
  if (v <= 4.0) return 'elevated';
  return 'critical';
}

function getInrStatus(v: number): ComponentContribution['status'] {
  if (v <= 1.2) return 'normal';
  if (v <= 1.7) return 'mildly_elevated';
  if (v <= 2.3) return 'elevated';
  return 'critical';
}

export function calculateMeld(input: MeldInput): MeldResult {
  const { bilirubin: rawBili, creatinine: rawCr, inr: rawInr, onDialysis } = input;

  // Apply clamping rules
  const bilirubin = Math.max(rawBili, 1.0);
  let creatinine = Math.max(rawCr, 1.0);
  creatinine = Math.min(creatinine, 4.0);
  if (onDialysis) creatinine = 4.0;
  const inr = Math.max(rawInr, 1.0);

  // MELD formula: 10 × (0.957×ln(Cr) + 0.378×ln(Bili) + 1.120×ln(INR) + 0.643)
  const rawScore =
    10 *
    (0.957 * Math.log(creatinine) +
      0.378 * Math.log(bilirubin) +
      1.12 * Math.log(inr) +
      0.643);

  const score = Math.min(40, Math.max(6, Math.round(rawScore)));

  // Determine relative contributions (absolute log-weighted terms)
  const crTerm = Math.abs(0.957 * Math.log(creatinine));
  const biliTerm = Math.abs(0.378 * Math.log(bilirubin));
  const inrTerm = Math.abs(1.12 * Math.log(inr));
  const totalTerms = crTerm + biliTerm + inrTerm || 1;

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
  ];

  const interpretation = MELD_INTERPRETATIONS.find(
    (i) => score >= i.min && score <= i.max,
  )!;

  return {
    score,
    rawScore,
    components,
    clinicalContext: {
      severityLabel: interpretation.severityLabel,
      severityColor: interpretation.severityColor,
      threeMonthMortality: interpretation.threeMonthMortality,
      transplantImplication: interpretation.transplantImplication,
      clinicalNote: buildMeldClinicalNote(score, components, 'MELD', interpretation),
    },
    references: MELD_REFERENCES,
    formula: 'MELD',
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO_MELD_FAMILY,
  };
}

function buildMeldClinicalNote(
  score: number,
  components: ComponentContribution[],
  formula: string,
  interpretation: (typeof MELD_INTERPRETATIONS)[number],
): string {
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

  return (
    `A ${formula} score of ${score} indicates ${interpretation.severityLabel.toLowerCase()} liver disease ` +
    `with an estimated 3-month mortality of approximately ${interpretation.threeMonthMortality}. ` +
    `${topComponent.name} is the primary contributor to this score. ` +
    transplantNote
  );
}

// Export status helpers for reuse
export { getBilirubinStatus, getCreatinineStatus, getInrStatus, getComponentStatus };
