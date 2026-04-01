# Validation Dataset

This directory contains curated test cases for all four scoring systems implemented in LiverTracker.

## Purpose

1. **Automated testing** — All implementations (TypeScript, Python, R) must pass 100% of these cases
2. **Cross-validation** — Cases verified against published formulas and reference implementations
3. **Reproducibility** — Published as supplementary data with the journal paper
4. **Community contribution** — Clinicians can submit additional anonymized test cases

## Files

| File | Cases | Description |
|------|-------|-------------|
| `meld-cases.csv` | 30 | MELD original formula |
| `meld-na-cases.csv` | 25 | MELD-Na formula |
| `meld3-cases.csv` | 25 | MELD 3.0 formula (Kim 2021) |
| `child-pugh-cases.csv` | 20 | Child-Pugh scoring |

## Methodology

### Value Clamping (Applied Before Calculation)

**MELD & MELD-Na:**
- Bilirubin: min 1.0 mg/dL
- Creatinine: min 1.0, max 4.0 mg/dL; set to 4.0 if on dialysis
- INR: min 1.0
- Sodium (MELD-Na): bounded 125–137 mEq/L

**MELD 3.0:**
- Same as above, except creatinine max is **3.0** (not 4.0); set to 3.0 if on dialysis
- Albumin: bounded 1.5–3.5 g/dL

**Child-Pugh:**
- No clamping — point values determined by clinical thresholds

### Score Boundaries

- MELD, MELD-Na, MELD 3.0: Rounded to nearest integer, bounded 6–40
- Child-Pugh: Integer sum, bounded 5–15

### Formula Sources

- **MELD**: Kamath PS et al. Hepatology. 2001. DOI: 10.1053/jhep.2001.22172
- **MELD-Na**: Kim WR et al. N Engl J Med. 2008. DOI: 10.1056/NEJMoa0801209
- **MELD 3.0**: Kim WR et al. Gastroenterology. 2021. DOI: 10.1053/j.gastro.2021.08.050
- **Child-Pugh**: Pugh RN et al. Br J Surg. 1973. DOI: 10.1002/bjs.1800600817

## Important Note on Expected Values

The expected scores in these CSVs are computed directly from the published formulas above. They may differ from:
- The original spec document (which contained formula errors)
- MDCalc or other online calculators (which may use different rounding or formula variants)

The formulas implemented here are verified against the original publications.

## Contributing Test Cases

To contribute additional test cases, please follow the CSV format and include:
1. The input values
2. The expected score (computed by hand from the formula)
3. A source note (e.g., "De-identified clinical case", "Published case report", "Formula boundary test")

Submit via GitHub pull request. See CONTRIBUTING.md for details.
