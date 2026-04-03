import type {
  LiverEnzymeInput,
  LiverEnzymeResult,
  EnzymeResult,
  EnzymeStatus,
  InjuryPattern,
} from './types';
import {
  ENZYME_THRESHOLDS,
  ENZYME_COLORS,
  ENZYME_STATUS_LABELS,
  LIVER_ENZYME_REFERENCES,
  CITATION_INFO_LIVER_ENZYMES,
} from './constants';

function getEnzymeStatus(value: number, uln: number, isBilirubin: boolean): EnzymeStatus {
  if (isBilirubin) {
    if (value <= 1.0) return 'normal';
    if (value <= 2.0) return 'borderline';
    if (value <= 5.0) return 'elevated';
    return 'significantly_elevated';
  }
  if (value <= uln) return 'normal';
  if (value <= uln * 2) return 'borderline';
  if (value <= uln * 5) return 'elevated';
  return 'significantly_elevated';
}

const STATUS_SEVERITY: Record<EnzymeStatus, number> = {
  normal: 0,
  borderline: 1,
  elevated: 2,
  significantly_elevated: 3,
};

function evaluateEnzyme(key: string, value: number): EnzymeResult {
  const thresh = ENZYME_THRESHOLDS[key];
  const isBilirubin = key === 'bilirubin';
  const status = getEnzymeStatus(value, thresh.normalHigh, isBilirubin);

  return {
    name: thresh.name,
    value,
    unit: thresh.unit,
    normalRange: thresh.normalRange,
    status,
    statusLabel: ENZYME_STATUS_LABELS[status],
    statusColor: ENZYME_COLORS[status],
    clinicalNote: thresh.clinicalNote,
  };
}

function determineInjuryPattern(input: LiverEnzymeInput): {
  pattern: InjuryPattern;
  label: string;
  explanation: string;
  rRatio?: number;
} {
  const { alt, ast, alp, ggt } = input;

  const hasAminotransferase = alt !== undefined || ast !== undefined;
  const hasCholestatic = alp !== undefined || ggt !== undefined;

  if (!hasAminotransferase || !hasCholestatic) {
    return {
      pattern: 'insufficient_data',
      label: 'Insufficient Data',
      explanation:
        'Both aminotransferases (ALT/AST) and cholestatic markers (ALP/GGT) are needed to determine the injury pattern.',
    };
  }

  const altUln = ENZYME_THRESHOLDS.alt.normalHigh;
  const astUln = ENZYME_THRESHOLDS.ast.normalHigh;
  const alpUln = ENZYME_THRESHOLDS.alp.normalHigh;
  const ggtUln = ENZYME_THRESHOLDS.ggt.normalHigh;

  // Check if any enzymes are actually above normal first
  const altAboveNormal = alt !== undefined && alt > altUln;
  const astAboveNormal = ast !== undefined && ast > astUln;
  const alpAboveNormal = alp !== undefined && alp > alpUln;
  const ggtAboveNormal = ggt !== undefined && ggt > ggtUln;

  const anyAminoAboveNormal = altAboveNormal || astAboveNormal;
  const anyCholeAboveNormal = alpAboveNormal || ggtAboveNormal;

  // If nothing is elevated, pattern is normal
  if (!anyAminoAboveNormal && !anyCholeAboveNormal) {
    return {
      pattern: 'normal',
      label: 'Normal',
      explanation: 'All provided enzymes are within or near normal ranges. No significant injury pattern detected.',
    };
  }

  // R ratio (when both ALT and ALP available AND at least one is elevated)
  let rRatio: number | undefined;
  if (alt !== undefined && alp !== undefined && (altAboveNormal || alpAboveNormal)) {
    rRatio = (alt / altUln) / (alp / alpUln);

    if (rRatio > 5) {
      return {
        pattern: 'hepatocellular',
        label: 'Hepatocellular',
        explanation:
          'Your ALT/AST are significantly elevated relative to ALP, suggesting liver cell damage (hepatocellular pattern). Common causes include hepatitis, fatty liver disease, or medication effects.',
        rRatio,
      };
    }
    if (rRatio < 2) {
      return {
        pattern: 'cholestatic',
        label: 'Cholestatic',
        explanation:
          'Your ALP/GGT are elevated relative to ALT/AST, suggesting bile duct obstruction or disease (cholestatic pattern). Causes include gallstones, primary biliary cholangitis, or drug reactions.',
        rRatio,
      };
    }
    return {
      pattern: 'mixed',
      label: 'Mixed',
      explanation:
        'Both aminotransferases and cholestatic markers are elevated, suggesting a mixed pattern of liver injury. This can occur in drug-induced liver injury, infiltrative diseases, or overlapping conditions.',
      rRatio,
    };
  }

  // Threshold-based classification (when R ratio not available)
  if (anyAminoAboveNormal && anyCholeAboveNormal) {
    return {
      pattern: 'mixed',
      label: 'Mixed',
      explanation:
        'Both aminotransferases and cholestatic markers are elevated, suggesting a mixed pattern of liver injury.',
    };
  }
  if (anyAminoAboveNormal) {
    return {
      pattern: 'hepatocellular',
      label: 'Hepatocellular',
      explanation:
        'Your ALT/AST are elevated, suggesting liver cell damage (hepatocellular pattern). Common causes include hepatitis, fatty liver disease, or medication effects.',
    };
  }

  return {
    pattern: 'cholestatic',
    label: 'Cholestatic',
    explanation:
      'Your ALP/GGT are elevated, suggesting bile duct obstruction or disease (cholestatic pattern).',
  };
}

