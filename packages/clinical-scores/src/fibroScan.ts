import type {
  FibroScanInput,
  FibroScanResult,
  FibrosisStage,
  SteatosisGrade,
  FibrosisStageInfo,
  SteatosisGradeInfo,
} from './types';
import {
  FIBROSIS_CUTOFFS,
  FIBROSIS_COLORS,
  STEATOSIS_CUTOFFS,
  STEATOSIS_COLORS,
  FIBROSCAN_REFERENCES,
  CITATION_INFO_FIBROSCAN,
} from './constants';

function getFibrosisStage(kpa: number) {
  const stage = FIBROSIS_CUTOFFS.find(
    (c) => kpa < c.maxKpa && kpa >= c.minKpa,
  );
  // Handle exact boundary: kpa === 0 should still be F0
  return stage ?? FIBROSIS_CUTOFFS[FIBROSIS_CUTOFFS.length - 1];
}

function getSteatosisGrade(cap: number) {
  const grade = STEATOSIS_CUTOFFS.find(
    (c) => cap < c.maxCap && cap >= c.minCap,
  );
  return grade ?? STEATOSIS_CUTOFFS[STEATOSIS_CUTOFFS.length - 1];
}

export function interpretFibroScan(input: FibroScanInput): FibroScanResult {
  const { liverStiffness, capScore } = input;

  // Fibrosis assessment
  const fibrosisMatch = getFibrosisStage(liverStiffness);
  const allStages: FibrosisStageInfo[] = FIBROSIS_CUTOFFS.map((c) => ({
    stage: c.stage as FibrosisStage,
    label: c.label,
    cutoff: c.cutoffLabel,
    isActive: c.stage === fibrosisMatch.stage,
  }));

  const fibrosis = {
    stage: fibrosisMatch.stage as FibrosisStage,
    stageLabel: fibrosisMatch.label,
    stageDescription: fibrosisMatch.description,
    stiffnessValue: liverStiffness,
    stiffnessColor: FIBROSIS_COLORS[fibrosisMatch.stage as FibrosisStage],
    rangeForStage: fibrosisMatch.cutoffLabel,
    allStages,
    clinicalImplication: fibrosisMatch.implication,
  };

  // Steatosis assessment (optional)
  let steatosis: FibroScanResult['steatosis'];
  if (capScore !== undefined) {
    const steatosisMatch = getSteatosisGrade(capScore);
    const allGrades: SteatosisGradeInfo[] = STEATOSIS_CUTOFFS.map((c) => ({
      grade: c.grade as SteatosisGrade,
      label: c.label,
      cutoff: c.cutoffLabel,
      isActive: c.grade === steatosisMatch.grade,
    }));

    steatosis = {
      grade: steatosisMatch.grade as SteatosisGrade,
      gradeLabel: steatosisMatch.label,
      gradeDescription: steatosisMatch.description,
      capValue: capScore,
      capColor: STEATOSIS_COLORS[steatosisMatch.grade as SteatosisGrade],
      rangeForGrade: steatosisMatch.cutoffLabel,
      allGrades,
      estimatedFatPercentage: steatosisMatch.fatPercentage,
      clinicalImplication: steatosisMatch.implication,
    };
  }

  // Summary
  let overallSummary = `Your liver stiffness of ${liverStiffness} kPa indicates ${fibrosisMatch.label.toLowerCase()}.`;
  if (steatosis) {
    overallSummary += ` Your CAP score of ${capScore} dB/m indicates ${steatosis.gradeLabel.toLowerCase()} (estimated liver fat: ${steatosis.estimatedFatPercentage}).`;
  }

  // Recommendations
  const recommendations: string[] = [];
  const stage = fibrosisMatch.stage;

  if (stage === 'F0' || stage === 'F1') {
    recommendations.push('Maintain healthy lifestyle — balanced diet, regular exercise, limited alcohol.');
    if (steatosis && (steatosis.grade === 'S2' || steatosis.grade === 'S3')) {
      recommendations.push('Consider dietary intervention to reduce liver fat.');
    }
    recommendations.push('Follow up with your doctor at your next routine appointment.');
  } else if (stage === 'F2') {
    recommendations.push('Schedule follow-up FibroScan in 6–12 months to monitor progression.');
    recommendations.push('Discuss treatment options with your hepatologist.');
    recommendations.push('Focus on weight management and metabolic risk factors.');
  } else if (stage === 'F3') {
    recommendations.push('Close monitoring every 3–6 months is recommended.');
    recommendations.push('Treatment is strongly recommended — discuss options with your hepatologist.');
    recommendations.push('Ensure hepatocellular carcinoma screening is initiated if not already done.');
  } else {
    recommendations.push('Referral to a hepatologist/transplant center is recommended.');
    recommendations.push('Screen for portal hypertension, varices, and hepatocellular carcinoma.');
    recommendations.push('MELD score assessment may be appropriate — use the MELD calculator in this app.');
  }

  recommendations.push(
    'Note: Cutoff values may vary based on your underlying liver condition. Always discuss FibroScan results with your hepatologist.',
  );

  return {
    fibrosis,
    steatosis,
    overallSummary,
    recommendations,
    references: FIBROSCAN_REFERENCES,
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO_FIBROSCAN,
  };
}
