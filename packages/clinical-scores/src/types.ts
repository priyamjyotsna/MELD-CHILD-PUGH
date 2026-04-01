// ---- Input Types ----

export interface MeldInput {
  bilirubin: number;    // mg/dL — clamped to min 1.0 before calculation
  creatinine: number;   // mg/dL — clamped to min 1.0, max 4.0 before calculation
  inr: number;          // — clamped to min 1.0 before calculation
  onDialysis: boolean;  // if true, creatinine is set to 4.0 (MELD) or 3.0 (MELD 3.0)
}

export interface MeldNaInput extends MeldInput {
  sodium: number; // mEq/L — bounded 125–137 before calculation
}

export interface Meld3Input extends MeldNaInput {
  albumin: number;        // g/dL — bounded 1.5–3.5 before calculation
  sex: 'male' | 'female'; // sex assigned at birth
}

export interface ChildPughInput {
  bilirubin: number;                                    // mg/dL
  albumin: number;                                      // g/dL
  inr: number;
  ascites: 'none' | 'mild' | 'moderate_severe';
  encephalopathy: 'none' | 'grade_1_2' | 'grade_3_4';
}

// ---- Output Types ----

export interface ComponentContribution {
  name: string;          // e.g., "Serum Bilirubin"
  inputValue: number;    // raw value entered by user
  clampedValue: number;  // value after clamping (may equal inputValue)
  unit: string;          // e.g., "mg/dL"
  normalRange: string;   // e.g., "0.1–1.2 mg/dL"
  status: 'normal' | 'mildly_elevated' | 'elevated' | 'critical';
  contribution: number;  // relative contribution to total score (0–1)
  points?: number;       // Child-Pugh only: 1, 2, or 3
  clampNote?: string;    // e.g., "Adjusted from 0.8 to 1.0"
}

export interface ClinicalContext {
  severityLabel: string;         // "Minimal", "Moderate", "Severe", "Very Severe"
  severityColor: string;         // hex color for UI rendering
  threeMonthMortality?: string;  // MELD only, e.g., "~6%"
  oneYearSurvival?: string;      // Child-Pugh only
  twoYearSurvival?: string;      // Child-Pugh only
  perioperativeMortality?: string; // Child-Pugh only
  transplantImplication: string; // plain language text
  clinicalNote: string;          // additional context paragraph
}

export interface ScoringReference {
  formulaName: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  pmid?: string;
}

export interface CitationInfo {
  package: string;           // "@livertracker/clinical-scores"
  version: string;
  doi: string;               // Zenodo DOI
  suggestedCitation: string;
}

export interface MeldResult {
  score: number;                  // rounded integer, bounded 6–40
  rawScore: number;               // unrounded calculation result
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  formula: 'MELD' | 'MELD-Na' | 'MELD 3.0';
  calculatedAt: string;           // ISO 8601 timestamp
  citationInfo: CitationInfo;
}

export interface ChildPughResult {
  score: number;                  // 5–15
  classification: 'A' | 'B' | 'C';
  classificationLabel: string;    // "Class A — Compensated"
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}

export interface AllScoresResult {
  meld: MeldResult;
  meldNa: MeldResult | null;
  meld3: MeldResult | null;
  childPugh: ChildPughResult | null;
  liverEnzymes: LiverEnzymeResult | null;
  fibroScan: FibroScanResult | null;
}

// ---- Liver Enzyme Checker ----

export interface LiverEnzymeInput {
  alt?: number;        // U/L
  ast?: number;        // U/L
  ggt?: number;        // U/L
  alp?: number;        // U/L
  bilirubin?: number;  // mg/dL (total bilirubin)
}

export type EnzymeStatus = 'normal' | 'borderline' | 'elevated' | 'significantly_elevated';

export interface EnzymeResult {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: EnzymeStatus;
  statusLabel: string;
  statusColor: string;
  clinicalNote: string;
}

export type InjuryPattern =
  | 'hepatocellular'
  | 'cholestatic'
  | 'mixed'
  | 'normal'
  | 'insufficient_data';

export interface LiverEnzymeResult {
  enzymes: EnzymeResult[];
  overallStatus: EnzymeStatus;
  overallStatusLabel: string;
  overallStatusColor: string;
  injuryPattern: InjuryPattern;
  injuryPatternLabel: string;
  injuryPatternExplanation: string;
  astAltRatio?: number;
  astAltRatioInterpretation?: string;
  rRatio?: number;
  clinicalSummary: string;
  recommendations: string[];
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}

// ---- FibroScan Interpreter ----

export interface FibroScanInput {
  liverStiffness: number;  // kPa (required)
  capScore?: number;       // dB/m (optional)
}

export type FibrosisStage = 'F0' | 'F1' | 'F2' | 'F3' | 'F4';
export type SteatosisGrade = 'S0' | 'S1' | 'S2' | 'S3';

export interface FibrosisStageInfo {
  stage: FibrosisStage;
  label: string;
  cutoff: string;
  isActive: boolean;
}

export interface SteatosisGradeInfo {
  grade: SteatosisGrade;
  label: string;
  cutoff: string;
  isActive: boolean;
}

export interface FibroScanResult {
  fibrosis: {
    stage: FibrosisStage;
    stageLabel: string;
    stageDescription: string;
    stiffnessValue: number;
    stiffnessColor: string;
    rangeForStage: string;
    allStages: FibrosisStageInfo[];
    clinicalImplication: string;
  };
  steatosis?: {
    grade: SteatosisGrade;
    gradeLabel: string;
    gradeDescription: string;
    capValue: number;
    capColor: string;
    rangeForGrade: string;
    allGrades: SteatosisGradeInfo[];
    estimatedFatPercentage: string;
    clinicalImplication: string;
  };
  overallSummary: string;
  recommendations: string[];
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}
