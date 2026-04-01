# Contributing to LiverTracker Clinical Scores

Thank you for your interest in contributing! This project welcomes contributions from clinicians, researchers, and developers.

## Types of Contributions

### 1. New Scoring Systems

We welcome implementations of additional liver disease scoring systems. Suggested additions:
- **FIB-4** — Fibrosis-4 index for liver fibrosis assessment
- **APRI** — AST-to-Platelet Ratio Index
- **SAAG** — Serum-Ascites Albumin Gradient
- **NFS** — NAFLD Fibrosis Score
- **Lille Score** — Alcoholic hepatitis treatment response
- **Maddrey's Discriminant Function** — Alcoholic hepatitis severity

**To add a new scoring system:**

1. Create `packages/clinical-scores/src/<scoreName>.ts` with the calculation function
2. Add TypeScript interfaces to `packages/clinical-scores/src/types.ts`
3. Add constants and references to `packages/clinical-scores/src/constants.ts`
4. Export from `packages/clinical-scores/src/index.ts`
5. Add test cases to `packages/clinical-scores/__tests__/<scoreName>.test.ts`
6. Add validation CSV to `validation/test-cases/<score-name>-cases.csv`
7. Document the formula in `docs/FORMULAS.md`
8. Update the README

### 2. Validation Test Cases

We invite clinicians to contribute anonymized test cases to improve validation coverage.

**CSV Format:**
```csv
case_id,bilirubin,creatinine,inr,on_dialysis,expected_score,source
M031,2.1,1.4,1.6,false,19,"De-identified clinical case"
```

**Requirements:**
- Values must be fully de-identified (no patient identifiers)
- Expected score must be computed from the published formula
- Include a source note (e.g., "De-identified clinical case", "Published case report")
- Submit via pull request to `validation/test-cases/`

### 3. Bug Reports & Formula Corrections

If you find a discrepancy between our implementation and the published formula, please open a GitHub issue with:
- The specific input values
- Your expected output
- The reference source (paper, calculator, etc.)
- The output our implementation produces

### 4. Translations & Localizations

The iOS app currently supports English only. To add a new language:
1. Create `apps/mobile/locales/<language-code>.json`
2. Follow the existing string structure
3. Update the app to use the localization strings

## Credit

- Contributors are listed in CHANGELOG.md
- Substantial contributors may be invited as co-authors on future papers
- All contributions are acknowledged in the README

## Code Standards

- TypeScript strict mode
- All functions must return structured result objects (not raw numbers)
- Every result must include `references` and `citationInfo` fields
- Tests must pass 100% before merge
- No external dependencies in the core calculation engine

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/fib4-score`)
3. Write tests first (TDD preferred)
4. Implement the feature
5. Run `npm test` — all tests must pass
6. Submit a pull request with a clear description

## Questions?

Open a GitHub issue or contact Dr. Jyotsna Priyam via [livertracker.com](https://livertracker.com).
