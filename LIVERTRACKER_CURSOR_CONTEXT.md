# LiverTracker MELD & Child-Pugh — Complete Project Context

> **Purpose of this document**: This is the master context file for building the LiverTracker clinical scoring application. Feed this entire document into Cursor as project context. All code generation, architecture decisions, and implementation details should follow this specification.

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

A medical-grade iOS application for calculating liver disease severity scores, branded under **LiverTracker** (https://livertracker.com). The app is part of a broader ecosystem that includes:

- A native iOS app (Phase 1)
- A standalone npm package for JavaScript/TypeScript developers (Phase 1)
- A hosted REST API on a subdomain of livertracker.com (Phase 2)
- A Python package on PyPI (Phase 3)
- An MCP (Model Context Protocol) server for AI-native workflows (Phase 4)
- An R package on CRAN (Phase 5)

### Scoring Systems Implemented

1. **MELD** (Model for End-Stage Liver Disease) — original formula
2. **MELD-Na** — incorporates serum sodium
3. **MELD 3.0** — 2022 update with albumin, sex, and interaction terms (adopted by OPTN in 2023)
4. **Child-Pugh Score** — point-based classification (Class A/B/C)

### Key Stakeholders

- **Dr. Jyotsna Priyam** — Clinical lead, hepatologist, creator of the tool. Must be credited in-app, in the API responses, in package metadata, and in all academic outputs.
- **LiverTracker** (livertracker.com) — Parent brand. The app is a standalone tool within the LiverTracker ecosystem.

### Core Principles

- All calculations happen **on-device** (no network calls for scoring)
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
  Usage:                  Primary action buttons ONLY ("Calculate MELD", "Calculate Child-Pugh")
                          Also used on active segment of tab controls
                          NEVER as a background fill on cards or screens

Semantic Result Colors:
  Normal/Low Risk:        #10B981 (green)
  Moderate Risk:          #F59E0B (amber)
  Severe/High Risk:       #EF4444 (red)
  Critical:               #991B1B (deep red, for MELD > 30 or Child-Pugh Class C)

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
- **NO animations beyond standard iOS transitions** — exception: the score ring fill animation on results (800ms ease-out)
- **NO rounded-everything bubbly aesthetic** — this is a clinical tool
- Cards should feel like elevated surfaces on a light background, similar to the web tool cards
- Input fields should have visible borders (not just underlines) with clear focus states
- Required field indicators use red asterisk (*) matching the web calculator

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
│   ├── types.ts                 # All TypeScript interfaces
│   └── constants.ts             # Thresholds, ranges, clinical data
├── __tests__/
│   ├── meld.test.ts
│   ├── meldNa.test.ts
│   ├── meld3.test.ts
│   └── childPugh.test.ts
├── validation/
│   ├── meld-cases.csv
│   ├── meld-na-cases.csv
│   ├── meld3-cases.csv
│   └── child-pugh-cases.csv
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

// ---- Input Types ----

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

export interface ChildPughInput {
  bilirubin: number;      // mg/dL
  albumin: number;        // g/dL
  inr: number;            // (or PT seconds — we use INR)
  ascites: 'none' | 'mild' | 'moderate_severe';
  encephalopathy: 'none' | 'grade_1_2' | 'grade_3_4';
}

// ---- Output Types ----

export interface ComponentContribution {
  name: string;           // e.g., "Serum Bilirubin"
  inputValue: number;     // raw value entered by user
  clampedValue: number;   // value after clamping (if applicable)
  unit: string;           // e.g., "mg/dL"
  normalRange: string;    // e.g., "0.1–1.2 mg/dL"
  status: 'normal' | 'mildly_elevated' | 'elevated' | 'critical';
  contribution: number;   // relative contribution to total score (0-1)
  points?: number;        // for Child-Pugh: 1, 2, or 3
}

export interface ClinicalContext {
  severityLabel: string;          // "Minimal", "Moderate", "Severe", "Very Severe"
  severityColor: string;          // hex color for UI rendering
  threeMonthMortality?: string;   // "~6-20%" (MELD only)
  oneYearSurvival?: string;       // "65-80%" (Child-Pugh only)
  twoYearSurvival?: string;       // "60-70%" (Child-Pugh only)
  transplantImplication: string;  // plain language text
  clinicalNote: string;           // additional context
}

export interface ScoringReference {
  formulaName: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  pmid?: string;
}

export interface MeldResult {
  score: number;                          // rounded integer 6-40
  rawScore: number;                       // unrounded calculation
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  formula: 'MELD' | 'MELD-Na' | 'MELD 3.0';
  calculatedAt: string;                   // ISO timestamp
  citationInfo: {
    package: string;                      // "@livertracker/clinical-scores"
    version: string;
    doi: string;                          // Zenodo DOI
    suggestedCitation: string;
  };
}

export interface ChildPughResult {
  score: number;                          // 5-15
  classification: 'A' | 'B' | 'C';
  classificationLabel: string;            // "Class A — Compensated"
  components: ComponentContribution[];
  clinicalContext: ClinicalContext;
  references: ScoringReference[];
  calculatedAt: string;
  citationInfo: {
    package: string;
    version: string;
    doi: string;
    suggestedCitation: string;
  };
}

// ---- Composite Output (when all inputs provided) ----

export interface AllScoresResult {
  meld: MeldResult;
  meldNa: MeldResult | null;             // null if sodium not provided
  meld3: MeldResult | null;              // null if sodium/albumin/sex not provided
  childPugh: ChildPughResult | null;     // null if clinical inputs not provided
}
```

#### Calculation Function Signatures

```typescript
// Each function validates inputs, clamps values, calculates, and returns rich result

export function calculateMeld(input: MeldInput): MeldResult;
export function calculateMeldNa(input: MeldNaInput): MeldResult;
export function calculateMeld3(input: Meld3Input): MeldResult;
export function calculateChildPugh(input: ChildPughInput): ChildPughResult;

// Convenience: calculates all applicable scores from combined inputs
export function calculateAllScores(input: Partial<Meld3Input & ChildPughInput>): AllScoresResult;
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
│   │   ├── meld.tsx              # MELD calculator (with tab for MELD/Na/3.0)
│   │   └── child-pugh.tsx        # Child-Pugh calculator
│   ├── results/
│   │   ├── meld-result.tsx       # MELD results display
│   │   └── child-pugh-result.tsx # Child-Pugh results display
│   └── about.tsx                 # About/References/Citations
├── components/
│   ├── ui/
│   │   ├── GradientButton.tsx
│   │   ├── OutlineButton.tsx
│   │   ├── CalculatorInput.tsx   # Text input with validation, normal range, status dot
│   │   ├── SegmentedControl.tsx  # MELD/MELD-Na/MELD 3.0 switcher
│   │   ├── SelectDropdown.tsx    # For ascites, encephalopathy, sex
│   │   ├── Checkbox.tsx          # For dialysis toggle
│   │   └── InfoTooltip.tsx       # ⓘ icon that opens bottom sheet
│   ├── results/
│   │   ├── ScoreRing.tsx         # Circular gauge visualization (hero element)
│   │   ├── SeverityBanner.tsx    # Colored interpretation banner
│   │   ├── ScoreComparison.tsx   # Side-by-side MELD/Na/3.0 comparison strip
│   │   ├── ComponentBreakdown.tsx # Horizontal bars showing each lab contribution
│   │   ├── ClinicalContext.tsx   # Mortality/survival stat cards
│   │   ├── ActionFooter.tsx      # "Track on LiverTracker" + "Share with Doctor"
│   │   └── CitationFooter.tsx    # References + disclaimer + attribution
│   └── home/
│       ├── CalculatorCard.tsx    # Tappable card on home screen
│       └── BrandFooter.tsx       # "Made by Dr. Jyotsna Priyam"
├── utils/
│   ├── haptics.ts                # Light/medium haptic feedback wrappers
│   └── share.ts                  # iOS share sheet for results
├── constants/
│   ├── colors.ts                 # All colors from design system
│   ├── typography.ts             # Font size/weight constants
│   └── spacing.ts               # Spacing scale
├── hooks/
│   └── useFirstLaunch.ts         # AsyncStorage check for disclaimer
├── assets/
│   └── images/
│       └── logo.png              # LiverTracker logo
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
- **Database**: Not required for V1. Neon Postgres available if we later add API key management or usage analytics.

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
│   │   ├── scoring-systems.ts    # GET — list all available scoring systems + metadata
│   │   └── health.ts             # GET — health check
│   └── docs/
│       └── index.ts              # Serves OpenAPI/Swagger UI
├── lib/
│   └── response.ts               # Standard response envelope wrapper
├── openapi/
│   └── spec.yaml                 # OpenAPI 3.0 specification
├── package.json                  # depends on @livertracker/clinical-scores
├── vercel.json
├── tsconfig.json
├── LICENSE
├── README.md
└── CITATION.cff
```

### API Design

#### Base URL
```
https://api.livertracker.com/v1
```

#### Endpoints

**POST `/v1/calculate`** — Universal endpoint (recommended)

Request body:
```json
{
  "bilirubin": 3.2,
  "creatinine": 1.8,
  "inr": 1.5,
  "sodium": 131,
  "albumin": 2.8,
  "sex": "female",
  "onDialysis": false,
  "ascites": "mild",
  "encephalopathy": "none"
}
```

Response: Returns ALL applicable scores based on which fields are provided.
- bilirubin + creatinine + inr → MELD score included
- + sodium → MELD-Na score included
- + albumin + sex → MELD 3.0 score included
- + ascites + encephalopathy → Child-Pugh score included

Every response includes:
```json
{
  "success": true,
  "data": {
    "meld": { /* full MeldResult */ },
    "meldNa": { /* full MeldResult or null */ },
    "meld3": { /* full MeldResult or null */ },
    "childPugh": { /* full ChildPughResult or null */ }
  },
  "meta": {
    "apiVersion": "1.0.0",
    "calculationEngine": "@livertracker/clinical-scores@1.0.0",
    "timestamp": "2026-03-30T12:00:00Z",
    "citation": {
      "doi": "10.5281/zenodo.XXXXXXX",
      "suggestedCitation": "Priyam J. LiverTracker Clinical Scoring API (v1.0). 2026. DOI: 10.5281/zenodo.XXXXXXX",
      "bibtex": "@software{livertracker2026, author={Priyam, Jyotsna}, title={LiverTracker Clinical Scoring API}, year={2026}, doi={10.5281/zenodo.XXXXXXX}}"
    }
  }
}
```

**POST `/v1/meld`** — MELD only
**POST `/v1/meld-na`** — MELD-Na only
**POST `/v1/meld3`** — MELD 3.0 only
**POST `/v1/child-pugh`** — Child-Pugh only

Each accepts only the fields relevant to that scoring system.

**GET `/v1/scoring-systems`** — Returns metadata about all available scoring systems

```json
{
  "systems": [
    {
      "id": "meld",
      "name": "MELD",
      "fullName": "Model for End-Stage Liver Disease",
      "requiredInputs": ["bilirubin", "creatinine", "inr", "onDialysis"],
      "optionalInputs": [],
      "scoreRange": { "min": 6, "max": 40 },
      "reference": {
        "authors": "Kamath PS, Wiesner RH, Malinchoc M, et al.",
        "title": "A model to predict survival in patients with end-stage liver disease",
        "journal": "Hepatology",
        "year": 2001,
        "doi": "10.1053/jhep.2001.22172"
      },
      "endpoint": "/v1/meld"
    }
    // ... other systems
  ]
}
```

**GET `/v1/health`** — Simple health check
```json
{ "status": "ok", "version": "1.0.0" }
```

### API Versioning Strategy

- All endpoints are versioned under `/v1/`
- Future breaking changes go to `/v2/`
- Old versions are maintained for minimum 5 years
- Deprecated versions return results with a `deprecation` field in the meta object

### Rate Limiting

- Unauthenticated: 1000 requests/day per IP
- With free API key (future): 10,000 requests/day
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### CORS

Open CORS — any origin allowed. This is a public, free API.

### Error Responses

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Serum bilirubin must be a positive number",
    "field": "bilirubin"
  }
}
```

Error codes: `INVALID_INPUT`, `MISSING_REQUIRED_FIELD`, `RATE_LIMITED`, `INTERNAL_ERROR`

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
│       ├── types.py              # dataclasses mirroring TS interfaces
│       └── constants.py
├── tests/
│   ├── test_meld.py
│   ├── test_meld_na.py
│   ├── test_meld3.py
│   ├── test_child_pugh.py
│   └── validation_data/         # symlink or copy of same CSV files
│       ├── meld-cases.csv
│       ├── meld-na-cases.csv
│       ├── meld3-cases.csv
│       └── child-pugh-cases.csv
├── pyproject.toml
├── LICENSE
├── README.md
└── CITATION.cff
```

### Usage Example (this should be in README)

```python
from livertracker import calculate_meld, calculate_meld_na, calculate_meld3, calculate_child_pugh

# Simple MELD
result = calculate_meld(bilirubin=3.2, creatinine=1.8, inr=1.5, on_dialysis=False)
print(result.score)                    # 18
print(result.clinical_context.severity_label)  # "Moderate"
print(result.references[0].doi)        # "10.1053/jhep.2001.22172"

# Works with pandas DataFrames
import pandas as pd
df = pd.read_csv("patient_labs.csv")
df['meld_score'] = df.apply(
    lambda row: calculate_meld(
        bilirubin=row['bilirubin'],
        creatinine=row['creatinine'],
        inr=row['inr'],
        on_dialysis=row['on_dialysis']
    ).score,
    axis=1
)
```

### Key Requirements

- **Zero dependencies** — only Python stdlib (math module)
- Tested against same validation CSVs used by TypeScript implementation
- All functions return structured dataclass objects (not raw numbers)
- Every result object includes `references` and `citation_info` fields
- Python 3.9+ compatibility

---

## 7. Phase 4 — MCP Server

### What It Does

Exposes LiverTracker's clinical scoring as tools callable by any MCP-compatible AI assistant (Claude, etc.).

### Hosted At

`mcp.livertracker.com` (subdomain) OR as a path under the API: `api.livertracker.com/mcp`

### MCP Tools Exposed

```
Tool: calculate_meld
Description: Calculate MELD (Model for End-Stage Liver Disease) score for liver disease severity assessment.
Parameters:
  - bilirubin (number, required): Serum bilirubin in mg/dL
  - creatinine (number, required): Serum creatinine in mg/dL
  - inr (number, required): International Normalized Ratio
  - on_dialysis (boolean, optional, default false): Patient on dialysis ≥2 sessions/week

Tool: calculate_meld_na
Description: Calculate MELD-Na score, incorporating serum sodium for improved accuracy.
Parameters:
  - bilirubin, creatinine, inr, on_dialysis (same as above)
  - sodium (number, required): Serum sodium in mEq/L

Tool: calculate_meld3
Description: Calculate MELD 3.0 score (2022 update adopted by OPTN in 2023), incorporating albumin and sex.
Parameters:
  - bilirubin, creatinine, inr, on_dialysis, sodium (same as above)
  - albumin (number, required): Serum albumin in g/dL
  - sex (string, required): "male" or "female" (sex assigned at birth)

Tool: calculate_child_pugh
Description: Calculate Child-Pugh score for cirrhosis classification (Class A, B, or C).
Parameters:
  - bilirubin (number, required): Serum bilirubin in mg/dL
  - albumin (number, required): Serum albumin in g/dL
  - inr (number, required): International Normalized Ratio
  - ascites (string, required): "none", "mild", or "moderate_severe"
  - encephalopathy (string, required): "none", "grade_1_2", or "grade_3_4"

Tool: list_scoring_systems
Description: List all available clinical scoring systems with their descriptions, required inputs, and references.
Parameters: none
```

### Implementation

- Built in TypeScript using the MCP SDK
- Internally imports `@livertracker/clinical-scores` (same npm package)
- Each tool response includes the full structured result including clinical context, component breakdown, references, and citation info
- Self-hostable: hospitals can clone the repo and run it within their own infrastructure

---

## 8. Phase 5 — R Package (CRAN)

### Package Name: `livertracker`

### Structure

```
livertracker-r/
├── R/
│   ├── meld.R
│   ├── meld_na.R
│   ├── meld3.R
│   ├── child_pugh.R
│   └── constants.R
├── man/                          # Documentation (roxygen2-generated)
├── tests/
│   └── testthat/
│       ├── test-meld.R
│       ├── test-meld-na.R
│       ├── test-meld3.R
│       └── test-child-pugh.R
├── inst/
│   ├── validation/               # Same CSV test cases
│   └── CITATION                  # R's built-in citation mechanism
├── DESCRIPTION
├── NAMESPACE
├── LICENSE
└── README.md
```

### Key Requirements

- Uses `citation("livertracker")` to return proper citation
- All functions vectorized (work on single values and vectors/data.frames)
- Tested against same validation CSVs
- No dependencies beyond base R

---

## 9. Scoring System Formulas & Clinical Logic

### 9.1 MELD (Original)

**Reference**: Kamath PS, Wiesner RH, Malinchoc M, et al. A model to predict survival in patients with end-stage liver disease. Hepatology. 2001;33(2):464-470. DOI: 10.1053/jhep.2001.22172

**Additional Reference**: Kamath PS, Kim WR. The model for end-stage liver disease (MELD). Hepatology. 2007;45(3):797-805. DOI: 10.1002/hep.21563

**Value Clamping Rules (applied BEFORE calculation)**:
- Bilirubin: if < 1.0, set to 1.0
- Creatinine: if < 1.0, set to 1.0; if > 4.0, set to 4.0
- INR: if < 1.0, set to 1.0
- If patient is on dialysis (≥2 sessions/week in the past 7 days): set creatinine to 4.0

**Formula**:
```
MELD = 10 × (
  0.957 × ln(Creatinine) +
  0.378 × ln(Bilirubin) +
  1.120 × ln(INR) +
  0.643
)
```

**Post-calculation**: Round to nearest integer. If result < 6, set to 6. If result > 40, set to 40.

**Score Interpretation**:
| Score Range | Severity         | 3-Month Mortality | Color   |
|-------------|------------------|-------------------|---------|
| 6–9         | Minimal          | ~1.9%             | #10B981 |
| 10–19       | Moderate         | ~6.0%             | #F59E0B |
| 20–29       | Severe           | ~19.6%            | #EF4444 |
| 30–40       | Very Severe      | ~52.6%            | #991B1B |

**Transplant Context**:
- MELD ≥ 15: Transplant evaluation typically initiated
- MELD ≥ 20: Generally listed for transplant
- MELD ≥ 30: High urgency; significant near-term mortality risk
- MELD ≥ 35: Very high urgency

### 9.2 MELD-Na

**Reference**: Kim WR, Biggins SW, Kremers WK, et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. N Engl J Med. 2008;359(10):1018-1026. DOI: 10.1056/NEJMoa0801209

**Additional Reference**: Biggins SW, Kim WR, Terrault NA, et al. Evidence-based incorporation of serum sodium concentration into MELD. Gastroenterology. 2006;130(6):1652-1660. DOI: 10.1053/j.gastro.2006.02.010

**Value Clamping** (same as MELD for bilirubin, creatinine, INR, plus):
- Sodium: if < 125, set to 125; if > 137, set to 137

**Formula**:
```
First calculate standard MELD score (see 9.1 above), call it MELD(i)

MELD-Na = MELD(i) + 1.32 × (137 - Sodium) - (0.033 × MELD(i) × (137 - Sodium))
```

**Post-calculation**: Round to nearest integer. Bounded 6–40.

**Score Interpretation**: Same ranges as MELD but typically 2-5 points higher for hyponatremic patients. Use same color/severity mapping as MELD table.

### 9.3 MELD 3.0

**Reference**: Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. Gastroenterology. 2021;161(6):1887-1895.e4. DOI: 10.1053/j.gastro.2021.08.050

**Note**: Adopted by OPTN for liver transplant allocation in the United States beginning in 2023.

**Value Clamping**:
- Bilirubin: if < 1.0, set to 1.0
- Creatinine: if < 1.0, set to 1.0; if > 3.0, set to 3.0 (NOTE: cap is 3.0 for MELD 3.0, different from original MELD's 4.0)
- INR: if < 1.0, set to 1.0
- Sodium: if < 125, set to 125; if > 137, set to 137
- Albumin: if < 1.5, set to 1.5; if > 3.5, set to 3.5
- If on dialysis: set creatinine to 3.0

**Formula**:
```
For FEMALE patients:
MELD 3.0 = 10 × (
  1.33 × ln(Creatinine) +
  0.24 × ln(Bilirubin) +
  0.94 × ln(INR) -
  0.66 × ln(Sodium) +
  1.72 × ln(max(Albumin, 1.5)) +  // note: already clamped above
  0.0376 × (137 - Sodium) × ln(Albumin) +
  0.0300 × ln(Creatinine) × ln(Bilirubin) +
  1.3258
)

For MALE patients:
MELD 3.0 = 10 × (
  1.33 × ln(Creatinine) +
  0.24 × ln(Bilirubin) +
  0.94 × ln(INR) -
  0.66 × ln(Sodium) +
  1.72 × ln(max(Albumin, 1.5)) +
  0.0376 × (137 - Sodium) × ln(Albumin) +
  0.0300 × ln(Creatinine) × ln(Bilirubin) +
  0.7353
)
```

The difference between male and female is the constant term: 1.3258 for female vs 0.7353 for male. This results in approximately a 1.33-point increase for female patients, addressing the documented sex-based disparity in transplant access.

**Post-calculation**: Round to nearest integer. Bounded 6–40.

**Score Interpretation**: Same ranges and color coding as MELD.

### 9.4 Child-Pugh Score

**Reference**: Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649. DOI: 10.1002/bjs.1800600817

**Historical Reference**: Child CG, Turcotte JG. Surgery and portal hypertension. In: The liver and portal hypertension. Philadelphia: WB Saunders Co; 1964:50-64.

**Point Scoring Table**:

| Component          | 1 Point          | 2 Points        | 3 Points         |
|--------------------|------------------|-----------------|------------------|
| Bilirubin (mg/dL)  | < 2              | 2–3             | > 3              |
| Albumin (g/dL)     | > 3.5            | 2.8–3.5         | < 2.8            |
| INR                | < 1.7            | 1.7–2.3         | > 2.3            |
| Ascites            | None             | Mild            | Moderate–Severe  |
| Encephalopathy     | None             | Grade 1–2       | Grade 3–4        |

**Classification**:

| Total Score | Class | Label                      | 1-Year Survival | 2-Year Survival | Color   |
|-------------|-------|----------------------------|-----------------|-----------------|---------|
| 5–6         | A     | Compensated                | ~100%           | ~85%            | #10B981 |
| 7–9         | B     | Significant Compromise     | ~80%            | ~60%            | #F59E0B |
| 10–15       | C     | Decompensated              | ~45%            | ~35%            | #EF4444 |

**Perioperative Mortality (for surgical risk context)**:
- Class A: ~10%
- Class B: ~30%
- Class C: ~70–80%

---

## 10. Validation Dataset Specification

### Purpose

A curated set of test cases for each scoring system. Used for:
1. Automated unit testing (all implementations must pass 100%)
2. Cross-validation against MDCalc and OPTN reference
3. Published as supplementary data with the journal paper
4. Available in the repo for other researchers to use (and cite)

### CSV Format

**meld-cases.csv**:
```csv
case_id,bilirubin,creatinine,inr,on_dialysis,expected_score,source
M001,1.2,0.9,1.1,false,7,"Kamath 2001 reference"
M002,3.5,1.8,1.5,false,18,"MDCalc cross-validation"
M003,0.5,0.6,0.8,false,6,"Below-minimum clamping test"
M004,2.0,4.5,2.0,true,30,"Dialysis patient — creatinine capped at 4.0"
```

**meld-na-cases.csv**:
```csv
case_id,bilirubin,creatinine,inr,on_dialysis,sodium,expected_score,source
MN001,3.5,1.8,1.5,false,131,22,"Kim 2008 reference"
MN002,1.2,0.9,1.1,false,140,7,"Sodium above cap (137), minimal effect"
MN003,5.0,2.5,2.0,false,120,35,"Sodium below floor (125), clamped"
```

**meld3-cases.csv**:
```csv
case_id,bilirubin,creatinine,inr,on_dialysis,sodium,albumin,sex,expected_score,source
M3001,3.5,1.8,1.5,false,131,2.8,female,24,"Kim 2021 reference"
M3002,3.5,1.8,1.5,false,131,2.8,male,23,"Same labs, male — ~1pt lower"
M3003,1.0,1.0,1.0,false,137,3.5,female,10,"Minimum values, female"
```

**child-pugh-cases.csv**:
```csv
case_id,bilirubin,albumin,inr,ascites,encephalopathy,expected_score,expected_class,source
CP001,1.5,3.8,1.2,none,none,5,A,"All 1-point values"
CP002,2.5,3.0,2.0,mild,grade_1_2,10,C,"All 2-point values"
CP003,4.0,2.5,2.5,moderate_severe,grade_3_4,15,C,"All 3-point values"
```

### Minimum Cases Per Scoring System

- MELD: 30 cases (including edge cases: all-minimum, all-maximum, dialysis, below-clamp values)
- MELD-Na: 25 cases (including sodium boundary cases)
- MELD 3.0: 25 cases (including male/female pairs with identical labs)
- Child-Pugh: 20 cases (including all Class A, B, C boundaries)

### Cross-Validation Procedure

1. For each case, manually calculate the expected score using the formula by hand
2. Verify against MDCalc (https://www.mdcalc.com/calc/78/meld-score-model-end-stage-liver-disease-12-older) for MELD/MELD-Na
3. Verify MELD 3.0 against OPTN calculator if available
4. Document any discrepancies and their reasons (usually rounding differences)

---

## 11. Apple App Store Compliance

### Required: Medical Disclaimer

**MUST appear on first launch as a modal that requires user acknowledgment (tap "I Understand" to proceed).**

Text:
```
MEDICAL DISCLAIMER

This application is designed for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.

• MELD and Child-Pugh scores calculated by this app are approximations based on published formulas and should NOT be used for official transplant listing decisions.

• Official MELD scores for transplant allocation are calculated by UNOS/OPTN using verified laboratory values.

• Always consult your hepatologist, transplant team, or qualified healthcare provider for clinical decisions.

• Do not disregard professional medical advice or delay seeking treatment because of information provided by this app.

This tool was developed by Dr. Jyotsna Priyam and is part of the LiverTracker platform (livertracker.com).
```

This disclaimer must also be accessible from the About screen at all times.

### Required: Privacy Policy

- Host at `livertracker.com/privacy` (already exists on the site)
- The app collects NO data — no analytics, no crash reporting, no network calls
- In App Store Connect, select "Data Not Collected" for ALL categories in the privacy questionnaire
- Link to the privacy policy in app.json under `expo.ios.infoPlist` and in App Store Connect

### Required: App Store Metadata

- **Category**: Medical (primary), Health & Fitness (secondary)
- **Age Rating**: 12+ (medical/treatment information)
- **Content Description**: "Medical/Treatment Information" = Yes
- **App Review Notes**: Include a note explaining that the app is a clinical reference calculator that performs all calculations on-device, collects no user data, and is developed under the guidance of a board-certified hepatologist (Dr. Jyotsna Priyam). This preempts common review questions.

### Required: No Diagnosis Claims

In ALL text (App Store description, in-app text, marketing):
- DO NOT use: "diagnose", "treat", "cure", "prescribe"
- DO use: "clinical decision support", "reference tool", "educational calculator", "informational"
- Frame as: "helps you understand your lab values" not "tells you if you have liver disease"

### Required: Minimum Functionality (Guideline 4.2)

The app must not feel like "a simple calculator that could be a website." To satisfy this:
- Two full calculator systems (MELD family + Child-Pugh) ✓
- Rich result presentation with clinical context ✓
- Educational tooltips explaining each lab value ✓
- Component breakdown showing score drivers ✓
- Side-by-side MELD variant comparison ✓
- References and citations ✓
- Share functionality (iOS share sheet) ✓
- About/educational content about when each score is used ✓

### Required: Proper Attribution

- Dr. Jyotsna Priyam credited as developer/clinical lead
- In App Store Connect, the developer account should be under Dr. Priyam's name or the LiverTracker organization
- Include credentials (MD, DM/DNB qualification) in the About screen

---

## 12. Citation & Academic Infrastructure

### CITATION.cff (root of every repo)

```yaml
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
title: "LiverTracker Clinical Scores"
abstract: >-
  An open-source, validated implementation of MELD, MELD-Na, MELD 3.0,
  and Child-Pugh liver disease severity scoring systems. Available as an
  iOS application, npm package, REST API, Python package, MCP server,
  and R package.
authors:
  - family-names: "Priyam"
    given-names: "Jyotsna"
    orcid: "https://orcid.org/XXXX-XXXX-XXXX-XXXX"  # Fill in Dr. Priyam's ORCID
license: MIT
repository-code: "https://github.com/livertracker/clinical-scores"
url: "https://livertracker.com"
doi: "10.5281/zenodo.XXXXXXX"  # Will be auto-generated
version: "1.0.0"
date-released: "2026-XX-XX"
keywords:
  - meld-score
  - child-pugh
  - liver-disease
  - hepatology
  - clinical-calculator
  - transplant
  - meld-3
  - open-source
  - react-native
  - medical
preferred-citation:
  type: article
  authors:
    - family-names: "Priyam"
      given-names: "Jyotsna"
  title: "LiverTracker MELD & Child-Pugh: An Open-Source, Validated Mobile Application for Liver Disease Severity Scoring"
  journal: "JMIR mHealth and uHealth"  # Update once published
  year: 2026
  doi: "10.2196/XXXXX"  # Update once published
```

### GitHub Repository Metadata

**Topics** (set in GitHub repo settings):
```
meld-score, child-pugh, liver-disease, hepatology, clinical-calculator,
transplant, react-native, expo, open-source, medical, meld-3, clinical-decision-support,
mhealth, digital-health
```

**Description**:
```
Open-source, validated MELD, MELD-Na, MELD 3.0, and Child-Pugh liver disease severity scoring. iOS app, npm package, REST API, Python/R libraries, and MCP server.
```

### Zenodo Integration

1. Connect the GitHub repo to Zenodo (https://zenodo.org/account/settings/github/)
2. Enable automatic DOI minting for each GitHub release
3. Each release tag (v1.0.0, v1.1.0, etc.) automatically gets a versioned DOI
4. The "concept DOI" always resolves to the latest version

### Academic Registrations

- **bio.tools**: Register the tool for scientific software discoverability
- **RRID (Research Resource Identifier)**: Apply for an RRID so journals can reference it in methods sections
- **OpenAIRE**: Automatically indexed via Zenodo
- **Google Scholar**: Indexed via the preprint and journal paper

### Target Journals for Tool Paper

1. **JMIR mHealth and uHealth** (primary target) — mobile health tools, good fit
2. **SoftwareX** (Elsevier) — specifically for research software, short format
3. **BMJ Open** — frame as improving transplant evaluation accessibility
4. **JAMIA** — clinical decision support tools, higher impact

### Conference Posters/Abstracts

- **AASLD The Liver Meeting** — "Clinical Tools and Technology" category
- **EASL International Liver Congress** — European audience
- **APASL** — Asian-Pacific audience
- **INASL** — Indian national audience

---

## 13. GitHub Repository Structure

### Monorepo vs Multi-Repo Decision

**Use a monorepo** for Phase 1 (app + npm package) to keep the calculation engine and app in sync. The API (Phase 2), Python package (Phase 3), MCP server (Phase 4), and R package (Phase 5) each get their own repo because they have different deployment targets and CI pipelines.

### Primary Repo: `livertracker/clinical-scores`

```
livertracker-clinical-scores/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── new_scoring_system.md     # Template for community contributions
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── ci.yml                    # Lint, type-check, test on every PR
│       ├── release.yml               # Publish npm + trigger Zenodo DOI on tag
│       └── validate.yml              # Run validation dataset tests
├── packages/
│   └── clinical-scores/             # The npm package (see Phase 1 structure)
├── apps/
│   └── mobile/                      # The Expo iOS app (see Phase 1 structure)
├── validation/
│   ├── README.md                    # Methodology documentation
│   ├── test-cases/
│   │   ├── meld-cases.csv
│   │   ├── meld-na-cases.csv
│   │   ├── meld3-cases.csv
│   │   └── child-pugh-cases.csv
│   └── concordance-report.md
├── docs/
│   ├── FORMULAS.md                  # Complete mathematical formulas with LaTeX
│   ├── CLINICAL_CONTEXT.md          # Score interpretation guide
│   ├── ARCHITECTURE.md              # System design overview
│   └── SCREENSHOTS.md               # App screenshots
├── CITATION.cff
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE                          # MIT
├── README.md                        # The main README (see specification below)
└── package.json                     # Workspace root (npm/yarn workspaces)
```

### README.md Specification

The README must follow this exact order:

1. **Logo + Title**: LiverTracker logo, app name, one-line description
2. **How to Cite** (BEFORE anything else — this is critical):
   - BibTeX entry
   - APA formatted citation
   - Zenodo DOI badge
   - "Cite this repository" note pointing to CITATION.cff
3. **Badges**: Build status, npm version, license, Zenodo DOI, App Store link, "contributions welcome"
4. **Screenshots**: 3 images — home screen, calculator, results page
5. **Scoring Systems**: Table listing all 4 with one-line descriptions and original paper references
6. **Installation & Usage** (npm package):
   ```
   npm install @livertracker/clinical-scores
   ```
   With a quick code example
7. **Running the iOS App**: Clone, install, expo start
8. **API**: Brief description + link to api.livertracker.com/docs
9. **Python Package**: `pip install livertracker` + quick example
10. **R Package**: `install.packages("livertracker")` + quick example
11. **Validation**: Brief note + link to validation/ directory
12. **Contributing**: Link to CONTRIBUTING.md
13. **License**: MIT
14. **Attribution**: "Created by Dr. Jyotsna Priyam · livertracker.com"

### CONTRIBUTING.md Specification

Structure to invite three contribution types:

1. **New Scoring Systems**: Provide a template (create function in packages/clinical-scores/src/, add test cases to validation/, document formula in docs/FORMULAS.md). Suggested additions: FIB-4, APRI, SAAG, NFS, Lille Score, Maddrey's Discriminant Function.
2. **Translations/Localizations**: Explain string management, how to add a new language.
3. **Validation Data**: Invite clinicians to contribute anonymized test cases. Specify the CSV format. Explain the verification process.
4. **Credit**: Contributors are listed in CHANGELOG, README acknowledgments, and may be invited as co-authors on future papers for substantial contributions.

---

## 14. UI/UX Specification — Forms

### MELD Calculator Screen

**Header**: "MELD Score Calculator" as screen title in navigation bar.

**Segmented Control**: Directly below the header. Three segments: "MELD" | "MELD-Na" | "MELD 3.0". Active segment has brand gradient background with white text. Inactive segments have transparent background with grey text. Pill-shaped with 8px border radius. Switching tabs should smoothly animate additional fields in/out.

**Form Fields (always visible)**:

1. **Serum Bilirubin (mg/dL)** *
   - Placeholder: "e.g. 1.2"
   - Helper text: "Normal range: 0.1–1.2 mg/dL"
   - Keyboard type: decimal-pad
   - Validation: must be > 0

2. **Serum Creatinine (mg/dL)** *
   - Placeholder: "e.g. 0.9"
   - Helper text: "Normal range: 0.6–1.2 mg/dL"
   - Keyboard type: decimal-pad
   - Validation: must be > 0

3. **INR** *
   - Placeholder: "e.g. 1.1"
   - Helper text: "Normal range: 0.8–1.2"
   - Keyboard type: decimal-pad
   - Validation: must be > 0

**Conditional Fields (MELD-Na tab — animate slide-down)**:

4. **Serum Sodium (mEq/L)**
   - Placeholder: "e.g. 138"
   - Helper text: "Normal range: 135–145 mEq/L"
   - Keyboard type: decimal-pad

**Conditional Fields (MELD 3.0 tab — animate slide-down)**:

4. **Serum Sodium (mEq/L)** (same as above)

5. **Serum Albumin (g/dL)**
   - Placeholder: "e.g. 3.5"
   - Helper text: "Normal range: 3.5–5.0 g/dL"
   - Keyboard type: decimal-pad

6. **Sex** (dropdown/picker)
   - Options: "Male", "Female"
   - Label clarification: "Sex assigned at birth"

**Always visible**:

7. **On dialysis (≥2 sessions/week)** — Checkbox/toggle

**Real-Time Input Status Indicator**:
Each input field shows a small colored dot (8px circle) on the right side inside the input:
- No value entered: no dot shown
- Value within normal range: green dot (#10B981)
- Value mildly abnormal: amber dot (#F59E0B)
- Value significantly abnormal: red dot (#EF4444)

This gives immediate visual feedback BEFORE the user hits Calculate.

**Action Buttons**:
- "Calculate MELD" — full-width, brand gradient, white bold text, 52px height
- "Reset" — outline style, right-aligned or beside the primary button, grey border, grey text

### Child-Pugh Calculator Screen

**Header**: "Child-Pugh Score Calculator"

**Form Fields**:

1. **Serum Bilirubin (mg/dL)** *
   - Helper text: "<2 = 1pt · 2–3 = 2pts · >3 = 3pts"

2. **Serum Albumin (g/dL)** *
   - Helper text: ">3.5 = 1pt · 2.8–3.5 = 2pts · <2.8 = 3pts"

3. **INR** *
   - Helper text: "<1.7 = 1pt · 1.7–2.3 = 2pts · >2.3 = 3pts"

4. **Ascites (fluid in abdomen)** — Dropdown
   - Options: "None (1 point)", "Mild (2 points)", "Moderate–Severe (3 points)"

5. **Hepatic Encephalopathy** — Dropdown
   - Options: "None (1 point)", "Grade 1–2 (2 points)", "Grade 3–4 (3 points)"

**Action Buttons**: Same pattern — "Calculate Child-Pugh" gradient button + "Reset" outline button.

---

## 15. UI/UX Specification — Results Page

The results page is the most important screen in the app. It should present a layered information hierarchy where each section adds depth. A rushed clinician reads layers 1–2. A concerned patient reads through layer 5. A careful doctor checks layer 7.

### Results Presentation: MELD

The results should appear as a **modal sliding up from the bottom** (full-screen modal presentation), with the score ring animating from 0 to the calculated value over ~800ms with an ease-out curve.

**Layer 1 — Score Ring (Hero Element)**

A large circular arc/gauge, centered at the top of the results screen.
- Arc spans from 6 (left) to 40 (right)
- The filled portion is color-graded: green at low end → amber in middle → red at high end
- The user's score is a large bold number (48pt) centered inside the ring
- Below the number: the formula name ("MELD-Na Score")
- Subtle tick marks or zone labels along the arc edge: "Minimal" | "Moderate" | "Severe" | "Critical"
- The arc fill animates from 0 to the score value on first render

**Layer 2 — Severity Banner**

A full-width card directly below the ring:
- Background color matches the severity (green/amber/red/deep-red)
- White text, bold, centered: "Moderate Liver Disease" (or appropriate label)
- Subtle rounded corners (8px), slight padding (12px vertical)

**Layer 3 — Score Comparison Strip (MELD only)**

A horizontal row of three compact score badges, showing all three MELD variants side by side:
- Each badge shows: formula name on top (small text), score number (bold, 24pt), small color indicator dot
- This appears ONLY when sufficient inputs were provided for multiple calculations
- If the user calculated from the MELD-Na tab but also provided albumin and sex, show all three
- If from the basic MELD tab, show only MELD (no comparison strip)
- Highlight the "active" formula with a subtle border or elevation

**Layer 4 — Component Breakdown Card**

Title: "Score Breakdown"

For each component (bilirubin, creatinine, INR, and sodium/albumin if applicable):
- Component name on the left
- Patient's value + unit in the middle
- A horizontal bar showing the relative contribution to the total score
- Bar color matches the component's status (normal=green, elevated=amber, critical=red)
- If a value was clamped (e.g., creatinine below 1.0 was set to 1.0), show a small note: "Adjusted from 0.8 to 1.0"

The purpose: the patient/clinician can see WHICH lab value is driving the score up. A MELD of 22 where creatinine is the dominant bar tells a different clinical story than one where bilirubin dominates.

**Layer 5 — Clinical Context Card**

Title: "What This Score Means"

Three stat cards in a horizontal row:
- Card 1: Large number "~20%" / label "3-Month Mortality"
- Card 2: Large text "MELD ≥ 15" / label "Transplant Evaluation Threshold"
- Card 3: Descriptive text / label "Clinical Significance"

Each card has a light background (slightly tinted with the severity color), rounded corners, and subtle shadow.

Below the stat cards, a brief paragraph of plain-language interpretation:
"A MELD-Na score of 22 indicates severe liver disease with an estimated 3-month mortality of approximately 20%. At this score level, transplant evaluation is typically recommended. Your creatinine and sodium levels are the primary contributors to this score."

An ⓘ icon next to any clinical term opens a bottom sheet with a plain-language explanation (see InfoTooltip component).

**Layer 6 — Action Footer**

Two buttons:
1. "Track This Score" — links to livertracker.com/auth/signup (opens in Safari/in-app browser). Text below: "Monitor changes over time with LiverTracker"
2. "Share with Doctor" — triggers iOS share sheet with a formatted text summary:

```
MELD Score Report — LiverTracker

MELD Score: 18
MELD-Na Score: 22
MELD 3.0 Score: 24

Lab Values:
• Serum Bilirubin: 3.2 mg/dL
• Serum Creatinine: 1.8 mg/dL
• INR: 1.5
• Serum Sodium: 131 mEq/L
• Serum Albumin: 2.8 g/dL
• Sex: Female
• On Dialysis: No

Interpretation: Severe liver disease. Transplant evaluation recommended.

Disclaimer: This score is calculated for educational purposes only and should not be used for official transplant listing. Consult your hepatologist.

Calculated by LiverTracker (livertracker.com)
Developed by Dr. Jyotsna Priyam
```

**Layer 7 — Citation & Disclaimer Footer**

- Formula references: Short form (e.g., "Kamath et al., Hepatology 2001")
- Medical disclaimer: One line — "For educational purposes only. Not for official transplant listing."
- Attribution: "Built by Dr. Jyotsna Priyam · LiverTracker.com"
- Each reference is tappable → opens the DOI URL in Safari

### Results Presentation: Child-Pugh

Same modal structure, adapted:

**Layer 1 — Score Ring**: Arc from 5 to 15 with three color bands (A=green, B=amber, C=red). Score number in center, Class letter below ("Class B").

**Layer 2 — Severity Banner**: Color-coded. "Class B — Significant Hepatic Compromise"

**Layer 3 — Point Breakdown** (instead of comparison strip): A table/list showing each of the 5 components with:
- Component name
- Patient's value
- Points assigned (1, 2, or 3)
- Small colored indicator for each
- A mini stacked horizontal bar at the top showing how the 5 components sum to total

**Layer 4 — Clinical Context**:
- Stat cards: "~80%" / "1-Year Survival" | "~60%" / "2-Year Survival" | "~30%" / "Perioperative Mortality"
- Plain language: "A Child-Pugh Class B score of 8 indicates significant hepatic compromise. Surgical risk is moderately elevated. Your albumin and ascites are the primary contributors."

**Layers 5–7**: Same as MELD (action footer, citation footer).

### Haptic Feedback

- Light tap (UIImpactFeedbackGenerator, light) when "Calculate" button is pressed
- Medium tap (UIImpactFeedbackGenerator, medium) when results appear
- Use `expo-haptics` for this

### Transition Animation

- Form → Results: Results slide up as a full-screen modal (React Navigation modal presentation)
- Score ring: Fill animation from 0 to score, 800ms, ease-out curve
- Component bars: Staggered animation, each bar expands from 0 to its width with 100ms delay between bars

---

## 16. Screens & Navigation

### Navigation Structure

```
Root Stack Navigator (native stack)
├── Home Screen (index)                    # Calculator cards + branding
├── MELD Calculator Screen                 # Form + segmented control
├── Child-Pugh Calculator Screen           # Form
├── MELD Results Screen (modal)            # Full results presentation
├── Child-Pugh Results Screen (modal)      # Full results presentation
├── About Screen                           # References, credits, links
└── Disclaimer Screen (modal, first launch)# Medical disclaimer
```

### Home Screen Layout

```
┌─────────────────────────────┐
│         [LiverTracker Logo] │
│   Track Your Liver.         │
│   Extend Your Life.         │
│                             │
│  ┌───────────────────────┐  │
│  │ 🧮  MELD Score        │  │
│  │ Calculator             │  │
│  │ Calculate MELD,        │  │
│  │ MELD-Na, and MELD 3.0 │  │
│  │ scores                 │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ 🫀  Child-Pugh Score  │  │
│  │ Calculator             │  │
│  │ Classify cirrhosis     │  │
│  │ severity (A, B, or C)  │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ℹ️  About & References │  │
│  │ Citations, formulas,   │  │
│  │ and methodology        │  │
│  └───────────────────────┘  │
│                             │
│  Made by Dr. Jyotsna Priyam│
│  livertracker.com           │
│                             │
│  For educational purposes   │
│  only. Not medical advice.  │
└─────────────────────────────┘
```

### About Screen Content

1. **About LiverTracker**: Brief description of the platform
2. **About This Tool**: What it calculates and why
3. **When to Use Each Score**:
   - MELD: Transplant prioritization, 3-month mortality prediction
   - MELD-Na: Improved accuracy when hyponatremia is present
   - MELD 3.0: Current OPTN standard (2023+), addresses sex-based disparity
   - Child-Pugh: Surgical risk assessment, cirrhosis classification
4. **Formulas**: Brief display of each formula (collapsible sections)
5. **References**: Full citation list, each with tappable DOI link
6. **Credits**: "Developed by Dr. Jyotsna Priyam" with credentials
7. **Open Source**: Link to GitHub repo, Zenodo DOI, "How to Cite" section
8. **Legal**: Links to Privacy Policy, Terms of Service, Medical Disclaimer on livertracker.com

---

## 17. Accessibility & Edge Cases

### Input Validation

- All required fields must be filled before Calculate is enabled
- Numeric inputs only — keyboard type `decimal-pad`
- Negative values: show inline error "Value must be positive"
- Zero values: show inline error "Value must be greater than zero"
- Extremely high values (e.g., bilirubin > 50): accept but show warning "This value seems unusually high. Please verify."
- Non-numeric input: prevent via keyboard type

### iOS Accessibility

- All inputs have proper `accessibilityLabel` values
- Score ring announces the score and severity via VoiceOver
- Color is never the ONLY indicator — always paired with text labels
- Minimum touch target: 44x44 points for all interactive elements
- Dynamic Type: support at least the default and two larger sizes

### Edge Cases in Calculations

- All lab values at minimum clamped values → should produce MELD 6
- All lab values at maximum → should produce MELD 40
- Dialysis patient → creatinine auto-set to 4.0 (MELD) or 3.0 (MELD 3.0)
- Sodium exactly at boundaries (125, 137) → no further clamping
- Very high sodium (e.g., 150) → clamped to 137, effectively no sodium penalty in MELD-Na

---

## 18. Deployment & Infrastructure

### Phase 1: iOS App

- Build with EAS Build (`eas build --platform ios`)
- Submit with EAS Submit (`eas submit --platform ios`)
- App Store Connect: configured under Dr. Priyam's developer account or LiverTracker organization
- Bundle ID: `com.livertracker.clinical-scores` (or similar)
- Test via TestFlight before public release

### Phase 1: npm Package

- Publish to npmjs.com under `@livertracker` scope
- Requires npm organization setup
- CI/CD: GitHub Action publishes on version tag

### Phase 2: REST API

- Vercel project connected to `livertracker-api` GitHub repo
- Custom domain: `api.livertracker.com` configured in Vercel dashboard
- Auto-deploy on push to main branch
- Environment: Node.js 20
- No environment variables needed (stateless, no secrets)
- If rate limiting with persistence is needed later: Vercel KV or Neon Postgres

### Phase 4: MCP Server

- Can be hosted on same Vercel project as the API (different route) or separate
- Endpoint: `api.livertracker.com/mcp` or `mcp.livertracker.com`

### DNS Configuration

Add these records to livertracker.com DNS:
```
api.livertracker.com  → CNAME → cname.vercel-dns.com
mcp.livertracker.com  → CNAME → cname.vercel-dns.com (if separate)
```

---

## Appendix A: Complete Reference List

### Scoring System References

1. Kamath PS, Wiesner RH, Malinchoc M, et al. A model to predict survival in patients with end-stage liver disease. *Hepatology*. 2001;33(2):464-470. DOI: 10.1053/jhep.2001.22172

2. Kamath PS, Kim WR. The model for end-stage liver disease (MELD). *Hepatology*. 2007;45(3):797-805. DOI: 10.1002/hep.21563

3. Kim WR, Biggins SW, Kremers WK, et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. *N Engl J Med*. 2008;359(10):1018-1026. DOI: 10.1056/NEJMoa0801209

4. Biggins SW, Kim WR, Terrault NA, et al. Evidence-based incorporation of serum sodium concentration into MELD. *Gastroenterology*. 2006;130(6):1652-1660. DOI: 10.1053/j.gastro.2006.02.010

5. Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. *Gastroenterology*. 2021;161(6):1887-1895.e4. DOI: 10.1053/j.gastro.2021.08.050

6. Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. *Br J Surg*. 1973;60(8):646-649. DOI: 10.1002/bjs.1800600817

7. Child CG, Turcotte JG. Surgery and portal hypertension. In: *The liver and portal hypertension*. Philadelphia: WB Saunders Co; 1964:50-64.

### OPTN/UNOS References

8. Organ Procurement and Transplantation Network (OPTN). MELD/PELD Calculator. https://optn.transplant.hrsa.gov/

### Platform References

9. LiverTracker. https://livertracker.com. DOI: 10.5281/zenodo.18934364

---

## Appendix B: Model Recommendation for Cursor

### Which AI Model to Use in Cursor

**For architectural scaffolding, complex components, and the calculation engine:**
Use **Claude Opus 4.6** — it handles complex multi-file reasoning, respects detailed specifications, and produces more architecturally sound code when given a long context document like this one. Use it for:
- Initial project setup and folder structure
- The entire calculation engine (packages/clinical-scores/)
- Complex UI components (ScoreRing, ComponentBreakdown)
- The REST API endpoint handlers
- The MCP server protocol implementation
- Test suite generation from validation CSVs

**For iterative UI tweaks, simple edits, and repetitive tasks:**
Use **Claude Sonnet 4.6** — it's faster and cheaper for tasks where the context is already established. Use it for:
- Styling adjustments (colors, spacing, fonts)
- Adding new similar components after the pattern is set
- Writing additional test cases
- Documentation and README content
- Small bug fixes and refactors
- Generating the OpenAPI spec from existing endpoints

**Practical workflow:**
1. Start each phase with Opus 4.6 to set up the architecture and core logic
2. Switch to Sonnet 4.6 for iteration, polish, and repetitive tasks
3. Switch back to Opus for any new complex feature or when you're stuck

---

*This context document is version 1.0. Update it as decisions are made and phases are completed.*
