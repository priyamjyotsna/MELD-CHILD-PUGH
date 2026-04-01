# LiverTracker Clinical Scores

> Open-source, validated MELD, MELD-Na, MELD 3.0, and Child-Pugh liver disease severity scoring.
> iOS app · npm package · REST API · Python/R libraries · MCP server.

---

## How to Cite

If you use this software in your research, please cite it as:

**BibTeX:**
```bibtex
@software{livertracker2026,
  author    = {Priyam, Jyotsna},
  title     = {LiverTracker Clinical Scores},
  year      = {2026},
  doi       = {10.5281/zenodo.XXXXXXX},
  url       = {https://livertracker.com},
  license   = {MIT}
}
```

**APA:**
> Priyam, J. (2026). *LiverTracker Clinical Scores* (v1.0.0). DOI: 10.5281/zenodo.XXXXXXX

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

See [CITATION.cff](CITATION.cff) for the full citation metadata.

---

## Scoring Systems

| Score | Description | Reference |
|-------|-------------|-----------|
| **MELD** | Model for End-Stage Liver Disease — 3-month mortality prediction | Kamath et al., Hepatology 2001 |
| **MELD-Na** | MELD + serum sodium — improved accuracy in hyponatremia | Kim et al., NEJM 2008 |
| **MELD 3.0** | Current OPTN standard (2023+) — adds albumin and sex | Kim et al., Gastroenterology 2021 |
| **Child-Pugh** | Cirrhosis classification (Class A/B/C) — surgical risk | Pugh et al., Br J Surg 1973 |

---

## npm Package

```bash
npm install @livertracker/clinical-scores
```

```typescript
import { calculateMeld, calculateMeldNa, calculateMeld3, calculateChildPugh } from '@livertracker/clinical-scores';

// MELD
const meld = calculateMeld({ bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false });
console.log(meld.score);                          // 21
console.log(meld.clinicalContext.severityLabel);  // "Severe"
console.log(meld.references[0].doi);              // "10.1053/jhep.2001.22172"

// MELD 3.0
const meld3 = calculateMeld3({
  bilirubin: 3.5, creatinine: 1.8, inr: 1.5, onDialysis: false,
  sodium: 131, albumin: 2.8, sex: 'female'
});
console.log(meld3.score); // 27

// Child-Pugh
const cp = calculateChildPugh({
  bilirubin: 2.5, albumin: 3.0, inr: 2.0,
  ascites: 'mild', encephalopathy: 'grade_1_2'
});
console.log(cp.classification); // "C"
```

---

## iOS App

```bash
git clone https://github.com/livertracker/clinical-scores
cd livertracker-clinical-scores/apps/mobile
npm install
npx expo start --ios
```

---

## REST API

```
https://api.livertracker.com/v1
```

```bash
curl -X POST https://api.livertracker.com/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"bilirubin": 3.5, "creatinine": 1.8, "inr": 1.5, "sodium": 131, "albumin": 2.8, "sex": "female", "onDialysis": false}'
```

See full documentation at [api.livertracker.com/docs](https://api.livertracker.com/docs).

---

## Python Package

```bash
pip install livertracker
```

```python
from livertracker import calculate_meld

result = calculate_meld(bilirubin=3.5, creatinine=1.8, inr=1.5, on_dialysis=False)
print(result.score)  # 21
```

---

## R Package

```r
install.packages("livertracker")
library(livertracker)

result <- calculate_meld(bilirubin=3.5, creatinine=1.8, inr=1.5, on_dialysis=FALSE)
result$score  # 21

citation("livertracker")
```

---

## Validation

All implementations are tested against [100 curated test cases](validation/test-cases/) covering:
- Normal and boundary values
- Clamping edge cases
- Male/female pairs (MELD 3.0)
- Dialysis patients
- All Child-Pugh classification boundaries

See [validation/README.md](validation/README.md) for methodology.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We welcome:
- New scoring systems (FIB-4, APRI, Lille Score, Maddrey's DF, etc.)
- Additional validation test cases
- Translations/localizations
- Bug reports and formula corrections

---

## License

MIT — see [LICENSE](LICENSE).

---

## Attribution

Created by **Dr. Jyotsna Priyam** · [livertracker.com](https://livertracker.com)
