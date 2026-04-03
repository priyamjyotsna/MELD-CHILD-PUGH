import type { ScoringReference, CitationInfo } from './types';

export const PACKAGE_VERSION = '1.0.0';
export const PACKAGE_NAME = '@livertracker/clinical-scores';
export const ZENODO_DOI = '10.5281/zenodo.XXXXXXX';
export const GITHUB_REPOSITORY_URL = 'https://github.com/priyamjyotsna/MELD-CHILD-PUGH';

/** OSF DOIs — one LiverTracker registration per clinical module */
export const OSF_LIVERTRACKER_TOOL_REGISTRATIONS = [
  {
    tool: 'meld' as const,
    title:
      'MELD Score Calculator — LiverTracker Clinical Tool (MELD, MELD-Na, MELD 3.0)',
    doi: '10.17605/OSF.IO/WAM6K',
  },
  {
    tool: 'child_pugh' as const,
    title: 'Child-Pugh Score Calculator — LiverTracker Clinical Tool',
    doi: '10.17605/OSF.IO/XJWA8',
  },
  {
    tool: 'fibroscan' as const,
    title:
      'FibroScan Score Interpreter — LiverTracker Clinical Tool (Liver Stiffness & CAP Score)',
    doi: '10.17605/OSF.IO/CSBWN',
  },
  {
    tool: 'liver_enzymes' as const,
    title:
      'Liver Enzyme Checker — LiverTracker Clinical Tool (ALT, AST, GGT, ALP, Bilirubin)',
    doi: '10.17605/OSF.IO/3XEWC',
  },
] as const;

function citationInfoForOsf(reg: (typeof OSF_LIVERTRACKER_TOOL_REGISTRATIONS)[number]): CitationInfo {
  const doiUrl = `https://doi.org/${reg.doi}`;
  return {
    package: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    doi: ZENODO_DOI,
    osfRegistration: { title: reg.title, doi: reg.doi },
    suggestedCitation: `Priyam J. ${reg.title} (v${PACKAGE_VERSION}). ${doiUrl}. Monorepo: ${GITHUB_REPOSITORY_URL}`,
  };
}

/** MELD, MELD-Na, MELD 3.0 */
export const CITATION_INFO_MELD_FAMILY = citationInfoForOsf(
  OSF_LIVERTRACKER_TOOL_REGISTRATIONS[0],
);
/** Child-Pugh */
export const CITATION_INFO_CHILD_PUGH = citationInfoForOsf(
  OSF_LIVERTRACKER_TOOL_REGISTRATIONS[1],
);
/** FibroScan interpreter */
export const CITATION_INFO_FIBROSCAN = citationInfoForOsf(
  OSF_LIVERTRACKER_TOOL_REGISTRATIONS[2],
);
/** Liver enzyme checker */
export const CITATION_INFO_LIVER_ENZYMES = citationInfoForOsf(
  OSF_LIVERTRACKER_TOOL_REGISTRATIONS[3],
);

/** @deprecated Use module-specific CITATION_INFO_*; kept for imports that expect a generic object */
export const CITATION_INFO: CitationInfo = CITATION_INFO_MELD_FAMILY;

// ---- Severity Colors (from design system) ----
export const COLORS = {
  normal: '#10B981',
  moderate: '#F59E0B',
  severe: '#EF4444',
  critical: '#991B1B',
} as const;

// ---- MELD Score Interpretation ----
export interface MeldInterpretation {
  min: number;
  max: number;
  severityLabel: string;
  severityColor: string;
  threeMonthMortality: string;
  transplantImplication: string;
}

export const MELD_INTERPRETATIONS: MeldInterpretation[] = [
  {
    min: 6,
    max: 9,
    severityLabel: 'Minimal',
    severityColor: COLORS.normal,
    threeMonthMortality: '~1.9%',
    transplantImplication:
      'Score below transplant evaluation threshold (MELD < 15). Routine hepatology follow-up recommended.',
  },
  {
    min: 10,
    max: 19,
    severityLabel: 'Moderate',
    severityColor: COLORS.moderate,
    threeMonthMortality: '~6.0%',
    transplantImplication:
      'Approaching transplant evaluation threshold. MELD ≥ 15 typically triggers evaluation. Close monitoring recommended.',
  },
  {
    min: 20,
    max: 29,
    severityLabel: 'Severe',
    severityColor: COLORS.severe,
    threeMonthMortality: '~19.6%',
    transplantImplication:
      'Transplant evaluation strongly recommended. MELD ≥ 20 generally indicates listing consideration.',
  },
  {
    min: 30,
    max: 40,
    severityLabel: 'Very Severe',
    severityColor: COLORS.critical,
    threeMonthMortality: '~52.6%',
    transplantImplication:
      'High urgency. MELD ≥ 30 indicates significant near-term mortality risk. Urgent transplant evaluation required.',
  },
];

