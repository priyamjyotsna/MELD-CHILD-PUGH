# MELD · Child-Pugh · Liver clinical tools

**Repository:** [github.com/priyamjyotsna/MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH)

Open-source monorepo for **liver disease assessment**: validated calculators for transplant severity scoring (MELD family, Child-Pugh), rule-based **liver enzyme** interpretation (including injury pattern and De Ritis–style ratios), and **FibroScan**-style staging from liver stiffness and CAP (steatosis). The same logic ships in a TypeScript **npm package** and an **iOS** app built with **Expo** (store-facing name: **MELD family scores**).

> **Disclaimer.** This software is for education and clinical decision support only. It does not replace professional judgment, laboratory validation, or institutional protocols. Not a medical device classification statement—see the in-app disclaimer.

---

## What’s in this repo

| Layer | Path | Role |
|--------|------|------|
| **Core library** | [`packages/clinical-scores`](packages/clinical-scores) | Pure TypeScript: `calculateMeld`, `calculateMeldNa`, `calculateMeld3`, `calculateChildPugh`, `checkLiverEnzymes`, `interpretFibroScan`, plus types, constants, and peer-reviewed citations. |
| **iOS app** | [`apps/mobile`](apps/mobile) | Expo Router UI: four tools (MELD, Child-Pugh, FibroScan interpreter, liver enzyme checker), share sheets, references, and medical disclaimers. |
| **Validation data** | [`validation/test-cases`](validation/test-cases) | CSV + Jest suites for regression testing and cross-checks. |
| **Formulas & rules** | [`docs/FORMULAS.md`](docs/FORMULAS.md) | Documented equations, clamps, and interpretation thresholds. |

---

## Clinical tools (at a glance)

1. **MELD family** — Original MELD, MELD-Na, and **MELD 3.0** (including albumin and sex per Kim et al., *Gastroenterology* 2021).
2. **Child-Pugh** — Classic five-parameter score and class **A / B / C** for cirrhosis severity.
3. **Liver enzyme checker** — ALT, AST, GGT, ALP, total bilirubin: normal vs elevated, **hepatocellular / cholestatic / mixed** pattern (R-ratio rules), AST/ALT commentary, plain-language recommendations.
4. **FibroScan interpreter** — Liver stiffness (**kPa**) → fibrosis stage bands (**F0–F4**); optional CAP (**dB/m**) → steatosis grades (**S0–S3**) with cited cutoffs.

Implementation details and references live in **FORMULAS.md** and in-code constants.

---

## Quick start

### Clone

```bash
git clone https://github.com/priyamjyotsna/MELD-CHILD-PUGH.git
cd MELD-CHILD-PUGH
```

### npm package (library)

```bash
npm install
cd packages/clinical-scores
npm run build   # produces dist/
npm test
```

Local consumers can depend on the workspace name `@livertracker/clinical-scores` (see root `package.json` workspaces).

```typescript
import {
  calculateMeld,
  calculateMeldNa,
  calculateMeld3,
  calculateChildPugh,
  checkLiverEnzymes,
  interpretFibroScan,
} from '@livertracker/clinical-scores';

const meldNa = calculateMeldNa({
  bilirubin: 2.0,
  creatinine: 1.2,
  inr: 1.4,
  sodium: 132,
  onDialysis: false,
});

const enzymes = checkLiverEnzymes({ alt: 120, ast: 90, alp: 200, ggt: 65, bilirubin: 1.0 });

const fibro = interpretFibroScan({ liverStiffnessKpa: 10.2, capDbPerM: 280 });
```

### iOS app (Expo)

```bash
cd apps/mobile
npm install
npx expo start --ios
```

Production builds use [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json` in `apps/mobile`). App identifiers and EAS project slug are configured in `apps/mobile/app.json`.

---

## Testing & validation

- **Unit tests:** `packages/clinical-scores/__tests__/*.test.ts` (Jest).
- **Shared fixtures:** `validation/test-cases/*.csv` aligned with expected outputs.

From repo root:

```bash
npm test
```

---

## Ecosystem

This repo is the **reference implementation** for calculators also promoted under the **LiverTracker** umbrella ([livertracker.com](https://livertracker.com)). Related deliverables (public REST API, Python/R bindings, MCP server) may live in separate repos or releases as the ecosystem grows—this monorepo is the source of truth for the shared TypeScript engine and the **MELD family scores** mobile app.

---

## How to cite

If you use this software in research, please cite it (update the DOI when Zenodo/GitHub release is minted):

**BibTeX:**

```bibtex
@software{meld_child_pugh_2026,
  author    = {Priyam, Jyotsna},
  title     = {MELD-CHILD-PUGH: Liver clinical scores and LiverTracker tools},
  year      = {2026},
  url       = {https://github.com/priyamjyotsna/MELD-CHILD-PUGH},
  license   = {MIT}
}
```

See also [CITATION.cff](CITATION.cff).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Suggestions welcome for new scores, validation cases, localization, and documentation—especially formula citations and boundary-case tests.

---

## License

**MIT** — see [LICENSE](LICENSE).

---

## Attribution

**Dr. Jyotsna Priyam** — [livertracker.com](https://livertracker.com) · [github.com/priyamjyotsna/MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH)
