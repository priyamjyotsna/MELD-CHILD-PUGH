import type { ChildPughInput, ChildPughResult, ComponentContribution } from './types';
import {
  CHILD_PUGH_CLASSIFICATIONS,
  CHILD_PUGH_REFERENCES,
  CITATION_INFO,
  NORMAL_RANGES,
} from './constants';

function getBilirubinPoints(v: number): number {
  if (v < 2) return 1;
  if (v <= 3) return 2;
  return 3;
}

function getAlbuminPoints(v: number): number {
  if (v > 3.5) return 1;
  if (v >= 2.8) return 2;
  return 3;
}

function getInrPoints(v: number): number {
  if (v < 1.7) return 1;
  if (v <= 2.3) return 2;
  return 3;
}

function getAscitesPoints(v: ChildPughInput['ascites']): number {
  if (v === 'none') return 1;
  if (v === 'mild') return 2;
  return 3;
}

function getEncephalopathyPoints(v: ChildPughInput['encephalopathy']): number {
  if (v === 'none') return 1;
  if (v === 'grade_1_2') return 2;
  return 3;
}

function pointsToStatus(points: number): ComponentContribution['status'] {
  if (points === 1) return 'normal';
  if (points === 2) return 'mildly_elevated';
  return 'critical';
}

export function calculateChildPugh(input: ChildPughInput): ChildPughResult {
  const { bilirubin, albumin, inr, ascites, encephalopathy } = input;

  const biliPoints = getBilirubinPoints(bilirubin);
  const albPoints = getAlbuminPoints(albumin);
  const inrPoints = getInrPoints(inr);
  const ascitesPoints = getAscitesPoints(ascites);
  const encephPoints = getEncephalopathyPoints(encephalopathy);

  const score = biliPoints + albPoints + inrPoints + ascitesPoints + encephPoints;

  const components: ComponentContribution[] = [
    {
      name: 'Serum Bilirubin',
      inputValue: bilirubin,
      clampedValue: bilirubin,
      unit: NORMAL_RANGES.bilirubin.unit,
      normalRange: NORMAL_RANGES.bilirubin.label,
      status: pointsToStatus(biliPoints),
      contribution: biliPoints / score,
      points: biliPoints,
    },
    {
      name: 'Serum Albumin',
      inputValue: albumin,
      clampedValue: albumin,
      unit: NORMAL_RANGES.albumin.unit,
      normalRange: NORMAL_RANGES.albumin.label,
      status: pointsToStatus(albPoints),
      contribution: albPoints / score,
      points: albPoints,
    },
    {
      name: 'INR',
      inputValue: inr,
      clampedValue: inr,
      unit: NORMAL_RANGES.inr.unit,
      normalRange: NORMAL_RANGES.inr.label,
      status: pointsToStatus(inrPoints),
      contribution: inrPoints / score,
      points: inrPoints,
    },
    {
      name: 'Ascites',
      inputValue: ascitesPoints,
      clampedValue: ascitesPoints,
      unit: '',
      normalRange: 'None = 1pt · Mild = 2pts · Moderate–Severe = 3pts',
      status: pointsToStatus(ascitesPoints),
      contribution: ascitesPoints / score,
      points: ascitesPoints,
    },
    {
      name: 'Hepatic Encephalopathy',
      inputValue: encephPoints,
      clampedValue: encephPoints,
      unit: '',
      normalRange: 'None = 1pt · Grade 1–2 = 2pts · Grade 3–4 = 3pts',
      status: pointsToStatus(encephPoints),
      contribution: encephPoints / score,
      points: encephPoints,
    },
  ];

  const classification = CHILD_PUGH_CLASSIFICATIONS.find(
    (c) => score >= c.min && score <= c.max,
  )!;

  const topComponent = [...components].sort((a, b) => b.contribution - a.contribution)[0];

  return {
    score,
    classification: classification.classification,
    classificationLabel: classification.classificationLabel,
    components,
    clinicalContext: {
      severityLabel: classification.classificationLabel,
      severityColor: classification.severityColor,
      oneYearSurvival: classification.oneYearSurvival,
      twoYearSurvival: classification.twoYearSurvival,
      perioperativeMortality: classification.perioperativeMortality,
      transplantImplication: classification.transplantImplication,
      clinicalNote:
        `A Child-Pugh ${classification.classificationLabel} (score ${score}) indicates ` +
        `an estimated 1-year survival of ${classification.oneYearSurvival} and ` +
        `2-year survival of ${classification.twoYearSurvival}. ` +
        `Perioperative mortality risk is approximately ${classification.perioperativeMortality}. ` +
        `${topComponent.name} is the primary contributor to this score. ` +
        classification.transplantImplication,
    },
    references: CHILD_PUGH_REFERENCES,
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO,
  };
}