// ---- Child-Pugh Classification ----
export interface ChildPughClassification {
  min: number;
  max: number;
  classification: 'A' | 'B' | 'C';
  classificationLabel: string;
  severityColor: string;
  oneYearSurvival: string;
  twoYearSurvival: string;
  perioperativeMortality: string;
  transplantImplication: string;
}

export const CHILD_PUGH_CLASSIFICATIONS: ChildPughClassification[] = [
  {
    min: 5,
    max: 6,
    classification: 'A',
    classificationLabel: 'Class A — Compensated',
    severityColor: COLORS.normal,
    oneYearSurvival: '~100%',
    twoYearSurvival: '~85%',
    perioperativeMortality: '~10%',
    transplantImplication:
      'Compensated cirrhosis. Surgical risk is relatively low. Routine hepatology follow-up recommended.',
  },
  {
    min: 7,
    max: 9,
    classification: 'B',
    classificationLabel: 'Class B — Significant Hepatic Compromise',
    severityColor: COLORS.moderate,
    oneYearSurvival: '~80%',
    twoYearSurvival: '~60%',
    perioperativeMortality: '~30%',
    transplantImplication:
      'Significant hepatic compromise. Surgical risk is moderately elevated. Transplant evaluation should be considered.',
  },
  {
    min: 10,
    max: 15,
    classification: 'C',
    classificationLabel: 'Class C — Decompensated',
    severityColor: COLORS.severe,
    oneYearSurvival: '~45%',
    twoYearSurvival: '~35%',
    perioperativeMortality: '~70–80%',
    transplantImplication:
      'Decompensated cirrhosis. High surgical risk. Transplant evaluation strongly recommended.',
  },
];

// ---- References ----
export const MELD_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'MELD',
    authors: 'Kamath PS, Wiesner RH, Malinchoc M, et al.',
    journal: 'Hepatology',
    year: 2001,
    doi: '10.1053/jhep.2001.22172',
    pmid: '11172350',
  },
  {
    formulaName: 'MELD',
    authors: 'Kamath PS, Kim WR.',
    journal: 'Hepatology',
    year: 2007,
    doi: '10.1002/hep.21563',
    pmid: '17326206',
  },
];

export const MELD_NA_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'MELD-Na',
    authors: 'Kim WR, Biggins SW, Kremers WK, et al.',
    journal: 'N Engl J Med',
    year: 2008,
    doi: '10.1056/NEJMoa0801209',
    pmid: '18768945',
  },
  {
    formulaName: 'MELD-Na',
    authors: 'Biggins SW, Kim WR, Terrault NA, et al.',
    journal: 'Gastroenterology',
    year: 2006,
    doi: '10.1053/j.gastro.2006.02.010',
    pmid: '16697741',
  },
];

export const MELD3_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'MELD 3.0',
    authors: 'Kim WR, Mannalithara A, Heimbach JK, et al.',
    journal: 'Gastroenterology',
    year: 2021,
    doi: '10.1053/j.gastro.2021.08.050',
    pmid: '34481845',
  },
];

export const CHILD_PUGH_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'Child-Pugh',
    authors: 'Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R.',
    journal: 'Br J Surg',
    year: 1973,
    doi: '10.1002/bjs.1800600817',
    pmid: '4541913',
  },
  {
    formulaName: 'Child-Pugh (original)',
    authors: 'Child CG, Turcotte JG.',
    journal: 'The liver and portal hypertension. Philadelphia: WB Saunders Co',
    year: 1964,
    doi: '',
  },
];

// ---- Normal Ranges (MELD/Child-Pugh) ----
export const NORMAL_RANGES = {
  bilirubin: { low: 0.1, high: 1.2, unit: 'mg/dL', label: '0.1–1.2 mg/dL' },
  creatinine: { low: 0.6, high: 1.2, unit: 'mg/dL', label: '0.6–1.2 mg/dL' },
  inr: { low: 0.8, high: 1.2, unit: '', label: '0.8–1.2' },
  sodium: { low: 135, high: 145, unit: 'mEq/L', label: '135–145 mEq/L' },
  albumin: { low: 3.5, high: 5.0, unit: 'g/dL', label: '3.5–5.0 g/dL' },
} as const;

