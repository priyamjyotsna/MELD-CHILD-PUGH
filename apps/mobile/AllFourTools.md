# LiverTracker Clinical Tools — Complete Project Context (v2.0)

> **Purpose of this document**: This is the master context file for building the LiverTracker clinical tools application. Feed this entire document into Cursor as project context. All code generation, architecture decisions, and implementation details should follow this specification.

> **v2.0 Changes**: Added Liver Enzyme Checker and FibroScan Score Interpreter tools. The app now contains four tool categories (six scoring/interpretation systems total). All sections updated accordingly.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Brand Identity & Design System](#2-brand-identity--design-system)
3. [Tech Stack](#3-tech-stack)
4. [Phase 1 — iOS App & npm Package](#4-phase-1--ios-app--npm-package)
5. [Phase 2 — REST API](#5-phase-2--rest-api)
6. [Phase 3 — Python Package (PyPI)](#6-phase-3--python-package-pypi)
7. [Phase 4 — MCP Server](#7-phase-4--mcp-server)
8. [Phase 5 — R Package (CRAN)](#8-phase-5--r-package-cran)
9. [Scoring System Formulas & Clinical Logic](#9-scoring-system-formulas--clinical-logic)
10. [Validation Dataset Specification](#10-validation-dataset-specification)
11. [Apple App Store Compliance](#11-apple-app-store-compliance)
12. [Citation & Academic Infrastructure](#12-citation--academic-infrastructure)
13. [GitHub Repository Structure](#13-github-repository-structure)
14. [UI/UX Specification — Forms](#14-uiux-specification--forms)
15. [UI/UX Specification — Results Page](#15-uiux-specification--results-page)
16. [Screens & Navigation](#16-screens--navigation)
17. [Accessibility & Edge Cases](#17-accessibility--edge-cases)
18. [Deployment & Infrastructure](#18-deployment--infrastructure)

---

## 1. Project Overview

### What We Are Building

A medical-grade iOS application for liver health assessment and clinical scoring, branded under **LiverTracker** (https://livertracker.com). The app contains four tool categories covering the full spectrum of liver evaluation — from basic enzyme screening through fibrosis staging to end-stage severity scoring. The app is part of a broader ecosystem that includes:

- A native iOS app (Phase 1)
- A standalone npm package for JavaScript/TypeScript developers (Phase 1)
- A hosted REST API on a subdomain of livertracker.com (Phase 2)
- A Python package on PyPI (Phase 3)
- An MCP (Model Context Protocol) server for AI-native workflows (Phase 4)
- An R package on CRAN (Phase 5)

### Tools Implemented (6 systems across 4 categories)

**Category 1 — Liver Enzyme Checker** (screening-level tool)
1. **Liver Enzyme Checker** — Traffic-light interpretation of ALT, AST, GGT, ALP, and bilirubin. All fields optional. Provides per-enzyme status (Normal / Borderline / Elevated / Significantly Elevated) plus pattern recognition (hepatocellular vs cholestatic vs mixed).

**Category 2 — FibroScan Score Interpreter** (fibrosis staging tool)
2. **FibroScan Interpreter** — Interprets liver stiffness (kPa) into fibrosis stages (F0–F4) and CAP score (dB/m) into steatosis grades (S0–S3). Liver stiffness required, CAP optional.

**Category 3 — MELD Score Calculators** (end-stage severity scoring)
3. **MELD** (Model for End-Stage Liver Disease) — original formula
4. **MELD-Na** — incorporates serum sodium
5. **MELD 3.0** — 2022 update with albumin, sex, and interaction terms (adopted by OPTN in 2023)

**Category 4 — Child-Pugh Score** (cirrhosis classification)
6. **Child-Pugh Score** — point-based classification (Class A/B/C)

### Clinical Narrative (Disease Progression Flow)

The four tool categories map to the liver disease journey:
```
Screening → Staging → Severity → Classification
Enzyme Checker → FibroScan → MELD → Child-Pugh
"Are my enzymes OK?" → "How scarred is my liver?" → "How sick am I?" → "What class am I?"
```
This progression should be reflected in the Home screen ordering and the About section educational content.

### Key Stakeholders

- **Dr. Jyotsna Priyam** — Clinical lead, hepatologist, creator of the tool. Must be credited in-app, in the API responses, in package metadata, and in all academic outputs.
- **LiverTracker** (livertracker.com) — Parent brand. The app is a standalone tool within the LiverTracker ecosystem.

### Core Principles

- All calculations and interpretations happen **on-device** (no network calls)
- **No user data is collected, stored, or transmitted**
- The app must feel **medically authoritative**, not like a typical AI-generated app
- Open-source (MIT license) to maximize adoption and citations
- Every output (app, API, packages) must include **citation information** and **references to original publications**

---

## 2. Brand Identity & Design System

### Source of Truth

The LiverTracker website (https://livertracker.com) defines the brand. The app must feel like a natural extension of the web platform.

### Color Palette

```
Primary Background:       #F8F9FA (light grey, page background)
Card/Surface Background:  #FFFFFF (white, for form cards and result cards)
Primary Text:             #111827 (deep charcoal/navy — NOT pure black)
Secondary Text:           #6B7280 (muted grey, for helper text, normal ranges)
Disabled/Placeholder:     #9CA3AF (lighter grey)

Brand Gradient (CTAs only):
  Start:                  #4F46E5 (indigo blue)
  End:                    #7C3AED (purple)
  Usage:                  Primary action buttons ONLY ("Calculate MELD", "Check Enzymes", etc.)
                          Also used on active segment of tab controls
                          NEVER as a background fill on cards or screens

Semantic Result Colors (used across ALL tools):
  Normal/Low Risk:        #10B981 (green)
  Borderline/Mild:        #F59E0B (amber)
  Elevated/Moderate:      #EF4444 (red)
  Critical/Severe:        #991B1B (deep red)

Traffic Light System (Enzyme Checker specific):
  Normal:                 #10B981 (green)
  Borderline:             #F59E0B (amber)
  Elevated:               #F97316 (orange)
  Significantly Elevated: #EF4444 (red)

Fibrosis Stage Colors (FibroScan specific):
  F0 (No fibrosis):      #10B981 (green)
  F1 (Mild):             #84CC16 (lime green)
  F2 (Moderate):         #F59E0B (amber)
  F3 (Advanced):         #F97316 (orange)
  F4 (Cirrhosis):        #EF4444 (red)

Steatosis Grade Colors (FibroScan CAP specific):
  S0 (No steatosis):     #10B981 (green)
  S1 (Mild):             #F59E0B (amber)
  S2 (Moderate):         #F97316 (orange)
  S3 (Severe):           #EF4444 (red)

Borders & Dividers:       #E5E7EB (light grey)
Input Focus Border:       #4F46E5 (brand indigo)
```

### Typography

- **Use iOS system font (SF Pro)** — no custom fonts
- Do NOT install or bundle any font files
- React Native's default font on iOS is SF Pro, so just use `fontFamily: undefined` or `Platform.select({ ios: 'System' })`

```
Screen Title:             SF Pro Display, 28pt, SemiBold (600)
Section Header:           SF Pro Display, 22pt, SemiBold (600)
Card Title:               SF Pro Text, 18pt, SemiBold (600)
Body Text:                SF Pro Text, 16pt, Regular (400)
Input Label:              SF Pro Text, 15pt, Medium (500)
Input Value:              SF Pro Text, 16pt, Regular (400)
Helper Text:              SF Pro Text, 13pt, Regular (400), color #6B7280
Score Display (large):    SF Pro Display, 48pt, Bold (700)
Score Label:              SF Pro Text, 14pt, Medium (500)
Button Text:              SF Pro Text, 17pt, SemiBold (600), white
Footer/Citation Text:     SF Pro Text, 12pt, Regular (400), color #6B7280
```

### Spacing System

```
Screen Padding:           16px horizontal
Card Padding:             20px all sides
Card Border Radius:       12px
Card Shadow:              0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
Input Height:             48px
Input Border Radius:      8px
Input Border:             1px solid #E5E7EB (default), 1.5px solid #4F46E5 (focused)
Button Height:            52px
Button Border Radius:     12px
Section Spacing:          24px vertical gap between sections
Field Spacing:            16px vertical gap between form fields
```

### Design Rules

- **NO dark mode** in V1 — light theme only, matching the web platform
- **NO emoji in calculator UI** — emojis are acceptable on the Home screen cards only (matching the web pattern)
- **NO heavy gradients** — the gradient is reserved for primary CTA buttons and the active tab indicator
- **NO animations beyond standard iOS transitions** — exception: score ring fill animation, bar chart grow animation, and traffic-light dot fade-in on results
- **NO rounded-everything bubbly aesthetic** — this is a clinical tool
- Cards should feel like elevated surfaces on a light background
- Input fields should have visible borders (not just underlines) with clear focus states
- Required field indicators use red asterisk (*) matching the web calculator
- Optional fields are labeled explicitly with "— optional" in grey text (matching the FibroScan web UI pattern)

---

## 3. Tech Stack

### Phase 1: iOS App

```
Framework:          Expo SDK 52+ (managed workflow)
Language:           TypeScript (strict mode)
Navigation:         React Navigation v7 (native stack navigator)
Build System:       EAS Build (for iOS)
Gradient:           expo-linear-gradient
Icons:              @expo/vector-icons (Ionicons or SF Symbols via expo-symbols)
State Management:   React useState / useReducer (local state only, NO Redux/Zustand)
Testing:            Jest (unit tests for calculation functions)
```

### Phase 1: npm Package

```
Package Name:       @livertracker/clinical-scores
Language:           TypeScript
Build:              tsup or tsc for compilation
Target:             ESM + CJS dual output
Zero dependencies
Published on:       npmjs.com
```

### Phase 2: REST API

```
Runtime:            Vercel Serverless Functions (Node.js)
Framework:          None needed (simple handler functions) OR lightweight (Hono if routing needed)
Domain:             api.livertracker.com (subdomain of livertracker.com)
Hosting:            Vercel (connected to separate GitHub repo)
Database:           None required (stateless calculations)
                    Neon Postgres available IF we add API key management or usage tracking later
Documentation:      OpenAPI 3.0 spec, hosted at api.livertracker.com/docs
Rate Limiting:      Vercel's built-in or simple in-memory (1000 req/day unauthenticated)
CORS:               Open (public API)
```

### Phase 3: Python Package

```
Package Name:       livertracker
Language:           Python 3.9+
Build:              setuptools or hatchling
Testing:            pytest (against same validation CSVs)
Published on:       PyPI
Zero dependencies (only stdlib math module)
```

### Phase 4: MCP Server

```
Protocol:           Model Context Protocol (MCP)
Runtime:            Node.js (TypeScript)
Hosting:            Vercel or Cloudflare Workers
Uses:               Same @livertracker/clinical-scores npm package internally
```

### Phase 5: R Package

```
Package Name:       livertracker
Language:           R
Testing:            testthat
Published on:       CRAN
```

### Shared Across All Phases

```
Version Control:    GitHub (separate repo from main LiverTracker platform)
CI/CD:              GitHub Actions
DOI:                Zenodo (auto-minted via GitHub integration on each release)
License:            MIT
```

---

## 4. Phase 1 — iOS App & npm Package

### 4.1 npm Package: @livertracker/clinical-scores

This is the **core calculation engine**. The iOS app imports it. The REST API imports it. The MCP server imports it. Build this FIRST.

#### Package Structure

```
packages/clinical-scores/
├── src/
│   ├── index.ts                 # Barrel export
│   ├── meld.ts                  # MELD original
│   ├── meldNa.ts                # MELD-Na
│   ├── meld3.ts                 # MELD 3.0
│   ├── childPugh.ts             # Child-Pugh
│   ├── liverEnzymes.ts          # Liver Enzyme Checker
│   ├── fibroScan.ts             # FibroScan Interpreter
│   ├── types.ts                 # All TypeScript interfaces
│   └── constants.ts             # Thresholds, ranges, clinical data
├── __tests__/
│   ├── meld.test.ts
│   ├── meldNa.test.ts
│   ├── meld3.test.ts
│   ├── childPugh.test.ts
│   ├── liverEnzymes.test.ts
│   └── fibroScan.test.ts
├── validation/
│   ├── meld-cases.csv
│   ├── meld-na-cases.csv
│   ├── meld3-cases.csv
│   ├── child-pugh-cases.csv
│   ├── liver-enzyme-cases.csv
│   └── fibroscan-cases.csv
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── LICENSE
├── README.md
└── CITATION.cff
```

#### TypeScript Interfaces

```typescript
// types.ts

// =============================================
// MELD INPUT/OUTPUT TYPES
// =============================================

export interface MeldInput {
  bilirubin: number;      // mg/dL, will be clamped to min 1.0
  creatinine: number;     // mg/dL, will be clamped to min 1.0, max 4.0
  inr: number;            // will be clamped to min 1.0
  onDialysis: boolean;    // if true, creatinine set to 4.0
}

export interface MeldNaInput extends MeldInput {
  sodium: number;         // mEq/L, will be bounded 125-137
}

export interface Meld3Input extends MeldNaInput {
  albumin: number;        // g/dL, will be bounded 1.5-3.5
  sex: 'male' | 'female'; // MELD 3.0 uses sex assigned at birth
}

// =============================================
// CHILD-PUGH INPUT/OUTPUT TYPES
// =============================================

export interface ChildPughInput {
  bilirubin: number;      // mg/dL
  albumin: number;        // g/dL
  inr: number;
  ascites: 'none' | 'mild' | 'moderate_severe';
  encephalopathy: 'none' | 'grade_1_2' | 'grade_3_4';
}

// =============================================
// LIVER ENZYME CHECKER INPUT/OUTPUT TYPES
// =============================================

export interface LiverEnzymeInput {
  alt?: number;           // U/L — optional (all fields are optional, but at least one required)
  ast?: number;           // U/L — optional
  ggt?: number;           // U/L — optional
  alp?: number;           // U/L — optional
  bilirubin?: number;     // mg/dL (total bilirubin) — optional
}

export type EnzymeStatus = 'normal' | 'borderline' | 'elevated' | 'significantly_elevated';

export interface EnzymeResult {
  name: string;           // "ALT", "AST", "GGT", "ALP", "Total Bilirubin"
  value: number;
  unit: string;           // "U/L" or "mg/dL"
  normalRange: string;    // "7–40 U/L"
  status: EnzymeStatus;
  statusLabel: string;    // "Normal", "Borderline", "Elevated", "Significantly Elevated"
  statusColor: string;    // hex color
  clinicalNote: string;   // brief plain-language explanation of what this enzyme does
}

export type InjuryPattern = 'hepatocellular' | 'cholestatic' | 'mixed' | 'normal' | 'insufficient_data';

export interface LiverEnzymeResult {
  enzymes: EnzymeResult[];               // Results for each provided enzyme
  overallStatus: EnzymeStatus;           // Worst status across all enzymes
  overallStatusLabel: string;
  overallStatusColor: string;
  injuryPattern: InjuryPattern;          // Pattern recognition based on ALT/AST vs ALP/GGT
  injuryPatternLabel: string;            // "Hepatocellular", "Cholestatic", "Mixed", "Normal"
  injuryPatternExplanation: string;      // Plain language: "Your ALT/AST are elevated relative to ALP..."
  astAltRatio?: number;                  // De Ritis ratio (AST/ALT) — only if both provided
  astAltRatioInterpretation?: string;    // ">2 suggests alcoholic liver disease..."
  clinicalSummary: string;               // Overall plain-language interpretation
  recommendations: string[];             // ["Consider follow-up with hepatologist", etc.]
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}

// =============================================
// FIBROSCAN INTERPRETER INPUT/OUTPUT TYPES
// =============================================

export interface FibroScanInput {
  liverStiffness: number;   // kPa — required (typical range 2.5–75 kPa)
  capScore?: number;        // dB/m — optional (range 100–400 dB/m)
}

export type FibrosisStage = 'F0' | 'F1' | 'F2' | 'F3' | 'F4';
export type SteatosisGrade = 'S0' | 'S1' | 'S2' | 'S3';

export interface FibroScanResult {
  // Fibrosis assessment (always present)
  fibrosis: {
    stage: FibrosisStage;
    stageLabel: string;              // "F0 — No Fibrosis", "F4 — Cirrhosis"
    stageDescription: string;        // Plain language explanation
    stiffnessValue: number;          // kPa input value
    stiffnessColor: string;          // hex color for the stage
    rangeForStage: string;           // "< 5.0 kPa"
    allStages: {                     // All stages with cutoffs for the visual scale
      stage: FibrosisStage;
      label: string;
      cutoff: string;               // "< 5.0 kPa", "5.0–7.0 kPa", etc.
      isActive: boolean;            // true if this is the patient's stage
    }[];
    clinicalImplication: string;     // What this stage means for the patient
  };

  // Steatosis assessment (only if CAP score provided)
  steatosis?: {
    grade: SteatosisGrade;
    gradeLabel: string;              // "S0 — No Steatosis", "S3 — Severe Steatosis"
    gradeDescription: string;
    capValue: number;
    capColor: string;
    rangeForGrade: string;
    allGrades: {
      grade: SteatosisGrade;
      label: string;
      cutoff: string;
      isActive: boolean;
    }[];
    estimatedFatPercentage: string;  // "< 5%", "5–33%", "34–66%", "> 66%"
    clinicalImplication: string;
  };

  overallSummary: string;            // Combined interpretation
  recommendations: string[];
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}

// =============================================
// SHARED OUTPUT TYPES (used across all tools)
// =============================================

export interface ComponentContribution {
  name: string;
  inputValue: number;
  clampedValue: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'mildly_elevated' | 'elevated' | 'critical';
  contribution: number;   // relative contribution to total score (0-1)
  points?: number;        // for Child-Pugh: 1, 2, or 3
}

export interface ClinicalContext {
  severityLabel: string;
  severityColor: string;
  threeMonthMortality?: string;   // MELD only
  oneYearSurvival?: string;       // Child-Pugh only
  twoYearSurvival?: string;       // Child-Pugh only
  transplantImplication: string;
  clinicalNote: string;
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
  score: number;
  rawScore: number;
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  formula: 'MELD' | 'MELD-Na' | 'MELD 3.0';
  calculatedAt: string;
  citationInfo: CitationInfo;
}

export interface ChildPughResult {
  score: number;
  classification: 'A' | 'B' | 'C';
  classificationLabel: string;
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: CitationInfo;
}

// ---- Composite Output ----

export interface AllScoresResult {
  meld: MeldResult;
  meldNa: MeldResult | null;
  meld3: MeldResult | null;
  childPugh: ChildPughResult | null;
  liverEnzymes: LiverEnzymeResult | null;
  fibroScan: FibroScanResult | null;
}
```

#### Calculation Function Signatures

```typescript
// MELD family
export function calculateMeld(input: MeldInput): MeldResult;
export function calculateMeldNa(input: MeldNaInput): MeldResult;
export function calculateMeld3(input: Meld3Input): MeldResult;

// Child-Pugh
export function calculateChildPugh(input: ChildPughInput): ChildPughResult;

// Liver Enzyme Checker
export function checkLiverEnzymes(input: LiverEnzymeInput): LiverEnzymeResult;

// FibroScan Interpreter
export function interpretFibroScan(input: FibroScanInput): FibroScanResult;

// Convenience: calculates all applicable scores from combined inputs
export function calculateAllScores(input: Record<string, any>): AllScoresResult;
```

### 4.2 iOS App

#### App Structure (Expo Router)

```
apps/mobile/
├── app/
│   ├── _layout.tsx               # Root layout with navigation
│   ├── index.tsx                  # Home screen
│   ├── disclaimer.tsx            # First-launch disclaimer (modal)
│   ├── (calculators)/
│   │   ├── _layout.tsx
│   │   ├── liver-enzymes.tsx     # Liver Enzyme Checker screen
│   │   ├── fibroscan.tsx         # FibroScan Interpreter screen
│   │   ├── meld.tsx              # MELD calculator (with tab for MELD/Na/3.0)
│   │   └── child-pugh.tsx        # Child-Pugh calculator screen
│   ├── results/
│   │   ├── enzyme-result.tsx     # Enzyme checker results
│   │   ├── fibroscan-result.tsx  # FibroScan results
│   │   ├── meld-result.tsx       # MELD results display
│   │   └── child-pugh-result.tsx # Child-Pugh results display
│   └── about.tsx                 # About/References/Citations
├── components/
│   ├── ui/
│   │   ├── GradientButton.tsx
│   │   ├── OutlineButton.tsx
│   │   ├── CalculatorInput.tsx   # Text input with validation, normal range, status dot
│   │   ├── OptionalInput.tsx     # Same as CalculatorInput but with "— optional" label
│   │   ├── SegmentedControl.tsx  # MELD/MELD-Na/MELD 3.0 switcher
│   │   ├── SelectDropdown.tsx    # For ascites, encephalopathy, sex
│   │   ├── Checkbox.tsx          # For dialysis toggle
│   │   └── InfoTooltip.tsx       # ⓘ icon that opens bottom sheet
│   ├── results/
│   │   ├── ScoreRing.tsx         # Circular gauge (MELD + Child-Pugh)
│   │   ├── SeverityBanner.tsx    # Colored interpretation banner (all tools)
│   │   ├── ScoreComparison.tsx   # Side-by-side MELD/Na/3.0 comparison strip
│   │   ├── ComponentBreakdown.tsx # Horizontal bars (MELD + Child-Pugh)
│   │   ├── ClinicalContext.tsx   # Mortality/survival stat cards
│   │   ├── TrafficLightRow.tsx   # Single enzyme result row with colored dot (Enzyme Checker)
│   │   ├── TrafficLightSummary.tsx # Overall enzyme assessment (Enzyme Checker)
│   │   ├── FibrosisScale.tsx     # Horizontal F0–F4 scale with marker (FibroScan)
│   │   ├── SteatosisScale.tsx    # Horizontal S0–S3 scale with marker (FibroScan)
│   │   ├── InjuryPatternCard.tsx # Hepatocellular/Cholestatic/Mixed card (Enzyme Checker)
│   │   ├── ActionFooter.tsx      # "Track on LiverTracker" + "Share with Doctor"
│   │   └── CitationFooter.tsx    # References + disclaimer + attribution
│   └── home/
│       ├── ToolCard.tsx          # Tappable card on home screen (replaces CalculatorCard)
│       └── BrandFooter.tsx       # "Made by Dr. Jyotsna Priyam"
├── utils/
│   ├── haptics.ts
│   └── share.ts
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── hooks/
│   └── useFirstLaunch.ts
├── assets/
│   └── images/
│       └── logo.png
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

---

## 5. Phase 2 — REST API

### Hosting

- **Platform**: Vercel Serverless Functions
- **Domain**: `api.livertracker.com` (configure as custom domain in Vercel)
- **GitHub**: Separate repository, connected to Vercel for auto-deploy on push
- **Database**: Not required for V1. Neon Postgres available if needed later.

### API Repository Structure

```
livertracker-api/
├── api/
│   ├── v1/
│   │   ├── calculate.ts          # POST — all scores from combined input
│   │   ├── meld.ts               # POST — MELD only
│   │   ├── meld-na.ts            # POST — MELD-Na only
│   │   ├── meld3.ts              # POST — MELD 3.0 only
│   │   ├── child-pugh.ts         # POST — Child-Pugh only
│   │   ├── liver-enzymes.ts      # POST — Liver Enzyme Checker
│   │   ├── fibroscan.ts          # POST — FibroScan Interpreter
│   │   ├── scoring-systems.ts    # GET — list all available systems + metadata
│   │   └── health.ts             # GET — health check
│   └── docs/
│       └── index.ts              # Serves OpenAPI/Swagger UI
├── lib/
│   └── response.ts
├── openapi/
│   └── spec.yaml                 # OpenAPI 3.0 specification
├── package.json                  # depends on @livertracker/clinical-scores
├── vercel.json
├── tsconfig.json
├── LICENSE
├── README.md
└── CITATION.cff
```

### API Endpoints

#### Base URL: `https://api.livertracker.com/v1`

**POST `/v1/calculate`** — Universal endpoint. Returns all applicable results based on which fields are provided.

**POST `/v1/meld`** — MELD only
**POST `/v1/meld-na`** — MELD-Na only
**POST `/v1/meld3`** — MELD 3.0 only
**POST `/v1/child-pugh`** — Child-Pugh only

**POST `/v1/liver-enzymes`** — Liver Enzyme Checker
```json
{
  "alt": 85,
  "ast": 62,
  "ggt": 120,
  "alp": 95,
  "bilirubin": 1.8
}
```
All fields optional, but at least one required.

**POST `/v1/fibroscan`** — FibroScan Interpreter
```json
{
  "liverStiffness": 12.5,
  "capScore": 285
}
```
`liverStiffness` required, `capScore` optional.

**GET `/v1/scoring-systems`** — Lists all 6 systems with metadata, required/optional inputs, references, and endpoint paths.

**GET `/v1/health`** — Health check.

Every response includes the standard `meta` object with `apiVersion`, `calculationEngine`, `timestamp`, and `citation` (DOI, suggested citation, BibTeX).

### API Versioning, Rate Limiting, CORS, Error Handling

Same as previous specification:
- Versioned under `/v1/`, old versions maintained 5+ years
- 1000 req/day unauthenticated, rate limit headers included
- Open CORS
- Error codes: `INVALID_INPUT`, `MISSING_REQUIRED_FIELD`, `RATE_LIMITED`, `INTERNAL_ERROR`

---

## 6. Phase 3 — Python Package (PyPI)

### Package Name: `livertracker`

### Structure

```
livertracker-python/
├── src/
│   └── livertracker/
│       ├── __init__.py
│       ├── meld.py
│       ├── meld_na.py
│       ├── meld3.py
│       ├── child_pugh.py
│       ├── liver_enzymes.py      # NEW
│       ├── fibroscan.py          # NEW
│       ├── types.py
│       └── constants.py
├── tests/
│   ├── test_meld.py
│   ├── test_meld_na.py
│   ├── test_meld3.py
│   ├── test_child_pugh.py
│   ├── test_liver_enzymes.py     # NEW
│   ├── test_fibroscan.py         # NEW
│   └── validation_data/
│       ├── meld-cases.csv
│       ├── meld-na-cases.csv
│       ├── meld3-cases.csv
│       ├── child-pugh-cases.csv
│       ├── liver-enzyme-cases.csv  # NEW
│       └── fibroscan-cases.csv     # NEW
├── pyproject.toml
├── LICENSE
├── README.md
└── CITATION.cff
```

### Usage Examples

```python
from livertracker import check_liver_enzymes, interpret_fibroscan

# Liver Enzyme Checker
result = check_liver_enzymes(alt=85, ast=62, ggt=120, bilirubin=1.8)
print(result.overall_status_label)    # "Elevated"
print(result.injury_pattern_label)    # "Hepatocellular"
print(result.ast_alt_ratio)           # 0.73

# FibroScan Interpreter
result = interpret_fibroscan(liver_stiffness=12.5, cap_score=285)
print(result.fibrosis.stage)          # "F3"
print(result.fibrosis.stage_label)    # "F3 — Advanced Fibrosis"
print(result.steatosis.grade)         # "S2"
print(result.steatosis.grade_label)   # "S2 — Moderate Steatosis"

# Works with pandas
import pandas as pd
df = pd.read_csv("fibroscan_results.csv")
df['fibrosis_stage'] = df.apply(
    lambda row: interpret_fibroscan(liver_stiffness=row['kpa']).fibrosis.stage,
    axis=1
)
```

---

## 7. Phase 4 — MCP Server

### MCP Tools Exposed (6 tools + 1 meta tool)

```
Tool: calculate_meld
(same as previous spec)

Tool: calculate_meld_na
(same as previous spec)

Tool: calculate_meld3
(same as previous spec)

Tool: calculate_child_pugh
(same as previous spec)

Tool: check_liver_enzymes
Description: Analyze liver enzyme values with traffic-light interpretation. Identifies injury patterns
  (hepatocellular vs cholestatic vs mixed) and calculates the De Ritis ratio (AST/ALT).
Parameters:
  - alt (number, optional): ALT in U/L
  - ast (number, optional): AST in U/L
  - ggt (number, optional): GGT in U/L
  - alp (number, optional): ALP in U/L
  - bilirubin (number, optional): Total bilirubin in mg/dL
  At least one parameter must be provided.

Tool: interpret_fibroscan
Description: Interpret FibroScan transient elastography results. Classifies liver stiffness into
  fibrosis stages (F0–F4) and CAP score into steatosis grades (S0–S3).
Parameters:
  - liver_stiffness (number, required): Liver stiffness measurement in kPa
  - cap_score (number, optional): Controlled Attenuation Parameter in dB/m

Tool: list_scoring_systems
Description: List all available clinical tools with descriptions, required inputs, and references.
Parameters: none
```

---

## 8. Phase 5 — R Package (CRAN)

### Structure update

```
R/
├── meld.R
├── meld_na.R
├── meld3.R
├── child_pugh.R
├── liver_enzymes.R      # NEW
├── fibroscan.R          # NEW
└── constants.R
```

All functions vectorized. Tested against same validation CSVs.

---

## 9. Scoring System Formulas & Clinical Logic

### 9.1 MELD (Original)

**Reference**: Kamath PS, Wiesner RH, Malinchoc M, et al. A model to predict survival in patients with end-stage liver disease. *Hepatology*. 2001;33(2):464-470. DOI: 10.1053/jhep.2001.22172

**Additional Reference**: Kamath PS, Kim WR. The model for end-stage liver disease (MELD). *Hepatology*. 2007;45(3):797-805. DOI: 10.1002/hep.21563

**Value Clamping Rules**:
- Bilirubin: if < 1.0, set to 1.0
- Creatinine: if < 1.0, set to 1.0; if > 4.0, set to 4.0
- INR: if < 1.0, set to 1.0
- If on dialysis (≥2 sessions/week): set creatinine to 4.0

**Formula**:
```
MELD = 10 × (0.957 × ln(Creatinine) + 0.378 × ln(Bilirubin) + 1.120 × ln(INR) + 0.643)
```

**Post-calculation**: Round to nearest integer. Clamp to 6–40.

**Score Interpretation**:
| Score | Severity | 3-Month Mortality | Color |
|-------|----------|-------------------|-------|
| 6–9 | Minimal | ~1.9% | #10B981 |
| 10–19 | Moderate | ~6.0% | #F59E0B |
| 20–29 | Severe | ~19.6% | #EF4444 |
| 30–40 | Very Severe | ~52.6% | #991B1B |

**Transplant Context**:
- MELD ≥ 15: Transplant evaluation typically initiated
- MELD ≥ 20: Generally listed for transplant
- MELD ≥ 30: High urgency
- MELD ≥ 35: Very high urgency

### 9.2 MELD-Na

**Reference**: Kim WR, Biggins SW, Kremers WK, et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. *N Engl J Med*. 2008;359(10):1018-1026. DOI: 10.1056/NEJMoa0801209

**Additional Reference**: Biggins SW, Kim WR, Terrault NA, et al. Evidence-based incorporation of serum sodium concentration into MELD. *Gastroenterology*. 2006;130(6):1652-1660. DOI: 10.1053/j.gastro.2006.02.010

**Sodium Clamping**: if < 125, set to 125; if > 137, set to 137

**Formula**:
```
MELD(i) = standard MELD score (see 9.1)
MELD-Na = MELD(i) + 1.32 × (137 - Sodium) - (0.033 × MELD(i) × (137 - Sodium))
```

**Post-calculation**: Round to nearest integer. Clamp to 6–40.

### 9.3 MELD 3.0

**Reference**: Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. *Gastroenterology*. 2021;161(6):1887-1895.e4. DOI: 10.1053/j.gastro.2021.08.050

**Value Clamping**:
- Bilirubin: if < 1.0, set to 1.0
- Creatinine: if < 1.0, set to 1.0; if > 3.0, set to 3.0 (NOTE: cap is 3.0, different from MELD's 4.0)
- INR: if < 1.0, set to 1.0
- Sodium: if < 125, set to 125; if > 137, set to 137
- Albumin: if < 1.5, set to 1.5; if > 3.5, set to 3.5
- If on dialysis: set creatinine to 3.0

**Formula**:
```
MELD 3.0 = 10 × (
  1.33 × ln(Creatinine) +
  0.24 × ln(Bilirubin) +
  0.94 × ln(INR) -
  0.66 × ln(Sodium) +
  1.72 × ln(max(Albumin, 1.5)) +
  0.0376 × (137 - Sodium) × ln(Albumin) +
  0.0300 × ln(Creatinine) × ln(Bilirubin) +
  CONSTANT
)

CONSTANT = 1.3258 (female) | 0.7353 (male)
```

**Post-calculation**: Round to nearest integer. Clamp to 6–40.

### 9.4 Child-Pugh Score

**Reference**: Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. *Br J Surg*. 1973;60(8):646-649. DOI: 10.1002/bjs.1800600817

**Historical Reference**: Child CG, Turcotte JG. Surgery and portal hypertension. In: *The liver and portal hypertension*. Philadelphia: WB Saunders Co; 1964:50-64.

**Point Scoring**:
| Component | 1 Point | 2 Points | 3 Points |
|-----------|---------|----------|----------|
| Bilirubin (mg/dL) | < 2 | 2–3 | > 3 |
| Albumin (g/dL) | > 3.5 | 2.8–3.5 | < 2.8 |
| INR | < 1.7 | 1.7–2.3 | > 2.3 |
| Ascites | None | Mild | Moderate–Severe |
| Encephalopathy | None | Grade 1–2 | Grade 3–4 |

**Classification**:
| Score | Class | Label | 1-Year Survival | 2-Year Survival | Perioperative Mortality |
|-------|-------|-------|-----------------|-----------------|------------------------|
| 5–6 | A | Compensated | ~100% | ~85% | ~10% |
| 7–9 | B | Significant Compromise | ~80% | ~60% | ~30% |
| 10–15 | C | Decompensated | ~45% | ~35% | ~70–80% |

### 9.5 Liver Enzyme Checker

**References**:
- Kwo PY, Cohen SM, Lim JK. ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries. *Am J Gastroenterol*. 2017;112(1):18-35. DOI: 10.1038/ajg.2016.517
- Giannini EG, Testa R, Savarino V. Liver enzyme alteration: a guide for clinicians. *CMAJ*. 2005;172(3):367-379. DOI: 10.1503/cmaj.1040752

**This is NOT a formula-based calculator. It is a rule-based interpretation engine.**

#### Normal Ranges and Thresholds

| Enzyme | Normal | Borderline | Elevated | Significantly Elevated |
|--------|--------|------------|----------|------------------------|
| ALT (U/L) | 7–40 | 41–80 (1–2× ULN) | 81–200 (2–5× ULN) | > 200 (> 5× ULN) |
| AST (U/L) | 8–35 | 36–70 (1–2× ULN) | 71–175 (2–5× ULN) | > 175 (> 5× ULN) |
| GGT (U/L) | 9–50 | 51–100 (1–2× ULN) | 101–250 (2–5× ULN) | > 250 (> 5× ULN) |
| ALP (U/L) | 44–120 | 121–240 (1–2× ULN) | 241–600 (2–5× ULN) | > 600 (> 5× ULN) |
| Total Bilirubin (mg/dL) | 0.1–1.0 | 1.1–2.0 | 2.1–5.0 | > 5.0 |

ULN = Upper Limit of Normal. Multiples are approximate and based on the upper bound of the normal range.

#### Injury Pattern Recognition

When sufficient enzymes are provided, determine the pattern:

- **Hepatocellular pattern**: ALT or AST elevated ≥ 2× ULN AND ALP < 2× ULN. Suggests liver cell damage (hepatitis, fatty liver, drug injury).
- **Cholestatic pattern**: ALP or GGT elevated ≥ 2× ULN AND ALT < 2× ULN. Suggests bile duct obstruction or disease.
- **Mixed pattern**: Both (ALT or AST) AND (ALP or GGT) elevated ≥ 2× ULN. Suggests combined injury.
- **Normal**: All provided enzymes within normal range.
- **Insufficient data**: Not enough enzymes provided to determine pattern (need at least one aminotransferase AND one cholestatic marker).

R ratio (more precise pattern classification): R = (ALT / ALT_ULN) / (ALP / ALP_ULN)
- R > 5 → Hepatocellular
- R < 2 → Cholestatic
- R 2–5 → Mixed

#### De Ritis Ratio (AST/ALT)

Only calculated when BOTH AST and ALT are provided:
- AST/ALT < 1: Suggests non-alcoholic fatty liver disease, viral hepatitis
- AST/ALT > 1: Suggests alcoholic liver disease, advanced fibrosis
- AST/ALT > 2: Strongly suggests alcoholic hepatitis

#### Per-Enzyme Clinical Notes

- **ALT**: "Most specific marker for liver cell damage. Elevated in hepatitis, fatty liver disease, and drug-induced liver injury."
- **AST**: "Found in liver, heart, and muscle tissue. Less specific than ALT but useful in combination. The AST/ALT ratio helps differentiate causes."
- **GGT**: "Sensitive to alcohol use and bile duct problems. Often the first enzyme to rise. Elevated GGT with normal ALP suggests alcohol-related damage."
- **ALP**: "Elevated in bile duct obstruction, bone disease, and pregnancy. Must be interpreted in clinical context."
- **Total Bilirubin**: "A waste product from red blood cell breakdown. High levels cause jaundice (yellowing of skin/eyes). Elevated bilirubin indicates impaired liver function or bile duct blockage."

### 9.6 FibroScan Score Interpreter

**References**:
- Castera L, Forns X, Alberti A. Non-invasive evaluation of liver fibrosis using transient elastography. *J Hepatol*. 2008;48(5):835-847. DOI: 10.1016/j.jhep.2008.02.008
- Sasso M, Beaugrand M, de Ledinghen V, et al. Controlled attenuation parameter (CAP): a novel VCTE guided ultrasonic attenuation measurement for the evaluation of hepatic steatosis. *Ultrasound Med Biol*. 2010;36(11):1825-1835. DOI: 10.1016/j.ultrasmedbio.2010.07.005
- EASL-ALEH Clinical Practice Guidelines: Non-invasive tests for evaluation of liver disease severity and prognosis. *J Hepatol*. 2015;63(1):237-264. DOI: 10.1016/j.jhep.2015.04.006

**This is a threshold-based interpretation tool, not a formula.**

#### Liver Stiffness → Fibrosis Stage (General NAFLD Cutoffs)

| Stage | Label | Stiffness (kPa) | Description |
|-------|-------|-----------------|-------------|
| F0 | No Fibrosis | < 5.0 | No significant fibrosis detected. Liver tissue is normal. |
| F1 | Mild Fibrosis | 5.0–7.0 | Mild fibrosis. Minimal scarring around portal areas. |
| F2 | Moderate Fibrosis | 7.1–9.5 | Moderate (significant) fibrosis. Scarring extends between portal areas. |
| F3 | Advanced Fibrosis | 9.6–14.0 | Advanced fibrosis. Bridging fibrosis with architectural distortion. |
| F4 | Cirrhosis | > 14.0 | Cirrhosis. Extensive scarring with disrupted liver architecture. |

**IMPORTANT NOTE**: Cutoff values vary by etiology (NAFLD vs. HBV vs. HCV vs. alcohol). The above are general NAFLD-based cutoffs from EASL guidelines. The results should note: "Cutoff values may vary based on your underlying liver condition. Discuss with your hepatologist."

#### CAP Score → Steatosis Grade

| Grade | Label | CAP (dB/m) | Fat Percentage | Description |
|-------|-------|------------|----------------|-------------|
| S0 | No Steatosis | < 238 | < 5% | No significant fat accumulation in the liver. |
| S1 | Mild Steatosis | 238–260 | 5–33% | Mild fat accumulation. Early fatty liver. |
| S2 | Moderate Steatosis | 261–290 | 34–66% | Moderate fat accumulation. Established fatty liver. |
| S3 | Severe Steatosis | > 290 | > 66% | Severe fat accumulation. Advanced fatty liver. |

#### Clinical Implications by Fibrosis Stage

- **F0–F1**: "Minimal or no fibrosis. Focus on preventing progression through lifestyle modifications — weight management, exercise, limiting alcohol, and managing metabolic risk factors."
- **F2**: "Significant fibrosis detected. Intervention is recommended to prevent further progression. Regular monitoring every 6–12 months. Discuss treatment options with your hepatologist."
- **F3**: "Advanced fibrosis. You are at elevated risk for cirrhosis-related complications. Close monitoring every 3–6 months. Treatment is strongly recommended."
- **F4**: "Cirrhosis. You may need evaluation for liver-related complications including portal hypertension, varices, and hepatocellular carcinoma screening. Referral to a hepatologist/transplant center is recommended."

---

## 10. Validation Dataset Specification

### CSV Files (6 total)

**meld-cases.csv** — 30+ cases
**meld-na-cases.csv** — 25+ cases
**meld3-cases.csv** — 25+ cases
**child-pugh-cases.csv** — 20+ cases

**liver-enzyme-cases.csv** — 25+ cases
```csv
case_id,alt,ast,ggt,alp,bilirubin,expected_overall_status,expected_pattern,expected_ast_alt_ratio,source
LE001,32,28,45,85,0.8,normal,normal,,baseline normal
LE002,85,62,120,95,1.8,elevated,hepatocellular,0.73,hepatitis pattern
LE003,25,20,180,280,0.9,elevated,cholestatic,,bile duct pattern
LE004,150,200,90,100,3.5,significantly_elevated,hepatocellular,1.33,alcoholic hepatitis
LE005,,,45,,0.5,normal,insufficient_data,,minimal data
LE006,300,250,350,500,8.0,significantly_elevated,mixed,0.83,severe mixed
```

**fibroscan-cases.csv** — 20+ cases
```csv
case_id,liver_stiffness,cap_score,expected_fibrosis_stage,expected_steatosis_grade,source
FS001,3.5,,F0,,normal stiffness no CAP
FS002,6.2,250,F1,S1,mild fibrosis mild fat
FS003,8.5,285,F2,S2,moderate fibrosis moderate fat
FS004,12.5,310,F3,S3,advanced fibrosis severe fat
FS005,18.0,220,F4,S0,cirrhosis no significant fat
FS006,4.8,295,F0,S3,normal stiffness but fatty
```

---

## 11. Apple App Store Compliance

### Medical Disclaimer (updated for all tools)

```
MEDICAL DISCLAIMER

This application is designed for educational and informational purposes only.
It is not intended to be a substitute for professional medical advice, diagnosis,
or treatment.

• Scores and interpretations are approximations based on published clinical
  guidelines and formulas.

• MELD scores should NOT be used for official transplant listing decisions.
  Official scores are calculated by UNOS/OPTN using verified laboratory values.

• Liver enzyme ranges may vary between laboratories. Always use your lab's
  specific reference ranges.

• FibroScan cutoff values vary based on the underlying liver condition.
  Results should be interpreted by your hepatologist.

• Always consult your hepatologist, transplant team, or qualified healthcare
  provider for clinical decisions.

This tool was developed by Dr. Jyotsna Priyam and is part of the LiverTracker
platform (livertracker.com).
```

### Minimum Functionality (Guideline 4.2) — Strengthened

With four tool categories (six systems), the app now has substantial depth:
- Liver Enzyme Checker with traffic-light system + pattern recognition ✓
- FibroScan Interpreter with fibrosis staging + steatosis grading ✓
- Three MELD variants with comparison view ✓
- Child-Pugh with component breakdown ✓
- Rich results with clinical context for every tool ✓
- Educational content (tooltips, about section) ✓
- Share functionality ✓
- Citations and references ✓

This easily satisfies Apple's minimum functionality bar.

All other App Store requirements (privacy policy, no diagnosis claims, content rating, attribution) remain the same as the v1 specification.

---

## 12. Citation & Academic Infrastructure

### CITATION.cff (updated)

```yaml
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
title: "LiverTracker Clinical Tools"
abstract: >-
  An open-source, validated suite of liver health assessment tools including
  MELD, MELD-Na, MELD 3.0, Child-Pugh, Liver Enzyme Checker, and FibroScan
  Score Interpreter. Available as an iOS application, npm package, REST API,
  Python package, MCP server, and R package.
authors:
  - family-names: "Priyam"
    given-names: "Jyotsna"
    orcid: "https://orcid.org/XXXX-XXXX-XXXX-XXXX"
license: MIT
repository-code: "https://github.com/livertracker/clinical-scores"
url: "https://livertracker.com"
doi: "10.5281/zenodo.XXXXXXX"
version: "1.0.0"
date-released: "2026-XX-XX"
keywords:
  - meld-score
  - child-pugh
  - liver-enzymes
  - fibroscan
  - transient-elastography
  - liver-disease
  - hepatology
  - clinical-calculator
  - transplant
  - fibrosis
  - steatosis
  - nafld
  - meld-3
  - open-source
  - medical
preferred-citation:
  type: article
  authors:
    - family-names: "Priyam"
      given-names: "Jyotsna"
  title: "LiverTracker Clinical Tools: An Open-Source Suite for Liver Health Assessment"
  journal: "JMIR mHealth and uHealth"
  year: 2026
  doi: "10.2196/XXXXX"
```

### Updated Paper Title Suggestion

*"LiverTracker Clinical Tools: An Open-Source, Validated Mobile Suite for Liver Enzyme Screening, Fibrosis Staging, and End-Stage Severity Scoring"*

The addition of the Enzyme Checker and FibroScan Interpreter significantly strengthens the paper because it now covers the complete liver evaluation pipeline (screening → staging → severity), which is a stronger narrative than just "two calculators."

---

## 13. GitHub Repository Structure

### Primary Repo: `livertracker/clinical-scores`

```
livertracker-clinical-scores/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── new_scoring_system.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml
│       ├── release.yml
│       └── validate.yml
├── packages/
│   └── clinical-scores/             # npm package
├── apps/
│   └── mobile/                      # Expo iOS app
├── validation/
│   ├── README.md
│   ├── test-cases/
│   │   ├── meld-cases.csv
│   │   ├── meld-na-cases.csv
│   │   ├── meld3-cases.csv
│   │   ├── child-pugh-cases.csv
│   │   ├── liver-enzyme-cases.csv
│   │   └── fibroscan-cases.csv
│   └── concordance-report.md
├── docs/
│   ├── FORMULAS.md
│   ├── ENZYME_THRESHOLDS.md          # NEW — complete threshold tables
│   ├── FIBROSCAN_CUTOFFS.md          # NEW — cutoff values by etiology
│   ├── CLINICAL_CONTEXT.md
│   ├── ARCHITECTURE.md
│   └── SCREENSHOTS.md
├── CITATION.cff
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── README.md
└── package.json
```

---

## 14. UI/UX Specification — Forms

### Liver Enzyme Checker Screen

**Header**: "Liver Enzyme Checker"
**Subheader** (grey text): "Fill in any values you have — all fields are optional."

All fields are optional, but at least one must be filled before the button activates.

**Form Fields** (all optional, no asterisks):

1. **ALT (U/L)**
   - Placeholder: "e.g. 32"
   - Helper text: "Normal range: 7–40 U/L"
   - Keyboard type: number-pad (integers only)

2. **AST (U/L)**
   - Placeholder: "e.g. 28"
   - Helper text: "Normal range: 8–35 U/L"
   - Keyboard type: number-pad

3. **GGT (U/L)**
   - Placeholder: "e.g. 45"
   - Helper text: "Normal range: 9–50 U/L"
   - Keyboard type: number-pad

4. **ALP (U/L)**
   - Placeholder: "e.g. 85"
   - Helper text: "Normal range: 44–120 U/L"
   - Keyboard type: number-pad

5. **Total Bilirubin (mg/dL)**
   - Placeholder: "e.g. 0.8"
   - Helper text: "Normal range: 0.1–1.0 mg/dL"
   - Keyboard type: decimal-pad

**Real-Time Status Dot**: Same as MELD — each input shows a colored dot based on whether the value is normal/borderline/elevated as the user types.

**Action Buttons**:
- "Check Enzymes" — brand gradient, full-width
- "Reset" — outline style

### FibroScan Interpreter Screen

**Header**: "FibroScan Interpreter"

**Form Fields**:

1. **Liver Stiffness (kPa)** *
   - Placeholder: "e.g. 5.8"
   - Helper text: "Normal: <5.0 kPa · Typical range: 2.5–75 kPa"
   - Keyboard type: decimal-pad
   - Validation: must be > 0, warn if > 75

2. **CAP Score (dB/m)** — optional
   - Label shows "— optional" in grey (matching web UI)
   - Placeholder: "e.g. 245"
   - Helper text: "Measures liver fat · Normal: <238 dB/m · Range: 100–400 dB/m"
   - Keyboard type: number-pad
   - Validation: 100–400 range, warn if outside

**Action Buttons**:
- "Interpret Results" — brand gradient, full-width
- "Reset" — outline style

### MELD Calculator Screen

(Same as v1 specification — segmented control for MELD/MELD-Na/MELD 3.0 with conditional fields)

### Child-Pugh Calculator Screen

(Same as v1 specification)

---

## 15. UI/UX Specification — Results Page

### Results Presentation: Liver Enzyme Checker

Results appear as a modal sliding up. No score ring for this tool — instead, a traffic-light visual system.

**Layer 1 — Overall Status Banner (Hero)**

A large full-width banner at the top with colored background:
- Green: "Your Liver Enzymes Are Normal"
- Amber: "Some Enzymes Are Borderline"
- Orange: "Some Enzymes Are Elevated"
- Red: "Significantly Elevated Enzymes Detected"

Bold white text, centered.

**Layer 2 — Traffic Light Results Grid**

Each provided enzyme gets a row:
```
┌────────────────────────────────────────┐
│  ● ALT    32 U/L         Normal       │
│  ● AST    62 U/L         Borderline   │
│  ● GGT    120 U/L        Elevated     │
│  ● ALP    95 U/L         Normal       │
│  ● Bilirubin  1.8 mg/dL  Borderline   │
└────────────────────────────────────────┘
```

- Left: large colored dot (12px) matching status color
- Center-left: enzyme name
- Center: value + unit
- Right: status label in matching color
- Each row is tappable → opens InfoTooltip bottom sheet with the enzyme's clinical note
- Only enzymes that were actually entered are shown

**Layer 3 — Injury Pattern Card**

Only shown if sufficient enzymes were provided to determine pattern.

A card with:
- Title: "Liver Injury Pattern"
- Pattern label: "Hepatocellular" / "Cholestatic" / "Mixed" / "Normal"
- Pattern icon or color indicator
- Plain-language explanation: "Your ALT and AST are elevated relative to ALP, suggesting liver cell damage (hepatocellular pattern). Common causes include hepatitis, fatty liver disease, or medication effects."
- If R ratio was calculated, show it: "R ratio: 3.2 (hepatocellular pattern)"

**Layer 4 — De Ritis Ratio Card** (if both AST and ALT provided)

- "AST/ALT Ratio: 0.73"
- Interpretation: "A ratio below 1.0 is commonly seen in non-alcoholic fatty liver disease or viral hepatitis."
- ⓘ icon for more detail

**Layer 5 — Recommendations**

Bullet-list style, but using the card-with-icon pattern:
- "Consider follow-up liver panel in 4–6 weeks"
- "Discuss results with your primary care physician or hepatologist"
- "Avoid alcohol and hepatotoxic medications"
- (Contextual based on which enzymes are elevated)

**Layer 6 — Action Footer** (same pattern: Track + Share)
**Layer 7 — Citation Footer** (ACG guideline references + disclaimer + attribution)

### Results Presentation: FibroScan Interpreter

**Layer 1 — Fibrosis Stage Visual (Hero Element)**

Instead of a circular score ring, use a **horizontal staged scale**:
```
F0        F1        F2        F3        F4
├─────────┼─────────┼─────────┼─────────┤
●←←←←←←←←←←←←←←X
         [12.5 kPa]
```

A horizontal bar divided into 5 color-graded segments (F0=green through F4=red). A prominent marker/indicator shows where the patient's reading falls. Below the marker: the kPa value. Below the scale: the stage label ("F3 — Advanced Fibrosis") in large text.

The scale should be visually rich — think of a wide gradient bar with tick marks at each stage boundary (5.0, 7.0, 9.5, 14.0 kPa) and labels above each segment.

**Layer 2 — Fibrosis Severity Banner**

Full-width colored card (same pattern as other tools):
- "Advanced Fibrosis (F3)" in white text on orange background
- Subtext: "Liver stiffness: 12.5 kPa"

**Layer 3 — Steatosis Scale** (only if CAP score provided)

Same horizontal scale concept but for S0–S3:
```
S0        S1        S2        S3
├─────────┼─────────┼─────────┤
                    X
               [285 dB/m]
```

Below: "S2 — Moderate Steatosis"
Below that: "Estimated liver fat: 34–66%"

**Layer 4 — Combined Clinical Interpretation Card**

Title: "What Your Results Mean"

A summary paragraph combining both readings:
"Your liver stiffness of 12.5 kPa indicates advanced fibrosis (F3) with significant scarring between portal areas. Your CAP score of 285 dB/m indicates moderate fat accumulation (S2). Close monitoring every 3–6 months is recommended. Discuss treatment options with your hepatologist."

**Layer 5 — Fibrosis Stage Detail Card**

A collapsible or scrollable list showing ALL fibrosis stages with their cutoffs, with the patient's stage highlighted:
- F0: < 5.0 kPa — No fibrosis
- F1: 5.0–7.0 kPa — Mild fibrosis
- **F2: 7.1–9.5 kPa — Moderate fibrosis** (dimmed if not active)
- **→ F3: 9.6–14.0 kPa — Advanced fibrosis** (highlighted, bold, with marker)
- F4: > 14.0 kPa — Cirrhosis

This gives context — the patient can see exactly where they fall and what's above/below them.

**Layer 6 — Important Note Card**

A subtle grey-bordered card:
"Note: Cutoff values shown here are general NAFLD-based ranges. Exact thresholds may vary based on your underlying liver condition (hepatitis B, hepatitis C, alcohol-related, etc.). Always discuss FibroScan results with your hepatologist."

**Layer 7 — Action Footer** (Track + Share)
**Layer 8 — Citation Footer** (Castera 2008, EASL 2015 + disclaimer + attribution)

### Results Presentation: MELD

(Same as v1 specification — Score Ring, Severity Banner, Comparison Strip, Component Breakdown, Clinical Context, Action Footer, Citation Footer)

### Results Presentation: Child-Pugh

(Same as v1 specification — Score Ring with 3-band arc, Classification Banner, Point Breakdown, Clinical Context, Action Footer, Citation Footer)

### Haptic Feedback (all tools)

- Light tap when action button pressed
- Medium tap when results appear
- Use `expo-haptics`

### Transition Animation (all tools)

- Form → Results: full-screen modal slide up
- Tool-specific hero animations:
  - MELD/Child-Pugh: score ring fill animation (800ms, ease-out)
  - Enzyme Checker: traffic light dots fade in sequentially (100ms stagger per enzyme)
  - FibroScan: marker slides along the horizontal scale to position (600ms, ease-out)

---

## 16. Screens & Navigation

### Navigation Structure

```
Root Stack Navigator (native stack)
├── Home Screen (index)                     # Tool cards + branding
├── Liver Enzyme Checker Screen             # Form
├── FibroScan Interpreter Screen            # Form
├── MELD Calculator Screen                  # Form + segmented control
├── Child-Pugh Calculator Screen            # Form
├── Enzyme Results Screen (modal)           # Traffic light results
├── FibroScan Results Screen (modal)        # Stage scale results
├── MELD Results Screen (modal)             # Score ring results
├── Child-Pugh Results Screen (modal)       # Score ring results
├── About Screen                            # References, credits, links
└── Disclaimer Screen (modal, first launch) # Medical disclaimer
```

### Home Screen Layout

```
┌──────────────────────────────────┐
│          [LiverTracker Logo]     │
│    Track Your Liver.             │
│    Extend Your Life.             │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 🔬  Liver Enzyme Checker   │  │
│  │ Check your ALT, AST, GGT, │  │
│  │ ALP, and bilirubin levels  │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 📊  FibroScan Interpreter  │  │
│  │ Understand your liver      │  │
│  │ stiffness and fat scores   │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 🧮  MELD Score Calculator  │  │
│  │ Calculate MELD, MELD-Na,   │  │
│  │ and MELD 3.0 scores        │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 🫀  Child-Pugh Score       │  │
│  │ Classify cirrhosis         │  │
│  │ severity (Class A, B, C)   │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │ ℹ️  About & References      │  │
│  │ Citations, formulas,       │  │
│  │ and methodology            │  │
│  └────────────────────────────┘  │
│                                  │
│  Made by Dr. Jyotsna Priyam     │
│  livertracker.com                │
│                                  │
│  For educational purposes only.  │
│  Not medical advice.             │
└──────────────────────────────────┘
```

The card ordering follows the clinical disease progression: Screening (enzymes) → Staging (FibroScan) → Severity (MELD) → Classification (Child-Pugh).

### About Screen Content (updated)

1. **About LiverTracker**
2. **About These Tools**: What each tool does and when to use it
3. **Clinical Disease Progression**: Brief explanation of how the four tools map to the liver evaluation journey
4. **When to Use Each Tool**:
   - Enzyme Checker: "First-line screening when you get blood work. Are my liver enzymes normal?"
   - FibroScan: "After abnormal enzymes or known liver disease. How much scarring do I have?"
   - MELD: "End-stage liver disease assessment. How urgently do I need a transplant?"
   - Child-Pugh: "Cirrhosis classification. What is my surgical risk and prognosis?"
5. **Formulas & Thresholds**: Collapsible sections for each tool
6. **References**: Full citation list with tappable DOIs
7. **Credits**: Dr. Jyotsna Priyam + credentials
8. **Open Source**: GitHub link, DOI, How to Cite
9. **Legal**: Privacy Policy, Terms, Disclaimer links

---

## 17. Accessibility & Edge Cases

### Input Validation (updated for new tools)

**Liver Enzyme Checker**:
- At least one field must be filled to enable "Check Enzymes"
- All values must be positive
- Warn (don't block) if values seem unusually high: ALT > 1000, AST > 1000, GGT > 500, ALP > 1000, Bilirubin > 30
- Integer input for ALT, AST, GGT, ALP; decimal for Bilirubin

**FibroScan Interpreter**:
- Liver stiffness is required
- Valid range: 2.5–75 kPa. Warn if outside.
- CAP score valid range: 100–400 dB/m. Warn if outside.
- Both accept decimal input

All other validation rules from v1 remain unchanged.

### iOS Accessibility

- All color-coded results have text labels (traffic light dots are paired with "Normal"/"Elevated" text)
- Horizontal scales (FibroScan) announce stage via VoiceOver
- Minimum 44×44pt touch targets throughout
- Dynamic Type support

---

## 18. Deployment & Infrastructure

(Same as v1 specification — EAS Build for iOS, npm publish, Vercel for API, Zenodo DOI, DNS configuration)

---

## Appendix A: Complete Reference List

### Scoring System References

1. Kamath PS, et al. *Hepatology*. 2001;33(2):464-470. DOI: 10.1053/jhep.2001.22172
2. Kamath PS, Kim WR. *Hepatology*. 2007;45(3):797-805. DOI: 10.1002/hep.21563
3. Kim WR, et al. *N Engl J Med*. 2008;359(10):1018-1026. DOI: 10.1056/NEJMoa0801209
4. Biggins SW, et al. *Gastroenterology*. 2006;130(6):1652-1660. DOI: 10.1053/j.gastro.2006.02.010
5. Kim WR, et al. *Gastroenterology*. 2021;161(6):1887-1895.e4. DOI: 10.1053/j.gastro.2021.08.050
6. Pugh RN, et al. *Br J Surg*. 1973;60(8):646-649. DOI: 10.1002/bjs.1800600817
7. Child CG, Turcotte JG. In: *The liver and portal hypertension*. 1964:50-64.

### Liver Enzyme References

8. Kwo PY, Cohen SM, Lim JK. ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries. *Am J Gastroenterol*. 2017;112(1):18-35. DOI: 10.1038/ajg.2016.517
9. Giannini EG, Testa R, Savarino V. Liver enzyme alteration: a guide for clinicians. *CMAJ*. 2005;172(3):367-379. DOI: 10.1503/cmaj.1040752

### FibroScan References

10. Castera L, Forns X, Alberti A. Non-invasive evaluation of liver fibrosis using transient elastography. *J Hepatol*. 2008;48(5):835-847. DOI: 10.1016/j.jhep.2008.02.008
11. Sasso M, et al. Controlled attenuation parameter (CAP). *Ultrasound Med Biol*. 2010;36(11):1825-1835. DOI: 10.1016/j.ultrasmedbio.2010.07.005
12. EASL-ALEH Clinical Practice Guidelines. *J Hepatol*. 2015;63(1):237-264. DOI: 10.1016/j.jhep.2015.04.006

### Platform References

13. LiverTracker. https://livertracker.com. DOI: 10.5281/zenodo.18934364

---

## Appendix B: Model Recommendation for Cursor

### Which AI Model to Use in Cursor

**Use Claude Opus 4.6 for**:
- Initial project setup and folder structure
- The entire calculation engine (all 6 scoring/interpretation systems)
- Complex UI components (ScoreRing, FibrosisScale, TrafficLightGrid, InjuryPatternCard)
- The REST API endpoint handlers
- The MCP server protocol implementation
- Test suite generation from validation CSVs
- Any architectural decisions or multi-file reasoning

**Use Claude Sonnet 4.6 for**:
- Styling adjustments (colors, spacing, fonts)
- Adding similar components after patterns are established
- Writing additional test cases
- Documentation and README content
- Small bug fixes, refactors, and iteration
- Generating the OpenAPI spec from existing endpoints

**Workflow**:
1. Start each phase with Opus 4.6 to set up architecture and core logic
2. Switch to Sonnet 4.6 for iteration, polish, and repetitive tasks
3. Switch back to Opus for new complex features or when stuck

---

*This context document is version 2.0. Update as decisions are made and phases are completed.*
