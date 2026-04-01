# Clinical Scoring Formulas

This document contains the complete mathematical formulas for all scoring systems implemented in LiverTracker.

---

## MELD (Model for End-Stage Liver Disease)

**Reference:** Kamath PS, Wiesner RH, Malinchoc M, et al. A model to predict survival in patients with end-stage liver disease. *Hepatology*. 2001;33(2):464-470. DOI: [10.1053/jhep.2001.22172](https://doi.org/10.1053/jhep.2001.22172)

### Value Clamping (applied before calculation)

| Variable | Rule |
|----------|------|
| Bilirubin | if < 1.0, set to 1.0 |
| Creatinine | if < 1.0, set to 1.0; if > 4.0, set to 4.0 |
| INR | if < 1.0, set to 1.0 |
| Dialysis | if on dialysis (≥2 sessions/week), set creatinine to 4.0 |

### Formula

```
MELD = 10 × (0.957 × ln(Creatinine) + 0.378 × ln(Bilirubin) + 1.12 × ln(INR) + 0.643)
```

### Post-calculation

Round to nearest integer. If result < 6, set to 6. If result > 40, set to 40.

### Score Interpretation

| Score | Severity | 3-Month Mortality |
|-------|----------|-------------------|
| 6–9 | Minimal | ~1.9% |
| 10–19 | Moderate | ~6.0% |
| 20–29 | Severe | ~19.6% |
| 30–40 | Very Severe | ~52.6% |

---

## MELD-Na

**Reference:** Kim WR, Biggins SW, Kremers WK, et al. Hyponatremia and mortality among patients on the liver-transplant waiting list. *N Engl J Med*. 2008;359(10):1018-1026. DOI: [10.1056/NEJMoa0801209](https://doi.org/10.1056/NEJMoa0801209)

### Value Clamping

Same as MELD, plus:

| Variable | Rule |
|----------|------|
| Sodium | if < 125, set to 125; if > 137, set to 137 |

### Formula

```
Step 1: Calculate standard MELD score (call it MELD_i)

Step 2: MELD-Na = MELD_i + 1.32 × (137 − Sodium) − (0.033 × MELD_i × (137 − Sodium))
```

When sodium ≥ 137, the sodium difference = 0, so MELD-Na = MELD.

### Post-calculation

Round to nearest integer. Bounded 6–40.

---

## MELD 3.0

**Reference:** Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. *Gastroenterology*. 2021;161(6):1887-1895.e4. DOI: [10.1053/j.gastro.2021.08.050](https://doi.org/10.1053/j.gastro.2021.08.050)

**Note:** Adopted by OPTN for liver transplant allocation in the United States beginning in 2023.

### Value Clamping

| Variable | Rule |
|----------|------|
| Bilirubin | if < 1.0, set to 1.0 |
| Creatinine | if < 1.0, set to 1.0; if > **3.0**, set to **3.0** (note: 3.0 cap, not 4.0) |
| INR | if < 1.0, set to 1.0 |
| Sodium | if < 125, set to 125; if > 137, set to 137 |
| Albumin | if < 1.5, set to 1.5; if > 3.5, set to 3.5 |
| Dialysis | if on dialysis, set creatinine to **3.0** |

### Formula

```
MELD 3.0 = round(
  1.33 × (Female)
  + 4.56 × ln(Bilirubin)
  + 0.82 × (137 − Sodium)  −  0.24 × (137 − Sodium) × ln(Bilirubin)
  + 9.09 × ln(INR)
  + 11.14 × ln(Creatinine)
  + 1.85 × (3.5 − Albumin)  −  1.83 × (3.5 − Albumin) × ln(Creatinine)
  + 6
)
```

Where **Female = 1** for female patients (sex assigned at birth), **Female = 0** for male patients.

The 1.33-point sex adjustment addresses the documented disparity in transplant access for female patients.

### Post-calculation

Round to nearest integer. Bounded 6–40.

---

## Child-Pugh Score

**Reference:** Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. *Br J Surg*. 1973;60(8):646-649. DOI: [10.1002/bjs.1800600817](https://doi.org/10.1002/bjs.1800600817)

### Point Scoring Table

| Component | 1 Point | 2 Points | 3 Points |
|-----------|---------|----------|----------|
| Bilirubin (mg/dL) | < 2 | 2–3 | > 3 |
| Albumin (g/dL) | **> 3.5** | 2.8–3.5 | < 2.8 |
| INR | < 1.7 | 1.7–2.3 | > 2.3 |
| Ascites | None | Mild | Moderate–Severe |
| Encephalopathy | None | Grade 1–2 | Grade 3–4 |

**Note on albumin boundary:** Albumin exactly 3.5 scores **2 points** (not 1 point), because the 1-point threshold is strictly `> 3.5`.

### Classification

| Total Score | Class | Label | 1-Year Survival | 2-Year Survival | Perioperative Mortality |
|-------------|-------|-------|-----------------|-----------------|-------------------------|
| 5–6 | A | Compensated | ~100% | ~85% | ~10% |
| 7–9 | B | Significant Compromise | ~80% | ~60% | ~30% |
| 10–15 | C | Decompensated | ~45% | ~35% | ~70–80% |

---

## Implementation Notes

All formulas use natural logarithm (`ln` = `Math.log` in JavaScript/TypeScript).

The MELD 3.0 formula above is the exact published formula from Kim et al. 2021. Some online sources describe a different algebraic form — if you encounter discrepancies, the formula above (verified against the original paper and the UW Hepatitis C Online calculator) is authoritative.
