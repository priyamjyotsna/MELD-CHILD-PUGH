# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-XX-XX

### Added

- `@livertracker/clinical-scores` npm package with MELD, MELD-Na, MELD 3.0, and Child-Pugh calculators
- Full TypeScript interfaces for all inputs, outputs, and clinical context
- 100 curated validation test cases across all four scoring systems
- iOS app (Expo/React Native) with:
  - MELD calculator with MELD / MELD-Na / MELD 3.0 tab switcher
  - Child-Pugh calculator
  - Rich results presentation with 7-layer information hierarchy
  - Animated score ring (800ms ease-out)
  - Component breakdown with animated bars
  - Clinical context cards with mortality/survival statistics
  - Share with Doctor functionality (iOS share sheet)
  - First-launch medical disclaimer modal
  - About screen with full references and formulas
- Medical disclaimer (App Store compliant)
- Full citation infrastructure (CITATION.cff, Zenodo integration)
- MIT license

### Formula Notes

- MELD 3.0 formula implemented per Kim et al., Gastroenterology 2021 (DOI: 10.1053/j.gastro.2021.08.050)
- Note: The MELD 3.0 formula in this implementation differs from some online descriptions — it uses the exact published coefficients from the original paper
- All formulas verified against original publications

### Contributors

- Dr. Jyotsna Priyam — Clinical lead, researcher, creator