function getRecommendations(
  overallStatus: EnzymeStatus,
  pattern: InjuryPattern,
  enzymes: EnzymeResult[],
): string[] {
  const recs: string[] = [];

  if (overallStatus === 'normal') {
    recs.push('Your liver enzymes appear normal. Continue routine health monitoring.');
    return recs;
  }

  if (overallStatus === 'significantly_elevated') {
    recs.push('Seek prompt medical evaluation — some values are significantly above normal.');
  }

  if (overallStatus === 'elevated' || overallStatus === 'significantly_elevated') {
    recs.push('Consider follow-up liver panel in 2–4 weeks to confirm these results.');
    recs.push('Discuss these results with your primary care physician or hepatologist.');
  } else if (overallStatus === 'borderline') {
    recs.push('Consider follow-up liver panel in 4–6 weeks.');
  }

  if (pattern === 'hepatocellular') {
    recs.push('Consider evaluation for hepatitis, fatty liver disease, and drug-related causes.');
  } else if (pattern === 'cholestatic') {
    recs.push('Consider imaging (ultrasound) to evaluate bile ducts and gallbladder.');
  }

  const hasElevatedGgt = enzymes.some(
    (e) => e.name === 'GGT' && (e.status === 'elevated' || e.status === 'significantly_elevated'),
  );
  if (hasElevatedGgt) {
    recs.push('Avoid alcohol and hepatotoxic medications.');
  }

  return recs;
}

export function checkLiverEnzymes(input: LiverEnzymeInput): LiverEnzymeResult {
  const enzymeKeys = ['alt', 'ast', 'ggt', 'alp', 'bilirubin'] as const;
  const enzymes: EnzymeResult[] = [];

  for (const key of enzymeKeys) {
    const value = input[key];
    if (value !== undefined && value !== null) {
      enzymes.push(evaluateEnzyme(key, value));
    }
  }

  if (enzymes.length === 0) {
    throw new Error('At least one enzyme value must be provided.');
  }

  // Overall status = worst across all
  const overallStatus = enzymes.reduce<EnzymeStatus>((worst, e) => {
    return STATUS_SEVERITY[e.status] > STATUS_SEVERITY[worst] ? e.status : worst;
  }, 'normal');

  // AST/ALT ratio
  let astAltRatio: number | undefined;
  let astAltRatioInterpretation: string | undefined;
  if (input.ast !== undefined && input.alt !== undefined && input.alt > 0) {
    astAltRatio = Math.round((input.ast / input.alt) * 100) / 100;
    if (astAltRatio > 2) {
      astAltRatioInterpretation =
        'A ratio above 2.0 strongly suggests alcoholic hepatitis or advanced liver disease.';
    } else if (astAltRatio > 1) {
      astAltRatioInterpretation =
        'A ratio above 1.0 may suggest alcoholic liver disease or advanced fibrosis.';
    } else {
      astAltRatioInterpretation =
        'A ratio below 1.0 is commonly seen in non-alcoholic fatty liver disease or viral hepatitis.';
    }
  }

  // Injury pattern
  const patternResult = determineInjuryPattern(input);

  // Recommendations
  const recommendations = getRecommendations(overallStatus, patternResult.pattern, enzymes);

  // Summary
  const elevatedNames = enzymes
    .filter((e) => e.status !== 'normal')
    .map((e) => e.name);

  let clinicalSummary: string;
  if (overallStatus === 'normal') {
    clinicalSummary = 'All provided liver enzyme values are within normal ranges.';
  } else {
    clinicalSummary =
      `${elevatedNames.join(', ')} ${elevatedNames.length === 1 ? 'is' : 'are'} outside the normal range. ` +
      patternResult.explanation;
  }

  return {
    enzymes,
    overallStatus,
    overallStatusLabel: ENZYME_STATUS_LABELS[overallStatus],
    overallStatusColor: ENZYME_COLORS[overallStatus],
    injuryPattern: patternResult.pattern,
    injuryPatternLabel: patternResult.label,
    injuryPatternExplanation: patternResult.explanation,
    astAltRatio,
    astAltRatioInterpretation,
    rRatio: patternResult.rRatio,
    clinicalSummary,
    recommendations,
    references: LIVER_ENZYME_REFERENCES,
    calculatedAt: new Date().toISOString(),
    citationInfo: CITATION_INFO_LIVER_ENZYMES,
  };
}
