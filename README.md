# MELD · Child-Pugh · Liver clinical tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CFF citation](https://img.shields.io/badge/Citation-CITATION.cff-1a7f37)](CITATION.cff)

**Repository:** [github.com/priyamjyotsna/MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH)

Open-source monorepo for **liver disease assessment**: validated calculators for transplant severity scoring (MELD family, Child-Pugh), rule-based **liver enzyme** interpretation (including injury pattern and De Ritis–style ratios), and **FibroScan**-style staging from liver stiffness and CAP (steatosis). The same logic ships in a TypeScript **npm package** and an **iOS** app built with **Expo** (store-facing name: **MELD family scores**).

> **Disclaimer.** This software is for education and clinical decision support only. It does not replace professional judgment, laboratory validation, or institutional protocols. Not a medical device classification statement—see the in-app disclaimer.

---

## What’s in this repo

| Layer | Path | Role |
|--------|------|------|
| **Core library** | [`packages/clinical-scores`](packages/clinical-scores) | Pure TypeScript: `calculateMeld`, `calculateMeldNa`, `calculateMeld3`, `calculateChildPugh`, `checkLiverEnzymes`, `interpretFibroScan`, plus types, constants, and peer-reviewed citations. |
| **iOS app** | [`apps/mobile`](apps/mobile) | Expo Router UI: four tools (MELD, Child-Pugh, FibroScan interpreter, liver enzyme checker), share sheets, references, and medical disclaimers. |
| **HTTP API** | [`apps/api`](apps/api) | Hono + Vercel serverless: `/api/v1/*` calculators (deploy to **meldapi.livertracker.com** or `*.vercel.app`). |
| **Validation data** | [`validation/test-cases`](validation/test-cases) | CSV + Jest suites for regression testing and cross-checks. |
| **Formulas & rules** | [`docs/FORMULAS.md`](docs/FORMULAS.md) | Documented equations, clamps, and interpretation thresholds. |
| **Citing & DOIs** | [`docs/CITATION.md`](docs/CITATION.md) | How to cite, use GitHub’s cite button, and archive on Zenodo for a persistent DOI. |
| **CI (optional)** | [`docs/github-actions-ci.example.yml`](docs/github-actions-ci.example.yml) | Example GitHub Actions workflow for library build + tests (copy to `.github/workflows/ci.yml`). |
| **Security** | [`SECURITY.md`](SECURITY.md) | How to report sensitive issues responsibly. |

---

## Clinical tools (at a glance)

1. **MELD family** — Original MELD, MELD-Na, and **MELD 3.0** (including albumin and sex per Kim et al., *Gastroenterology* 2021).
2. **Child-Pugh** — Classic five-parameter score and class **A / B / C** for cirrhosis severity.
3. **Liver enzyme checker** — ALT, AST, GGT, ALP, total bilirubin: normal vs elevated, **hepatocellular / cholestatic / mixed** pattern (R-ratio rules), AST/ALT commentary, plain-language recommendations.
4. **FibroScan interpreter** — Liver stiffness (**kPa**) → fibrosis stage bands (**F0–F4**); optional CAP (**dB/m**) → steatosis grades (**S0–S3**) with cited cutoffs.

Implementation details and references live in **FORMULAS.md** and in-code constants.

### OSF registrations (per tool)

Each clinical module has its own **[Open Science Framework](https://osf.io)** DOI for transparent, citable registration:

| Tool | OSF DOI |
|------|---------|
| MELD (incl. MELD-Na, MELD 3.0) | [10.17605/OSF.IO/WAM6K](https://doi.org/10.17605/OSF.IO/WAM6K) |
| Child-Pugh | [10.17605/OSF.IO/XJWA8](https://doi.org/10.17605/OSF.IO/XJWA8) |
| FibroScan interpreter | [10.17605/OSF.IO/CSBWN](https://doi.org/10.17605/OSF.IO/CSBWN) |
| Liver enzyme checker | [10.17605/OSF.IO/3XEWC](https://doi.org/10.17605/OSF.IO/3XEWC) |

These are also listed in [`CITATION.cff`](CITATION.cff) under `references` and in the npm package as `OSF_LIVERTRACKER_TOOL_REGISTRATIONS`.

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

const fibro = interpretFibroScan({ liverStiffness: 10.2, capScore: 280 });
```

### iOS app (Expo)

```bash
cd apps/mobile
npm install
npx expo start --ios
```

Production builds use [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json` in `apps/mobile`). App identifiers and EAS project slug are configured in `apps/mobile/app.json`.

### HTTP API (Vercel)

```bash
npm ci
npm run build -w @livertracker/clinical-scores
cd apps/api
npm run dev
```

- Defaults to `http://127.0.0.1:8787/api/v1/health`
- **Deploy:** connect the **whole repo** to Vercel and leave **Root Directory empty** (repository root). Config lives in [`vercel.json`](vercel.json); serverless entry is [`api/[[...path]].ts`](api/[[...path]].ts). Then attach **`meldapi.livertracker.com`** if you want.

Details: [`apps/api/README.md`](apps/api/README.md).

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

## Discovery & reproducibility (for papers and grants)

- **OSF / per-tool DOI:** When you publish about *one* tool (e.g. only MELD), cite the **matching OSF DOI** in the table above in addition to this repo. See [`docs/CITATION.md`](docs/CITATION.md).
- **GitHub citation:** The repo root [`CITATION.cff`](CITATION.cff) powers GitHub’s **“Cite this repository”** sidebar entry (standard APA/BibTeX export).
- **Version pinning:** In methods sections, record a **release tag** or **commit SHA** and the app **build** (see `apps/mobile/app.json` `version` / iOS `buildNumber`).
- **Archival DOI:** When you publish, create a **GitHub Release** and connect the repo to **[Zenodo](https://zenodo.org)** so each release gets a citable DOI; then add that DOI to `CITATION.cff` (step-by-step in [`docs/CITATION.md`](docs/CITATION.md)).
- **Clinical references:** Cite **original score papers** (DOIs in [`docs/FORMULAS.md`](docs/FORMULAS.md)) as well as this software.

---

## How to cite

If you use this software in research, please cite the repository. After you mint a Zenodo DOI, add it to `CITATION.cff` and mention it here:

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

See also [CITATION.cff](CITATION.cff) and the full guide [docs/CITATION.md](docs/CITATION.md).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Suggestions welcome for new scores, validation cases, localization, and documentation—especially formula citations and boundary-case tests.

---

## License

**MIT** — see [LICENSE](LICENSE).

---

## Attribution

**Dr. Jyotsna Priyam** — [livertracker.com](https://livertracker.com) · [github.com/priyamjyotsna/MELD-CHILD-PUGH](https://github.com/priyamjyotsna/MELD-CHILD-PUGH)