// ---- Liver Enzyme Thresholds ----

export const ENZYME_COLORS = {
  normal: '#10B981',
  borderline: '#F59E0B',
  elevated: '#F97316',
  significantly_elevated: '#EF4444',
} as const;

export const ENZYME_STATUS_LABELS = {
  normal: 'Normal',
  borderline: 'Borderline',
  elevated: 'Elevated',
  significantly_elevated: 'Significantly Elevated',
} as const;

export interface EnzymeThresholds {
  name: string;
  unit: string;
  normalLow: number;
  normalHigh: number;   // ULN
  normalRange: string;
  clinicalNote: string;
}

export const ENZYME_THRESHOLDS: Record<string, EnzymeThresholds> = {
  alt: {
    name: 'ALT',
    unit: 'U/L',
    normalLow: 7,
    normalHigh: 40,
    normalRange: '7–40 U/L',
    clinicalNote:
      'Most specific marker for liver cell damage. Elevated in hepatitis, fatty liver disease, and drug-induced liver injury.',
  },
  ast: {
    name: 'AST',
    unit: 'U/L',
    normalLow: 8,
    normalHigh: 35,
    normalRange: '8–35 U/L',
    clinicalNote:
      'Found in liver, heart, and muscle tissue. Less specific than ALT but useful in combination. The AST/ALT ratio helps differentiate causes.',
  },
  ggt: {
    name: 'GGT',
    unit: 'U/L',
    normalLow: 9,
    normalHigh: 50,
    normalRange: '9–50 U/L',
    clinicalNote:
      'Sensitive to alcohol use and bile duct problems. Often the first enzyme to rise. Elevated GGT with normal ALP suggests alcohol-related damage.',
  },
  alp: {
    name: 'ALP',
    unit: 'U/L',
    normalLow: 44,
    normalHigh: 120,
    normalRange: '44–120 U/L',
    clinicalNote:
      'Elevated in bile duct obstruction, bone disease, and pregnancy. Must be interpreted in clinical context.',
  },
  bilirubin: {
    name: 'Total Bilirubin',
    unit: 'mg/dL',
    normalLow: 0.1,
    normalHigh: 1.0,
    normalRange: '0.1–1.0 mg/dL',
    clinicalNote:
      'A waste product from red blood cell breakdown. High levels cause jaundice (yellowing of skin/eyes). Elevated bilirubin indicates impaired liver function or bile duct blockage.',
  },
};

export const LIVER_ENZYME_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'Liver Enzyme Checker',
    authors: 'Kwo PY, Cohen SM, Lim JK.',
    journal: 'Am J Gastroenterol',
    year: 2017,
    doi: '10.1038/ajg.2016.517',
    pmid: '27995906',
  },
  {
    formulaName: 'Liver Enzyme Checker',
    authors: 'Giannini EG, Testa R, Savarino V.',
    journal: 'CMAJ',
    year: 2005,
    doi: '10.1503/cmaj.1040752',
    pmid: '15684121',
  },
];

// ---- FibroScan Cutoffs ----

export const FIBROSIS_COLORS = {
  F0: '#10B981',
  F1: '#84CC16',
  F2: '#F59E0B',
  F3: '#F97316',
  F4: '#EF4444',
} as const;

export const STEATOSIS_COLORS = {
  S0: '#10B981',
  S1: '#F59E0B',
  S2: '#F97316',
  S3: '#EF4444',
} as const;

export interface FibrosisCutoff {
  stage: 'F0' | 'F1' | 'F2' | 'F3' | 'F4';
  label: string;
  minKpa: number;
  maxKpa: number;      // Infinity for F4
  cutoffLabel: string;
  description: string;
  implication: string;
}

