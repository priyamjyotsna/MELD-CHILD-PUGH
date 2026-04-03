import type { Meld3Input, MeldResult, ComponentContribution } from './types';
import {
  MELD_INTERPRETATIONS,
  MELD3_REFERENCES,
  CITATION_INFO_MELD_FAMILY,
  NORMAL_RANGES,
} from './constants';
import { getBilirubinStatus, getCreatinineStatus, getInrStatus } from './meld';

function getSodiumStatus(v: number): ComponentContribution['status'] {
  if (v >= 135 && v <= 145) return 'normal';
  if (v >= 130) return 'mildly_elevated';
  if (v >= 125) return 'elevated';
  return 'critical';
}

function getAlbuminStatus(v: number): ComponentContribution['status'] {
  if (v >= 3.5) return 'normal';
  if (v >= 2.8) return 'mildly_elevated';
  if (v >= 2.0) return 'elevated';
  return 'critical';
}

export function calculateMeld3(input: Meld3Input): MeldResult {
  const {
    bilirubin: rawBili,
    creatinine: rawCr,
    inr: rawInr,
    onDialysis,
    sodium: rawSodium,
    albumin: rawAlbumin,
    sex,
  } = input;

  // MELD 3.0 clamping rules (creatinine cap is 3.0, not 4.0)
  const bilirubin = Math.max(rawBili, 1.0);
  let creatinine = Math.max(rawCr, 1.0);
  creatinine = Math.min(creatinine, 3.0);
  if (onDialysis) creatinine = 3.0;
  const inr = Math.max(rawInr, 1.0);
  const sodium = Math.min(137, Math.max(125, rawSodium));
  const albumin = Math.min(3.5, Math.max(1.5, rawAlbumin));

  const femaleSexPoints = sex === 'female' ? 1.33 : 0;

  // MELD 3.0 formula (Kim et al., Gastroenterology 2021):
  // round(1.33*(Female) + 4.56*ln(Bili) + 0.82*(137-Na) - 0.24*(137-Na)*ln(Bili)
  //       + 9.09*ln(INR) + 11.14*ln(Cr) + 1.85*(3.5-Alb) - 1.83*(3.5-Alb)*ln(Cr) + 6)
  const sodiumDiff = 137 - sodium;
  const albuminDiff = 3.5 - albumin;

  const rawScore =
    femaleSexPoints +
    4.56 * Math.log(bilirubin) +
    0.82 * sodiumDiff -
    0.24 * sodiumDiff * Math.log(bilirubin) +
    9.09 * Math.log(inr) +
    11.14 * Math.log(creatinine) +
    1.85 * albuminDiff -
    1.83 * albuminDiff * Math.log(creatinine) +
    6;

  const score = Math.min(40, Math.max(6, Math.round(rawScore)));

  // Contribution terms (absolute values of each component's contribution)
  const biliTerm = Math.abs(4.56 * Math.log(bilirubin) - 0.24 * sodiumDiff * Math.log(bilirubin));
  const crTerm = Math.abs(11.14 * Math.log(creatinine) - 1.83 * albuminDiff * Math.log(creatinine));
  const inrTerm = Math.abs(9.09 * Math.log(inr));
  const sodiumTerm = Math.abs(0.82 * sodiumDiff);
  const albuminTerm = Math.abs(1.85 * albuminDiff);
  const sexTerm = Math.abs(femaleSexPoints);
  const totalTerms = biliTerm + crTerm + inrTerm + sodiumTerm + albuminTerm + sexTerm || 1;

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
        ? 'Set to 3.0 (dialysis)'
        : rawCr < 1.0
          ? `Adjusted from ${rawCr} to 1.0`
          : rawCr > 3.0
            ? `Adjusted from ${rawCr} to 3.0`
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
            ? `Adjusted from ${rawSodium} to 137`
            : undefined,
    },
    {
      name: 'Serum Albumin',
      inputValue: rawAlbumin,
      clampedValue: albumin,
      unit: NORMAL_RANGES.albumin.unit,
      normalRange: NORMAL_RANGES.albumin.label,
      status: getAlbuminStatus(rawAlbumin),
      contribution: albuminTerm / totalTerms,
      clampNote:
        rawAlbumin < 1.5
          ? `Adjusted from ${rawAlbumin} to 1.5`
          : rawAlbumin > 3.5
            ? `Adjusted from ${rawAlbumin} to 3.5`
            : undefined,
    },
  ];

  if (sex === 'female') {
    components.push({
      name: 'Sex (Female)',
      inputValue: 1,
      clampedValue: 1,
      unit: '',
      normalRange: '',
      status: 'normal',
      contribution: sexTerm / totalTerms,
    });
  }

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
        `A MELD 3.0 score of ${score} indicates ${interpretation.severityLabel.toLowerCase()} liver disease ` +
        `with an estimated 3-month mortality of approximately ${interpretation.threeMonthMortality}. ` +
        `${topComponent.name} is the primary contributor to this score. ` +
        (sex === 'female'
          ? 'The 1.33-point sex adjustment addresses the documented disparity in transplant access for female patients. '
          : '') +
        transplantNote,
    },
    references: MELD3_REFERENCES,
    formula: 'MELD 3.0',
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO_MELD_FAMILY,
  };
}
