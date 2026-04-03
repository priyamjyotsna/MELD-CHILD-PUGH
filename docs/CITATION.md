# Citing & archiving this project

This page summarizes how to **credit the software**, improve **discoverability**, and obtain a **persistent DOI** (recommended for grants, papers, and Zenodo).

## 1. GitHub “Cite this repository”

GitHub reads [`CITATION.cff`](../CITATION.cff) at the repo root and shows **Cite this repository** in the sidebar. That produces standard formats (e.g. APA, BibTeX) from the metadata we maintain there.

**Action for maintainers:** Keep `CITATION.cff` in sync with the real `title`, `version`, `date-released`, and `repository-code` URL whenever you tag a release.

## 2. Citing the code in a paper (before a Zenodo DOI)

Use the software citation pattern your publisher requires. A minimal example:

```bibtex
@software{meld_child_pugh_2026,
  author       = {Priyam, Jyotsna},
  title        = {{MELD-CHILD-PUGH}: Liver clinical scores},
  year         = {2026},
  url          = {https://github.com/priyamjyotsna/MELD-CHILD-PUGH},
  version      = {1.0.0},
  note         = {TypeScript library and iOS app; see repository for version}
}
```

Always mention the **commit SHA** or **release tag** you used so others can reproduce your analysis (e.g. “we used commit `78dc7a9`” or “release `v1.0.0`”).

### 2b. OSF registrations (one DOI per clinical module)

LiverTracker registers each tool on **[OSF](https://osf.io)** with its own DOI. When your manuscript focuses on a single module, cite **that** DOI (and still cite the GitHub monorepo or Zenodo archive if you used the full codebase):

| Module | Title (short) | DOI |
|--------|-----------------|-----|
| MELD family | MELD Score Calculator — MELD, MELD-Na, MELD 3.0 | [10.17605/OSF.IO/WAM6K](https://doi.org/10.17605/OSF.IO/WAM6K) |
| Child-Pugh | Child-Pugh Score Calculator | [10.17605/OSF.IO/XJWA8](https://doi.org/10.17605/OSF.IO/XJWA8) |
| FibroScan | FibroScan Score Interpreter — stiffness & CAP | [10.17605/OSF.IO/CSBWN](https://doi.org/10.17605/OSF.IO/CSBWN) |
| Liver enzymes | Liver Enzyme Checker — ALT, AST, GGT, ALP, Bilirubin | [10.17605/OSF.IO/3XEWC](https://doi.org/10.17605/OSF.IO/3XEWC) |

In TypeScript, the same list is exported as `OSF_LIVERTRACKER_TOOL_REGISTRATIONS` from `@livertracker/clinical-scores`, and each calculator result’s `citationInfo` includes the matching `osfRegistration` where applicable.

## 3. Getting a DOI with Zenodo (recommended)

1. Link your GitHub account to [Zenodo](https://zenodo.org) and **enable** the `priyamjyotsna/MELD-CHILD-PUGH` repository.
2. Create a **[GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)** (e.g. `v1.0.0`). Zenodo can mint an archival record and **DOI** automatically.
3. Copy the DOI into `CITATION.cff` under `identifiers: - type: doi value: "10.5281/zenodo....."` and add the DOI badge to the main README.

This gives reviewers and readers a **frozen archive** separate from day-to-day `main` branch edits.

## 4. Citing underlying clinical literature

Scores and cutoffs in this repo trace to **original papers** (DOIs in code and in [`FORMULAS.md`](FORMULAS.md)). In manuscripts you should cite those **primary sources** in addition to (not instead of) this software, whenever you report clinical interpretation.

## 5. Continuous integration (trust + reproducibility)

A ready-made workflow that runs `npm ci`, builds `@livertracker/clinical-scores`, and runs Jest is in [`github-actions-ci.example.yml`](github-actions-ci.example.yml). Copy it to `.github/workflows/ci.yml`. If `git push` is refused for workflow files, use a token with the **`workflow`** scope or add the file via the GitHub website.

## 6. Validation data

Anonymized CSV fixtures live under [`validation/test-cases/`](../validation/test-cases/). If you republish or extend them, cite this repository (and Zenodo DOI once available) and describe any changes to the test methodology.