export const FIBROSIS_CUTOFFS: FibrosisCutoff[] = [
  {
    stage: 'F0',
    label: 'F0 — No Fibrosis',
    minKpa: 0,
    maxKpa: 5.0,
    cutoffLabel: '< 5.0 kPa',
    description: 'No significant fibrosis detected. Liver tissue is normal.',
    implication:
      'Minimal or no fibrosis. Focus on preventing progression through lifestyle modifications — weight management, exercise, limiting alcohol, and managing metabolic risk factors.',
  },
  {
    stage: 'F1',
    label: 'F1 — Mild Fibrosis',
    minKpa: 5.0,
    maxKpa: 7.0,
    cutoffLabel: '5.0–7.0 kPa',
    description: 'Mild fibrosis. Minimal scarring around portal areas.',
    implication:
      'Minimal or no fibrosis. Focus on preventing progression through lifestyle modifications — weight management, exercise, limiting alcohol, and managing metabolic risk factors.',
  },
  {
    stage: 'F2',
    label: 'F2 — Moderate Fibrosis',
    minKpa: 7.0,
    maxKpa: 9.5,
    cutoffLabel: '7.1–9.5 kPa',
    description: 'Moderate (significant) fibrosis. Scarring extends between portal areas.',
    implication:
      'Significant fibrosis detected. Intervention is recommended to prevent further progression. Regular monitoring every 6–12 months. Discuss treatment options with your hepatologist.',
  },
  {
    stage: 'F3',
    label: 'F3 — Advanced Fibrosis',
    minKpa: 9.5,
    maxKpa: 14.0,
    cutoffLabel: '9.6–14.0 kPa',
    description: 'Advanced fibrosis. Bridging fibrosis with architectural distortion.',
    implication:
      'Advanced fibrosis. You are at elevated risk for cirrhosis-related complications. Close monitoring every 3–6 months. Treatment is strongly recommended.',
  },
  {
    stage: 'F4',
    label: 'F4 — Cirrhosis',
    minKpa: 14.0,
    maxKpa: Infinity,
    cutoffLabel: '> 14.0 kPa',
    description: 'Cirrhosis. Extensive scarring with disrupted liver architecture.',
    implication:
      'Cirrhosis. You may need evaluation for liver-related complications including portal hypertension, varices, and hepatocellular carcinoma screening. Referral to a hepatologist/transplant center is recommended.',
  },
];

export interface SteatosisCutoff {
  grade: 'S0' | 'S1' | 'S2' | 'S3';
  label: string;
  minCap: number;
  maxCap: number;
  cutoffLabel: string;
  fatPercentage: string;
  description: string;
  implication: string;
}

export const STEATOSIS_CUTOFFS: SteatosisCutoff[] = [
  {
    grade: 'S0',
    label: 'S0 — No Steatosis',
    minCap: 0,
    maxCap: 238,
    cutoffLabel: '< 238 dB/m',
    fatPercentage: '< 5%',
    description: 'No significant fat accumulation in the liver.',
    implication: 'No significant hepatic steatosis. Continue healthy lifestyle practices.',
  },
  {
    grade: 'S1',
    label: 'S1 — Mild Steatosis',
    minCap: 238,
    maxCap: 260,
    cutoffLabel: '238–260 dB/m',
    fatPercentage: '5–33%',
    description: 'Mild fat accumulation. Early fatty liver.',
    implication:
      'Mild hepatic steatosis. Lifestyle modifications — diet, exercise, weight loss — can reverse this stage.',
  },
  {
    grade: 'S2',
    label: 'S2 — Moderate Steatosis',
    minCap: 260,
    maxCap: 290,
    cutoffLabel: '261–290 dB/m',
    fatPercentage: '34–66%',
    description: 'Moderate fat accumulation. Established fatty liver.',
    implication:
      'Moderate hepatic steatosis. Active management recommended including structured diet and exercise. Monitor metabolic risk factors.',
  },
  {
    grade: 'S3',
    label: 'S3 — Severe Steatosis',
    minCap: 290,
    maxCap: Infinity,
    cutoffLabel: '> 290 dB/m',
    fatPercentage: '> 66%',
    description: 'Severe fat accumulation. Advanced fatty liver.',
    implication:
      'Severe hepatic steatosis. Aggressive lifestyle intervention and medical management strongly recommended. Discuss with your hepatologist.',
  },
];

export const FIBROSCAN_REFERENCES: ScoringReference[] = [
  {
    formulaName: 'FibroScan',
    authors: 'Castera L, Forns X, Alberti A.',
    journal: 'J Hepatol',
    year: 2008,
    doi: '10.1016/j.jhep.2008.02.008',
    pmid: '18334275',
  },
  {
    formulaName: 'FibroScan (CAP)',
    authors: 'Sasso M, Beaugrand M, de Ledinghen V, et al.',
    journal: 'Ultrasound Med Biol',
    year: 2010,
    doi: '10.1016/j.ultrasmedbio.2010.07.005',
    pmid: '20870345',
  },
  {
    formulaName: 'EASL Guidelines',
    authors: 'EASL-ALEH Clinical Practice Guidelines.',
    journal: 'J Hepatol',
    year: 2015,
    doi: '10.1016/j.jhep.2015.04.006',
    pmid: '25911335',
  },
];
